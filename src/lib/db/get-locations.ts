import { logger } from '@vtfk/logger'
import { pool } from './db'

export interface Locations {
  campus: string
  building: string
  floor: string
  imageBase64: string
  imageLength: number
  imageWidth: number
  imageOffsetX: number
  imageOffsetY: number
}

export async function getLocations (): Promise<Campus[]> {
  logger('debug', ['get-locations', 'getLocations', 'getting locations'])
  const query = `
  SELECT
    campus,
    building,
    floor
  FROM locations`
  const response = await pool.query<Locations>(query)
  logger('debug', ['get-locations', 'getLocations', 'getting locations', 'success'])

  const locations: Campus[] = []
  response.rows.forEach(row => {
    let campus = locations.find(campus => row.campus === campus.name)
    if (campus === undefined) {
      locations.push({
        name: row.campus,
        buildings: []
      })
      campus = locations[locations.length - 1]
    }

    let building = campus.buildings.find(building => row.building === building.name)
    if (building === undefined) {
      campus.buildings.push({
        name: row.building,
        location: row.campus,
        floors: []
      })
      building = campus.buildings[campus.buildings.length - 1]
    }

    let floor = building.floors.find(floor => row.floor === floor.name)
    if (floor === undefined) {
      building.floors.push({
        name: row.floor,
        location: row.campus,
        building: row.building
      })
      floor = building.floors[building.floors.length - 1]
    }
  })
  return locations
}

export interface Campus {
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
