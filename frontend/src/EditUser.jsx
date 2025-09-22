import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditUser.css";
import axios from "axios";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const url = localStorage.getItem("url");
  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = {
      Username: name,
      email: email,
      image: imageUrl,
      About: about,
    };
    try {
      const res = await fetch(`https://talknest-2.onrender.com/Edituser/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      console.log("Updated user:", data);
      navigate("/users"); // redirect after success
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };
  const putImage = async () => {
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

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>
      <form className="profile-form" onSubmit={handleUpdate}>
        <img src={url} className="profile-img"></img>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={url.Username}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={url.email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label>About</label>
        <textarea
          name="About"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Write something about yourself"
        />

        <label>Upload File</label>
        <input
          type="file"
          name="image"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (
          <button type="button" className="img-btn" onClick={putImage}>
            Change image
          </button>
        )}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditUser;

