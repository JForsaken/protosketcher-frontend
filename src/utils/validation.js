export const isRequired = value => (
  value ? null : 'form.errors.required'
);

export const isEmail = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'form.errors.email' : null
);
