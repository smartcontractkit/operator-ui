import React from 'react'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import IconButton from '@mui/material/IconButton'
import { Theme } from '@mui/material/styles'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import Tooltip from '@mui/material/Tooltip'

const styles = (theme: Theme) =>
  createStyles({
    button: {
      width: 27,
      height: 27,
      minHeight: 27,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    icon: {
      fontSize: 18,
    },
  })

export const CopyIconButton = withStyles(styles)(({
  classes,
  data,
}: WithStyles<typeof styles> & { data: string }) => {
  const [copied, setCopied] = React.useState(false)

  return (
    <CopyToClipboard text={data} onCopy={() => setCopied(true)}>
      <Tooltip title="Copied!" open={copied} onClose={() => setCopied(false)}>
        <IconButton className={classes.button} size="large">
          <FileCopyOutlinedIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
    </CopyToClipboard>
  )
})
