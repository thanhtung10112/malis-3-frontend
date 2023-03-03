import * as yup from 'yup'

import { TFunction } from 'next-i18next'

function getValidationSchema(t: TFunction) {
  const schema = yup.object().shape({
    location_id: yup
      .string()
      .required(t('validation_message.location_id_required'))
      .trim()
      .matches(/^\d{5}$/, t('validation_message.location_id_format')),
    language: yup.number().nullable().required(t('validation_message.language_required')),
    location_type: yup.number().nullable().required(t('validation_message.location_type_required')),
    name: yup.string().trim().required(t('validation_message.name_required')).max(80, t('validation_message.name_max')),
    office_country: yup.number().nullable(),
    office_email: yup.string().email(t('validation_message.office_email_format')),
    office_zip: yup.string().matches(/^(|.{4,6})$/, t('validation_message.office_zip_format')),
    workshop_email: yup.string().email(t('validation_message.workshop_email_format')),
    comment: yup.string().max(500, t('validation_message.comment_max_length')),
    remark: yup.string().max(50, t('validation_message.remark_max'))
  })
  return schema
}

export default getValidationSchema
