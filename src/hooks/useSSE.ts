import React from 'react'

import _ from 'lodash'

import type { BackgroundJobResult } from '@/types/BackgroundJob'

function useSSE(operationId: string) {
  const domain = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/'
  const sseConnection = React.useRef<EventSource>(null)

  const [dataSSE, setDataSSE] = React.useState<BackgroundJobResult>({
    message: 'Initializing...',
    status: null,
    operation_result: null
  })

  const backgroundJobListener = (event) => {
    const response = JSON.parse(event.data) as BackgroundJobResult
    setDataSSE(response)
    if (response.status === 'SUCCESS' || response.status === 'ERROR') {
      sseConnection.current.removeEventListener(operationId, backgroundJobListener)
      sseConnection.current.close()
      sseConnection.current = null
    }
  }

  React.useEffect(() => {
    if (_.isEmpty(operationId)) {
      return null
    }
    if (!sseConnection.current) {
      sseConnection.current = new EventSource(`${domain}background_stream`)
    }
    sseConnection.current.addEventListener(operationId, backgroundJobListener)
  }, [operationId])

  return { dataSSE, setDataSSE }
}

export default useSSE
