import React from 'react'

import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import MuiDialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import MuiDialogTitle from '@mui/material/DialogTitle'
import { Theme } from '@mui/material/styles'
import { withStyles } from 'src/utils/withStyles'
import Typography from '@mui/material/Typography'

const DialogTitle = withStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}))(MuiDialogTitle)

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))(MuiDialogActions)

type Props = Pick<DialogProps, 'open' | 'onClose' | 'maxWidth'> & {
  body: string | React.ReactNode
  confirmButtonText?: string
  confirmButtonEnabled?: boolean
  cancelButtonText?: string
  title: string
  onConfirm: () => void
  onCancel?: () => void
}

export const ConfirmationDialog: React.FC<Props> = ({
  body,
  cancelButtonText,
  confirmButtonText,
  confirmButtonEnabled,
  maxWidth,
  onClose,
  onCancel,
  onConfirm,
  open,
  title,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth}>
      <DialogTitle>
        <Typography variant="h5"> {title}</Typography>
      </DialogTitle>
      <DialogContent>
        {typeof body === 'string' ? (
          <DialogContentText color="textPrimary">{body}</DialogContentText>
        ) : (
          body
        )}
      </DialogContent>
      <DialogActions>
        {cancelButtonText && onCancel && (
          <Button onClick={onCancel} variant="text">
            {cancelButtonText}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={!!confirmButtonEnabled}
        >
          {confirmButtonText || 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
