import type { AxiosResponse } from 'axios'
import type { Data, Entity } from './Common'

export type AdvancedFilterPermission = {
  update_system_default_presets: boolean
}

export interface AdvancedFilter extends Data {
  name: string
  entity: Entity | ''
  is_shared: boolean
  is_system_default: boolean
  is_user_default: boolean
  sort_conditions: any
  where_conditions: any
}

export type AdvancedFilterParameter = {
  columns: any[]
  comparators: any[]
  sortOptions: any[]
  logicalOperators: any[]
}

export type SystemFilter = Pick<AdvancedFilter, 'id' | 'name'>

export interface GetAdvancedFilterList extends Response {
  filter_preset_list: AdvancedFilter[]
  total_items: number
}

export type AdvancedFilterInitDataForList = {
  default_filter: AdvancedFilter
  permissions: {
    advanced_filters: AdvancedFilterPermission
  }
  system_default_filter: SystemFilter
}

export type GetAdvancedFilterInitDataForList = AxiosResponse<AdvancedFilterInitDataForList>

export type GetAdvancedFilterInitDataForCreateEdit = AxiosResponse<AdvancedFilterParameter>
