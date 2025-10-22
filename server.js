const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve products.json
app.get("/products.json", (req, res) => {
  const filePath = path.join(__dirname, "products.json");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send({ error: "products.json not found" });
  }
});

// ✅ Save order requests
app.post("/order", (req, res) => {
  const order = req.body;
  const filePath = path.join(__dirname, "orders.json");

  let orders = [];
  if (fs.existsSync(filePath)) {
    orders = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  orders.push(order);
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

  res.json({ success: true, message: "Order saved successfully!" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});