import { Data, Permissions, ParameterOption } from '@/types/Common'

export interface CurrencyDetail extends Data {
  base_currency: number
  currency_id: Uppercase<string>
  description: string
  multiplier: number
  round_to: number
  rate: number | string
  round_to_param_id?: number
  rate_of_one_unit?: number
  is_base_rate_mode?: boolean
}

export type BaseCurrency = Pick<CurrencyDetail, 'currency_id' | 'id'>

export type CurrencyOperation = 'delete' | 'enable' | 'disable'

export interface CurrencyPermissions extends Permissions {
  disable_enable: boolean
}

export type CurrencyInitDataForList = {
  base_currency_list: BaseCurrency[]
  user_base_currency: BaseCurrency
  permissions: {
    currency: CurrencyPermissions
  }
  wiki_page: string
  column_tooltips: Record<string, string>
}

export type CurrencyInitDataForCE = {
  base_currency: BaseCurrency
  multiplier_options: ParameterOption[]
  round_to_options: ParameterOption[]
  wiki_page: string
}
