const Joi = require('@hapi/joi');

const validateProfile = profile => {
  const schema = {
    user: Joi.string(),
    handle: Joi.string()
      .max(40)
      .required(),
    company: Joi.string().allow(''),
    website: Joi.string()
      .uri()
      .allow(''),
    location: Joi.string().allow(''),
    status: Joi.string()
      .valid(
        'Software Developer',
        'Backend Developer',
        'Frontend Developer',
        'Student',
        'Instructor'
      )
      .required(),
    skills: Joi.string().required(),
    bio: Joi.string().allow(''),
    githubusername: Joi.string().allow(''),
    youtube: Joi.string()
      .uri()
      .allow(''),
    facebook: Joi.string()
      .uri()
      .allow(''),
    twitter: Joi.string()
      .uri()
      .allow(''),
    linkedin: Joi.string()
      .uri()
      .allow(''),
    instagram: Joi.string()
      .uri()
      .allow('')
  };

  return Joi.validate(profile, schema, { abortEarly: false });
};

const validateExperience = experience => {
  const schema = {
    title: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string().allow(''),
    from: Joi.date().required(),
    to: Joi.date().allow(''),
    current: Joi.boolean(),
    description: Joi.string().allow(''),
    image: Joi.allow('')
  };

  return Joi.validate(experience, schema, { abortEarly: false });
};

const validateEducation = education => {
  const schema = {
    school: Joi.string().required(),
    degree: Joi.string().required(),
    fieldOfStudy: Joi.string().allow(''),
    from: Joi.date().required(),
    to: Joi.date().allow(''),
    current: Joi.boolean(),
    description: Joi.string().allow(''),
    image: Joi.allow('')
  };

  return Joi.validate(education, schema, { abortEarly: false });
};

exports.isBodyValid = (req, res, next) => {
  const { error } = validateProfile(req.body);

  return error
    ? res.status(400).json({ error: error.details[0].message })
    : next();
};

exports.isValidExperience = (req, res, next) => {
  const { error } = validateExperience(req.body);
  return error
    ? res.status(400).json({ error: error.details[0].message })
    : next();
};

exports.isValidEducation = (req, res, next) => {
  const { error } = validateEducation(req.body);
  return error
    ? res.status(400).json({ error: error.details[0].message })
    : next();
};
