const Joi = require('@hapi/joi');
const Profile = require('../model/profile');

const validate = profile => {
  const schema = {
    user: Joi.string(),
    handle: Joi.string()
      .max(40)
      .required(),
    company: Joi.string(),
    website: Joi.string().uri(),
    locaton: Joi.string(),
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
    bio: Joi.string(),
    githubusername: Joi.string(),
    youtube: Joi.string().uri(),
    facebook: Joi.string().uri(),
    twitter: Joi.string().uri(),
    linkedin: Joi.string().uri(),
    instagram: Joi.string().uri()
  };

  return Joi.validate(profile, schema, { abortEarly: false });
};

const validateExperience = experience => {
  const schema = {
    title: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string(),
    from: Joi.date().required(),
    to: Joi.date(),
    current: Joi.boolean(),
    description: Joi.string()
  };

  return Joi.validate(experience, schema, { abortEarly: false });
};

const validateEducation = education => {
  const schema = {
    school: Joi.string().required(),
    degree: Joi.string().required(),
    filedOfStudy: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date(),
    current: Joi.boolean(),
    description: Joi.string()
  };

  return Joi.validate(education, schema, { abortEarly: false });
};

exports.isBodyValid = (req, res, next) => {
  const { error } = validate(req.body);
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

exports.isProfileExist = async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    'User',
    'avatar name _id -_id'
  );
  // Check if we found a profile
  if (!profile)
    return res
      .status(404)
      .json({ error: `The profile with the given id was not found.` });

  // Save post reference to req.post
  req.profile = profile;
  next();
};

exports.isProfileOwner = (req, res, next) => {
  // Check if method is DELETE and the current user is the owner
  if (req.profile.user.toString() !== req.user.id)
    return res.status(401).json({ error: 'User not authorized' });

  next();
};
