import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'

import Content from 'components/Content'
import { BridgeForm, Props as FormProps } from 'src/components/Form/BridgeForm'

const initialValues = {
  name: '',
  url: '',
  minimumContractPayment: '0',
  confirmations: 0,
}

type Props = Pick<FormProps, 'onSubmit'>

export const NewBridgeView: React.FC<Props> = ({ onSubmit }) => {
  return (
    <Content>
      <Grid container spacing={5}>
        <Grid item xs={12} md={11} lg={9}>
          <Card>
            <CardHeader title="New Bridge" />

            <CardContent>
              <BridgeForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                submitButtonText="Create Bridge"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Content>
  )
}
