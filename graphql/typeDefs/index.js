const baseTypeDefs = require("./base");
const usersTypeDefs = require("./users");
const postsTypeDefs = require("./posts");
const commentsTypeDefs = require("./comments");
const likesTypeDefs = require("./likes");

module.exports = [
  baseTypeDefs,
  usersTypeDefs,
  postsTypeDefs,
  commentsTypeDefs,
  likesTypeDefs,
];
