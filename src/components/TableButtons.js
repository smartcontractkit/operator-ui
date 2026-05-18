import { IconButton } from '@mui/material'
import { withStyles } from 'src/utils/withStyles'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import React from 'react'

const styles = (theme) => ({
  customButtons: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
})

const TableButtons = (props) => {
  const firstPage = 1
  const currentPage = props.page
  const lastPage = Math.ceil(props.count / props.rowsPerPage)
  const handlePage = (page) => (e) => {
    page = Math.min(page, lastPage)
    page = Math.max(page, firstPage)
    if (props.history) props.history.push(`${props.replaceWith}/${page}`)
    props.onChangePage(e, page)
  }

  return (
    <div className={props.classes.customButtons}>
      <IconButton
        onClick={handlePage(firstPage)}
        disabled={currentPage <= firstPage}
        aria-label="First Page"
        size="large"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handlePage(currentPage - 1)}
        disabled={currentPage <= firstPage}
        aria-label="Previous Page"
        size="large"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handlePage(currentPage + 1)}
        disabled={currentPage >= lastPage}
        aria-label="Next Page"
        size="large"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handlePage(lastPage)}
        disabled={currentPage >= lastPage}
        aria-label="Last Page"
        size="large"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  )
}

export const FIRST_PAGE = 1
export default withStyles(styles)(TableButtons)
