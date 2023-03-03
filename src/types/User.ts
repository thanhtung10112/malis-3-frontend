import type { Data, GetListResponse, Response, Permissions, ParameterOption } from '@/types/Common'
import { AxiosResponse } from 'axios'

export interface UserItem extends Data {
  default_language: number
  email: string | null
  failed_logins: number | null
  first_name: string
  groups: number[]
  job_access: JobAccess[]
  last_name: string
  last_used: string | null
  lock_until: string
  locked: boolean
  login_page: string
  puco: number
  time_zone: string
  user_abb: string
  user_id: string
  valid_from: Date | string | null
  valid_until: Date | string | null
  view_private_scheme: boolean
  password: string
  confirm_password: string
  status: boolean
  remember_token: string | null
  remember_token_expires_at: string | null
}

export type UserDetail = Omit<
  UserItem,
  | 'failed_logins'
  | 'last_used'
  | 'lock_until'
  | 'locked'
  | 'login_page'
  | 'view_private_scheme'
  | 'status'
  | 'remember_token'
  | 'remember_token_expires_at'
>

export type JobAccess = {
  job_id: number
  note: string
}

export interface UserPermissions extends Permissions {
  disable_enable: boolean
  lock_unlock: boolean
}

// Response
export interface GetUserList extends GetListResponse {
  user_lists: UserItem[]
}

export type UserInitDataForList = {
  permissions: {
    user: UserPermissions
  }
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type UserJob = {
  job_id: number
  job_raw_id: string
}

export type UserGroup = {
  group_id: string
  id: number
  name: string
  status: boolean
}

export type UserInitDataForCE = {
  groups: UserGroup[]
  jobs: UserJob[]
  parameters: Record<'PLLA' | 'PUCO', ParameterOption[]>
  timezones: ParameterOption[]
  wiki_page: string
}

export type UserOperation = 'enable' | 'disable' | 'lock' | 'unlock' | 'delete'

export type ResetPasswordDetail = Pick<UserDetail, 'password' | 'confirm_password'>

export type GetUserInitDataForList = AxiosResponse<{
  permissions: { user: UserPermissions }
}>
export type GetUserInitDataForCE = AxiosResponse<UserInitDataForCE & { permissions: { user: UserPermissions } }>
export interface GetUserDetail extends Response {
  user: UserDetail
}
