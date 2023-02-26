const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: String,
    default: "Employee"
  }],
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Note', noteSchema);
