import * as Yup from 'yup';

export const signupSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Too Short. Must be at least 3 characters.')
    .max(30, 'Too long. Must be within 30 characters.')
    .matches(/^[^\s]+$/, 'Needs to be one word without whitespaces.')
    .matches(/^(?!\.).+$/, 'Username cannot start with a dot(.).')
    .matches(/^(?!.*\.\.).+$/, 'Username cannot have consecutive dots.')
    .matches(/^(?!.*\.$).+$/, 'Username cannot end with a dot(.).')
    .matches(
      /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]+$/,
      'Username can only contain Latin letters, numbers, dots and underscores.',
    )
    .required('Required field.'),
  email: Yup.string()
    .email('Invalid email address.')
    .required('Required field.'),
  password: Yup.string()
    .min(8, 'Too short. Needs to have min. 8 characters.')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      'Password needs at least one lowercase letter, one uppercase letter and one number.',
    )
    .required('Password needed'),
  ageConfirmation: Yup.boolean().oneOf(
    [true],
    'You must be at least be at least 13 years or older.',
  ),
  termsConfirmation: Yup.boolean().oneOf(
    [true],
    'You must agree to the terms and conditions.',
  ),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email()
    .required('Email is required.'),
  password: Yup.string().required('Password is required'),
});

export const refreshTokenSchema = Yup.object({
  refreshToken: Yup.string().required('Refresh token is needed.'),
});

export const logoutSchema = Yup.object({
  userId: Yup.string().required('User Id is needed.'),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email()
    .required('Email is required.'),
});

export const resetPasswordSchema = Yup.object({
  id: Yup.string().required('Id is required.'),
  token: Yup.string().required('Token is required.'),
  password: Yup.string().required('Password is required.'),
});

export const checkResetPasswordLinkSchema = Yup.object({
  id: Yup.string().required('Id is required.'),
  token: Yup.string().required('Token is required.'),
});

export const emailVerificationSchema = Yup.object({
  token: Yup.string().required('Token is required.'),
});
