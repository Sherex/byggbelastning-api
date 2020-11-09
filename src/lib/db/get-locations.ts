import { logger } from '@vtfk/logger'
import { pool } from './db'

interface LocationsResponse {
  location_id: number
  building_id: number
  floor_id: number
  location: string
  building: string
  floor: string
  type_id: number
  type_code: string
  type_name: string
}
export async function getLocations (): Promise<Location[]> {
  logger('debug', ['get-locations', 'getLocations', 'getting locations'])
  const queryTime = Date.now()
  const query = `
  SELECT
    lv.location_id        AS "location_id",
    lv.location_name      AS "location",
    lv.building_id        AS "building_id",
    lv.building_name      AS "building",
    lv.floor_id           AS "floor_id",
    lv.floor_name         AS "floor",
    lv.location_type_id   AS "type_id",
    lv.location_type      AS "type_code",
    lv.location_type_name AS "type_name"
  FROM location_view lv`
  const response = await pool.query<LocationsResponse>(query)
  logger('debug', ['get-locations', 'getLocations', 'getting locations', 'success', 'query time', `${Date.now() - queryTime}ms`])

  const locations: Location[] = []
  response.rows.forEach(row => {
    let location = locations.find(location => row.location === location.name)
    if (location === undefined) {
      locations.push({
        id: row.location_id,
        name: row.location,
        type: {
          id: row.type_id,
          code: row.type_code,
          name: row.type_name
        },
        buildings: []
      })
      location = locations[locations.length - 1]
    }

    let building = location.buildings.find(building => row.building === building.name)
    if (building === undefined) {
      location.buildings.push({
        id: row.building_id,
        name: row.building,
        location: row.location,
        floors: []
      })
      building = location.buildings[location.buildings.length - 1]
    }

    let floor = building.floors.find(floor => row.floor === floor.name)
    if (floor === undefined) {
      building.floors.push({
        id: row.floor_id,
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
  id: number
  name: string
  type: {
    id: number
    code: string
    name: string
  }
  buildings: Building[]
}

export interface Building {
  id: number
  name: string
  location: string
  floors: Floor[]
}

export interface Floor {
  id: number
  name: string
  location: string
  building: string
}
