import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'
import useStyles from '@/styles/page/layout'

import { Link } from '@material-ui/core'
import {
  AppLayout,
  MakeAListIcon,
  EditIcon,
  DeleteIcon,
  CreateIcon,
  SaveIcon,
  AppAutocompleteStyled,
  useConfirm,
  AppAutocompleteStyledAsync,
  DataTableCellExpand,
  DataTableNumberField,
  DialogPart
} from '@/components'

import { itemStore, commonStore, partStore } from '@/store/reducers'

import * as columnProperties from '@/utils/columnProperties'
import AppNumber from '@/helper/AppNumber'
import { itemMassFormat } from '@/utils/constant'
import * as yup from 'yup'
import clsx from 'clsx'
import immer from 'immer'
import _ from 'lodash'
import { unsaveDialogOptions } from '@/utils/constant'
import getMessageConfirm from '@/utils/getMessageConfirm'
import { isAssemblyByDpn } from '@/utils/isAssembly'

import type { GridColumns } from '@material-ui/data-grid'
import type { DataForDropdown, ParameterOption, PayloadOperation } from '@/types/Common'

function ItemsPage() {
  const classes = useStyles()
  const { confirm } = useConfirm()
  const { t } = useTranslation('item')

  const breadcrumbData = [
    { label: 'Home', href: '/' },
    { label: 'Drawings', href: '/drawings' },
    { label: 'Items Management', href: '/items' }
  ]

  const dispatch = useDispatch()
  const permissions = useSelector(itemStore.selectPermissions)
  const userDrawing = useSelector(commonStore.selectUserValueDrawing)
  const userJob = useSelector(commonStore.selectUserValueJob)
  const editRows = useSelector(commonStore.selectEditRows)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const currentLang = useSelector(commonStore.selectCurrentLanguage)
  const dataList = useSelector(itemStore.selectDataList)
  const { jobs: jobOptions, column_tooltips, wiki_page } = useSelector(itemStore.selectInitDataForList)

  useEffect(() => {
    return () => dispatch(commonStore.actions.resetUserValue())
  }, [])

  /**
   * @param {DataForDropdown} option
   */
  const handleChangeUserDrawing = async (event, optionValue: DataForDropdown) => {
    let result = ''
    if (editRows.length > 0) {
      result = await confirm(unsaveDialogOptions)
    }
    if (result !== 'cancel') {
      dispatch(
        itemStore.sagaChangeUserDrawing({
          optionValue,
          confirm: result
        })
      )
    }
  }

  const handleOpenCreateDialog = () => {
    dispatch(partStore.sagaOpenCreateDialog('item'))
  }

  const handleChangeUserJob = async (event, optionValue: ParameterOption) => {
    let result = ''
    if (editRows.length > 0) {
      result = await confirm(unsaveDialogOptions)
    }
    if (result !== 'cancel') {
      dispatch(itemStore.sagaChangeUserJob({ optionValue, confirm: result }))
    }
  }

  const handleDeleteItems = async () => {
    const description = getMessageConfirm(t, 'item', selectedRows, 'delete')
    const result = await confirm({
      description
    })
    if (result === 'OK') {
      const parts: PayloadOperation[] = _.map(selectedRows, (partId) => {
        const { dpn, id } = _.find(dataList, { id: partId })
        return { entity_id: dpn, id }
      })
      dispatch(commonStore.sagaExecuteOperation({ entity: 'part', operation: 'delete', operationList: parts }))
    }
  }

  const handleOpenUpdateDialog = (id: number) => () => {
    dispatch(partStore.sagaOpenUpdateDialog({ id, entity: 'item' }))
  }

  const onChangeMass = (item_id_pk, value, field) => {
    const newEditRows = immer(editRows, (draft) => {
      const findIndex = _.findIndex(draft, { item_id_pk })
      const valueFormat = AppNumber.convertToNumber(value, itemMassFormat)
      if (findIndex > -1) {
        draft[findIndex][field] = valueFormat
      } else {
        draft.push({ item_id_pk, [field]: valueFormat })
      }
    })
    dispatch(commonStore.actions.setEditRows(newEditRows))
  }

  const onSaveUpdateData = () => {
    dispatch(commonStore.sagaUpdateMultiple({ entity: 'item' }))
  }

  const handleOpenPartDialog = (id: number, dpn: string) => (event) => {
    event.preventDefault()
    const entity = isAssemblyByDpn(dpn) ? 'assembly' : 'item'
    dispatch(partStore.sagaOpenUpdateDialog({ id, entity }))
  }

  const handleClosePartDialog = () => {
    dispatch(itemStore.sagaGetList())
  }

  const columns: GridColumns = [
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips.edit,
      field: 'id',
      headerName: 'Edit',
      renderCell(params) {
        return <EditIcon onClick={handleOpenUpdateDialog(params.value as number)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.dpn,
      field: 'dpn',
      headerName: 'Item #',
      flex: 0.25
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.descriptionsColumn(currentLang),
      description: column_tooltips.descriptions,
      flex: 0.3
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.material_equiv,
      field: 'material_equiv',
      headerName: 'Material std',
      flex: 0.2
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.manufacturer_equiv,
      field: 'manufacturer_equiv',
      headerName: 'Manufacturing std',
      flex: 0.2
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.reference_dpn,
      field: 'reference_dpn',
      headerName: 'Part number',
      flex: 0.25,
      renderCell(params) {
        const { value, row } = params
        return (
          <Link href="#" onClick={handleOpenPartDialog(row.id_ref, value as string)}>
            {value}
          </Link>
        )
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.rightColumn,
      ...columnProperties.editCell('Mass (kg)', permissions?.edit, column_tooltips.mass),
      field: 'mass',
      renderCell(params) {
        const value = AppNumber.format(params.value, itemMassFormat)
        return <DataTableCellExpand value={value} width={params.colDef.width} />
      },
      cellClassName(params) {
        return clsx({
          [classes.mark]: editRows.some((row) => row.item_id_pk === params.id && typeof row.mass !== 'undefined')
        })
      },
      renderEditCell(params) {
        return (
          <DataTableNumberField
            params={params}
            onChangeValue={onChangeMass}
            decimalScale={itemMassFormat.precision}
            fixedDecimalScale={itemMassFormat.precision}
            rules={yup
              .number()
              .nullable()
              .required(t('validation_message.mass_required'))
              .min(itemMassFormat.min, t('validation_message.mass_range'))
              .max(itemMassFormat.max, t('validation_message.mass_range'))}
          />
        )
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.raw_unit,
      field: 'raw_unit',
      headerName: 'Unit'
    }
  ]

  const buttons = [
    {
      label: t('common:button.new'),
      startIcon: <CreateIcon />,
      onClick: handleOpenCreateDialog,
      disabled: !permissions?.create || userJob.value < 0 || !userJob?.value
    },
    {
      label: t('common:button.save'),
      startIcon: <SaveIcon />,
      onClick: onSaveUpdateData,
      disabled: !permissions?.edit || editRows.length === 0
    },
    {
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      onClick: handleDeleteItems,
      disabled: !permissions?.delete || selectedRows.length === 0 || userJob.value < 0
    },
    {
      label: t('common:button.make_a_list'),
      startIcon: <MakeAListIcon />,
      disabled: !permissions?.make_a_list
    }
  ]

  const Dialogs = <DialogPart onClose={handleClosePartDialog} />

  const Options = (
    <>
      <AppAutocompleteStyled
        className={classes.controlAutocomplete}
        width={200}
        label="Jobs"
        options={jobOptions}
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
      entity="item"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      searchProps={{ width: 300 }}
      buttons={buttons}
      Options={Options}
      permissions={permissions}
      Dialogs={Dialogs}
      tableProps={{
        columns: columns,
        isCellEditable: (params) => !params.row.reference_dpn
      }}
    />
  )
}

export const getServerSideProps = useAuthMiddleware([
  'common',
  'item',
  'make_a_list',
  'advanced_filter',
  'assembly',
  'manufacturer'
])

export default ItemsPage
