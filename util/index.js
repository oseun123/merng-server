const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();
const { SECRET_KEY } = process.env;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
};
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (inputpassword, datapassword) => {
  return await bcrypt.compare(inputpassword, datapassword);
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
};
