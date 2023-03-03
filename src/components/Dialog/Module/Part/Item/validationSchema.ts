import * as yup from 'yup'
import _ from 'lodash'
import { itemMassFormat } from '@/utils/constant'

import type { TFunction } from 'next-i18next'

const getValidationSchema = (t: TFunction) =>
  yup.object({
    job_id: yup.number().nullable().required(t('validation_message.job_id_required')),
    dpn: yup
      .string()
      .required(t('validation_message.dpn_required'))
      .matches(/^(h|H)\d{3}$/, t('validation_message.dpn_matches'))
      .transform((value) => _.toUpper(value)),
    drawing_id: yup
      .mixed()
      .test('drawing_required', t('validation_message.drawing_id_required'), (value) => _.isNull(value) === false),
    mass: yup
      .number()
      .nullable()
      .typeError(t('validation_message.mass_required'))
      .required(t('validation_message.mass_required'))
      .min(itemMassFormat.min, t('validation_message.mass_range'))
      .max(itemMassFormat.max, t('validation_message.mass_range')),
    unit: yup.number().nullable().required(t('validation_message.unit_required'))
  })

export default getValidationSchema
