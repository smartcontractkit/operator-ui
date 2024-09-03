import React from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Grid from '@material-ui/core/Grid'

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
