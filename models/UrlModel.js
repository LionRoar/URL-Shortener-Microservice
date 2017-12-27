const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create url schema & model

const urlSchema = new Schema({
  origin:{
    type: String,
    required: [true,"THE URL IS REQUIRED"]
  },
  _id:{type:Number, index:true}
  });


const Url = mongoose.model('urlshortener',urlSchema);

module.exports = Url;
