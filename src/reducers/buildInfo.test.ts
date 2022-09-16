import reducer, { INITIAL_STATE } from '../../src/reducers'
import { FetchBuildInfoActionType } from './actions'
describe('reducers/buildInfo', () => {
  it('should set the buildInfo when a response arrives', () => {
    const buildInfoResponseAction = {
      type: FetchBuildInfoActionType.FETCH_BUILD_INFO_SUCCEEDED,
      buildInfo: {
        commitSHA: 'foo',
        version: 'bar',
      },
    } as const

    const state = reducer(INITIAL_STATE, buildInfoResponseAction)
    expect(state.buildInfo.commitSHA).toEqual('foo')
    expect(state.buildInfo.version).toEqual('bar')
  })
})
