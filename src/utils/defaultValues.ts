import type { TagInitDataForCE, TagDetail } from '@/types/Tag'

export const defaultTagInitDataForCE = {
  parameters: {
    PLLA: []
  },
  wiki_page: '',
  permissions: {
    element: null
  }
} as TagInitDataForCE

export const defaultTagDetail = {
  job_id: null,
  schematic_id: null,
  descriptions: [],
  additional_attributes: {},
  tech_data: '',
  fluid: '',
  tag: '',
  part_id: null,
  element_id: null,
  functions: []
} as TagDetail
