import * as jsonapi from 'utils/json-api-client'
import * as models from 'core/store/models'

/**
 * Show returns the whitelist of config variables
 *
 * @example "<application>/config"
 */
const ENDPOINT = '/v2/log'

export class LogConfig {
  constructor(private api: jsonapi.Api) {}

  /**
   * Get log configuration variables
   */
  public getLogConfig = (): Promise<jsonapi.ApiResponse<models.LogConfig>> => {
    return this.show()
  }

  public updateLogConfig = (
    request: models.LogConfigRequest,
  ): Promise<jsonapi.ApiResponse<models.LogConfig>> => {
    return this.update(request)
  }

  private show = this.api.fetchResource<{}, models.LogConfig, {}>(ENDPOINT)

  private update = this.api.updateResource<
    models.LogConfigRequest,
    models.LogConfig
  >(ENDPOINT)
}
