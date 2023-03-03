import * as yup from 'yup'

import type { TFunction } from 'next-i18next'
import getImageYup from '@/utils/getImageYup'

function getValidationSchema(translate: TFunction) {
  const schema = yup.object().shape({
    equiv_id: yup.lazy((value) => {
      if (value === '') {
        return yup.string().nullable().required(translate('validation_message.equiv_id_required'))
      }
      return yup
        .number()
        .nullable()
        .required(translate('validation_message.equiv_id_required'))
        .min(1, translate('validation_message.equiv_id_min_len'))
        .max(999999, translate('validation_message.equiv_id_max_len'))
        .transform((value) => Number(value))
    }),
    description: yup
      .string()
      .required(translate('validation_message.description_required'))
      .max(80, translate('validation_message.description_max_len')),
    standards: yup.array().of(
      yup.object().shape({
        organization: yup.number().nullable().required(translate('Organization is required!')),
        standard: yup
          .string()
          .required(translate('Standard is required!'))
          .max(80, translate('Standard must be less than 80 chareacters!')),
        preferred: yup.boolean(),
        image: yup.mixed()
      })
    ),
    image: getImageYup()
  })
  return schema
}

export default getValidationSchema
