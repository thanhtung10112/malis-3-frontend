import type { Data, Permissions, ParameterOption } from '@/types/Common'

export type Standard = {
  id?: string
  organization: number
  standard: string
  preferred: boolean
  image: string | Blob | File
}

export interface EquivalenceDetail extends Data {
  equiv_id: number
  description: string
  equiv_type: number
  image: string | Blob | File
  standards: Standard[]
}

export type EquivalenceType = 'manufacturing_standard' | 'material_standard'

export type EquivalenceInitDataForCE = {
  next_code: number
  parameters: {
    PLNO: ParameterOption[]
  }
  wiki_page: string
}

export interface EquivalancePermissions extends Permissions {
  disable_enable: boolean
  make_a_list: boolean
}

export type EquivalenceInitDataForList = {
  permissions: {
    manufacturing_standard: EquivalancePermissions
    material_standard: EquivalancePermissions
  }
  wiki_page: {
    manufacturing_standard: ''
    material_standard: ''
  }
  column_tooltips: {
    manufacturing_standard: Record<string, string>
    material_standard: Record<string, string>
  }
}

export type EquivalenceOperation = 'delete' | 'enable' | 'disable'
