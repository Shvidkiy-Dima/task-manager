import React, { Component } from 'react'


const TableHeader = (props) => {
  return (
    <td>
        <h1>{props.data_prop}</h1>
    <button onClick={() => props.fun()}> Delete</button>
    </td>
  )
}

class Table extends Component {

  state  = {data: ['1','3']}

  render() {

    let test = () => {
      this.state.data.push('1')
      this.setState([1])
      console.log(this.state)
    }



    return (
      <table>

          <tr>
            <th><TableHeader data_prop={this.state.data} fun={test} /></th>
            <th>Job</th>
          </tr>
      </table>
    )
  }
}

export default Table
