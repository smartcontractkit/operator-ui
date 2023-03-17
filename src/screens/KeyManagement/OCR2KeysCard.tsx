import React from 'react'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Chip from '@material-ui/core/Chip'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { ConfirmationDialog } from 'src/components/Dialogs/ConfirmationDialog'
import { LoadingRow } from 'src/components/TableRow/LoadingRow'
import { NoContentRow } from 'src/components/TableRow/NoContentRow'
import { OCR2KeyBundleRow } from './OCR2KeyBundleRow'

export interface Props {
  loading: boolean
  data?: FetchOcr2KeyBundles
  errorMsg?: string
  onDelete: (id: string) => Promise<any>
}

/**
 * This card follows the form and structure of OCRKeysCard but
 * does NOT yet offer a 'create' button as there are architecture
 * decisions TBD because OCR2 keys require association with a
 * chain family (e.g. EVM, Starknet, Solana) - but that list of
 * chains is becoming a more and more fluid/dynamic collection
 * and we need to consider how to offer this information from
 * the core to a client (in this case the operator UI)
 */
export const OCR2KeysCard: React.FC<Props> = ({ data, loading, onDelete }) => {
  const [confirmDeleteID, setConfirmDeleteID] = React.useState<string | null>(
    null,
  )

  return (
    <>
      <Card>
        <CardHeader
          title="Off-Chain Reporting 2 Keys"
          subheader="Manage your Off-Chain Reporting 2 Key Bundles"
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key Bundle</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <LoadingRow visible={loading} />
            <NoContentRow
              visible={data?.ocr2KeyBundles.results?.length === 0}
            />

            {data?.ocr2KeyBundles.results?.map((bundle, idx) => (
              <OCR2KeyBundleRow
                bundle={bundle}
                key={idx}
                onDelete={() => setConfirmDeleteID(bundle.id)}
              />
            ))}
          </TableBody>
        </Table>
      </Card>

      <ConfirmationDialog
        open={!!confirmDeleteID}
        maxWidth={false}
        title="Delete OCR2 Key Bundle"
        body={<Chip label={confirmDeleteID} />}
        confirmButtonText="Confirm"
        onConfirm={async () => {
          if (confirmDeleteID) {
            await onDelete(confirmDeleteID)
            setConfirmDeleteID(null)
          }
        }}
        cancelButtonText="Cancel"
        onCancel={() => setConfirmDeleteID(null)}
      />
    </>
  )
}
