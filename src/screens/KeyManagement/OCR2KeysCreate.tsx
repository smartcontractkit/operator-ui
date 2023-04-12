import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { ConfirmationDialog } from 'components/Dialogs/ConfirmationDialog'
import { useOCR2KeyFamilyQuery } from 'hooks/queries/useOCR2KeysQuery'

export interface Props {
  showCreateKeyDialog: boolean
  setToggleCreateKeyDialog: (toggleCreateKeyDialog: boolean) => void
  onCreate: (chainType: string) => Promise<void>
}

export const OCR2KeysCreate: React.FC<Props> = ({
  showCreateKeyDialog,
  setToggleCreateKeyDialog,
  onCreate,
}) => {
  const [createOCR2KeyType, setCreateOCR2KeyType] = React.useState<
    string | undefined
  >(undefined)

  const handleChainTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCreateOCR2KeyType(event.target.value as string)
  }

  const createOCR2KeyHandler = () => {
    setToggleCreateKeyDialog(false)
    if (createOCR2KeyType == undefined) {
      return
    }
    onCreate(createOCR2KeyType)
  }

  const { loading, error, data } = useOCR2KeyFamilyQuery()
  if (loading || error) return <div />

  const supportedChainFamilies: Array<string> = data?.__type.enumValues.map(
    (chainFamily: { name: string }) => {
      return chainFamily.name
    },
  )
  if (!createOCR2KeyType) {
    setCreateOCR2KeyType(supportedChainFamilies[0])
  }

  return (
    <ConfirmationDialog
      open={showCreateKeyDialog}
      maxWidth={false}
      title="Create OCR2 Key Bundle"
      body={
        <TextField
          id="ocr2-create-key"
          name="ocr2 create key"
          fullWidth
          select
          label="Chain type"
          value={createOCR2KeyType}
          onChange={handleChainTypeChange}
          helperText="Create OCR2 Key bundle"
        >
          {supportedChainFamilies?.map((chain) => (
            <MenuItem key={chain} value={chain} name={chain}>
              {chain}
            </MenuItem>
          ))}
        </TextField>
      }
      confirmButtonText="Create"
      confirmButtonEnabled={!createOCR2KeyType}
      onConfirm={createOCR2KeyHandler}
      cancelButtonText="Cancel"
      onCancel={() => setToggleCreateKeyDialog(false)}
    />
  )
}
