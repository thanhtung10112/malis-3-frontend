function validationSchema(translate) {
  return {
    name: {
      required: {
        value: true,
        message: translate('validation.name_required')
      },
      maxLength: {
        value: 80,
        message: translate('validation.name_max')
      }
    },
    description: {
      maxLength: {
        value: 255,
        message: translate('validation.description_max')
      }
    }
  }
}

export default validationSchema
