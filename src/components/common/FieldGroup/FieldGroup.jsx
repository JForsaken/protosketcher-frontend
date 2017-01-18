import React from 'react';
import { ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';


function getValidationState(props) {
  if (props.error && props.touched) {
    return 'error';
  }
  return null;
}

export default function FieldGroup({ id, label, help, ...props }) {
  const validationState = getValidationState(props);

  return (
    <FormGroup controlId={id} validationState={validationState}>
      {!props.isDateField && <ControlLabel>{label}</ControlLabel>}
      <FormControl className="field-group__form-control" {...props}>
        {props.options && props.options}
      </FormControl>
      {help && <HelpBlock>{help}</HelpBlock>}
      {props.touched && props.error &&
        <div className="field-group__error-label">
          <FormattedMessage id={`form.errors.${props.error}`} />
        </div>
      }
    </FormGroup>
  );
}
