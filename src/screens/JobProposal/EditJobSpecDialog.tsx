import React from 'react'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { FormikTextField as TextField } from 'src/components/Form/FormikFields'
import * as Yup from 'yup'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import Typography from '@mui/material/Typography'

const styles = () => {
  return createStyles({
    paperRoot: {
      width: '100%',
      maxWidth: 700,
    },
  })
}

export type FormValues = {
  id: string
  definition: string
}

export interface Props extends WithStyles<typeof styles> {
  onClose: () => void
  open: boolean
  initialValues: FormValues
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => void | Promise<any>
}

const ValidationSchema = Yup.object().shape({
  definition: Yup.string().required('Required'),
})

export const EditJobSpecDialog = withStyles(styles)(({
  classes,
  initialValues,
  onClose,
  onSubmit,
  open,
}: Props) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={async (values, formikHelper) => {
        await onSubmit(values, formikHelper)

        onClose()
      }}
    >
      {({ isSubmitting, submitForm }) => (
        <Form>
          <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            classes={{ paper: classes.paperRoot }}
          >
            <DialogTitle>
              <Typography component="span" variant="h5">
                Edit Job Spec
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Field
                component={TextField}
                id="definition"
                name="definition"
                label="Job Spec"
                variant="outlined"
                multiline
                minRows={10}
                maxRows={25}
                required
                autoComplete="off"
                margin="normal"
                fullWidth
                spellCheck="false"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} variant="text">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  )
})
