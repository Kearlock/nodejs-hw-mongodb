import Joi from 'joi';

export const createContactShema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{7,14}$/)
    .required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactShema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{7,14}$/),
  email: Joi.string().email({ tlds: { allow: false } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
