const LoginForm = (props) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={props.handleSubmit}>
        <div>
          username
          <input
            name="Username" 
            value={props.username}
            onChange={props.handleUsernameChange}
            autoComplete="off" 
          />
        </div>
        <div>
          password
          <input
            type="password"
            name="Password"
            value={props.password}
            onChange={props.handlePasswordChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
