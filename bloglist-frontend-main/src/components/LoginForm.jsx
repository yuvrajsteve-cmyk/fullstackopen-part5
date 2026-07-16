import { Box, Button, TextField, Typography } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  username,
  password,
  setUsername,
  setPassword
}) => {

  return(
    <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex',
      flexDirection: 'column', gap: 2, maxWidth: 300 }}>
      <Typography variant='h4'>
                Login to Application
      </Typography>
      <TextField
        label='username'
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <TextField
        label='password'
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <Button variant='contained' type='submit'>LOGIN</Button>
    </Box>
  )
}

export default LoginForm