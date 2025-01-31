import React, { useState, useEffect, useRef } from "react";
import { Button, Form, ListGroup, Row, Col } from "react-bootstrap";
import axios from "axios";
import { server_url } from "../services/serverurl";

const Chat = ({ senderType }) => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    
    // Adjusted to a more reasonable polling interval
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000); // Poll every 2 seconds instead of 10ms

    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${server_url}/get_messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await axios.post(`${server_url}/send_message`, { message, sender: senderType });
        setMessages((prev) => [...prev, { message, sender: senderType }]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const deleteChatHistory = async () => {
    if (window.confirm("Are you sure you want to delete all chat history?")) {
      try {
        await axios.delete(`${server_url}/delete_messages`);
        setMessages([]); // Clear the chat in frontend
      } catch (error) {
        console.error("Error deleting chat history:", error);
      }
    }
  };

  return (
    <div>
      <Button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          padding: "15px 20px",
          fontSize: "20px",
          backgroundColor: "#4facfe",
          color: "#fff",
          border: "none",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => setShowChat(!showChat)}
      >
        {showChat ? "✕" : "💬"}
      </Button>

      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            maxHeight: "500px",
            background: "#fff",
            borderRadius: "15px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#4facfe",
              color: "#fff",
              padding: "15px",
              borderRadius: "15px 15px 0 0",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Chat</span>
            {senderType === "admin" && (
              <Button
                variant="danger"
                size="sm"
                onClick={deleteChatHistory}
                style={{ fontSize: "12px", padding: "5px 10px" }}
              >
                🗑 Delete
              </Button>
            )}
          </div>

          <div
            style={{
              overflowY: "auto",
              padding: "15px",
              flexGrow: 1,
              height: "400px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <ListGroup>
              {messages.map((msg, index) => (
                <ListGroup.Item
                  key={index}
                  style={{
                    backgroundColor: msg.sender === senderType ? "#4facfe" : "#e0f7fa",
                    color: msg.sender === senderType ? "#fff" : "#333",
                    marginBottom: "10px",
                    borderRadius: "15px",
                    border: "none",
                    maxWidth: "80%",
                    alignSelf: msg.sender === senderType ? "flex-end" : "flex-start",
                    padding: "10px",
                  }}
                >
                  {msg.message}
                </ListGroup.Item>
              ))}
              <div ref={messagesEndRef} />
            </ListGroup>
          </div>

          <Form onSubmit={sendMessage} style={{ padding: "15px", backgroundColor: "#fff" }}>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    borderRadius: "25px",
                    border: "1px solid #ddd",
                    padding: "10px 20px",
                    fontSize: "14px",
                  }}
                />
              </Col>
              <Col xs="auto">
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    borderRadius: "50%",
                    padding: "10px 15px",
                    fontSize: "16px",
                    backgroundColor: "#4facfe",
                    border: "none",
                  }}
                >
                  ➤
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Chat;
