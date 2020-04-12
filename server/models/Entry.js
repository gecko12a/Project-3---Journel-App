const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let EntryModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setContent = (content) => _.escape(content).trim();

const EntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  content: {
    type: String,
    required: true,
    trim: true,
    set: setContent,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  date: {
    type: String,
  },


  createdDate: {
    type: Date,
    defualt: Date.now,
  },
});

EntrySchema.statics.toAPI = (doc) => ({
  name: doc.name,
  content: doc.content,
});

EntrySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return EntryModel.find(search).select('name content date').lean().exec(callback);
};

EntryModel = mongoose.model('Entry', EntrySchema);

module.exports.EntryModel = EntryModel;
module.exports.EntrySchema = EntrySchema;
