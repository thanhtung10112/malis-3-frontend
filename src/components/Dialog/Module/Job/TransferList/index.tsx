import React from 'react'

import { Card, CardHeader, Checkbox, List, ListItem, ListItemText, Grid, Button, ListItemIcon } from '@material-ui/core'

import { DragIndicator as DragIndicatorIcon } from '@material-ui/icons'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { DialogMain } from '@/components'

import _ from 'lodash'
import immer from 'immer'

import useDraggableInPortal from '@/hooks/useDraggableInPortal'
import useStyles from './styles'

function not(a: any[], b: any[]) {
  return a.filter((value) => b.findIndex((item) => value.id === item.id) === -1)
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export interface Props {
  leftSideList: any
  rightSideList: any
  titleLeft: string
  titleRight: string
  title: string
  open: boolean
  onSave(): void
  onClose(): void
  onChangeRightSideList(list): void
  onChangeLeftSideList(list): void
}

function DialogTransferList(props: Props) {
  const {
    titleLeft,
    titleRight,
    leftSideList,
    rightSideList,
    onSave,
    onClose,
    onChangeRightSideList,
    onChangeLeftSideList,
    ...rest
  } = props

  const classes = useStyles()
  const [checked, setChecked] = React.useState([])

  const renderDraggable = useDraggableInPortal()

  const leftChecked = _.intersectionWith(leftSideList, checked, _.isEqual)
  const rightChecked = _.intersectionWith(rightSideList, checked, _.isEqual)

  const handleToggle = (value) => () => {
    setChecked((prevState) =>
      immer(prevState, (draftState) => {
        if (draftState.length <= 0) {
          draftState.push(value)
          return
        }
        const currentIndex = checked.findIndex((item) => item.id === value.id)
        if (currentIndex === -1) {
          draftState.push(value)
        } else {
          draftState.splice(currentIndex, 1)
        }
      })
    )
  }

  const isChecked = (value) => checked.findIndex((item) => item.id === value.id) !== -1

  const numberOfChecked = (items) => {
    if (checked.length === 0) {
      return 0
    }
    const intersectArray = _.intersectionWith(items, checked, _.isEqual)
    return intersectArray.length
  }

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked([])
    } else {
      setChecked(items)
    }
  }

  const handleCheckedRight = () => {
    const newRightList = rightSideList.concat(leftChecked)
    const newLeftList = not(leftSideList, leftChecked)
    onChangeRightSideList(newRightList)
    onChangeLeftSideList(newLeftList)
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    const newLeftList = leftSideList.concat(rightChecked)
    const newRightList = not(rightSideList, rightChecked)
    onChangeRightSideList(newRightList)
    onChangeLeftSideList(newLeftList)
    setChecked(not(checked, rightChecked))
  }

  const onSaveList = () => {
    onSave()
  }

  const onDragEndItem = (result) => {
    if (result.source && result.destination) {
      const items = reorder(rightSideList, result.source.index, result.destination.index)
      onChangeRightSideList(items)
    }
  }

  const handleClose = () => {
    setChecked([])
    onClose()
  }

  const customList = (title: string, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        classes={{
          title: classes.cardHeaderTitle,
          subheader: classes.cardHeaderSubtitle
        }}
        avatar={
          <Checkbox
            color="primary"
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.id}-label`

          return (
            <ListItem key={value.id} role="listitem" button onClick={handleToggle(value)} className={classes.itemList}>
              <ListItemIcon>
                <Checkbox
                  color="primary"
                  checked={isChecked(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value.user_id} (${value.first_name} ${value.last_name})`}
                classes={{ primary: classes.itemText }}
              />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Card>
  )

  return (
    <DialogMain
      {...rest}
      onClose={handleClose}
      onOk={onSaveList}
      okText="Save"
      enterToOk={false}
      classes={{ paper: classes.root }}
    >
      <Grid container spacing={1} justify="center" alignItems="center">
        <Grid item xs={5}>
          {customList(titleLeft, leftSideList)}
        </Grid>
        <Grid item xs={2}>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          {/* {customList(titleRight, rightSideList)} */}
          <Card>
            <CardHeader
              className={classes.cardHeader}
              classes={{
                title: classes.cardHeaderTitle,
                subheader: classes.cardHeaderSubtitle
              }}
              avatar={
                <Checkbox
                  color="primary"
                  onClick={handleToggleAll(rightSideList)}
                  checked={numberOfChecked(rightSideList) === rightSideList.length && rightSideList.length !== 0}
                  indeterminate={
                    numberOfChecked(rightSideList) !== rightSideList.length && numberOfChecked(rightSideList) !== 0
                  }
                  disabled={rightSideList.length === 0}
                  inputProps={{ 'aria-label': 'all items selected' }}
                />
              }
              title={titleRight}
              subheader={`${numberOfChecked(rightSideList)}/${rightSideList.length} selected`}
            />

            <DragDropContext onDragEnd={onDragEndItem}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <List
                    className={classes.list}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    dense
                    component="div"
                    role="list"
                  >
                    {rightSideList.map((value, index) => {
                      const labelId = `transfer-list-all-item-${value.id}-label`

                      return (
                        <Draggable key={value.id} draggableId={value.id + ''} index={index}>
                          {renderDraggable((provided) => (
                            <ListItem
                              key={value.id}
                              role="listitem"
                              button
                              onClick={handleToggle(value)}
                              className={classes.itemList}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  color="primary"
                                  checked={isChecked(value)}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                id={labelId}
                                primary={`${value.user_id} (${value.first_name} ${value.last_name})`}
                                classes={{ primary: classes.itemText }}
                              />
                              <span {...provided.dragHandleProps}>
                                <DragIndicatorIcon />
                              </span>
                            </ListItem>
                          ))}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        </Grid>
      </Grid>
    </DialogMain>
  )
}

export default DialogTransferList
