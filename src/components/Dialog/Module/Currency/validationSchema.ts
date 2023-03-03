import * as yup from 'yup'
import { REGEX_ONLY_THREE_CAPITAL_LETTER, currencyRateFormat } from '@/utils/constant'

function getValidationSchema(t) {
  const schema = yup.object().shape({
    currency_id: yup
      .string()
      .required(t('validation_message.currency_id_required'))
      .matches(REGEX_ONLY_THREE_CAPITAL_LETTER, t('validation_message.currency_id_capital')),
    multiplier: yup.number().nullable().required(t('validation_message.multiplier_required')),
    rate: yup
      .number()
      .nullable()
      .typeError(t('validation_message.rate_required'))
      .required(t('validation_message.rate_required'))
      .min(currencyRateFormat.min, t('validation_message.rate_range'))
      .max(currencyRateFormat.max, t('validation_message.rate_range')),
    round_to: yup.number().nullable().required(t('validation_message.round_to_required')),
    description: yup.string().max(40, t('validation_message.description_max'))
  })
  return schema
}

export default getValidationSchema
