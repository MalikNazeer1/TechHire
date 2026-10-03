const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");
const cors = require("cors");
const { NodeVM, VM } = require("vm2");

const app = express();
const server = http.createServer(app);

const { PeerServer } = require("peer");
const peerServer = PeerServer({ port: 9000, path: "/peerjs" });

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("room:join", ({ room, user }) => {
    console.table({
      "room-id": room,
      "user-id": user.id,
      "user-name": user.name,
      "user-role": user.role,
    });

    socket.data.user = user;

    const roomMembers = io.sockets.adapter.rooms.get(room) || new Set();
    const existingUsers = [];

    for (const socketId of roomMembers) {
      if (socketId === socket.id) continue;
      const memberSocket = io.sockets.sockets.get(socketId);
      if (memberSocket?.data?.user) {
        existingUsers.push(memberSocket.data.user);
      }
    }

    socket.emit("room:participants", existingUsers);

    socket.join(room);
    socket.to(room).emit("user:joined", user);

    socket.on("disconnect", () => {
      socket.to(room).emit("user:left", user.id);
      if (user.role === "interviewer") {
        socket.to(room).emit("meeting:ended");
      }
    });

    socket.on("user:leave", (userId) => {
      socket.to(room).emit("user:left", userId);
    });

    socket.on("host:mute-user", (userId) => {
      socket.to(room).emit("host:muted-user", userId);
    });

    socket.on("host:remove-user-shared-screen", () => {
      socket.to(room).emit("host:removed-user-shared-screen");
    });

    socket.on("user:toggle-audio", (userId) => {
      socket.to(room).emit("user:toggled-audio", userId);
    });

    socket.on("user:toggle-video", (userId) => {
      socket.to(room).emit("user:toggled-video", userId);
    });

    socket.on("user:share-screen", (username) => {
      socket.to(room).emit("user:shared-screen", username);
    });

    socket.on("user:stop-share-screen", () => {
      socket.to(room).emit("user:stopped-screen-share", user.name);
    });

    socket.on("chat:post", (message) => {
      socket.to(room).emit("chat:get", message);
    });
  });
});

// ============================================
// CODE EXECUTION API ENDPOINTS
// ============================================

/**
 * Execute JavaScript code safely using vm2
 */
async function executeJavaScript(code, stdin = "", timeLimit = 5000) {
  try {
    let output = "";

    // Custom console object to capture output
    const customConsole = {
      log: (...args) => {
        output += args.map(arg => {
          if (typeof arg === 'object') {
            return JSON.stringify(arg);
          }
          return String(arg);
        }).join(" ") + "\n";
      },
      error: (...args) => {
        output += "ERROR: " + args.join(" ") + "\n";
      },
      warn: (...args) => {
        output += "WARN: " + args.join(" ") + "\n";
      },
      info: (...args) => {
        output += args.join(" ") + "\n";
      },
    };

    const vm = new NodeVM({
      console: "off",
      timeout: timeLimit,
      fixAsync: true,
      sandbox: {
        console: customConsole,
      },
    });

    const start = Date.now();
    const result = await vm.run(code);
    const time = Date.now() - start;

    // If code returns a value, include it in output
    if (result !== undefined) {
      output += String(result);
    }

    return {
      success: true,
      output: output.trim(),
      time,
      status_id: 3, // Accepted
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stderr: error.stack,
      status_id: 6, // Runtime Error
    };
  }
}

/**
 * POST /api/execute
 * Execute code in a sandboxed environment
 */
app.post("/api/execute", async (req, res) => {
  try {
    const { language = "javascript", code, stdin = "", timeLimit = 5000 } = req.body;

    if (!code || code.trim() === "") {
      return res.status(400).json({ error: "Code is required" });
    }

    if (language !== "javascript") {
      return res.status(400).json({
        error: `Language '${language}' not supported yet`,
        supported: ["javascript"],
      });
    }

    const result = await executeJavaScript(code, stdin, timeLimit);
    return res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/languages
 * Get list of supported languages
 */
app.get("/api/languages", (req, res) => {
  res.json({
    languages: ["javascript"],
    description: "Available programming languages for code execution",
  });
});

server.listen(3001, () => {
  console.log("WebSocket Server running on http://localhost:3001");
  console.log("PeerJS Server running on http://localhost:9000/peerjs");
});