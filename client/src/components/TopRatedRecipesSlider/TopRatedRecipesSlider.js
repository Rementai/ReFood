import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import './TopRatedRecipesSlider.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const TopRatedRecipesSlider = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/recipes/top-rated')
            .then(response => setRecipes(response.data))
            .catch(error => console.error("Error fetching top-rated recipes:", error));
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
    };

    return (
        <div className="top-rated-recipes-slider">
            <Slider {...settings}>
                {recipes.map((recipe) => (
                    <div key={recipe.recipe_id} className="recipe-slide">
                        <div className="image-container">
                            <img src={recipe.image} alt={recipe.title} className="recipe-image"/>
                            <div className="overlay">
                                <h3>{recipe.title}</h3>
                                <p>{parseInt(recipe.prep_time) + parseInt(recipe.cook_time)} minutes</p>
                                <p>{recipe.difficulty}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default TopRatedRecipesSlider;
