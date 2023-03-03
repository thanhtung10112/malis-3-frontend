import { Button, Checkbox, Typography, Tooltip } from '@material-ui/core'

import { DataTable, DataTableCellExpand, CreateIcon, CloseIcon, AppAutocompleteStyled } from '@/components/index'

import { Unless } from 'react-if'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import useStyles from './styles'
import useStylesLayout from '@/styles/page/layout'

import clsx from 'clsx'

import { advancedFilterActions, commonStore } from '@/store/reducers'
import * as columnProperties from '@/utils/columnProperties'

import type { GridColumns, GridApi } from '@material-ui/data-grid'

function FilterPresetList({ onChangeActiveTab }) {
  // props.entity is the thing that you will pass to the backend to get the corresponding data for each module

  const classes = useStyles()
  const classesLayout = useStylesLayout()

  const refDataGrid = useRef<GridApi>(null as any)

  const [idSelected, setIdSelected] = useState<number>(null)

  const dispatch = useDispatch()

  const { t } = useTranslation(['common', 'advanced_filter'])

  const defaultFilter = useSelector(advancedFilterActions.selectDefaultFilter)
  const presetList = useSelector(advancedFilterActions.selectListData)
  const filterType = useSelector(advancedFilterActions.selectFilterType)
  const loading = useSelector(advancedFilterActions.selectLoading)
  const entity = useSelector(commonStore.selectEntity)
  const afPermissions = useSelector(advancedFilterActions.selectPermissions)
  const filterDetail = useSelector(advancedFilterActions.selectFilterDetail)

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
    if (afPermissions.update_system_default_presets) {
      defaultOptions.push({
        name: 'System',
        value: 'system'
      })
    }
    return defaultOptions
  }

  const filterOptions = useMemo(getOptionFilterList, [afPermissions.update_system_default_presets])

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
            ? t('advanced_filter:tooltip.unshare_checkbox')
            : t('advanced_filter:tooltip.share_checkbox')
          return (
            <Tooltip title={message}>
              <Checkbox
                color="primary"
                checked={params.value as boolean}
                onChange={onShareFilter(params.id as number)}
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

  const columnsMyPreset = useMemo(getColumnPresetList, [filterType])

  useEffect(() => {
    setIdSelected(filterDetail.id)
  }, [filterDetail])

  const onChangeFilterType = (_, { value }) => {
    dispatch(advancedFilterActions.changeFilterType(value))
    onChangeActiveTab(null, 0)
  }

  const onCreateFilter = () => {
    refDataGrid.current?.setSelectionModel([])
    dispatch(advancedFilterActions.setEditMode(false))
    dispatch(advancedFilterActions.resetFilterDetail(entity))
    onChangeActiveTab(null, 0)
  }

  const onClearUserDefault = () => {
    refDataGrid.current?.setSelectionModel([])
    dispatch(advancedFilterActions.clearDefaultFilter())
  }

  const onSelectFilterDetail = (id) => () => {
    refDataGrid.current?.setSelectionModel([])
    dispatch(advancedFilterActions.getDetail(id))
  }

  const onShareFilter = (id: number) => (_, is_shared: boolean) => {
    const data = { id, is_shared }
    dispatch(advancedFilterActions.share(data))
  }

  const onSelectRowPresetDetail = (params) => {
    onChangeActiveTab(null, 0)
    onSelectFilterDetail(params.id)()
  }

  return (
    <>
      <div className={classes.filterListTopSection}>
        <AppAutocompleteStyled
          primaryKeyOption="value"
          label="Preset List"
          options={filterOptions}
          defaultValue={filterOptions[0]}
          onChange={onChangeFilterType}
          renderOption={(option) => option.name}
        />
        <Button
          variant="contained"
          startIcon={<CreateIcon />}
          className={clsx(classesLayout.buttonControl, 'new', classes.btnCreatePreset)}
          onClick={onCreateFilter}
          style={{ background: '#0A65FF', color: 'white' }}
        >
          New preset
        </Button>
      </div>

      <Typography component="div" className={classes.wrapLabelFilter}>
        <Typography component="strong" variant="body1">
          {t('advanced_filter:filter_presets.default_filter')}&nbsp;
        </Typography>
        <Typography
          component="span"
          variant="body1"
          className={classes.defaultFilterLink}
          noWrap
          onClick={onSelectFilterDetail(defaultFilter.id)}
        >
          {defaultFilter.name}
        </Typography>
        <Unless condition={defaultFilter.is_system_default}>
          <CloseIcon onClick={onClearUserDefault} />
        </Unless>
      </Typography>
      <DataTable
        loading={loading.table}
        tableHeight={370}
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

export default FilterPresetList
