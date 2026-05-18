import React from 'react'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import {
  DetailsCard,
  DetailsCardItemTitle,
  DetailsCardItemValue,
} from 'src/components/Cards/DetailsCard'
import { MenuItemLink } from 'src/components/MenuItemLink'

interface Props {
  bridge: BridgePayload_Fields
  onDelete: () => void
}

export const BridgeCard: React.FC<Props> = ({ bridge, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onDeleteClick = () => {
    onDelete()
    setAnchorEl(null)
  }

  return (
    <DetailsCard
      actions={
        <div>
          <IconButton onClick={handleOpen} aria-label="open-menu" size="large">
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItemLink to={`/bridges/${bridge.id}/edit`}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItemLink>
            <MenuItem onClick={onDeleteClick}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      }
    >
      <Grid container>
        <Grid item xs={12} sm={4} md={4}>
          <DetailsCardItemTitle title="Name" />
          <DetailsCardItemValue value={bridge.name} />
        </Grid>

        <Grid item xs={12} sm={4} md={8}>
          <DetailsCardItemTitle title="URL" />
          <DetailsCardItemValue value={bridge.url} />
        </Grid>

        <Grid item xs={12} sm={4} md={4}>
          <DetailsCardItemTitle title="Outgoing Token" />
          <DetailsCardItemValue value={bridge.outgoingToken} />
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <DetailsCardItemTitle title="Confirmations" />
          <DetailsCardItemValue value={bridge.confirmations} />
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <DetailsCardItemTitle title="Min. Contract Payment" />
          <DetailsCardItemValue value={bridge.minimumContractPayment} />
        </Grid>
      </Grid>
    </DetailsCard>
  )
}
