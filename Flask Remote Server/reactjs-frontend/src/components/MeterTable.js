import React, { Component } from 'react'
import MeterMapForm from './MeterMapForm'
// import Data from './data.js'

class MeterTable extends Component{
    /* constructor(props){
        super(props);
       
    }*/
	  state = {
        meters: [],
        cur_meter: 1,
        cur_meter_data: [],
        display_range_start: 0,
        display_range_end: 24,
        data: []
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
        this.props.setParentState(ret_data1);
    }
    // ECD310 New Code
    getPythonData = async() => {
        const pythonCall = await fetch("http://127.0.0.1:8001").catch()
        const pythonRet = await pythonCall.json();
        this.setState({
            data: pythonRet,
        });
    }
    addMeter = async () => {
        var data = {ip_address: "SIM 192.168.0." + this.state.meters.length + 1}
        await fetch('http://127.0.0.1:3001/addSimMeter', {
            method: 'post',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch();
        const api_call2 = await fetch(this.props.server+"getMeterList").catch()
        const ret_data = await api_call2.json();
        this.setState({
            meters: ret_data,
            cur_meter: this.state.cur_meter,
            cur_meter_data: this.state.cur_meter_data
        })
        this.props.setParentState({
          meters: ret_data
        })
    }
    // TODO!!
    addPhysicalMeter = async () => {
        var data = {ip_address: "INSERT PI IP"} // CHANGE IP to Pi's IP
        await fetch('http://127.0.0.1:3001/addPhysMeter', {
            method: 'post',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch();
        const api_call2 = await fetch(this.props.server+"getMeterList").catch()
        const ret_data = await api_call2.json();
        this.setState({
            meters: ret_data,
            cur_meter: this.state.cur_meter,
            cur_meter_data: this.state.cur_meter_data
        })
        this.props.setParentState({
          meters: ret_data
        })
    }

    deleteMeters = async () => {
        const api_call = await fetch(this.props.server+"deleteAllMeters").catch()
        await api_call.json();
        const api_call2 = await fetch(this.props.server+"getMeterList").catch()
        const ret_data = await api_call2.json();
        this.setState({
            meters: ret_data,
            cur_meter: this.state.cur_meter,
            cur_meter_data: this.state.cur_meter_data
        })
        this.props.setParentState({
          meters: ret_data
        })
    }

    toggleMeter = async (e) => {
      var meter_id = parseInt(e.target.name.substring(e.target.name.indexOf(' '))) + 1;
      var data = {meter: meter_id}
      await fetch(this.props.server+"toggleSimMeter", {
        method: 'post',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const api_call2 = await fetch(this.props.server+"getMeterList").catch()
      const ret_data = await api_call2.json();
      this.setState({
          meters: ret_data,
          cur_meter: this.state.cur_meter,
          cur_meter_data: this.state.cur_meter_data
      })
      this.props.setParentState({
        meters: ret_data
      })
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
    decreaseMeterRange = () => {
      if(this.state.display_range_start - 25 < 0){
        this.setState({
          display_range_start: 0,
          display_range_end: 24
        })
      }else{
        this.setState({
          display_range_start: this.state.display_range_start - 25,
          display_range_end: this.state.display_range_end - 25
        })
      }
    }
    increaseMeterRange = () => {
      if(this.state.display_range_start + 25 < this.state.cur_meter_data.length){
        this.setState({
          display_range_start: this.state.display_range_start + 25,
          display_range_end: this.state.display_range_end + 25
        })
      }
    }
    //ECD310 New code
    componentDidMount(){
      this.getData();
      this.getPythonData();
      setInterval(this.getPythonData, 1000);
    }
    
    render(){
        return (
            <div className = {"meterTable"}>
                <button className = {"controlButton"} onClick = {this.addMeter}>Add Simulated Meter</button>
                <button className = {"controlButton"} onClick = {this.addPhysicalMeter}>Add Physical Meter</button>
                <button className = {"controlButton"} onClick = {this.getData}>Update Data</button>
                <button className = {"controlButton"} onClick = {this.deleteMeters}>Delete Meters</button>
                <div style = {{minHeight: "2vh"}}/>
                <table>
                  <thead>
                    <tr>
                      <th>Meter ID</th>
                      <th>Meter IP</th>
                      <th>State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.meters.map((e, i) => {
                      return(<tr key = {i.toString()}>
                                <td><button name = {"meterSelectButton " + i.toString()} onClick = {this.getMeterData}>{e.id}</button></td>
                                <td>{e.meterIP}</td>
                                <td><button name = {"toggleButton " + i.toString()}onClick = {this.toggleMeter}>{e.active}</button></td>
                              </tr>
                            )
                      })
                    }
                  </tbody>
                </table>

                <div style = {{minHeight: "5vh"}}/>
                <MeterMapForm server = {this.props.server} />
                <div style = {{minHeight: "5vh"}}/>


                <h1 className = "subHeader">Meter {this.state.cur_meter}</h1>
                <span>Entries {this.state.display_range_start} - {this.state.display_range_end}</span>
                <br/>
                <button onClick = {this.decreaseMeterRange}>Previous</button>
                <button onClick = {this.increaseMeterRange}>Next</button>


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
                      {/*
                      <th>Apparent Power Avg</th>
                      <th>Voltage Min</th>
                      <th>Voltage Max</th>
                      <th>Voltage Avg</th>
                      <th>Current Min</th>
                      <th>Current Max</th>
                      <th>Current Avg</th>
                      */}
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
                      {/*
                      <td>{this.state.data[5]}</td>
                      <td>{this.state.data[6]}</td>
                      <td>{this.state.data[7]}</td>
                      <td>{this.state.data[8]}</td>
                      <td>{this.state.data[9]}</td>
                      <td>{this.state.data[10]}</td>
                      <td>{this.state.data[11]}</td>
                      <td>{this.state.data[12]}</td>
                      <td>{this.state.data[13]}</td>
                      */}
                   </tr>
                  </tbody>
                </table>
            </div>

        );
    }
}

export default MeterTable;
