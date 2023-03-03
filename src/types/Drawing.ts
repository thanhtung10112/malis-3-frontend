import type {
  Permissions,
  Response,
  GetListResponse,
  Data,
  MultilingualDescription,
  AdditionalAttributes,
  ParameterOption,
  DataForDropdown
} from './Common'
import type { AxiosResponse } from 'axios'
import type { Item } from './Item'

export type DrawingTag = {
  description: string
  element_id: string
  id: number
  related_part: DataForDropdown
  tag: string
  rp_element_id: string
}

export type DrawingItem = {
  description: string
  id: number
  drawing_id: string
  raw_drawing_format: string
  raw_drawing_purpose: string
  raw_file_prefix: string
  raw_file_type: string
  revision: string
}

export type RevisionDetail = {
  new_revision: string
  reason: string
  description: string
}

export interface DrawingDetail extends Data {
  job_id: number
  drawing_id: string
  revision: string
  drawing_format: number
  drawing_purpose: number
  file_prefix: number
  file_type: number
  associated_documents: any[]
  customer_id: string
  additional_attributes: AdditionalAttributes
  descriptions: MultilingualDescription[]
  exclude_from_customer: boolean
  exclude_from_supplier: boolean
  exclude_from_other: boolean
  item_list?: Item[]
  tag_list?: DrawingTag[]
  url?: string
  windows_path?: string
  drawings_without_parts?: boolean
  is_detail_drawing: boolean
  is_drawing: boolean
  is_other_document: boolean
  is_schematic: boolean
  is_specification: boolean
}

export interface DrawingPermissions extends Permissions {
  import: boolean
  make_a_list: boolean
}

export type DrawingGroup = {
  description: string
  group_id: string
  children?: DrawingGroup[]
  id: number
}

export type DrawingInitDataForList = {
  drawing_groups: [DrawingGroup]
  jobs: ParameterOption[]
  permissions: {
    drawing: DrawingPermissions
  }
  parameters: Record<'PLLA', ParameterOption[]>
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type DrawingInitDataForCE = {
  parameters: Record<'DWAT' | 'DWPU' | 'FPRE' | 'FTYP' | 'PLFO' | 'PLLA' | 'PLAT', ParameterOption[]>
  wiki_page: string
}

export type GetDrawingInitDataForList = AxiosResponse<DrawingInitDataForList & Response>

export type GetDrawingInitDataForCE = AxiosResponse<
  DrawingInitDataForCE &
    Response & { user_job: ParameterOption } & {
      permissions: { drawing: DrawingPermissions }
    }
>

export interface GetDrawingList extends GetListResponse {
  drawings: DrawingItem[]
}

export interface GetDrawingDetail extends Response {
  drawing: DrawingDetail
}
