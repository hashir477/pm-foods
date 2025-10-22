console.log("App.js loaded");

let cart = {};

function updateTotal() {
  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  document.getElementById("cartTotal").innerText = `₹${total}`;
}

// Create product cards dynamically
async function start() {
  try {
    const response = await fetch("/products.json");
    const products = await response.json();
    const container = document.getElementById("products");

    if (!products || !products.length) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }

    container.innerHTML = "";
    products.forEach((p) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}" width="200" height="200" />
        <p><b>${p.name}</b></p>
        <p>${p.description}</p>
        <div class="qty-controls">
          <button class="minus">-</button>
          <span class="qty">0</span>
          <button class="plus">+</button>
        </div>
        <p>₹${p.price}</p>
      `;

      const qtySpan = div.querySelector(".qty");
      const plus = div.querySelector(".plus");
      const minus = div.querySelector(".minus");

      cart[p.id] = { ...p, qty: 0 };

      plus.addEventListener("click", () => {
        cart[p.id].qty++;
        qtySpan.innerText = cart[p.id].qty;
        updateTotal();
      });

      minus.addEventListener("click", () => {
        if (cart[p.id].qty > 0) {
          cart[p.id].qty--;
          qtySpan.innerText = cart[p.id].qty;
          updateTotal();
        }
      });

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    document.getElementById("products").innerHTML =
      "<p>Failed to load products (check server).</p>";
  }
}

// 🟢 Handle place order button click
document.getElementById("placeOrder").addEventListener("click", async () => {
  const customerName = document.getElementById("customerName").value.trim();
  if (!customerName) {
    alert("⚠ Please enter your name before placing the order.");
    return;
  }
  const selectedItems = Object.values(cart).filter((item) => item.qty > 0);

  if (selectedItems.length === 0) {
    alert("Please select at least one product before placing an order.");
    return;
  }

  const total = document.getElementById("cartTotal").innerText.replace("₹", "");

  // ✅ Create WhatsApp order message
  let message = "Hello PM Foods! 👋%0AI’d like to order:%0A%0A";
  selectedItems.forEach(
    (i) =>
      (message += `• ${i.name} × ${i.qty} = ₹${i.price * i.qty}%0A`)
  );
  message += `%0ATotal: ₹${total}%0AThank you! 🙏`;

  // 🟢 Your PM Foods WhatsApp number (change this to your real one)
  const pmFoodsNumber = "919481086383"; // example: 919876543210
  const whatsappURL = `https://wa.me/${pmFoodsNumber}?text=${message}`;

  // 🚀 Open WhatsApp
  window.open(whatsappURL, "_blank");

  // 💾 Save order locally
  const order = {
    items: selectedItems.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
    })),
    total: total,
    time: new Date().toLocaleString(),
  };

  try {
    const res = await fetch("/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ Order sent to PM Foods via WhatsApp!");
    } else {
      alert("⚠ Something went wrong while saving the order.");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    alert("❌ Failed to connect to server.");
  }
});

start();