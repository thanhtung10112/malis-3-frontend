import { useDispatch, useSelector } from 'react-redux'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'
import { useTranslation } from 'next-i18next'
import useStyles from '@/styles/page/layout'

import NextLink from 'next/link'
import {
  DialogParameterTypeCreateEdit,
  useConfirm,
  EnableIcon,
  DisableIcon,
  EditIcon,
  CreateIcon,
  DeleteIcon,
  AppLayout
} from '@/components'

import { commonStore, parameterTypeStore } from '@/store/reducers'
import * as columnProperties from '@/utils/columnProperties'
import getMessageConfirm from '@/utils/getMessageConfirm'

import type { ParameterTypeOperation } from '@/types/ParameterType'
import type { GridColumns } from '@material-ui/data-grid'

function ParameterTypes() {
  const { t } = useTranslation('parameter_type')
  const { confirm } = useConfirm()
  const classes = useStyles()

  const dispatch = useDispatch()

  const breadcrumbData = [
    { label: 'Home', href: '/' },
    { label: 'System Management', href: '/users' },
    { label: 'Parameters Management', href: '/parameter_types' }
  ]

  const permissions = useSelector(parameterTypeStore.selectPermissions)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const { wiki_page, column_tooltips } = useSelector(parameterTypeStore.selectInitDataForList)

  const handleOpenCreateDialog = () => {
    dispatch(parameterTypeStore.extraActions.openCreateDialog())
  }

  const handleOpenUpdateDialog = (id: number) => async () => {
    dispatch(parameterTypeStore.extraActions.openUpdateDialog(id))
  }

  const executeOperation = (operation: ParameterTypeOperation) => async () => {
    const description = getMessageConfirm(t, 'parameter_type', selectedRows, operation)
    const result = await confirm({ description })
    if (result === 'OK') {
      dispatch(
        parameterTypeStore.extraActions.executeOperation({
          operation,
          parameter_types: selectedRows
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
        return <EditIcon onClick={handleOpenUpdateDialog(param.value as number)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.type_id,
      field: 'type_id',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => (
        <NextLink href={`/parameter_types/${params.row.id}`}>
          <a className={classes.link}>{params.value}</a>
        </NextLink>
      )
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.description,
      field: 'description',
      headerName: 'Description',
      flex: 0.6
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.rightColumn,
      description: column_tooltips.nbr_default,
      field: 'nbr_default',
      headerName: 'Max default',
      flex: 0.15
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.is_multilingual,
      field: 'is_multilingual',
      headerName: 'Multilingual',
      flex: 0.15,
      renderCell(param) {
        return param.value ? <EnableIcon /> : <DisableIcon />
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.status,
      field: 'status',
      headerName: 'Status',
      flex: 0.15,
      renderCell(param) {
        return param.value ? <EnableIcon /> : <DisableIcon />
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
      disabled: !permissions?.delete || selectedRows.length === 0,
      onClick: executeOperation('delete'),
      startIcon: <DeleteIcon />
    },
    {
      label: t('common:button.enable'),
      disabled: !permissions?.disable_enable || selectedRows.length === 0,
      onClick: executeOperation('enable'),
      startIcon: <EnableIcon />
    },
    {
      label: t('common:button.disable'),
      disabled: !permissions?.disable_enable || selectedRows.length === 0,
      onClick: executeOperation('disable'),
      startIcon: <DisableIcon />
    }
  ]

  return (
    <AppLayout
      entity="parameter_type"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      buttons={buttons}
      permissions={permissions}
      Dialogs={<DialogParameterTypeCreateEdit />}
      tableProps={{
        columns: columns
      }}
    />
  )
}

export const getServerSideProps = useAuthMiddleware(['common', 'parameter_type', 'advanced_filter'])

export default ParameterTypes
