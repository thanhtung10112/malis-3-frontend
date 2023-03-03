import * as yup from 'yup'
import { isValid, parseISO } from 'date-fns'
import getPasswordYup from '@/utils/getPasswordYup'

import type { TFunction } from 'next-i18next'

function getValidationSchema(t: TFunction, editMode: boolean) {
  const validationSchema = yup.object().shape({
    user_id: yup
      .string()
      .trim()
      .required(t('validation_message.user_id_required'))
      .min(2, t('validation_message.user_id_length'))
      .max(12, t('validation_message.user_id_length')),
    user_abb: yup.string().max(12, t('validation_message.user_abb_max')),
    first_name: yup
      .string()
      .trim()
      .required(t('validation_message.first_name_required'))
      .max(20, t('validation_message.first_name_max')),
    last_name: yup
      .string()
      .trim()
      .required(t('validation_message.last_name_required'))
      .max(20, t('validation_message.last_name_max')),
    email: yup.string().nullable().email(t('validation_message.email_format')),
    password: yup.lazy(() => {
      if (editMode) {
        return yup.string().nullable()
      }
      return getPasswordYup('Password')
    }),
    confirm_password: yup.lazy(() => {
      if (editMode) {
        return yup.string().nullable()
      }
      return yup.string().oneOf([yup.ref('password'), null], t('validation_message.confirm_password_match'))
    }),
    time_zone: yup.string().nullable().required(t('validation_message.timezone_required')),
    puco: yup.number().nullable().required(t('validation_message.puco_required')),
    default_language: yup.number().nullable().required(t('validation_message.default_language_required')),
    valid_from: yup
      .mixed()
      .test('date_format', t('validation_message.valid_from_invalid'), (value) => {
        // if (value === '' || value === null || value === undefined) {
        //   return true
        // }
        return /^\d{4}-\d{2}-\d{2}$/.test(value) || value === '' || value === null || value === undefined
      })
      .test('date_valid', t('validation_message.valid_from_invalid'), (value) => {
        return isValid(parseISO(value)) || value === '' || value === null || value === undefined
      }),
    valid_until: yup
      .mixed()
      .test('date_format', t('validation_message.valid_until_invalid'), (value) => {
        // if (value === '' || value === null || value === undefined) {
        //   return true
        // }
        return /^\d{4}-\d{2}-\d{2}$/.test(value) || value === '' || value === null || value === undefined
      })
      .test('date_valid', t('validation_message.valid_until_invalid'), (value) => {
        return isValid(parseISO(value)) || value === '' || value === null || value === undefined
      })
  })
  return validationSchema
}

export default getValidationSchema
