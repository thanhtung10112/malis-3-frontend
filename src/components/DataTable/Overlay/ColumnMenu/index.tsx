import { useSelector, useDispatch } from 'react-redux'

import { GridColumnMenuContainer, GridColumnMenu, useGridSlotComponentProps } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/core'
import { Switch, Case, Default } from 'react-if'

import clsx from 'clsx'
import { commonStore } from '@/store/reducers'

import type { RootReducerType } from '@/store/reducers/rootReducer'

const useStyles = makeStyles((theme) => ({
  columnItem: {
    width: 127,
    height: 26,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&.selected': {
      backgroundColor: theme.palette.action.selected
    }
  }
}))

const DataTableColumnMenu = (props) => {
  const { apiRef } = useGridSlotComponentProps()
  const { hideMenu, currentColumn, color, ...other } = props

  const classes = useStyles()

  const dispatch = useDispatch()
  const languageList = useSelector((state: RootReducerType) => {
    const { entity } = state.common
    if (!entity) {
      return []
    }
    const parameters = state[entity].initDataForList.parameters
    if (!parameters) {
      return []
    }
    return parameters.PLLA
  })
  const currentLanguage = useSelector(commonStore.selectCurrentLanguage)

  const handleSelectLang = (language) => () => {
    dispatch(commonStore.actions.setCurrentLanguage(language))
    apiRef.current.hideColumnMenu()
  }

  const renderLanguages = () =>
    languageList
      .filter((language) => language.status)
      .map((language) => {
        return (
          <div
            key={language.id}
            className={clsx(classes.columnItem, {
              selected: language.id === currentLanguage.id
            })}
            onClick={handleSelectLang(language)}
          >
            {language.description}
          </div>
        )
      })

  return (
    <Switch>
      <Case condition={currentColumn.field === 'description'}>
        <GridColumnMenuContainer hideMenu={hideMenu} currentColumn={currentColumn} {...other}>
          {renderLanguages()}
        </GridColumnMenuContainer>
      </Case>
      <Default>
        <GridColumnMenu hideMenu={hideMenu} currentColumn={currentColumn} {...other} />
      </Default>
    </Switch>
  )
}

export default DataTableColumnMenu
