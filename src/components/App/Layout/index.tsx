import { useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import useStyles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Head from 'next/head'

import { Paper, Grid } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'

import { When, Unless } from 'react-if'

import {
  AdvancedFilter,
  MakeAList,
  AppBreadcrumb,
  MalisNoViewPermissionOnModule,
  Footer,
  DataTablePagination,
  DataTableLoadingOverlay,
  DataTableNoRowsOverlay,
  AppButton,
  DataTableColumnMenu,
  AppSearchBar
} from '@/components'

import clsx from 'clsx'
import _ from 'lodash'
import { advancedFilterActions, commonStore, equivalenceStore } from '@/store/reducers'
import { createAction } from '@reduxjs/toolkit'
import { actionTypes } from '@/utils/constant'

import { TABLE_HEIGHT_INCLUDE_FOOTER } from '@/styles/vars/size'

import type { ButtonLayout, LayoutProps } from './type'
import AppNumber from '@/helper/AppNumber'

const Layout: React.FC<LayoutProps> = (props) => {
  const {
    breadcrumbs,
    buttons,
    Dialogs,
    Options,
    tableProps,
    exportable,
    permissions,
    searchProps,
    filterable,
    leftSection,
    tableSection,
    bottomSection,
    tableHeight,
    entity,
    wikiPage
  } = props

  const classes = useStyles()
  const { t } = useTranslation()
  const router = useRouter()

  const dispatch = useDispatch()
  const equivalenceType = useSelector(equivalenceStore.selectEquivalenceType)
  const isOpenAF = useSelector(advancedFilterActions.selectOpenAdvanceSearch)
  const tableState = useSelector(commonStore.selectTableState)
  const { table: loadingTable } = useSelector(commonStore.selectLoading)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const editRows = useSelector(commonStore.selectEditRows)

  const entityApp = useMemo(() => {
    if (entity === 'manufacturing_standard' || entity === 'material_standard') {
      return 'equivalence'
    }
    return entity
  }, [entity])

  const headTitle = useMemo(() => {
    if (!entityApp) {
      return t('common:loading')
    }
    if (entityApp === 'equivalence') {
      if (equivalenceType) {
        return t(`${entityApp}:head_title_${equivalenceType}`)
      }
      return t('common:loading')
    }
    return t(`${entityApp}:head_title`)
  }, [entityApp, equivalenceType])

  const dataList = useSelector((state) => {
    if (!entityApp) {
      return []
    }
    return state[entityApp]?.dataList || []
  })

  const getListAction = useMemo(() => createAction(`${entityApp}/${actionTypes.GET_LIST}`), [entityApp])

  const resetStateAction = useMemo(() => createAction(`${entityApp}/${actionTypes.RESET_STATE}`), [entityApp])

  const openCreateDialogAct = useMemo(() => createAction(`${entityApp}/${actionTypes.OPEN_CREATE_DIALOG}`), [entityApp])

  const openUpdateDialogAct = useMemo(
    () => createAction<number>(`${entityApp}/${actionTypes.OPEN_UPDATE_DIALOG}`),
    [entityApp]
  )

  useEffect(() => {
    if (!entity) {
      return
    }
    dispatch(commonStore.actions.setEntity(entity))
    dispatch(getListAction())
    return () => {
      dispatch(resetStateAction())
    }
  }, [entity, resetStateAction, getListAction])

  useEffect(() => {
    if (selectedRows.length > 0) {
      dispatch(commonStore.actions.setSelectedRows([]))
    }
    if (editRows.length > 0) {
      dispatch(commonStore.actions.setEditRows([]))
    }
  }, [dataList])

  useEffect(() => {
    const { id, action } = router.query
    if (AppNumber.isNumber(id) && action === 'update') {
      dispatch(openUpdateDialogAct((router.query as any).id))
    } else if (action === 'create') {
      dispatch(openCreateDialogAct())
    }
  }, [entityApp, actionTypes, router.query.id, router.query.action])

  const renderButtons = useCallback(() => {
    if (_.isArray(buttons)) {
      return (buttons as ButtonLayout[])
        .filter((button) => !button.hide)
        .map(({ label, hide, className, ...buttonProps }, index) => (
          <AppButton {...buttonProps} key={index} className={clsx(className, classes.buttonControl)}>
            {label}
          </AppButton>
        ))
    }
    return (
      <AppButton {...buttons} className={clsx(buttons?.className, classes.buttonControl)}>
        {buttons?.label}
      </AppButton>
    )
  }, [buttons])

  const handleChangePage = (page) => {
    dispatch(commonStore.actions.setTableState({ page }))
    dispatch(getListAction())
  }

  const handleChangePerpage = (per_page) => {
    dispatch(commonStore.actions.setTableState({ per_page }))
    handleChangePage(1)
  }

  const handleSearch = (event, query) => {
    dispatch(commonStore.actions.setSearchQuery(query))
    handleChangePage(1)
  }

  const handleSelectRows = ({ selectionModel }) => {
    dispatch(commonStore.actions.setSelectedRows(selectionModel))
  }

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      <AppBreadcrumb items={breadcrumbs} wikiPage={wikiPage} />

      <Paper elevation={1} className={classes.main}>
        <div className={classes.control}>
          <div className={classes.wrapControl}>
            <AppSearchBar
              onSearch={handleSearch}
              width={500}
              placeholder={t(`${entityApp}:search_placeholder`)}
              filterable={filterable}
              {...searchProps}
              disabled={!permissions?.view}
            />
            {Options}
          </div>
          <div className="">{renderButtons()}</div>
        </div>

        <When condition={isOpenAF}>
          <AdvancedFilter />
        </When>

        <When condition={permissions?.view}>
          <Grid
            container
            style={{
              height: tableHeight || TABLE_HEIGHT_INCLUDE_FOOTER,
              width: '100%'
            }}
          >
            <Unless condition={leftSection?.hide}>
              <Grid item {...leftSection.breakPoint} {..._.omit(leftSection, ['breakPoint', 'hide', 'Component'])}>
                {leftSection.Component}
              </Grid>
            </Unless>

            <Grid item {...tableSection?.breakPoint}>
              <DataGrid
                checkboxSelection
                loading={loadingTable}
                rows={dataList}
                headerHeight={30}
                rowHeight={30}
                hideFooter
                selectionModel={selectedRows}
                onSelectionModelChange={handleSelectRows}
                components={{
                  LoadingOverlay: DataTableLoadingOverlay,
                  NoRowsOverlay: DataTableNoRowsOverlay,
                  ColumnMenu: DataTableColumnMenu
                }}
                onCellClick={(params, event) => {
                  if (params.field === 'id') {
                    event.stopPropagation()
                  }
                }}
                {...tableProps}
              />
            </Grid>
          </Grid>
          {bottomSection}
          <DataTablePagination
            countSelectedItems={selectedRows.length}
            page={tableState.page}
            perPage={tableState.per_page}
            totalItems={tableState.total_items}
            onChangePage={handleChangePage}
            onChangePerPage={handleChangePerpage}
          />
          <Footer />
        </When>

        <When condition={!_.isNil(permissions) && permissions?.view === false}>
          <MalisNoViewPermissionOnModule />
        </When>
      </Paper>
      {Dialogs}
      <When condition={exportable}>
        <MakeAList />
      </When>
    </>
  )
}

Layout.defaultProps = {
  filterable: true,
  exportable: true,
  permissions: null,
  tableProps: {
    columns: []
  },
  tableSection: {
    breakPoint: { xs: 12 }
  },
  leftSection: {} as any
}

export default Layout
