import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { makeStyles, Paper, Link } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'
import { DataTable, DataTableNumberField } from '@/components'

import { partStore } from '@/store/reducers'
import * as dataForDD from '@/utils/dataForDD'
import { defaultProperties, editCell, rightColumn } from '@/utils/columnProperties'
import AppNumber from '@/helper/AppNumber'
import * as yup from 'yup'
import immer from 'immer'
import _ from 'lodash'
import { itemQuantityFormat } from '@/utils/constant'
import { isAssemblyByDpn } from '@/utils/isAssembly'

import type { AssemblyDetail } from '@/types/Assembly'
import type { DataForDropdown } from '@/types/Common'
import type { GridColumns } from '@material-ui/data-grid'

const useStyles = makeStyles((theme) => ({
  total: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.body1.fontSize,
    borderTop: '1.5px solid #DAE1EC',
    '&:hover': {
      backgroundColor: 'transparent !important'
    },
    '& .MuiDataGrid-cellCheckbox': {
      opacity: 0
    },
    '& .MuiDataGrid-cell:nth-child(2)': {
      opacity: 0
    }
  }
}))

const TabComponent: React.FC = () => {
  const { t } = useTranslation('assembly')
  const classes = useStyles()

  const assemblyForm = useFormContext<AssemblyDetail>()
  const watchItems = assemblyForm.watch('items', []) || []
  const wacthDrawingId = assemblyForm.watch('drawing_id', dataForDD.defaultValue) as DataForDropdown

  const dispatch = useDispatch()
  const drawingItems = useSelector(partStore.selectDrawingItems)

  useEffect(() => {
    if (wacthDrawingId?.value && drawingItems.length === 0) {
      dispatch(partStore.sagaGetDrawingItems(wacthDrawingId.value))
    }
  }, [])

  const handleChangeQuantity = (item_id, value) => {
    const { items } = assemblyForm.getValues()
    const quantity = AppNumber.convertToNumber(value)
    const newItems = immer(items, (draft) => {
      const index = _.findIndex(draft, { item_id })
      if (index === -1) {
        draft.push({ item_id, quantity })
      } else {
        draft[index].quantity = quantity
      }
    })
    assemblyForm.setValue('items', newItems)
  }

  const getMultipMass = (item_id: number, qty: number) => {
    const item = _.find(drawingItems, { item_id })
    const mass = item?.mass || 0
    return qty * mass
  }

  const getTotalMass = () => {
    const totalMass = watchItems.reduce((prevValue, currentValue) => {
      const multipMass = getMultipMass(currentValue.item_id, currentValue.quantity)
      return prevValue + multipMass
    }, 0)
    return AppNumber.format(totalMass, itemQuantityFormat)
  }

  const handleOpenPartDialog = (id: number, dpn: string) => (event) => {
    event.preventDefault()
    const entity = isAssemblyByDpn(dpn) ? 'assembly' : 'item'
    dispatch(partStore.sagaOpenUpdateDialog({ id, entity }))
  }

  const columns: GridColumns = [
    {
      ...defaultProperties,
      field: 'raw_item_id',
      headerName: 'Item',
      flex: 0.15,
      renderCell(params) {
        const { value, id } = params
        return (
          <Link href="#" onClick={handleOpenPartDialog(id as number, value as string)}>
            {value}
          </Link>
        )
      }
    },
    {
      ...editCell('Quantity'),
      ...rightColumn,
      field: 'quantity',
      flex: 0.15,
      sortable: false,
      valueGetter(params) {
        const item = _.find(watchItems, { item_id: params.id }) as any
        return item?.quantity || 0
      },
      valueFormatter(params) {
        return AppNumber.format(params.value, itemQuantityFormat)
      },
      renderEditCell(params) {
        return (
          <DataTableNumberField
            params={params}
            onChangeValue={handleChangeQuantity}
            rules={yup
              .number()
              .nullable()
              .required(t('validation_message.quantity_range'))
              .min(itemQuantityFormat.min, t('validation_message.quantity_range'))
              .max(itemQuantityFormat.max, t('validation_message.quantity_range'))}
          />
        )
      }
    },
    {
      ...rightColumn,
      sortable: false,
      field: 'mass',
      headerName: 'Unit Mass (kg)',
      flex: 0.15,
      valueFormatter(params) {
        return AppNumber.format(params.value, itemQuantityFormat)
      }
    },
    {
      ...defaultProperties,
      field: 'reference_to',
      headerName: 'Reference',
      flex: 0.2,
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
      ...defaultProperties,
      field: 'description',
      headerName: 'Description',
      flex: 0.15
    },
    {
      field: 'total_mass',
      headerName: 'Mass (kg)',
      flex: 0.2,
      sortable: false,
      ...rightColumn,
      valueGetter(params) {
        const quantity = params.getValue(params.id, 'quantity') as number
        const mass = params.getValue(params.id, 'mass') as number
        return quantity * mass
      },
      valueFormatter(params) {
        return AppNumber.format(params.value, itemQuantityFormat)
      }
    }
  ]

  const columnsTotal: GridColumns = [
    {
      ...defaultProperties,
      field: 'raw_item_id',
      headerName: 'Item',
      flex: 0.15
    },
    {
      ...defaultProperties,
      field: 'quantity',
      flex: 0.15
    },
    {
      ...defaultProperties,
      field: 'mass',
      headerName: 'Unit Mass (kg)'
    },
    {
      ...defaultProperties,
      field: 'reference',
      headerName: 'Reference',
      flex: 0.15
    },
    {
      ...defaultProperties,
      field: 'description',
      headerName: 'Description',
      flex: 0.2
    },
    {
      ...rightColumn,
      field: 'total_mass',
      headerName: 'Mass (kg)',
      flex: 0.2
    }
  ]

  const totalRows = {
    id: 1,
    description: 'Total',
    total_mass: getTotalMass()
  }

  return (
    <Paper elevation={1}>
      <DataTable
        getRowId={(params) => params.item_id}
        hideFooter
        disableSelectionOnClick
        disableColumnMenu
        tableHeight={280}
        rows={drawingItems}
        columns={columns}
      />
      <div style={{ height: 35, width: '100%' }}>
        <DataGrid
          disableSelectionOnClick
          disableColumnMenu
          checkboxSelection
          hideFooter
          columns={columnsTotal}
          headerHeight={0}
          rowHeight={35}
          getRowClassName={() => classes.total}
          rows={[totalRows]}
          onCellDoubleClick={(_, event) => {
            event.stopPropagation()
          }}
        />
      </div>
    </Paper>
  )
}

export default TabComponent
