
import { gql, IResolvers } from 'apollo-server-express'
import { getLocations, getClientCount } from '../lib/db'

export const query = gql`
  type Query {
    locations: [Location]
  }

  type Location {
    name: String
    buildings: [Building]
    clientCount: [Clients]
  }

  type Building {
    name: String
    floors: [Floor]
  }

  type Floor {
    name: String
  }

  type Clients {
    timespan: [ClientCount]
  }

  type ClientCount {
    time: String
    count: Int
  }
`

export const resolvers: IResolvers<any, any> = {
  Query: {
    locations: async () => await getLocations()
  },
  Clients: {
    timespan: async (parent, args, ctx) => {
      console.log(`##### ${parent.name as string}`)
      return await getClientCount({ location: parent.name })
    }
  }
}
