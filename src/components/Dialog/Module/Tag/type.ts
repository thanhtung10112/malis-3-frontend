import type { TagDetail, TagInitDataForCE } from '@/types/Tag'

export type DialogTagProps = {
  open: boolean
  onClose: () => void
  detail?: TagDetail
  initData: TagInitDataForCE
}
