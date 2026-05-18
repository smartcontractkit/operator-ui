import AppBar from '@mui/material/AppBar'
import MuiDrawer from '@mui/material/Drawer'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Portal from '@mui/material/Portal'
import { Theme } from '@mui/material/styles'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import classNames from 'classnames'
import React from 'react'
import { connect } from 'react-redux'
import ReactResizeDetector from 'react-resize-detector'
import { useLocation } from 'react-router-dom'
import { bindActionCreators, Dispatch } from 'redux'
import { submitSignOut } from 'actionCreators'
import { AccountMenu } from '../components/AccountMenu'
import { SettingsMenu } from '../components/SettingsMenu'
import BaseLink from '../components/BaseLink'
import LoadingBar from '../components/LoadingBar'
import MainLogo from '../components/Logos/Main'
import fetchCountSelector from '../selectors/fetchCount'
import { Feature, useFeatureFlag } from 'src/hooks/useFeatureFlag'

const ResizeDetector = ReactResizeDetector as any

const NAV_ITEMS = [
  ['/jobs', 'Jobs'],
  ['/runs', 'Runs'],
  ['/chains', 'Chains'],
  ['/nodes', 'Nodes'],
  ['/bridges', 'Bridges'],
  ['/transactions', 'Transactions'],
]

const DRAWER_NAV_ITEMS = [
  ...NAV_ITEMS,
  ['/keys', 'Keys'],
  ['/config', 'Configuration'],
]

const drawerWidth = 240

const drawerStyles = ({ palette, spacing }: Theme) =>
  createStyles({
    menuitem: {
      minHeight: spacing(6),
      paddingLeft: spacing(3),
      paddingRight: spacing(3),
      color: palette.text.primary,
      textDecoration: 'none',
      borderBottom: `1px solid ${palette.divider}`,
      '&:hover': {
        backgroundColor: palette.action.hover,
        textDecoration: 'none',
      },
      '& .MuiListItemText-root': {
        marginTop: 0,
        marginBottom: 0,
      },
      '& .MuiListItemText-primary': {
        color: 'inherit',
        fontWeight: 500,
      },
    },
    activeMenuitem: {
      color: palette.primary.main,
      backgroundColor: palette.action.hover,
    },
    drawerPaper: {
      backgroundColor: palette.background.paper,
      paddingTop: spacing(7),
      width: drawerWidth,
      boxSizing: 'border-box',
    },
    drawerList: {
      padding: 0,
    },
  })

interface DrawerProps extends WithStyles<typeof drawerStyles> {
  authenticated: boolean
  drawerOpen: boolean
  isFeedsManagerFeatureEnabled: boolean
  toggleDrawer: () => void
  submitSignOut: () => void
}

const Drawer = withStyles(drawerStyles)(({
  drawerOpen,
  toggleDrawer,
  authenticated,
  classes,
  submitSignOut,
  isFeedsManagerFeatureEnabled,
}: DrawerProps) => {
  const { pathname } = useLocation()

  const isActivePath = (itemPath: string) => {
    if (itemPath === '/job_distributors') {
      return pathname.includes(itemPath)
    }

    return pathname.startsWith(itemPath)
  }

  return (
    <MuiDrawer
      anchor="right"
      open={drawerOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={toggleDrawer}
    >
      <div tabIndex={0} role="button" onClick={toggleDrawer}>
        <List className={classes.drawerList}>
          {DRAWER_NAV_ITEMS.map(([href, text]) => (
            <ListItem
              key={href}
              button
              component={BaseLink as any}
              href={href}
              className={classNames(
                classes.menuitem,
                isActivePath(href) && classes.activeMenuitem,
              )}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
          {isFeedsManagerFeatureEnabled && (
            <ListItem
              button
              component={BaseLink as any}
              href={'/job_distributors'}
              className={classNames(
                classes.menuitem,
                isActivePath('/job_distributors') && classes.activeMenuitem,
              )}
            >
              <ListItemText primary="Job Distributors" />
            </ListItem>
          )}

          {authenticated && (
            <ListItem
              button
              onClick={submitSignOut}
              className={classes.menuitem}
            >
              <ListItemText primary="Sign Out" />
            </ListItem>
          )}
        </List>
      </div>
    </MuiDrawer>
  )
})

const navStyles = ({ palette, spacing }: Theme) =>
  createStyles({
    horizontalNav: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    horizontalNavItem: {
      display: 'inline',
    },
    horizontalNavLink: {
      color: palette.secondary.main,
      paddingTop: spacing(3),
      paddingBottom: spacing(3),
      textDecoration: 'none',
      display: 'inline-block',
      borderBottom: 'solid 1px',
      borderBottomColor: palette.background.paper,
      '&:hover': {
        borderBottomColor: palette.primary.main,
      },
    },
    activeNavLink: {
      color: palette.primary.main,
      borderBottomColor: palette.primary.main,
    },
  })

interface NavProps extends WithStyles<typeof navStyles> {
  authenticated: boolean
  isFeedsManagerFeatureEnabled: boolean
}

const Nav = withStyles(navStyles)(({
  authenticated,
  classes,
  isFeedsManagerFeatureEnabled,
}: NavProps) => {
  const { pathname } = useLocation()

  return (
    <Typography variant="body1" component="div">
      <List className={classes.horizontalNav}>
        {NAV_ITEMS.map(([navItemPath, text]) => (
          <ListItem key={navItemPath} className={classes.horizontalNavItem}>
            <BaseLink
              key={navItemPath}
              href={navItemPath}
              className={classNames(
                classes.horizontalNavLink,
                pathname.startsWith(navItemPath) && classes.activeNavLink,
              )}
            >
              {text}
            </BaseLink>
          </ListItem>
        ))}
        {/* Feeds Manager link hidden behind a feature flag. This is temporary until we
        enable this for everyone */}
        {isFeedsManagerFeatureEnabled && (
          <ListItem className={classes.horizontalNavItem}>
            <BaseLink
              href={'/job_distributors'}
              className={classNames(
                classes.horizontalNavLink,
                pathname.includes('/job_distributors') && classes.activeNavLink,
              )}
            >
              Job Distributors
            </BaseLink>
          </ListItem>
        )}
        {authenticated && (
          <>
            <ListItem className={classes.horizontalNavItem}>
              <SettingsMenu />
              <AccountMenu />
            </ListItem>
          </>
        )}
      </List>
    </Typography>
  )
})

const styles = ({ palette, spacing, zIndex }: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: palette.background.paper,
      zIndex: zIndex.modal - 1,
    },
    toolbar: {
      paddingLeft: spacing(5),
      paddingRight: spacing(5),
    },
  })

interface Props extends WithStyles<typeof styles> {
  fetchCount: number
  authenticated: boolean
  drawerContainer: HTMLElement | null
  submitSignOut: () => void
  onResize: (width: number, height: number) => void
}

const Header = withStyles(styles)(({
  authenticated,
  classes,
  fetchCount,
  drawerContainer,
  onResize,
  submitSignOut,
}: Props) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const isFeedsManagerFeatureEnabled = useFeatureFlag(Feature.FeedsManager)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <AppBar className={classes.appBar} color="default" position="absolute">
      <ResizeDetector
        refreshMode="debounce"
        refreshRate={200}
        onResize={onResize}
        handleHeight
      >
        <div>
          <LoadingBar fetchCount={fetchCount} />

          <Toolbar className={classes.toolbar}>
            <Grid container alignItems="center">
              <Grid item xs={11} sm={6} md={4}>
                <BaseLink href="/">
                  <MainLogo width={200} />
                </BaseLink>
              </Grid>
              <Grid item xs={1} sm={6} md={8}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Hidden mdUp>
                      <IconButton
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        size="large"
                      >
                        <MenuIcon />
                      </IconButton>
                    </Hidden>
                    <Hidden mdDown>
                      <Nav
                        authenticated={authenticated}
                        isFeedsManagerFeatureEnabled={
                          isFeedsManagerFeatureEnabled
                        }
                      />
                    </Hidden>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </div>
      </ResizeDetector>
      <Portal container={drawerContainer}>
        <Drawer
          isFeedsManagerFeatureEnabled={isFeedsManagerFeatureEnabled}
          toggleDrawer={toggleDrawer}
          drawerOpen={drawerOpen}
          authenticated={authenticated}
          submitSignOut={submitSignOut}
        />
      </Portal>
    </AppBar>
  )
})

const mapStateToProps = (state: any) => ({
  authenticated: state.authentication.allowed,
  fetchCount: fetchCountSelector(state),
  url: state.notifications.currentUrl,
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ submitSignOut }, dispatch)

const ConnectedHeader = connect(mapStateToProps, mapDispatchToProps)(Header)

export default ConnectedHeader
