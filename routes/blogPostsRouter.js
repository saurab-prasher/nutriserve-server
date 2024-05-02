const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

// router.post("/", async (req, res) => {
//     try {
//       const blogPosts = new Blog(req.body);
//       const savedBlogPost = await blogPosts.save();

//       res.status(201).json(savedBlogPost);
//     } catch (error) {
//       res.status(400).json({ error: "Failed to create blog post", message: error.message });
//     }
// });

// READ all blog posts
router.get("/", async (req, res) => {
  try {
    const blogPosts = await Blog.find();

    res.json(blogPosts);
  } catch (error) {
    console.error("Error retrieving blog posts:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve blog posts", message: error.message });
  }
});

module.exports = router;
