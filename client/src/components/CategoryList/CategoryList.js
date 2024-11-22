import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CategoryList.css';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/categories')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        return response.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="categories">
      <h2>Categories</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <div key={category.category_id} className="category-card">
            <Link to={`/recipes/category/${category.category_id}`}>
              <div className="category-icon">
                <img
                  src={category.icon}
                  alt={category.name}
                />
              </div>
              <div className="category-name">{category.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
