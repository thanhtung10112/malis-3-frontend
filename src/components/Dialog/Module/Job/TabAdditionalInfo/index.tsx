import { useState } from 'react'
import useStyles from './styles'
import useDraggableInPortal from '@/hooks/useDraggableInPortal'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import useDialogContext from '../Context/useDialogContext'

import { Grid, List, ListItem, Paper, Typography, Box } from '@material-ui/core'

import {
  AppTitle,
  DataTable,
  DataTableTextField,
  DataTableDatePicker,
  CreateIcon,
  DeleteIcon,
  DragIcon
} from '@/components'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import clsx from 'clsx'
import _ from 'lodash'
import { v1 as uuidv1 } from 'uuid'
import { format as formatDate } from 'date-fns'
import immer from 'immer'
import * as yup from 'yup'

import * as constant from '@/utils/constant'
import swapOrder from '@/utils/swapOrder'
import * as columnProperties from '@/utils/columnProperties'

import type { JobDetail } from '@/types/Job'

function TabAdditionalInfo() {
  const { t } = useTranslation('job')
  const classes = useStyles()
  const renderDraggable = useDraggableInPortal()
  const { isCreating } = useDialogContext()

  const jobForm = useFormContext<JobDetail>()
  const expeditingDates = jobForm.watch('job_expediting_dates', [])

  const [selectedExDates, setSelectedExDates] = useState<string[]>([])

  const renderItems = () => {
    const { job_standard } = jobForm.getValues()
    return job_standard.map((item, index) => (
      <Draggable key={item.id} draggableId={item.parameter_id} index={index}>
        {renderDraggable((provided) => (
          <ListItem component="div" className={classes.listItem} ref={provided.innerRef} {...provided.draggableProps}>
            <Typography variant="caption" component="div">
              {index + 1}
            </Typography>
            <Typography variant="caption" component="div">
              {item.parameter_id + ' - ' + item.description}
            </Typography>
            <span {...provided.dragHandleProps} className={classes.dragIcon}>
              <DragIcon />
            </span>
          </ListItem>
        ))}
      </Draggable>
    ))
  }

  const onAddExpeditingDateRows = () => {
    const newExDate = immer(expeditingDates, (draft) => {
      draft.push({
        id: uuidv1(),
        exp_date: formatDate(new Date(), constant.DATE_FORMAT),
        comment: ''
      })
    })
    jobForm.setValue('job_expediting_dates', newExDate)
  }

  const onDragEndItem = (result) => {
    if (result.source && result.destination) {
      const { job_standard } = jobForm.getValues()
      const items = swapOrder(job_standard, result.source.index, result.destination.index)
      jobForm.setValue('job_standard', items)
    }
  }

  const onChangeExpeditingDate = (id, date) => {
    const value = formatDate(date, constant.DATE_FORMAT)
    const newExDates = immer(expeditingDates, (draft) => {
      const indexExDate = _.findIndex(draft, (exDate) => exDate.id === id)
      draft[indexExDate].exp_date = value
    })
    jobForm.setValue('job_expediting_dates', newExDates)
  }

  const onChangeExpeditingComment = (id, value) => {
    const newExDates = immer(expeditingDates, (draft) => {
      const indexExDate = _.findIndex(draft, (exDate) => exDate.id === id)
      draft[indexExDate].comment = value
    })
    jobForm.setValue('job_expediting_dates', newExDates)
  }

  const onSelectedExDate = ({ selectionModel }) => {
    setSelectedExDates(selectionModel)
  }

  const onDeleteExDate = () => {
    const newExDates = expeditingDates.filter((exDate) => !selectedExDates.some((item) => item === exDate.id))
    jobForm.setValue('job_expediting_dates', newExDates)
    setSelectedExDates([])
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <AppTitle label="Standards" />
        <Paper>
          <List dense className={classes.rootList} component="div">
            <ListItem component="div" className={clsx(classes.listItem, classes.header)}>
              <Typography variant="caption" component={Box} fontWeight={700}>
                #
              </Typography>
              <Typography variant="caption" component={Box} fontWeight={700}>
                Standard
              </Typography>
            </ListItem>

            <DragDropContext onDragEnd={onDragEndItem}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div className="" {...provided.droppableProps} ref={provided.innerRef}>
                    {renderItems()}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </List>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <div className={classes.expeditionHeader}>
          <AppTitle label="Expediting Dates" />
          <div className={classes.buttonGroup}>
            <CreateIcon onClick={onAddExpeditingDateRows} />
            <DeleteIcon onClick={onDeleteExDate} className={clsx(selectedExDates.length <= 0 && classes.disabled)} />
          </div>
        </div>
        <Paper>
          <DataTable
            hideFooter
            disableColumnMenu
            disableSelectionOnClick
            checkboxSelection
            tableHeight={340}
            selectionModel={selectedExDates}
            onSelectionModelChange={onSelectedExDate}
            rows={expeditingDates}
            columns={[
              {
                ...columnProperties.defaultProperties,
                field: 'exp_date',
                flex: 0.3,
                headerName: 'Date',
                renderCell(params) {
                  return (
                    <DataTableDatePicker
                      minDate={isCreating ? new Date() : null}
                      params={params}
                      onChangeValue={onChangeExpeditingDate}
                    />
                  )
                }
              },
              {
                ...columnProperties.defaultProperties,
                ...columnProperties.editCell('Comment'),
                field: 'comment',
                flex: 0.7,
                renderEditCell(params) {
                  return (
                    <DataTableTextField
                      params={params}
                      onChangeValue={onChangeExpeditingComment}
                      rules={yup.string().max(255, t('validation_message.ex_date_comment_max'))}
                    />
                  )
                }
              }
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default TabAdditionalInfo
