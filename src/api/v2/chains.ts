import * as jsonapi from 'utils/json-api-client'
import * as models from 'core/store/models'

export const ENDPOINT = '/v2/chains/:network'

export class Chains {
  constructor(private api: jsonapi.Api) {}

  public getChains = (
    network: string,
  ): Promise<jsonapi.ApiResponse<models.Chain[]>> => {
    return this.index(undefined, { network })
  }

  private index = this.api.fetchResource<
    object,
    models.Chain[],
    { network: string }
  >(ENDPOINT)
}
