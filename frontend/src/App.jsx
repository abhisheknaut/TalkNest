import React, { useState, useEffect } from "react";
import { Link, Router, Routes, Route, useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import ChatPage from "./ChatPage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "./firebase";
import UserDashboard from "./UserDashBoard";
import EditUser from "./EditUser";
// import { Router } from "express";

const auth = getAuth(app);
function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  if (user === null) {
    return (
      <div>
        <AuthPage />
      </div>
    );
  } else {
  }
  {
    return (
      <div>
        <Routes>
          <Route path="/" element={<AuthPage />}></Route>
          <Route path="/users" element={<UserDashboard />}></Route>
          <Route path="/chats/:id" element={<ChatPage />}></Route>
          <Route path="/edituser/:id" element={<EditUser />}></Route>
        </Routes>
      </div>
    );
  }
}

export default App;
