import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import React from 'react'

interface Props {
  children: string
  divider?: boolean
}

export const CardTitle = ({ children, divider = false }: Props) => {
  return (
    <React.Fragment>
      <CardContent>
        <Typography variant="h5" color="secondary">
          {children}
        </Typography>
      </CardContent>

      {divider && <Divider />}
    </React.Fragment>
  )
}
