import immer from 'immer'
import { locationStore } from '..'

import type { LocationInitDataForCE, LocationInitDataForList, LocationItem } from '@/types/Location'

const { actions, initialState, resetState } = locationStore
const { reducer } = locationStore.default

describe('[Location Reducer]', () => {
  const fakeDataList = [
    {
      id: 151,
      location_id: '00017'
    },
    {
      id: 152,
      location_id: '00018'
    }
  ] as LocationItem[]

  const fakeInitDataForList = {
    permissions: {
      location: {
        view: true,
        create: true,
        disable_enable: true,
        edit: true
      }
    },
    wiki_page: 'wiki_page/list',
    column_tooltips: {}
  } as LocationInitDataForList

  const fakeInitDataForCE = {
    parameters: {
      CTRY: [], // country
      LOAT: [], // extended properties
      PLLA: [], // language
      PUCO: [], // puco
      SSPE: [], // specialties
      TYLO: [] // location type
    },
    next_code: '99559',
    wiki_page: 'wiki_page/create_edit'
  } as LocationInitDataForCE

  const fakeDetail = {
    location_id: '00095',
    name: 'Data test location'
  }

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
      draft.initDataForList.permissions.location = fakeInitDataForList.permissions.location
    })
    expect(reducer(undefined, actions.setPermissions(fakeInitDataForList.permissions.location))).toEqual(finalState)
  })

  it('should set <setNextCode> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.initDataForCE.next_code = fakeInitDataForCE.next_code
    })
    expect(reducer(undefined, actions.setNextCode(fakeInitDataForCE.next_code))).toEqual(finalState)
  })

  it('should set <setDetail> correctly', () => {
    const finalState = immer(initialState, (draft) => {
      draft.detail = { ...initialState.detail, ...fakeDetail }
    })
    expect(reducer(undefined, actions.setDetail(fakeDetail))).toEqual(finalState)
  })

  it('should set <resetDetail> correctly', () => {
    const prevState = immer(initialState, (draft) => {
      draft.detail = { ...initialState.detail, ...fakeDetail }
    })
    expect(reducer(prevState, actions.resetDetail())).toEqual(initialState)
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
