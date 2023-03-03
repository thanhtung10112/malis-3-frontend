import { DataGrid } from '@material-ui/data-grid'

import { DataTablePagination, DataTableLoadingOverlay, DataTableNoRowsOverlay } from '@/components'

import { Unless } from 'react-if'

import type { DataGridProps } from '@material-ui/data-grid'

export interface DataTableProps extends DataGridProps {
  tableHeight?: number | string
  hideFooter?: boolean
  page?: number
  perPage?: number
  totalItems?: number
  onChangePage?(page: number): void
  onChangePerPage?(perPage: number): void
}
function DataTable(props: DataTableProps) {
  const {
    tableHeight,
    hideFooter,
    page,
    perPage,
    totalItems,
    selectionModel,
    autoHeight,
    onChangePage,
    onChangePerPage,
    ...rest
  } = props

  return (
    <>
      <div style={{ height: autoHeight ? 'auto' : tableHeight, width: '100%' }}>
        <DataGrid
          {...rest}
          autoHeight={autoHeight}
          selectionModel={selectionModel}
          hideFooter
          components={{
            LoadingOverlay: DataTableLoadingOverlay,
            NoRowsOverlay: DataTableNoRowsOverlay
          }}
        />
      </div>

      <Unless condition={hideFooter}>
        <DataTablePagination
          countSelectedItems={selectionModel?.length || 0}
          page={page}
          perPage={perPage}
          totalItems={totalItems}
          onChangePage={onChangePage}
          onChangePerPage={onChangePerPage}
        />
      </Unless>
    </>
  )
}

DataTable.defaultProps = {
  headerHeight: 30,
  rowHeight: 30,
  hideFooter: false
}

export default DataTable
