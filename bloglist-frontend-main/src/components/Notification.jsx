import { Alert } from '@mui/material'

const Notification = ({ notification }) => {

  if (!notification) {
    return null
  }


  return (
    <Alert severity={notification.type || 'info'} sx={{ mt: 2, mb: 2 }}>
      {notification.text}
    </Alert>
  )
}

export default Notification