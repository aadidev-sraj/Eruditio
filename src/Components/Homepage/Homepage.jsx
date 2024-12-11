import React, { useState } from 'react';
import './Homepage.css';
import hero from '../../images/hero-image.jpg'

const HomePage = () => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const cards = Array.from({ length: 8 }, (_, index) => (
    <div className="card" key={index}>
      <h3>Card Title {index + 1}</h3>
      <h4>Card Subtitle {index + 1}</h4>
      <p>Some content here</p>
      <button className="card-button">More</button>
    </div>
  ));

  const scrollLeft = () => {
    setScrollIndex(Math.max(scrollIndex - 1, 0));
  };

  const scrollRight = () => {
    setScrollIndex(Math.min(scrollIndex + 1, cards.length - 3));
  };

  return (
    <div className="homepage">
      <div className="centered-image">
        <img src={hero} alt="Eruditio" />
      </div>
      <section className="description-section">
        <h2>What is Eruditio?</h2>
        <p>Eruditio is a online learning platform that aims at providing knowledge to those who are seeking it. Eruditio intergrates personalised learning with a gamified approach. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum sed reiciendis facere expedita voluptates voluptas explicabo, soluta accusantium! Repudiandae, assumenda quibusdam. Laborum, nesciunt tenetur reiciendis inventore fugit qui commodi maxime.</p>
      </section>
      <div className="card-container-wrapper">
        <button className="scroll-button" onClick={scrollLeft}>&lt;</button>
        <div className="card-container" style={{ transform: `translateX(-${scrollIndex * 300}px)` }}>
          {cards}
        </div>
        <button className="scroll-button" onClick={scrollRight}>&gt;</button>
      </div>
    </div>
  );
};

export default HomePage;
