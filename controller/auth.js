const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const multer = require("multer");
const jimp = require("jimp");
const path = require("path");
const { promisify } = require("util");

const { SECRET_KEY } = process.env;
const { controllerWrapper, HttpError } = require("../erorr");
const { User } = require("../models/user");

const upload = multer({ dest: "tmp/" });

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "identicon" });
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

const current = (req, res) => {
  const { email, subscription, avatarURL } = req.user;

  res.json({
    email,
    subscription,
    avatarURL,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  const { path: tmpPath, originalname } = req.file;
  const image = await jimp.read(tmpPath);
  await image.cover(250, 250).writeAsync(tmpPath);
  const uniqueAvatarName = `${req.user._id}-${Date.now()}-${originalname}`;
  const avatarPath = path.join(__dirname, '../public/avatars', uniqueAvatarName);
  await promisify(require('fs').rename)(tmpPath, avatarPath);
  const avatarURL = `/avatars/${uniqueAvatarName}`;
  await User.findByIdAndUpdate(req.user._id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  current: controllerWrapper(current),
  logout: controllerWrapper(logout),
  updateAvatar: controllerWrapper(updateAvatar),
};
