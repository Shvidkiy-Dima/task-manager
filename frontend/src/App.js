import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import Table from './mainpage'


function Hi(props){
  const [Data, setData] = React.useState([]);

  return <tr> <h1>{ Data }</h1> <button onClick={()=> {
    let data = [...Data]
    data.push(1)
    console.log(data)
    setData(data)}

  }> </button></tr>
}

class App extends Component {
  render() {
    return (
      <div className="container">
        <Hi data='HI GUY'/>
      </div>
    )
  }
}


export default App;
