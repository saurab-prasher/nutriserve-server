const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    date: { type: String, required: true }
  }
);

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
