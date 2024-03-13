import React, { Component } from 'react'
import MeterMapForm from './MeterMapForm'

class MeterTable extends Component{
   /* constructor(props){
        super(props);
    } */
    
	  state = {
        meters: [],
        cur_meter: 1,
        cur_meter_data: [],
        display_range_start: 0,
        display_range_end: 24,
        data: [],
    }

    getData = async () => {
        const api_call = await fetch(this.props.server+"getMeterList").catch()
        const ret_data1 = await api_call.json();
        var meter_number = 1;
        var data = {meter_id: meter_number}
        const api_call2 = await fetch(this.props.server+"getMeterData", {
          method: 'post',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        const ret_data2 = await api_call2.json();
        this.setState({
            meters: ret_data1,
            cur_meter: 1,
            cur_meter_data: ret_data2
        })
        this.props.setParentState(ret_data1)
    }
    
    // ECD310 New Code
    getPythonData = async() => {
        const pythonCall = await fetch("http://127.0.0.1:8001").catch()
        const pythonRet = await pythonCall.json();
        this.setState({
            data: pythonRet,
        });
    }
    
    getMeterData = async (e) => {
      var meter_number = parseInt(e.target.name.substring(e.target.name.indexOf(' '))) + 1;
      var data = {meter_id: meter_number}
      const api_call = await fetch(this.props.server+"getMeterData", {
        method: 'post',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const ret_data = await api_call.json();
      this.setState({
        meters: this.state.meters,
        cur_meter: meter_number,
        cur_meter_data: ret_data
      })
      this.props.setParentState({
        meters: this.state.meters
      })
      console.log(ret_data);
    }
    
    //ECD310 New code
    componentDidMount(){
      this.getData();
      this.getPythonData();
      setInterval(this.getPythonData, 1000);
    }
    
    render(){
        return (
	    <div>
                <table>
                  <thead>
                    <tr>
                      <th>TimeStamp</th>
                      <th>RMS Voltage (V)</th>
                      <th>RMS Current (A)</th>
                      <th>Real Power (W)</th>
                      <th>Reactive Power (VAR)</th>
                      <th>Apparent Power (VA)</th>
                      <th>Power Factor</th>
                      <th>Estimated Hourly Cost ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this.state.data[0]}</td>
                      <td>{this.state.data[1]}</td>
                      <td>{this.state.data[2]}</td>
                      <td>{this.state.data[3]}</td>
                      <td>{this.state.data[4]}</td>
                      <td>{this.state.data[5]}</td>
                      <td>{this.state.data[6]}</td>
                      <td>{this.state.data[7]}</td>
                   </tr>
                </tbody>
              </table>
          </div>
            
        );
    }
}

export default MeterTable;
