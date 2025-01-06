import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import Loader from "../../components/Loader/Loader";
import "./Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Token is missing");
        }

        const response = await axios.get("http://localhost:8080/favorites/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const favoriteIds = response.data.map((item) => item.recipe_id);

        const recipesData = [];
        for (const recipeId of favoriteIds) {
          const recipeResponse = await axios.get(`http://localhost:8080/recipes/${recipeId}`);
          recipesData.push(recipeResponse.data);
        }

        setRecipes(recipesData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch favorite recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="favorites-container">
      <h1 className="favorite-list-title">Your favorite recipes</h1>
      {error && <p className="favorites-error">{error}</p>}
      <div className="favorites-grid">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.recipe_id} recipe={recipe} />
          ))
        ) : (
          <p className="favorites-empty">No favorite recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
