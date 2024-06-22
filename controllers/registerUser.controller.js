const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    const file = req.file; // this is the uploaded image file from multer

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${Date.now()}_${file.originalname}`, // Adding timestamp to make the file name unique
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const data = await s3.upload(params).promise();
      const fileUrl = data.Location; // This is the URL of the uploaded file

      const user = await User.create({
        email,
        password,
        firstname,
        lastname,
        avatarImg: `${fileUrl}`,
      });

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // set to true if you're using https
        sameSite: "strict", // helps prevent CSRF
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.json({
        message: "Success",
        user: { email, firstname, lastname, avatarImg: user.avatarImg },
        token,
      });
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      res.status(500).send("Error uploading file to S3");
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  registerUser,
};
