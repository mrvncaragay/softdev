const Profile = require('../model/profile');

// @route   GET /api/profiles
// @desc    Retrieve all profiles
// @access  Public
exports.profiles = async (req, res) => {
  const profiles = await Profile.find()
    .sort({ createdAt: -1 })
    .limit(9)
    .populate('user', 'avatar name')
    .select('user status skills');
  if (!profiles) return res.status(400).send('No profile saved.');

  res.json(profiles);
};

// @route   GET /api/profiles/me
// @pre     Execute in order: isObjectIdValid and isJwtValid
// @desc    Current user profile
// @access  Private
exports.profile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id })
    .lean()
    .populate('user', 'name avatar');

  res.json(profile);
};

// @route   PUT /api/profiles/me/experience
// @pre     Execute in order: isJwtValid and isValidExperience
// @desc    Update and add user's profile experience
// @access  Private
exports.addExperience = async (req, res) => {
  // lean - Plain Old Javascript Object (POJO)
  const experience = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $push: { experience: { ...req.body } } },
    { new: true }
  )
    .lean()
    .select('experience -_id');
  if (!experience)
    return res
      .status(404)
      .json({ error: `The profile with the given id was not found.` });

  res.json(experience);
};

// @route   PUT /api/profiles/me/experience/:id
// @pre     Execute in order: isObjectIdValid, isJwtValid, and isValidExperience
// @desc    Update user's profile experience
// @access  Private
exports.updateExperience = async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id, 'experience._id': req.params.id },
    { $set: { 'experience.$': { ...req.body } } },
    { new: true }
  )
    .lean()
    .select('experience -_id');

  if (!profile)
    return res
      .status(404)
      .json({ error: `The profile with the given id was not found.` });

  res.json(profile);
};

// @route   PUT /api/profiles/me/experience/:id
// @pre     Execute in order: isObjectIdValid, isJwtValid
// @desc    Update user's profile experience
// @access  Private
exports.removeExperience = async (req, res) => {
  const experience = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { experience: { _id: req.params.id } } },
    { new: true }
  )
    .lean()
    .select('experience -_id');

  if (!experience)
    return res
      .status(404)
      .json({ error: `The profile with the given id was not found.` });

  res.json(experience);
};

// @route   PUT /api/profiles/me/education
// @pre     Execute in order: isJwtValid and isValidEducation
// @desc    Update and add user's profile education
// @access  Private
exports.addEducation = async (req, res) => {
  const education = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $push: { education: { ...req.body } } },
    { new: true }
  )
    .lean()
    .select('education -_id');
  if (!education)
    return res
      .status(404)
      .json({ error: `The profile with the given id was not found.` });

  res.json(education);
};

// @route   PUT /api/profiles/me/education/:id
// @pre     Execute in order: isObjectIdValid, isJwtValid, and isValidExperience
// @desc    Update user's profile education
// @access  Private
exports.updateEducation = async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id, 'education._id': req.params.id },
    { $set: { 'education.$': { ...req.body } } },
    { new: true }
  )
    .lean()
    .select('education -_id');

  if (!profile)
    return res
      .status(404)
      .json({ error: `The profile with the given id was not found.` });

  res.json(profile);
};

// @route   PUT /api/profiles/me/education/remove/:id
// @pre     Execute in order: isObjectIdValid, isJwtValid, and isValidEducation
// @access  Private
exports.removeEducation = async (req, res) => {
  const education = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { education: { _id: req.params.id } } },
    { new: true }
  )
    .lean()
    .select('education -_id');

  if (!education)
    return res
      .status(404)
      .json({ error: `The profile with the given id was not found.` });

  res.json(education);
};

// @route   GET /api/profiles/user/:id
// @pre     Execute in order: None
// @desc    Get user profile by id
// @access  Public
exports.profileById = async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.id }).populate(
    'user',
    'name avatar'
  );

  res.json(profile);
};

// @route   GET /api/profiles/handle/:handle
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

// @route   DELETE /api/profiles/:id
// @pre     Execute in order: isJwtValid
// @desc    Delete profile
// @access  PRIVATE
exports.remove = async (req, res) => {
  // Check if profile exist
  const profile = await Profile.findById(req.params.id);
  if (!profile) return res.status(403).json({ error: 'Profile not found.' });

  // Check if method is DELETE and the current user is the owner
  if (profile.user.toString() !== req.user.id)
    return res.status(401).json({ error: 'User not authorized' });

  await profile.remove();
  res.json(profile._id);
};

// @route   POST /api/profiles
// @pre     Execute in order: isJwtValid and isBodyValid
// @desc    Create user profile
// @access  Private
exports.create = async (req, res) => {
  let profile = await Profile.findOne({ user: req.user.id });
  if (profile) return res.status(403).json({ error: 'Profile already exist.' });

  const { id: user } = req.user;
  const { youtube, facebook, twiter, linkedin, instagram, ...rest } = req.body;

  profile = await Profile.create({
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

  await profile.populate('user', 'avatar name _id').execPopulate();
  res.json(profile);
};

// @route   PUT /api/profiles/:id
// @pre     Execute in order: isJwtValid and isBodyValid
// @desc    Update user profile
// @access  Private
exports.update = async (req, res) => {
  const profile = await Profile.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  ).populate('user', 'avatar name _id');

  if (!profile)
    return res
      .status(404)
      .json({ error: `The profile with the given id was not found.` });

  res.json(profile);
};

// @route   GET /api/profiles/paginate
// @pre     Execute in order:
// @desc    Pagination request
// @access  Private
exports.pagination = async (req, res) => {
  const { pageNumber, pageSize } = req.query;
  try {
    const profiles = await Profile.find()
      .sort({ createdAt: -1 })
      .skip(Number.parseInt(pageNumber - 1, 10) * Number.parseInt(pageSize, 10))
      .limit(Number.parseInt(pageSize, 10))
      .populate('user', 'avatar name')
      .select('user status skills');

    res.json(profiles);
  } catch (error) {
    console.log(error);
  }
};
