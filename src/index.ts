import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import { getLocations } from './lib/db'

const typeDefs = gql`
  type Query {
    locations: [Location]
  }

  type Location {
    name: String
    buildings: [Building]
  }

  type Building {
    name: String
    floors: [Floor]
  }

  type Floor {
    name: String
  }

  type Clients {
    current: Int
    timespan: [Int]
  }
`

const resolvers = {
  Query: {
    locations: async () => await getLocations()
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const app = express()
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
