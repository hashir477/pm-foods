console.log("✅ Cart.js is loaded successfully!");
function loadCart() {
  const cartContainer = document.getElementById("cartContainer");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
    return;
  }

  let totalAmount = 0;
  cartContainer.innerHTML = `
    <div class="cart-items">
      ${cart
        .map((item, index) => {
          totalAmount += item.total;
          return `
          <div class="cart-item">
            <div class="cart-left">
              <img src="${item.image || 'images/default.jpg'}" alt="${item.name}" class="cart-img">
            </div>
            <div class="cart-info">
              <h3>${item.name}</h3>
              <p>${item.size}</p>
              <p>₹${item.price} × ${item.quantity}</p>
              <strong>₹${item.total}</strong>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">🗑</button>
          </div>
        `;
        })
        .join("")}
    </div>
    <div class="cart-summary">
      <h2>Total: ₹${totalAmount}</h2>
    </div>
  `;
}

// 🗑 Remove item from cart
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart(); // refresh cart
}

// 🛍 Place Order Button — Open Popup
document.getElementById("placeOrder").addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  document.getElementById("orderPopup").classList.remove("hidden");
});

// 🧾 Popup Submit & Cancel Logic
document.getElementById("cancelPopup").addEventListener("click", () => {
  document.getElementById("orderPopup").classList.add("hidden");
});

document.getElementById("submitDetails").addEventListener("click", () => {
  const name = document.getElementById("custName").value.trim();
  const city = document.getElementById("custCity").value.trim();
  const pincode = document.getElementById("custPincode").value.trim();
  const place = document.getElementById("custPlace").value.trim();
  const state = document.getElementById("custState").value.trim();

  if (!name || !city || !pincode || !place || !state) {
    alert("Please fill all fields before proceeding.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const message = cart
    .map(
      (item) =>
        `${item.name} (${item.size}) × ${item.quantity} = ₹${item.total}`
    )
    .join("%0A");

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  const userDetails = `👤 *Name:* ${name}%0A🏙 *City:* ${city}%0A📍 *Place:* ${place}%0A📮 *Pincode:* ${pincode}%0A🌐 *State:* ${state}`;
  const whatsappMessage = `*🛒 PM Foods Order*%0A%0A${message}%0A%0A💰 *Total:* ₹${total}%0A%0A${userDetails}`;

  const phone = "919481086383"; // Your WhatsApp number
  window.open(`https://wa.me/${phone}?text=${whatsappMessage}`, "_blank");
  // 🧹 Clear the cart after order is placed
localStorage.removeItem("cart");

// Update the cart display
const cartItems = document.getElementById("cartItems");
if (cartItems) {
  cartItems.innerHTML = "<p>Your cart is empty 🛒</p>";
}

// Reset the total
const cartTotal = document.getElementById("cartTotal");
if (cartTotal) {
  cartTotal.textContent = "0";
}

// Reset floating cart count
const cartCount = document.getElementById("cartCount");
if (cartCount) cartCount.textContent = "0";
setTimeout(() => {
  window.location.href = "index.html";
}, 2000);

  // Hide popup after submit
  document.getElementById("orderPopup").classList.add("hidden");
});
loadCart();