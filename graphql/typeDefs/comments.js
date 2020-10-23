const { gql } = require("apollo-server");
module.exports = gql`
  type Comment {
    id: ID!
    username: String!
    createdAt: String!
    body: String!
  }
  extend type Mutation {
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID, commentId: ID!): Post!
  }
`;
