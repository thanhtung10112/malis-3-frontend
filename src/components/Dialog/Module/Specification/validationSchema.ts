import * as yup from 'yup'
import _ from 'lodash'
import { TFunction } from 'next-i18next'

const assemblySchema = (t: TFunction) =>
  yup.object({
    spec_id: yup
      .string()
      .required(t('validation_message.spec_id_required'))
      .matches(/^(d|D)\d{3}$/, t('validation_message.spec_id_match'))
      .transform((value) => _.toUpper(value)),
    drawing_id: yup
      .mixed()
      .test('drawing_required', t('validation_message.drawing_id_required'), (value) => _.isNull(value) === false),
    job_id: yup.number().nullable().required(t('validation_message.job_id_required'))
  })

export default assemblySchema
