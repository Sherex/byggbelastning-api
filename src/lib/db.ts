/* eslint-disable-next-line @typescript-eslint/triple-slash-reference */
/// <reference path="vtfk-logger.d.ts"/>
import { logger } from '@vtfk/logger'
import { Pool, QueryResult } from 'pg'
import { config } from '../config'

const pool = new Pool(config.db)

export interface ClientCoordinate {
  campus: string
  building: string
  floor: string
  cid: string
  x: number
  y: number
}

export async function getClientCoords (): Promise<ClientCoordinate[]> {
  logger('debug', ['db', 'getClientCoords', 'getting coordinates'])
  const query = 'SELECT campus, building, floor, cid, x, y FROM clients_coordinates'
  const response = await pool.query(query)
  logger('debug', ['db', 'getClientCoords', 'getting coordinates', 'success'])
  return response.rows
}

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

export async function getLocations (): Promise<any[]> {
  logger('debug', ['db', 'getLocations', 'getting locations'])
  const query = `
  SELECT
    campus,
    building,
    floor
  FROM locations`
  const response: QueryResult<Locations> = await pool.query(query)
  logger('debug', ['db', 'getLocations', 'getting locations', 'success'])

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
        floors: []
      })
      building = campus.buildings[campus.buildings.length - 1]
    }

    let floor = building.floors.find(floor => row.floor === floor.name)
    if (floor === undefined) {
      building.floors.push({
        name: row.floor
      })
      floor = building.floors[building.floors.length - 1]
    }
  })
  return locations
}

interface Campus {
  name: string
  buildings: Building[]
}

interface Building {
  name: string
  floors: Floor[]
}

interface Floor {
  name: string
}
