/* Node modules */
import React, { Component } from 'react';
import CallToAction from '../CallToAction/CallToAction';
import CuteText from '../CuteText/CuteText';
import { Parallax } from 'react-parallax';
import ScrollEffect from 'react-scroll-effects';
import { landingPage } from '../../constants';
import radialMenuParallax from '../../../../assets/images/parallax/radial-menu-parallax.png';
import blueParallax from '../../../../assets/images/parallax/blue-parallax.jpg';
import starsParallax from '../../../../assets/images/parallax/stars-parallax.jpg';
import blackParallax from '../../../../assets/images/parallax/black-parallax.jpg';
import geometryParallax from '../../../../assets/images/parallax/geometry-parallax.jpg';
import mountainParallax from '../../../../assets/images/parallax/mountain-parallax.jpg';
import colorsParallax from '../../../../assets/images/parallax/colors-parallax.jpg';

export default class ParallaxContainer extends Component {
  render() {
    const parallaxStrength = landingPage.PARALLAX.strength;
    return (
      <div>
        <Parallax
          className="parallax-content"
          bgImage={colorsParallax}
          strength={parallaxStrength}
        >
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText1" color="white" />
          </ScrollEffect>
        </Parallax>
        <Parallax
          className="parallax-content"
          bgImage={starsParallax}
          strength={parallaxStrength}
        >
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText2" color="white" />
          </ScrollEffect>
        </Parallax>
        <Parallax
          className="parallax-content"
          bgImage={blueParallax}
          strength={parallaxStrength}
        >
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText3" color="white" />
          </ScrollEffect>
          <ScrollEffect animate="slideInRight">
            <CallToAction
              router={this.props.router}
              inactiveText="landing.firstCtaInactiveText"
              hoveredText="landing.firstCtaHoveredText"
            />
          </ScrollEffect>
        </Parallax>
        <Parallax
          className="parallax-content"
          bgImage={radialMenuParallax}
          strength={parallaxStrength}
        >
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText4" />
          </ScrollEffect>
        </Parallax>
        <Parallax
          className="parallax-content"
          bgImage={geometryParallax}
          strength={parallaxStrength}
        >
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText5" color="white" />
          </ScrollEffect>
        </Parallax>
        <Parallax
          className="parallax-content"
          bgImage={mountainParallax}
          strength={parallaxStrength}
        >
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText6" color="white" />
          </ScrollEffect>
        </Parallax>
        <Parallax
          className="parallax-content"
          bgImage={blackParallax}
          strength={parallaxStrength}
        >
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText7" color="white" />
          </ScrollEffect>
          <ScrollEffect animate="slideInRight">
            <CallToAction
              router={this.props.router}
              inactiveText="landing.secondCtaInactiveText"
              hoveredText="landing.secondCtaHoveredText"
            />
          </ScrollEffect>
        </Parallax>
      </div>
    );
  }
}
