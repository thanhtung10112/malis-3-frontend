import { useMemo, useEffect } from 'react'

import { DataGrid, GridColumns } from '@material-ui/data-grid'

import {
  AppAutocompleteStyled,
  DialogBudgetCreateEdit,
  DataTableTextField,
  DialogBudgetImport,
  EditIcon,
  CreateIcon,
  DeleteIcon,
  MakeAListIcon,
  SaveIcon,
  AppLayout,
  DataTableNumberField
} from '@/components'

import { useTranslation } from 'next-i18next'
import useStyles from '@/styles/page/layout'
import { useDispatch, useSelector } from 'react-redux'
import { useConfirm, confirmConstant } from '@/components/Dialog/Common/Confirmation'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import clsx from 'clsx'
import _ from 'lodash'
import immer from 'immer'
import * as yup from 'yup'

import { budgetAmountFormat, unsaveDialogOptions } from '@/utils/constant'
import * as columnProperties from '@/utils/columnProperties'

import { budgetActions, commonStore, makeAListActions } from '@/store/reducers'

import { TABLE_HEIGHT_BUDGET } from '@/styles/vars/size'
import DialogRemindData from '@/components/Dialog/Module/Budget/RemindData'
import getMessageConfirm from '@/utils/getMessageConfirm'

function BudgetPage() {
  const classes = useStyles()
  const { t } = useTranslation('budget')
  const { confirm } = useConfirm()

  const dispatch = useDispatch()
  const dataList = useSelector(budgetActions.selectDataList)
  const userJob = useSelector(budgetActions.selectUserJob)
  const userPuco = useSelector(budgetActions.selectUserPuco)
  const pucoList = useSelector(budgetActions.selectPucoList)
  const jobList = useSelector(budgetActions.selectJobList)
  const budgetSum = useSelector(budgetActions.selectBudgetSum)
  const permissions = useSelector(budgetActions.selectPermissions)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const { column_tooltips, ...initDataForList } = useSelector(budgetActions.selectInitDataForList)

  const editRows = useSelector(commonStore.selectEditRows)

  const breadcrumbData = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Basic Options', href: '/jobs' },
      { label: 'Budget Management', href: '/budget' }
    ],
    []
  )

  useEffect(() => {
    dispatch(commonStore.actions.setEditRows([]))
  }, [dataList])

  // handle change value
  const onChangeUserValue = (value) => async (event, option) => {
    let result = ''
    if (editRows.length > 0) {
      result = await confirm(unsaveDialogOptions)
    }
    if (result !== 'cancel') {
      dispatch(budgetActions.changeUserValue({ value, option, confirm: result }))
    }
  }

  const onOpenUpdateDialog = (id: number) => () => {
    dispatch(budgetActions.openUpdateDialog(id))
  }

  const onOpenCreateDialog = () => {
    dispatch(budgetActions.openCreateDialog())
  }

  const onOpenImportDialog = () => {
    dispatch(budgetActions.setImportOpen(true))
  }

  const onSaveUpdateData = () => {
    dispatch(commonStore.sagaUpdateMultiple({ entity: 'budget' }))
  }

  const onDeleteBudgets = async () => {
    const description = getMessageConfirm(t, 'budget', selectedRows, 'delete')
    const result = await confirm({
      description
    })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(budgetActions.remove(selectedRows))
    }
  }

  const onOpenMakeAList = () => {
    dispatch(makeAListActions.open())
  }

  const onChangeEditRows = (budget_id_pk, value, field) => {
    const newEditRows = immer(editRows, (draft) => {
      const findIndex = _.findIndex(draft, { budget_id_pk })
      const valueFormat = field === 'amount' ? Number(value) : value
      if (findIndex > -1) {
        draft[findIndex][field] = valueFormat
      } else {
        draft.push({ budget_id_pk, [field]: valueFormat })
      }
    })
    dispatch(commonStore.actions.setEditRows(newEditRows))
  }

  const columns: GridColumns = [
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips.edit,
      field: 'id',
      headerName: 'Edit',
      renderCell(params) {
        return <EditIcon onClick={onOpenUpdateDialog(params.value as number)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.budget_id,
      field: 'budget_id',
      headerName: 'Cost Code',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.editCell('Description', permissions?.edit, column_tooltips.description),
      field: 'description',
      flex: 0.3,
      cellClassName(params) {
        return clsx({
          [classes.mark]: editRows.some(
            (row) => row.budget_id_pk === params.id && typeof row.description !== 'undefined'
          )
        })
      },
      renderEditCell(params) {
        return (
          <DataTableTextField
            params={params}
            rules={yup.string().max(513, 'Description must be less than 513 characters!')}
            onChangeValue={onChangeEditRows}
          />
        )
      }
    },

    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.currency_id,
      field: 'currency_id',
      headerName: 'Currency',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.puco,
      field: 'puco',
      headerName: 'Puco',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.numberColumn,
      ...columnProperties.editCell('Amount', permissions?.edit, column_tooltips.amount),
      field: 'amount',
      flex: 0.1,
      cellClassName(params) {
        return clsx({
          [classes.mark]: editRows.some((row) => row.budget_id_pk === params.id && typeof row.amount !== 'undefined')
        })
      },
      renderEditCell(params) {
        return (
          <DataTableNumberField
            params={params}
            onChangeValue={onChangeEditRows}
            rules={yup
              .number()
              .nullable()
              .required(t('validation_message.amount_required'))
              .min(budgetAmountFormat.min, t('validation_message.amount_range'))
              .max(budgetAmountFormat.max, t('validation_message.amount_range'))}
          />
        )
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.numberColumn,
      description: column_tooltips.used_in_rfq,
      field: 'used_in_rfq',
      headerName: 'Used In RFQ',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.numberColumn,
      description: column_tooltips.left_in_rfq,
      field: 'left_in_rfq',
      headerName: 'Left In RFQ',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.numberColumn,
      description: column_tooltips.used_in_order,
      field: 'used_in_order',
      headerName: 'Used In Order',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.numberColumn,
      description: column_tooltips.left_in_order,
      field: 'left_in_order',
      headerName: 'Left In Order',
      flex: 0.1
    }
  ]

  const Dialogs = (
    <>
      <DialogBudgetCreateEdit />
      <DialogBudgetImport />
      <DialogRemindData />
    </>
  )

  const Options = (
    <>
      <AppAutocompleteStyled
        width={250}
        label="Jobs"
        className={classes.controlAutocomplete}
        options={jobList}
        value={userJob}
        renderOption={(option) => option.description}
        primaryKeyOption="value"
        onChange={onChangeUserValue('job')}
      />

      <AppAutocompleteStyled
        disabled={!permissions?.view}
        width={250}
        label="Puco"
        className={classes.controlAutocomplete}
        options={pucoList}
        value={userPuco}
        renderOption={(option) => option.description}
        primaryKeyOption="value"
        onChange={onChangeUserValue('puco')}
      />
    </>
  )

  const renderButtons = [
    {
      label: t('common:button.new'),
      disabled: Boolean(userJob.value) === false || (!permissions?.create && !permissions?.import),
      startIcon: <CreateIcon />,
      item: [
        {
          label: t('button.create'),
          onClick: onOpenCreateDialog,
          disabled: !permissions?.create
        },
        {
          label: t('form.title.import'),
          onClick: onOpenImportDialog,
          disabled: !permissions?.import
        }
      ]
    },
    {
      label: t('common:button.delete'),
      disabled: selectedRows.length <= 0 || !permissions?.delete,
      startIcon: <DeleteIcon />,
      onClick: onDeleteBudgets
    },
    {
      label: t('common:button.save'),
      disabled: editRows.length <= 0 || !permissions?.edit,
      startIcon: <SaveIcon />,
      onClick: onSaveUpdateData
    },
    {
      label: t('common:button.make_a_list'),
      disabled: !permissions?.make_a_list,
      startIcon: <MakeAListIcon />,
      onClick: onOpenMakeAList
    }
  ]

  const bottomSection = (
    <div style={{ height: 35, width: '100%' }}>
      <DataGrid
        disableSelectionOnClick
        disableColumnMenu
        checkboxSelection
        hideFooter
        columns={columns}
        headerHeight={0}
        rowHeight={35}
        getRowClassName={() => classes.totalBudgetRow}
        rows={[budgetSum]}
        onCellDoubleClick={(_, event) => {
          event.stopPropagation()
        }}
      />
    </div>
  )

  return (
    <AppLayout
      entity="budget"
      breadcrumbs={breadcrumbData}
      wikiPage={initDataForList.wiki_page}
      permissions={permissions}
      searchProps={{
        width: 300
      }}
      buttons={renderButtons}
      Dialogs={Dialogs}
      Options={Options}
      tableProps={{ columns }}
      bottomSection={bottomSection}
      tableHeight={TABLE_HEIGHT_BUDGET}
    />
  )
}

export const getServerSideProps = useAuthMiddleware(['common', 'budget', 'make_a_list', 'advanced_filter'])

export default BudgetPage
