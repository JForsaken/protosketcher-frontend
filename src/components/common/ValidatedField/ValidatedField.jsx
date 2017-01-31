/* Node Modules */
import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

export default class RenderField extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    containerClass: PropTypes.string,
    inputClass: PropTypes.string,
    labelClass: PropTypes.string,
    errorClass: PropTypes.string,
    warningClass: PropTypes.string,
  };

  render() {
    const {
      input,
      label,
      type,
      placeholder,
      containerClass,
      inputClass,
      labelClass,
      errorClass,
      warningClass,
      meta: { touched, error, warning },
    } = this.props;

    return (
      <div className={containerClass}>
        {label && <label className={labelClass}><FormattedMessage id={label} /></label>}
        <div>
          <input
            {...input}
            placeholder={placeholder}
            className={inputClass}
            placeholder={placeholder}
            type={type}
          />
          {touched &&
           ((error &&
             <div className={errorClass}>
               <FormattedMessage id={error} />
             </div>
           ) ||
           (warning &&
             <div className={warningClass}>
               <FormattedMessage id={warning} />
             </div>))
          }
        </div>
      </div>
    );
  }
}
