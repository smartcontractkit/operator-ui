import React from 'react'
import { Stratify } from 'utils/parseDot'
import Typography from '@material-ui/core/Typography'

interface Props {
  data: Stratify
}

export const D3Tooltip: React.FC<Props> = ({ data }) => {
  const attribs: Array<JSX.Element> = []

  if (data?.attributes) {
    Object.keys(data.attributes).map((keyName) => {
      attribs.push(
        <div key={keyName}>
          <Typography variant="body1" color="textSecondary" component="div">
            <b>{keyName}:</b> {data.attributes?.[keyName]}
          </Typography>
        </div>,
      )
    })
  }

  return (
    <div>
      {data && (
        <Typography variant="body1" color="textPrimary">
          <b>{data.id}</b>
        </Typography>
      )}
      {attribs}
    </div>
  )
}
