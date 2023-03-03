import type {
  Permissions,
  Response,
  GetListResponse,
  Data,
  MultilingualDescription,
  ParameterOption,
  DataForDropdown
} from './Common'
import type { AxiosResponse } from 'axios'
import type { Standard } from './Equivalence'

export type Item = {
  description: string
  id: number
  dpn: string
  material_std: string
  manufacturing_std: string
  part_number: string
  mass: number
  Unit: string
  created_by: string
  created_at: string
  updated_by: string
  updated_at: string
}

export type ItemManufacturer = {
  manufacturer_id: number
  reference: string
  description?: string
  additional_attributes?: Record<string, any>
  id?: number
}

export interface ItemDetail extends Data {
  job_id: number
  drawing_id: number | DataForDropdown
  dpn: string
  reference_to: number | DataForDropdown
  mass: number | string
  unit: number
  manufacturer_equiv: number | DataForDropdown
  manufacturers: ItemManufacturer[]
  material_equiv: number | DataForDropdown
  descriptions: MultilingualDescription[]
  related_drawing?: DataForDropdown
  material_equiv_standards?: Standard[]
  manufacturer_equiv_standards?: Standard[]
  additional_attributes: Record<string, any>
}

export interface ItemPermissions extends Permissions {
  make_a_list: boolean
}

export type ItemInitDataForList = {
  jobs: ParameterOption[]
  permissions: {
    item: ItemPermissions
  }
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type ItemInitDataForCE = {
  parameters: Record<'MAAT' | 'PLLA' | 'UNIT', ParameterOption[]>
  wiki_page: string
}

export interface GetItemList extends GetListResponse {
  items: Item[]
}

export type GetItemInitDataForList = AxiosResponse<ItemInitDataForList & Response>

export type GetItemInitDataForCE = AxiosResponse<
  ItemInitDataForCE & {
    permissions: { item: ItemPermissions }
    selected_job: ParameterOption
  }
>

export interface GetItemGenerateCode extends Response {
  generated_code: string
}

export interface GetItemDetail extends Response {
  item: ItemDetail & {
    manufacturer_equiv_object: DataForDropdown
    material_equiv_object: DataForDropdown
    manufacturer_equiv_standards: Standard[]
    material_equiv_standards: Standard[]
  }
}
