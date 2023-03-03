import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import useStyles from '@/styles/page/layout'

import {
  DialogEquivalenceCreateEdit,
  useConfirm,
  AppLayout,
  EditIcon,
  CreateIcon,
  DeleteIcon,
  EnableIcon,
  DisableIcon,
  MakeAListIcon
} from '@/components'
import { Switch, Case, Default } from 'react-if'

import clsx from 'clsx'
import _ from 'lodash'
import { commonStore, equivalenceStore, makeAListActions } from '@/store/reducers'
import getMessageConfirm from '@/utils/getMessageConfirm'
import * as columnProperties from '@/utils/columnProperties'

import type { EquivalenceOperation, EquivalenceType } from '@/types/Equivalence'
import type { GridColumns } from '@material-ui/data-grid'

function LayoutEquivalence({ equivalenceType }: { equivalenceType: EquivalenceType }) {
  const getBreadcrumb = () => {
    const originalBreadcrumb = [
      { label: 'Home', href: '/' },
      { label: 'Basic Options', href: '/jobs' }
    ]
    if (equivalenceType === 'manufacturing_standard') {
      originalBreadcrumb.push({
        label: 'Manufacturing Standards Equivalences Management',
        href: '/manufacturing_standards'
      })
    } else {
      originalBreadcrumb.push({
        label: 'Material Standards Equivalences Management',
        href: '/material_standards'
      })
    }
    return originalBreadcrumb
  }

  const breadcrumbPage = useMemo(getBreadcrumb, [equivalenceType])
  const { t } = useTranslation('equivalence')
  const { confirm } = useConfirm()
  const classes = useStyles()

  const dispatch = useDispatch()
  const permissions = useSelector(equivalenceStore.selectPermissions)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const { wiki_page, column_tooltips } = useSelector(equivalenceStore.selectInitDataForList)

  useEffect(() => {
    dispatch(equivalenceStore.actions.setEquivalenceType(equivalenceType))
  }, [equivalenceType])

  const onOpenMakeAList = () => {
    dispatch(makeAListActions.open())
  }

  const onSelectRows = ({ selectionModel }) => {
    const filterRows = selectionModel.filter((row) => typeof row === 'number')
    dispatch(commonStore.actions.setSelectedRows(filterRows))
  }

  const onOpenCreateDialog = () => {
    dispatch(equivalenceStore.sagaOpenCreateDialog())
  }

  const onOpenUpdateDialog = (id: number) => () => {
    dispatch(equivalenceStore.sagaOpenUpdateDialog(id))
  }

  const onExecuteActions = (operation: EquivalenceOperation) => async () => {
    const description = getMessageConfirm(t, 'equivalence', selectedRows, operation)
    const descriptionType = t(`${description}_${equivalenceType}`, {
      length: selectedRows.length
    })
    const result = await confirm({ description: descriptionType })
    if (result === 'OK') {
      dispatch(
        commonStore.sagaExecuteOperation({
          operation,
          operationList: selectedRows,
          entity: 'equivalence'
        })
      )
    }
  }

  const columns: GridColumns = [
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips[equivalenceType].edit,
      field: 'id',
      headerName: 'Edit',
      renderCell(params) {
        if (typeof params.id === 'number') {
          return <EditIcon onClick={onOpenUpdateDialog(params.value as number)} />
        }
        return <span />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips[equivalenceType].equiv_id,
      field: 'equiv_id',
      headerName: 'Equivalence #',
      flex: 0.2
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips[equivalenceType].description,
      field: 'description',
      headerName: 'Description',
      flex: 0.3
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips[equivalenceType].organization,
      field: 'organization',
      headerName: 'Organization',
      flex: 0.15
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips[equivalenceType].standard,
      field: 'standard',
      headerName: 'Standard',
      flex: 0.15
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips[equivalenceType].preferred,
      width: 100,
      field: 'preferred',
      headerName: 'Preferred',
      renderCell(params) {
        const { preferred } = params.row
        return (
          <Switch>
            <Case condition={_.isNull(preferred)}>
              <span />
            </Case>
            <Case condition={preferred}>
              <EnableIcon />
            </Case>
            <Default>
              <DisableIcon />
            </Default>
          </Switch>
        )
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips[equivalenceType].status,
      field: 'status',
      headerName: 'Status',
      renderCell(params) {
        const { status } = params.row
        return (
          <Switch>
            <Case condition={_.isNull(status)}>
              <span />
            </Case>
            <Case condition={status}>
              <EnableIcon />
            </Case>
            <Default>
              <DisableIcon />
            </Default>
          </Switch>
        )
      }
    }
  ]

  return (
    <AppLayout
      entity={equivalenceType}
      breadcrumbs={breadcrumbPage}
      wikiPage={wiki_page[equivalenceType]}
      permissions={permissions}
      buttons={[
        {
          label: t('common:button.new'),
          startIcon: <CreateIcon />,
          disabled: !permissions?.create,
          onClick: onOpenCreateDialog
        },
        {
          label: t('common:button.delete'),
          startIcon: <DeleteIcon />,
          disabled: selectedRows.length <= 0 || !permissions?.delete,
          onClick: onExecuteActions('delete')
        },
        {
          label: t('common:button.enable'),
          startIcon: <EnableIcon />,
          disabled: selectedRows.length <= 0 || !permissions?.disable_enable,
          onClick: onExecuteActions('enable')
        },
        {
          label: t('common:button.disable'),
          startIcon: <DisableIcon />,
          disabled: selectedRows.length <= 0 || !permissions?.disable_enable,
          onClick: onExecuteActions('disable')
        },
        {
          label: t('common:button.make_a_list'),
          startIcon: <MakeAListIcon />,
          disabled: !permissions?.make_a_list,
          onClick: onOpenMakeAList
        }
      ]}
      tableProps={{
        disableSelectionOnClick: true,
        columns: columns,
        getRowClassName: (params) =>
          clsx({
            [classes.equivalence]: _.isNumber(params.id),
            [classes.standard]: !_.isNumber(params.id)
          }),
        onSelectionModelChange: onSelectRows
      }}
      Dialogs={<DialogEquivalenceCreateEdit />}
    />
  )
}

export default LayoutEquivalence
