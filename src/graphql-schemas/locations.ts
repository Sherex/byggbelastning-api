import { gql, IResolvers } from 'apollo-server-express'
import { Context } from '../lib/get-context'

export const query = gql`
  type Query {
    locations(id: [Int]): [Location]
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

export const resolvers: IResolvers<any, Context> = {
  Query: {
    locations: async (parent, args, ctx) => {
      const locations = await ctx.getLocations()
      if (typeof parent?.locationId === 'number') return locations.filter(loc => parent.locationId === loc.id)
      if (Array.isArray(args.id)) return locations.filter(loc => args.id.includes(loc.id))
      if (typeof args.id === 'undefined') return locations
      throw Error('Unexpected type on argument "name" of locations, expected [String]')
    }
  }, // TODO: Each type should get it's own data from the dataloader
  Location: {
    id: (parent, args, ctx) => parent.id,
    name: (parent, args, ctx) => parent.name,
    type: (parent, args, ctx) => parent.type,
    buildings: (parent, args, ctx) => parent.buildings,
    clientCount: (parent, args, ctx) => ({
      type: 'location',
      locationId: parent.id
    })
  },
  Building: {
    id: (parent, args, ctx) => parent.id,
    name: (parent, args, ctx) => parent.name,
    floors: (parent, args, ctx) => parent.floors,
    clientCount: async (parent, args, ctx) => ({
      type: 'building',
      locationId: parent.locationId,
      buildingId: parent.id
    })
  },
  Floor: {
    id: (parent, args, ctx) => parent.id,
    name: (parent, args, ctx) => parent.name,
    clientCount: async (parent, args, ctx) => ({
      type: 'floor',
      locationId: parent.locationId,
      buildingId: parent.buildingId,
      floorId: parent.id
    })
  },
  Clients: {
    timespan: async (parent, args, ctx) => {
      const coords = await ctx.getClientCount.load({
        from: '48h',
        to: '24h'
      })
      const coordsFormatted = coords
        .filter(coord => coord.locationId === parent.locationId)
        .map(coord => ({
          time: coord.time.toISOString(),
          count: coord.clientCount
        }))
      return coordsFormatted
    }
  }
}
