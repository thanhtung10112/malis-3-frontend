import { Data, ListData, Response, Permissions } from '@/types/Common'
import { ParameterInstance } from '@/types/Parameter'
import { AxiosResponse } from 'axios'

export interface Budget extends Data {
  job_id: number
  budget_id: string
  puco: number
  description: string
  amount: number
}

export interface BudgetItem extends Data {
  amount: number
  budget_id: string
  currency_id: string
  description: string
  left_in_order: number
  left_in_rfq: number
  parameter_id: string
  used_in_order: number
  used_in_rfq: number
}

export interface CostCode extends Data {
  import: File
  import_info: string
}
export interface CostCodeForm extends Data {
  importFile: File
  fileType: {
    id: number
    description: string
  }
  mode: {
    id: number
    description: string
  }
}

export type BudgetSum = {
  sum_amount: number
  sum_left_in_order: number
  sum_left_in_rfq: number
  sum_used_in_order: number
  sum_used_in_rfq: number
}

export type BudgetUserValue = Pick<ParameterInstance, 'value' | 'description'>

export type BudgetInitDataForList = {
  puco_list: Pick<ParameterInstance, 'value' | 'properties' | 'description'>[]
  jobs: Pick<ParameterInstance, 'value' | 'description'>[]
  selected_job: BudgetUserValue
  user_puco: BudgetUserValue
  permissions: {
    budget: BudgetPermission
  }
  wiki_page: string
  column_tooltips: Record<string, string>
}

export interface BudgetPermission extends Permissions {
  make_a_list: boolean
  import: boolean
}

export type BudgetInitDataForCreateEdit = {
  puco_list: Pick<ParameterInstance, 'value' | 'properties' | 'description'>[]
  user_currency: BudgetUserValue
  user_job: BudgetUserValue
  user_puco: BudgetUserValue
  wiki_page: string
}

export type GetBudgetInitDataForList = AxiosResponse<BudgetInitDataForList & Response>
export type GetBudgetInitDataForCreateEdit = AxiosResponse<BudgetInitDataForCreateEdit & Response>
export type GetBudgetList = {
  budgets: BudgetItem[]
  budgets_sum: BudgetSum
  permissions: BudgetPermission
} & ListData
export interface GetBudgetDetail extends Response {
  budget: Budget
}
