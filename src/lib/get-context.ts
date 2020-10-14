import {
  getLocations,
  Location,
  getClientCount,
  ClientCountReturn,
  GetClientCountOptions,
  getClientCoords,
  ClientCoordinate
} from './db'

export interface Context {
  getLocations: () => Promise<Location[]>
  getClientCount: (options: GetClientCountOptions) => Promise<ClientCountReturn[]>
  getClientCoords: () => Promise<ClientCoordinate[]>
}

export function getContext (): Context {
  return {
    getLocations,
    getClientCount,
    getClientCoords
  }
}
