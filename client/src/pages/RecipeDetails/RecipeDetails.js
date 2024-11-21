import React, { useState, useEffect } from "react";
import { FaClock, FaSignal, FaMinus, FaPlus } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import './RecipeDetails.css'

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(1); // Domyślnie ustawiamy 1 porcję

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

  if (loading) return <p>Loading...</p>;
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

  // Funkcja do zmiany liczby porcji
  const changeServings = (amount) => {
    if (servings + amount >= 1 && servings + amount <= 6) {
      setServings(servings + amount);
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
          <div className="ingredients-header">
            <h2>Ingredients</h2>
            <div className="servings-control">
              <button onClick={() => changeServings(-1)}><FaMinus /></button>
              <span>{servings} Servings</span>
              <button onClick={() => changeServings(1)}><FaPlus /></button>
            </div>
          </div>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity * servings} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
