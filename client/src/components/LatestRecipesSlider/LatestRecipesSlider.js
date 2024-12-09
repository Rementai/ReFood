import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader';
import './LatestRecipesSlider.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const LatestRecipesSlider = () => {
    const [recipes, setRecipes] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/recipes/latest')
            .then(response => {
                setRecipes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching latest recipes:", error);
                setLoading(false);
            });
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
    };

    const handleMouseDown = () => setIsDragging(false);
    const handleMouseMove = () => setIsDragging(true);
    const handleClick = (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="latest-recipes-slider">
            <h2>Latest Recipes</h2>
            <Slider {...settings}>
                {recipes.map((recipe, index) => (
                    <div key={recipe.id || index} className="latest-recipe-slide">
                        <Link
                            to={`/recipes/${recipe.recipe_id}`}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onClick={handleClick}
                        >
                            <div className="latest-image-container">
                                <img src={recipe.image} alt={recipe.title} className="latest-recipe-image" />
                                <div className="latest-overlay">
                                    <h3>{recipe.title}</h3>
                                    <p>{parseInt(recipe.prep_time) + parseInt(recipe.cook_time)} minutes</p>
                                    <p>{recipe.difficulty}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default LatestRecipesSlider;
