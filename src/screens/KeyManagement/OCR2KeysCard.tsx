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
import Button from '@material-ui/core/Button'
import { OCR2KeysCreate } from 'screens/KeyManagement/OCR2KeysCreate'

export interface Props {
  loading: boolean
  data?: FetchOcr2KeyBundles
  errorMsg?: string
  onDelete: (id: string) => Promise<any>
  onCreate: (chainType: string) => Promise<any>
}

export const OCR2KeysCard: React.FC<Props> = ({
  data,
  loading,
  onDelete,
  onCreate,
}) => {
  const [confirmDeleteID, setConfirmDeleteID] = React.useState<string | null>(
    null,
  )
  const [toggleCreateOCR2KeyDialog, setToggleCreateOCR2KeyDialog] =
    React.useState<boolean>(false)

  return (
    <>
      <Card>
        <CardHeader
          action={
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setToggleCreateOCR2KeyDialog(true)}
            >
              New OCR2 Key
            </Button>
          }
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
      <OCR2KeysCreate
        onCreate={onCreate}
        showCreateKeyDialog={toggleCreateOCR2KeyDialog}
        setToggleCreateKeyDialog={setToggleCreateOCR2KeyDialog}
      />
    </>
  )
}
