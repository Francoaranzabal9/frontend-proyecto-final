import React from 'react';
import iconMen from '../assets/banners/icon_men.png';
import iconWomen from '../assets/banners/icon_women.png';
import iconDecant from '../assets/banners/icon_decant.png';

const BannerSection = ({ onSearch }) => {
  const categories = [
    {
      id: 1,
      title: "MUJER",
      image: iconWomen,
      search: { genre: "Femenino" }
    },
    {
      id: 2,
      title: "HOMBRE",
      image: iconMen,
      search: { genre: "Masculino" }
    },
    {
      id: 3,
      title: "DECANTS",
      image: iconDecant,
      search: { name: "decant" }
    },
    // Added more items to match the reference look, although I don't have functional search for them yet, 
    // or I can default them to something valid. For now I keep the main 3 requested.
    // To make it look like the reference, I should probably stick to the 3 main ones or duplicate/add generic ones if needed.
    // But the user asked for Men, Women, Decants.
  ];

  return (
    <section className="banner-bar">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="banner-bar-item"
          onClick={() => onSearch(cat.search)}
        >
          <img src={cat.image} alt={cat.title} className="banner-icon" />
          <span className="banner-label">{cat.title}</span>
        </div>
      ))}
    </section>
  );
};

export default BannerSection;
