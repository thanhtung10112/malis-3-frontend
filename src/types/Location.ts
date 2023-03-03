import type { AxiosResponse } from 'axios'

import type { Permissions, Data, GetListResponse, Response, ParameterOption } from '@/types/Common'

export interface LocationItem extends Data {
  accmail: string
  language: number
  location_id: string
  location_type: number
  location_type_raw: string
  name: string
  office_address1: string
  office_address2: string
  office_city: string
  office_country: number
  office_email: string
  office_phone: string
  office_state: string
  office_zip: string
  specialties: string
  web: string
  workshop_address1: string
  workshop_address2: string
  workshop_city: string
  remark: string
}

export type LocationDetail = Omit<LocationItem, 'accmail' | 'location_type_raw' | 'web'> & {
  additional_attributes: Record<string, string | boolean>
  comment: string
}

export interface LocationPermissions extends Permissions {
  disable_enable: boolean
  make_a_list: boolean
  change_type: boolean
}

export type LocationInitDataForList = {
  permissions: {
    location: LocationPermissions
  }
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type LocationInitDataForCE = {
  next_code: string
  parameters: Record<'CTRY' | 'LOAT' | 'PLLA' | 'PUCO' | 'SSPE' | 'TYLO', ParameterOption[]>
  wiki_page: string
}

export interface GetLocationDetail extends Response {
  location: LocationDetail
}

export type GetLocationInitDataForList = AxiosResponse<LocationInitDataForList>
export type GetLocationInitDataForCE = AxiosResponse<LocationInitDataForCE & { permissions: LocationPermissions }>

export interface GetLocationList extends GetListResponse {
  locations: LocationItem[]
}

export interface GetGenerateCode extends Response {
  generated_code: string
}
