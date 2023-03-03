import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { userStore } from '@/store/reducers'
import { useFormContext } from 'react-hook-form'

import { Paper } from '@material-ui/core'
import { DataTable } from '@/components'

import _ from 'lodash'

import type { GridColumns } from '@material-ui/data-grid'
import type { UserDetail } from '@/types/User'

function TabUserGroup() {
  const userForm = useFormContext<UserDetail>()
  const watchGroup = userForm.watch('groups', [])

  const userDetail = useSelector(userStore.selectDetail)
  const { groups } = useSelector(userStore.selectInitDataForCE)

  const isCreating = _.isNil(userDetail.id)

  const filterRow = useMemo(() => {
    return groups.filter((g) => g.status === true || userDetail?.groups.includes(g.id))
  }, [groups, userDetail])

  const onSelectGroups = ({ selectionModel }) => {
    userForm.setValue('groups', selectionModel)
  }

  const columns = useMemo<GridColumns>(
    () => [
      {
        field: 'group_id',
        headerName: 'Group #',
        width: 100,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (param) => {
          if (param.row.status) {
            return <span>{param.value}</span>
          }
          return <span style={{ color: 'red' }}>{param.value}</span>
        }
      },
      {
        field: 'name',
        headerName: 'Group name',
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        renderCell: (param) => {
          if (param.row.status) {
            return <span>{param.value}</span>
          }
          return <span style={{ color: 'red' }}>{param.value}</span>
        }
      }
    ],
    []
  )

  return (
    <Paper elevation={2}>
      <DataTable
        checkboxSelection
        tableHeight={isCreating ? 475 : 450}
        rows={filterRow}
        columns={columns}
        headerHeight={30}
        rowHeight={30}
        hideFooter
        selectionModel={watchGroup}
        onSelectionModelChange={onSelectGroups}
      />
    </Paper>
  )
}

export default TabUserGroup
