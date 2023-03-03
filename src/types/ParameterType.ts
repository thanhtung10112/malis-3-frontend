import type { AxiosResponse } from 'axios'
import type { Data, Permissions, GetListResponse, Response } from '@/types/Common'

export interface ParameterTypePermission extends Permissions {
  disable_enable: boolean
}

export type ParameterTypePermissions = Record<
  'application_parameter_type' | 'developer_parameter_type' | 'simple_parameter_type',
  ParameterTypePermission
>

export type ParameterTypeInitDataForList = {
  permissions: ParameterTypePermissions
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type ParameterTypeCategory = {
  description: string
  id: number
}

export type ParameterTypeInitDataForCE = {
  categories: ParameterTypeCategory[]
  wiki_page: string
}

export interface ParameterTypeItem extends Data {
  attributes: string
  category: number
  description: string
  full_count: number
  is_multilingual: boolean
  nbr_default: number
  type_id: string
}

export type ParameterTypeInstace = Omit<ParameterTypeItem, 'full_count'>

export type ParameterTypeOperation = 'delete' | 'enable' | 'disable'

export interface GetParameterTypeList extends GetListResponse {
  parameter_types: ParameterTypeItem[]
}

export interface GetParameterTypeDetail extends Response {
  parameter_type: ParameterTypeItem
}

export type GetParameterTypeInitDataForList = AxiosResponse<Response & ParameterTypeInitDataForList>

export type GetParameterTypeInitDataForCE = AxiosResponse<
  Response & ParameterTypeInitDataForCE & ParameterTypeInitDataForList
>
