import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import { CopyButton } from 'src/components/Copy/CopyButton'
import { generateJobDefinition } from './generateJobDefinition'

interface Props {
  job: JobPayload_Fields
}

export const TabDefinition = ({ job }: Props) => {
  const { definition } = generateJobDefinition(job)

  return (
    <Card>
      <CardHeader
        title="Definition"
        action={<CopyButton title="Copy" data={definition} />}
      />
      <CardContent>
        <Typography style={{ margin: 0 }} variant="body1" component="pre">
          <SyntaxHighlighter
            language="toml"
            style={prism}
            data-testid="definition"
          >
            {definition}
          </SyntaxHighlighter>
        </Typography>
      </CardContent>
    </Card>
  )
}
