import React from 'react';
import TopRatedRecipesSlider from '../components/TopRatedRecipesSlider/TopRatedRecipesSlider';
import LatestRecipesSlider from '../components/LatestRecipesSlider/LatestRecipesSlider';

function Home() {
  return (
    <>
      <TopRatedRecipesSlider />
      <LatestRecipesSlider />
    </>
  );
}

export default Home;
