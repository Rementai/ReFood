import React, { useState, useEffect } from "react";
import { PiChefHat } from "react-icons/pi";
import "./RatingModal.css";

const RatingModal = ({ isOpen, onClose, recipeId, userId, onRatingSubmit, initialRating }) => {
  const [rating, setRating] = useState(initialRating || 0);

  useEffect(() => {
    setRating(initialRating || 0);
  }, [initialRating]);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    onRatingSubmit(recipeId, userId, rating);
    onClose();
  };

  if (!isOpen) return null;

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Rate this recipe</h2>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "selected" : ""}`}
              onClick={() => handleRatingClick(star)}
            >
              <PiChefHat />
            </span>
          ))}
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default RatingModal;
