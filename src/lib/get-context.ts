import {
  getLocations,
  Location,
  getClientCount,
  ClientCount,
  GetClientCountOptions
} from './db'

export interface Context {
  getLocations: () => Promise<Location[]>
  getClientCount: (options: GetClientCountOptions) => Promise<ClientCount[]>
}

export function getContext (): Context {
  return {
    getLocations,
    getClientCount
  }
}
