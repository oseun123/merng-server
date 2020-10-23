const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { generateToken, hashPassword, comparePassword } = require("../../util");

const User = require("../../models/User");

module.exports = {
  Mutation: {
    async register(parent, args, context, info) {
      const {
        registerInput: { username, email, password, confirmPassword },
      } = args;

      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      const hashed = await hashPassword(password);
      const newUser = new User({
        email,
        username,
        password: hashed,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async login(parent, args, context, info) {
      const { username, password } = args;
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Erorrs", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      const match = await comparePassword(password, user.password);

      if (!match) {
        errors.general = "Wrong credentails";
        throw new UserInputError("Wrong credentails", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
