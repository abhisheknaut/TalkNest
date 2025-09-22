const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const user = require("./model/UserModel");
const { error } = require("console");

dotenv.config();

const port = 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(express.json());

let users = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("✅ New user connected:", socket.id);

  // Register user with his MongoDB _id
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log("🟢 Active Users:", users);
  });

  // Private messaging
  socket.on("send_private", ({ senderId, receiverId, message }) => {
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_private", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
        break;
      }
    }
    console.log("❌ User disconnected:", socket.id);
  });
});


// ==================== ROUTES ====================

// Save user data
app.post("/receiveUserData", async (req, res) => {
  const data = req.body;
  console.log(data);
  try { 
     if (req.body.About) {
    await user
      .insertOne(data)
      .then(() => {
        res.json({ message: "User data received" });
      })
  }
}catch (err) {
  return res.status(500).json({ error: "Failed to save user data" });
}
});

// Get single user by Username
app.post("/getUser", async (req, res) => {
  try {
    const { userDisplay } = req.body;
    const result = await user.findOne({ Username: userDisplay });
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json(result); // contains _id
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Show all users
app.get("/ShowUser", async (req, res) => {
  try {
    const list = await user.find();
    res.json(Array.isArray(list) ? list : []);
  } catch (err) {
    console.error("Error in /ShowUser:", err);
    res.json([]);
  }
})

// Get user by ID
app.get("/Chats/:id", async (req, res) => {
  try {
    const a = await user.findById(req.params.id);
    res.json(a);
  } catch {
    res.status(404).json({ error: "User not found" });
  }
})

// ✅ New route for chat history between two users
app.get("/messages/:sender/:receiver", async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.put('/Edituser/:id',async(req,res)=>{
  const userData = req.body
  console.log(userData)
  const url= req.params.id
  console.log(url)
  try{
    await user.findByIdAndUpdate(url,{$set:userData},{new:true})
    return res.status(200).json({success: "success"})
  }catch(err){
    return res.status(500).json({success:"no wrong"})
  }
})

// ==================== SERVER ====================
server.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);


