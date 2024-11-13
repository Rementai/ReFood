import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import './LatestRecipesSlider.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const LatestRecipesSlider = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/recipes/latest')
            .then(response => setRecipes(response.data))
            .catch(error => console.error("Error fetching latest recipes:", error));
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
    };

    return (
        <div className="latest-recipes-slider">
            <h2>Latest Recipes</h2>
            <Slider {...settings}>
                {recipes.map((recipe, index) => (
                <div key={recipe.id || index} className="latest-recipe-slide">
                    <div className="latest-image-container">
                        <img src={recipe.image} alt={recipe.title} className="latest-recipe-image"/>
                            <div className="latest-overlay">
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

export default LatestRecipesSlider;
