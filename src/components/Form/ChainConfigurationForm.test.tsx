import * as React from 'react'

import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from 'support/test-utils'

import { ChainConfigurationForm, FormValues } from './ChainConfigurationForm'
import { ChainTypes } from './ChainTypes'

const { getByRole, findByTestId } = screen

describe('ChainConfigurationForm', () => {
  it('validates top level input (with chains available)', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()
    initialValues.chainType = ChainTypes.EVM

    render(
      <ChainConfigurationForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        accountsEVM={[
          {
            address: '0x1111',
            chain: {
              id: '1111',
              network: 'evm',
            },
            createdAt: '2021-10-06T00:00:00Z',
            isDisabled: false,
          },
        ]}
        chains={[
          {
            id: '1111',
            enabled: true,
            network: ChainTypes.EVM,
          },
        ]}
        p2pKeys={[]}
        ocrKeys={[]}
        ocr2Keys={[]}
        showSubmit
      />,
    )

    userEvent.click(getByRole('button', { name: /submit/i }))

    expect(await findByTestId('chainID-helper-text')).toHaveTextContent(
      'Required',
    )

    await selectChainIdOnUI('1111')

    userEvent.click(getByRole('button', { name: /submit/i }))

    expect(await findByTestId('accountAddr-helper-text')).toHaveTextContent(
      'Required',
    )
  })

  it('validates top level input (with chains NOT available)', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()

    render(
      <ChainConfigurationForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        accountsEVM={[]}
        chains={[]}
        p2pKeys={[]}
        ocrKeys={[]}
        ocr2Keys={[]}
        showSubmit
      />,
    )

    userEvent.click(getByRole('button', { name: /submit/i }))

    expect(await findByTestId('chainID-helper-manual-text')).toHaveTextContent(
      'Required',
    )
    expect(
      await findByTestId('accountAddr-helper-manual-text'),
    ).toHaveTextContent('Required')
  })

  it('validates OCR input', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()

    render(
      <ChainConfigurationForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        accountsEVM={[]}
        chains={[]}
        p2pKeys={[]}
        ocrKeys={[]}
        ocr2Keys={[]}
        showSubmit
      />,
    )

    userEvent.click(getByRole('checkbox', { name: 'OCR' }))
    userEvent.click(getByRole('button', { name: /submit/i }))

    expect(await findByTestId('ocr1P2PPeerID-helper-text')).toHaveTextContent(
      'Required',
    )
    expect(await findByTestId('ocr1KeyBundleID-helper-text')).toHaveTextContent(
      'Required',
    )

    userEvent.click(
      getByRole('checkbox', {
        name: 'Is this node running as a bootstrap peer?',
      }),
    )

    expect(await findByTestId('ocr1Multiaddr-helper-text')).toHaveTextContent(
      'Required',
    )
  })

  it('validates OCR2 input', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()

    render(
      <ChainConfigurationForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        accountsEVM={[]}
        chains={[]}
        p2pKeys={[]}
        ocrKeys={[]}
        ocr2Keys={[]}
        showSubmit
      />,
    )

    userEvent.click(getByRole('checkbox', { name: 'OCR2' }))
    userEvent.click(getByRole('button', { name: /submit/i }))

    expect(await findByTestId('ocr2P2PPeerID-helper-text')).toHaveTextContent(
      'Required',
    )
    expect(await findByTestId('ocr2KeyBundleID-helper-text')).toHaveTextContent(
      'Required',
    )

    userEvent.click(
      getByRole('checkbox', {
        name: 'Is this node running as a bootstrap peer?',
      }),
    )

    expect(await findByTestId('ocr2Multiaddr-helper-text')).toHaveTextContent(
      'Required',
    )

    expect(
      await findByTestId('ocr2P2PPeerID-helper-text'),
    ).not.toHaveTextContent('Required')
  })

  test('should able to create APTOS chain config (with selection)', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()
    initialValues.chainType = ChainTypes.EVM
    initialValues.adminAddr = '0x1234567'

    renderChainConfigurationForm(initialValues, handleSubmit)

    await selectOptionOnUI(/chain type/i, 'APTOS')

    await selectChainIdOnUI('2222')

    await selectOptionOnUI(/^account address$/i, '0x123')

    await userEvent.click(getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        accountAddr: '0x123',
        accountAddrPubKey: '',
        adminAddr: '0x1234567',
        chainID: '2222',
        chainType: 'APTOS',
        fluxMonitorEnabled: false,
        ocr1Enabled: false,
        ocr1IsBootstrap: false,
        ocr1KeyBundleID: '',
        ocr1Multiaddr: '',
        ocr1P2PPeerID: '',
        ocr2CommitPluginEnabled: false,
        ocr2Enabled: false,
        ocr2ExecutePluginEnabled: false,
        ocr2ForwarderAddress: '',
        ocr2IsBootstrap: false,
        ocr2KeyBundleID: '',
        ocr2MedianPluginEnabled: false,
        ocr2MercuryPluginEnabled: false,
        ocr2Multiaddr: '',
        ocr2P2PPeerID: '',
        ocr2RebalancerPluginEnabled: false,
      })
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  test('should able to create APTOS chain config (with manual input)', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()
    initialValues.chainType = ChainTypes.EVM

    renderChainConfigurationForm(initialValues, handleSubmit, [], {
      aptosKeys: {
        results: [],
      },
      solanaKeys: {
        results: [],
      },
      starknetKeys: {
        results: [],
      },
      tronKeys: {
        results: [],
      },
      tonKeys: {
        results: [],
      },
      suiKeys: {
        results: [],
      },
    })

    await selectOptionOnUI(/chain type/i, 'APTOS')

    const chainIdTextBox = getByRole('textbox', { name: /chain id/i })
    userEvent.type(chainIdTextBox, '2222')

    const accountAddrTextBox = getByRole('textbox', {
      name: /account address/i,
    })
    userEvent.type(accountAddrTextBox, '0x123')

    await userEvent.click(getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        accountAddr: '0x123',
        accountAddrPubKey: '',
        adminAddr: '',
        chainID: '2222',
        chainType: 'APTOS',
        fluxMonitorEnabled: false,
        ocr1Enabled: false,
        ocr1IsBootstrap: false,
        ocr1KeyBundleID: '',
        ocr1Multiaddr: '',
        ocr1P2PPeerID: '',
        ocr2CommitPluginEnabled: false,
        ocr2Enabled: false,
        ocr2ExecutePluginEnabled: false,
        ocr2ForwarderAddress: '',
        ocr2IsBootstrap: false,
        ocr2KeyBundleID: '',
        ocr2MedianPluginEnabled: false,
        ocr2MercuryPluginEnabled: false,
        ocr2Multiaddr: '',
        ocr2P2PPeerID: '',
        ocr2RebalancerPluginEnabled: false,
      })
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  test('should able to create SUI chain config (with selection)', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()
    initialValues.chainType = ChainTypes.EVM
    initialValues.adminAddr = '0x1234567'

    renderChainConfigurationForm(initialValues, handleSubmit)

    await selectOptionOnUI(/chain type/i, 'SUI')

    await selectChainIdOnUI('6666')

    await selectOptionOnUI(/^account address$/i, '0x123')

    await userEvent.click(getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        accountAddr: '0x123',
        accountAddrPubKey: '',
        adminAddr: '0x1234567',
        chainID: '6666',
        chainType: 'SUI',
        fluxMonitorEnabled: false,
        ocr1Enabled: false,
        ocr1IsBootstrap: false,
        ocr1KeyBundleID: '',
        ocr1Multiaddr: '',
        ocr1P2PPeerID: '',
        ocr2CommitPluginEnabled: false,
        ocr2Enabled: false,
        ocr2ExecutePluginEnabled: false,
        ocr2ForwarderAddress: '',
        ocr2IsBootstrap: false,
        ocr2KeyBundleID: '',
        ocr2MedianPluginEnabled: false,
        ocr2MercuryPluginEnabled: false,
        ocr2Multiaddr: '',
        ocr2P2PPeerID: '',
        ocr2RebalancerPluginEnabled: false,
      })
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  test('should able to create SUI chain config (with manual input)', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()
    initialValues.chainType = ChainTypes.EVM

    renderChainConfigurationForm(initialValues, handleSubmit, [], {
      aptosKeys: {
        results: [],
      },
      solanaKeys: {
        results: [],
      },
      starknetKeys: {
        results: [],
      },
      tronKeys: {
        results: [],
      },
      tonKeys: {
        results: [],
      },
      suiKeys: {
        results: [],
      },
    })

    await selectOptionOnUI(/chain type/i, 'SUI')

    const chainIdTextBox = getByRole('textbox', { name: /chain id/i })
    userEvent.type(chainIdTextBox, '6666')

    const accountAddrTextBox = getByRole('textbox', {
      name: /account address/i,
    })
    userEvent.type(accountAddrTextBox, '0x123')

    await userEvent.click(getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        accountAddr: '0x123',
        accountAddrPubKey: '',
        adminAddr: '',
        chainID: '6666',
        chainType: 'SUI',
        fluxMonitorEnabled: false,
        ocr1Enabled: false,
        ocr1IsBootstrap: false,
        ocr1KeyBundleID: '',
        ocr1Multiaddr: '',
        ocr1P2PPeerID: '',
        ocr2CommitPluginEnabled: false,
        ocr2Enabled: false,
        ocr2ExecutePluginEnabled: false,
        ocr2ForwarderAddress: '',
        ocr2IsBootstrap: false,
        ocr2KeyBundleID: '',
        ocr2MedianPluginEnabled: false,
        ocr2MercuryPluginEnabled: false,
        ocr2Multiaddr: '',
        ocr2P2PPeerID: '',
        ocr2RebalancerPluginEnabled: false,
      })
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  test('should able to create Solana chain config', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()
    initialValues.chainType = ChainTypes.EVM
    initialValues.adminAddr = '0x1234567'

    renderChainConfigurationForm(initialValues, handleSubmit)

    await selectOptionOnUI(/chain type/i, 'SOLANA')

    await selectChainIdOnUI('3333')

    await selectOptionOnUI(/^account address$/i, 'solana_xxxx')

    await userEvent.click(getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        accountAddr: 'solana_xxxx',
        accountAddrPubKey: '',
        adminAddr: '0x1234567',
        chainID: '3333',
        chainType: 'SOLANA',
        fluxMonitorEnabled: false,
        ocr1Enabled: false,
        ocr1IsBootstrap: false,
        ocr1KeyBundleID: '',
        ocr1Multiaddr: '',
        ocr1P2PPeerID: '',
        ocr2CommitPluginEnabled: false,
        ocr2Enabled: false,
        ocr2ExecutePluginEnabled: false,
        ocr2ForwarderAddress: '',
        ocr2IsBootstrap: false,
        ocr2KeyBundleID: '',
        ocr2MedianPluginEnabled: false,
        ocr2MercuryPluginEnabled: false,
        ocr2Multiaddr: '',
        ocr2P2PPeerID: '',
        ocr2RebalancerPluginEnabled: false,
      })
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })
})

test('should able to create Tron chain config', async () => {
  const handleSubmit = jest.fn()
  const initialValues = emptyFormValues()
  initialValues.chainType = ChainTypes.EVM
  initialValues.adminAddr = '0x1234567'

  renderChainConfigurationForm(initialValues, handleSubmit)

  await selectOptionOnUI(/chain type/i, 'TRON')

  await selectChainIdOnUI('4444')

  await selectOptionOnUI(/^account address$/i, 'tron_xxxx')

  await userEvent.click(getByRole('button', { name: /submit/i }))

  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({
      accountAddr: 'tron_xxxx',
      accountAddrPubKey: '',
      adminAddr: '0x1234567',
      chainID: '4444',
      chainType: 'TRON',
      fluxMonitorEnabled: false,
      ocr1Enabled: false,
      ocr1IsBootstrap: false,
      ocr1KeyBundleID: '',
      ocr1Multiaddr: '',
      ocr1P2PPeerID: '',
      ocr2CommitPluginEnabled: false,
      ocr2Enabled: false,
      ocr2ExecutePluginEnabled: false,
      ocr2ForwarderAddress: '',
      ocr2IsBootstrap: false,
      ocr2KeyBundleID: '',
      ocr2MedianPluginEnabled: false,
      ocr2MercuryPluginEnabled: false,
      ocr2Multiaddr: '',
      ocr2P2PPeerID: '',
      ocr2RebalancerPluginEnabled: false,
    })
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})

test('should able to create TON chain config', async () => {
  const handleSubmit = jest.fn()
  const initialValues = emptyFormValues()
  initialValues.chainType = ChainTypes.EVM
  initialValues.adminAddr = '0x1234567'

  renderChainConfigurationForm(initialValues, handleSubmit)

  await selectOptionOnUI(/chain type/i, 'TON')

  await selectChainIdOnUI('5555')

  await selectOptionOnUI(/^account address$/i, '123')

  await userEvent.click(getByRole('button', { name: /submit/i }))

  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({
      accountAddr: '123',
      accountAddrPubKey: '',
      adminAddr: '0x1234567',
      chainID: '5555',
      chainType: 'TON',
      fluxMonitorEnabled: false,
      ocr1Enabled: false,
      ocr1IsBootstrap: false,
      ocr1KeyBundleID: '',
      ocr1Multiaddr: '',
      ocr1P2PPeerID: '',
      ocr2CommitPluginEnabled: false,
      ocr2Enabled: false,
      ocr2ExecutePluginEnabled: false,
      ocr2ForwarderAddress: '',
      ocr2IsBootstrap: false,
      ocr2KeyBundleID: '',
      ocr2MedianPluginEnabled: false,
      ocr2MercuryPluginEnabled: false,
      ocr2Multiaddr: '',
      ocr2P2PPeerID: '',
      ocr2RebalancerPluginEnabled: false,
    })
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})

test('should be able to select OCR2 Job Type with Key Bundle ID', async () => {
  const handleSubmit = jest.fn()
  const initialValues = emptyFormValues()
  initialValues.chainType = ChainTypes.EVM

  renderChainConfigurationForm(initialValues, handleSubmit, [], {
    aptosKeys: {
      results: [],
    },
    solanaKeys: {
      results: [],
    },
    starknetKeys: {
      results: [],
    },
    tronKeys: {
      results: [],
    },
    tonKeys: {
      results: [],
    },
    suiKeys: {
      results: [],
    },
  })

  const ocr2CheckBox = screen.getByText(/ocr2/i)
  userEvent.click(ocr2CheckBox)

  await selectOptionOnUI(/key bundle id/i, 'ocr2_key_bundle_id (EVM)')
})

function emptyFormValues(): FormValues {
  return {
    chainID: '',
    chainType: '',
    accountAddr: '',
    accountAddrPubKey: '',
    adminAddr: '',
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
}

function renderChainConfigurationForm(
  initialValues: FormValues,
  onSubmit: (x: FormValues) => void,
  chains: ChainsPayload_ResultsFields[] | undefined = [
    {
      id: '1111',
      enabled: true,
      network: 'evm',
    },
    {
      id: '2222',
      enabled: true,
      network: 'aptos',
    },
    {
      id: '3333',
      enabled: true,
      network: 'solana',
    },
    {
      id: '4444',
      enabled: true,
      network: 'tron',
    },
    {
      id: '5555',
      enabled: true,
      network: 'ton',
    },
    {
      id: '6666',
      enabled: true,
      network: 'sui',
    },
  ],
  accountsNonEvm: FetchNonEvmKeys | undefined = {
    aptosKeys: {
      results: [{ account: '0x123', id: '2222' }],
    },
    solanaKeys: {
      results: [{ id: 'solana_xxxx' }],
    },
    starknetKeys: {
      results: [{ id: 'starknet_xxxx' }],
    },
    tronKeys: {
      results: [{ id: 'tron_xxxx' }],
    },
    tonKeys: {
      results: [{ addressBase64: '123', rawAddress: '0:456', id: 'ton_xxxx' }],
    },
    suiKeys: {
      results: [{ account: '0x123', id: '6666' }],
    },
  },
) {
  return render(
    <ChainConfigurationForm
      initialValues={initialValues}
      onSubmit={(x, _) => onSubmit(x)}
      accountsEVM={[
        {
          address: '0x1111',
          chain: {
            id: '1111',
            network: 'evm',
          },
          createdAt: '2021-10-06T00:00:00Z',
          isDisabled: false,
        },
      ]}
      accountsNonEvm={accountsNonEvm}
      chains={chains}
      p2pKeys={[]}
      ocrKeys={[]}
      ocr2Keys={[
        {
          id: 'ocr2_key_bundle_id',
          chainType: 'EVM',
          offChainPublicKey: 'ocr2_public_key',
          onChainPublicKey: 'ocr2_on_chain_public_key',
          configPublicKey: 'ocr2_config_public_key',
        },
      ]}
      showSubmit
    />,
  )
}

async function selectChainIdOnUI(chainId: string) {
  await selectOptionOnUI(/chain id/i, chainId)
}

async function selectOptionOnUI(label: RegExp, optionName: string) {
  userEvent.click(getByRole('combobox', { name: label }))
  userEvent.click(getByRole('option', { name: optionName }))
  await waitFor(() => {
    expect(getByRole('combobox', { name: label })).toHaveTextContent(optionName)
  })
}
