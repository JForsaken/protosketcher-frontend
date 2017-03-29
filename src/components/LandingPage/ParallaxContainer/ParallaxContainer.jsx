/* Node modules */
import React, { Component } from 'react';
import CallToAction from '../CallToAction/CallToAction';
import CuteText from '../CuteText/CuteText';
import { Parallax } from 'react-parallax';
import ScrollEffect from 'react-scroll-effects';
import radialMenuParallax from '../../../../assets/images/parallax/radial-menu-parallax.png';
import blueParallax from '../../../../assets/images/parallax/blue-parallax.jpg';
import starsParallax from '../../../../assets/images/parallax/stars-parallax.jpg';
import blackParallax from '../../../../assets/images/parallax/black-parallax.jpg';
import geometryParallax from '../../../../assets/images/parallax/geometry-parallax.jpg';
import mountainParallax from '../../../../assets/images/parallax/mountain-parallax.jpg';
import colorsParallax from '../../../../assets/images/parallax/colors-parallax.jpg';

export default class ParallaxContainer extends Component {
  render() {
    return (
      <div>
        <Parallax className="parallax-content" bgImage={colorsParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText1" />
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={starsParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText2" />
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={blueParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText3" />
          </ScrollEffect>
          <ScrollEffect animate="slideInRight">
            <CallToAction
              router={this.props.router}
              inactiveText="READY?"
              hoveredText="GO!"
            />
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={radialMenuParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText4" />
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={geometryParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText5" />
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={mountainParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText6" />
          </ScrollEffect>
        </Parallax>
        <Parallax className="parallax-content" bgImage={blackParallax} strength={400}>
          <br />
          <ScrollEffect animate="fadeInUp">
            <CuteText text="landing.contentText7" />
          </ScrollEffect>
          <ScrollEffect animate="slideInRight">
            <ScrollEffect animate="slideInRight">
              <CallToAction
                router={this.props.router}
                inactiveText="DO IT!"
                hoveredText="JUST DO IT!!!"
              />
            </ScrollEffect>
          </ScrollEffect>
        </Parallax>
      </div>
    );
  }
}
