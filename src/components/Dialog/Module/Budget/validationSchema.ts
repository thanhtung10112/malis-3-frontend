import * as yup from 'yup'
import { budgetAmountFormat } from '@/utils/constant'

import type { TFunction } from 'next-i18next'

function getValidationSchema(t: TFunction) {
  const schema = yup.object().shape({
    budget_id: yup
      .string()
      .required(t('validation_message.cost_code_required'))
      .matches(/^(([A-Z]{3})|([0-9]{3}))[0-9]{3}$/, t('validation_message.cost_code_matches')),
    puco: yup.number().nullable().required(t('validation_message.puco_required')),
    amount: yup
      .number()
      .nullable()
      .required(t('validation_message.amount_range'))
      .min(budgetAmountFormat.min, t('validation_message.amount_range'))
      .max(budgetAmountFormat.max, t('validation_message.amount_range')),
    description: yup.string().max(513, t('validation_message.description_max_len'))
  })
  return schema
}

export default getValidationSchema
