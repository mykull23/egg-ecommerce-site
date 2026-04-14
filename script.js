// ---------- JavaScript (separate file) ----------
// Product catalog: all egg sizes, fresh, incredible prices
const products = [
  { id: 1, size: "Peewee", desc: "Tiny but mighty, perfect for petite bites", price: 4.29, unit: "dozen", icon: "🥚", freshTag: "just laid" },
  { id: 2, size: "Small", desc: "Delicate & ideal for poaching", price: 4.49, unit: "dozen", icon: "🥚", freshTag: "farm fresh" },
  { id: 3, size: "Medium", desc: "All-rounder, fluffy scramble", price: 4.79, unit: "dozen", icon: "🥚", freshTag: "grade A" },
  { id: 4, size: "Large", desc: "The classic baker's choice", price: 5.19, unit: "dozen", icon: "🥚", freshTag: "golden yolk" },
  { id: 5, size: "Extra Large", desc: "Hearty & satisfying", price: 5.59, unit: "dozen", icon: "🥚", freshTag: "extra protein" },
  { id: 6, size: "Jumbo", desc: "Monster eggs, double yolk potential", price: 6.29, unit: "dozen", icon: "🥚", freshTag: "whopper!" }
];

// Cart state
let cart = [];

// Helper: load cart from localStorage
function loadCart() {
  const saved = localStorage.getItem("henHarvestCart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch(e) { cart = []; }
  } else {
    cart = [];
  }
  updateCartUI();
}

// Save cart to localStorage
function persistCart() {
  localStorage.setItem("henHarvestCart", JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  persistCart();
  updateCartUI();
  animateCartIcon();
}

// Update quantity
function updateQuantity(id, delta) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    const newQty = cart[index].quantity + delta;
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = newQty;
    }
    persistCart();
    updateCartUI();
  }
}

// Remove item completely
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  persistCart();
  updateCartUI();
}

// compute total price
function getTotalPrice() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// update cart sidebar + top cart count + total
function updateCartUI() {
  const cartCountSpan = document.getElementById('cartItemCount');
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  if (cartCountSpan) cartCountSpan.innerText = totalItems;

  const cartContainer = document.getElementById('cartItemsList');
  const totalSpan = document.getElementById('cartTotalDisplay');
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-egg"></i> No eggs yet! Choose your size above.</div>`;
    if (totalSpan) totalSpan.innerText = `Total: $0.00`;
    return;
  }

  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-details">
          <p><strong>${item.size}</strong> eggs (dozen)</p>
          <small>$${item.price.toFixed(2)} each</small>
          <div>Qty: ${item.quantity}</div>
        </div>
        <div class="cart-item-actions">
          <button class="cart-inc" data-id="${item.id}">+</button>
          <button class="cart-dec" data-id="${item.id}">-</button>
          <button class="cart-remove" data-id="${item.id}" style="background:#e8cfb4; margin-left:6px;"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;
  });
  cartContainer.innerHTML = html;
  if (totalSpan) totalSpan.innerText = `Total: $${getTotalPrice().toFixed(2)}`;

  // attach event listeners to dynamic cart buttons
  document.querySelectorAll('.cart-inc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      updateQuantity(id, 1);
    });
  });
  document.querySelectorAll('.cart-dec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      updateQuantity(id, -1);
    });
  });
  document.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      removeItem(id);
    });
  });
}

// simple cart pop animation on add
function animateCartIcon() {
  const cartIconDiv = document.getElementById('cartIconBtn');
  if (cartIconDiv) {
    cartIconDiv.style.transform = 'scale(1.05)';
    setTimeout(() => { if(cartIconDiv) cartIconDiv.style.transform = ''; }, 200);
  }
  // notification
  const notif = document.createElement('div');
  notif.innerText = '✨ egg added ✨';
  notif.style.position = 'fixed';
  notif.style.bottom = '20px';
  notif.style.right = '20px';
  notif.style.background = '#b86f2c';
  notif.style.color = 'white';
  notif.style.padding = '10px 20px';
  notif.style.borderRadius = '40px';
  notif.style.zIndex = '999';
  notif.style.fontWeight = 'bold';
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 1200);
}

// Render product grid
function renderProducts() {
  const grid = document.getElementById('eggGrid');
  if (!grid) return;
  grid.innerHTML = '';
  products.forEach(egg => {
    const card = document.createElement('div');
    card.className = 'egg-card';
    let graphicIcon = '🥚';
    if (egg.size === 'Jumbo') graphicIcon = '🥚✨';
    if (egg.size === 'Peewee') graphicIcon = '🥚🌸';
    card.innerHTML = `
      <div class="egg-img-graphic">
        <span style="font-size: 3.8rem;">${graphicIcon}</span>
        <div style="font-size: 1.8rem; margin-top: 6px;">🐓</div>
      </div>
      <div class="egg-info">
        <div class="egg-size">${egg.size}</div>
        <div class="egg-desc">${egg.desc}</div>
        <div class="fresh-badge"><i class="fas fa-seedling"></i> ${egg.freshTag} • 100% fresh</div>
        <div class="price">$${egg.price.toFixed(2)} <small>/ dozen</small></div>
        <button class="add-btn" data-id="${egg.id}"><i class="fas fa-cart-plus"></i> Add to basket</button>
      </div>
    `;
    grid.appendChild(card);
    const btn = card.querySelector('.add-btn');
    btn.addEventListener('click', () => {
      const productToAdd = {
        id: egg.id,
        size: egg.size,
        price: egg.price,
        desc: egg.desc,
        freshTag: egg.freshTag,
        unit: 'dozen'
      };
      addToCart(productToAdd);
    });
  });
}

// Cart sidebar toggle logic
function initCartSidebar() {
  const sidebar = document.getElementById('cartSidebar');
  const openBtn = document.getElementById('cartIconBtn');
  const closeBtn = document.getElementById('closeCartBtn');

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.add('open');
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }
  // optional close on outside click
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !openBtn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// checkout alert & reset (mom & pop style order)
function setupCheckout() {
  const checkoutButton = document.getElementById('checkoutBtn');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("🐔 Oh no! Your basket is empty — grab some fresh eggs first!");
        return;
      }
      const total = getTotalPrice().toFixed(2);
      const itemSummary = cart.map(i => `${i.quantity} doz ${i.size}`).join(', ');
      alert(`🍳 Order placed! 🍳\n\nThank you for supporting our family farm!\nItems: ${itemSummary}\nTotal: $${total}\n\nWe'll deliver fresh eggs within 24h. 🚜🐣\n( Mom & Pop promise: second-to-none prices & freshness )`);
      // clear cart after "order"
      cart = [];
      persistCart();
      updateCartUI();
      // close sidebar if open
      const sidebar = document.getElementById('cartSidebar');
      if(sidebar) sidebar.classList.remove('open');
    });
  }
}

// Initialize everything
function init() {
  renderProducts();
  loadCart();           // loads from localStorage, updates UI and cart list
  initCartSidebar();
  setupCheckout();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}