import React from 'react'
import { connect } from 'react-redux'
import { Chain, Resource } from 'core/store/models'
import { localizedTimestamp, TimeAgo } from 'components/TimeAgo'
import { useLocation } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'
import Link from 'components/Link'

const styles = (theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing.unit * 5,
      paddingBottom: 0,
    },
    mainRow: {
      marginBottom: theme.spacing.unit * 2,
    },
    actions: {
      textAlign: 'right',
    },
    regionalNavButton: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    horizontalNav: {
      paddingBottom: 0,
    },
    horizontalNavItem: {
      display: 'inline',
      paddingLeft: 0,
      paddingRight: 0,
    },
    horizontalNavLink: {
      padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 4}px`,
      textDecoration: 'none',
      display: 'inline-block',
      borderBottom: 'solid 1px',
      borderBottomColor: theme.palette.common.white,
      '&:hover': {
        borderBottomColor: theme.palette.primary.main,
      },
    },
    activeNavLink: {
      color: theme.palette.primary.main,
      borderBottomColor: theme.palette.primary.main,
    },
    chainId: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    badgePadding: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      marginLeft: theme.spacing.unit * -2,
      marginRight: theme.spacing.unit * -2,
      lineHeight: '1rem',
    },
    dialogPaper: {
      minHeight: '260px',
      maxHeight: '260px',
      minWidth: '670px',
      maxWidth: '670px',
      overflow: 'hidden',
      borderRadius: theme.spacing.unit * 3,
    },
    warningText: {
      fontWeight: 500,
      marginLeft: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit,
    },
    closeButton: {
      marginRight: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit * 3,
    },
    infoText: {
      fontSize: theme.spacing.unit * 2,
      fontWeight: 450,
      marginLeft: theme.spacing.unit * 6,
    },
    modalTextarea: {
      marginLeft: theme.spacing.unit * 2,
    },
    modalContent: {
      width: 'inherit',
    },
    runJobButton: {
      marginBottom: theme.spacing.unit * 3,
    },
    runJobModalContent: {
      overflow: 'hidden',
    },
  })

export type ChainResource = Resource<Chain>

interface Props extends WithStyles<typeof styles> {
  chainId: string
  network: string
  chain?: ChainResource
}

const RegionalNavComponent = ({ classes, chainId, network, chain }: Props) => {
  const location = useLocation()
  const navOverridesActive = location.pathname.endsWith('/config-overrides')
  const editActive = location.pathname.endsWith('/edit')
  const navNodesActive = !navOverridesActive && !editActive

  return (
    <>
      <Card className={classes.container}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Grid
              container
              spacing={0}
              alignItems="center"
              className={classes.mainRow}
            >
              <Grid item xs={12}>
                {chain && (
                  <Typography
                    variant="h5"
                    color="secondary"
                    className={classes.chainId}
                  >
                    Chain {chain.id || chainId}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {chain?.attributes.createdAt && (
              <Typography variant="subtitle2" color="textSecondary">
                Created{' '}
                <TimeAgo tooltip={false}>{chain.attributes.createdAt}</TimeAgo>{' '}
                ({localizedTimestamp(chain.attributes.createdAt)})
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <List className={classes.horizontalNav}>
              <ListItem className={classes.horizontalNavItem}>
                <Link
                  href={`/chains/${network}/${chainId}`}
                  className={classNames(
                    classes.horizontalNavLink,
                    navNodesActive && classes.activeNavLink,
                  )}
                >
                  Nodes
                </Link>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export const ConnectedRegionalNav = connect(null, {})(RegionalNavComponent)

export default withStyles(styles)(ConnectedRegionalNav)
