import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import {
  DialogManufacturerCreateEdit,
  AppLayout,
  CreateIcon,
  EnableIcon,
  DisableIcon,
  DeleteIcon,
  EditIcon,
  useConfirm,
  confirmConstant
} from '@/components'

import { commonStore, manufacturerStore } from '@/store/reducers'
import * as columnProperties from '@/utils/columnProperties'
import getMessageConfirm from '@/utils/getMessageConfirm'

import type { ManufacturerItem, ManufacturerOperation } from '@/types/Manufacturer'
import type { GridColumns } from '@material-ui/data-grid'

function Manufacturers() {
  const { t } = useTranslation('manufacturer')

  const { confirm } = useConfirm()

  const breadcrumbData = [
    { label: 'Home', href: '/' },
    { label: 'Drawings', href: '/drawings' },
    { label: 'Manufacturers Management', href: '/manufacturers' }
  ]

  const dispatch = useDispatch()
  const permissions = useSelector(manufacturerStore.selectPermissions)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const dialogState = useSelector(manufacturerStore.selectDialogState)
  const { wiki_page, column_tooltips } = useSelector(manufacturerStore.selectInitDataForList)
  const manuDetail = useSelector(manufacturerStore.selectDetail)
  const { wiki_page: wikiPageDialog } = useSelector(manufacturerStore.selectInitDataForCE)

  const isEmptySelectedRows = useMemo(() => selectedRows.length <= 0, [selectedRows])

  const handleOpenUpdateDialog = (id: number) => () => {
    dispatch(manufacturerStore.sagaOpenUpdateDialog(id))
  }

  const handleOpenCreateDialog = () => {
    dispatch(manufacturerStore.sagaOpenCreateDialog())
  }

  const handleExecuteOperation = (operation: ManufacturerOperation) => async () => {
    const description = getMessageConfirm(t, 'manufacturer', selectedRows, operation)
    const result = await confirm({ description })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(
        commonStore.sagaExecuteOperation({
          entity: 'manufacturer',
          operation,
          operationList: selectedRows
        })
      )
    }
  }

  const handleSubmit = (id: number, formData: ManufacturerItem) => {
    if (id) {
      dispatch(manufacturerStore.sagaUpdate({ formData, id }))
    } else {
      dispatch(manufacturerStore.sagaCreate(formData))
    }
  }

  const handleClose = () => {
    dispatch(manufacturerStore.sagaCloseDialog())
  }

  const handleGetNextCode = (currentData: ManufacturerItem) => {
    dispatch(manufacturerStore.sagaGenerateCode(currentData))
  }

  const columns: GridColumns = [
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips.edit,
      field: 'id',
      headerName: 'Edit',
      renderCell: (param) => {
        return <EditIcon onClick={handleOpenUpdateDialog(param.value as number)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.manufacturer_id,
      field: 'manufacturer_id',
      headerName: 'Manufacturer #',
      flex: 0.4
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.name,
      field: 'name',
      headerName: 'Name',
      flex: 0.4
    },

    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.status,
      field: 'status',
      headerName: 'Status',
      renderCell: (param) => (param.value ? <EnableIcon /> : <DisableIcon />)
    }
  ]

  const buttons = [
    {
      label: t('common:button.new'),
      startIcon: <CreateIcon />,
      onClick: handleOpenCreateDialog,
      disabled: !permissions?.create
    },
    {
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      disabled: isEmptySelectedRows || !permissions?.delete,
      onClick: handleExecuteOperation('delete')
    },
    {
      label: t('common:button.enable'),
      startIcon: <EnableIcon />,
      disabled: isEmptySelectedRows || !permissions?.disable_enable,
      onClick: handleExecuteOperation('enable')
    },
    {
      label: t('common:button.disable'),
      startIcon: <DisableIcon />,
      disabled: isEmptySelectedRows || !permissions?.disable_enable,
      onClick: handleExecuteOperation('disable')
    }
  ]

  return (
    <AppLayout
      entity="manufacturer"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      buttons={buttons}
      permissions={permissions}
      tableProps={{
        columns: columns
      }}
      Dialogs={
        <DialogManufacturerCreateEdit
          {...dialogState}
          permissions={permissions}
          wikiPage={wikiPageDialog}
          detail={manuDetail}
          onSubmit={handleSubmit}
          onClose={handleClose}
          onGetNextCode={handleGetNextCode}
        />
      }
    />
  )
}

export const getServerSideProps = useAuthMiddleware(['common', 'manufacturer', 'make_a_list', 'advanced_filter'])

export default Manufacturers
