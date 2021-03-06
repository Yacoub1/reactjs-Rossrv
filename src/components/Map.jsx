import React, {Component} from 'react';
import Config from "../scripts/config";


class Map extends Component {
  state = {ros: null};

  constructor(){
    super();
    this.view_map = this.view_map.bind(this);
  }
  // create a pose subscriber
  init_connection(){
    console.log("Establish map connection");

      try{
        this.state.ros = new window.ROSLIB.Ros();
        this.state.ros.connect(
          "ws://"+Config.ROSBRIDGE_SERVER_IP+":"+Config.RSOBRIDGE_PORT+""
        );
        console.log("In map components");
      }catch(error) {
        console.log("Connection problem in map components");
      }
    }

 componentDidMount(){
      this.init_connection();
      this.view_map();
    }

 view_map(){
   var viewer = new window.ROS2D.Viewer({
     divID: "nav_div",
     width: 640,
     height: 480
   });
   var navClient = new window.NAV2D.OccupancyGridClientNav({
      ros: this.state.ros,
      rootObject: viewer.scene,
      viewer: viewer,
      serverName: "/move_base",
      withOrientation: true
   });


}

  render (){
    return(
      <div>
        <div id="nav_div">viewer</div>
      </div>
      );
  }
}
export default Map;
