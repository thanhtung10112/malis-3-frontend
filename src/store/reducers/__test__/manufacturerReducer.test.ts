import immer from 'immer'
import { manufacturerStore } from '..'

import { ManufacturerInitDataForCE, ManufacturerInitDataForList, ManufacturerItem } from '@/types/Manufacturer'

const { actions, initialState, resetState } = manufacturerStore
const { reducer } = manufacturerStore.default

describe('[Manufacturer Reducer]', () => {
  const fakeDataList = [
    {
      manufacturer_id: 1,
      id: 1,
      name: 'Data test 1'
    },
    {
      manufacturer_id: 2,
      id: 2,
      name: 'Data test 2'
    }
  ] as ManufacturerItem[]

  const fakeInitDataForList = {
    permissions: {
      manufacturer: {
        view: true,
        create: true,
        disable_enable: true,
        edit: true
      }
    },
    wiki_page: 'wiki_page/list',
    column_tooltips: {}
  } as ManufacturerInitDataForList

  const fakeInitDataForCE = {
    next_code: 99,
    wiki_page: 'wiki_page/list'
  } as ManufacturerInitDataForCE

  const fakeDetail = {
    manufacturer_id: 2,
    id: 2,
    name: 'Data test 2'
  } as ManufacturerItem

  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual(initialState)
  })

  it('should set <dialogState> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.dialogState.open = true
      draft.dialogState.loading = true
    })
    expect(reducer(undefined, actions.setDialogState({ open: true, loading: true }))).toEqual(finalState)
  })

  it('should set <dialogStateOpen> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.dialogState.open = true
    })
    expect(reducer(undefined, actions.setDialogState({ open: true }))).toEqual(finalState)
  })

  it('should set <dialogStateLoading> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.dialogState.loading = true
    })
    expect(reducer(undefined, actions.setDialogState({ loading: true }))).toEqual(finalState)
  })

  it('should set <dataList> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.dataList = fakeDataList
    })
    expect(reducer(undefined, actions.setDataList(fakeDataList))).toEqual(finalState)
  })

  it('should set <setInitDataForList> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.initDataForList = fakeInitDataForList
    })
    expect(reducer(undefined, actions.setInitDataForList(fakeInitDataForList))).toEqual(finalState)
  })

  it('should set <setInitDataForCE> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.initDataForCE = fakeInitDataForCE
    })
    expect(reducer(undefined, actions.setInitDataForCE(fakeInitDataForCE))).toEqual(finalState)
  })

  it('should set <setPermissions> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.initDataForList.permissions.manufacturer = fakeInitDataForList.permissions.manufacturer
    })
    expect(reducer(undefined, actions.setPermissions(fakeInitDataForList.permissions.manufacturer))).toEqual(finalState)
  })

  it('should set <setNextCode> correctly', () => {
    const fakeData = 99
    const finalState = immer(initialState, (draft) => {
      draft.initDataForCE.next_code = fakeData
    })
    expect(reducer(undefined, actions.setNextCode(fakeData))).toEqual(finalState)
  })

  it('should set <setDetail> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.detail = { ...initialState.detail, ...fakeDetail }
    })
    expect(reducer(undefined, actions.setDetail(fakeDetail))).toEqual(finalState)
  })

  it('should set <resetDetail> correctly', () => {
    const nextCode = 99
    const prevState = immer(initialState, (draft) => {
      draft.initDataForCE.next_code = nextCode
    })
    const finalState = immer(initialState, (draft) => {
      draft.detail.manufacturer_id = nextCode
      draft.initDataForCE.next_code = nextCode
    })
    expect(reducer(prevState, actions.resetDetail())).toEqual(finalState)
  })

  it('should set <resetState> correctly', () => {
    const prevState = immer(initialState, (draft) => {
      draft.initDataForCE = fakeInitDataForCE
      draft.initDataForList = fakeInitDataForList
      draft.dataList = fakeDataList
    })
    expect(reducer(prevState, resetState())).toEqual(initialState)
  })
})
