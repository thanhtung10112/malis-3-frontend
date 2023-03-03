import React from 'react'
import { TreeView, TreeItem } from '@material-ui/lab'

import FolderIcon from '@material-ui/icons/Folder'
import DescriptionIcon from '@material-ui/icons/Description'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import useStyles from './styles'
import { useSelector, useDispatch } from 'react-redux'

import { drawingStore } from '@/store/reducers'

function LabelTree({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FolderIcon style={{ marginRight: 8, color: '#78909C', fontSize: '1.3rem' }} />
      <span>{label}</span>
    </div>
  )
}

export default function App() {
  const classes = useStyles()

  const dispatch = useDispatch()
  const drawingGroups = useSelector(drawingStore.selectDrawingGroups)
  const drawingGroupId = useSelector(drawingStore.selectDrawingGroupId)

  const handleSelectDrawing = (groupId: number) => () => {
    if (drawingGroupId !== groupId) {
      dispatch(drawingStore.actions.setDrawingGroupId(groupId))
      dispatch(drawingStore.sagaGetList())
    }
  }

  return (
    <TreeView
      defaultExpanded={['-1']}
      defaultCollapseIcon={<ExpandMoreIcon style={{ fontSize: 22, color: '#78909C' }} />}
      defaultExpandIcon={<ChevronRightIcon style={{ fontSize: 22, color: '#78909C' }} />}
    >
      <TreeItem
        nodeId={'-1'}
        label={<LabelTree label="All" />}
        className={classes.treeRoot}
        classes={{ content: classes.all }}
        onClick={handleSelectDrawing(drawingGroups.id)}
      >
        {drawingGroups.children.map((data) => {
          return (
            <TreeItem
              key={data.group_id}
              className={classes.treeItemParent}
              nodeId={data.group_id}
              label={<LabelTree label={data.description} />}
              onClick={handleSelectDrawing(data.id)}
            >
              {data.children.map((child) => (
                <TreeItem
                  key={child.group_id}
                  className={classes.treeItemChild}
                  nodeId={child.group_id}
                  label={child.description}
                  onClick={handleSelectDrawing(child.id)}
                  endIcon={<DescriptionIcon style={{ color: '5E6366', fontSize: '1.3rem' }} />}
                />
              ))}
            </TreeItem>
          )
        })}
      </TreeItem>
    </TreeView>
  )
}
