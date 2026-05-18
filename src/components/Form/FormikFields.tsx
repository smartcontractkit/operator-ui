import React from 'react'
import { FieldProps, getIn } from 'formik'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel'
import { useTheme } from '@mui/material/styles'
import TextField, { TextFieldProps } from '@mui/material/TextField'

type FormikTextFieldProps = FieldProps & TextFieldProps & { rowsMax?: number }

export const FormikTextField = ({
  field,
  form,
  helperText,
  rowsMax,
  children,
  FormHelperTextProps,
  ...props
}: FormikTextFieldProps & {
  children?: React.ReactNode
  FormHelperTextProps?: any
}) => {
  const theme = useTheme()
  const touched = getIn(form.touched, field.name)
  const error = getIn(form.errors, field.name)
  // Show error if field is touched, OR show all errors after form submission
  const showError = Boolean(
    (touched || (form.submitCount && form.submitCount > 0)) && error,
  )

  const maybeMaxRowsProps =
    props.rows || props.maxRows || rowsMax === undefined
      ? {}
      : { maxRows: props.maxRows ?? rowsMax }

  const multilineProps = props.multiline
    ? {
        InputProps: {
          ...props.InputProps,
          sx: {
            alignItems: 'flex-start',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            '& textarea': {
              color: theme.palette.text.primary,
              resize: 'vertical',
            },
            ...(props.InputProps?.sx as object),
          },
        },
      }
    : {}

  // Determine what helper text to show
  const finalHelperText = showError ? error : helperText

  return (
    <TextField
      {...field}
      {...props}
      {...maybeMaxRowsProps}
      {...multilineProps}
      error={showError || Boolean(props.error)}
      helperText={finalHelperText}
      FormHelperTextProps={FormHelperTextProps}
    >
      {children}
    </TextField>
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
