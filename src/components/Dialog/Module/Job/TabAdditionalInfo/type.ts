import React from 'react'
import type { JobExpeditingDate } from '@/types/Job'
import { ParameterOption } from '@/types/Common'

export type JobAdditionalInfoProps = {
  jobStandard: ParameterOption[]
  setJobStandard: React.Dispatch<React.SetStateAction<ParameterOption[]>>
  expeditingDates: JobExpeditingDate[]
  setExpeditingDates: React.Dispatch<React.SetStateAction<JobExpeditingDate[]>>
}
