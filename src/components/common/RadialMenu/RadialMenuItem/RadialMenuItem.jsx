/**
 * Item of a radial menu
 *
 * Props :
 *
 * icon: Icon to display in the item
 * color: Color of the background
 * action: Function to execute when the item is hovered
 * items: Items to display when the item is hovered <RadialMenuItem>
 * flex: Flex property applied to menu generation || 1
 * startAngle: Generated starting angle of the section
 * endAngle : Generated stopping angle of the section
 */

/* Node modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';

/* Components */

/* Actions */
import { updateWorkspace } from '../../../../actions/application';


class RadialMenuItem extends Component {

  constructor(props, context) {
    super(props, context);

    // Default params
    this.state = {
      selected: false,
      selectedIndex: -1,
    };

    if (!isEmpty(this.props.items)) this.initElements();

    // Functions
    this.createSvgArc = this.createSvgArc.bind(this);
    this.createCSSTransform = this.createCSSTransform.bind(this);
    this.onMovingEvent = this.onMovingEvent.bind(this);
    this.onMovingEventOnItem = this.onMovingEventOnItem.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.application.workspace.action === this.props.action) {
      this.setState({ selected: true });
    } else {
      this.setState({ selected: false });
    }

    if (!isEmpty(this.props.items)) {
      for (const item of this.props.items) {
        item.selected = newProps.application.workspace.actionValue === item.actionValue;
      }
    }
  }

  onMovingEvent() {
    if (this.props.action !== this.props.application.workspace.action) {
      this.props.actions.updateWorkspace({ action: this.props.action });
    } else if (this.props.application.workspace.actionValue) {
      this.props.actions.updateWorkspace({ actionValue: null });
    }
  }

  onMovingEventOnItem(e) {
    const classes = e.target.className.baseVal.split('-');
    if (classes.length > 2 && classes[2] !== this.props.application.workspace.actionValue) {
      this.props.actions.updateWorkspace({
        actionValue: classes[2],
      });
    }
  }

  onLeavingEvent(e) {
    // Some menu items need to close the menu when activating their actions
    if (this.props.closeMenuOnLeave) {
      if (document.elementFromPoint(e.clientX, e.clientY).tagName !== 'circle') {
        this.props.toggleMenu(false);
      }
    }
  }

  initElements() {
    let flexTotal = 0;
    for (const item of this.props.items) {
      flexTotal += item.flex || 1;
    }
    let offset = this.props.startAngle;
    let angleRange = this.props.endAngle - offset;
    if (angleRange < 0) {
      angleRange += 2 * Math.PI;
    }

    for (const item of this.props.items) {
      item.selected = false;
      item.startAngle = offset;
      offset += angleRange * (item.flex || 1) / flexTotal;
      if (offset > 2 * Math.PI) {
        offset -= 2 * Math.PI;
      }
      item.endAngle = offset;
    }
  }

  createSvgArc(x, y, r, startAngle, endAngle) {
    const angle0 = startAngle;
    const angle1 = endAngle;

    const largeArc = angle1 - angle0 <= Math.PI ? 0 : 1;

    return ['M', x, y,
      'L', x + Math.cos(angle0) * r, y - (Math.sin(angle0) * r),
      'A', r, r, 0, largeArc, 0, x + Math.cos(angle1) * r, y - (Math.sin(angle1) * r),
      'L', x, y,
    ].join(' ');
  }

  createCSSTransform(angle1, angle2, r, getObject) {
    const angleStop = angle2 > angle1
      ? angle2 : 2 * Math.PI + angle2;
    const angleOffset = angle1 + (angleStop - angle1) / 2;
    const x = Math.cos(angleOffset) * (65 + r) + 127;
    const y = Math.sin(angleOffset) * (-65 - r) + 125;
    // If we want the object instead of the css property (for safary, which doesn't like transform)
    if (getObject) {
      return { x, y };
    }
    return { transform: `translate(${x}px,${y}px)` };
  }

  render() {
    const baseClassName = `action-${this.props.action}`;
    const imagePos = this.createCSSTransform(this.props.startAngle, this.props.endAngle, 0, true);
    return (
      <g className="radial-menu-item">
      {
        this.state.selected && !isEmpty(this.props.items) && this.props.items.map((item, i) =>
          <g className="radial-menu-item" key={i}>
            <path
              className="radial-menu-item-separator"
              d={this.createSvgArc(150, 150, 150, item.startAngle, item.endAngle)}
            />
            <path
              className={item.selected ? 'hover' : `${baseClassName}-${item.actionValue}`}
              d={this.createSvgArc(150, 150, 150, item.startAngle, item.endAngle)}
              fill={item.color}
              onMouseMove={this.onMovingEventOnItem}
              onTouchMove={this.onMovingEventOnItem}
            />
            <image
              xlinkHref={item.icon}
              style={this.createCSSTransform(item.startAngle, item.endAngle, 58)}
            />
          </g>)
      }
        <path
          className="radial-menu-item-separator"
          d={this.createSvgArc(150, 150, 101, this.props.startAngle, this.props.endAngle)}
        />
        <path
          className={this.state.selected ? 'hover' : baseClassName}
          d={this.createSvgArc(150, 150, 100, this.props.startAngle, this.props.endAngle)}
          fill={this.props.color}
          onMouseMove={this.onMovingEvent}
          onTouchMove={this.onMovingEvent}
          onMouseLeave={(e) => this.onLeavingEvent(e)}
        />
        <image
          xlinkHref={this.props.icon}
          x={imagePos.x}
          y={imagePos.y}
          width="48"
          height="48"
        />
      </g>
    );
  }
}

export default connect(
  ({ application }) => ({ application }),
  dispatch => ({
    actions: bindActionCreators({
      updateWorkspace,
    }, dispatch),
  })
)(RadialMenuItem);
