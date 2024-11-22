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
      <h2>Recipe Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.category_id}>
            <Link to={`/recipes/category/${category.category_id}`}>
              <h3>{category.name}</h3>
            </Link>
            <p>{category.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
