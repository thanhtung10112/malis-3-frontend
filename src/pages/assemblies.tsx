import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from '@/styles/page/layout'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'
import { useTranslation } from 'next-i18next'

import {
  AppLayout,
  EditIcon,
  DataTableCellExpand,
  CreateIcon,
  AppAutocompleteStyled,
  AppAutocompleteStyledAsync,
  DeleteIcon,
  useConfirm,
  DialogPart
} from '@/components'

import { assemblyStore, commonStore, partStore } from '@/store/reducers'
import { defaultProperties, iconColumn, centerColumn, rightColumn, descriptionsColumn } from '@/utils/columnProperties'
import AppNumber from '@/helper/AppNumber'
import getMessageConfirm from '@/utils/getMessageConfirm'
import _ from 'lodash'

import type { GridColumns } from '@material-ui/data-grid'
import type { DataForDropdown, ParameterOption, PayloadOperation } from '@/types/Common'

const AssembliesPage = () => {
  const classes = useStyles()
  const { t } = useTranslation('assembly')
  const { confirm } = useConfirm()

  const breadcrumbData = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Basic Options', href: '/drawings' },
      { label: 'Assemblies Management', href: '/assemblies' }
    ],
    []
  )

  const dispatch = useDispatch()
  const permissions = useSelector(assemblyStore.selectPermissions)
  const { column_tooltips, wiki_page, ...initDataForList } = useSelector(assemblyStore.selectInitDataForList)
  const userJob = useSelector(commonStore.selectUserValueJob)
  const userDrawing = useSelector(commonStore.selectUserValueDrawing)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const currentLang = useSelector(commonStore.selectCurrentLanguage)
  const dataList = useSelector(assemblyStore.selectDataList)

  useEffect(() => {
    return () => dispatch(commonStore.actions.resetUserValue())
  }, [])

  const handleOpenCreateDialog = () => {
    dispatch(partStore.sagaOpenCreateDialog('assembly'))
  }

  const handleChangeUserJob = (event, optionValue: ParameterOption) => {
    dispatch(assemblyStore.sagaChangeUserJob(optionValue))
  }

  const handleChangeUserDrawing = (event, optionValue: DataForDropdown) => {
    dispatch(assemblyStore.sagaChangeUserDrawing(optionValue))
  }

  const handleOpenUpdateDialog = (id) => () => {
    dispatch(partStore.sagaOpenUpdateDialog({ id, entity: 'assembly' }))
  }

  const handleDeleteAssemblies = async () => {
    const description = getMessageConfirm(t, 'assembly', selectedRows, 'delete')
    const result = await confirm({ description })
    if (result === 'OK') {
      const parts: PayloadOperation[] = _.map(selectedRows, (partId) => {
        const { dpn, id } = _.find(dataList, { id: partId })
        return { entity_id: dpn, id }
      })
      dispatch(commonStore.sagaExecuteOperation({ entity: 'part', operation: 'delete', operationList: parts }))
    }
  }

  const handleClosePartDialog = () => {
    dispatch(assemblyStore.sagaGetList())
  }

  const columns: GridColumns = [
    {
      ...defaultProperties,
      ...iconColumn,
      description: column_tooltips.edit,
      field: 'id',
      headerName: 'Edit',
      renderCell: (params) => {
        return <EditIcon onClick={handleOpenUpdateDialog(params.value)} />
      }
    },
    {
      ...defaultProperties,
      description: column_tooltips.dpn,
      field: 'dpn',
      headerName: 'Assembly #',
      flex: 0.2
    },
    {
      ...defaultProperties,
      ...descriptionsColumn(currentLang),
      description: column_tooltips.descriptions,
      flex: 0.3
    },
    {
      ...defaultProperties,
      ...rightColumn,
      description: column_tooltips.mass,
      headerName: 'Mass (kg)',
      flex: 0.2,
      field: 'mass',
      renderCell(params) {
        const value = AppNumber.format(params.value, { precision: 4 })
        return <DataTableCellExpand value={value} width={params.colDef.width} />
      }
    },
    {
      ...defaultProperties,
      ...centerColumn,
      description: column_tooltips.raw_unit,
      field: 'raw_unit',
      headerName: 'Unit'
    }
  ]

  const buttonsPage = [
    {
      label: t('common:button.new'),
      startIcon: <CreateIcon />,
      onClick: handleOpenCreateDialog,
      disabled: !permissions?.create || userJob.value < 0 || !userJob?.value
    },
    {
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      onClick: handleDeleteAssemblies,
      disabled: !permissions?.delete || selectedRows.length === 0 || userJob.value < 0
    }
  ]

  const Options = (
    <>
      <AppAutocompleteStyled
        className={classes.controlAutocomplete}
        width={200}
        label="Jobs"
        options={initDataForList.jobs}
        value={userJob}
        renderOption={(option) => option.description}
        primaryKeyOption="value"
        onChange={handleChangeUserJob}
      />
      <AppAutocompleteStyledAsync
        disabled={!userJob?.value}
        width={250}
        label="Drawings"
        className={classes.controlAutocomplete}
        compName="drawing_list"
        additionalData={{
          limit_to_job: userJob.value,
          include_all_drawings_option: true
        }}
        onChange={handleChangeUserDrawing}
        value={userDrawing}
        defaultOptions={[commonStore.initialState.userValue.drawing]}
      />
    </>
  )

  return (
    <AppLayout
      entity="assembly"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      searchProps={{
        width: 320
      }}
      buttons={buttonsPage}
      permissions={permissions}
      tableProps={{
        columns
      }}
      Dialogs={<DialogPart onClose={handleClosePartDialog} />}
      Options={Options}
    />
  )
}

export const getServerSideProps = useAuthMiddleware([
  'common',
  'assembly',
  'make_a_list',
  'advanced_filter',
  'item',
  'manufacturer'
])

export default AssembliesPage
