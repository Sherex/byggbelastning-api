
import { gql } from 'apollo-server-express'
import { getLocations } from '../lib/db'

export const query = gql`
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

export const resolvers = {
  Query: {
    locations: async () => await getLocations()
  }
}
