import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
const HomePageTrainingSilder = () => {
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
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/1.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/2.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/3.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/4.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/5.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/6.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/7.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/8.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/9.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/10.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/11.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/12.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/13.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
      <div className="item">
        <div className="login-slide-img">
          <img
            src={process.env.PUBLIC_URL + "/images/TrainningImages/14.jpeg"}
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
    </OwlCarousel>
  );
};

export default HomePageTrainingSilder;

// import React from "react";
// import OwlCarousel from "react-owl-carousel";
// import "owl.carousel/dist/assets/owl.carousel.css";
// import "owl.carousel/dist/assets/owl.theme.default.css";
// const Slider = () => {
//   return (
//     <OwlCarousel className="owl-theme" items="1" dots loop autoplay>
//       {/* <div className='item'>
//                 <div className="login-slide-img">
//                     <img src={process.env.PUBLIC_URL + '/images/login-slide1.png'} alt="" className="img-fluid" />
//                 </div>
//             </div>
//             <div className='item'>
//                 <div className="login-slide-img">
//                     <img src={process.env.PUBLIC_URL + '/images/login-slide2.png'} alt="" className="img-fluid" />
//                 </div>
//             </div>
//             <div className='item'>
//                 <div className="login-slide-img">
//                     <img src={process.env.PUBLIC_URL + '/images/login-slide3.png'} alt="" className="img-fluid" />
//                 </div>
//             </div> */}
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/1.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/2.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/3.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/4.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/5.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/6.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/7.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/8.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/9.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/10.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/11.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/12.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/13.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//       <div className="item">
//         <div className="login-slide-img">
//           <img
//             src={process.env.PUBLIC_URL + "/images/TrainningImages/14.jpeg"}
//             alt=""
//             className="img-fluid"
//           />
//         </div>
//       </div>
//     </OwlCarousel>
//   );
// };

// export default Slider;
