import React from 'react'
import { useDispatch } from 'react-redux'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Theme } from '@mui/material/styles'

import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'

import { beginRegistration, submitSignOut } from 'actionCreators'

const styles = (theme: Theme) => {
  return {
    accountButton: {
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

export const AccountMenu = withStyles(styles)(({ classes }: Props) => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogOut = () => {
    dispatch(submitSignOut())
    handleClose()
  }

  const handleRegisterMFA = () => {
    dispatch(beginRegistration())
    handleClose()
  }

  return (
    <React.Fragment>
      <IconButton disableRipple onClick={handleOpen} size="large">
        <AccountCircleIcon className={classes.accountButton} />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 8, horizontal: 64 }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableAutoFocusItem
        MenuListProps={{
          className: classes.menuList,
        }}
      >
        <MenuItem className={classes.menuItem} onClick={handleRegisterMFA}>
          Register MFA Token
        </MenuItem>

        <MenuItem className={classes.menuItem} onClick={handleLogOut}>
          Log out
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
})
