import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();
  const searchBarRef = useRef(null);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await fetch(`http://localhost:8080/recipes/search?q=${e.target.value}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      setResults([]);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/recipes/${id}`);
    setQuery('');
    setResults([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchBarRef} className={`search-bar-container ${results.length > 0 ? 'results-visible' : ''}`}>
      <FaSearch className={`search-icon ${isSearchActive ? 'active' : ''}`} />
      <input
        type="text"
        placeholder="Search recipes..."
        value={query}
        onChange={handleSearch}
        className="search-bar"
        onFocus={() => setIsSearchActive(true)}
        onBlur={() => setIsSearchActive(false)}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((result) => (
            <li key={result.recipe_id} onClick={() => handleResultClick(result.recipe_id)}>
              {result.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;