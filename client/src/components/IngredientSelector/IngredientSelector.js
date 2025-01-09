import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import "../AddRecipe/AddRecipe.css";

const IngredientSelector = ({ onAddIngredient }) => {
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");

    const loadIngredients = async (inputValue) => {
        const response = await fetch(`http://localhost:8080/ingredients/search?q=${inputValue}`);
        const ingredients = await response.json();

        const options = ingredients.map((ingredient) => ({
            value: ingredient.ingredient_id,
            label: ingredient.name,
            unit: ingredient.unit,
        }));

        if (inputValue) {
            options.push({
                value: "new",
                label: `Add new ingredient: "${inputValue}"`,
                isNew: true,
                name: inputValue,
            });
        }

        return options;
    };

    const handleSelect = (selectedOption) => {
        if (!selectedOption) {
            setSelectedIngredient(null);
            setQuantity("");
            setUnit("");
            return;
        }

        setSelectedIngredient(selectedOption);

        if (!selectedOption.isNew) {
            setUnit(selectedOption.unit);
        } else {
            setUnit("");
        }

        setQuantity("");
    };

    const handleAdd = () => {
        if (!selectedIngredient || !quantity || (selectedIngredient.isNew && !unit)) {
            alert("Please fill in all required fields!");
            return;
        }

        onAddIngredient({
            id: selectedIngredient.isNew ? null : selectedIngredient.value,
            name: selectedIngredient.isNew ? selectedIngredient.name : selectedIngredient.label,
            quantity,
            unit: selectedIngredient.isNew ? unit : selectedIngredient.unit,
        });

        setSelectedIngredient(null);
        setQuantity("");
        setUnit("");
    };

    return (
        <div className="ingredient-selector">
            <AsyncSelect
                loadOptions={loadIngredients}
                onChange={handleSelect}
                value={selectedIngredient}
                placeholder="Search for an ingredient..."
                isClearable
                className="async-select"
            />

            {selectedIngredient && (
                <div className="ingredient-details">
                    {selectedIngredient.isNew && (
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            <option value="">Select a unit...</option>
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                            <option value="whole">whole</option>
                        </select>
                    )}

                    {!selectedIngredient.isNew && (
                        <p>Unit: <strong>{selectedIngredient.unit}</strong></p>
                    )}
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Quantity"
                    />
                    <button type="button" onClick={handleAdd}>
                        Add Ingredient
                    </button>
                </div>
            )}
        </div>
    );
};

export default IngredientSelector;