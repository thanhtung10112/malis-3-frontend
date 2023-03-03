import { Data, DataForDropdown, MultilingualDescription, ParameterOption, Permissions } from './Common'

export interface TagPermissions extends Permissions {
  make_a_list: boolean
}

export type TagInitDataForList = {
  jobs: ParameterOption[]
  permissions: {
    element: TagPermissions
  }
  parameters: Record<'PLLA', ParameterOption[]>
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type TagInitDataForCE = {
  parameters: Record<'PLLA' | 'SSAT', ParameterOption[]>
  wiki_page: string
  permissions: {
    element: TagPermissions
  }
}

export interface Tag extends Data {
  description: string
  spec_id: number
}

export interface TagDetail extends Data {
  job_id: number
  schematic_id: number | DataForDropdown
  element_id: string
  part_id: number | DataForDropdown
  tag: string
  fluid: string
  tech_data: string
  descriptions: MultilingualDescription[]
  functions: MultilingualDescription[]
  additional_attributes: Record<string, any>
  element_id_pk?: number
}
