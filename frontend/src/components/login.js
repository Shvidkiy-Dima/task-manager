import React from 'react'
import axios from 'axios'
import { useHistory, Link } from "react-router-dom";


function Login(){

  const [username, SetUsername] = React.useState('')
  const [password, SetPassword] = React.useState('')
  const history = useHistory();


  function onChangeUsername(event){
    SetUsername(event.target.value)
  }

  function onChangePassword(event){
    SetPassword(event.target.value)
  }
  function login(e){
    e.preventDefault();

  axios.post(`/auth/jwt/create`, {username, password})
  .then(res => {
    sessionStorage.setItem('access', res.data.access)
    sessionStorage.setItem('refresh', res.data.refresh)
    history.push('/')
  });

  }
  return (<div className="col-md-6">
        <form onSubmit={login}>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input  placeholder="Enter username"
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password"
                    name="password"
                    value={password}
                    onChange={onChangePassword}/>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Submit</button>
            </form>
          <Link to={'/registration'} >Registration</Link>
      </div>
    );
}

export default Login;
