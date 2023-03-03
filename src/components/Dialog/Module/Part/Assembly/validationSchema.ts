import * as yup from 'yup'
import _ from 'lodash'
import { TFunction } from 'next-i18next'

const assemblySchema = (t: TFunction) =>
  yup.object({
    job_id: yup.number().nullable().required(t('validation_message.job_id_required')),
    dpn: yup
      .string()
      .required(t('validation_message.dpn_required'))
      .matches(/^(g|G)\d{3}$/, t('validation_message.dpn_match'))
      .transform((value) => _.toUpper(value)),
    drawing_id: yup
      .mixed()
      .test('drawing_required', t('validation_message.drawing_id_required'), (value) => _.isNull(value) === false),
    unit: yup.number().nullable().required(t('validation_message.unit_required'))
  })

export default assemblySchema
