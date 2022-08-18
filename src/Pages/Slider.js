import React from 'react'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
const Slider = () => {
    return (
        <OwlCarousel className='owl-theme' items="1" dots loop autoplay>
            <div className='item'>
                <div className="login-slide-img">
                    <img src={process.env.PUBLIC_URL + '/images/login-slide1.png'} alt="" class="img-fluid" />
                </div>
            </div>
            <div className='item'>
                <div className="login-slide-img">
                    <img src={process.env.PUBLIC_URL + '/images/login-slide2.png'} alt="" class="img-fluid" />
                </div>
            </div>
            <div className='item'>
                <div className="login-slide-img">
                    <img src={process.env.PUBLIC_URL + '/images/login-slide3.png'} alt="" class="img-fluid" />
                </div>
            </div>
        </OwlCarousel>
    )
}

export default Slider