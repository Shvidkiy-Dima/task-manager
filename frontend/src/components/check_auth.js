import React from 'react'
import MainPage from './main_page'
import OneBoard from './one_board'
import Login from './login'
import { Switch, Route, BrowserRouter, Redirect} from "react-router-dom";



function PrivateRoute({ children, ...rest }) {
  let access_token = sessionStorage.getItem('access')

  return (access_token ? <Route {...rest} render={children}/> : <Redirect to="/login"/> );
}


export default PrivateRoute;
