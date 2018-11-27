// 1. Require `apollo-server-express` and `express`
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { readFileSync } = require('fs')
const expressPlayground = require('graphql-playground-middleware-express').default
const resolvers = require('./resolvers')

//require('dotenv').config()
const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')

const { GraphQLScalarType } = require ('graphql');

// 2. Call `express()` to create an Express application
var app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers
  })

// 3. Call `applyMiddleware()` to allow middleware mounted on the same path
  server.applyMiddleware({app})

  // 4. Create a home route
  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'))

  //Playground route
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))


  // 5. Listen on a specific port
  app.listen({ port: 4000 }, () =>
  console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`))
