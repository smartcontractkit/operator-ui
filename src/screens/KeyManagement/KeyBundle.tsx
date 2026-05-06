import React from 'react'

import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Theme } from '@mui/material/styles'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import Typography from '@mui/material/Typography'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'

const styles = (theme: Theme) =>
  createStyles({
    listItemPrimary: {
      marginBottom: theme.spacing(1),
    },
    listItemSecondary: {
      color: theme.palette.text.secondary,
      display: 'block',
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
  })

interface Props extends WithStyles<typeof styles> {
  primary: React.ReactNode
  secondary: React.ReactNode[]
}

// KeyBundle provides a component which styles the key bundle information in a
// cell.
export const KeyBundle = withStyles(styles)(({
  classes,
  primary,
  secondary,
}: Props) => {
  return (
    <List dense={true}>
      <ListItem>
        <ListItemIcon>
          <Avatar className={classes.avatar}>
            <VpnKeyRoundedIcon />
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              className={classes.listItemPrimary}
              variant="body1"
              component="span"
            >
              {primary}
            </Typography>
          }
          secondary={secondary.map((secondaryItem: any, index: number) => (
            <Typography
              key={index}
              className={classes.listItemSecondary}
              variant="subtitle2"
              component="span"
            >
              {secondaryItem}
            </Typography>
          ))}
        />
      </ListItem>
    </List>
  )
})
