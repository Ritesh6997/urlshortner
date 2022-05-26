const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ShortUrlSchema = new Schema({
  url: { type: String, required: true },
  slug: { type: String, required: true },
  // shortId:{type:String,required:true},
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: "5m" },
  },
});

const ShortUrl = mongoose.model("shortUrl", ShortUrlSchema)

module.exports = ShortUrl