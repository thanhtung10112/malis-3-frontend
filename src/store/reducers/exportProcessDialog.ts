import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  isOpen: false,
  operationId: '',
  message: 'Initializing...',
  status: 'LOADING',
  celeryId: ''
}

const exportProcessDialogReducer = createSlice({
  name: 'exportProcessDialog',
  initialState,
  reducers: {
    setOpen(state, action) {
      state.isOpen = action.payload
    },
    setMessage(state, action) {
      state.message = action.payload
    },
    setOperationId(state, action) {
      state.operationId = action.payload
    },
    setCeleryId(state, action) {
      state.celeryId = action.payload
    },
    setStatus(state, action) {
      state.status = action.payload
    },
    resetInitState(state) {
      state.operationId = initialState.operationId
      state.celeryId = initialState.celeryId
      state.message = initialState.message
      state.status = initialState.status
    }
  }
})

// Actions
export const { setOpen, setMessage, setOperationId, setCeleryId, setStatus, resetInitState } =
  exportProcessDialogReducer.actions

export default exportProcessDialogReducer.reducer
