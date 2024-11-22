import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css'

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  function RecipeCard({ recipe }) {
    return (
      <div className="recipe-card">
        <Link to={`/recipes/${recipe.recipe_id}`} className="recipe-card-link">
        <img src={recipe.image} alt={recipe.title} className="recipe-card__image" />
        <div className="recipe-card__content">
          <h2>{truncateText(recipe.title, 26)}</h2>
          <p>{truncateText(recipe.description, 70)}</p>
          <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
          <p><strong>Prep Time:</strong> {recipe.prep_time} mins</p>
          <p><strong>Cook Time:</strong> {recipe.cook_time} mins</p>
          <p><strong>Rating:</strong> {recipe.average_rating || 'N/A'}</p>
        </div>
        </Link>
      </div>
    );
  }

export default RecipeCard;
