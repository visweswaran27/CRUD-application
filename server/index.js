const express = require("express");
const cors = require("cors");
const fs = require("fs");
let users = require("./sample.json");

const app = express();

app.use(express.json());

const port = 8000;

app.use(
  cors()
);

app.get("/users", (req, res) => {
  res.json(users);
});

app.delete("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let filteredUsers = users.filter((user) => user.id !== id);

  fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
    users = filteredUsers;
    res.json(filteredUsers);
  });
});
 
app.post("/users", (req, res) => {
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    return res.status(400).json({ message: "All Fields Required" });
  }
  let id = Date.now();
  users.push({ id, name, age, city });
  fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add user" });
    }
    return res.json({ message: "User Detail added successfully!" });
  });
});

app.patch("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let { name, age, city } = req.body;
  if (!name && !age && !city) {
    return res.status(400).json({ message: "All Fields Required" });
  }
  let index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = { ...users[index], name, age, city };

  fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update user" });
    }
    return res.json({ message: "User Detail Updated successfully!" });
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
