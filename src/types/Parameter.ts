import { Data, ListData, Permissions, Response, ParameterOption } from './Common'

export interface ParameterPermission extends Permissions {
  disable_enable: boolean
}

export type ParameterPermissions = {
  application_parameter: ParameterPermission
  developer_parameter: ParameterPermission
  simple_parameter: ParameterPermission
}

export type Category = {
  description: string
  id: number
}

export type MultilingualDescription = {
  description: string
  language_id: number
}

export type ParameterInitDataForList = {
  permissions: ParameterPermissions
  column_tooltips: Record<string, string>
}

export type ParameterInitDataForCE = {
  attributes: string
  categories: Category[]
  is_multilingual: boolean
  param_type_id: number
  param_type_raw_id: string
  param_type_specific_config: null
  parameters: {
    PLLA: ParameterOption[]
  }
}

export interface ParameterInstance extends Data {
  description: string
  is_default: boolean
  order: number
  parameter_id: string
  parameter_type_id: number
  properties: any
  status?: boolean
  descriptions?: MultilingualDescription[]
  value?: number
}

export type ParameterType = {
  category: number
  id: number
  type_id: string
}

export type ParameterOperation = 'enable' | 'disable' | 'delete'

export interface GetParameterInitDataForList extends Response, ParameterInitDataForList {}

export type GetParameterInitDataForCE = Response & ParameterInitDataForCE & ParameterInitDataForList

export interface GetParameterList extends ListData {
  parameter_type: ParameterType
  parameters: ParameterInstance[]
}

export interface GetParameter extends Response {
  parameter: ParameterInstance
}

export interface GetParameterDetail extends Response {
  parameter: ParameterInstance
}
