import React from 'react'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import EditIcon from '@material-ui/icons/Edit'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import {
  DetailsCard,
  DetailsCardItemTitle,
  DetailsCardItemValue,
} from 'src/components/Cards/DetailsCard'
import { CopyIconButton } from 'src/components/Copy/CopyIconButton'
import { MenuItemLink } from 'src/components/MenuItemLink'
import { shortenHex } from 'src/utils/shortenHex'
import { ConnectionStatus } from './ConnectionStatus'

interface Props {
  manager: FeedsManagerFields
}

export const FeedsManagerCard = ({ manager }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <DetailsCard
      actions={
        <div>
          <IconButton onClick={handleOpen} aria-label="open-menu">
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItemLink to={`/job_distributors/${manager.id}/edit`}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItemLink>
          </Menu>
        </div>
      }
    >
      <Grid container>
        <Grid item xs={12} sm={6} md={3}>
          <DetailsCardItemTitle title="Status" />
          <ConnectionStatus isConnected={manager.isConnectionActive} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DetailsCardItemTitle title="Name" />
          <DetailsCardItemValue value={manager.name} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DetailsCardItemTitle title="CSA Public Key" />
          <DetailsCardItemValue>
            {shortenHex(manager.publicKey, { start: 6, end: 6 })}
            <CopyIconButton data={manager.publicKey} />
          </DetailsCardItemValue>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DetailsCardItemTitle title="RPC URL" />
          <DetailsCardItemValue value={manager.uri} />
        </Grid>
      </Grid>
    </DetailsCard>
  )
}
