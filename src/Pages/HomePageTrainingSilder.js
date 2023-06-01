import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
const HomePageTrainingSilder = () => {
  const images = [];
  for (let i = 1; i <= 16; i++) {
    images.push(
      <div key={i} className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + `/images/TrainningImages/${i}.webp`}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
    );
  }
  return (
    <OwlCarousel
      className="owl-theme"
      items="1"
      loop
      dots
      nav
      autoplay
      autoplayTimeout={5000}
      autoplayHoverPause
      navText={[
        '<span class="arrow prev">‹</span>',
        '<span class="arrow next">›</span>',
        ,
      ]}
    >
      {images}
    </OwlCarousel>
  );
};

export default HomePageTrainingSilder;
