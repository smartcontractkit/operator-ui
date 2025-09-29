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

    const { container } = render(
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

    await selectChainIdOnUI(container, '1111')

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

    const { container } = renderChainConfigurationForm(
      initialValues,
      handleSubmit,
    )

    const chainType = getByRole('button', { name: 'EVM' })
    userEvent.click(chainType)
    userEvent.click(getByRole('option', { name: 'APTOS' }))
    await screen.findByRole('button', { name: 'APTOS' })

    await selectChainIdOnUI(container, '2222')

    const address = container.querySelector('#select-accountAddr')
    expect(address).toBeInTheDocument()
    address && userEvent.click(address)
    userEvent.click(getByRole('option', { name: '0x123' }))
    await screen.findByRole('button', { name: '0x123' })

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

    const chainType = getByRole('button', { name: 'EVM' })
    userEvent.click(chainType)
    userEvent.click(getByRole('option', { name: 'APTOS' }))
    await screen.findByRole('button', { name: 'APTOS' })

    const chainIdTextBox = getByRole('textbox', { name: /chain id \*/i })
    userEvent.type(chainIdTextBox, '2222')

    const accountAddrTextBox = getByRole('textbox', {
      name: /account address \*/i,
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

    const { container } = renderChainConfigurationForm(
      initialValues,
      handleSubmit,
    )

    const chainType = getByRole('button', { name: 'EVM' })
    userEvent.click(chainType)
    userEvent.click(getByRole('option', { name: 'SUI' }))
    await screen.findByRole('button', { name: 'SUI' })

    await selectChainIdOnUI(container, '6666')

    const address = container.querySelector('#select-accountAddr')
    expect(address).toBeInTheDocument()
    address && userEvent.click(address)
    userEvent.click(getByRole('option', { name: '0x123' }))
    await screen.findByRole('button', { name: '0x123' })

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

    const chainType = getByRole('button', { name: 'EVM' })
    userEvent.click(chainType)
    userEvent.click(getByRole('option', { name: 'SUI' }))
    await screen.findByRole('button', { name: 'SUI' })

    const chainIdTextBox = getByRole('textbox', { name: /chain id \*/i })
    userEvent.type(chainIdTextBox, '6666')

    const accountAddrTextBox = getByRole('textbox', {
      name: /account address \*/i,
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

    const { container } = renderChainConfigurationForm(
      initialValues,
      handleSubmit,
    )

    const chainType = getByRole('button', { name: 'EVM' })
    userEvent.click(chainType)
    userEvent.click(getByRole('option', { name: 'SOLANA' }))
    await screen.findByRole('button', { name: 'SOLANA' })

    await selectChainIdOnUI(container, '3333')

    const address = container.querySelector('#select-accountAddr')
    expect(address).toBeInTheDocument()
    address && userEvent.click(address)
    userEvent.click(getByRole('option', { name: 'solana_xxxx' }))
    await screen.findByRole('button', { name: 'solana_xxxx' })

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

  const { container } = renderChainConfigurationForm(
    initialValues,
    handleSubmit,
  )

  const chainType = getByRole('button', { name: 'EVM' })
  userEvent.click(chainType)
  userEvent.click(getByRole('option', { name: 'TRON' }))
  await screen.findByRole('button', { name: 'TRON' })

  await selectChainIdOnUI(container, '4444')

  const address = container.querySelector('#select-accountAddr')
  expect(address).toBeInTheDocument()
  address && userEvent.click(address)
  userEvent.click(getByRole('option', { name: 'tron_xxxx' }))
  await screen.findByRole('button', { name: 'tron_xxxx' })

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

  const { container } = renderChainConfigurationForm(
    initialValues,
    handleSubmit,
  )

  const chainType = getByRole('button', { name: 'EVM' })
  userEvent.click(chainType)
  userEvent.click(getByRole('option', { name: 'TON' }))
  await screen.findByRole('button', { name: 'TON' })

  await selectChainIdOnUI(container, '5555')

  const address = container.querySelector('#select-accountAddr')
  expect(address).toBeInTheDocument()
  address && userEvent.click(address)
  userEvent.click(getByRole('option', { name: '123' }))
  await screen.findByRole('button', { name: '123' })

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

  const { container } = renderChainConfigurationForm(
    initialValues,
    handleSubmit,
    [],
    {
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
    },
  )

  const ocr2CheckBox = screen.getByText(/ocr2/i)
  userEvent.click(ocr2CheckBox)

  const keyBundleId2 = container.querySelector('#select-ocr2KeyBundleID')
  expect(keyBundleId2).toBeInTheDocument()
  // workaround ts lint warning - require check for null
  keyBundleId2 && userEvent.click(keyBundleId2)
  userEvent.click(getByRole('option', { name: 'ocr2_key_bundle_id (EVM)' }))
  await screen.findByRole('button', { name: 'ocr2_key_bundle_id (EVM)' })
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

async function selectChainIdOnUI(container: HTMLElement, chainId: string) {
  const chainIdSelect = container.querySelector('#select-chainID')
  expect(chainIdSelect).toBeInTheDocument()
  // workaround ts lint warning - require check for null
  chainIdSelect && userEvent.click(chainIdSelect)
  userEvent.click(getByRole('option', { name: chainId }))
  await screen.findByRole('button', { name: chainId })
}
