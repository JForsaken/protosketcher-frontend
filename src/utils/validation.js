export const isRequired = value => (
  value ? null : 'form.errors.required'
);

export const isEmail = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? { error: 'form.errors.email', values: {} }
  : null
);

export const isMaxLengthValid = (value, length) => (
  value.length > length
    ? { error: 'form.errors.maxLength', values: { length } }
    : null
);

export const isMinLengthValid = (value, length) => (

  value.length < length
    ? { error: 'form.errors.minLength', values: { length } }
    : null
);

export const containsUpperCase = (value, flag) => (
  (flag
   && !/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(value))
    ? { error: 'form.errors.upperCase', values: {} }
    : null
);

export const containsSpecial = (value, flag) => (
  (flag
   && !/[!@#$%^&*()_+]+/.test(value))
    ? { error: 'form.errors.special', values: {} }
    : null
);

export const containsDigit = (value, flag) => (
  (flag
   && !/(?=.*\d)/.test(value))
    ? { error: 'form.errors.digit', values: {} }
    : null
);
