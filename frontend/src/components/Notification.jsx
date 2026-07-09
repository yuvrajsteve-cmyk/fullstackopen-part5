const Notification = ({ message }) => {
  if (message === null) return null

  return (
    <div style={{
      color: 'red',
      background: 'lightgrey',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid red'
    }}>
      {message}
    </div>
  )
}

export default Notification
