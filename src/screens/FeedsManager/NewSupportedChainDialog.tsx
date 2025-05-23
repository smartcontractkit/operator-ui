import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'

import {
  ChainConfigurationForm,
  Props as FormProps,
} from 'src/components/Form/ChainConfigurationForm'
import { useChainsQuery } from 'src/hooks/queries/useChainsQuery'
import { useEVMAccountsQuery } from 'src/hooks/queries/useEVMAccountsQuery'
import { useNonEvmAccountsQuery } from 'src/hooks/queries/useNonEvmAccountsQuery'
import { useP2PKeysQuery } from 'src/hooks/queries/useP2PKeysQuery'
import { useOCRKeysQuery } from 'src/hooks/queries/useOCRKeysQuery'
import { useOCR2KeysQuery } from 'src/hooks/queries/useOCR2KeysQuery'
import { ChainTypes } from 'src/components/Form/ChainTypes'

type Props = {
  open: boolean
  onClose: () => void
} & Pick<FormProps, 'onSubmit'>

export const NewSupportedChainDialog = ({ onClose, open, onSubmit }: Props) => {
  const formRef = React.useRef()

  const { data: chainData } = useChainsQuery({
    variables: { limit: 999 },
    fetchPolicy: 'network-only',
  })

  const { data: accountDataEVM } = useEVMAccountsQuery({
    fetchPolicy: 'cache-and-network',
  })

  const { data: accountDataNonEvm } = useNonEvmAccountsQuery({
    fetchPolicy: 'cache-and-network',
  })

  const { data: p2pKeysData } = useP2PKeysQuery({
    fetchPolicy: 'cache-and-network',
  })

  const { data: ocrKeysData } = useOCRKeysQuery({
    fetchPolicy: 'cache-and-network',
  })

  const { data: ocr2KeysData } = useOCR2KeysQuery({
    fetchPolicy: 'cache-and-network',
  })

  const initialValues = {
    chainID: '',
    chainType: ChainTypes.EVM,
    accountAddr: '',
    adminAddr: '',
    accountAddrPubKey: '',
    fluxMonitorEnabled: false,
    ocr1Enabled: false,
    ocr1IsBootstrap: false,
    ocr1Multiaddr: '',
    ocr1P2PPeerID: '',
    ocr1KeyBundleID: '',
    ocr2Enabled: false,
    ocr2IsBootstrap: false,
    ocr2Multiaddr: '',
    ocr2P2PPeerID: '',
    ocr2KeyBundleID: '',
    ocr2CommitPluginEnabled: false,
    ocr2ExecutePluginEnabled: false,
    ocr2MedianPluginEnabled: false,
    ocr2MercuryPluginEnabled: false,
    ocr2RebalancerPluginEnabled: false,
    ocr2ForwarderAddress: '',
  }

  const chains = chainData ? chainData.chains.results : []

  const accountsEVM = accountDataEVM ? accountDataEVM.ethKeys.results : []
  const p2pKeys = p2pKeysData ? p2pKeysData.p2pKeys.results : []
  const ocrKeys = ocrKeysData ? ocrKeysData.ocrKeyBundles.results : []
  const ocr2Keys = ocr2KeysData ? ocr2KeysData.ocr2KeyBundles.results : []

  return (
    <Dialog onClose={onClose} open={open} disableBackdropClick>
      <DialogTitle disableTypography>
        <Typography variant="body2">New Supported Chain</Typography>
      </DialogTitle>

      <DialogContent>
        <ChainConfigurationForm
          innerRef={formRef}
          initialValues={initialValues}
          onSubmit={onSubmit}
          chains={chains}
          accountsEVM={accountsEVM}
          accountsNonEvm={accountDataNonEvm}
          p2pKeys={p2pKeys}
          ocrKeys={ocrKeys}
          ocr2Keys={ocr2Keys}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="primary"
          type="submit"
          form="chain-configuration-form"
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
