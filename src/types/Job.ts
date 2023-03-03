import type { AxiosResponse } from 'axios'
import type {
  Data,
  GetListResponse,
  Response,
  Permissions,
  ParameterOption,
  MultilingualDescription
} from '@/types/Common'
import type { CurrencyDetail } from '@/types/Currency'
import type { LocationDetail } from '@/types/Location'
import type { UserDetail } from '@/types/User'

export interface JobItem extends Data {
  contract_desc: string
  contract_no: string
  credit_letter: string
  displaying_language: string
  drawings_responsible: UserGroupMapping[]
  equipment_type: number
  equipment_type_code: string
  erection_site: string
  erection_site_id: number
  job_id: string
  job_standard: ParameterOption[]
  language: number
  logo: string
  people_responsible: UserGroupMapping[]
  squad_leader: UserGroupMapping[]
  full_count?: number
  malis_version?: number
  status?: boolean
  category?: number
}

export type JobCurrency = Pick<CurrencyDetail, 'currency_id' | 'rate' | 'id' | 'description'>

export type JobExpeditingDate = {
  id?: string | number
  exp_date: string
  comment: string
}

export interface JobDetail extends Data {
  job_id: string
  equipment_type: number
  language: number
  erection_site: number
  job_standard: ParameterOption[]
  people_responsible: UserGroupMapping[]
  squad_leader: UserGroupMapping[]
  drawings_responsible: UserGroupMapping[]
  contract_no: string
  contract_desc: string
  credit_letter: string
  logo: string
  additional_attributes: any
  job_currencies: JobCurrency[]
  job_descriptions: MultilingualDescription[]
  job_users: UserGroupMapping[]
  job_expediting_dates: JobExpeditingDate[]
  malis_version?: number
  category?: number
}

export type DefaultJobCategory = {
  category_id: number
  description: string
}

export type JobInitDataForList = {
  job_categories: ParameterOption[]
  default_job_category: DefaultJobCategory
  permissions: {
    job: JobPermissions
  }
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type JobParameters = Record<'EQTY' | 'JOAT' | 'PLLA' | 'PLNO', ParameterOption[]>

export type GroupMap = {
  job_all: string
  job_drawing: string
  job_responsible: string
  job_squad_leader: string
}

export type JobInitDataForCE = {
  tooltip: string
  group_map: GroupMap
  currencies: CurrencyDetail[]
  erection_sites: LocationDetail[]
  parameters: JobParameters
  job_template: JobDetail
  wiki_page: string
}
export interface GetJobList extends GetListResponse {
  jobs: JobItem[]
}

export interface JobPermissions extends Permissions {
  disable_enable: boolean
  make_a_list: boolean
}

export type UserGroupMapping = Pick<UserDetail, 'first_name' | 'last_name' | 'id' | 'user_id'>

export type JobKeyMapping = 'people_responsible' | 'squad_leader' | 'drawings_responsible' | 'job_users'

export type GetJobInitDataForList = AxiosResponse<JobInitDataForList>
export type GetJobInitDataForCreateEdit = AxiosResponse<JobInitDataForCE>
export interface GetUserGroupMapping extends Response {
  available_users: UserGroupMapping[]
}
export interface GetJobDetail extends Data {
  job: JobDetail
}
