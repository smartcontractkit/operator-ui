import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

import Content from 'components/Content'
import {
  FeedsManagerForm,
  Props as FormProps,
} from 'components/Form/FeedsManagerForm'

type Props = {
  data: FetchFeedsManagersPayload_ResultsFields
} & Pick<FormProps, 'onSubmit'>

export const EditFeedsManagerView: React.FC<Props> = ({ data, onSubmit }) => {
  const initialValues = {
    name: data.name,
    uri: data.uri,
    publicKey: data.publicKey,
  }

  return (
    <Content>
      <Grid container>
        <Grid item xs={12} md={11} lg={9}>
          <Card>
            <CardHeader title="Edit Job Distributor" />
            <CardContent>
              <FeedsManagerForm
                initialValues={initialValues}
                onSubmit={onSubmit}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Content>
  )
}
