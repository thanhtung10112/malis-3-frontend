export type ListData = {
  page: number
  per_page: number
  total_items: number
}

export type DataForDropdown = {
  value: number
  entity_id: string
  description: string
}

export type Data = {
  id?: number
  created_at?: string
  created_by?: string
  updated_at?: string
  updated_by?: string
  status?: boolean
}

export type Response = {
  message: string
  success: boolean
}

export interface GetListResponse extends Response, ListData {}

export type DataOption = {
  description: string
  value: number | string
}

export type ParameterOption = {
  value: number // primary key
  description: string
  properties: Record<string, string>
  is_default: boolean
  parameter_id: string
  id: number // primary key
  status?: boolean
}

export type Permissions = {
  create: boolean
  edit: boolean
  delete: boolean
  view: boolean
}

export type MultilingualDescription = {
  language_id: number
  description: string
}

export type PayloadOperation = {
  entity_id: string
  id: number
}

export type HistoryLog = {
  id: number
  operation_code: string
  created_at: string
  created_by: string
  operation_description: string
  changelogs: string
}

export type ErrorLog = {
  message: string
  statusCode: number | string
  open: boolean
}

export interface GetDataForDropdown extends GetListResponse {
  data_for_dd: DataForDropdown[]
}

export type AdditionalAttributes = Record<string, string | boolean>

export type FilterType = 'own' | 'shared' | 'system'

export type Action = 'delete' | 'enable' | 'disable' | 'lock' | 'unlock'

export type Entity =
  | 'location'
  | 'user'
  | 'group'
  | 'parameter'
  | 'parameter_type'
  | 'currency'
  | 'job'
  | 'material_standard'
  | 'manufacturing_standard'
  | 'equivalence'
  | 'budget'
  | 'manufacturer'
  | 'drawing'
  | 'item'
  | 'assembly'
  | 'specification'
  | 'element'
  | 'part'
