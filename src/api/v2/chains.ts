import * as jsonapi from 'utils/json-api-client'
import * as models from 'core/store/models'

export const ENDPOINT = '/v2/chains/:network'
const UPDATE_ENDPOINT = `${ENDPOINT}/:id`
export class Chains {
  constructor(private api: jsonapi.Api) {}

  public getChains = (
    network: string,
  ): Promise<jsonapi.ApiResponse<models.Chain[]>> => {
    return this.index(undefined, { network })
  }

  public createChain = (
    request: models.CreateChainRequest,
  ): Promise<jsonapi.ApiResponse<models.Chain>> => {
    return this.create(request)
  }

  public destroyChain = (id: string): Promise<jsonapi.ApiResponse<null>> => {
    return this.destroy(undefined, { id })
  }

  public updateChain = (
    id: string,
    req: models.UpdateChainRequest,
  ): Promise<jsonapi.ApiResponse<models.Chain>> => {
    return this.update(req, { id })
  }

  private index = this.api.fetchResource<object, models.Chain[], { network: string }>(ENDPOINT)

  private create = this.api.createResource<
    models.CreateChainRequest,
    models.Chain
  >(ENDPOINT)

  private destroy = this.api.deleteResource<
    undefined,
    null,
    {
      id: string
      network: string
    }
  >(UPDATE_ENDPOINT)

  private update = this.api.updateResource<
    models.UpdateChainRequest,
    models.Chain,
    {
      id: string
      network: string
    }
  >(UPDATE_ENDPOINT)
}
