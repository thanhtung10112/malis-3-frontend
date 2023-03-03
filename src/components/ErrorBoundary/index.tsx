import React from 'react'
import { DialogMain } from '@/components/index'

class ErrorDialog extends React.PureComponent<{
  open: boolean
  onClose(): void
}> {
  render() {
    const { open, onClose } = this.props
    return (
      <DialogMain
        type="error"
        open={open}
        maxWidth="xs"
        title="Error"
        onClose={onClose}
        closeText="Ok"
        closeButtonProps={{ color: 'secondary' }}
        description="An unexpected error has occurred, please contact your administrator."
      />
    )
  }
}

class ErrorBoundary extends React.Component<any> {
  state = {
    hasError: false
  }

  static getDerivedStateFromError(error) {
    if (process.env.NEXT_PUBLIC_MODE === 'develop') {
      console.error('error', error)
    }
    return { hasError: true }
  }

  onCloseErrorDialog = () => {
    this.setState((prevState) => ({ ...prevState, hasError: false }))
  }

  render() {
    const { hasError } = this.state
    return (
      <>
        {this.props.children}
        <ErrorDialog open={hasError} onClose={this.onCloseErrorDialog} />
      </>
    )
  }
}

export default ErrorBoundary
