import { createSlice, createAction, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { setCookie, destroyCookie } from 'nookies'
import Router from 'next/router'

import { actionTypes } from '@/utils/constant'

import type { LoginData, Profile, SettingDetail, SettingInitData } from '@/types/Auth'
import type { RootReducerType } from './rootReducer'

export const name = 'auth'

export const resetState = createAction(`${name}/RESET_STATE`)

export const initialState = {
  access_token: '',
  loading: false,
  unauthorized: false,
  loadingAuth: false,
  profile: {
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    valid_until: '',
    user_name: '',
    updated_at: '',
    group_membership: [],
    default_language_id: null
  } as Profile,
  pwdDialogState: {
    loading: false,
    open: false
  },
  settings: {
    initData: {
      parameters: {
        PAGES: [],
        PLLA: []
      },
      timezones: []
    } as SettingInitData,
    detail: {
      default_language: null,
      home_page: null,
      time_zone: ''
    } as SettingDetail
  }
}

const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    saveTokenLogin(
      state,
      { payload }: PayloadAction<{ access_token: string; remember: boolean; redirect_to: string }>
    ) {
      state.access_token = payload.access_token
      const backUrl = Router.query.back_url
      if (payload.remember) {
        setCookie(null, 'token', payload.access_token, {
          maxAge: 60 * 60 * 24 // 1 day
        })
      } else {
        setCookie(null, 'token', payload.access_token)
      }
      setCookie(null, 'redirect_to', payload.redirect_to, {
        maxAge: 60 * 60 * 24 * 365
      })
      if (backUrl) {
        Router.push(decodeURIComponent(backUrl as string))
      } else {
        Router.push(payload.redirect_to)
      }
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload
    },
    setUnauthorized(state, { payload }: PayloadAction<boolean>) {
      state.unauthorized = payload
    },
    setProfile(state, { payload }: PayloadAction<Profile>) {
      state.profile = payload
    },
    logout(state) {
      destroyCookie(null, 'token')
      destroyCookie(null, 'redirect_to')
      destroyCookie(null, 'current_job_id')
      state.unauthorized = false
      state.access_token = ''
      Router.push('/login')
    },
    setPwDialogState(state, { payload }: PayloadAction<Partial<typeof initialState.pwdDialogState>>) {
      state.pwdDialogState = {
        ...state.pwdDialogState,
        ...payload
      }
    },
    setProfileAvatar(state, { payload }: PayloadAction<string>) {
      state.profile.avatar = payload
    },
    setSettingInitData(state, { payload }: PayloadAction<SettingInitData>) {
      state.settings.initData = payload
    },
    setLoadingAuth(state, { payload }: PayloadAction<boolean>) {
      state.loadingAuth = payload
    },
    setSettingDetail(state, { payload }: PayloadAction<Partial<SettingDetail>>) {
      state.settings.detail = {
        ...state.settings.detail,
        ...payload
      }
    },
    setDefaultLanguage(state, { payload }: PayloadAction<number>) {
      state.profile.default_language_id = payload
    }
  },
  extraReducers: {
    [resetState.type]() {
      return initialState
    }
  }
})

// Actions
export const { actions } = authSlice

// Saga actions

export const sagaLogin = createAction<LoginData>(`${name}/${actionTypes.LOGIN}`)
export const sagaGetProfile = createAction(`${name}/${actionTypes.GET_PROFILE}`)
export const sagaChangePassword = createAction<{ new_password: string; old_password: string }>(
  `${name}/${actionTypes.CHANGE_PASSWORD}`
)
export const sagaGetSettings = createAction(`${name}/GET_SETTINGS`)
export const sagaSaveSettings = createAction<SettingDetail>(`${name}/SAVE_SETTINGS`)
export const sagaLogout = createAction<{ confirm: string }>(`${name}/${actionTypes.LOGOUT}`)

export const selectState = (state: RootReducerType) => state.auth
export const selectUnauthorized = createSelector(selectState, (state) => state.unauthorized)
export const selectProfile = createSelector(selectState, (state) => state.profile)
export const selectPwdDialogState = createSelector(selectState, (state) => state.pwdDialogState)
export const selectSettings = createSelector(selectState, (state) => state.settings)

export const selectSettingsParameters = createSelector(selectState, (state) => state.settings.initData.parameters)

export const selectLoadingAuth = createSelector(selectState, (state) => state.loadingAuth)

export default authSlice
