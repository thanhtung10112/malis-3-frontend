import { DataForDropdown } from '@/types/Common'

export const defaultValue = {
  value: null,
  entity_id: '',
  description: ''
} as DataForDropdown

export const tranform = (data: DataForDropdown) => data
