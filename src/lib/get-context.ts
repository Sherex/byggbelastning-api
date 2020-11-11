import Dataloader from 'dataloader'
import {
  getLocations,
  Location,
  getClientCountArray,
  ClientCount,
  GetClientCountOptions
} from './db'

export interface Context {
  getLocations: () => Promise<Location[]>
  getClientCount: Dataloader<GetClientCountOptions, ClientCount[]>
}

export function getContext (): Context {
  return {
    getLocations,
    getClientCount: new Dataloader<GetClientCountOptions, ClientCount[], String>(
      async options => await getClientCountArray(options),
      {
        cacheKeyFn: keys => JSON.stringify(keys)
      }
    )
  }
}
