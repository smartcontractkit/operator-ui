import React from 'react'
import { Link } from 'react-router-dom'
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem'

interface MenuItemLinkProps extends MenuItemProps {
  to: string
  replace?: boolean
}

export const MenuItemLink = (props: MenuItemLinkProps) => {
  const { to, replace, children, ...rest } = props
  const linkProps = { ...rest, component: Link as any, to, replace } as any

  return <MenuItem {...linkProps}>{children}</MenuItem>
}
