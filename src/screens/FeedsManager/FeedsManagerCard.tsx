import React from 'react'

import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'

import {
  DetailsCard,
  DetailsCardItemTitle,
  DetailsCardItemValue,
} from 'src/components/Cards/DetailsCard'
import { CopyIconButton } from 'src/components/Copy/CopyIconButton'
import { MenuItemLink } from 'src/components/MenuItemLink'
import { shortenHex } from 'src/utils/shortenHex'
import { StatusIndicator } from './StatusIndicator'

interface Props {
  manager: FeedsManagerFields
  onEnable: () => void
  onDisable: () => void
}

export const FeedsManagerCard = ({ manager, onEnable, onDisable }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleToggleEnabled = () => {
    if (manager.disabledAt) {
      onEnable()
    } else {
      onDisable()
    }
    handleClose()
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
            <MenuItemLink to={`/job_distributors/${manager.id}/edit`}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItemLink>
            <MenuItem onClick={handleToggleEnabled}>
              <ListItemIcon>
                {manager.disabledAt ? (
                  <ToggleOnIcon style={{ color: 'green' }} />
                ) : (
                  <ToggleOffIcon style={{ color: 'gray' }} />
                )}
              </ListItemIcon>
              <ListItemText>
                {manager.disabledAt ? 'Enable' : 'Disable'}
              </ListItemText>
            </MenuItem>
          </Menu>
        </div>
      }
    >
      <Grid container>
        <Grid item xs={12} sm={6} md={3}>
          <DetailsCardItemTitle title="Connection Status" />
          <StatusIndicator
            isActive={manager.isConnectionActive}
            activeText="Connected"
            inactiveText="Disconnected"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DetailsCardItemTitle title="Status" />
          <StatusIndicator
            isActive={!manager.disabledAt}
            activeText="Enabled"
            inactiveText="Disabled"
          />
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
