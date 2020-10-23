const { gql } = require("apollo-server");
module.exports = gql`
  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }
  extend type Mutation {
    likePost(postId: ID!): Post!
  }
`;
