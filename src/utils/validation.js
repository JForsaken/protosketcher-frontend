const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) =>
        (value, key, data) =>
        rules.map(rule => rule(value, key, data)).filter(error => !!error)[0];

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'email';
  }
  return null;
}

export function phoneNumber(value) {
  if (!isEmpty(value) &&
      !/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(value)) {
    return 'phoneNumber';
  }
  return null;
}

export function required(value) {
  if (isEmpty(value)) {
    return 'required';
  }
  return null;
}

export function selectOption(value) {
  if (isEmpty(value) || value === 'select') {
    return 'selectOption';
  }
  return null;
}

export function selectOptionKid(value, key, data) {
  const id = key.substr(3, 2);
  const kidNumId = /^\d+$/.test(id[1]) ? id : id[0];

  if (data && data[`kid${kidNumId}language`] !== undefined &&
      (isEmpty(value) || value === 'select')) {
    return 'selectOption';
  }
  return null;
}

export function selectDateOptionKid(value, key, data) {
  const id = key.substr(3, 2);
  const kidNumId = /^\d+$/.test(id[1]) ? id : id[0];

  if (data && data[`kid${kidNumId}language`] !== undefined &&
      (isEmpty(value) || value === 'select')) {
    return 'selectDateOption';
  }
  return null;
}

export function requiredKid(value, key, data) {
  const id = key.substr(3, 2);
  const kidNumId = /^\d+$/.test(id[1]) ? id : id[0];

  if (data && data[`kid${kidNumId}language`] !== undefined && isEmpty(value)) {
    return 'required';
  }
  return null;
}

export function minQuantity(min) {
  return value => {
    if (!isEmpty(value) && value < min) {
      return `Must be at least ${min}.`;
    }
    return null;
  };
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return 'maxLength';
    }
    return null;
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
  return null;
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
    return null;
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
    return null;
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      // concat for both functions
      const rule = join([].concat(rules[key]));
      const error = rule(data[key], key, data);

      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}
