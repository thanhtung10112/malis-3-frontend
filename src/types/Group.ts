import type { Data, Permissions } from '@/types/Common'

export interface GroupPermission extends Permissions {
  disable_enable: boolean
  edit_permissions: boolean
}

export type GroupInitDataForList = {
  permissions: {
    group: GroupPermission
  }
  wiki_page: string
  column_tooltips: Record<string, string>
}

export interface GroupDetail extends Data {
  description: string
  group_id: string
  name: string
  full_count?: number
  status?: boolean
}

export type GroupOperation = 'delete' | 'enable' | 'disable'

export type GroupInitDataForCE = {
  wiki_page: string
}
