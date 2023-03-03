import { useState } from 'react'

import { TreeView } from '@material-ui/lab'

import ConditionGroup from './ConditionGroup'

function ConditionTree({ columnOptions, comparatorOptions, conjunctionOptions, data, disabled, maxLevel = 2 }) {
  // Trick for forcing rerender
  const [, setValue] = useState(0)

  const forceRerender = () => {
    setValue((value) => value + 1)
  }

  return (
    <>
      <TreeView expanded={['group']} disableSelection>
        <ConditionGroup
          level={0}
          groupData={data}
          parent={null}
          forceParentRerender={forceRerender}
          columnOptions={columnOptions}
          comparatorOptions={comparatorOptions}
          conjunctionOptions={conjunctionOptions}
          disabled={disabled}
          maxLevel={maxLevel}
        />
      </TreeView>
    </>
  )
}

export default ConditionTree
