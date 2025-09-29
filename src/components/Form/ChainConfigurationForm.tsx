import React from 'react'
import {
  Field,
  FieldAttributes,
  Form,
  Formik,
  FormikHelpers,
  useFormikContext,
} from 'formik'
import { CheckboxWithLabel, TextField } from 'formik-material-ui'
import * as Yup from 'yup'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { ChainTypes } from './ChainTypes'

export type FormValues = {
  accountAddr: string
  accountAddrPubKey?: string | null
  adminAddr: string
  chainID: string
  chainType: string
  fluxMonitorEnabled: boolean
  ocr1Enabled: boolean
  ocr1IsBootstrap: boolean
  ocr1KeyBundleID?: string | null
  ocr1Multiaddr?: string | null
  ocr1P2PPeerID?: string | null
  ocr2CommitPluginEnabled: boolean
  ocr2Enabled: boolean
  ocr2ExecutePluginEnabled: boolean
  ocr2ForwarderAddress?: string | null
  ocr2IsBootstrap: boolean
  ocr2KeyBundleID?: string | null
  ocr2MedianPluginEnabled: boolean
  ocr2MercuryPluginEnabled: boolean
  ocr2Multiaddr?: string | null
  ocr2P2PPeerID?: string | null
  ocr2RebalancerPluginEnabled: boolean
}

const ValidationSchema = Yup.object().shape({
  chainID: Yup.string().required('Required'),
  chainType: Yup.string().required('Required'),
  accountAddr: Yup.string().required('Required'),
  accountAddrPubKey: Yup.string().nullable(),
  adminAddr: Yup.string(),
  ocr1Multiaddr: Yup.string()
    .when(['ocr1Enabled', 'ocr1IsBootstrap'], {
      is: (enabled: boolean, isBootstrap: boolean) => enabled && isBootstrap,
      then: Yup.string().required('Required').nullable(),
    })
    .nullable(),
  ocr1P2PPeerID: Yup.string()
    .when(['ocr1Enabled', 'ocr1IsBootstrap'], {
      is: (enabled: boolean, isBootstrap: boolean) => enabled && !isBootstrap,
      then: Yup.string().required('Required').nullable(),
    })
    .nullable(),
  ocr1KeyBundleID: Yup.string()
    .when(['ocr1Enabled', 'ocr1IsBootstrap'], {
      is: (enabled: boolean, isBootstrap: boolean) => enabled && !isBootstrap,
      then: Yup.string().required('Required').nullable(),
    })
    .nullable(),
  ocr2Multiaddr: Yup.string()
    .when(['ocr2Enabled', 'ocr2IsBootstrap'], {
      is: (enabled: boolean, isBootstrap: boolean) => enabled && isBootstrap,
      then: Yup.string().required('Required').nullable(),
    })
    .nullable(),
  ocr2P2PPeerID: Yup.string()
    .when(['ocr2Enabled', 'ocr2IsBootstrap'], {
      is: (enabled: boolean, isBootstrap: boolean) => enabled && !isBootstrap,
      then: Yup.string().required('Required').nullable(),
    })
    .nullable(),
  ocr2KeyBundleID: Yup.string()
    .when(['ocr2Enabled', 'ocr2IsBootstrap'], {
      is: (enabled: boolean, isBootstrap: boolean) => enabled && !isBootstrap,
      then: Yup.string().required('Required').nullable(),
    })
    .nullable(),
  ocr2CommitPluginEnabled: Yup.boolean().required('Required'),
  ocr2ExecutePluginEnabled: Yup.boolean().required('Required'),
  ocr2MedianPluginEnabled: Yup.boolean().required('Required'),
  ocr2MercuryPluginEnabled: Yup.boolean().required('Required'),
  ocr2ForwarderAddress: Yup.string().nullable(),
})

const styles = (theme: Theme) => {
  return createStyles({
    supportedJobOptionsPaper: {
      padding: theme.spacing.unit * 2,
    },
  })
}

// A custom account address field which clears the input based on the chain id
// value changing, and also allows user to input their own value if none is available in the list.
interface AccountAddrFieldProps extends FieldAttributes<any> {
  addresses: string[]
  pubkeys: string[]
}

const AccountAddrField = ({
  addresses,
  pubkeys,
  ...props
}: AccountAddrFieldProps) => {
  const {
    values: { chainID, chainType, accountAddr, accountAddrPubKey },
    setFieldValue,
  } = useFormikContext<FormValues>()

  const [isCustom, setIsCustom] = React.useState(false)

  const prevChainID = React.useRef<string>()
  React.useEffect(() => {
    prevChainID.current = chainID
  }, [chainID])

  React.useEffect(() => {
    if (chainID !== prevChainID.current) {
      setFieldValue(props.name, '')
      setFieldValue('accountAddrPubKey', '')
      setIsCustom(false) // Reset custom address state when chainID changes
    }
  }, [chainID, setFieldValue, props.name])

  const handleSelectChange =
    (name: string) => (event: React.ChangeEvent<{ value: unknown }>) => {
      const value = event.target.value as string
      if (value === 'custom') {
        setIsCustom(true)
        setFieldValue(name, '')
      } else {
        setIsCustom(false)
        setFieldValue(name, value)
      }
    }

  switch (chainType) {
    case 'STARKNET':
      return (
        <>
          <Field
            component={TextField}
            id="accountAddr"
            name="accountAddr"
            label="Enter your account address"
            inputProps={{ 'data-testid': 'customAccountAddr-input' }}
            helperText="The account address used for this chain"
            required
            fullWidth
          />
          <div>
            <Field
              component={TextField}
              id="accountAddrPubKey"
              name="accountAddrPubKey"
              label="Account Address Public Key"
              required
              fullWidth
              helperText="The public key for your account address"
              FormHelperTextProps={{
                'data-testid': 'accountAddrPubKey-helper-text',
              }}
            />
          </div>
        </>
      )
    case 'APTOS':
      // Show two select fields for Aptos - one for the account address, and another one for the public key
      return (
        <>
          <Field
            {...props}
            select
            value={isCustom ? 'custom' : accountAddr}
            onChange={handleSelectChange(props.name)}
          >
            {addresses.map((address) => (
              <MenuItem key={address} value={address}>
                {address}
              </MenuItem>
            ))}
          </Field>

          <Field
            component={TextField}
            id="accountAddrPubKey"
            name="accountAddrPubKey"
            label="Account Address Public Key"
            required
            fullWidth
            helperText="The public key for your account address"
            FormHelperTextProps={{
              'data-testid': 'accountAddrPubKey-helper-text',
            }}
            select
            value={accountAddrPubKey}
            onChange={handleSelectChange('accountAddrPubKey')}
          >
            {pubkeys.map((pubkey) => (
              <MenuItem key={pubkey} value={pubkey}>
                {pubkey}
              </MenuItem>
            ))}
          </Field>
        </>
      )
    default:
      return (
        <Field
          {...props}
          select
          value={isCustom ? 'custom' : accountAddr}
          onChange={handleSelectChange(props.name)}
        >
          {addresses.map((address) => (
            <MenuItem key={address} value={address}>
              {address}
            </MenuItem>
          ))}
        </Field>
      )
  }
}

export interface Props extends WithStyles<typeof styles> {
  editing?: boolean
  initialValues: FormValues
  innerRef?: any
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => void | Promise<any>
  chains: ReadonlyArray<ChainsPayload_ResultsFields>
  accountsEVM: ReadonlyArray<EthKeysPayload_ResultsFields>
  accountsNonEvm?: FetchNonEvmKeys
  p2pKeys: ReadonlyArray<P2PKeysPayload_ResultsFields>
  ocrKeys: ReadonlyArray<OcrKeyBundlesPayload_ResultsFields>
  ocr2Keys: ReadonlyArray<Ocr2KeyBundlesPayload_ResultsFields>
  showSubmit?: boolean
}

// ChainConfigurationForm is used to create/edit the supported chain
// configurations for the Feeds Manager.
export const ChainConfigurationForm = withStyles(styles)(
  ({
    classes,
    editing = false,
    innerRef,
    initialValues,
    onSubmit,
    chains = [],
    accountsEVM = [],
    accountsNonEvm,
    p2pKeys = [],
    ocrKeys = [],
    ocr2Keys = [],
    showSubmit = false,
  }: Props) => {
    const sortedOcr2Keys = [...ocr2Keys].sort((a, b) => {
      if (a.chainType === b.chainType) {
        return a.id.localeCompare(b.id)
      }
      return a.chainType?.localeCompare(b.chainType ?? '') ?? 0
    })
    return (
      <Formik
        innerRef={innerRef}
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values }) => {
          let chainAccountAddresses: string[] = []
          let chainPublicKeys: string[] = []
          switch (values.chainType) {
            case ChainTypes.EVM:
              chainAccountAddresses = accountsEVM
                .filter(
                  (acc) => acc.chain.id == values.chainID && !acc.isDisabled,
                )
                .map((acc) => acc.address)
              break
            case ChainTypes.APTOS:
              chainAccountAddresses =
                accountsNonEvm?.aptosKeys.results.map((acc) => acc.account) ??
                []
              chainPublicKeys =
                accountsNonEvm?.aptosKeys.results.map((acc) => acc.id) ?? []
              break
            case ChainTypes.SOLANA:
              chainAccountAddresses =
                accountsNonEvm?.solanaKeys.results.map((acc) => acc.id) ?? []
              break
            case ChainTypes.TRON:
              chainAccountAddresses =
                accountsNonEvm?.tronKeys.results.map((acc) => acc.id) ?? []
              break
            case ChainTypes.TON:
              chainAccountAddresses =
                accountsNonEvm?.tonKeys.results.map(
                  (acc) => acc.addressBase64,
                ) ?? []
              break
            case ChainTypes.SUI:
              chainAccountAddresses =
                accountsNonEvm?.suiKeys.results.map((acc) => acc.id) ?? []
              break
            default:
              chainAccountAddresses = []
          }

          const filteredChainIds = chains.filter(
            (x) => x.network.toUpperCase() === values.chainType,
          )
          return (
            <Form
              data-testid="feeds-manager-form"
              id="chain-configuration-form"
              noValidate
            >
              <Grid container spacing={16}>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    id="chainType"
                    name="chainType"
                    label="Chain Type"
                    select
                    required
                    fullWidth
                    disabled={editing}
                  >
                    {/* todo: in future use chains query to retrieve list of supported chains */}
                    <MenuItem key={ChainTypes.EVM} value={ChainTypes.EVM}>
                      EVM
                    </MenuItem>
                    <MenuItem key={ChainTypes.APTOS} value={ChainTypes.APTOS}>
                      APTOS
                    </MenuItem>
                    <MenuItem key={ChainTypes.SOLANA} value={ChainTypes.SOLANA}>
                      SOLANA
                    </MenuItem>
                    <MenuItem key={ChainTypes.TRON} value={ChainTypes.TRON}>
                      TRON
                    </MenuItem>
                    <MenuItem key={ChainTypes.TON} value={ChainTypes.TON}>
                      TON
                    </MenuItem>
                    <MenuItem key={ChainTypes.TON} value={ChainTypes.TON}>
                      SUI
                    </MenuItem>
                  </Field>
                </Grid>

                <Grid item xs={12} md={6}>
                  {/* always show normal manual input field instead of selection if field is readonly (during editing) */}
                  {filteredChainIds.length > 0 && !editing ? (
                    <Field
                      component={TextField}
                      id="chainID"
                      name="chainID"
                      label="Chain ID"
                      required
                      fullWidth
                      select
                      disabled={editing}
                      inputProps={{ 'data-testid': 'chainID-input' }}
                      FormHelperTextProps={{
                        'data-testid': 'chainID-helper-text',
                      }}
                    >
                      {filteredChainIds.map((x) => (
                        <MenuItem key={x.id} value={x.id}>
                          {x.id}
                        </MenuItem>
                      ))}
                    </Field>
                  ) : (
                    <Field
                      component={TextField}
                      id="chainID"
                      name="chainID"
                      label="Chain ID"
                      required
                      fullWidth
                      disabled={editing}
                      inputProps={{ 'data-testid': 'chainID-manual-input' }}
                      FormHelperTextProps={{
                        'data-testid': 'chainID-helper-manual-text',
                      }}
                    />
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  {chainAccountAddresses.length > 0 ? (
                    <AccountAddrField
                      component={TextField}
                      id="accountAddr"
                      name="accountAddr"
                      label="Account Address"
                      inputProps={{ 'data-testid': 'accountAddr-input' }}
                      required
                      fullWidth
                      select
                      helperText="The account address used for this chain"
                      addresses={chainAccountAddresses}
                      pubkeys={chainPublicKeys}
                      FormHelperTextProps={{
                        'data-testid': 'accountAddr-helper-text',
                      }}
                    />
                  ) : (
                    <Field
                      component={TextField}
                      id="accountAddr"
                      name="accountAddr"
                      label="Account Address"
                      inputProps={{ 'data-testid': 'accountAddr-manual-input' }}
                      required
                      fullWidth
                      helperText="The account address used for this chain"
                      FormHelperTextProps={{
                        'data-testid': 'accountAddr-helper-manual-text',
                      }}
                    />
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    id="adminAddr"
                    name="adminAddr"
                    label="Admin Address"
                    fullWidth
                    helperText="The address used for LINK payments"
                    FormHelperTextProps={{
                      'data-testid': 'adminAddr-helper-text',
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography>Supported Job Types</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="fluxMonitorEnabled"
                    type="checkbox"
                    Label={{
                      label: 'Flux Monitor',
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="ocr1Enabled"
                    type="checkbox"
                    Label={{
                      label: 'OCR',
                    }}
                  />

                  {values.ocr1Enabled && (
                    <Paper className={classes.supportedJobOptionsPaper}>
                      <Grid container spacing={8}>
                        <>
                          <Grid item xs={12}>
                            <Field
                              component={CheckboxWithLabel}
                              name="ocr1IsBootstrap"
                              type="checkbox"
                              Label={{
                                label:
                                  'Is this node running as a bootstrap peer?',
                              }}
                            />
                          </Grid>

                          {values.ocr1IsBootstrap ? (
                            <Grid item xs={12}>
                              <Field
                                component={TextField}
                                id="ocr1Multiaddr"
                                name="ocr1Multiaddr"
                                label="Multiaddr"
                                required
                                fullWidth
                                helperText="The OCR Multiaddr which oracles use to query for network information"
                                FormHelperTextProps={{
                                  'data-testid': 'ocr1Multiaddr-helper-text',
                                }}
                              />
                            </Grid>
                          ) : (
                            <>
                              <Grid item xs={12} md={6}>
                                <Field
                                  component={TextField}
                                  id="ocr1P2PPeerID"
                                  name="ocr1P2PPeerID"
                                  label="Peer ID"
                                  select
                                  required
                                  fullWidth
                                  helperText="The Peer ID used for this chain"
                                  FormHelperTextProps={{
                                    'data-testid': 'ocr1P2PPeerID-helper-text',
                                  }}
                                >
                                  {p2pKeys.map((key) => (
                                    <MenuItem
                                      key={key.peerID}
                                      value={key.peerID}
                                    >
                                      {key.peerID}
                                    </MenuItem>
                                  ))}
                                </Field>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Field
                                  component={TextField}
                                  id="ocr1KeyBundleID"
                                  name="ocr1KeyBundleID"
                                  label="Key Bundle ID"
                                  select
                                  required
                                  fullWidth
                                  helperText="The OCR Key Bundle ID used for this chain"
                                  FormHelperTextProps={{
                                    'data-testid':
                                      'ocr1KeyBundleID-helper-text',
                                  }}
                                >
                                  {ocrKeys.map((key) => (
                                    <MenuItem key={key.id} value={key.id}>
                                      {key.id}
                                    </MenuItem>
                                  ))}
                                </Field>
                              </Grid>
                            </>
                          )}
                        </>
                      </Grid>
                    </Paper>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="ocr2Enabled"
                    type="checkbox"
                    Label={{
                      label: 'OCR2',
                    }}
                  />

                  {values.ocr2Enabled && (
                    <Paper className={classes.supportedJobOptionsPaper}>
                      <Grid container spacing={8}>
                        <>
                          <Grid item xs={12}>
                            <Field
                              component={CheckboxWithLabel}
                              name="ocr2IsBootstrap"
                              type="checkbox"
                              Label={{
                                label:
                                  'Is this node running as a bootstrap peer?',
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Field
                              component={TextField}
                              id="ocr2P2PPeerID"
                              name="ocr2P2PPeerID"
                              label="Peer ID"
                              select
                              required={!values.ocr2IsBootstrap}
                              fullWidth
                              helperText="The Peer ID used for this chain"
                              FormHelperTextProps={{
                                'data-testid': 'ocr2P2PPeerID-helper-text',
                              }}
                            >
                              {p2pKeys.map((key) => (
                                <MenuItem key={key.peerID} value={key.peerID}>
                                  {key.peerID}
                                </MenuItem>
                              ))}
                            </Field>
                          </Grid>

                          {values.ocr2IsBootstrap ? (
                            <Grid item xs={12}>
                              <Field
                                component={TextField}
                                id="ocr2Multiaddr"
                                name="ocr2Multiaddr"
                                label="Multiaddr"
                                required
                                fullWidth
                                helperText="The OCR2 Multiaddr which oracles use to query for network information"
                                FormHelperTextProps={{
                                  'data-testid': 'ocr2Multiaddr-helper-text',
                                }}
                              />
                            </Grid>
                          ) : (
                            <>
                              <Grid item xs={12} md={6}>
                                <Field
                                  component={TextField}
                                  id="ocr2KeyBundleID"
                                  name="ocr2KeyBundleID"
                                  label="Key Bundle ID"
                                  select
                                  required
                                  fullWidth
                                  helperText="The OCR2 Key Bundle ID used for this chain"
                                  FormHelperTextProps={{
                                    'data-testid':
                                      'ocr2KeyBundleID-helper-text',
                                  }}
                                >
                                  {sortedOcr2Keys.map((key) => (
                                    <MenuItem key={key.id} value={key.id}>
                                      {key.id} ({key.chainType})
                                    </MenuItem>
                                  ))}
                                </Field>
                              </Grid>

                              <Grid item xs={12}>
                                <Typography>Supported Plugins</Typography>
                              </Grid>

                              <Grid item xs={6}>
                                <Field
                                  component={CheckboxWithLabel}
                                  name="ocr2CommitPluginEnabled"
                                  type="checkbox"
                                  Label={{
                                    label: 'Commit',
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  component={CheckboxWithLabel}
                                  name="ocr2ExecutePluginEnabled"
                                  type="checkbox"
                                  Label={{
                                    label: 'Execute',
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  component={CheckboxWithLabel}
                                  name="ocr2RebalancerPluginEnabled"
                                  type="checkbox"
                                  Label={{
                                    label: 'Rebalancer',
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  component={CheckboxWithLabel}
                                  name="ocr2MedianPluginEnabled"
                                  type="checkbox"
                                  Label={{
                                    label: 'Median',
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  component={CheckboxWithLabel}
                                  name="ocr2MercuryPluginEnabled"
                                  type="checkbox"
                                  Label={{
                                    label: 'Mercury',
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12} md={12}>
                                <Field
                                  component={TextField}
                                  id="ocr2ForwarderAddress"
                                  name="ocr2ForwarderAddress"
                                  label="Forwarder Address (optional)"
                                  fullWidth
                                  helperText="The forwarder address from the Operator Forwarder Contract"
                                  FormHelperTextProps={{
                                    'data-testid':
                                      'ocr2ForwarderAddress-helper-text',
                                  }}
                                />
                              </Grid>
                            </>
                          )}
                        </>
                      </Grid>
                    </Paper>
                  )}
                </Grid>

                {showSubmit && (
                  <Grid item xs={12} md={7}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      size="large"
                    >
                      Submit
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Form>
          )
        }}
      </Formik>
    )
  },
)
