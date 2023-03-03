import type { Response, ParameterOption } from '@/types/Common'
import type { UserDetail } from '@/types/User'

export interface LoginData {
  user_id: string
  password: string
  remember: boolean
}

export type GroupMemberShip = {
  description: string
  group_id: string
}

export type Profile = UserDetail & {
  user_name: string
  group_membership: GroupMemberShip[]
  avatar: string
  default_language_id: number
}

export type LoginRequest = Omit<LoginData, 'remember'>

export interface LoginResponse extends Response {
  access_token: string
  redirect_to: string
}

export type SettingInitData = {
  parameters: Record<'PAGES' | 'PLLA', ParameterOption[]>
  timezones: Pick<ParameterOption, 'description' | 'value'>[]
}

export type SettingDetail = {
  default_language: number
  home_page: number
  time_zone: string
}

export type ProfileResponse = Profile
