import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import "./ChatPage.css";
import { app } from "./firebase";
import { getAuth, signOut } from "firebase/auth";

const socket = io("https://talknest-2.onrender.com"); // backend URL
const auth = getAuth(app);

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const chatEndRef = useRef(null);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("detail");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Register socket user
  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user._id);
    }
  }, [user]);

  // Fetch receiver details
  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await fetch(`https://talknest-2.onrender.comChats/${id}`);
        const data = await res.json();
        setReceiver(data);
      } catch (err) {
        console.error("Error fetching receiver:", err);
      }
    };
    fetchReceiver();
  }, [id]);

  // Receive messages
  useEffect(() => {
    socket.on("receive_private", (data) => {
      setMessages((prev) => [
        ...prev,
        { senderId: data.senderId, text: data.message },
      ]);
    });
    return () => {
      socket.off("receive_private");
    };
  }, []);

  // Scroll down on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && user?._id) {
      socket.emit("send_private", {
        senderId: user._id,
        receiverId: id,
        message: input,
      });
      setMessages((prev) => [...prev, { senderId: user._id, text: input }]);
      setInput("");
      setShowEmoji(false); // close emoji picker after sending
    }
  };

  // Emoji click
  const onEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
  };

  // Logout
  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("detail");
    navigate("/");
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="userprofile">
          <img src={receiver.image} className="profile-img"></img>
          <h4>{receiver?.Username}</h4>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </header>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.senderId === user?._id ? "message own" : "message"}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <button
          type="button"
          className="emoji-btn"
          onClick={() => setShowEmoji((prev) => !prev)} // toggle on/off
        >
          😀
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="send-btn">
          ➤
        </button>
      </form>

      {showEmoji && (
        <div className="emoji-picker">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
}

