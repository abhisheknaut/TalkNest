import React, { useState, useEffect } from "react";
import "./AuthPage.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "./firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const auth = getAuth(app);

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [about, setAbout] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // firebase signup
  const createUSer = async () => {
    const value = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then(navigate("/users"));
    const response = await fetch("http://localhost:3000/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userDisplay: name }),
    });
    const userObject = await response.json();
    localStorage.setItem("detail", JSON.stringify(userObject));
    window.location.reload();
  };

  // firebase login
  const loginUser = async () => {
    await signInWithEmailAndPassword(auth, email, password).then(
      navigate("/users")
    );
    const response = await fetch("http://localhost:3000/getUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userDisplay: name }),
    });
    const userObject = await response.json();
    localStorage.setItem("detail", JSON.stringify(userObject));
    window.location.reload();
  };

  // form submit
  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!isLogin && !imageUrl) {
      alert("Please upload your profile image before signing up.");
      return;
    }
    const newuser = {
      Username: name,
      email: email,
      About: about,
      image: imageUrl,
    };
    const UserData = await fetch("http://localhost:3000/receiveUserData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newuser),
    });
    const a = await UserData.json();
    navigate("/users");
  };

  // cloudinary image upload
  const uploadImage = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "abhishek"); // replace with your preset name
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dm7wnamde/image/upload",
        formData
      );
      setImageUrl(res.data.secure_url);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
    }
  };

  // ---------- UI ----------
  if (!isMobile) {
    return (
      <div className="desktop-block">
        <h1>⚠️ This app is only for mobile devices.</h1>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h1 className="app-title">💬 ChatZone</h1>
      <div className="auth-card">
        <h2>{isLogin ? "🔑 Login" : "📝 Sign Up"}</h2>

        <form className="auth-form" onSubmit={SubmitHandler}>
          <input
            type="text"
            name="name"
            placeholder="👤 Username"
            className="input-field"
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            className="input-field"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            name="password"
            placeholder="🔒 Password"
            className="input-field"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <>
              <input
                type="file"
                className="input-field"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file && (
                <button
                  type="button"
                  onClick={uploadImage}
                  className="upload-img-btn"
                >
                  Upload Image
                </button>
              )}
              <input
                type="text"
                name="about"
                placeholder="profession"
                className="input-field"
                required
                onChange={(e) => setAbout(e.target.value)}
              />
            </>
          )}

          <button
            type="submit"
            className="auth-btn"
            onClick={isLogin ? loginUser : createUSer}
          >
            {isLogin ? "🚀 Login" : "✨ Sign Up"}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
