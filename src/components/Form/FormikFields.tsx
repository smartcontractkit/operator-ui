import React from 'react'
import { FieldProps, getIn } from 'formik'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel'
import TextField, { TextFieldProps } from '@mui/material/TextField'

type FormikTextFieldProps = FieldProps & TextFieldProps & { rowsMax?: number }

export const FormikTextField = ({
  field,
  form,
  helperText,
  rowsMax,
  ...props
}: FormikTextFieldProps) => {
  const touched = getIn(form.touched, field.name)
  const error = getIn(form.errors, field.name)
  const showError = Boolean(touched && error)

  const maybeMaxRowsProps =
    props.rows || props.maxRows || rowsMax === undefined
      ? {}
      : { maxRows: props.maxRows ?? rowsMax }

  return (
    <TextField
      {...field}
      {...props}
      {...maybeMaxRowsProps}
      error={showError || Boolean(props.error)}
      helperText={showError ? error : helperText}
    />
  )
}

type FormikCheckboxWithLabelProps = FieldProps &
  Omit<CheckboxProps, 'name' | 'value' | 'onChange' | 'checked'> & {
    Label: Omit<FormControlLabelProps, 'control'>
  }

export const FormikCheckboxWithLabel = ({
  field,
  Label,
  ...props
}: FormikCheckboxWithLabelProps) => {
  return (
    <FormControlLabel
      {...Label}
      control={
        <Checkbox
          {...props}
          {...field}
          checked={Boolean(field.value)}
          color={props.color ?? 'primary'}
        />
      }
    />
  )
}
