import React from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom";


function Registration(){

  const [username, SetUsername] = React.useState('')
  const [password, SetPassword] = React.useState('')
  const history = useHistory();

  function onChangeUsername(event){
    SetUsername(event.target.value)
  }

  function onChangePassword(event){
    SetPassword(event.target.value)
  }
  function registration(e){
    e.preventDefault();

  axios.post(`/auth/users/`, {username, password})
  .then(res => {
    history.push('/login')
  });

  }
  return (<div className="col-md-6">
        <form onSubmit={registration}>
                <h3>Sign Up</h3>

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
      </div>
    );
}

export default Registration;
