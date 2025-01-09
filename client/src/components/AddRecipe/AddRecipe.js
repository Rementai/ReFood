import React, { useState, useEffect } from "react";
import axios from "axios";
import IngredientSelector from "../IngredientSelector/IngredientSelector";
import "../AddRecipe/AddRecipe.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRecipe = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [instructions, setInstructions] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [ingredients, setIngredients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8080/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to fetch categories!");
            }
        };

        fetchCategories();
    }, []);

    const handleAddIngredient = (ingredient) => {
        const isDuplicate = ingredients.some(
            (ing) => ing.id === ingredient.id && ing.name === ingredient.name
        );

        if (isDuplicate) {
            toast.warn("This ingredient has already been added!");
            return;
        }

        setIngredients([...ingredients, ingredient]);
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
        toast.info("Ingredient removed.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/recipes/create", {
                title,
                description,
                image,
                instructions,
                prep_time: parseInt(prepTime),
                cook_time: parseInt(cookTime),
                difficulty,
                ingredients,
                category_id: selectedCategory,
            });

            toast.success(response.data.message);

            setTitle("");
            setDescription("");
            setImage("");
            setInstructions("");
            setPrepTime("");
            setCookTime("");
            setDifficulty("easy");
            setIngredients([]);
            setSelectedCategory("");
        } catch (error) {
            console.error("Error creating recipe:", error.response?.data?.errors || error.message);
            toast.error("Failed to create recipe. Please try again.");
        }
    };

    return (
        <div className="add-recipe">
            <h2>Add New Recipe</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>

                <label htmlFor="image">Image URL</label>
                <input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />

                <label htmlFor="instructions">Instructions</label>
                <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                ></textarea>

                <label htmlFor="prepTime">Preparation Time (minutes)</label>
                <input
                    id="prepTime"
                    type="number"
                    min="0"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    required
                />

                <label htmlFor="cookTime">Cooking Time (minutes)</label>
                <input
                    id="cookTime"
                    type="number"
                    min="0"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    required
                />

                <label htmlFor="difficulty">Difficulty Level</label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                >
                    <option value="">Select a category...</option>
                    {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <div>
                    <h3>Ingredients</h3>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveIngredient(index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <IngredientSelector onAddIngredient={handleAddIngredient} />
                </div>
                <button type="submit" className="add-btn">Create Recipe</button>
            </form>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
        </div>
    );
};

export default AddRecipe;