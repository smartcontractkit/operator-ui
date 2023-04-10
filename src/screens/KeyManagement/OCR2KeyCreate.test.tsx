import * as React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  OCR2KeysCreate,
  Props as OCR2KeysCreateProps,
} from 'screens/KeyManagement/OCR2KeysCreate'
import { render, screen } from 'test-utils'
import { OCR2_KEY_FAMILY } from 'hooks/queries/useOCR2KeysQuery'
import userEvent from '@testing-library/user-event'
const { queryByText } = screen

function renderComponent(cardProps: OCR2KeysCreateProps, mocks: any[]) {
  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <OCR2KeysCreate {...cardProps} />
    </MockedProvider>,
  )
}

describe('OCR2KeysCard creation', () => {
  const familyMocks = {
    request: {
      query: OCR2_KEY_FAMILY,
      variables: {},
    },
    result: {
      data: {
        __type: {
          __typename: '__Type',
          enumValues: [
            { __typename: '__EnumValue', name: 'EVM' },
            { __typename: '__EnumValue', name: 'COSMOS' },
            { __typename: '__EnumValue', name: 'SOLANA' },
            { __typename: '__EnumValue', name: 'STARKNET' },
            { __typename: '__EnumValue', name: 'NEW-CHAIN-1' },
            { __typename: '__EnumValue', name: 'NEW-CHAIN-2' },
          ],
        },
      },
    },
  }

  const myObject = {
    showCreateKeyDialog: true,
    setToggleCreateKeyDialog(val: boolean) {
      this.showCreateKeyDialog = val
    },
    onCreate: jest.fn(() => Promise.resolve()),
  }

  jest
    .spyOn(myObject, 'setToggleCreateKeyDialog')
    .mockImplementation(() => myObject.showCreateKeyDialog)

  it('renders the create dialog with chain types', async () => {
    renderComponent(
      {
        showCreateKeyDialog: myObject.showCreateKeyDialog,
        setToggleCreateKeyDialog: myObject.setToggleCreateKeyDialog,
        onCreate: myObject.onCreate,
      },
      [familyMocks],
    )

    expect(
      await screen.findByText(`Create OCR2 Key Bundle`),
    ).toBeInTheDocument()
    expect(queryByText(`Chain type`)).toBeInTheDocument()
    expect(queryByText(`EVM`)).toBeInTheDocument()

    userEvent.click(await screen.findByText(`EVM`))

    expect(queryByText(`COSMOS`)).toBeInTheDocument()
    expect(queryByText(`SOLANA`)).toBeInTheDocument()
    expect(queryByText(`STARKNET`)).toBeInTheDocument()
    expect(queryByText(`NEW-CHAIN-1`)).toBeInTheDocument()
    expect(queryByText(`NEW-CHAIN-2`)).toBeInTheDocument()
  })

  it('renders the create dialog and trigger onCreate', async () => {
    renderComponent(
      {
        showCreateKeyDialog: myObject.showCreateKeyDialog,
        setToggleCreateKeyDialog: myObject.setToggleCreateKeyDialog,
        onCreate: myObject.onCreate,
      },
      [familyMocks],
    )

    expect(
      await screen.findByText(`Create OCR2 Key Bundle`),
    ).toBeInTheDocument()
    expect(queryByText(`Chain type`)).toBeInTheDocument()
    expect(await screen.findByText(`EVM`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`EVM`))
    expect(queryByText(`SOLANA`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`SOLANA`))
    expect(queryByText(`Cancel`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`Cancel`))

    //should close the dialog without calling onCreate
    expect(myObject.onCreate).toBeCalledTimes(0)

    //should open the dialog again
    myObject.setToggleCreateKeyDialog(true)

    expect(queryByText(`SOLANA`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`SOLANA`))
    expect(queryByText(`NEW-CHAIN-1`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`NEW-CHAIN-1`))
    expect(queryByText(`Create`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`Create`))

    //should call onCreate with the selected chain type
    expect(myObject.onCreate).toBeCalledTimes(1)
    expect(myObject.onCreate).toBeCalledWith('NEW-CHAIN-1')
  })
})
