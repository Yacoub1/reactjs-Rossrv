import React, {Component} from 'react';
import Conection from './Conection'
import Rossrv from './Rossrv'
import Teleoperation from './Teleoperation'
import {Row,Col, Container, Button} from "react-bootstrap";
class Home extends Component {
  state = {
    //counter: 1,
  };

  render (){
    return(
      <div>
      <Container>
      <h1 className="text-center mt-3">Robot Control Page</h1>
      <Row>
        <Col>
            <Conection></Conection>
        </Col>
      </Row>

      <Row>
        <Col>
          <Rossrv/>
        </Col>
      </Row>

      </Container>
      </div>
  );
  }
}

export default Home;
