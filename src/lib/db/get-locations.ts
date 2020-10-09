import { logger } from '@vtfk/logger'
import { pool } from './db'

export interface Locations {
  location: string
  building: string
  floor: string
}
export async function getLocations (): Promise<Location[]> {
  logger('debug', ['get-locations', 'getLocations', 'getting locations'])
  const query = `
  SELECT
    l.name AS "location",
    b.name AS "building",
    f.name AS "floor"
  FROM "location" l
  LEFT JOIN building b
    ON l.id = b.location_id
  LEFT JOIN floor f
    ON b.id = f.building_id`
  const response = await pool.query<Locations>(query)
  logger('debug', ['get-locations', 'getLocations', 'getting locations', 'success'])

  const locations: Location[] = []
  response.rows.forEach(row => {
    let location = locations.find(location => row.location === location.name)
    if (location === undefined) {
      locations.push({
        name: row.location,
        buildings: []
      })
      location = locations[locations.length - 1]
    }

    let building = location.buildings.find(building => row.building === building.name)
    if (building === undefined) {
      location.buildings.push({
        name: row.building,
        location: row.location,
        floors: []
      })
      building = location.buildings[location.buildings.length - 1]
    }

    let floor = building.floors.find(floor => row.floor === floor.name)
    if (floor === undefined) {
      building.floors.push({
        name: row.floor,
        location: row.location,
        building: row.building
      })
      floor = building.floors[building.floors.length - 1]
    }
  })
  return locations
}

export interface Location {
  name: string
  buildings: Building[]
}

export interface Building {
  name: string
  location: string
  floors: Floor[]
}

export interface Floor {
  name: string
  location: string
  building: string
}
