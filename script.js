const products = [
  { id: 1, name: 'Городской велосипед Street 24"', price: 67000, image: 'images/street_tsb.jpg' },
  { id: 2, name: 'Горный велосипед Trail 29"', price: 42000, image: 'images/trail.jpg' },
  { id: 3, name: 'Шоссейный велосипед Road 29"', price: 2200000, image: 'images/road.jpg' },
  { id: 4, name: 'Трюковой велосипед BMX 20"', price: 52000, image: 'images/bmx.jpg' },
  { id: 5, name: 'Горный велосипед Downhill 29" и 27.5"', price: 1500000, image: 'images/downhill.jpg' },
  { id: 6, name: 'Шлем', price: 2500, image: 'images/helmet.jpeg' }
];

const STORAGE_KEY = 'bikestash-cart';
let cart = loadCart(); // { [id]: quantity }

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString('ru-RU') + ' ₽';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function renderProducts() {
  $('products').innerHTML = products.map((p) => `
    <article class="card">
      <img class="pic" src="${p.image}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>
      <p class="price">${fmt(p.price)}</p>
      <button class="btn" data-add="${p.id}">Добавить в корзину</button>
    </article>`).join('');
}

function renderCart() {
  const ids = Object.keys(cart);
  let total = 0, count = 0;

  $('cart-list').innerHTML = ids.map((id) => {
    const p = products.find((x) => x.id === Number(id));
    const qty = cart[id];
    total += p.price * qty;
    count += qty;
    return `
      <li class="cart-item">
        <span class="name">${p.name}</span>
        <span>${fmt(p.price)}</span>
        <div class="qty">
          <button data-dec="${id}" aria-label="Уменьшить">−</button>
          <span>${qty}</span>
          <button data-inc="${id}" aria-label="Увеличить">+</button>
        </div>
        <strong>${fmt(p.price * qty)}</strong>
        <button class="remove" data-remove="${id}" aria-label="Удалить">✕</button>
      </li>`;
  }).join('');

  $('cart-total').textContent = fmt(total);
  $('cart-count').textContent = count;
  $('cart-empty').hidden = ids.length > 0;
  $('checkout-btn').disabled = ids.length === 0;
  saveCart();
}

document.addEventListener('click', (e) => {
  const t = e.target;
  if (t.dataset.add) {
    cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1;
    $('order-message').hidden = true;
  } else if (t.dataset.inc) {
    cart[t.dataset.inc]++;
  } else if (t.dataset.dec) {
    if (--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec];
  } else if (t.dataset.remove) {
    delete cart[t.dataset.remove];
  } else {
    return;
  }
  renderCart();
});

const modal = $('order-modal');
$('checkout-btn').addEventListener('click', () => modal.showModal());
$('cancel-btn').addEventListener('click', () => modal.close());

$('order-form').addEventListener('submit', () => {
  cart = {};
  renderCart();
  $('order-form').reset();
  $('order-message').hidden = false;
});

renderProducts();
renderCart();
