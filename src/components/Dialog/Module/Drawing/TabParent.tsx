import { Paper } from '@material-ui/core'
import { DataTable } from '@/components'

import { defaultProperties } from '@/utils/columnProperties'

const TabParent: React.FC = () => {
  return (
    <Paper elevation={1}>
      <DataTable
        hideFooter
        tableHeight={385}
        rows={[]}
        columns={[
          {
            ...defaultProperties,
            field: 'job_drawing',
            headerName: 'Job Drawing',
            flex: 0.5
          },
          {
            ...defaultProperties,
            field: 'description',
            headerName: 'Description',
            flex: 0.5
          }
        ]}
      />
    </Paper>
  )
}

export default TabParent
