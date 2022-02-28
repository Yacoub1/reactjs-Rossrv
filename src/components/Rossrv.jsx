import React, {Component} from 'react';
import Config from "../scripts/config";
import {Row,Col, Container, Button} from "react-bootstrap";
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css'
//import { RosService } from 'ngx-roslib';

class Rossrv extends Component {
  state = {ros: null,
          speed: 10,
          force:70,
          pose:0
              };

  constructor(){
    super();
    this.init_connection();
    this.call_rossrv = this.call_rossrv.bind(this);
    this.onSpeedSliderChange = this.onSpeedSliderChange.bind(this);
    this.onPoseSliderChange = this.onPoseSliderChange.bind(this);
    this.onForceSliderChange = this.onForceSliderChange.bind(this);
    }
  log(value) {
        console.log(value); //eslint-disable-line
      }

  onAfterChange = value => {
      console.log(value); //eslint-disable-line
  };
  // create a pose subscriber
  init_connection(){
    console.log("Establish map connection");

      try{
        this.state.ros = new window.ROSLIB.Ros();
        this.state.ros.connect(
          "ws://"+Config.ROSBRIDGE_SERVER_IP+":"+Config.RSOBRIDGE_PORT+""
        );
        console.log("Rose Service Component");
      }catch(error) {
        console.log("Connection problem in ROS Service Component");
      }
    }


  onSpeedSliderChange = value => {
        this.log("Speed: ");
        this.log(this.state.speed);
        this.setState({
          speed:value,
        });
        console.log("Speed: "+this.state.speed);
      };

  onPoseSliderChange = value => {
            this.log("Pose: ");
            this.log(this.state.pose);
            this.setState({
              pose: value,
            });
            console.log("Pose: "+this.state.pose);
            //this.call_rossrv();
          };

  onForceSliderChange = value => {
          this.log("Force: ");
          this.log(this.state.force);
          this.setState({
            force:value,
          });
          console.log("Force: "+this.state.force);
        };

  call_rossrv(){
    console.log("Button clicked")

    var robotiq_gripper = new window.ROSLIB.Service({
                          ros : this.state.ros,
                          name : '/grip_service',
                          serviceType : 'ur_robotiq_ctl/grip_service'
                          });

    var request = new window.ROSLIB.ServiceRequest({
                              force: this.state.force,
                              pose : this.state.pose,
                              speed : this.state.speed
                            });

    robotiq_gripper.callService(request, function(result) {
    console.log('Result for service call on '
      + robotiq_gripper.name
      + ': '
      + result.sum);
  });
  console.log(request);

  // var _2f140_force = new window.ROSLIB.Param({
  //   ros : this.state.ros,
  //   name : '/2f140_force'
  // });
  //
  // _2f140_force.set(this.state.force);
  // _2f140_force.get(function(value) {
  //   console.log('MAX VAL: ' + value);
  // });
  // var cmd_vel = new window.ROSLIB.Topic({
  //   ros: this.state.ros,
  //   name: '/ros_react',
  //   messageType: "std_msgs/String",
  // });
  //
  // var msg = new window.ROSLIB.Message({
  //   data: "Hello World"
  // });
  // // Publish combined mesg
  // cmd_vel.publish(msg);
}


render() {
      return (
        <Container>
          <div>
          <h3>Speed:</h3>
           <Slider
                value={this.state.speed}
                onChange={this.onSpeedSliderChange}
                onAfterChange={this.onAfterChange}
                min={30}
                max={250}
          />
          </div>
          <div>
          <h3>Pose:</h3>
          <Slider
               value={this.state.pose}
               onChange={this.onPoseSliderChange}
               onAfterChange={this.onAfterChange}
               min={0}
               max={255}
         />
         </div>
         <div>
         <h3>Force:</h3>
         <Slider
              value={this.state.force}
              onChange={this.onForceSliderChange}
              onAfterChange={this.onAfterChange}
              min={10}
              max={125}
        />
        </div>
        <div>
        <button type="button" onClick={() => this.call_rossrv()}>Request ROS SRV</button>
        </div>
      </Container>
      );
      }
}
export default Rossrv;
