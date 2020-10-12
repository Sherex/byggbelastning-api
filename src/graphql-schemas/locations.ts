import { gql, IResolvers } from 'apollo-server-express'
import { getLocations, getClientCount } from '../lib/db'

export const query = gql`
  type Query {
    locations(name: [String]): [Location]
  }

  type Location {
    id: Int
    name: String
    type: LocationType
    buildings(name: [String]): [Building]
    clientCount: Clients
  }

  type Building {
    id: Int
    name: String
    floors(name: [String]): [Floor]
    clientCount: Clients
  }

  type Floor {
    id: Int
    name: String
    clientCount: Clients
  }

  type Clients {
    timespan(from: String, to: String): [ClientCount]
  }

  type ClientCount {
    time: String
    count: Int
  }

  type LocationType {
    id: Int
    code: String
    name: String
  }
`

export const resolvers: IResolvers<any, any> = {
  Query: {
    locations: async (parent, args, ctx) => {
      const locations = await getLocations()
      if (Array.isArray(args.name)) return locations.filter(loc => args.name.includes(loc.name))
      if (typeof args.name === 'undefined') return locations
      throw Error('Unexpected type on argument "name" of locations, expected [String]')
    }
  },
  Location: {
    id: (parent, args, ctx) => parent.id,
    name: (parent, args, ctx) => parent.name,
    type: (parent, args, ctx) => parent.type,
    buildings: (parent, args, ctx) => parent.buildings,
    clientCount: (parent, args, ctx) => ({ location: parent.name })
  },
  Building: {
    id: (parent, args, ctx) => parent.id,
    name: (parent, args, ctx) => parent.name,
    floors: (parent, args, ctx) => parent.floors,
    clientCount: async (parent, args, ctx) => ({
      location: parent.location,
      building: parent.name
    })
  },
  Floor: {
    id: (parent, args, ctx) => parent.id,
    name: (parent, args, ctx) => parent.name,
    clientCount: async (parent, args, ctx) => ({
      location: parent.location,
      building: parent.building,
      floor: parent.name
    })
  },
  Clients: {
    timespan: async (parent, args, ctx) => {
      return await getClientCount({
        location: parent.location,
        building: parent.building,
        floor: parent.floor,
        timespan: {
          from: args.from,
          to: args.to
        }
      })
    }
  }
}
