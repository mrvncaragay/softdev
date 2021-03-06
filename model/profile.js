const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    handle: {
      type: String,
      required: true,
      maxLength: 40,
      unique: true,
      index: true
    },

    company: {
      type: String
    },

    website: {
      type: String
    },

    location: {
      type: String
    },

    status: {
      type: String,
      enum: [
        'Software Developer',
        'Backend Developer',
        'Frontend Developer',
        'Student',
        'Instructor'
      ],
      required: true
    },

    skills: {
      type: [String],
      required: true
    },

    bio: {
      type: String
    },

    githubusername: {
      type: String
    },

    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String },
        from: { type: Date, required: true },
        to: { type: Date, default: '' },
        current: { type: Boolean, default: false },
        description: { type: String }
      }
    ],

    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String },
        from: { type: Date, required: true },
        to: { type: Date, default: '' },
        current: { type: Boolean, default: false },
        description: { type: String }
      }
    ],

    social: {
      youtube: { type: String },
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      instagram: { type: String }
    }
  },
  {
    timestamps: true
  }
);

/*
 *  @desc     Format the experience date after query
 *  @param    none
 *  @return   POJO object
 */
// profileSchema.post(['findOne', 'findOneAndUpdate'], function(result, next) {
//   if (result) {
//     result.experience = result.experience.map(exp => {
//       if (exp.from) {
//         exp.from = moment(exp.from).format('MMM YYYY');
//       }

//       if (exp.to) {
//         exp.to = moment(exp.to).format('MMM YYYY');
//       }

//       return exp;
//     });
//   }
// });

module.exports = mongoose.model('Profile', profileSchema);
