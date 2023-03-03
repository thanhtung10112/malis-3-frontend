import { Data, DataForDropdown, MultilingualDescription, ParameterOption, Permissions } from './Common'

export interface SpecificationPermissions extends Permissions {
  make_a_list: boolean
}

export type SpecificationInitDataForList = {
  jobs: ParameterOption[]
  permissions: {
    specification: SpecificationPermissions
  }
  parameters: Record<'PLLA', ParameterOption[]>
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type SpecificationInitDataForCE = {
  parameters: Record<'PLLA' | 'SSAT', ParameterOption[]>
  wiki_page: string
}

export interface SpecificationItem extends Data {
  description: string
  spec_id: number
}

export interface SpecificationDetail extends Data {
  job_id: number
  drawing_id: number | DataForDropdown
  spec_id: number
  descriptions: MultilingualDescription[]
}
