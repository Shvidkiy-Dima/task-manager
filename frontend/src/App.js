import React from 'react'
import PrivateRoute from './components/check_auth'
import Login from './components/login'
import Registration from './components/registration'
import OneBoard from './components/one_board'
import MainPage from './components/main_page'
import { Switch, Route, BrowserRouter} from "react-router-dom";

function App() {

    return (
      <div className="App">
      <BrowserRouter>
                <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/registration' component={Registration}/>
                <MainPage/>
             </Switch>
      </BrowserRouter>
      </div>
    )
}

export default App;
