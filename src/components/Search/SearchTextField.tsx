import React from 'react'

import Grid from '@mui/material/Grid'
import { Theme } from '@mui/material/styles'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import TextField from '@mui/material/TextField'

const styles = (theme: Theme) => {
  return createStyles({
    textField: {
      marginBottom: theme.spacing(2),
    },
    input: {
      padding: 14,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 4,
    },
  })
}

interface Props extends WithStyles<typeof styles> {
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export const SearchTextField = withStyles(styles)(({
  classes,
  onChange,
  placeholder,
  value,
}: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          className={classes.textField}
          inputProps={{
            className: classes.input,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={placeholder || 'Search'}
          value={value}
          name="search"
          onChange={(event) => onChange(event.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
    </Grid>
  )
})
