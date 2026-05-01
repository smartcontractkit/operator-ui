import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { Theme } from '@mui/material/styles'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import Typography from '@mui/material/Typography'

import Button from 'src/components/Button'

const styles = (theme: Theme) =>
  createStyles({
    dialogContent: {
      paddingTop: theme.spacing(1),
    },
    textarea: {
      width: 400,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })

interface Props extends WithStyles<typeof styles> {
  open: boolean
  onClose: () => void
  onRun: (pipelineInput: string) => void
}

// TODO - Convert this to use formik
export const RunJobDialog = withStyles(styles)(({
  open,
  onClose,
  onRun,
  classes,
}: Props) => {
  const [pipelineInput, setPipelineInput] = React.useState('')

  const handleRun = React.useCallback(() => {
    onRun(pipelineInput)
    onClose()
  }, [onRun, onClose, pipelineInput])

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <Typography variant="h5">Pipeline Input</Typography>
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          className={classes.textarea}
          multiline
          rows={6}
          variant="outlined"
          onChange={(e) => setPipelineInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="primary" onClick={handleRun}>
          Run Job
        </Button>
      </DialogActions>
    </Dialog>
  )
})
