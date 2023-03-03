import type { TypographyOptions } from '@material-ui/core/styles/createTypography'

// export const FONT_FAMLY = 'sans-serif, "Arial", "Roboto", "Inter", "Helvetica"'
export const FONT_FAMLY = '"Open Sans", sans-serif, "Arial", "Roboto"'
export const FONT_SIZE_BODY_1 = 13
export const FONT_SIZE_BODY_2 = 12

export const typography = {
  fontFamily: FONT_FAMLY,
  body1: {
    fontSize: FONT_SIZE_BODY_1
  },
  body2: {
    fontSize: FONT_SIZE_BODY_2
  }
} as TypographyOptions
