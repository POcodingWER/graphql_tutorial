import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";
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
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    movie(id: String!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    """
    찾으면 true
    못찾으면 false
    """
    deleteTweet(id: ID!): Boolean!
  }
  """
  REST API -> GQL바꾸는법
  """
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
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
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
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
