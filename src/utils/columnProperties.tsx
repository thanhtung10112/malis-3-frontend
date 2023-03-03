import { DataTableStandOutEditCell, DataTableCellExpand } from '@/components'

import _ from 'lodash'
import * as currency from '@/utils/currency'

export const defaultProperties = {
  sortable: false,
  disableColumnMenu: true,
  renderCell(params) {
    return <DataTableCellExpand value={params.value} width={params.colDef.width} />
  }
}

export const centerColumn = {
  align: 'center',
  headerAlign: 'center'
} as Record<any, any>

export const rightColumn = {
  align: 'right',
  headerAlign: 'right'
} as Record<any, any>

export const numberColumn = {
  ...rightColumn,
  renderCell(params) {
    const value = currency.format(params.value)
    return <DataTableCellExpand value={value} width={params.colDef.width} />
  }
} as Record<any, any>

export const iconColumn = {
  ...centerColumn,
  width: 50
} as Record<any, any>

export const editCell = (headerName = '', editable = true, desc = '') => {
  return {
    editable,
    renderHeader: () => <DataTableStandOutEditCell headerName={headerName} editable={editable} desc={desc} />,
    headerClassName: editable ? 'header-edit-cell' : ''
  }
}

export const descriptionsColumn = (currentLang) => {
  return {
    field: 'description',
    headerName: 'Description',
    disableColumnMenu: false,
    valueGetter(params) {
      const { descriptions } = params.row
      const language = _.find(descriptions || [], {
        language_id: currentLang.id
      })
      return _.toString(language?.description)
    }
  }
}
