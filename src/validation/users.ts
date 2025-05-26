import Joi from 'joi';

export const registerUser = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    .required(),
  grade: Joi.string().required(),
  subject: Joi.string().required(),
  studyTime: Joi.string(),
  studyStyle: Joi.string()
});

export const loginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export const newPass = Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required(),
    email: Joi.string()
    .email()
    .required()
}).with('password', 'confirmPassword');