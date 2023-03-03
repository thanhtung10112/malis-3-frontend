import * as yup from 'yup'
import _ from 'lodash'

const getImageYup = () =>
  yup
    .mixed()
    .test(
      'file_type',
      'Your file extension is not allowed, please look for the tooltip of this field by hovering your mouse on it to see which one is allowed',
      (value) => {
        return ['image/jpeg', 'image/png'].includes(value?.type || '') || _.isNil(value) || _.isString(value)
      }
    )
    .test('file_size', 'The file size must be less than 500KB!', (value) => {
      const fileSize = value?.size / 1024 || 0
      return fileSize <= 500 || _.isNil(value) || _.isString(value)
    })

export default getImageYup
