import { BuildInfo } from 'core/store/models'
import { Reducer } from 'redux'
import { Actions, FetchBuildInfoActionType } from './actions'

export type State = BuildInfo

export const INITIAL_STATE: BuildInfo = {
  commitSHA: 'unknown',
  version: 'unknown',
}

const reducer: Reducer<State, Actions> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FetchBuildInfoActionType.FETCH_BUILD_INFO_SUCCEEDED: {
      return { ...action.buildInfo }
    }
  }
  return state
}

export default reducer
