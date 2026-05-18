import React from 'react'
import BaseLink from './BaseLink'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import Typography from '@mui/material/Typography'
import { TypographyProps } from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'
import classNames from 'classnames'

type Variant = TypographyProps['variant']
type Color = TypographyProps['color']

const styles = (theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
    linkContent: {
      display: 'inline-block',
    },
  })

interface Props extends WithStyles<typeof styles> {
  children: React.ReactNode
  href: string
  variant?: Variant
  color?: Color
  className?: string
}

const Link = ({
  children,
  classes,
  className,
  href,
  variant,
  color,
}: Props) => {
  const v = variant || 'body1'
  const c = color || 'inherit'

  return (
    <BaseLink href={href} className={classNames(classes.link, className)}>
      <Typography variant={v} color={c} className={classes.linkContent}>
        {children}
      </Typography>
    </BaseLink>
  )
}

export default withStyles(styles)(Link)
