import React from 'react'
import BaseLink from './BaseLink'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import Typography from '@mui/material/Typography'
import { TypographyProps } from '@mui/material/Typography'
import { grey } from '@mui/material/colors'
import classNames from 'classnames'

type Variant = TypographyProps['variant'] | 'srOnly'
type Color = TypographyProps['color']

const styles = () =>
  createStyles({
    link: {
      color: grey[900],
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
