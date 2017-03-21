/* Node modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Scroll from 'react-scroll';

const Element = Scroll.Element;

export default class Content extends Component {
  render() {
    return (
      <div>
        <div className="content">
          <Element name="features">
            <h3><FormattedMessage id="landing.features" /></h3>
          </Element>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel nisl at mauris
            mollis tristique a nec sapien. Vivamus eget orci odio. Vestibulum dapibus arcu nisi.
            Pellentesque aliquet molestie lacus a eleifend. Pellentesque dictum velit at turpis
            tristique rhoncus. Class aptent taciti sociosqu ad
            litora torquent per conubia nostra, per
            inceptos himenaeos. In nec egestas nulla. Fusce tincidunt nec mauris at scelerisque.
            Vivamus iaculis et justo non posuere.
          </p>
          <p>
            Praesent at enim ut libero interdum dapibus. Donec nunc elit, convallis vitae felis
            pulvinar, accumsan sodales nunc. Praesent scelerisque nunc sit amet placerat suscipit.
            Vestibulum fringilla, elit non tempor aliquet, ipsum ante faucibus sapien, ut bibendum
            odio velit ac erat. Nam ut libero quis ante vulputate malesuada eget accumsan
            augue. Fusce
            vitae mauris eu nisi condimentum facilisis. Quisque convallis pretium suscipit. Donec
            consectetur iaculis mi, id maximus turpis accumsan eu. Class aptent taciti sociosqu ad
            litora torquent per conubia nostra, per inceptos himenaeos. Morbi lobortis
            purus massa, at
            convallis nisi fermentum id. Aliquam imperdiet urna a scelerisque varius.
            Morbi non dolor
            orci. Quisque vitae lacus nec metus aliquet luctus et condimentum tellus.
          </p>
          <p>
            Suspendisse sodales justo ultrices diam sagittis euismod. Cras sodales ex non felis
            semper scelerisque. Ut eget consectetur ipsum, et aliquam mauris. Duis mi sapien,
            pulvinar
            in vestibulum a, viverra nec nisl. Mauris bibendum luctus purus, eget tempor erat
            condimentum porta. Aenean pulvinar, erat sit amet posuere fermentum, lorem ligula
            rhoncus
            dui, eu rutrum magna tortor quis ipsum. Pellentesque metus eros, sagittis id pulvinar
            eget, elementum a nunc. Donec sit amet ullamcorper lectus. Praesent auctor auctor
            turpis,
            quis ornare elit elementum vitae. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Phasellus semper maximus sem, nec molestie
            tortor
            dictum nec. Maecenas posuere molestie ex, a tincidunt orci elementum ut. Fusce nec
            vehicula odio. Cras ex velit, ullamcorper nec justo quis, elementum egestas ligula.
            Vestibulum sit amet nulla risus.
          </p>
        </div>
      </div>
    );
  }
}
