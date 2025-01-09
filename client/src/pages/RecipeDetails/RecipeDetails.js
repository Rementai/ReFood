import React, { useState, useEffect } from "react";
import { FaClock, FaSignal, FaMinus, FaPlus, FaRegFilePdf, FaHeart, FaRegHeart, FaRegStar } from 'react-icons/fa';
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import RatingModal from "../../components/RatingModal/RatingModal";
import './RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const response = await fetch(`http://localhost:8080/recipes/rating/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            console.error("User not authenticated");
          }
          throw new Error("Failed to fetch user rating");
        }
  
        const data = await response.json();
        setUserRating(data.rating);
      } catch (err) {
        console.error(err.message);
      }
    };
  
    fetchUserRating();
  }, [id]);
  
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

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:8080/favorites/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch favorites");
  
        const favorites = await response.json();
        setIsFavorite(favorites.some((fav) => parseInt(fav.recipe_id) === parseInt(id)));
      } catch (err) {
        console.error("Error checking favorite status:", err.message);
      }
    };
  
    checkFavoriteStatus();
  }, [id]);
  
  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  const toggleFavorite = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const url = `http://localhost:8080/favorites/${isFavorite ? 'remove' : 'add'}`;
      const response = await fetch(url, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ recipe_id: parseInt(id) }),
      });
  
      if (!response.ok) throw new Error(isFavorite ? 'Failed to remove favorite' : 'Failed to add favorite');
  
      const refreshFavorites = await fetch(`http://localhost:8080/favorites/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (!refreshFavorites.ok) throw new Error("Failed to refresh favorites");
      const updatedFavorites = await refreshFavorites.json();
  
      setIsFavorite(updatedFavorites.some((fav) => parseInt(fav.recipe_id) === parseInt(id)));
    } catch (err) {
      console.error("Error toggling favorite:", err.message);
    }
  };
  
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

  const handleRatingSubmit = async (recipeId, userId, rating) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/recipes/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ recipe_id: recipeId, user_id: userId, rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }
      alert("Thank you for rating!");
    } catch (error) {
      console.error(error.message);
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
          <div className="button-container">
          <button
            className={`favorite-btn ${isFavorite ? 'favorite' : ''}`}
            onClick={toggleFavorite}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
          <div className="rating-button">
            <button onClick={() => setIsRatingModalOpen(true)}><FaRegStar /></button>
          </div>
        </div>
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
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        recipeId={id}
        userId={localStorage.getItem("user_id")}
        onRatingSubmit={handleRatingSubmit}
        initialRating={userRating}
      />
    </div>
  );
};

export default RecipeDetails;
