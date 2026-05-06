import React from 'react'

import Button from 'src/components/Button'
import { Theme } from '@mui/material/styles'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { KeyBundle } from './KeyBundle'
import { CopyIconButton } from 'src/components/Copy/CopyIconButton'

const styles = (theme: Theme) =>
  createStyles({
    cardContent: {
      padding: 0,
      '&:last-child': {
        padding: 0,
      },
    },
    avatar: {
      backgroundColor: theme.palette.grey[800],
    },
  })

interface Props extends WithStyles<typeof styles> {
  p2pKey: P2PKeysPayload_ResultsFields
  onDelete: () => void
}

export const P2PKeyRow = withStyles(styles)(({
  classes,
  p2pKey,
  onDelete,
}: Props) => {
  return (
    <TableRow hover>
      <TableCell>
        <KeyBundle
          classes={{ avatar: classes.avatar }}
          primary={
            <b>
              Peer ID: {p2pKey.peerID} <CopyIconButton data={p2pKey.peerID} />
            </b>
          }
          secondary={[<>Public Key: {p2pKey.publicKey}</>]}
        />
      </TableCell>
      <TableCell align="right">
        <Button onClick={onDelete} variant="danger" size="medium">
          Delete
        </Button>
      </TableCell>
    </TableRow>
  )
})
