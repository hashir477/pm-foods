// 🛒 Function to update the floating cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

// ✅ Run once on page load
document.addEventListener("DOMContentLoaded", updateCartCount);

// ✅ Listen for real-time updates from other pages
window.addEventListener("cart-updated", updateCartCount);

// ✅ Also listen for localStorage updates (e.g., other tabs)
window.addEventListener("storage", updateCartCount);
// 💫 Animate cart icon when updated
window.addEventListener("cart-updated", () => {
  const cartIcon = document.querySelector(".floating-cart");
  if (cartIcon) {
    cartIcon.classList.remove("bounce"); // reset if already bouncing
    void cartIcon.offsetWidth; // force reflow (important!)
    cartIcon.classList.add("bounce");
  }
});