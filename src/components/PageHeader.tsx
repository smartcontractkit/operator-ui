import React from 'react'

import { Theme } from '@mui/material/styles'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'

import { Heading1 } from 'src/components/Heading/Heading1'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      minHeight: theme.spacing(6),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing(2),
      width: '100%',
    },
    title: {
      minWidth: 0,
      flex: 1,
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
  })

interface Props extends WithStyles<typeof styles> {
  title: React.ReactNode
  actions?: React.ReactNode
}

export const PageHeader = withStyles(styles)(({
  actions,
  classes,
  title,
}: Props) => {
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Heading1>{title}</Heading1>
      </div>

      {actions && <div className={classes.actions}>{actions}</div>}
    </div>
  )
})
