import React, {Component} from 'react';
//import {Button} from "react-bootstrap"
import { Joystick } from 'react-joystick-component';
import Config from "../scripts/config";
import {Row,Col, Container, Button} from "react-bootstrap";
import * as Three from "three";

class RobotState extends Component {
  state = {
    ros: null,
    x:0,
    y:0,
    orientation:0,
    linear_velocity:0,
    angular_velocity: 0,
  };
  constructor(){
    super();
    this.init_connection();
  }
  // create a pose subscriber
  getRobotState(){
  var pose_subscriber = new window.ROSLIB.Topic({
    ros: this.state.ros,
    name: "/amcl_pose",
    messageType: "geometry_msgs/PoseWithCovarianceStamped",
  });
  // subscriber callback function
  pose_subscriber.subscribe((message) => {
    this.setState({x: message.pose.pose.position.x.toFixed(2)});
    this.setState({y: message.pose.pose.position.y.toFixed(2)});
    this.setState({
      orientation: this.getOrientationFromQuanternion(message.pose.pose.orientation).toFixed(2)});
  });
  // create an odm (velocity) subscribe
  var velocity_sub = new window.ROSLIB.Topic({
    ros: this.state.ros,
    name: "/odom",
    messageType: "nav_msgs/Odometry",
  });
  velocity_sub.subscribe((message) => {
    this.setState({linear_velocity: message.twist.twist.linear.x.toFixed(2)});
    this.setState({angular_velocity: message.twist.twist.angular.z.toFixed(2)});
  });
  }

  getOrientationFromQuanternion(ros_orientation_quaternion){
      var q = new Three.Quaternion(ros_orientation_quaternion.x,
                ros_orientation_quaternion.y,
                ros_orientation_quaternion.z,
                ros_orientation_quaternion.w);
      var rpy = new Three.Euler().setFromQuaternion(q);
      return (rpy["_z"]*180 / 3.14);
  }


  init_connection(){
    this.state.ros = new window.ROSLIB.Ros();
    console.log(this.state.ros);

    this.state.ros.on("connection",()=>{
      console.log("connection is established In the Tele component!");
      this.setState({connected: true});
    });
    this.state.ros.on("close",()=>{
      console.log("connection is closed In the Tele component!");
      this.setState({connected: false});
      // try to reconnecet every 3 sec
      setTimeout(() => {
      try{
        this.state.ros.connect("ws://"+Config.ROSBRIDGE_SERVER_IP+":"+Config.RSOBRIDGE_PORT+"");
      }catch(error){
        console.log("Connection problem");
      }
    }, Config.CONNECTION_TIMER);
    });

  try{
    this.state.ros.connect("ws://"+Config.ROSBRIDGE_SERVER_IP+":"+Config.RSOBRIDGE_PORT+"");
  }catch(error){
    console.log("Connection problem");
  }
  }

  componentDidMount(){
    this.getRobotState()
  }



  render (){
    return(
      <div>
        <Row>
          <Col>
            <h4 className = "mt-4">Position</h4>
            <p className="mt-0">x:{this.state.x}</p>
            <p className="mt-0">y:{this.state.y}</p>
            <p className="mt-0">Orientation:{this.state.orientation}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4 className = "mt-4">Velocities</h4>
            <p className="mt-0">Linear:{this.state.linear_velocity}</p>
            <p className="mt-0">Angular:{this.state.angular_velocity}</p>
          </Col>
        </Row>
      </div>
  );
  }
}

export default RobotState;
