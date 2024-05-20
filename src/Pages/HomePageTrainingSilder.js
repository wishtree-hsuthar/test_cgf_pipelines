import React, { useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// import img from '../../public/images/Group 38.svg'
const HomePageTrainingSilder = () => {
  const [imgNo, setImgNo] = useState(0)
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
  let imagePath = [
    '/images/2024_Dashboard landing page.1.webp', 
    '/images/2024_Dashboard landing page.2.webp', 
    '/images/2024_Dashboard landing page.3.webp', 
    '/images/2024_Dashboard landing page.4.webp', 
    '/images/2024_Dashboard landing page.7.webp', 
    '/images/2024_Dashboard landing page.pptx.6.webp', 
    '/images/2024_Dashboard-landing-page.8.webp',
    '/images/2024_Dashboard landing page.9.webp', 
    '/images/last.webp'
  ]
  const handleNext = () => {
    if (imagePath.length-1 === imgNo) {
      setImgNo(0)
    } else {
      setImgNo(img => img + 1)

    }
  }
  console.log("imgpath - ", imagePath[imgNo],imgNo)

  const handlePrevious = () => {
    if (imgNo===0) {
      setImgNo(imagePath.length-1)
    } else {
      setImgNo(img => img - 1)

    }
    console.log("imgpath - ", imagePath[imgNo])
  }
  return (
    // <div className="homepage-container" style={{position:"absolute"}}>
    //   <div style={{ display: "flex",  alignItems:"center",justifyContent:"center"}}>
    //     <img style={{ width: '751px' }} src={process.env.PUBLIC_URL + imagePath[imgNo]} />
    //   </div>
    //   <div className="nav-buttons">
    //       <div className="btn-div" onClick={handlePrevious}><img src={process.env.PUBLIC_URL + "/images/Group 37.svg"} style={{ margin: '33%' }} /></div>
    //       <div className="btn-div" onClick={handleNext}><img src={process.env.PUBLIC_URL + "/images/Group 2.svg"} style={{ margin: '33%' }} /></div>
    //   </div>
    // </div>

    <div className="container homepage">
      <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
      <img style={{ width: '100%',maxWidth:"850px" }} src={process.env.PUBLIC_URL + imagePath[imgNo]} />
      </div>
      <div className="nav-buttons">
           <div className="btn-div" onClick={handlePrevious}><img src={process.env.PUBLIC_URL + "/images/Group 37.svg"}  /></div>
           <div className="btn-div" onClick={handleNext}><img src={process.env.PUBLIC_URL + "/images/Group 2.svg"}  /></div>
       </div>
    </div>
  )
}
// <div className="homepage-container">
//   <div style={{display:"flex",flexDirection:"row"}}>
//   <div style={{width:'40%'}}>
//   <div className="steps">
//     1
//   </div>
//   <div className="steps-inner-div">
//     <p className="steps-heading">Adding an Operation Member</p>
//     <p className="steps-description">
//       Members can add their own operations level team member who will complete the country level assessments.
//     </p>
//   </div>
//   </div>
//   <div className="verticle-line"></div>
//   <div style={{width:'60%'}}>
//   <img style={{marginTop:"5%",marginLeft:'10%',position:'absolute'}} src={process.env.PUBLIC_URL+"/images/Group 38.svg"} />
//   <div className="nav-buttons">
//    <div className="btn-div"><img src={process.env.PUBLIC_URL+"/images/Group 37.svg"} style={{margin:'33%'}}/></div> 
//     <div className="btn-div"><img src={process.env.PUBLIC_URL+"/images/Group 2.svg"} style={{margin:'33%'}}/></div>

//   </div>
//   </div>
//   </div>
// </div>
// <OwlCarousel
//   className="owl-theme"
//   items="1"
//   loop
//   dots
//   nav
//   autoplay
//   autoplayTimeout={5000}
//   autoplayHoverPause
//   navText={[
//     '<span class="arrow prev">‹</span>',
//     '<span class="arrow next">›</span>',
//     ,
//   ]}
// >
//   {images}
// </OwlCarousel>



export default HomePageTrainingSilder;
