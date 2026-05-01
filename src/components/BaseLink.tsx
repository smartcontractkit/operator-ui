import React from 'react'
import { Link } from 'react-router-dom'

const RouterLink = Link as unknown as React.ComponentType<any>

interface Props {
  children: React.ReactNode
  href: string
  id?: string
  className?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

const BaseLink = ({ children, href, id, className, onClick }: Props) => (
  <RouterLink to={href} id={id} className={className} onClick={onClick}>
    {children}
  </RouterLink>
)

export default BaseLink
