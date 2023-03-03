import { useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import {
  DialogParameterCreateEdit,
  useConfirm,
  confirmConstant,
  EditIcon,
  DeleteIcon,
  EnableIcon,
  DisableIcon,
  CreateIcon,
  AppLayout
} from '@/components'

import * as columnProperties from '@/utils/columnProperties'
import { parameterStore, commonStore } from '@/store/reducers'
import getMessageConfirm from '@/utils/getMessageConfirm'

import type { ParameterOperation } from '@/types/Parameter'
import type { GridColumns } from '@material-ui/data-grid'

function Parameters() {
  const router = useRouter()
  const paramTypeId = router.query.param_type_id as string

  const { t } = useTranslation('parameter')
  const { confirm } = useConfirm()

  const dispatch = useDispatch()
  const permissions = useSelector(parameterStore.selectPermissions)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const { column_tooltips } = useSelector(parameterStore.selectInitDataForList)

  const breadcrumbData = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'System Management', href: '/users' },
      { label: 'Parameters Management', href: '/parameter_types' },
      { label: 'Codes Management', href: `/parameter_types/${paramTypeId}` }
    ],
    [paramTypeId]
  )

  const handleOpenCreateDialog = () => {
    dispatch(parameterStore.extraActions.openCreateDialog())
  }

  const handleOpenUpdateDialog = (id: number) => () => {
    dispatch(parameterStore.extraActions.openUpdateDialog(id))
  }

  const handleExecuteOperation = (operation: ParameterOperation) => async () => {
    const description = getMessageConfirm(t, 'parameter', selectedRows, operation)
    const result = await confirm({ description })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(
        parameterStore.extraActions.executeOperation({
          operation,
          parameters: selectedRows
        })
      )
    }
  }

  const columns: GridColumns = [
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips.edit,
      field: 'id',
      headerName: 'Edit',
      renderCell: (param) => {
        return <EditIcon onClick={handleOpenUpdateDialog(param.id as any)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.parameter_id,
      field: 'parameter_id',
      headerName: 'Code',
      width: 80
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.description,
      field: 'description',
      headerName: 'Description',
      flex: 0.4
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.properties,
      field: 'properties',
      headerName: 'Properties',
      flex: 0.7,
      renderCell: (param) => {
        const property_render = []
        for (const key in param.row.properties) {
          if (Object.prototype.hasOwnProperty.call(param.value, key)) {
            property_render.push(
              <>
                <b>{key}</b>: {param.value[key]} &emsp; <br />
              </>
            )
          }
        }
        return <>{property_render}</>
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips.is_default,
      width: 100,
      field: 'is_default',
      headerName: 'Default',
      renderCell: (param) => {
        return (
          <div style={{ width: '100%', paddingTop: '0.6rem' }}>
            {param.value ? <EnableIcon className="default-icon" /> : <DisableIcon className="not-default-icon" />}
          </div>
        )
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.order,
      field: 'order',
      headerName: 'Order',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips.edit,
      width: 60,
      field: 'status',
      headerName: 'Status',
      renderCell: (param) => {
        return (
          <div style={{ width: '100%', paddingTop: '0.6rem' }}>
            {param.value ? <EnableIcon className="enable-icon" /> : <DisableIcon className="disable-icon" />}
          </div>
        )
      }
    }
  ]

  const buttons = [
    {
      label: t('common:button.new'),
      startIcon: <CreateIcon />,
      disabled: !permissions?.create,
      onClick: handleOpenCreateDialog
    },
    {
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      disabled: !permissions?.delete || selectedRows.length <= 0,
      onClick: handleExecuteOperation('delete')
    },
    {
      label: t('common:button.enable'),
      startIcon: <EnableIcon />,
      disabled: !permissions?.disable_enable || selectedRows.length <= 0,
      onClick: handleExecuteOperation('enable')
    },
    {
      label: t('common:button.disable'),
      startIcon: <DisableIcon />,
      disabled: !permissions?.disable_enable || selectedRows.length <= 0,
      onClick: handleExecuteOperation('disable')
    }
  ]

  return (
    <AppLayout
      entity="parameter"
      breadcrumbs={breadcrumbData}
      buttons={buttons}
      permissions={permissions}
      Dialogs={<DialogParameterCreateEdit />}
      tableProps={{
        columns: columns
      }}
    />
  )
}

export const getServerSideProps = useAuthMiddleware(['common', 'parameter', 'advanced_filter'])

export default Parameters
