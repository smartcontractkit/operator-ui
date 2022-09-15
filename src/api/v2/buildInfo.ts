import * as jsonapi from 'utils/json-api-client'
import * as models from 'core/store/models'

const SHOW_ENDPOINT = '/v2/build_info'

export class BuildInfo {
  constructor(private api: jsonapi.Api) {}

  public show = (): Promise<models.BuildInfo> =>
    // /v2/build_info doesn't conform to the typical jsonapi response model,
    // it just returns raw JSON back
    //@ts-expect-error
    this.api.GET<null, models.BuildInfo>(SHOW_ENDPOINT)()
}
