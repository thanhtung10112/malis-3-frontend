import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from './styles'

import { Paper, IconButton, InputBase, Tooltip } from '@material-ui/core'
import { When } from 'react-if'

import { useConfirm, SearchIcon, FilterIcon } from '@/components'

import clsx from 'clsx'
import { commonStore, advancedFilterActions } from '@/store/reducers'

export type AppSearchBarProps = {
  placeholder?: string
  width?: number
  onSearch(event, query): void
  filterable?: boolean
  disabled?: boolean
}

const AppSearchBar: React.FC<AppSearchBarProps> = (props) => {
  const { placeholder, width, onSearch, filterable, disabled } = props

  const { confirm } = useConfirm()

  const [searchQuery, setSearchQuery] = useState('')

  const dispatch = useDispatch()
  const isOpenAF = useSelector(advancedFilterActions.selectOpenAdvanceSearch)

  const classes = useStyles()

  const handleInputQuery = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleSubmitSearch = async (event) => {
    event.preventDefault()
    if (searchQuery.length < 3) {
      const result = await confirm({
        description: 'Searching with less than 3 digits will be slow, do you want to continue?'
      })
      if (result === 'OK') {
        onSearch(event, searchQuery)
      }
    } else {
      onSearch(event, searchQuery)
    }
  }

  const onOpenAdvancedFilter = () => {
    if (disabled) {
      return
    }
    if (isOpenAF) {
      dispatch(advancedFilterActions.resetState())
      dispatch(commonStore.actions.setTableState({ page: 1 }))
      dispatch(advancedFilterActions.close())
    } else {
      dispatch(advancedFilterActions.open())
    }
  }

  return (
    <div className={classes.searchBar__container} data-testid="app-searchbar">
      <When condition={filterable}>
        <Tooltip title={isOpenAF ? 'Close Advanced Filter' : 'Open Advanced Filter'} aria-label="Advanced_Filter">
          <FilterIcon
            onClick={onOpenAdvancedFilter}
            className={clsx(classes.searchBar__filterIcon, {
              [classes.searchBar__disabled]: disabled
            })}
          />
        </Tooltip>
      </When>
      <Paper
        component="form"
        elevation={0}
        className={classes.searchBar__form}
        style={{ width }}
        onSubmit={handleSubmitSearch}
      >
        <IconButton type="submit" className={classes.searchBar__searchIcon} aria-label="search" disabled={disabled}>
          <SearchIcon />
        </IconButton>
        <InputBase
          disabled={disabled}
          className={classes.searchBar__input}
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputQuery}
        />
      </Paper>
    </div>
  )
}

AppSearchBar.defaultProps = {
  filterable: true,
  width: 300,
  placeholder: 'Search...',
  disabled: false
}

export default AppSearchBar
