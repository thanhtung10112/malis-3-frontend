import React from 'react'
import clsx from 'clsx'

import { Menu, MenuItem, TextField, Button, Typography } from '@material-ui/core'

import NumbericTextField from 'react-number-format'

import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks'

import {
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  ArrowDropDown as ArrowDropDownIcon
} from '@material-ui/icons'

import { usePagination } from '@material-ui/lab'

import useStyles from './styles'

export type Props = {
  countSelectedItems: number
  totalItems: number
  page: number
  perPage: number
  onChangePage(page: number): void
  onChangePerPage(perPage: number): void
}

function DataTablePagination(props: Props) {
  const { countSelectedItems, page, perPage, totalItems, onChangePage, onChangePerPage } = props
  const classes = useStyles()

  const [numberGoToPage, setNumberGoToPage] = React.useState(0)

  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

  const count = Math.ceil(totalItems / perPage)

  const pagination = usePagination({
    count,
    page
  })

  React.useEffect(() => {
    setNumberGoToPage(page)
  }, [page])

  const handleChangePage = (pageNumber: number) => () => {
    if (pageNumber !== 0 && pageNumber <= count) {
      onChangePage(pageNumber)
    }
  }

  const handleChangePerpage = (perPage) => () => {
    popupState.close()
    onChangePerPage(perPage)
  }

  const onChangeGoToPage = (values) => {
    setNumberGoToPage(values.floatValue)
  }

  const onGoToPage = (event) => {
    event.preventDefault()
    handleChangePage(numberGoToPage)()
  }

  return (
    <div className={classes.root}>
      <div className={classes.wrapCountSelected}>{countSelectedItems} SELECTED ITEM(S)</div>
      <div className={classes.wrapControlPaginate}>
        <div className={classes.perPage}>
          <span>Rows per page:</span>
          <div className={classes.choosePerpage} {...bindTrigger(popupState)} role="button" aria-expanded="false">
            <span>{perPage}</span>
            <ArrowDropDownIcon />
          </div>
        </div>
        <nav className={classes.rootPageNumber} aria-label="pagination">
          <ul className={classes.pageList}>
            {pagination.items.map(({ page, type, selected, ...item }, index) => {
              const itemProps = {
                key: `pagination - ${index}`,
                onClick: handleChangePage(page),
                style: { cursor: 'pointer', fontWeight: 500 }
              }
              if (type === 'end-ellipsis' || type === 'start-ellipsis') {
                return (
                  <Typography {...itemProps} variant="body2" className={classes.threeDots} component="li">
                    ...
                  </Typography>
                )
              } else if (type === 'page') {
                return (
                  <Typography
                    {...item}
                    {...itemProps}
                    aria-label="page"
                    variant="body2"
                    component="li"
                    className={clsx(classes.pageNumber, selected && classes.pageNumberSelected)}
                  >
                    {page}
                  </Typography>
                )
              } else if (type === 'next' || type === 'previous') {
                return (
                  <Typography
                    {...item}
                    {...itemProps}
                    aria-label="icon"
                    className={clsx(
                      classes.pageNumber,
                      classes.nextPrevIcon,
                      classes.nextIcon,
                      item.disabled && classes.disabled
                    )}
                    component="li"
                  >
                    {type === 'next' ? <NavigateNextIcon /> : <NavigateBeforeIcon />}
                  </Typography>
                )
              } else {
                return (
                  <Typography {...item} {...itemProps} component="li">
                    {type}
                  </Typography>
                )
              }
            })}
          </ul>
        </nav>
        <div className="go-to-page">
          <form onSubmit={onGoToPage}>
            <NumbericTextField
              inputProps={{ 'data-testid': 'gotopage' }}
              aria-placeholder="gotopage"
              style={{ width: 70 }}
              decimalScale={0}
              allowNegative={false}
              value={numberGoToPage}
              onValueChange={onChangeGoToPage}
              customInput={TextField}
              InputProps={{
                endAdornment: (
                  <Button className={classes.pageNumberItem} onClick={onGoToPage} aria-label="go-to-page">
                    Go
                  </Button>
                )
              }}
            />
          </form>
        </div>
      </div>
      <Menu
        {...bindMenu(popupState)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={handleChangePerpage(10)}>
          <Typography variant="body2">10</Typography>
        </MenuItem>
        <MenuItem onClick={handleChangePerpage(20)}>
          <Typography variant="body2">20</Typography>
        </MenuItem>
        <MenuItem onClick={handleChangePerpage(50)}>
          <Typography variant="body2">50</Typography>
        </MenuItem>
        <MenuItem onClick={handleChangePerpage(100)}>
          <Typography variant="body2">100</Typography>
        </MenuItem>
        <MenuItem onClick={handleChangePerpage(200)}>
          <Typography variant="body2">200</Typography>
        </MenuItem>
      </Menu>
    </div>
  )
}
export default DataTablePagination
