import SunEditor from 'suneditor-react'

import { DialogMain } from '@/components/index'

function DialogRichTextEditor(props) {
  let editorRef: SunEditor = null

  const onConfirm = () => {
    props.onConfirm(props.languageId, editorRef.editor.getContents(true))
  }

  const onClose = () => {
    props.onClose()
  }

  return (
    <DialogMain
      open={props.isOpen}
      title={props.title}
      closeText="Cancel"
      onOk={onConfirm}
      onClose={onClose}
      maxWidth="md"
      enterToOk={false}
      fullWidth
    >
      <SunEditor
        autoFocus
        defaultValue={props.content}
        height="50vh"
        setOptions={{
          buttonList: [
            ['fontSize', 'formatBlock', 'bold', 'italic', 'underline', 'fontColor', 'removeFormat'],
            [],
            ['align', 'list'],
            [],
            ['outdent', 'indent'],
            [],
            ['link'],
            [],
            ['undo', 'redo']
          ]
        }}
        ref={(e) => (editorRef = e)}
      />
    </DialogMain>
  )
}

export default DialogRichTextEditor
