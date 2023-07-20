import * as jsonapi from 'utils/json-api-client'
import * as models from 'core/store/models'

export const ENDPOINT = '/v2/nodes'

export class Nodes {
  constructor(private api: jsonapi.Api) {}

  public getNodes = (): Promise<jsonapi.ApiResponse<models.Node[]>> => {
    return this.index()
  }

  public createNode = (
    request: models.CreateNodeRequest,
  ): Promise<jsonapi.ApiResponse<models.Node>> => {
    return this.create(request)
  }

  private index = this.api.fetchResource<object, models.Node[]>(ENDPOINT)

  private create = this.api.createResource<
    models.CreateNodeRequest,
    models.Node
  >(ENDPOINT)
}
