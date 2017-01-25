import memoize from 'lru-memoize';
import {
  createValidator,
  required,
  email,
} from '../../../utils/validation';

export const fields = [
  'firstname',
  'lastname',
  'email',
  'password',
];

const loginValidation = createValidator({
  email: [required, email],
  password: required,
});

export default memoize(10)(loginValidation);
