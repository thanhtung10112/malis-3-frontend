import type { GridColumns } from '@material-ui/data-grid'
import type { Entity, HistoryLog } from '@/types/Common'

export type TabHistoryProps = {
  entityId: number
  entity: Entity
  data: HistoryLog[]
  isOpenDialog?: boolean
  tableHeight?: number | string
  mode?: 'vertical' | 'horizonatal'
  descriptionRows?: number
  extraColumns?: GridColumns
  onChange: (data: HistoryLog[]) => void
}
