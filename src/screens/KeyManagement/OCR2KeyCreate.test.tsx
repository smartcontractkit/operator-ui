import * as React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  OCR2KeysCreate,
  Props as OCR2KeysCreateProps,
} from 'screens/KeyManagement/OCR2KeysCreate'
import { render, screen } from 'test-utils'
import { OCR2_KEY_FAMILY } from 'hooks/queries/useOCR2KeysQuery'
import userEvent from '@testing-library/user-event'

function renderOCR2KeysCreateWithMocks(
  cardProps: OCR2KeysCreateProps,
  mocks: any[],
) {
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

  const ocr2KeysCreateProps: OCR2KeysCreateProps = {
    showCreateKeyDialog: true,
    setToggleCreateKeyDialog(val: boolean) {
      this.showCreateKeyDialog = val
    },
    onCreate: jest.fn(() => Promise.resolve()),
  }

  jest
    .spyOn(ocr2KeysCreateProps, 'setToggleCreateKeyDialog')
    .mockImplementation(() => ocr2KeysCreateProps.showCreateKeyDialog)

  it('renders the create dialog with chain types', async () => {
    renderOCR2KeysCreateWithMocks(ocr2KeysCreateProps, [familyMocks])

    expect(
      await screen.findByText(`Create OCR2 Key Bundle`),
    ).toBeInTheDocument()
    expect(screen.getByText(`Chain type`)).toBeInTheDocument()
    expect(screen.getByText(`EVM`)).toBeInTheDocument()

    userEvent.click(await screen.findByText(`EVM`))

    expect(screen.getByText(`COSMOS`)).toBeInTheDocument()
    expect(screen.getAllByText(`SOLANA`).length).toBeGreaterThan(0)
    expect(screen.getByText(`STARKNET`)).toBeInTheDocument()
    expect(screen.getByText(`NEW-CHAIN-1`)).toBeInTheDocument()
    expect(screen.getByText(`NEW-CHAIN-2`)).toBeInTheDocument()
  })

  it('renders the create dialog and trigger onCreate', async () => {
    renderOCR2KeysCreateWithMocks(ocr2KeysCreateProps, [familyMocks])

    expect(
      await screen.findByText(`Create OCR2 Key Bundle`),
    ).toBeInTheDocument()
    expect(screen.getByText(`Chain type`)).toBeInTheDocument()
    expect(await screen.findByText(`EVM`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`EVM`))
    expect(screen.getAllByText(`SOLANA`).length).toBeGreaterThan(0)
    userEvent.click((await screen.findAllByText(`SOLANA`))[0])
    expect(screen.getByText(`Cancel`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`Cancel`))

    //should close the dialog without calling onCreate
    expect(ocr2KeysCreateProps.onCreate).toHaveBeenCalledTimes(0)

    //should open the dialog again
    ocr2KeysCreateProps.setToggleCreateKeyDialog(true)

    expect((await screen.findAllByText(`SOLANA`)).length).toBeGreaterThan(0)
    userEvent.click((await screen.findAllByText(`SOLANA`))[0])
    expect(screen.getByText(`NEW-CHAIN-1`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`NEW-CHAIN-1`))
    expect(screen.getByText(`Create`)).toBeInTheDocument()
    userEvent.click(await screen.findByText(`Create`))

    //should call onCreate with the selected chain type
    expect(ocr2KeysCreateProps.onCreate).toHaveBeenCalledTimes(1)
    expect(ocr2KeysCreateProps.onCreate).toHaveBeenCalledWith('NEW-CHAIN-1')
  })
})
