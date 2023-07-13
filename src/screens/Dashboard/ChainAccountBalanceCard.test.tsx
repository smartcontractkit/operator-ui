import * as React from 'react'
import { renderWithRouter, screen } from 'support/test-utils'
import { ChainAccountBalanceCard } from 'screens/Dashboard/ChainAccountBalanceCard'
import { EthKey } from 'types/generated/graphql'
import { buildETHKey } from 'support/factories/gql/fetchAccountBalances'
import { fromJuels } from 'utils/tokens/link'

const { findByText } = screen

describe('ChainAccountBalanceCard', () => {
  function renderComponent(keys: Array<EthKey>, chainID: string) {
    renderWithRouter(<ChainAccountBalanceCard chainID={chainID} keys={keys} />)
  }

  it('renders the card with one address', async () => {
    const key = buildETHKey()

    renderComponent([key] as Array<EthKey>, '111')

    expect(await findByText('Account Balances')).toBeInTheDocument()
    expect(await findByText('Chain ID 111')).toBeInTheDocument()
    expect(await findByText('Address')).toBeInTheDocument()
    expect(await findByText('Native Token Balance')).toBeInTheDocument()
    expect(await findByText('LINK Balance')).toBeInTheDocument()

    expect(await findByText(key.address)).toBeInTheDocument()
    expect(await findByText(key.ethBalance as string)).toBeInTheDocument()
    expect(
      await findByText(fromJuels(key.linkBalance as string)),
    ).toBeInTheDocument()
  })

  it('renders the card with two addresses', async () => {
    const keys = [
      buildETHKey(),
      buildETHKey({
        address: '0x0000000000000000000000000000000000000002',
        linkBalance: '0.123',
        ethBalance: '0.321',
      }),
    ]

    renderComponent(keys as Array<EthKey>, '12345321')

    expect(await findByText('Account Balances')).toBeInTheDocument()
    expect(await findByText('Chain ID 12345321')).toBeInTheDocument()

    expect(await findByText(keys[0].address)).toBeInTheDocument()
    expect(await findByText(keys[1].address)).toBeInTheDocument()
    expect(await findByText(keys[0].ethBalance as string)).toBeInTheDocument()
    expect(await findByText(keys[1].ethBalance as string)).toBeInTheDocument()
    expect(
      await findByText(fromJuels(keys[0].linkBalance as string)),
    ).toBeInTheDocument()
    expect(
      await findByText(fromJuels(keys[1].linkBalance as string)),
    ).toBeInTheDocument()
  })
})
