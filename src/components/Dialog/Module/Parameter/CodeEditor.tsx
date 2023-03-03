import { useEffect } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import ReactMarkdown from 'react-markdown'

import beautify from 'js-beautify'
import { format as sqlFormatter } from 'sql-formatter'

import { Grid } from '@material-ui/core'
import { When } from 'react-if'

import { DialogMain } from '@/components'

function DialogCodeEditor(props) {
  useEffect(() => {
    require('codemirror/mode/javascript/javascript')
    require('codemirror/mode/sql/sql')
  }, [])

  const containGuideline = props.guideline !== '(no guideline)'

  const jsBeautifier = beautify.js

  let codeValue = ''

  if (props.attribute === 'columns_definition') {
    codeValue = jsBeautifier(props.value)
  } else {
    codeValue = sqlFormatter(props.value, {
      language: 'postgresql'
    })
  }

  const onConfirm = () => {
    props.onConfirm(codeValue, props.attribute)
  }

  const onClose = () => {
    props.onClose()
  }

  return (
    <DialogMain
      open={props.isOpen}
      title={props.attribute}
      onOk={onConfirm}
      onClose={onClose}
      closeText="Cancel"
      maxWidth={containGuideline ? 'lg' : 'md'}
      fullWidth
      enterToOk={false}
    >
      <Grid container spacing={3}>
        <Grid item xs={containGuideline ? 6 : 12}>
          <div style={{ height: '70vh', overflow: 'auto' }}>
            <CodeMirror
              value={codeValue}
              options={{
                mode: props.attribute === 'columns_definition' ? 'javascript' : 'sql',
                json: true,
                lineWrapping: true,
                lineNumbers: true
              }}
              onChange={(editor, data, value) => {
                codeValue = value
              }}
            />
          </div>
        </Grid>
        <When condition={containGuideline}>
          <Grid item xs={6}>
            <div className="markdown" style={{ overflow: 'auto', height: '70vh' }}>
              <ReactMarkdown>{props.guideline}</ReactMarkdown>
            </div>
          </Grid>
        </When>
      </Grid>
    </DialogMain>
  )
}

export default DialogCodeEditor
