const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// submit a message
router.post("/", async (req, res) => {
    try {
      const contact = new Contact(req.body);
      const savedContact = await contact.save();
      console.log(savedContact);
      res.status(201).json(savedContact);
    } catch (error) {
      res.status(400).json({ error: "Failed to submit a message", message: error.message });
    }
  });

module.exports = router;