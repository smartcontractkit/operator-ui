import { Theme } from '@mui/material/styles'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import MuiTooltip from '@mui/material/Tooltip'
import React from 'react'

const styles = ({ palette, shadows, typography }: Theme) =>
  createStyles({
    lightTooltip: {
      background: palette.primary.contrastText,
      color: palette.text.primary,
      boxShadow: shadows[24],
      ...typography.h6,
    },
  })

interface Props extends WithStyles<typeof styles> {
  children: React.ReactElement<any>
  title: string
}

const UnstyledTooltip = ({ title, children, classes }: Props) => {
  return (
    <MuiTooltip title={title} classes={{ tooltip: classes.lightTooltip }}>
      {children}
    </MuiTooltip>
  )
}

export const Tooltip = withStyles(styles)(UnstyledTooltip) as typeof MuiTooltip
