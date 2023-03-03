import * as yup from 'yup'

export const regexSpecCharacters = '[!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~]'
export const regexes = ['[A-Z]', '[a-z]', '[0-9]', regexSpecCharacters]

const getPasswordYup = (key = 'Password') =>
  yup
    .string()
    .required(`${key} is required!`)
    .min(8, `${key} valid length is from 8 to 30!`)
    .max(30, `${key} valid length is from 8 to 30!`)
    .test(
      'strength',
      `${key} must follow the format: Must be min 8 chars, at least 3 properties out of: capital letters, lower case letters, special characters, numbers.`,
      (value) => {
        let passed = 0
        regexes.forEach((regex) => {
          const isMatch = new RegExp(regex).test(value)
          isMatch && passed++
        })
        return passed === regexes.length
      }
    )

export default getPasswordYup
