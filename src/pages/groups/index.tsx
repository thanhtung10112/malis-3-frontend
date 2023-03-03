import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import {
  DialogGroupCreateEdit,
  useConfirm,
  confirmConstant,
  AppLayout,
  DeleteIcon,
  EnableIcon,
  DisableIcon,
  VerifiedUserIcon,
  EditIcon,
  CreateIcon
} from '@/components'

import { groupStore, commonStore } from '@/store/reducers'

import * as columnProperties from '@/utils/columnProperties'
import getMessageConfirm from '@/utils/getMessageConfirm'

import type { GridColumns } from '@material-ui/data-grid'
import type { GroupOperation } from '@/types/Group'

function Groups() {
  const { t } = useTranslation('group')
  const { confirm } = useConfirm()
  const router = useRouter()

  const dispatch = useDispatch()
  const permissions = useSelector(groupStore.selectPermissions)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const { wiki_page, column_tooltips } = useSelector(groupStore.selectInitDataForList)

  const disableButtonsControl = selectedRows.length <= 0

  const breadcrumbData = [
    { label: 'Home', href: '/' },
    { label: 'System Management', href: '/users' },
    { label: 'Groups Management', href: '/groups' }
  ]

  const handleOpenCreateDialog = () => {
    dispatch(groupStore.sagaOpenCreateDialog())
  }

  const handleOpenUpdateDialog = (id: number) => () => {
    dispatch(groupStore.sagaOpenUpdateDialog(id))
  }

  const onExecuteActions = (operation: GroupOperation) => async () => {
    const description = getMessageConfirm(t, 'group', selectedRows, operation)
    const result = await confirm({ description })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(
        commonStore.sagaExecuteOperation({
          entity: 'group',
          operation,
          operationList: selectedRows
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
      renderCell(param) {
        return <EditIcon onClick={handleOpenUpdateDialog(param.value as number)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.group_id,
      field: 'group_id',
      headerName: 'Group #',
      flex: 0.2
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.name,
      field: 'name',
      headerName: 'Group Name',
      flex: 0.4
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.description,
      field: 'description',
      headerName: 'Description',
      flex: 0.3
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
      disabled: !permissions?.create,
      onClick: handleOpenCreateDialog
    },
    {
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      disabled: disableButtonsControl || !permissions?.delete,
      onClick: onExecuteActions('delete')
    },
    {
      label: t('common:button.enable'),
      startIcon: <EnableIcon />,
      disabled: disableButtonsControl || !permissions?.disable_enable,
      onClick: onExecuteActions('enable')
    },
    {
      label: t('common:button.disable'),
      startIcon: <DisableIcon />,
      disabled: disableButtonsControl || !permissions?.disable_enable,
      onClick: onExecuteActions('disable')
    },
    {
      label: t('common:button.edit_permission'),
      startIcon: <VerifiedUserIcon />,
      onClick: () => router.push('/groups/permissions'),
      disabled: !permissions?.edit_permissions
    }
  ]

  return (
    <AppLayout
      entity="group"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      permissions={permissions}
      buttons={buttons}
      tableProps={{
        columns: columns
      }}
      Dialogs={<DialogGroupCreateEdit />}
    />
  )
}

export const getServerSideProps = useAuthMiddleware(['common', 'group', 'advanced_filter'])

export default Groups
