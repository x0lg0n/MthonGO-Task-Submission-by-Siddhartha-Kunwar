const { status } = require('express/lib/response');
const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  class: { type: String, required: true },
  unit: { type: String, required: true },
  yearWiseQuestionCount: { type: Map, of: Number },
  questionSolved: { type: Number, default: 0 },
  status: { type: String, required: true  },
  isWeakChapter: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  // Add validation examples based on the provided data structure
  validateBeforeSave: true
});

module.exports = mongoose.model('Chapter', chapterSchema);