// PRODUCTS (in PHPeso)
const products = [
  { id: 1, size: "PEEWEE", desc: "tiny but mighty", price: 75, tag: "just laid" },
  { id: 2, size: "SMALL", desc: "delicate energy", price: 80, tag: "farm fresh" },
  { id: 3, size: "MEDIUM", desc: "the people's champ", price: 85, tag: "grade A" },
  { id: 4, size: "LARGE", desc: "baker's bestie", price: 92, tag: "golden yolk" },
  { id: 5, size: "EXTRA LARGE", desc: "hearty boi", price: 100, tag: "extra protein" },
  { id: 6, size: "JUMBO", desc: "absolute unit", price: 115, tag: "whopper" }
];

let cart = [];

function loadCart() {
  const saved = localStorage.getItem("bartscart");
  if (saved) cart = JSON.parse(saved);
  updateAllUI();
}
function saveCart() { localStorage.setItem("bartscart", JSON.stringify(cart)); }

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  updateAllUI();
  showToast(`added ${product.size} eggs! sulit na sulit 'to pre.`);
}

function updateQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  const newQty = cart[idx].qty + delta;
  if (newQty <= 0) cart.splice(idx, 1);
  else cart[idx].qty = newQty;
  saveCart();
  updateAllUI();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateAllUI();
  showToast(`tinanggal mo? sayang naman. balik ka ha.`);
}

function getTotal() { return cart.reduce((sum, i) => sum + (i.price * i.qty), 0); }

function updateAllUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#mobileCartBadge, #desktopCartBadge').forEach(el => {
    if (el) el.textContent = totalItems;
  });

  const cartContainer = document.getElementById('cartItemsList');
  const totalSpan = document.getElementById('cartTotal');
  if (cartContainer) {
    if (cart.length === 0) {
      cartContainer.innerHTML = '<div class="empty-cart">🐔 walang laman. bili na ng itlog, mura lang!</div>';
    } else {
      cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div><strong>${item.size} EGGS</strong><br>₱${item.price}/dozen x${item.qty}</div>
          <div class="cart-item-actions">
            <button onclick="updateQty(${item.id}, -1)">-</button>
            <span style="min-width:24px;text-align:center">${item.qty}</span>
            <button onclick="updateQty(${item.id}, 1)">+</button>
            <button onclick="removeItem(${item.id})">🗑️</button>
          </div>
        </div>
      `).join('');
    }
  }
  if (totalSpan) totalSpan.textContent = `₱${getTotal().toFixed(2)}`;

  const checkoutContainer = document.getElementById('checkoutItemsList');
  const checkoutTotal = document.getElementById('checkoutTotal');
  if (checkoutContainer) {
    if (cart.length === 0) {
      checkoutContainer.innerHTML = '<div class="empty-cart">🐔 wala pa. bumalik ka sa page para bumili.</div>';
      if (checkoutTotal) checkoutTotal.textContent = '₱0.00';
    } else {
      checkoutContainer.innerHTML = cart.map(item => `
        <div class="checkout-item"><span>${item.size} EGGS x${item.qty}</span><span>₱${(item.price * item.qty).toFixed(2)}</span></div>
      `).join('');
      if (checkoutTotal) checkoutTotal.textContent = `₱${getTotal().toFixed(2)}`;
    }
  }
}

function renderProducts() {
  const grid = document.getElementById('eggGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="egg-card">
      <div class="egg-graphic" loading="lazy">${p.size === 'JUMBO' ? '🥚✨' : '🥚'}</div>
      <div class="egg-info">
        <div class="egg-size">${p.size}</div>
        <div class="fresh-tag">🌱 ${p.tag}</div>
        <div class="egg-price">₱${p.price} <small>/dozen</small></div>
        <button class="add-btn" onclick="addToCart({id:${p.id}, size:'${p.size}', price:${p.price}})"><i class="fas fa-cart-plus"></i> add to basket</button>
      </div>
    </div>
  `).join('');
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'side-confirmation';
  t.innerHTML = `🥚 ${msg} 🥚`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function initCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const triggers = document.querySelectorAll('.cart-trigger');
  const closeBtn = document.getElementById('closeCartBtn');
  const overlay = document.getElementById('cartOverlay');
  triggers.forEach(t => { if(t) t.addEventListener('click', (e) => { e.preventDefault(); if(drawer) drawer.classList.add('open'); }); });
  if(closeBtn) closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
  if(overlay) overlay.addEventListener('click', () => drawer.classList.remove('open'));
}

function initDarkMode() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('bartstheme');
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    if (current === 'dark') {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('bartstheme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('bartstheme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('contactSuccess');
      if(success) success.style.display = 'block';
      form.reset();
      setTimeout(() => { if(success) success.style.display = 'none'; }, 3000);
    });
  }
}

function setupPurchaseForm() {
  const form = document.getElementById('purchaseForm');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('purchaseSuccess');
      if(success) success.style.display = 'block';
      cart = [];
      saveCart();
      updateAllUI();
      form.reset();
      setTimeout(() => {
        if(success) success.style.display = 'none';
        window.location.href = 'index.html';
      }, 3000);
    });
  }
}

const dadJokes = [
  "Why did the egg hide? It was a little chicken!",
  "Anong sabi ng itlog sa manok? 'Ma, ready na ako!'",
  "What do you call a fake noodle? An impasta.",
  "Bakit lumangoy ang itlog? Kasi gusto maging hard-boiled!",
  "How do eggs stay fit? They do egg-ercise!",
  "Why don't eggs tell jokes? They'd crack each other up!"
];

function updateDadJoke() {
  const jokeEl = document.getElementById('dadJoke');
  if(jokeEl) jokeEl.textContent = dadJokes[Math.floor(Math.random() * dadJokes.length)];
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  loadCart();
  initCartDrawer();
  initDarkMode();
  setupContactForm();
  setupPurchaseForm();
  updateDadJoke();
  setInterval(updateDadJoke, 10000);
});