// numeric
export const NUMBER_FORMAT = '0.000000'
export const NUMBER_MAX = 1000

// date
export const DATE_FORMAT = 'yyyy-MM-dd'

// Regex
export const REGEX_ALPHA_NUMERIC_ONLY = /^[A-Za-z0-9]*$/
export const REGEX_ALPHA_NUMERIC_UNDERSCORE_ONLY = /^[A-Za-z0-9_]*$/
export const REGEX_SEMICOLON_SEPERATED_ALPHA_NUMERIC_UNDERSCORE_ONLY =
  /^(?![0-9])[A-Za-z0-9_]+(;(?![0-9])[A-Za-z0-9_]+)*$/
export const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const REGEX_TRIM_SPACE = /^[^ ][\w\W ]*[^ ]/
export const REGEX_GROUP_ID = /^[a-zA-Z]+$/
export const REGEX_ONLY_THREE_CAPITAL_LETTER = /[a-zA-z]{3}/

export const REGEX_VALID_DATE_EUROPE =
  // eslint-disable-next-line no-useless-escape
  /^(\d{4})?(\-?\b(0?[1-9]|1[0-2])\b)(\-\b(0?[1-9]|1[0-9]|2[0-9]|3[0-1])\b)?$/
export const REGEX_VALID_DATE_ASIA =
  /^(\b(0?[1-9]|1[0-9]|2[0-9]|3[0-1])\b)((\/|\.)?\b(0?[1-9]|1[0-2]))?((\/|\.)?\d{4})?$/

// Permission maps
export const PERMISSION_TOPIC_MAP = {
  application_parameter_type: 'Application Parameter Types',
  developer_parameter_type: 'Developer Parameter Types',
  simple_parameter_type: 'Simple Parameter Types',
  application_parameter: 'Application Parameter Codes',
  developer_parameter: 'Developer Parameter Codes',
  simple_parameter: 'Simple Parameter Codes',
  group: 'Groups',
  job: 'Jobs',
  manufacturing_standard: 'Manufacturing Standards',
  material_standard: 'Material Standards',
  location: 'Locations',
  user: 'Users',
  advanced_filter: 'Advanced Filters',
  make_a_list: 'Make a List',
  currency: 'Currencies',
  budget: 'Budget',
  manufacturer: 'Manufacturers',
  drawing: 'Drawings',
  assembly: 'Assemblies',
  item: 'Items',
  specification: 'Specifications',
  element: 'Elements'
}

export const PERMISSION_MAP = {
  view: 'View',
  create: 'Create',
  edit: 'Update',
  delete: 'Delete',
  disable_enable: 'Disable / Enable',
  lock_unlock: 'Lock / Unlock',
  make_a_list: 'Make a List',
  import: 'Import',
  export: 'Export',
  update_system_default_presets: 'Update System Default Presets',
  change_type: 'Change type'
}

export const actionTypes = {
  UPDATE_MULTIPLE: 'UPDATE_MULTIPLE',
  AUTH: 'AUTH',
  RESET_STATE: 'RESET_STATE',
  SET_OPEN_DIALOG_STATE: 'SET_OPEN_DIALOG_STATE',
  GET_HISTORY: 'GET_HISTORY',
  GET_LIST: 'GET_LIST',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
  EXECUTE_OPERATION: 'EXECUTE_OPERATION',
  OPEN_CREATE_DIALOG: 'OPEN_CREATE_DIALOG',
  OPEN_UPDATE_DIALOG: 'OPEN_UPDATE_DIALOG',
  CLOSE_DIALOG: 'CLOSE_DIALOG',
  GET_NEXT_CODE: 'GET_NEXT_CODE',
  CHANGE_USER_JOB: 'CHANGE_USER_JOB',
  CHANGE_USER_DRAWING: 'CHANGE_USER_DRAWING',
  LOGIN: 'LOGIN',
  GET_PROFILE: 'GET_PROFILE',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  GET_GENERATE_CODE: 'GET_GENERATE_CODE',
  LOGOUT: 'LOGOUT',
  GET_PART: 'GET_PART'
}

export const removalProperties = ['created_by', 'created_at', 'updated_by', 'updated_at', 'id', 'status', 'full_count']

export const itemMassFormat = {
  precision: 4,
  negativePattern: '0.0000',
  max: 99999999.9999,
  min: 0
}

export const budgetAmountFormat = {
  precision: 2,
  negativePattern: '0.00',
  min: 0,
  max: 99999999999
}

export const itemQuantityFormat = {
  precision: 2,
  negativePattern: '0.00',
  min: 0,
  max: 99999.99
}

export const currencyRateFormat = {
  precision: 6,
  negativePattern: '0.000000',
  max: 1000,
  min: 0.000001
}

export const unsaveDialogOptions = {
  description: 'You have edit inline on several cell(s). Do you want to save them?',
  buttons: [
    {
      label: 'save',
      action: 'save'
    },
    {
      label: "Don't save",
      action: ''
    },
    {
      label: 'cancel',
      action: 'cancel'
    }
  ]
}
