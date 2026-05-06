import React from 'react'
import { Link, LinkProps } from 'react-router-dom'

interface Props extends Omit<LinkProps, 'to'> {
  href: string
}

const BaseLink = ({ href, children, ...rest }: Props) => (
  <Link to={href} {...rest}>
    {children}
  </Link>
)

export default BaseLink
