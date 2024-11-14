import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopRatedRecipesSlider from '../components/TopRatedRecipesSlider/TopRatedRecipesSlider';
import LatestRecipesSlider from '../components/LatestRecipesSlider/LatestRecipesSlider';

function Home() {
  const location = useLocation();
  const [message, setMessage] = React.useState(location.state?.message || '');

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
    </>
  );
}

export default Home;
