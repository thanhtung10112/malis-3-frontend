import { Data, Permissions, Response, GetListResponse } from './Common'

export interface ManufacturerPermissions extends Permissions {
  disable_enable: boolean
}

export type ManufacturerInitDataForList = {
  permissions: { manufacturer: ManufacturerPermissions }
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type ManufacturerInitDataForCE = {
  next_code: number
  wiki_page: string
}

export interface ManufacturerItem extends Data {
  manufacturer_id: number
  name: string
}

export type ManufacturerOperation = 'enable' | 'disable' | 'delete'

export interface GetManufacturerList extends GetListResponse {
  manufacturers: ManufacturerItem[]
}

export interface GetManufacturerInitDataForList extends Response {
  permissions: {
    manufacturer: ManufacturerPermissions
  }
}

export interface GetManufacturerInitDataForCE extends Response {
  next_code: number
  permissions: ManufacturerPermissions
  wiki_page: string
}

export interface GetManufacturerNextCode extends Response {
  generated_code: number
}

export interface GetManufacturerDetail extends Response {
  manufacturer: ManufacturerItem
}
