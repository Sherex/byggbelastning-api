import { logger } from '@vtfk/logger'
import { Pool } from 'pg'
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
  const query = 'SELECT campus, building, floor, uid as cid, x, y FROM clients_coordinates'
  const response = await pool.query(query)
  logger('debug', ['db', 'getClientCoords', 'getting coordinates', 'success'])
  return response.rows
}

export async function getLocations (): Promise<any[]> {
  return ['...']
}
