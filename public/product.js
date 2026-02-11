// ✅ Get the product ID from the URL (example: ?id=3)
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));

async function loadProduct(){ 
  try {
    // Fetch all products from products.json
    const res = await fetch("/products.json");
    const products = await res.json();

    // Find the selected product by ID
    const product = products.find(p => p.id === productId);

    if (!product) {
      document.body.innerHTML = "<h1 style='text-align:center;'>Product not found ❌</h1>";
      return;
    }

    // Create and display product layout
    const container = document.getElementById("productDetails");
    container.innerHTML = `
      <div class="product-detail">
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <h2>${product.name}</h2>
        <p>${product.description}</p>

        <label for="variantSelect">Choose Quantity:</label>
        <select id="variantSelect">
          ${product.variants.map(v=>`<option value="${v.price}">${v.size === "1kg"?" (7% discount)" :""}</option>`).join("")})}
        </select>

        <p><strong style="color:#000000; font-size:1.2rem;">Price:</strong> ₹<span id="price" style="font-weight:700; color:#000000; font-size:1.2rem;">${product.variants[0].price}</span></p>

        <div class="quantity-controls">
          <button id="decrease">−</button>
          <span id="quantity">1</span>
          <button id="increase">+</button>
        </div>


        <p>Total: ₹<span id="total">${product.variants[0].price}</span></p>
        <button id="addToCart">Add to Cart 🛒</button>
        <br><br>
        <a href="index.html">← Back to Home</a>
      </div>
    `;

    // 👉 Setup interactive logic
    const priceDisplay = document.getElementById("price");
    const totalDisplay = document.getElementById("total");
    const quantityDisplay = document.getElementById("quantity");
    const variantSelect = document.getElementById("variantSelect");

    let currentPrice = parseInt(variantSelect.value);
    let quantity = 1;

    // Function to update total price
    function updateTotal() {
      totalDisplay.textContent = currentPrice * quantity;
    }

    // Change price when user selects another size
    variantSelect.addEventListener("change", () => {
      currentPrice = parseInt(variantSelect.value);
      priceDisplay.textContent = currentPrice;
      updateTotal();
    });

    // Increase quantity
    document.getElementById("increase").addEventListener("click", () => {
      quantity++;
      quantityDisplay.textContent = quantity;
      updateTotal();
    });

    // Decrease quantity
    document.getElementById("decrease").addEventListener("click", () => {
      if (quantity > 1) quantity--;
      quantityDisplay.textContent = quantity;
      updateTotal();
    });

// 🛒 Add to Cart button logic
  document.getElementById("addToCart").addEventListener("click", () => {
    // 🧾 Get the selected size and price
    const selectedOption = variantSelect.options[variantSelect.selectedIndex];
    const size = selectedOption.text;
    const price = parseInt(selectedOption.value);
    const total = price * quantity;

    // 🛒 Create item
    const item = {
  id: product.id,
  name: product.name,
  size: size,
  price: price,
  quantity: quantity,
  total: total,
  image: product.image // ✅ this adds the real product image
};

    // 💾 Save to localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
   localStorage.setItem("cart", JSON.stringify(cart));
updateCartCount();

// 🔔 Notify other tabs/pages that cart has been updated
window.dispatchEvent(new Event("cart-updated"));
    // ✅ Confirmation alert
    alert(`✅ Added ${quantity} × ${product.name} (${size}) to cart!`);
  });

  } catch (error) {
    console.error("Error loading product:", error);
  }
} // ✅ closes function properly


// 🧠 Call the function to load the product
loadProduct();
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cartCount").textContent = cart.length;
}
updateCartCount();
// 🛒 Make cart icon clickable to open cart.html
document.getElementById("cartIcon").addEventListener("click", () => {
  window.location.href = "cart.html";
});
