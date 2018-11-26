const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require ('graphql');

const typeDefs = `

    enum PhotoCategory {
      SELFIE
      PORTRAIT
      ACTION
      LANDSCAPE
      GRAPHIC
    }

    scalar DateTime
    
    input PostPhotoInput {
      name: String!
      description: String
      category: PhotoCategory=PORTRAIT
    }

    type User {
      githubLogin: ID
      name: String
      avatar: String
      postedPhotos: [Photo!]!
      inPhotos: [Photo!]!
    }

    type Photo {
      id: ID!
      name: String!
      url: String!
      description: String
      category: PhotoCategory!
      created: DateTime!
      postedBy: User!
      taggedUsers: [User!]!
    }

    type Query {
        totalPhotos: Int!
        allPhotos : [Photo!]!
    }

    type Mutation {
      postPhoto(input: PostPhotoInput): Photo!  
    }  

`
var _id= 0
var users = [
  { "githubLogin": "mHattrup", "name": "Mike Hattrup" },
  { "githubLogin": "gPlake", "name": "Glen Plake" },
  { "githubLogin": "sSchmidt", "name": "Scot Schmidt" }
]

var photos = [
  {
    "id": "1",
    "name": "Dropping the Heart Chute",
    "description": "The heart chute is one of my favorite chutes",
    "category": "ACTION",
    "created": "3-28-1977",
    "githubUser": "gPlake",
    

  },
  {
    "id": "2",
    "name": "Enjoying the sunshine",
    "category": "SELFIE",
    "created": "1-2-1985",
    "githubUser": "sSchmidt",
    
  },
  {
    id: "3",
    "name": "Gunbarrel 25",
    "description": "25 laps on gunbarrel today",
    "category": "LANDSCAPE",
    "created": "2018-04-15T19:09:57.308Z",
    "githubUser": "sSchmidt",
  }
]

var tags = [
  { "photoID": "1", "userID": "gPlake" },
  { "photoID": "2", "userID": "sSchmidt" },
  { "photoID": "2", "userID": "mHattrup" },
  { "photoID": "2", "userID": "gPlake" }
]

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },

  Mutation: {
    postPhoto(parent,args){
      var newPhoto = {
        id: _id++,
      ...args.input,
      created: new Date()
      }
      photos.push(newPhoto)
      return newPhoto
    }
  },
  
  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: parent => { 
      return users.find(u => u.githubLogin === parent.githubUser)
    },
    taggedUsers: parent => tags

      // Returns an array of tags that only contain the current photo
      .filter(tag => tag.photoID === parent.id)

      // Converts the array of tags into an array of userIDs
      .map(tag => tag.userID)

      // Converts array of userIDs into an array of user objects
      .map(userID => users.find(u => u.githubLogin === userID))

    },

  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin)
    },
    inPhotos: parent => tags

      // Returns an array of tags that only contain the current user
      .filter(tag => tag.userID === parent.githubLogin)

      // Converts the array of tags into an array of photoIDs
      .map(tag => tag.photoID)

      // Converts array of photoIDs into an array of photo objects
      .map(photoID => photos.find(p => p.id === photoID)) 
    },

  DateTime: new GraphQLScalarType ({
    name: 'DateTime',
    description: 'A valid date and time',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
}

console.log(photos[1].created);

// 2. Create a new instance of the server.
// 3. Send it an object with typeDefs (the schema) and resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers
  })
  
  
  // 4. Call listen on the server to launch the web server
  server
    .listen()
    .then(({url}) => console.log(`GraphQL Service running on ${url}`))