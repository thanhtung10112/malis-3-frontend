import * as yup from 'yup'

import type { TFunction } from 'next-i18next'
import getImageYup from '@/utils/getImageYup'
function getValidationSchema(t: TFunction) {
  const schema = yup.object().shape({
    job_id: yup
      .string()
      .trim()
      .matches(/^(\d{1,4})$/, t('validation_message.job_id_number'))
      .required(t('validation_message.job_id_required')),
    language: yup
      .number()
      .nullable()
      .typeError(t('validation_message.language_required'))
      .required(t('validation_message.language_required')),
    equipment_type: yup
      .number()
      .nullable()
      .typeError(t('validation_message.equipment_type_required'))
      .required(t('validation_message.equipment_type_required')),
    erection_site: yup
      .number()
      .nullable()
      .typeError(t('validation_message.erection_site_required'))
      .required(t('validation_message.erection_site_required')),
    contract_no: yup.string().max(80, t('validation_message.contract_no_max')),
    contract_desc: yup.string().max(255, t('validation_message.contract_desc_max')),
    credit_letter: yup.string().max(80, t('validation_message.credit_letter_max')),
    people_responsible: yup.array().min(1, t('validation_message.people_responsible_required')),
    squad_leader: yup.array().min(1, t('validation_message.squad_leader_required')),
    job_users: yup.array().min(1, t('validation_message.job_users_required')),
    logo: getImageYup()
  })
  return schema
}

// image/jpeg image/png

export default getValidationSchema
