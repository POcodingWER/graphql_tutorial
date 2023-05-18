import { ApolloServer, gql } from "apollo-server";
/*
소스 보는곳
아폴로 : https://studio.apollographql.com/sandbox/schema/reference/objects/Mutation
알타 : https://altair-gql.sirmuel.design/
*/
let tweets = [
  {
    id: "1",
    text: "first hello",
    userId: "2",
  },
  {
    id: "2",
    text: "second hello",
    userId: "1",
  },
];
let users = [
  {
    id: "1",
    firstName: "pi",
    lastName: "zza",
  },
  {
    id: "2",
    firstName: "kim",
    lastName: "bob",
  },
];
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    문자열로서의 firstName + lastName의 합
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for  a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    """
    찾으면 true
    못찾으면 false
    """
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      // 2번째 인자에서 아규먼트 가져올수있음
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("allUsers called!");
      return users;
    },
  },

  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },

  User: {
    fullName({ firstName, lastName }) {
      console.log("fullName called!");
      // console.log(root);
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
