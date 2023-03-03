import { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'
import Head from 'next/head'

import { red } from '@material-ui/core/colors'

import * as _ from 'lodash'
import * as constants from '@/utils/constant'

import { ExpandMore, CheckCircle, Check, ImportExport, Save, Group } from '@material-ui/icons'

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Tooltip,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@material-ui/core'
import { When } from 'react-if'
import { AppBreadcrumb, MalisNoViewPermissionOnModule } from '@/components'

import useStyles from '@/styles/page/layout'

import { groupStore } from '@/store/reducers'

import produce from 'immer'

function PermissionTopic({ name, permissions, groupList, changeAction, handleMarkCell, isMarked }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [topicPermissions, setTopicPermissions] = useState(permissions)
  const [topicName] = useState(name)

  // This is the trick for force re-render
  const [, setValue] = useState(0)

  const togglePermission = (action, group) => () => {
    // We have three modes of permission, each will be asign to a number
    // 0 for no permission
    // 1 for all job
    // 2 for per job
    // Let's determine the current permission mode of the action
    let currentMode = 0 // default to no permission
    if (action.all_job_groups && action.all_job_groups.split(';').includes(`${group.id}`)) {
      currentMode = 1
    } else if (action.per_job_groups && action.per_job_groups.split(';').includes(`${group.id}`)) {
      currentMode = 2
    }

    // We have current mode now. Let's determine the next mode that we will switch to
    let nextMode = 0
    if (currentMode === 0) {
      // switch to mode 1
      nextMode = 1
    } else if (currentMode === 1) {
      // if the action allow per job, then switch to mode 2
      // otherwise, switch to mode 0
      if (action.is_per_job) {
        nextMode = 2
      } else {
        nextMode = 0
      }
    } else {
      // switch straight to mode 0
      nextMode = 0
    }

    // We have the next mode now. Let's do the real switch
    if (nextMode === 0) {
      // Remove the group id from both all job and per job
      if (action.all_job_groups) {
        // console.log(action.all_job_groups);
        action.all_job_groups = action.all_job_groups
          .split(';')
          .filter((groupId) => groupId !== `${group.id}`)
          .join(';')
        // console.log(action.all_job_groups);
      }
      if (action.per_job_groups) {
        action.per_job_groups = action.per_job_groups
          .split(';')
          .filter((groupId) => groupId !== `${group.id}`)
          .join(';')
      }
    } else if (nextMode === 1) {
      // Add the permission to all job groups
      if (action.all_job_groups) {
        const tmp_all_job_groups = action.all_job_groups.split(';')
        tmp_all_job_groups.push(`${group.id}`)
        action.all_job_groups = _.uniq(tmp_all_job_groups).join(';')
      } else {
        action.all_job_groups = `${group.id}`
      }
    } else if (nextMode === 2) {
      // Remove the group from all job group
      if (action.all_job_groups) {
        action.all_job_groups = action.all_job_groups
          .split(';')
          .filter((groupId) => groupId !== `${group.id}`)
          .join(';')
      }
      // Add it to per_job_group
      if (action.per_job_groups) {
        const tmp_per_job_groups = action.per_job_groups.split(';')
        tmp_per_job_groups.push(`${group.id}`)
        action.per_job_groups = _.uniq(tmp_per_job_groups).join(';')
      } else {
        action.per_job_groups = `${group.id}`
      }
    }
    // Update the permission object & update state
    const indexForUpdating = _.findIndex(topicPermissions, { id: action.id })
    topicPermissions[indexForUpdating] = action
    setTopicPermissions(() => topicPermissions)
    // Send the change to parent
    changeAction(action)
    // Force re-render
    setValue((value) => value + 1)
    handleMarkCell(action, group)
  }
  return (
    <>
      <Accordion expanded={open}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={topicName}
          id={`topic-${topicName}`}
          onClick={() => setOpen(!open)}
        >
          <Typography>
            <b>Topic: {constants.PERMISSION_TOPIC_MAP[topicName] || topicName}</b>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer>
            <Table stickyHeader size="small" aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    style={{
                      width: '10%',
                      position: 'sticky',
                      background: '#fff',
                      left: 0,
                      zIndex: 3
                    }}
                  >
                    Action
                  </TableCell>
                  {groupList.map((group) => (
                    <Tooltip title={group.name} key={group.group_id}>
                      <TableCell align="center" style={{ width: `${90 / groupList.length}%` }}>
                        {group.group_id}
                      </TableCell>
                    </Tooltip>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {topicPermissions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell
                      align="left"
                      style={{
                        width: '10%',
                        position: 'sticky',
                        background: '#fff',
                        left: 0,
                        zIndex: 3
                      }}
                    >
                      {constants.PERMISSION_MAP[action.action] || action.action}
                    </TableCell>
                    {groupList.map((group) => (
                      <Fragment key={`${group.group_id}-${action.id}`}>
                        <TableCell
                          align="center"
                          className={classes.permissionItem}
                          style={{
                            width: `${90 / groupList.length}%`,
                            cursor: 'pointer',
                            backgroundColor: isMarked(action, group) ? red[50] : null
                          }}
                          onClick={togglePermission(action, group)}
                        >
                          {action.all_job_groups && action.all_job_groups.split(';').includes(`${group.id}`) ? (
                            <Check className="tick-icon" />
                          ) : action.per_job_groups && action.per_job_groups.split(';').includes(`${group.id}`) ? (
                            <CheckCircle />
                          ) : (
                            <></>
                          )}
                        </TableCell>
                      </Fragment>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

function PermissionRightTable() {
  const breadcrumbData = [
    { label: 'Home', href: '/' },
    { label: 'System Management', href: '/users' },
    { label: 'Groups Management', href: '/groups' },
    { label: 'Permissions Management', href: '/groups/permissions' }
  ]

  const classes = useStyles()

  const [changedActions, setChangedActions] = useState([])
  // This is the trick for force re-render
  // const [value, setValue] = useState(0)

  const dispatch = useDispatch()
  const router = useRouter()
  const [markEdit, setMarkEdit] = useState([])

  const groupPermissionState = useSelector(groupStore.selectGroupPermissions)
  const permissionsList = useSelector(groupStore.selectPermissions)

  const { groups: groupList, permissions } = _.cloneDeep(groupPermissionState)
  const permissionsGroupByTopics = _.groupBy(permissions, 'entity')

  useEffect(() => {
    dispatch(groupStore.sagaGetGroupPermissions())
  }, [])

  const handleMarkCell = (action, group) => {
    const cellMark = group.id + ':' + action.id
    setMarkEdit((prevState) =>
      produce(prevState, (draftState) => {
        draftState.push(cellMark)
      })
    )
  }

  const isMarked = (action, group) => {
    const cellMark = group.id + ':' + action.id
    return markEdit.includes(cellMark)
  }

  const renderTopics = () => {
    const topicSegment = []
    for (const key in permissionsGroupByTopics) {
      topicSegment.push(
        <PermissionTopic
          key={key}
          name={key}
          permissions={permissionsGroupByTopics[key]}
          groupList={groupList}
          changeAction={onActionChanged}
          handleMarkCell={handleMarkCell}
          isMarked={isMarked}
        />
      )
    }

    return topicSegment
  }

  const onActionChanged = (action) => {
    if (permissionsList?.edit_permissions) {
      const newChangedActions = [...changedActions]
      const indexForChange = _.findIndex(changedActions, { id: action.id })
      if (indexForChange !== -1) {
        newChangedActions[indexForChange] = action
      } else {
        newChangedActions.push(action)
      }
      setChangedActions(newChangedActions)
    }
  }

  const savePermissions = () => {
    if (permissionsList?.edit_permissions) {
      const updatedPermissions = []
      changedActions.forEach((action) => {
        updatedPermissions.push({
          id: action.id,
          all_job_groups: action.all_job_groups,
          per_job_groups: action.per_job_groups
        })
      })
      dispatch(
        groupStore.sagaUpdateGroupPermissions({
          permissions: updatedPermissions
        })
      )
      setChangedActions([])
      setMarkEdit([])
    }
  }

  const goToGroupList = () => {
    router.push('/groups')
  }

  return (
    <>
      <Head>
        <title>Groups Management</title>
      </Head>
      <div className={classes.main}>
        <AppBreadcrumb items={breadcrumbData} />
      </div>
      <main className={classes.main}>
        <Grid container alignItems="center">
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button
              disabled={changedActions.length <= 0 || !permissionsList?.edit_permissions}
              startIcon={<Save />}
              onClick={savePermissions}
            >
              Save
            </Button>
            <Button disabled startIcon={<ImportExport />} onClick={savePermissions}>
              Export
            </Button>
            <Button startIcon={<Group />} onClick={goToGroupList}>
              View Groups
            </Button>
          </Grid>
        </Grid>
      </main>
      <Grid
        container
        style={{
          height: 'calc(100vh - 9rem)',
          width: '100%',
          overflow: 'hidden',
          overflowY: 'scroll'
        }}
      >
        <Grid item xs={12}>
          <When condition={permissionsList?.edit_permissions}>{renderTopics()}</When>
          <When condition={!_.isNull(permissionsList) && !permissionsList?.edit_permissions}>
            <MalisNoViewPermissionOnModule />
          </When>
        </Grid>
      </Grid>
    </>
  )
}

export const getServerSideProps = useAuthMiddleware()

export default PermissionRightTable
