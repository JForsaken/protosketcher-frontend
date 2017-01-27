/* Node Modules */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class RenderField extends Component {
  render() {
    const { input, label, type, meta: { touched, error, warning } } = this.props;

    return (
      <div>
        {label && <label>{label}</label>}
        <div>
          <input {...input} placeholder={label} type={type} />
          {touched &&
           ((error && <FormattedMessage id={error} />) ||
            (warning && <FormattedMessage id={warning} />))
          }
        </div>
      </div>
    );
  }
}
