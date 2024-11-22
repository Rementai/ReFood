import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopRatedRecipesSlider from '../components/TopRatedRecipesSlider/TopRatedRecipesSlider';
import LatestRecipesSlider from '../components/LatestRecipesSlider/LatestRecipesSlider';
import CategoryList from '../components/CategoryList/CategoryList';

function Home() {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || '');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {message && <div className="success-message">{message}</div>}
      <TopRatedRecipesSlider />
      <LatestRecipesSlider />
      <CategoryList />
    </>
  );
}

export default Home;
