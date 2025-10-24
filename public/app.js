// Fetch and display product cards on the home page
async function start() {
  try {
    const res = await fetch("/products.json");
    if (!res.ok) throw new Error("Failed to load products");
    const products = await res.json();
    renderProductsGrid(products);
  } catch (err) {
    console.error("⚠ Failed to load products:", err);
    const container = document.getElementById("productList");
    if (container) container.innerHTML = `<p>Failed to load products. Please refresh.</p>`;
  }
}

// Render product grid
function renderProductsGrid(products) {
  const container = document.getElementById("productList");
  if (!container) return;
  container.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <a href="product.html?id=${encodeURIComponent(p.id)}" style="text-decoration:none;color:inherit;">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
      </a>
      <p class="desc">${p.description || ""}</p>
      <div class="price-row">
       <div class="price">₹${p.variants && p.variants.length > 0 ? p.variants[0].price : ''}</div>
      </div>
      <div class="card-actions">
        <button class="btn-primary view-btn" data-id="${p.id}">View</button>
      </div>
    `;
    container.appendChild(card);
  });

  // “View” and “Add” button actions
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    });
  });

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      alert(`✅ ${id} added to your cart! (cart system coming soon)`);
    });
  });
}

start();