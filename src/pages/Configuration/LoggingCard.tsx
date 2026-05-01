import React, { useEffect, useState } from 'react'
import capitalize from 'lodash/capitalize'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import Button from 'components/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { Theme } from '@mui/material/styles'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import * as models from 'core/store/models'
import { v2 } from 'api'
import { notifyError, notifySuccess } from 'actionCreators'
import ErrorMessage from 'components/Notifications/DefaultError'
import { useErrorHandler } from 'hooks/useErrorHandler'
import { useLoadingPlaceholder } from 'hooks/useLoadingPlaceholder'
import { FormHelperText } from '@mui/material'

const logLevels = ['debug', 'info', 'warn', 'error']

type LogConfig = {
  defaultLogLevel: string
  level: models.LogConfigLevel
  sqlEnabled: boolean
}

const styles = (theme: Theme) => {
  return createStyles({
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(0.5),
    },
    logLevelHelperText: {
      marginTop: -8,
    },
  })
}

interface LogConfigurationFormProps extends WithStyles<typeof styles> {
  initialValues: LogConfig
}

const LogConfigurationForm = withStyles(styles)(({
  classes,
  initialValues,
}: LogConfigurationFormProps) => {
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues,
    onSubmit: async (values: LogConfig) => {
      try {
        const updateData = {
          level: values.level,
          sqlEnabled: values.sqlEnabled,
        }
        await v2.logConfig.updateLogConfig(updateData)

        dispatch(notifySuccess(() => <>Logging Configuration Updated</>, {}))
      } catch (e) {
        dispatch(notifyError(ErrorMessage, e as Error))
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} data-testid="logging-form">
      <TextField
        id="select-level"
        name="level"
        fullWidth
        select
        label="Log Level"
        value={formik.values.level}
        defaultValue={initialValues.defaultLogLevel}
        onChange={formik.handleChange}
        error={formik.touched.level && Boolean(formik.errors.level)}
        helperText="Override the LOG_LEVEL environment variable (until restart)"
      >
        {logLevels.map((level) => (
          <MenuItem key={level} value={level}>
            {capitalize(level).concat(
              level === initialValues.defaultLogLevel ? ' (default)' : '',
            )}
          </MenuItem>
        ))}
      </TextField>

      <FormGroup>
        <FormControlLabel
          name="sqlEnabled"
          control={
            <>
              <Checkbox
                id="sqlEnabled"
                name="sqlEnabled"
                disabled={formik.values.level !== 'debug'}
                checked={
                  formik.values.sqlEnabled && formik.values.level === 'debug'
                }
                onChange={formik.handleChange}
              />
            </>
          }
          label="Log SQL Statements (debug only)"
        />
        <FormHelperText className={classes.logLevelHelperText}>
          Override the LOG_SQL environment variable (until restart)
        </FormHelperText>
      </FormGroup>

      <br />

      <div className={classes.actions}>
        <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
          Update
        </Button>
      </div>
    </form>
  )
})

export const LoggingCard = () => {
  const [logConfig, setLogConfig] = useState<LogConfig | null>(null)
  const { error, ErrorComponent, setError } = useErrorHandler()
  const { LoadingPlaceholder } = useLoadingPlaceholder(!error && !logConfig)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await v2.logConfig.getLogConfig()

        // The API interface for getLogConfig is really really bad...
        const globalIdx = res.data.attributes.serviceName.findIndex(
          (name) => name == 'Global',
        )

        const logLevel = res.data.attributes.logLevel[
          globalIdx
        ] as models.LogConfigLevel

        const defaultLogLevel = res.data.attributes.defaultLogLevel

        const sqlEnabledIdx = res.data.attributes.serviceName.findIndex(
          (name) => name == 'IsSqlEnabled',
        )

        const sqlEnabled = res.data.attributes.logLevel[sqlEnabledIdx] == 'true'

        const logCfg = {
          defaultLogLevel,
          level: logLevel,
          sqlEnabled,
        }

        setLogConfig(logCfg)
      } catch (e) {
        setError(e)
      }
    }

    fetch()
  }, [setError])

  return (
    <Card>
      <CardHeader title="Logging" />
      <CardContent>
        <LoadingPlaceholder />
        <ErrorComponent />

        {logConfig && <LogConfigurationForm initialValues={logConfig} />}
      </CardContent>
    </Card>
  )
}
