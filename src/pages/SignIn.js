import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Redirect, useLocation, useHistory } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Button from 'components/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { Grid } from '@material-ui/core'
import { hot } from 'react-hot-loader'
import { notifyErrorMsg, submitSignIn } from 'actionCreators'
import { renderNotification } from 'pages/Notifications'
import HexagonLogo from 'components/Logos/Hexagon'
import matchRouteAndMapDispatchToProps from 'utils/matchRouteAndMapDispatchToProps'
import { getPersistUrl } from '../utils/storage'
import axios from 'axios'
import { AuthActionType } from 'src/reducers/actions'

const baseURL = process.env.CHAINLINK_BASEURL ?? location.origin

const styles = (theme) => ({
  container: {
    height: '100%',
  },
  cardContent: {
    paddingTop: theme.spacing.unit * 6,
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    '&:last-child': {
      paddingBottom: theme.spacing.unit * 6,
    },
  },
  headerRow: {
    textAlign: 'center',
  },
  error: {
    backgroundColor: theme.palette.error.light,
    marginTop: theme.spacing.unit * 2,
  },
  errorText: {
    color: theme.palette.error.main,
  },
})

export const SignIn = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isOIDCEnabled, setIsOIDCEnabled] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const handleChange = (name) => (event) => {
    if (name === 'email') setEmail(event.target.value)
    if (name === 'password') setPassword(event.target.value)
  }
  const onSubmit = (e) => {
    e.preventDefault()
    props.submitSignIn({ email, password })
  }

  useEffect(() => {
    // Check if OIDC is enabled for the node
    const checkOIDCEnabled = async () => {
      try {
        const res = await axios.get(`${baseURL}/oidc-enabled`)
        if (res.data.enabled) {
          setIsOIDCEnabled(true)
        }
      } catch (_) {
        // no-op
      }
    }
    // Check if we have been redirected from OIDC provider
    const handleTokenExchange = async () => {
      try {
        const searchParams = new URLSearchParams(location.search)
        const error = searchParams.get('error')
        const code = searchParams.get('code')
        const state = searchParams.get('state')

        if (error) {
          dispatch(notifyErrorMsg('Authentication failed'))
          return
        }

        if (!code) {
          return
        }

        // exchange code
        const res = await axios.post(
          `${baseURL}/oidc-exchange`,
          {
            code,
            state,
          },
          { withCredentials: true },
        )
        if (res.data.success) {
          dispatch({
            type: AuthActionType.RECEIVE_SIGNIN_SUCCESS,
            authenticated: true,
          })
        } else {
          dispatch(notifyErrorMsg(res.data.message))
        }
      } catch (e) {
        dispatch(notifyErrorMsg('Authentication failed'))
      }
    }
    handleTokenExchange()
    checkOIDCEnabled()
  }, [location, history, dispatch])

  const { classes, fetching, authenticated, errors } = props

  if (authenticated) {
    return <Redirect to={getPersistUrl() || '/'} />
  }

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.container}
      spacing={0}
    >
      <Grid item xs={10} sm={6} md={4} lg={3} xl={2}>
        <Card>
          <CardContent className={classes.cardContent}>
            <form noValidate onSubmit={onSubmit}>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <Grid container spacing={0}>
                    <Grid item xs={12} className={classes.headerRow}>
                      <HexagonLogo width={50} />
                    </Grid>
                    <Grid item xs={12} className={classes.headerRow}>
                      <Typography variant="h5">Operator</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {errors.length > 0 &&
                  errors.map((notification, idx) => {
                    return (
                      <Grid item xs={12} key={idx}>
                        <Card raised={false} className={classes.error}>
                          <CardContent>
                            <Typography
                              variant="body1"
                              className={classes.errorText}
                            >
                              {renderNotification(notification)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  })}

                <Grid item xs={12}>
                  <TextField
                    id="email"
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={handleChange('email')}
                    error={errors.length > 0}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="password"
                    margin="normal"
                    value={password}
                    onChange={handleChange('password')}
                    error={errors.length > 0}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={0} justify="center">
                    <Grid item>
                      <Button type="submit" variant="primary">
                        Access Account
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                {isOIDCEnabled && (
                  <Grid item xs={12}>
                    <Grid container spacing={0} justify="center">
                      <Grid item>
                        <Button
                          variant="secondary"
                          href={`${baseURL}/oidc-login`}
                        >
                          Login with OIDC
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {fetching && (
                  <Typography variant="body1" color="textSecondary">
                    Signing in...
                  </Typography>
                )}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  fetching: state.authentication.fetching,
  authenticated: state.authentication.allowed,
  errors: state.notifications.errors,
})

export const ConnectedSignIn = connect(
  mapStateToProps,
  matchRouteAndMapDispatchToProps({ submitSignIn }),
)(SignIn)

export default hot(module)(withStyles(styles)(ConnectedSignIn))
