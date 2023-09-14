import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import chatOne from "./assets/chat-img-1.png";
import chatTwo from "./assets/chat-img-2.png";

const Hero = () => {
  return (
    <div className="hero">
      <Row>
        <Col>
          <div className="box">
            <h1>Speak Freely</h1>
            <p>
              Say "hello" to a different messaging <br /> experience. An
              unexpected focus on privacy, <br /> combined with all of the
              features you expect.
            </p>
          </div>
        </Col>
        <Col>
          <Row>
            <Col>
              <img src={chatOne} alt="chat hero image" width={300} />
            </Col>
            <Col>
              <img src={chatTwo} alt="chat hero image" width={300} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Hero;
