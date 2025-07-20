// Ürünler localStorage'dan okunur, yoksa başlangıç örnekleri
let products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "Dana Eti", price: 150, desc: "Taze dana eti", image: "images/et1.jpg" },
  { id: 2, name: "Kuzu Eti", price: 180, desc: "Yerli kuzu eti", image: "images/et2.jpg" },
  { id: 3, name: "Tavuk Göğsü", price: 90, desc: "Protein deposu tavuk göğsü", image: "images/et3.jpg" },
  { id: 4, name: "Hindi Eti", price: 110, desc: "Sağlıklı hindi eti", image: "images/et4.jpg" },
  { id: 5, name: "Et Sucuk", price: 120, desc: "Katkısız et sucuk", image: "images/et5.jpg" },
];

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function loadProducts() {
  products = JSON.parse(localStorage.getItem("products")) || products;
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <p><strong>${p.price} TL</strong></p>
      <button onclick="addToCart(${p.id})">Sepete Ekle</button>
    `;
    container.appendChild(div);
  });
}

function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) {
    found.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
  updateCartCount();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  updateCartCount();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  renderCart();
  updateCartCount();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  
  let total = 0;
  
  cart.forEach(ci => {
    const product = products.find(p => p.id === ci.id);
    if (!product) return;
    const itemTotal = product.price * ci.qty;
    total += itemTotal;
    
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <div class="cart-item-name">${product.name}</div>
        <div>Fiyat: ${product.price} TL</div>
      </div>
      <div class="qty-controls">
        <button onclick="updateQty(${product.id}, -1)">-</button>
        <span>${ci.qty}</span>
        <button onclick="updateQty(${product.id}, 1)">+</button>
      </div>
      <button onclick="removeFromCart(${product.id})" style="background:red; border:none; color:#fff; border-radius:4px; cursor:pointer;">Sil</button>
    `;
    container.appendChild(div);
  });
  
  document.getElementById("cart-total").textContent = total + " TL";
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = count;
}

// Sepet aç/kapa butonları
document.getElementById("cart-toggle").addEventListener("click", () => {
  const cartEl = document.getElementById("cart");
  cartEl.classList.toggle("hidden");
});

document.getElementById("cart-close").addEventListener("click", () => {
  const cartEl = document.getElementById("cart");
  cartEl.classList.add("hidden");
});

// Sayfa yüklendiğinde
window.onload = () => {
  loadProducts();
  renderProducts();
  renderCart();
  updateCartCount();
};