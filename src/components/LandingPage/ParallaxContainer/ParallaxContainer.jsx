/* Node modules */
import React, { Component } from 'react';
import { Parallax } from 'react-parallax';
import radialMenuParallax from '../../../../assets/images/parallax/radial-menu-parallax.png';
import blueParallax from '../../../../assets/images/parallax/blue-parallax.jpg';
import starsParallax from '../../../../assets/images/parallax/stars-parallax.jpg';
import blackParallax from '../../../../assets/images/parallax/black-parallax.jpg';
import geometryParallax from '../../../../assets/images/parallax/geometry-parallax.jpg';
import mountainParallax from '../../../../assets/images/parallax/mountain-parallax.jpg';
import colorsParallax from '../../../../assets/images/parallax/colors-parallax.jpg';
import ScrollEffect from 'react-scroll-effects';

export default class ParallaxContainer extends Component {
  render() {
    return (
      <div>
        <Parallax className="parallax-content" bgImage={colorsParallax} strength={400}>
          <br />
          <ScrollEffect offset="-100" animate="fadeInUp">
            <h1 className="parallax-white-text"> Bored of using whiteboards or complex apps? </h1>
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={starsParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <h1 className="parallax-white-text"> Here's a solution for
              your dev team called Protosketcher.
            </h1>
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={blueParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <h1 className="parallax-white-text"> It's a lightweight application
              for making user interface
              prototypes easily in an agile development context and it starts right here with you!
            </h1>
          </ScrollEffect>
          <ScrollEffect animate="slideInRight">
            <div className="button">
              <p className="btnText">READY?</p>
              <div className="btnTwo">
                <p className="btnText2">SIGN UP!</p>
              </div>
            </div>
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={radialMenuParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <h1 className="parallax-text"> It supports mobile and desktop environments. </h1>
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={geometryParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <h1 className="parallax-white-text"> Protosketcher can simulate on the fly the interface
              you're drawing and it's pretty.
            </h1>
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={mountainParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <h1 className="parallax-white-text"> Demonstrating UI to your clients in
              early development phases has never been easier.
            </h1>
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={blackParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <h1 className="parallax-white-text"> Stop wondering if it can help you or not and jump
              into a pure experience of UI conception!
            </h1>
          </ScrollEffect>
          <ScrollEffect animate="slideInRight">
            <div className="button">
              <p className="btnText">DO IT!</p>
              <div className="btnTwo">
                <p className="btnText2">JUST DO IT!!!</p>
              </div>
            </div>
          </ScrollEffect>
        </Parallax>
      </div>
    );
  }
}
