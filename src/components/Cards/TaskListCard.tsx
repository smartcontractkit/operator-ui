import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'

import { parseDot, Stratify } from 'utils/parseDot'
import { D3Graph } from 'components/D3Chart/D3Graph'

interface Props {
  observationSource?: string
  // A list of additional attributes which will be added to the graph nodes
  // where the id matches.
  attributes?: {
    [key: string]: { [key: string]: string }
  }
}

// TaskListCard renders a card which displays the DAG
export const TaskListCard: React.FC<Props> = ({
  attributes,
  observationSource,
}) => {
  const [state, setState] = React.useState<{
    errorMsg?: string
    graph?: Stratify[]
    mermaidChart?: string
  }>()

  React.useEffect(() => {
    if (observationSource && observationSource !== '') {
      try {
        const graph = parseDot(`digraph {${observationSource}}`)

        if (attributes) {
          for (let i = 0; i < graph.length; i++) {
            const node = graph[i]
            if (attributes[node.id]) {
              graph[i].attributes = {
                ...node.attributes,
                ...attributes[node.id],
              }
            }
          }
        }

        setState({ graph })
      } catch (e) {
        setState({ errorMsg: 'Failed to parse task graph' })
      }
    } else {
      setState({ errorMsg: 'No Task Graph Found' })
    }
  }, [attributes, observationSource, setState])

  return (
    <Card>
      <CardHeader title="Task List" id="graph-max-width" />
      <CardContent>
        {state && state.errorMsg && (
          <Typography align="center" variant="subtitle1">
            {state.errorMsg}
          </Typography>
        )}
        {state && state.graph && <D3Graph nodesData={state.graph} />}
      </CardContent>
    </Card>
  )
}
