const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  personalEmail: {
    type: String,
    required: true
  },
  collegeEmail: {
    type: String,
    required:true
  },
  branch: {
    type: String,
    required: true
  },
  tenthMarks: {
    type: Number,
    required: true
  },
  twelfthMarks: {
    type: Number,
    required: true
  },
  currentCgpa: {
    type: Number,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  btechOrMtech: {
    type: String,
    enum: ['BTech', 'MTech'],
    required: true
  },
  Sgpa: {
    type: Number
  },
  tenthPassYear: {
    type: Number,
    required: true
  },
  twelfthPassYear: {
    type: Number,
    required: true
  },
  backlogsCurrent: {
    type: Number
  },
  resume: {
    type: String,
    required:true
  }
});

module.exports = mongoose.model('Form', formSchema);