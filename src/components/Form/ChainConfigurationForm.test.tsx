import * as React from 'react'

import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from 'support/test-utils'

import { ChainConfigurationForm, FormValues } from './ChainConfigurationForm'
import { ChainTypes } from './ChainTypes'

const { getByRole, findByTestId } = screen

describe('ChainConfigurationForm', () => {
  it('validates top level input', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()

    render(
      <ChainConfigurationForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        accountsEVM={[]}
        accountsAptos={[]}
        chains={[]}
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
    expect(await findByTestId('accountAddr-helper-text')).toHaveTextContent(
      'Required',
    )
  })

  it('validates OCR input', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()

    render(
      <ChainConfigurationForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        accountsEVM={[]}
        accountsAptos={[]}
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
        accountsAptos={[]}
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

  test('should able to create APTOS chain config', async () => {
    const handleSubmit = jest.fn()
    const initialValues = emptyFormValues()
    initialValues.chainType = ChainTypes.EVM
    initialValues.adminAddr = '0x1234567'

    const { container } = render(
      <ChainConfigurationForm
        initialValues={initialValues}
        onSubmit={(x, _) => handleSubmit(x)}
        accountsEVM={[
          {
            address: '0x1111',
            chain: {
              id: '1111',
            },
            createdAt: '2021-10-06T00:00:00Z',
            isDisabled: false,
          },
        ]}
        accountsAptos={[
          {
            account: '0x123',
            id: '2222',
          },
        ]}
        chains={[
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
        ]}
        p2pKeys={[]}
        ocrKeys={[]}
        ocr2Keys={[]}
        showSubmit
      />,
    )

    const chainType = getByRole('button', { name: 'EVM' })
    userEvent.click(chainType)
    userEvent.click(getByRole('option', { name: 'APTOS' }))
    await screen.findByRole('button', { name: 'APTOS' })

    // no easy way to use react testing framework to do what i want,
    // had to resort to using #id and querySelector
    // formik does not seem to work well with react testing framework
    const chainId = container.querySelector('#select-chainID')
    expect(chainId).toBeInTheDocument()
    // workaround ts lint warning - unable to use chainId!
    chainId && userEvent.click(chainId)
    userEvent.click(getByRole('option', { name: '2222' }))
    await screen.findByRole('button', { name: '2222' })

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
