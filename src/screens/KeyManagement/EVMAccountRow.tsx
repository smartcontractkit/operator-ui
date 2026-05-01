import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { ApolloQueryResult } from '@apollo/client'

import { Theme } from '@mui/material/styles'

import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'

import Button from 'components/Button'
import Close from 'components/Icons/Close'
import ErrorMessage from 'components/Notifications/DefaultError'
import * as api from 'api'
import { notifySuccess, notifyError } from 'actionCreators'
import { ApiResponse } from 'utils/json-api-client'
import { EVMKeysChainRequest, EVMKey } from 'core/store/models'
import { CopyIconButton } from 'src/components/Copy/CopyIconButton'
import { fromJuels } from 'src/utils/tokens/link'
import { shortenHex } from 'src/utils/shortenHex'
import { TimeAgo } from 'src/components/TimeAgo'

const styles = (theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(5),
      paddingBottom: 0,
    },
    chainId: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    badgePadding: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
      lineHeight: '1rem',
    },
    dialogPaper: {
      minHeight: '360px',
      maxHeight: '360px',
      minWidth: '670px',
      maxWidth: '670px',
      overflow: 'hidden',
      borderRadius: theme.spacing(3),
    },
    warningText: {
      fontWeight: 500,
      marginLeft: theme.spacing(3),
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    closeButton: {
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(3),
    },
    infoText: {
      fontSize: theme.spacing(2),
      fontWeight: 450,
      marginLeft: theme.spacing(6),
    },
    modalContent: {
      width: 'inherit',
    },
    deleteButton: {
      marginTop: theme.spacing(4),
    },
    runJobButton: {
      marginBottom: theme.spacing(3),
    },
    runJobModalContent: {
      overflow: 'hidden',
    },
  })

interface Props {
  classes: WithStyles<typeof styles>['classes']
  ethKey: EthKeysPayload_ResultsFields
  refetch?: () => Promise<ApolloQueryResult<FetchEthKeys>>
}

function apiCall({
  evmChainID,
  address,
  abandon,
  enabled,
}: {
  evmChainID: string
  address: string
  abandon: boolean
  enabled: boolean
}): Promise<ApiResponse<EVMKey>> {
  const definition: EVMKeysChainRequest = {
    evmChainID,
    address,
    abandon,
    enabled,
  }
  return api.v2.evmKeys.chain(definition)
}

const SuccessNotification = () => <>Successfully updated EVM key</>

const UnstyledEVMAccountRow: React.FC<Props> = ({
  classes,
  ethKey,
  refetch,
}) => {
  const dispatch = useDispatch()

  const [modalOpen, setModalOpen] = useState(false)
  const [enabled, setEnabled] = useState(!ethKey.isDisabled)
  const [abandon, setAbandon] = useState(false)

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    handleUpdate(abandon, enabled)
  }

  const handleEnabledCheckboxChange = () => {
    setEnabled(!enabled)
  }

  const handleAbandonCheckboxChange = () => {
    setAbandon(!abandon)
  }

  const closeModal = () => {
    setModalOpen(false)
    // reset state
    setAbandon(false)
    setEnabled(!ethKey.isDisabled)
  }

  async function handleUpdate(abandon: boolean, enabled: boolean) {
    apiCall({
      evmChainID: ethKey.chain.id,
      address: ethKey.address,
      abandon,
      enabled,
    })
      .then(({ data }) => {
        if (refetch) refetch()
        closeModal()
        dispatch(notifySuccess(SuccessNotification, data))
      })
      .catch((error) => {
        if (refetch) refetch()
        closeModal()
        dispatch(notifyError(ErrorMessage, error))
      })
  }

  return (
    <>
      <Dialog
        open={modalOpen}
        classes={{ paper: classes.dialogPaper }}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={onSubmit}>
          <Grid container spacing={0}>
            <Grid item className={classes.modalContent}>
              <Grid
                container
                alignItems="baseline"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    variant="h5"
                    color="secondary"
                    className={classes.warningText}
                  >
                    Key Admin Override
                  </Typography>
                  <Typography
                    variant="h6"
                    color="secondary"
                    className={classes.warningText}
                  >
                    Modifying key {ethKey.address} for chain {ethKey.chain.id}
                  </Typography>
                </Grid>
                <Grid item>
                  <Close className={classes.closeButton} onClick={closeModal} />
                </Grid>
              </Grid>
              <Grid container direction="column">
                <FormGroup>
                  <FormControlLabel
                    className={classes.infoText}
                    color="secondary"
                    control={
                      <Checkbox
                        name="enabledCheckbox"
                        checked={enabled}
                        onChange={handleEnabledCheckboxChange}
                      />
                    }
                    label="Enabled"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    className={classes.infoText}
                    color="secondary"
                    control={
                      <Checkbox
                        name="abandonCheckbox"
                        checked={abandon}
                        onChange={handleAbandonCheckboxChange}
                      />
                    }
                    label="Abandon all current transactions (use with caution!)"
                  />
                </FormGroup>
                <Grid
                  container
                  spacing={0}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item className={classes.deleteButton}>
                    <Button variant="danger" type="submit">
                      Update
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Dialog>
      <TableRow hover>
        <TableCell>
          <Typography variant="body1">
            {shortenHex(ethKey.address, { start: 6, end: 6 })}{' '}
            <CopyIconButton data={ethKey.address} />
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{ethKey.chain.id}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">
            {ethKey.isDisabled ? 'Disabled' : 'Enabled'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">
            {ethKey.linkBalance && fromJuels(ethKey.linkBalance)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{ethKey.ethBalance}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">
            <TimeAgo tooltip>{ethKey.createdAt}</TimeAgo>
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">
            <Button onClick={() => setModalOpen(true)}>Admin</Button>
          </Typography>
        </TableCell>
      </TableRow>
    </>
  )
}

export const EVMAccountRow = withStyles(styles)(UnstyledEVMAccountRow)
