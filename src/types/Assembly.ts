import { Data, DataForDropdown, MultilingualDescription, ParameterOption, Permissions } from './Common'

export interface AssemblyPermissions extends Permissions {
  make_a_list: boolean
}

export type AssemblyInitDataForList = {
  jobs: ParameterOption[]
  permissions: {
    assembly: AssemblyPermissions
  }
  parameters: Record<'PLLA', ParameterOption[]>
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type AssemblyInitDataForCE = {
  parameters: Record<'MAAT' | 'PLLA' | 'UNIT', ParameterOption[]>
  wiki_page: string
}

export interface AssemblyItem extends Data {
  description: string
  dpn: string
  mass: number
  raw_unit: string
}

export type ItemAssembly = {
  item_id: number
  quantity: number
}

export interface AssemblyDetail extends Data {
  job_id: number
  drawing_id: number | DataForDropdown
  dpn: string
  unit: number | string
  descriptions: MultilingualDescription[]
  items: ItemAssembly[]
  manufacturers: any[]
  additional_attributes: Record<string, any>
  related_drawing?: DataForDropdown
  is_assembly?: boolean
  drawing_items?: any[]
}
