import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { DataTable } from '@/components'

import { defaultProperties } from '@/utils/columnProperties'

import type { GridColumns } from '@material-ui/data-grid'

const TabParent = () => {
  const partForm = useFormContext()
  const watchParentParts = partForm.watch('parent_parts', [])

  const columns = useMemo<GridColumns>(
    () => [
      {
        ...defaultProperties,
        field: 'entity_id',
        headerName: 'Part #',
        flex: 0.4
      },
      {
        ...defaultProperties,
        field: 'description',
        headerName: 'Description',
        flex: 0.6
      }
    ],
    []
  )

  return (
    <DataTable
      getRowId={(param) => param.value}
      tableHeight={270}
      rows={watchParentParts}
      columns={columns}
      hideFooter
    />
  )
}

export default TabParent
