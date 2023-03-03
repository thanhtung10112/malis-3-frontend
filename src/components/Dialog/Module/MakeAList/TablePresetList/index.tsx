import React from 'react'

import { Button, Typography, Tooltip, Checkbox } from '@material-ui/core'

import { AddCircle as AddCircleIcon, Close as CloseIcon } from '@material-ui/icons'

import { AppAutocompleteStyled, DataTable, DataTableCellExpand } from '@/components/index'

import { Unless } from 'react-if'

import useStyles from './styles'
import useStylesLayout from '@/styles/page/layout'
import { useTranslation } from 'next-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'

import clsx from 'clsx'
import { makeAListActions } from '@/store/reducers'

import * as columnProperties from '@/utils/columnProperties'

import type { GridColumns, GridApi } from '@material-ui/data-grid'

function TablePresetList({ setActiveTab }) {
  const classes = useStyles()
  const classesLayout = useStylesLayout()
  const { t } = useTranslation(['make_a_list'])
  const makeAListForm = useFormContext()

  const refDataGrid = React.useRef<GridApi>(null as any)

  const [idSelected, setIdSelected] = React.useState<number>(null)

  const dispatch = useDispatch()
  const filterType = useSelector(makeAListActions.selectFilterType)
  const presetList = useSelector(makeAListActions.selectPresetList)
  const loadingTable = useSelector(makeAListActions.selectLoadingTable)
  const malPermissions = useSelector(makeAListActions.selectPermissions)
  const presetDefault = useSelector(makeAListActions.selectPresetDefault)
  const presetDetail = useSelector(makeAListActions.selectPresetDetail)

  const getColumnPresetList = () => {
    const onwColumns: GridColumns = [
      {
        ...columnProperties.defaultProperties,
        field: 'name',
        headerName: 'Name',
        flex: 0.6
      },
      {
        ...columnProperties.defaultProperties,
        headerName: 'Shared',
        field: 'is_shared',
        renderCell(params) {
          if (!refDataGrid.current) {
            refDataGrid.current = params.api
          }
          const message = params.value
            ? t('make_a_list:tooltip.unshare_checkbox')
            : t('make_a_list:tooltip.share_checkbox')
          return (
            <Tooltip title={message}>
              <Checkbox
                color="primary"
                checked={params.value as boolean}
                onChange={onSharePreset(params.id as number)}
              />
            </Tooltip>
          )
        }
      }
    ]
    const sharedColumns: GridColumns = [
      {
        ...columnProperties.defaultProperties,
        field: 'name',
        headerName: 'Name',
        flex: 0.6,
        renderCell(params) {
          if (!refDataGrid.current) {
            refDataGrid.current = params.api
          }
          return <DataTableCellExpand value={params.value} width={params.colDef.width} />
        }
      },
      {
        ...columnProperties.defaultProperties,
        field: 'created_by',
        headerName: t('advanced_filter:list.owner')
      }
    ]
    if (filterType === 'own') {
      return onwColumns
    }
    return sharedColumns
  }

  const getOptionFilterList = () => {
    const defaultOptions = [
      {
        name: 'Owner',
        value: 'own'
      },
      {
        name: 'Shared',
        value: 'shared'
      }
    ]
    if (malPermissions.update_system_default_presets) {
      defaultOptions.push({
        name: 'System',
        value: 'system'
      })
    }
    return defaultOptions
  }

  const filterOptions = React.useMemo(getOptionFilterList, [malPermissions.update_system_default_presets])
  const columnsMyPreset = React.useMemo(getColumnPresetList, [filterType])

  React.useEffect(() => {
    setIdSelected(presetDetail.id)
  }, [presetDetail])

  const onChangeFilterType = (_, { value }) => {
    dispatch(makeAListActions.changeFilterType(value))
  }

  const onSelectRowPresetDetail = (params) => {
    setActiveTab(0)
    makeAListForm.clearErrors()
    onSelectPresetDetail(params.id)()
  }

  const onSelectPresetDetail = (id) => () => {
    refDataGrid.current?.setSelectionModel([])
    dispatch(makeAListActions.setIsEditMode(true))
    dispatch(makeAListActions.getDetail(id))
  }

  const onClearUserDefault = () => {
    refDataGrid.current?.setSelectionModel([])
    dispatch(makeAListActions.clearDefault())
  }

  const onSharePreset = (id: number) => (event, shared: boolean) => {
    dispatch(makeAListActions.share({ id, shared }))
  }

  const onCreateFilter = () => {
    refDataGrid.current?.setSelectionModel([])
    dispatch(makeAListActions.resetPresetDetail())
    dispatch(makeAListActions.setIsEditMode(false))
    setActiveTab(0)
    makeAListForm.clearErrors()
  }

  return (
    <>
      <div className={classes.filterListTopSection}>
        <AppAutocompleteStyled
          label="Preset List"
          options={filterOptions}
          renderOption={(option) => option.name}
          defaultValue={filterOptions[0]}
          onChange={onChangeFilterType}
          primaryKeyOption="value"
        />
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          className={clsx(classesLayout.buttonControl, 'new', classes.btnCreatePreset)}
          style={{ background: '#0A65FF', color: 'white' }}
          onClick={onCreateFilter}
        >
          New preset
        </Button>
      </div>

      <Typography component="div" className={classes.wrapLabelFilter}>
        <Typography component="span" variant="body1">
          Default Preset:&nbsp;
        </Typography>
        <Typography
          component="span"
          variant="body1"
          className={classes.defaultFilterLink}
          noWrap
          onClick={onSelectPresetDetail(presetDefault.id)}
        >
          {presetDefault.name}
        </Typography>
        <Unless condition={presetDefault.is_system_default}>
          <CloseIcon onClick={onClearUserDefault} />
        </Unless>
      </Typography>

      <DataTable
        loading={loadingTable}
        tableHeight={570}
        disableColumnMenu
        columns={columnsMyPreset}
        rows={presetList}
        hideFooter
        onRowClick={onSelectRowPresetDetail}
        getRowClassName={(params) => clsx({ [classes.presetSelected]: params.id === idSelected })}
        onCellClick={(params, event) => {
          if (params.field === 'is_shared') {
            event.stopPropagation()
          }
        }}
      />
    </>
  )
}

export default TablePresetList
