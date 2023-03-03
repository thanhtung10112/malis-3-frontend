import { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import useStyles from './styles'
import useDialogContext from '../Context/useDialogContext'

import { Grid, Tooltip } from '@material-ui/core'
import { MoreHoriz as MoreHorizIcon } from '@material-ui/icons'
import {
  AppTitle,
  DialogTransferList,
  TableMultilingualDescription,
  FormControllerAutocomplete,
  AppTextField,
  SectionTimezone,
  FormControllerTextField
} from '@/components'

import { Unless } from 'react-if'

import parseHTML from 'html-react-parser'
import _ from 'lodash'
import AppNumber from '@/helper/AppNumber'
import { jobStore } from '@/store/reducers'

import type { JobKeyMapping, JobDetail } from '@/types/Job'

function TabGeneral() {
  const classes = useStyles()
  const { isCreating } = useDialogContext()

  const jobForm = useFormContext<JobDetail>()

  const watchPeopleResponsible = jobForm.watch('people_responsible', [])
  const watchSquadLeader = jobForm.watch('squad_leader', [])
  const watchDrawingsResponsible = jobForm.watch('drawings_responsible', [])
  const watchJobUsers = jobForm.watch('job_users', [])

  const transformPeopleResponsible = watchPeopleResponsible.map((user) => user.user_id).join(';')
  const transformSquadLeader = watchSquadLeader.map((user) => user.user_id).join(';')
  const transformDrawingsResponsible = watchDrawingsResponsible.map((user) => user.user_id).join(';')
  const transformJobUsers = watchJobUsers.map((user) => user.user_id).join(';')

  const dispatch = useDispatch()
  const { tooltip, parameters, erection_sites, group_map } = useSelector(jobStore.selectInitDataForCE)
  const tooltipForJobId = parseHTML(tooltip)
  const transferListState = useSelector(jobStore.selectTransferListState)
  const keyMapping = useSelector(jobStore.selectKeyMapping)
  const jobDetail = useSelector(jobStore.selectDetail)

  const usersAvailableGroup = transferListState.userAvailableList
  const usersAvailable = _.differenceWith(usersAvailableGroup, transferListState.userGroup, _.isEqual)

  const getTitleForTransferList = () => {
    switch (keyMapping) {
      case 'people_responsible':
        return 'Job Responsible (*)'
      case 'squad_leader':
        return 'Squad Leader (*)'
      case 'drawings_responsible':
        return 'Drawing Responsible'
      case 'job_users':
        return 'Access Group (*)'
      default:
        return 'Job Responsible (*)'
    }
  }

  const titleForTransferList = useMemo(getTitleForTransferList, [keyMapping])

  useEffect(() => {
    if (keyMapping) {
      const usersGroupInJobDetail = jobForm.watch(keyMapping, [])
      dispatch(jobStore.actions.setTransferListUserGroup(usersGroupInJobDetail))
    }
  }, [jobDetail, keyMapping])

  const onSaveTransferList = async () => {
    const { userGroup } = transferListState
    if (keyMapping !== 'job_users') {
      const jobUsersGroup = _.unionWith(watchJobUsers, userGroup, _.isEqual)
      jobForm.setValue('job_users', jobUsersGroup)
      jobForm.setValue(keyMapping, userGroup)
    } else {
      jobForm.setValue('job_users', userGroup)
    }

    // clear error before submitting
    await jobForm.trigger([keyMapping, 'job_users'])

    dispatch(jobStore.actions.setOpenTransferList(false))
  }

  const onChangeLeftSideList = (list) => {
    dispatch(jobStore.actions.setTransferUserAvailableList(list))
  }

  const onChangeRightSideList = (list) => {
    dispatch(jobStore.actions.setTransferListUserGroup(list))
  }

  const onOpenTransferList = (userKeyGroup: string, keyMapping: JobKeyMapping) => () => {
    dispatch(jobStore.sagaGetUserGroupMapping(userKeyGroup))
    dispatch(jobStore.actions.setKeyMapping(keyMapping))
  }

  const onCloseTransferList = () => {
    dispatch(jobStore.actions.closeTransferList())
  }

  const handleTransformJobId = (event) => {
    const { value } = event.target
    if (AppNumber.isNumber(value)) {
      const formatValue = _.padStart(value, 4, '0')
      jobForm.setValue('job_id', formatValue)
    }
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Tooltip title={tooltipForJobId}>
                <FormControllerTextField
                  name="job_id"
                  control={jobForm.control}
                  label="Job #"
                  required
                  disabled={!isCreating}
                  onBlur={handleTransformJobId}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <FormControllerAutocomplete
                name="language"
                control={jobForm.control}
                options={parameters.PLLA}
                renderOption={(option) => `${option.parameter_id} - ${option.description}`}
                label="Language"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControllerAutocomplete
                name="equipment_type"
                control={jobForm.control}
                options={parameters.EQTY}
                label="Equipment Type"
                required
                renderOption={(option) => `${option.parameter_id} - ${option.description}`}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControllerAutocomplete
                name="erection_site"
                control={jobForm.control}
                options={erection_sites}
                renderOption={(option) => `${option.location_id} - ${option.name}`}
                label="Erection Site"
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={classes.section}>
            <Grid item xs={12}>
              <AppTitle label="Communication" />
            </Grid>
            <Grid item xs={11}>
              <AppTextField
                label="Job Responsible"
                disabled
                required
                value={transformPeopleResponsible}
                error={Boolean(jobForm.errors.people_responsible)}
                helperText={(jobForm.errors.people_responsible as any)?.message}
                InputLabelProps={{
                  shrink: Boolean(transformPeopleResponsible)
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <MoreHorizIcon onClick={onOpenTransferList(group_map.job_responsible, 'people_responsible')} />
            </Grid>
            <Grid item xs={11}>
              <AppTextField
                label="Coordinators"
                disabled
                required
                value={transformSquadLeader}
                error={Boolean(jobForm.errors.squad_leader)}
                helperText={(jobForm.errors.squad_leader as any)?.message}
                InputLabelProps={{ shrink: Boolean(transformSquadLeader) }}
              />
            </Grid>
            <Grid item xs={1}>
              <MoreHorizIcon onClick={onOpenTransferList(group_map.job_squad_leader, 'squad_leader')} />
            </Grid>
            <Grid item xs={11}>
              <AppTextField
                label="Drawings Responsible"
                disabled
                value={transformDrawingsResponsible}
                InputLabelProps={{
                  shrink: Boolean(transformDrawingsResponsible)
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <MoreHorizIcon onClick={onOpenTransferList(group_map.job_drawing, 'drawings_responsible')} />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={classes.section}>
            <Grid item xs={12}>
              <AppTitle label="Rights" />
            </Grid>
            <Grid item xs={11}>
              <AppTextField
                label="Access Group"
                required
                disabled
                value={transformJobUsers}
                error={Boolean(jobForm.errors.job_users)}
                helperText={(jobForm.errors.job_users as any)?.message}
                InputLabelProps={{ shrink: Boolean(transformJobUsers) }}
              />
            </Grid>
            <Grid item xs={1}>
              <MoreHorizIcon onClick={onOpenTransferList(group_map.job_all, 'job_users')} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <AppTitle label="Description" />

          <TableMultilingualDescription
            tableHeight={315}
            name="job_descriptions"
            editMode={!isCreating}
            control={jobForm.control}
            className={classes.section}
            languageList={parameters.PLLA}
          />
        </Grid>

        <Unless condition={isCreating}>
          <Grid item xs={12} style={{ padding: '0 12px' }}>
            <SectionTimezone value={jobDetail} style={{ padding: 0, marginTop: 0 }} />
          </Grid>
        </Unless>
      </Grid>
      <DialogTransferList
        title={titleForTransferList}
        open={transferListState.open}
        leftSideList={usersAvailable}
        rightSideList={transferListState.userGroup}
        titleLeft="Available Users"
        titleRight={titleForTransferList}
        onSave={onSaveTransferList}
        onClose={onCloseTransferList}
        onChangeLeftSideList={onChangeLeftSideList}
        onChangeRightSideList={onChangeRightSideList}
      />
    </>
  )
}

export default TabGeneral
