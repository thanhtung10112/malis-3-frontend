import React from 'react'

import { CircularProgress, Tooltip } from '@material-ui/core'
import { When, Unless, If, Then, Else } from 'react-if'
import { UploadIcon, DeleteIcon } from '@/components/index'

import Http from '@/utils/Http'
import clsx from 'clsx'
import { commonStore } from '@/store/reducers'
import immer from 'immer'

import { useDispatch } from 'react-redux'
import useStyles from './styles'

import type { UploadImageProps } from './type'

const UploadImage: React.FC<UploadImageProps> = (props) => {
  const { image: imageProp, fileTypes, fileSize, httpRequest, onChange, width, height, error: errorProps } = props

  const classes = useStyles({ width, height })

  const [image, setImage] = React.useState({
    file: null,
    base64: ''
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const dispatch = useDispatch()

  let refInput: HTMLInputElement = null

  React.useEffect(() => {
    setImage((prevState) =>
      immer(prevState, (draft) => {
        if ((imageProp as any) instanceof File) {
          draft.file = imageProp
        } else {
          draft.base64 = imageProp
        }
      })
    )
  }, [imageProp])

  React.useEffect(() => {
    setError(errorProps)
  }, [errorProps])

  const accepTypes = React.useMemo(() => fileTypes.join(','), [fileTypes])

  const isValidImage = React.useCallback(
    (file) => {
      const size = file.size / 1024
      const type = file.type
      return size <= fileSize && fileTypes.includes(type)
    },
    [fileTypes, fileSize]
  )

  const convertFilesToBase64 = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        resolve((reader as any).result)
      }
      reader.onerror = reject
    })

  const setRefInput = (element: HTMLInputElement) => {
    refInput = element
  }

  const handleOpenWindowSelect = () => {
    refInput.value = ''
    refInput.click()
  }

  const handleUploadImage = async ({ file, base64 }) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append(httpRequest.key, file)
      const { data } = await Http[httpRequest.method](httpRequest.endpoint, formData)
      onChange({ file, base64 })
      dispatch(commonStore.actions.setSuccessMessage(data.message))
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  const handleChangeFile = async (event) => {
    const file = event.target.files[0]
    const base64 = await convertFilesToBase64(file)
    const fileInstance = {
      file,
      base64
    }
    setImage(fileInstance)
    if (!isValidImage(file) && httpRequest) {
      setError('The file must be image or file size must be less than 500KB!')
      return
    }
    setError('')
    if (httpRequest) {
      await handleUploadImage(fileInstance)
    } else {
      onChange(fileInstance)
    }
  }

  const removeImageRequest = async () => {
    if (error) {
      setImage((prev) => ({ ...prev, base64: imageProp }))
      setError('')
    } else {
      setLoading(true)
      setError('')
      try {
        const formData = new FormData()
        formData.append(httpRequest.key, null)
        const { data } = await Http[httpRequest.method](httpRequest.endpoint, formData)
        dispatch(commonStore.actions.setSuccessMessage(data.message))
        setImage({ file: null, base64: '' })
        onChange({ file: null, base64: null })
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
  }

  const handleRemoveImage = async () => {
    setError('')
    if (httpRequest) {
      await removeImageRequest()
    } else {
      onChange({ base64: '', file: null })
      setImage({ base64: '', file: null })
    }
  }

  return (
    <Tooltip title={error || 'Only PNG, JPG, JPEG files are allowed!'}>
      <div className={clsx(classes.upload, { error: Boolean(error) })}>
        <span className={classes.uploadSelect}>
          <input
            type="file"
            onChange={handleChangeFile}
            ref={setRefInput}
            style={{ display: 'none' }}
            accept={accepTypes}
          />
          <Unless condition={image.base64}>
            <div className={classes.uploadSection} onClick={handleOpenWindowSelect}>
              <UploadIcon className={classes.uploadSelect__icon} role="button" aria-label="upload" />
            </div>
          </Unless>

          <When condition={image.base64}>
            <div className={classes.imageSection}>
              <img src={image.base64} alt="" className={classes.imageSection__image} />
              <If condition={loading}>
                <Then>
                  <div className={classes.imageSection__loadingOverlay}>
                    <CircularProgress size={20} color="inherit" />
                    <div style={{ marginTop: 8 }}>Uploading...</div>
                  </div>
                </Then>
                <Else>
                  <div className={classes.imageSection__actions}>
                    <UploadIcon className={classes.imageSection__actions__item} onClick={handleOpenWindowSelect} />
                    <DeleteIcon className={classes.imageSection__actions__item} onClick={handleRemoveImage} />
                  </div>
                </Else>
              </If>
            </div>
          </When>
        </span>
      </div>
    </Tooltip>
  )
}

UploadImage.defaultProps = {
  fileTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  fileSize: 500,
  width: '100%',
  height: '100%'
}

export default UploadImage
