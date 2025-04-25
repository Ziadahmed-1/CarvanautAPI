import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User, { validateLogin, validateRegister } from "../models/user.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const { error } = validateRegister({ email, password, name });
  if (error) return res.status(400).json(error.details[0].message);

  try {
    const foundBefore = await User.findOne({ email });
    if (foundBefore) return res.status(400).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    const result = await newUser.save();
    res.status(200).json({
      _id: result._id,
      name: result.name,
      email: result.email,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateLogin({ email, password });
  if (error) return res.status(400).json(error.details[0].message);

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export default router;
