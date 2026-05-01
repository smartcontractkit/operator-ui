import React from 'react'

import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import Switch from '@mui/material/Switch'
import SettingsIcon from '@mui/icons-material/Settings'
import { Theme } from '@mui/material/styles'

import { WithStyles } from '@mui/styles'
import withStyles from '@mui/styles/withStyles'

import { MenuItemLink } from 'components/MenuItemLink'
import { useThemeMode } from 'src/context/ThemeModeContext'

const styles = (theme: Theme) => {
  return {
    iconButton: {
      fontSize: 32,
      color: theme.palette.primary.main,
    },
    menuList: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    menuItem: {
      minHeight: theme.spacing(6),
    },
  }
}

interface Props extends WithStyles<typeof styles> {}

export const SettingsMenu = withStyles(styles)(({ classes }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { mode, toggleMode } = useThemeMode()
  const isDarkMode = mode === 'dark'

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleToggleMode = () => {
    toggleMode()
    handleClose()
  }

  return (
    <React.Fragment>
      <IconButton disableRipple onClick={handleOpen} size="large">
        <SettingsIcon className={classes.iconButton} />
      </IconButton>
      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 8, horizontal: 128 }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableAutoFocusItem
        MenuListProps={{
          className: classes.menuList,
        }}
      >
        <MenuItem className={classes.menuItem} onClick={handleToggleMode}>
          <ListItemText>Dark mode</ListItemText>
          <Switch checked={isDarkMode} edge="end" />
        </MenuItem>
        <MenuItemLink
          className={classes.menuItem}
          onClick={handleClose}
          to="/keys"
        >
          Key Management
        </MenuItemLink>
        <MenuItemLink
          className={classes.menuItem}
          onClick={handleClose}
          to="/config"
        >
          Configuration
        </MenuItemLink>
      </Menu>
    </React.Fragment>
  )
})
