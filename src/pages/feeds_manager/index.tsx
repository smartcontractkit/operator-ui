import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import Content from 'components/Content'
import { JobDistributorsScreen } from 'src/screens/JobDistributors/JobDistributorsScreen'
import { EditFeedsManagerScreen } from '../../screens/EditFeedsManager/EditFeedsManagerScreen'
import { FeedsManagerScreen } from '../../screens/FeedsManager/FeedsManagerScreen'
import { NewFeedsManagerScreen } from '../../screens/NewFeedsManager/NewFeedsManagerScreen'

export const FeedsManagerPage = function () {
  const { path } = useRouteMatch()

  return (
    <Content>
      <Switch>
        <Route exact path={path}>
          <JobDistributorsScreen />
        </Route>

        <Route exact path={`${path}/new`}>
          <NewFeedsManagerScreen />
        </Route>

        <Route exact path={`${path}/:id`}>
          <FeedsManagerScreen />
        </Route>

        <Route exact path={`${path}/:id/edit`}>
          <EditFeedsManagerScreen />
        </Route>
      </Switch>
    </Content>
  )
}
