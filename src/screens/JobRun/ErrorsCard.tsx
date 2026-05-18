import React from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

interface Props {
  errors: ReadonlyArray<string>
}

export const ErrorsCard: React.FC<Props> = ({ errors }) => {
  return (
    <Card>
      <CardHeader title="Errors" />
      <ul>
        {errors.map((error, index) => (
          <li key={error + index}>
            <Typography variant="body1">{error}</Typography>
          </li>
        ))}
      </ul>
    </Card>
  )
}
