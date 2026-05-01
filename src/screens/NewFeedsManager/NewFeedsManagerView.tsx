import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

import {
  FeedsManagerForm,
  Props as FormProps,
} from 'components/Form/FeedsManagerForm'

const initialValues = {
  name: '',
  uri: '',
  publicKey: '',
}

type Props = Pick<FormProps, 'onSubmit'>

export const NewFeedsManagerView: React.FC<Props> = ({ onSubmit }) => {
  return (
    <Grid container>
      <Grid item xs={12} md={11} lg={9}>
        <Card>
          <CardHeader title="Register Job Distributor" />
          <CardContent>
            <FeedsManagerForm
              initialValues={initialValues}
              onSubmit={onSubmit}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
