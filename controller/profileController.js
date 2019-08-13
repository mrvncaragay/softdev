const Profile = require('../model/profile');

// @route   GET /api/profiles
// @desc    Retrieve all profiles
// @access  Public
exports.profiles = async (req, res) => {
  const profiles = await Profile.find().populate('user', 'avatar name -_id');
  if (!profiles) return res.status(400).send('No profile saved.');

  res.json({ profiles: profiles });
};

// @route   GET /api/profiles/me
// @pre     Execute in order: isObjectIdValid, isJwtValid and isProfileExists
// @desc    Current user profile
// @access  Private
exports.profile = async (req, res) => {
  res.json({ me: req.profile });
};

// @route   PUT /api/profiles/me/experience
// @pre     Execute in order: isJwtValid, isProfileExists, and isValidExperience
// @desc    Update and add user's profile experience
// @access  Private
exports.experience = async (req, res) => {
  let { profile } = req;

  profile.experience.push(req.body);
  profile = await profile.save();
  res.json({ me: profile });
};

// @route   PUT /api/profiles/me/experience/:id
// @pre     Execute in order: isObjectIdValid, isProfileExists, isJwtValid, and isValidExperience
// @desc    Update and remove user's profile experience
// @access  Private
exports.removeExperience = async (req, res) => {
  let { profile } = req;

  profile.experience.pull({ _id: req.params.id });
  profile = await profile.save();
  res.json({ me: profile });
};

// @route   PUT /api/profiles/me/education
// @pre     Execute in order: isJwtValid, isProfileExists, and isValidEducation
// @desc    Update and add user's profile education
// @access  Private
exports.education = async (req, res) => {
  let { profile } = req;

  profile.education.push(req.body);
  profile = await profile.save();
  res.json({ me: profile });
};

// @route   PUT /api/profiles/me/education/:id
// @pre     Execute in order: isObjectIdValid, isProfileExists, isJwtValid, and isValidEducation
// @access  Private
exports.removeEducation = async (req, res) => {
  let { profile } = req;

  profile.education.pull({ _id: req.params.id });
  profile = await profile.save();
  res.json({ me: profile });
};

// @route   GET /api/user/:id
// @pre     Execute in order: None
// @desc    Get user profile by id
// @access  Public
exports.profileById = async (req, res) => {
  const profile = await Profile.findById(req.params.id).populate(
    'user',
    'name avatar -_id'
  );
  if (!profile)
    return res
      .status(404)
      .json({ error: `The profile with the given id was not found.` });

  res.json(profile);
};

// @route   GET /api/handle/:handle
// @pre     Execute in order: None
// @desc    Get user profile by handle
// @access  Public
exports.profileByHandle = async (req, res) => {
  const profile = await Profile.findOne({ handle: req.params.handle }).populate(
    'user',
    'name avatar -_id'
  );
  if (!profile)
    return res
      .status(400)
      .json({ error: `The profile with the given handle was not found.` });

  res.json(profile);
};

// @route   DELETE /api/profiles
// @pre     Execute in order: isProfileExists and isProfileOwner
// @desc    Delete profile
// @access  PRIVATE
exports.remove = async (req, res) => {
  await req.profile.remove();
  res.json(req.profile);
};

// @route   POST /api/profile
// @pre     Execute in order: hasProfile and isBodyValid
// @desc    Create user profile
// @access  Private
exports.create = async (req, res) => {
  const { id: user } = req.user;
  const { youtube, facebook, twiter, linkedin, instagram, ...rest } = req.body;
  const profile = new Profile({
    user,
    ...rest,
    social: {
      youtube,
      facebook,
      twiter,
      linkedin,
      instagram
    }
  });

  await profile.save();

  res.json({ me: profile });
};
