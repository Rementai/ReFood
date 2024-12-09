import React, { useState, useEffect } from "react";
import { FaClock, FaSignal, FaMinus, FaPlus, FaRegFilePdf } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import './RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(1);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8080/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'red';
      default:
        return 'gray';
    }
  };

  const splitInstructions = (instructions) => {
    return instructions
      .split(/([.!?])/)
      .filter(Boolean)
      .map((sentence, index, array) => {
        if (index % 2 === 1) {
          array[index - 1] += sentence;
          return null;
        }
        return sentence.trim();
      })
      .filter(Boolean)
      .map((sentence) => {
        return `● ${sentence}`;
      });
  };

  const changeServings = (amount) => {
    if (servings + amount >= 1 && servings + amount <= 6) {
      setServings(servings + amount);
    }
  };

  const downloadShoppingList = async (id, servings) => {
    try {
      const response = await fetch(
        `http://localhost:8080/recipes/shopping-list/${id}?servings=${servings}`,
        {
          method: 'GET',
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to generate shopping list.");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shopping_list_recipe_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="recipe-details">
      <div className="recipe-header">
        <div className="recipe-details-image">
          <img src={recipe.image} alt={recipe.title} />
        </div>
        <div className="recipe-info">
          <h1>{recipe.title}</h1>
          <p className="recipe-description">{recipe.description}</p>
          <div className="recipe-times">
            <div className="time-item">
              <FaClock /> Prep: {recipe.prep_time} min
            </div>
            <div className="time-item">
              Cook: {recipe.cook_time} min
            </div>
          </div>
          <div className="recipe-difficulty">
            <FaSignal style={{ color: getDifficultyColor(recipe.difficulty) }} />
            {recipe.difficulty}
          </div>
        </div>
      </div>

      <div className="recipe-body">
        <div className="recipe-instructions">
          <div className="instructions-header">
          <h2>Instructions</h2>
          </div>
          {splitInstructions(recipe.instructions).map((sentence, index) => (
            <p key={index}>{sentence}</p>
          ))}
        </div>

        <div className="recipe-ingredients">
        <h2>Ingredients</h2>
        <div className="servings-control">
          <span>{servings} servings</span>
          <button onClick={() => changeServings(-1)}><FaMinus /></button>
          <button onClick={() => changeServings(1)}><FaPlus /></button>
        </div>
        <div className="ingredients-section">
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <span className="ingredient-name">{ingredient.name}</span>
                <span className="ingredient-quantity">
                  {ingredient.quantity * servings} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => downloadShoppingList(recipe.id, servings)}
          className="generate-pdf-btn"
        >
          <FaRegFilePdf /> Generate shopping list
        </button>
      </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
