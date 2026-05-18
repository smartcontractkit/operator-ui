import React from 'react'
import { Link } from 'react-router-dom'
import Tab, { TabProps } from '@mui/material/Tab'

interface TabLinkProps extends TabProps {
  to: string
}

export const TabLink = (props: TabLinkProps) => {
  return (
    <Tab {...props} component={Link as any}>
      {props.children}
    </Tab>
  )
}
