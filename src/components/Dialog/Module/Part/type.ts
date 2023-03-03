import type { ItemDetail, ItemPermissions } from '@/types/Item'
import type { AssemblyPermissions, AssemblyDetail } from '@/types/Assembly'
import { HistoryLog } from '@/types/Common'

export type DialogPartProps = {
  permissions: ItemPermissions | AssemblyPermissions
  loading: boolean
  tab: number
  wiki_page: string
  detail: ItemDetail | AssemblyDetail
  historyLogs: HistoryLog[]
  onSubmit: (id: number, formData: ItemDetail | AssemblyDetail) => void
  onClose: () => void
  onChangeTab: (event, tab: number) => void
}

export type DialogPartMainProps = {
  onClose: () => void
}
