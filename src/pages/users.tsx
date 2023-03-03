import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import {
  DialogUserCreateEdit,
  DialogUserResetPassword,
  useConfirm,
  confirmConstant,
  AppLayout,
  MakeAListIcon,
  EditIcon,
  DeleteIcon,
  EnableIcon,
  DisableIcon,
  LockIcon,
  UnclockIcon,
  CreateIcon
} from '@/components'

import { userStore, commonStore } from '@/store/reducers'
import * as columnProperties from '@/utils/columnProperties'
import getMessageConfirm from '@/utils/getMessageConfirm'

import type { GridColumns } from '@material-ui/data-grid'
import type { UserOperation } from '@/types/User'

function Users() {
  const { t } = useTranslation('user')
  const { confirm } = useConfirm()

  const dispatch = useDispatch()
  const userPermissions = useSelector(userStore.selectPermissions)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const { wiki_page, column_tooltips } = useSelector(userStore.selectInitDataForList)

  const isEmptySelectedRows = selectedRows.length <= 0

  const breadcrumbData = [
    { label: 'Home', href: '/' },
    { label: 'System Management', href: '/users' },
    { label: 'Users Management', href: '/users' }
  ]

  const handleOpenUpdateDialog = (id: number) => () => {
    dispatch(userStore.sagaOpenUpdateDialog(id))
  }

  const handleOpenCreateDialog = () => {
    dispatch(userStore.sagaOpenCreateDialog())
  }

  const handleExecuteOperation = (operation: UserOperation) => async () => {
    const description = getMessageConfirm(t, 'user', selectedRows, operation)
    const result = await confirm({ description })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(
        commonStore.sagaExecuteOperation({
          entity: 'user',
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
      renderCell: (param) => {
        return <EditIcon onClick={handleOpenUpdateDialog(param.value as number)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.user_id,
      field: 'user_id',
      headerName: 'Username',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.full_name,
      field: 'full_name',
      headerName: 'Full name',
      flex: 0.4
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.email,
      field: 'email',
      headerName: 'Email Address',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.user_groups,
      field: 'user_groups',
      headerName: 'Groups Membership',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.default_language,
      field: 'default_language',
      headerName: 'Default Language',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.valid_from,
      field: 'valid_from',
      headerName: 'Valid from',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.valid_until,
      field: 'valid_until',
      headerName: 'Valid until',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.status,
      field: 'status',
      headerName: 'Status',
      renderCell(param) {
        return param.value ? <EnableIcon /> : <DisableIcon />
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.locked,
      field: 'locked',
      headerName: 'Locked',
      renderCell: (param) => (param.value ? <LockIcon /> : <UnclockIcon />)
    }
  ]

  const buttons = [
    {
      label: t('common:button.new'),
      startIcon: <CreateIcon />,
      disabled: !userPermissions?.create,
      onClick: handleOpenCreateDialog
    },
    {
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      disabled: isEmptySelectedRows || !userPermissions?.delete,
      onClick: handleExecuteOperation('delete')
    },
    {
      label: t('common:button.enable'),
      startIcon: <EnableIcon />,
      disabled: isEmptySelectedRows || !userPermissions?.disable_enable,
      onClick: handleExecuteOperation('enable')
    },
    {
      label: t('common:button.disable'),
      startIcon: <DisableIcon />,
      disabled: isEmptySelectedRows || !userPermissions?.disable_enable,
      onClick: handleExecuteOperation('disable')
    },
    {
      label: t('common:button.lock'),
      startIcon: <LockIcon />,
      disabled: isEmptySelectedRows || !userPermissions?.lock_unlock,
      onClick: handleExecuteOperation('lock')
    },
    {
      label: t('common:button.unlock'),
      startIcon: <UnclockIcon />,
      disabled: isEmptySelectedRows || !userPermissions?.lock_unlock,
      onClick: handleExecuteOperation('unlock')
    },
    {
      label: t('common:button.make_a_list'),
      startIcon: <MakeAListIcon />,
      disabled: true
    }
  ]

  return (
    <AppLayout
      entity="user"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      buttons={buttons}
      permissions={userPermissions}
      Dialogs={
        <>
          <DialogUserCreateEdit />
          <DialogUserResetPassword />
        </>
      }
      tableProps={{
        columns: columns
      }}
    />
  )
}

export const getServerSideProps = useAuthMiddleware(['common', 'user', 'advanced_filter'])

export default Users
