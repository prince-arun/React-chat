import React from "react";
import Button from "react-bootstrap/Button";
import Attachment from "../svg/Attachment";
import Spinner from "react-bootstrap/Spinner";

const MessageForm = ({ handleSubmit, text, setText, setImg, isLoading }) => {
  return (
    <div className="msg_box">
      <form className="message_form" onSubmit={handleSubmit}>
        {/* <label htmlFor="img">
          <Attachment />
        </label> */}
        {isLoading ? (
          <Spinner
            animation="border"
            variant="primary"
            size="sm" // You can adjust the size as needed
          />
        ) : (
          <label htmlFor="img">
            <Attachment />
          </label>
        )}
        <input
          onChange={(e) => setImg(e.target.files[0])}
          type="file"
          id="img"
          accept="image/*"
          style={{ display: "none" }}
        />
        <div className="m_input">
          <input
            type="text"
            placeholder="Enter message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <Button
            type="submit"
            variant="outline-info"
            className="px-3 py-2 mb-2"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
