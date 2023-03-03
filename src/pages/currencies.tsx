import { useDispatch, useSelector } from 'react-redux'
import useStyles from '@/styles/page/layout'
import { useTranslation } from 'next-i18next'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import {
  DialogCurrencyCreateEdit,
  useConfirm,
  confirmConstant,
  AppLayout,
  EditIcon,
  CreateIcon,
  EnableIcon,
  DisableIcon,
  DeleteIcon,
  AppAutocompleteStyled
} from '@/components'

import { currencyStore, commonStore } from '@/store/reducers'

import clsx from 'clsx'

import * as columnProperties from '@/utils/columnProperties'
import * as currency from '@/utils/currency'
import getMessageConfirm from '@/utils/getMessageConfirm'

import type { GridColumns } from '@material-ui/data-grid'
import type { BaseCurrency, CurrencyOperation } from '@/types/Currency'

export default function Currencies() {
  const { t } = useTranslation('currency')

  const classes = useStyles()

  const breadcrumbData = [
    { label: 'Home', href: '/' },
    { label: 'Basic Options', href: '/jobs' },
    { label: 'Currencies Management', href: '/currencies' }
  ]

  const { confirm } = useConfirm()

  const dispatch = useDispatch()
  const { base_currency_list, user_base_currency, column_tooltips } = useSelector(currencyStore.selectInitDataForList)
  const permissions = useSelector(currencyStore.selectPermissions)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const initDataForList = useSelector(currencyStore.selectInitDataForList)
  const isEmptySelectedRows = selectedRows.length <= 0

  const onChangeBaseCurrency = (event, optionValue: BaseCurrency) => {
    dispatch(commonStore.actions.setTableState({ page: 1 }))
    dispatch(currencyStore.sagaChangeUserCurrency(optionValue))
  }

  const onOpenCreateDialog = () => {
    dispatch(currencyStore.sagaOpenCreateDialog())
  }

  const onOpenUpdateDialog = (id: number) => () => {
    dispatch(currencyStore.sagaOpenUpdateDialog(id))
  }

  const onExecuteActions = (operation: CurrencyOperation) => async () => {
    const description = getMessageConfirm(t, 'currency', selectedRows, operation)
    const result = await confirm({ description })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(
        commonStore.sagaExecuteOperation({
          entity: 'currency',
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
      field: 'id',
      headerName: 'Edit',
      description: column_tooltips.edit,
      renderCell: (param) => {
        return <EditIcon onClick={onOpenUpdateDialog(param.value as number)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.currency_id,
      field: 'currency_id',
      headerName: 'Code'
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.description,
      field: 'description',
      headerName: 'Description',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.rightColumn,
      description: column_tooltips.multiplier,
      field: 'multiplier',
      headerName: 'Currency Multiplier',
      flex: 0.1
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.numberColumn,
      description: column_tooltips.rate,
      field: 'rate',
      headerName: 'Rate',
      flex: 0.05,
      valueFormatter(params) {
        return currency.format(params.value, { precision: 6 })
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.rightColumn,
      description: column_tooltips.round_to,
      field: 'round_to',
      headerName: 'Round to',
      sortable: false,
      disableColumnMenu: true,
      flex: 0.05
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.rightColumn,
      ...columnProperties.iconColumn,
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
      onClick: onOpenCreateDialog
    },
    {
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      disabled: isEmptySelectedRows || !permissions?.delete,
      onClick: onExecuteActions('delete')
    },
    {
      label: t('common:button.enable'),
      startIcon: <EnableIcon />,
      disabled: isEmptySelectedRows || !permissions?.disable_enable,
      onClick: onExecuteActions('enable')
    },
    {
      label: t('common:button.disable'),
      startIcon: <DisableIcon />,
      disabled: isEmptySelectedRows || !permissions?.disable_enable,
      onClick: onExecuteActions('disable')
    }
  ]

  return (
    <AppLayout
      entity="currency"
      breadcrumbs={breadcrumbData}
      wikiPage={initDataForList.wiki_page}
      permissions={permissions}
      Dialogs={<DialogCurrencyCreateEdit />}
      Options={
        <AppAutocompleteStyled
          width={180}
          label="Base currency"
          className={classes.controlAutocomplete}
          options={base_currency_list}
          value={user_base_currency}
          getOptionLabel={(option) => option.currency_id}
          onChange={onChangeBaseCurrency}
        />
      }
      buttons={buttons}
      tableProps={{
        className: classes.currencyTable,
        columns: columns,
        getRowClassName(params) {
          return clsx({ homeCurrency: !params.row.base_currency })
        },
        isRowSelectable(params) {
          return Boolean(params.row.base_currency)
        }
      }}
    />
  )
}

export const getServerSideProps = useAuthMiddleware(['common', 'currency', 'advanced_filter'])
