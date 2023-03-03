import * as yup from 'yup'

import type { TFunction } from 'next-i18next'

function getValidationSchema(t: TFunction) {
  const schema = yup.object().shape({
    drawing_id: yup
      .string()
      .required(t('validation_message.drawing_id_required'))
      .matches(/^\d{6}$/, t('validation_message.drawing_id_matches')),
    customer_id: yup.string().max(128, t('validation_message.customer_id_max')),
    revision: yup
      .string()
      .required(t('validation_message.revision_required'))
      .matches(/^[0-9A-Z]{1,8}$/, t('validation_message.revision_matches')),
    drawing_format: yup.number().nullable().required(t('validation_message.drawing_format_required')),
    drawing_purpose: yup.number().nullable().required(t('validation_message.drawing_purpose'))
  })
  return schema
}

export default getValidationSchema
