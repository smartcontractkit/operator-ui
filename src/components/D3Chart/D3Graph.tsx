import React, { useEffect } from 'react'
import {
  Graph,
  GraphConfiguration,
  GraphData,
  GraphLink,
  NodeWithExtraParameters,
} from 'react-d3-graph'
import { Stratify } from 'utils/parseDot'
import { D3Tooltip } from 'components/D3Chart/D3GraphTooltip'
import { theme } from 'theme'
import ELK, { ElkNode } from 'elkjs'
import { ElkExtendedEdge } from 'elkjs/lib/elk-api'
import Pending from 'components/Icons/Pending'
import Success from 'components/Icons/Success'
import ErrorIcon from 'components/Icons/Error'

interface Props {
  nodesData: Array<Stratify>
}

export const D3Graph: React.FC<Props> = ({ nodesData }) => {
  const [d3GraphData, setD3GraphData] = React.useState<
    GraphData<NodeWithExtraParameters, GraphLink>
  >({} as GraphData<NodeWithExtraParameters, GraphLink>)

  React.useEffect(() => {
    const getNode = (nodeID: string): Stratify | undefined => {
      for (const n of nodesData) {
        if (nodeID === n.id) {
          return n
        }
      }
      return undefined
    }

    // We need to calculate the graph layout using elkjs because we want a static chart

    if (!nodesData) {
      return
    }

    const graphData: GraphData<NodeWithExtraParameters, GraphLink> = {
      nodes: [],
      links: [],
    }
    const nodes: ElkNode[] = []
    const edges: ElkExtendedEdge[] = []

    nodesData.map((val) => {
      graphData.nodes.push({
        id: val.id,
      })
      val.parentIds.map((parent) => {
        graphData.links.push({ source: parent, target: val.id })
      })

      //Set nodes and edges that will be used by elkjs to calculate layout
      nodes.push({
        id: val.id,
        width: 90,
        height: 40,
      })
      val.parentIds.map((parent) => {
        edges.push({
          id: `e${val.id}`,
          sources: [val.id],
          targets: [parent],
        })
      })
    })

    // d3ViewGenerator is the function d3-graph-react uses to render the node
    const d3ViewGenerator = (node: NodeWithExtraParameters): JSX.Element => {
      const sNode = getNode(node.id)
      switch (sNode?.attributes?.status) {
        case 'COMPLETE':
          return (
            <Success
              className="task-run-icon-success task-run-icon"
              id={`success-run-icon-${node.id}`}
            />
          )
        case 'ERROR':
          return (
            <ErrorIcon
              className="task-run-icon-error task-run-icon"
              id={`error-run-icon-${node.id}`}
            />
          )
        default:
          return (
            <Pending
              className="task-run-icon-pending task-run-icon"
              id={`pending-run-icon-${node.id}`}
            />
          )
      }
    }

    new ELK()
      .layout(
        {
          id: 'task-list-graph-d3',
          children: nodes,
          edges,
        },
        {
          layoutOptions: {
            'elk.algorithm': 'org.eclipse.elk.layered',
            'elk.direction': 'LEFT',
            'elk.layered.nodePlacement.strategy': 'SIMPLE',
            'elk.layered.wrapping.strategy': 'SINGLE_EDGE',
            'elk.aspectRatio': '1.0f',
            'org.eclipse.elk.padding': '[top=50, left=50, bottom=50, right=5]',
            'elk.layered.spacing.edgeNodeBetweenLayers': '1',
            'elk.zoomToFit': 'TRUE',
            'elk.layered.considerModelOrder.strategy': 'PREFER_EDGES',
            'elk.layered.unnecessaryBendpoints': 'TRUE',
          },
        },
      )
      .then((data) => {
        graphData.nodes = []
        data.children?.map((n) => {
          if (!n.x || !n.y) {
            return
          }
          // @ts-ignore type missmatch
          graphData.nodes.push({
            id: n.id,
            x: `${n.x}`,
            y: `${n.y}`,
            viewGenerator: d3ViewGenerator,
            size: 400,
          } as NodeWithExtraParameters)
        })
        setD3GraphData(graphData)
      })
  }, [nodesData])

  let maxHeight = 0
  d3GraphData.nodes?.map((n) => {
    if (n.y && maxHeight < parseInt(n.y, 10)) {
      maxHeight = parseInt(n.y, 10)
    }
  })

  const heightPadding = 50

  const d3GraphConfig: Partial<
    GraphConfiguration<NodeWithExtraParameters, GraphLink>
  > = {
    automaticRearrangeAfterDropNode: false,
    collapsible: false,
    directed: true,
    disableLinkForce: true,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    height: maxHeight + heightPadding,
    highlightDegree: 0,
    highlightOpacity: 1,
    link: {
      color: '#d3d3d3',
      fontColor: 'black',
      fontSize: 12,
      fontWeight: 'normal',
      highlightColor: 'blue',
      highlightFontSize: 8,
      highlightFontWeight: 'bold',
      mouseCursor: 'pointer',
      opacity: 1,
      renderLabel: false,
      strokeWidth: 3,
      markerHeight: 3,
      markerWidth: 3,
    },
    linkHighlightBehavior: true,
    maxZoom: 3,
    minZoom: 0.3,
    node: {
      color: '#d3d3d3',
      fontColor: 'black',
      fontSize: 14,
      fontWeight: 'normal',
      highlightColor: 'red',
      highlightFontSize: 16,
      highlightFontWeight: 'bold',
      highlightStrokeColor: 'blue',
      labelProperty: 'name',
      mouseCursor: 'pointer',
      opacity: 1,
      renderLabel: true,
      strokeColor: 'none',
      strokeWidth: 2,
      labelPosition: 'top',
    },
    nodeHighlightBehavior: true,
    panAndZoom: true,
    staticGraph: true,
    // @ts-ignore
    width: '100%',
  }

  let mouseX = 0
  let mouseY = 0
  const handleScroll = (e: MouseEvent) => {
    mouseY = e.clientY
    mouseX = e.clientX
  }
  useEffect(() => {
    window.addEventListener('mousemove', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleScroll)
    }
  })

  const onMouseOverNode = function (nodeId: string) {
    const tooltipDiv = document.getElementById(`tooltip-d3-chart-${nodeId}`)
    if (!tooltipDiv) {
      return
    }

    let ttX: number
    let ttY: number
    const minSpaceToEdge = 50
    const tooltipPadding = 10
    if (
      mouseX + tooltipDiv.getBoundingClientRect().width + minSpaceToEdge >
      window.innerWidth
    ) {
      ttX = mouseX - tooltipDiv.getBoundingClientRect().width - tooltipPadding
    } else {
      ttX = mouseX + tooltipPadding
    }

    if (
      mouseY + tooltipDiv.getBoundingClientRect().height + minSpaceToEdge >
      window.innerHeight
    ) {
      ttY = mouseY - tooltipDiv.getBoundingClientRect().height - tooltipPadding
    } else {
      ttY = mouseY + tooltipPadding
    }

    tooltipDiv.style.opacity = String(1)
    tooltipDiv.style.top = `${ttY}px`
    tooltipDiv.style.left = `${ttX}px`
    tooltipDiv.style.zIndex = String(1)
  }
  const onMouseOutNode = function (nodeId: string) {
    const tooltipDiv = document.getElementById(`tooltip-d3-chart-${nodeId}`)
    if (!tooltipDiv) {
      return
    }
    tooltipDiv.style.opacity = String(0)
    tooltipDiv.style.zIndex = String(-1)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', fontWeight: 'normal' }}>
      <Graph
        id="task-list-graph-d3"
        data={d3GraphData}
        config={d3GraphConfig}
        onMouseOverNode={onMouseOverNode}
        onMouseOutNode={onMouseOutNode}
      >
        D3 chart
      </Graph>
      {nodesData.map((n) => {
        return (
          <div
            key={`d3-tooltip-key-${n.id}`}
            id={`tooltip-d3-chart-${n.id}`}
            style={{
              position: 'absolute',
              opacity: '0',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              padding: theme.spacing.unit,
              background: 'white',
              borderRadius: 5,
              zIndex: -1,
              inlineSize: 'min-content',
            }}
          >
            <D3Tooltip data={n} />
          </div>
        )
      })}
    </div>
  )
}
