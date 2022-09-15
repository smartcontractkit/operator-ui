import { AppState } from 'reducers'

export const selectBuildInfo = ({ buildInfo }: Pick<AppState, 'buildInfo'>) =>
  buildInfo
