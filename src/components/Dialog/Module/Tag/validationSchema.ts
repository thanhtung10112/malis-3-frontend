import * as yup from 'yup'
import _ from 'lodash'

import type { TFunction } from 'next-i18next'

const tagSchema = (t: TFunction) =>
  yup.object({
    element_id: yup
      .string()
      .nullable()
      .required(t('validation_message.element_id_required'))
      .matches(/^\d{4}$/, t('validation_message.element_id_match')),
    schematic_id: yup
      .mixed()
      .test('drawing_required', t('validation_message.schematic_id_required'), (value) => _.isNull(value) === false),
    job_id: yup.number().nullable().required(t('validation_message.job_id_required')),
    tag: yup.string().nullable().required(t('validation_message.tag_required')).max(50, t('validation_message.tag_max'))
  })

export default tagSchema
