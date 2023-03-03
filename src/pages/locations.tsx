import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import { Grid, Typography } from '@material-ui/core'

import {
  DialogLocationCreateEdit,
  useConfirm,
  confirmConstant,
  AppLayout,
  MakeAListIcon,
  StatisticIcon,
  EnableIcon,
  DisableIcon,
  EditIcon,
  DeleteIcon,
  CreateIcon
} from '@/components'

import { makeAListActions, commonStore, locationStore } from '@/store/reducers'

import getMessageConfirm from '@/utils/getMessageConfirm'
import * as columnProperties from '@/utils/columnProperties'

import type { Action } from '@/types/Common'
import type { GridColumns } from '@material-ui/data-grid'

function Locations() {
  const { t } = useTranslation('location')

  const { confirm } = useConfirm()

  const breadcrumbData = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Basic Options', href: '/jobs' },
      { label: 'Locations Management', href: '/locations' }
    ],
    []
  )

  const dispatch = useDispatch()
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const permissions = useSelector(locationStore.selectPermissions)
  const { wiki_page, column_tooltips } = useSelector(locationStore.selectInitDataForList)

  const isEmptySelectedRows = selectedRows.length <= 0

  const handleOpenUpdateDialog = (id: number) => () => {
    dispatch(locationStore.sagaOpenUpdateDialog(id))
  }

  const handleOpenCreateDialog = () => {
    dispatch(locationStore.sagaOpenCreateDialog())
  }

  const onOpenMakeAList = () => {
    dispatch(makeAListActions.open())
  }

  const handleExecuteOperation = (operation: Action) => async () => {
    const description = getMessageConfirm(t, 'location', selectedRows, operation)
    const result = await confirm({ description })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(commonStore.sagaExecuteOperation({ entity: 'location', operation, operationList: selectedRows }))
    }
  }

  const columns = useMemo<GridColumns>(
    () => [
      {
        ...columnProperties.defaultProperties,
        ...columnProperties.iconColumn,
        field: 'id',
        headerName: 'Edit',
        description: column_tooltips.edit,
        renderCell: (param) => {
          return <EditIcon onClick={handleOpenUpdateDialog(param.value as number)} />
        }
      },
      {
        ...columnProperties.defaultProperties,
        ...columnProperties.centerColumn,
        description: column_tooltips.location_id,
        field: 'location_id',
        headerName: 'Code',
        renderCell: (param) => <span>{param.value}</span>
      },
      {
        ...columnProperties.defaultProperties,
        description: column_tooltips.name,
        field: 'name',
        headerName: 'Name',
        flex: 0.2
      },
      {
        ...columnProperties.defaultProperties,
        description: column_tooltips.location_type_raw,
        field: 'location_type_raw',
        headerName: 'Type'
      },
      {
        ...columnProperties.defaultProperties,
        description: column_tooltips.office,
        field: 'office',
        headerName: 'Office',
        flex: 0.2,
        renderCell: (param) => {
          const { row } = param
          return (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" noWrap display="block">
                  Address 1: {row.office_address1}
                </Typography>
                <Typography variant="caption" noWrap display="block">
                  Address 2: {row.office_address2}
                </Typography>
                <Typography variant="caption" noWrap display="block">
                  Email: {row.office_email}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" noWrap display="block">
                  City: {row.office_city}
                </Typography>
                <Typography variant="caption" noWrap display="block">
                  Zip: {row.office_zip}
                </Typography>
                <Typography variant="caption" noWrap display="block">
                  Phone: {row.office_phone}
                </Typography>
              </Grid>
            </Grid>
          )
        }
      },
      {
        ...columnProperties.defaultProperties,
        description: column_tooltips.specialties,
        field: 'specialties',
        headerName: 'Specialties',
        flex: 0.08
      },
      {
        ...columnProperties.defaultProperties,
        description: column_tooltips.orders,
        field: 'orders',
        headerName: 'Orders'
      },
      {
        ...columnProperties.defaultProperties,
        ...columnProperties.centerColumn,
        description: column_tooltips.status,
        field: 'status',
        headerName: 'Status',
        renderCell: (param) => (param.value ? <EnableIcon /> : <DisableIcon />)
      }
    ],
    [permissions]
  )

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
    },
    {
      label: t('common:button.make_a_list'),
      startIcon: <MakeAListIcon />,
      disabled: !permissions?.make_a_list,
      onClick: onOpenMakeAList
    },
    {
      label: t('common:button.statistic'),
      startIcon: <StatisticIcon />,
      disabled: true
    }
  ]

  return (
    <AppLayout
      entity="location"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      buttons={buttons}
      permissions={permissions}
      Dialogs={<DialogLocationCreateEdit />}
      tableProps={{
        columns: columns,
        rowHeight: 65
      }}
    />
  )
}

export const getServerSideProps = useAuthMiddleware(['common', 'location', 'make_a_list', 'advanced_filter'])

export default Locations
