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

// 📦 WhatsApp Order button
document.getElementById("placeOrder").addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const message = cart
    .map(
      (item) =>
        `${item.name} (${item.size}) - ₹${item.price} × ${item.quantity} = ₹${item.total}`
    )
    .join("%0A");

  const total = cart.reduce((sum, item) => sum + item.total, 0);
  const whatsappMessage = `🛍 *PM Foods Order*%0A%0A${message}%0A%0A*Total: ₹${total}*`;

  const phone = "919481086383"; // your WhatsApp number
  window.open(`https://wa.me/${phone}?text=${whatsappMessage}`, "_blank");
});
// --- 🧹 Clear the cart after placing the order ---

  // Remove all items from localStorage
  localStorage.removeItem("cart");

  // Reset floating cart count (if visible)
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = "0";

  // Show “empty cart” message in the cart list container
  const cartItems = document.getElementById("cartItems") || document.querySelector(".cart-items");
  if (cartItems) {
    cartItems.innerHTML = "<p style='padding:1rem;'>Your cart is empty 🛒</p>";
  }

  // Optional: reset total display
  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = "0";

  // Optional: give feedback
  alert("✅ Order placed! Cart cleared.");

loadCart();