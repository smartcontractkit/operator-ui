import React from 'react'

import { useLocation } from 'react-router-dom'

import { Theme } from '@mui/material/styles'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import Tabs from '@mui/material/Tabs'
import { TabLink } from 'src/components/Tab/TabLink'

const styles = (theme: Theme) =>
  createStyles({
    tabs: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2.5),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    badge: {
      padding: `0 ${theme.spacing(2)}`,
    },
  })

export interface Props extends WithStyles<typeof styles> {
  id: string
}

enum JobRunTab {
  Overview,
  JSON,
}

export const JobRunTabs = withStyles(styles)(({ classes, id }: Props) => {
  const { pathname } = useLocation()

  const tabs = React.useMemo(
    () => ({
      [JobRunTab.Overview]: `/runs/${id}`,
      [JobRunTab.JSON]: `/runs/${id}/json`,
    }),
    [id],
  )

  return (
    <Tabs value={pathname} className={classes.tabs} indicatorColor="primary">
      <TabLink
        label="Overview"
        to={tabs[JobRunTab.Overview]}
        value={tabs[JobRunTab.Overview]}
      />
      <TabLink
        label="JSON"
        to={tabs[JobRunTab.JSON]}
        value={tabs[JobRunTab.JSON]}
      />
    </Tabs>
  )
})
