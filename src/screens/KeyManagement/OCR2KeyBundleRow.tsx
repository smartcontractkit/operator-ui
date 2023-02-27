import React from 'react'

import Button from 'src/components/Button'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import { KeyBundle } from './KeyBundle'
import { CopyIconButton } from 'src/components/Copy/CopyIconButton'

interface Props {
  bundle: Ocr2KeyBundlesPayload_ResultsFields
  onDelete: () => void
}

/**
 * This row follows the form and structure of OCRKeyBundleRow but
 * uses the new data for keys from OCR2
 */
export const OCR2KeyBundleRow: React.FC<Props> = ({ bundle, onDelete }) => {
  return (
    <TableRow hover>
      <TableCell>
        <KeyBundle
          primary={
            <b>
              Key ID: {bundle.id} <CopyIconButton data={bundle.id} />
            </b>
          }
          secondary={[
            <>Chain Type: {bundle.chainType}</>,
            <>Config Public Key: {bundle.configPublicKey}</>,
            <>On-Chain Public Key: {bundle.onChainPublicKey}</>,
            <>Off-Chain Public Key: {bundle.offChainPublicKey}</>,
          ]}
        />
      </TableCell>
      <TableCell align="right">
        <Button onClick={onDelete} variant="danger" size="medium">
          Delete
        </Button>
      </TableCell>
    </TableRow>
  )
}
