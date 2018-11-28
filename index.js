const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { MongoClient } = require('mongodb')
const { readFileSync } = require('fs')
const expressPlayground = require('graphql-playground-middleware-express').default
const resolvers = require('./resolvers')

require('dotenv').config()
var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')

async function start () {
  const app = express()
  const MONGO_DB = process.env.DB_HOST
    const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true })
    db = client.db()

  //add dB connection to the context object and start our server.
  const context = { db }
  
  const server = new ApolloServer({ typeDefs, resolvers, context })
  
  server.applyMiddleware({app})

  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'))

  //Playground route
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))


  // 5. Listen on a specific port
  app.listen({ port: 4000 }, () =>
  console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`))
}

start()

