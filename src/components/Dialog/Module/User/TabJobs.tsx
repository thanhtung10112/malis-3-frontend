import { useState, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'

import { Grid, Typography, Button } from '@material-ui/core'

import { DataTable, DataTableTextField, AppTitle, CreateIcon, DeleteIcon, AppAutocomplete } from '@/components'

import _ from 'lodash'
import immer from 'immer'

import * as columnProperties from '@/utils/columnProperties'
import { userStore } from '@/store/reducers'

import type { JobAccess, UserDetail } from '@/types/User'

function TabJob() {
  const { t } = useTranslation('user')

  const userForm = useFormContext<UserDetail>()
  const watchUserJob = userForm.watch('job_access', [])

  const [selectedJobs, setSelectedJobs] = useState<JobAccess[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const { jobs: jobOptions } = useSelector(userStore.selectInitDataForCE)

  const jobsTabColumns = useMemo(
    () => [
      {
        ...columnProperties.defaultProperties,
        field: 'job_raw_id',
        headerName: 'Job #',
        flex: 0.1
      },
      {
        ...columnProperties.defaultProperties,
        ...columnProperties.editCell('Note'),
        field: 'note',
        flex: 0.4,
        renderEditCell(params) {
          return <DataTableTextField params={params} onChangeValue={onChangeJobNote} />
        }
      }
    ],
    []
  )

  const onChangeSelectedJobs = (_, value) => {
    const newValue = value.map((item) => ({
      ...item,
      note: ''
    }))
    setSelectedJobs(newValue)
  }

  const onAddSelectedJobs = () => {
    const { job_access: jobAccess } = userForm.getValues()
    const newJobAccess = [...jobAccess, ...selectedJobs]
    userForm.setValue('job_access', newJobAccess)
    setSelectedJobs([])
  }

  const onSelectJobsTable = ({ selectionModel }) => {
    setSelectedRows(selectionModel)
  }

  const onRemoveSelectedRows = () => {
    const { job_access: jobAccess } = userForm.getValues()
    const newJobAccess = jobAccess.filter((job) => !selectedRows.includes(job.job_id))
    userForm.setValue('job_access', newJobAccess)
    setSelectedRows([])
  }

  const onChangeJobNote = (job_id, value) => {
    const { job_access: jobAccess } = userForm.getValues()
    const newJobAccess = immer(jobAccess, (draft) => {
      const index = _.findIndex(draft, { job_id })
      draft[index].note = value
    })
    userForm.setValue('job_access', newJobAccess)
  }

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={12}>
        <Typography display="block" variant="body2">
          {t('form.description.tab_job')}
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <AppAutocomplete
          label="Jobs"
          value={selectedJobs}
          multiple
          limitTags={4}
          disableCloseOnSelect
          options={jobOptions}
          renderOption={(option) => option.job_raw_id}
          getOptionSelected={(option, value) => option.job_id === value.job_id}
          getOptionDisabled={(option) => watchUserJob.some((item) => item.job_id === option.job_id)}
          onChange={onChangeSelectedJobs}
        />
      </Grid>

      <Grid item xs={3}>
        <Button
          startIcon={<CreateIcon />}
          variant="outlined"
          color="primary"
          fullWidth
          style={{ padding: 0 }}
          onClick={onAddSelectedJobs}
          disabled={selectedJobs.length === 0}
        >
          {t('common:button.add')}
        </Button>
      </Grid>

      <Grid item xs={9}>
        <AppTitle label={t('form.label.access_rights')} />
      </Grid>

      <Grid item xs={3}>
        <Button
          startIcon={<DeleteIcon />}
          style={{ padding: 0 }}
          variant="outlined"
          color="primary"
          fullWidth
          onClick={onRemoveSelectedRows}
          disabled={selectedRows.length <= 0}
        >
          {t('common:button.remove')}
        </Button>
      </Grid>

      <Grid item xs={12}>
        <DataTable
          disableSelectionOnClick
          tableHeight={355}
          checkboxSelection
          rows={watchUserJob}
          getRowId={(params) => params.job_id}
          selectionModel={selectedRows}
          columns={jobsTabColumns}
          onSelectionModelChange={onSelectJobsTable}
          hideFooter
        />
      </Grid>
    </Grid>
  )
}

export default TabJob
