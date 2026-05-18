import React from 'react'
import { Link, LinkProps } from 'react-router-dom'

interface Props extends Omit<LinkProps, 'to'> {
  href: string
}

// forwardRef is required so MUI v5's ButtonBase can attach a ref when this
// component is passed as the `component` prop.
const BaseLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ href, children, ...rest }, ref) => (
    <Link to={href} ref={ref} {...rest}>
      {children}
    </Link>
  ),
)
BaseLink.displayName = 'BaseLink'

export default BaseLink
