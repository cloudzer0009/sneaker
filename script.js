/* SNEAKERS Shop – products, cart, checkout, forms */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const peso = (n) => '\u20B1' + n.toLocaleString('en-PH');
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  /* ================= Product data (edit me) =================
     Add a real photo with  image: 'images/your-file.png'  */
  const COLORS = {
    white: ['#f1f1f1', '#1d5bd6'], black: ['#1a1a1a', '#b9f23c'], red: ['#d62828', '#ffffff'],
    blue: ['#1d5bd6', '#ffffff'], maroon: ['#7a2b3d', '#ffffff'], green: ['#1f7a4a', '#ffffff'], orange: ['#e8590c', '#111111'], lime: ['#b9f23c', '#111111'], grey: ['#9aa0a6', '#e8590c'], pink: ['#f06fa8', '#ffffff']
  };
  const BRANDS = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Converse'];
  const SIZES = [6, 7, 8, 9, 10, 11, 12];
  const PRODUCTS = [
    { id: 'jordan-air', name: 'Jordan Air', brand: 'Jordan', cat: 'Basketball', price: 1200, rating: 4.6, tag: 'Sale', colors: ['red'] },
    { id: 'jordan-2', name: 'Jordan 2', brand: 'Jordan', cat: 'Basketball', price: 3500, rating: 4.8, tag: 'New', colors: ['pink'] },
    { id: 'nike-air', name: 'Nike Air', brand: 'Nike', cat: 'Running', price: 10500, rating: 4.9, colors: ['orange'], image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80' },
    { id: 'nike-runner', name: 'Nike Runner Pro', brand: 'Nike', cat: 'Running', price: 4800, rating: 4.5, tag: 'New', colors: ['red'] },
    { id: 'puma-suede', name: 'Puma Suede Classic', brand: 'Puma', cat: 'Lifestyle', price: 3800, rating: 4.5, tag: 'New', colors: ['black'] },
    { id: 'puma-speedcat', name: 'Puma Speedcat', brand: 'Puma', cat: 'Lifestyle', price: 2900, rating: 4.4, tag: 'Sale', colors: ['red', 'maroon'],
      images: { red: 'images/puma-speedcat-red.jpg', maroon: 'images/puma-speedcat-maroon.jpg' } },
    { id: 'adidas-samba', name: 'Adidas Samba', brand: 'Adidas', cat: 'Lifestyle', price: 3200, rating: 4.7, colors: ['white'] },
    { id: 'adidas-gazelle', name: 'Adidas Gazelle', brand: 'Adidas', cat: 'Lifestyle', price: 4500, rating: 4.6, colors: ['green'] },
    { id: 'nb-530', name: 'New Balance 530', brand: 'New Balance', cat: 'Lifestyle', price: 4200, rating: 4.6, tag: 'New', colors: ['grey'] },
    { id: 'nb-runner', name: 'New Balance Runner', brand: 'New Balance', cat: 'Running', price: 6200, rating: 4.5, colors: ['grey'] },
    { id: 'converse-hi', name: 'Converse High', brand: 'Converse', cat: 'Lifestyle', price: 2500, rating: 4.7, colors: ['black'] }
  ];
  const find = (id) => PRODUCTS.find((p) => p.id === id);

  /* Placeholder sneaker drawing (used when a product has no photo) */
  const shoe = (c = 'white') => {
    const [a, b] = COLORS[c] || COLORS.white;
    return `<svg viewBox="0 0 400 240" role="img" aria-label="${c} sneaker">
<path d="M28 192c0-16 12-24 32-24h290c26 3 38 14 34 30-3 12-14 16-30 16H62c-22 0-34-8-34-22z" fill="#fff" stroke="#111" stroke-width="4"/>
<path d="M40 172l8-52c2-16 16-24 34-26l46-6c14-26 40-38 68-34l22 6c18 44 54 56 96 66 28 8 44 22 46 46z" fill="${a}" stroke="#111" stroke-width="4" stroke-linejoin="round"/>
<path d="M304 126c36 10 54 22 56 46h-78c10-14 16-28 22-46z" fill="${b}"/>
<path d="M128 88c14-26 40-38 68-34l14 4c-24 6-38 18-44 38z" fill="${b}"/>
<path d="M100 150c70 6 130-4 170-40" fill="none" stroke="${b}" stroke-width="12" stroke-linecap="round"/>
<path d="M200 84l30 20M184 98l30 20M168 112l30 20" stroke="#111" stroke-width="5" stroke-linecap="round"/>
<rect x="34" y="192" width="334" height="9" fill="${b}" opacity=".9"/></svg>`;
  };
  /* Photo for a product. Order of preference:
     1) images:{red:'images/x-red.jpg'}  2) image:'images/x.jpg'  3) images/<id>.jpg (.png, .webp, .jpeg also tried) */
  const EXTS = ['jpg', 'png', 'webp', 'jpeg'];
  const pic = (p, c) => {
    const explicit = (p.images && p.images[c]) || p.image;
    const src = explicit || `images/${p.id}.${EXTS[0]}`;
    return `<img src="${src}" alt="${p.name} in ${c}" data-fb="${c}"${explicit ? '' : ` data-base="images/${p.id}" data-n="0"`}>`;
  };
  /* Missing photo? Try the next file type, then show the drawn sneaker */
  document.addEventListener('error', (e) => {
    const im = e.target;
    if (im.tagName !== 'IMG' || !im.dataset.fb) return;
    if (im.dataset.base && Number(im.dataset.n) < EXTS.length - 1) {
      im.dataset.n = Number(im.dataset.n) + 1;
      im.src = `${im.dataset.base}.${EXTS[im.dataset.n]}`;
      return;
    }
    console.info('Photo not found, showing drawing instead:', im.getAttribute('src'));
    const d = document.createElement('div'); d.innerHTML = shoe(im.dataset.fb);
    im.replaceWith(d.firstElementChild);
  }, true);

  /* ================= Cart state ================= */
  const KEY = 'sneakers-cart-v2';
  let cart = store.get(KEY, []).filter((i) => i && find(i.id) && i.qty > 0);
  const count = () => cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = () => cart.reduce((s, i) => s + i.qty * find(i.id).price, 0);
  const shipping = () => (subtotal() === 0 || subtotal() >= 5000 ? 0 : 150);
  const saveCart = () => { store.set(KEY, cart); updateBadge(); };
  function updateBadge() {
    $$('.badge').forEach((b) => { b.textContent = count(); b.hidden = !count(); });
  }

  /* ================= Toast ================= */
  let toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = Object.assign(document.createElement('div'), { className: 'toast' }); toastEl.setAttribute('role', 'status'); document.body.append(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ================= Shared header / footer ================= */
  const page = document.body.dataset.page;
  const NAV = [['index', 'Home'], ['product', 'Products'], ['cart', 'Cart'], ['contact', 'Contact'], ['about', 'About']];
  $('#site-header').innerHTML = `
<div class="ticker" aria-hidden="true"><div>${'<span>Easy returns</span><span>24/7 support</span><span>Nationwide shipping</span><span>Fair prices</span>'.repeat(8)}</div></div>
<div class="site-top"><div class="wrap top">
  <a class="logo" href="index.html">Sneakers</a>
  <button class="burger" aria-label="Menu" aria-expanded="false">&#9776;</button>
  <nav class="nav" aria-label="Main">${NAV.map(([k, t]) =>
    `<a href="${k}.html"${k === page ? ' aria-current="page"' : ''}>${t}${k === 'cart' ? ' <span class="badge" hidden></span>' : ''}</a>`).join('')}</nav>
</div></div>`;
  $('#site-footer').innerHTML = `
<footer><div class="wrap fgrid">
  <div><h4>Shop by brand</h4>${BRANDS.map((b) => `<a href="product.html?brand=${encodeURIComponent(b)}">${b}</a>`).join('')}</div>
  <div><h4>Customer service</h4><a href="cart.html">Cart</a><a href="contact.html">Contact us</a><a href="about.html">About us</a></div>
  <div><h4>Call or text</h4><a href="tel:0915141044">0915141044</a></div>
  <div><h4>SNEAKERS Shop</h4><p>Quality sneakers at fair prices, for everyone.</p></div>
</div><div class="wrap copy">&copy; 2026 SNEAKERS Shop. All rights reserved.</div></footer>`;
  const burger = $('.burger');
  burger.addEventListener('click', () => {
    const open = $('.nav').classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  updateBadge();

  /* ================= Product cards ================= */
  const stars = (r) => `<div class="stars" aria-label="Rated ${r} out of 5">${'\u2605'.repeat(Math.round(r))}${'\u2606'.repeat(5 - Math.round(r))}<span>${r.toFixed(1)}</span></div>`;
  const card = (p) => `
<article class="card" data-id="${p.id}" data-color="${p.colors[0]}">
  ${p.tag ? `<span class="tag ${p.tag.toLowerCase()}">${p.tag}</span>` : ''}
  <div class="pic">${pic(p, p.colors[0])}</div>
  <span class="brand">${p.brand} &middot; ${p.cat}</span>
  <h3>${p.name}</h3>
  ${stars(p.rating)}
  <div class="price">${peso(p.price)}</div>
  <div class="sws" role="group" aria-label="Colors">${p.colors.map((c, i) =>
    `<button type="button" class="sw${i ? '' : ' on'}" data-c="${c}" aria-label="${c}" style="background:${COLORS[c][0]}"></button>`).join('')}</div>
  <div class="buy">
    <select aria-label="Size for ${p.name}"><option value="">Size (US)</option>${SIZES.map((s) => `<option>${s}</option>`).join('')}</select>
    <button type="button" class="btn lime add">Add</button>
  </div>
</article>`;

  document.addEventListener('click', (e) => {
    const sw = e.target.closest('.sw');
    if (sw) {
      const c = sw.closest('.card'); const p = find(c.dataset.id);
      c.dataset.color = sw.dataset.c;
      $$('.sw', c).forEach((s) => s.classList.toggle('on', s === sw));
      $('.pic', c).innerHTML = pic(p, sw.dataset.c);
      return;
    }
    const add = e.target.closest('.add');
    if (add) {
      const c = add.closest('.card'); const sel = $('select', c);
      if (!sel.value) { sel.classList.add('err'); sel.focus(); toast('Please choose a size first'); return; }
      const p = find(c.dataset.id); const color = c.dataset.color; const size = sel.value;
      const key = [p.id, size, color].join('|');
      const ex = cart.find((i) => i.key === key);
      if (ex) ex.qty = Math.min(ex.qty + 1, 99); else cart.push({ key, id: p.id, size, color, qty: 1 });
      saveCart(); toast(`${p.name} (US ${size}) added to cart`);
    }
  });
  document.addEventListener('change', (e) => { if (e.target.matches('.buy select')) e.target.classList.remove('err'); });

  /* ================= Home page ================= */
  $$('[data-shoe]').forEach((n) => {
    n.innerHTML = n.dataset.img ? `<img src="${n.dataset.img}" alt="" data-fb="${n.dataset.shoe}">` : shoe(n.dataset.shoe);
  });
  const brandsEl = $('#brands');
  if (brandsEl) brandsEl.innerHTML = BRANDS.map((b) => `<a href="product.html?brand=${encodeURIComponent(b)}">${b}</a>`).join('');
  const rail = $('#rail');
  if (rail) {
    const sets = {
      new: () => PRODUCTS.filter((p) => p.tag === 'New'),
      top: () => [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8),
      sale: () => PRODUCTS.filter((p) => p.tag === 'Sale')
    };
    const showRail = (t) => {
      $$('#rail-tabs .chip').forEach((c) => { c.classList.toggle('on', c.dataset.t === t); c.setAttribute('aria-pressed', c.dataset.t === t); });
      rail.innerHTML = sets[t]().map(card).join('');
      rail.scrollTo({ left: 0 });
    };
    $('#rail-tabs').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) showRail(c.dataset.t); });
    showRail('new');
    $$('[data-rail]').forEach((b) => b.addEventListener('click', () => rail.scrollBy({ left: b.dataset.rail * 300, behavior: 'smooth' })));
  }

  /* ================= Products page ================= */
  const grid = $('#grid');
  if (grid) {
    const qs = new URLSearchParams(location.search);
    const st = { q: qs.get('q') || '', brand: qs.get('brand') || '', cat: qs.get('cat') || '', sort: 'featured' };
    const chips = $('#chips');
    chips.innerHTML = ['All', ...BRANDS].map((b) => `<button type="button" class="chip" data-b="${b === 'All' ? '' : b}">${b}</button>`).join('');
    $('#q').value = st.q; $('#cat').value = st.cat;
    const draw = () => {
      $$('.chip', chips).forEach((c) => { const on = c.dataset.b === st.brand; c.classList.toggle('on', on); c.setAttribute('aria-pressed', on); });
      let list = PRODUCTS.filter((p) => (!st.brand || p.brand === st.brand) && (!st.cat || p.cat === st.cat) &&
        `${p.name} ${p.brand} ${p.cat}`.toLowerCase().includes(st.q.trim().toLowerCase()));
      if (st.sort === 'low') list.sort((a, b) => a.price - b.price);
      if (st.sort === 'high') list.sort((a, b) => b.price - a.price);
      if (st.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
      grid.innerHTML = list.map(card).join('') || '<div class="empty" style="grid-column:1/-1">No sneakers match your search.</div>';
      $('#count').textContent = `${list.length} pair${list.length === 1 ? '' : 's'}`;
    };
    chips.addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) { st.brand = c.dataset.b; draw(); } });
    $('#q').addEventListener('input', (e) => { st.q = e.target.value; draw(); });
    $('#cat').addEventListener('change', (e) => { st.cat = e.target.value; draw(); });
    $('#sort').addEventListener('change', (e) => { st.sort = e.target.value; draw(); });
    draw();
  }

  /* ================= Form validation ================= */
  function check(form, rules) {
    let ok = true;
    for (const [name, fn] of Object.entries(rules)) {
      const f = form.elements[name]; const r = fn(f.value.trim()); const bad = r !== true;
      f.classList.toggle('bad', bad); $('.msg', f.closest('.field')).textContent = bad ? r : '';
      if (bad && ok) { f.focus(); ok = false; }
    }
    return ok;
  }
  const rules = {
    name: (v) => v.length >= 2 || 'Please enter your name.',
    phone: (v) => /^[0-9+\s-]{10,15}$/.test(v) || 'Enter a valid mobile number.',
    address: (v) => v.length >= 8 || 'Please enter your full delivery address.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    message: (v) => v.length >= 5 || 'Please write a short message.',
    pay: () => true
  };
  const pick = (...keys) => Object.fromEntries(keys.map((k) => [k, rules[k]]));

  /* ================= Cart page ================= */
  const box = $('#cart-content');
  if (box) {
    let form = null;
    const render = () => {
      if (!cart.length) {
        box.innerHTML = '<div class="empty"><p>Your cart is currently empty.</p><a class="btn lime" href="product.html">Browse products</a></div>';
        form = null; return;
      }
      box.innerHTML = `<div class="cart-wrap"><div>${cart.map((i) => {
        const p = find(i.id);
        return `<div class="ci" data-key="${i.key}"><div class="thumb">${pic(p, i.color)}</div>
<div><h3>${p.name}</h3><p class="meta">${p.brand} &middot; ${i.color} &middot; US ${i.size}</p><p class="meta">${peso(p.price)} each</p>
<div class="qty"><button data-d="-1" aria-label="Decrease quantity">&minus;</button><output>${i.qty}</output><button data-d="1" aria-label="Increase quantity">+</button></div></div>
<div class="end"><strong>${peso(p.price * i.qty)}</strong><br><button class="link rm">Remove</button></div></div>`;
      }).join('')}</div>
<aside class="sum"><h3>Order summary</h3>
<div class="summary-items">${cart.map((i) => {
        const p = find(i.id);
        return `<div class="summary-item"><span>${p.name}</span><span>${i.qty}x</span></div>`;
      }).join('')}</div>
<div class="row"><span>Subtotal</span><span>${peso(subtotal())}</span></div>
<div class="row"><span>Shipping</span><span>${shipping() ? peso(shipping()) : 'Free'}</span></div>
<div class="row total"><span>Total</span><span>${peso(subtotal() + shipping())}</span></div>
<p class="meta">Free shipping on orders of &#8369;5,000 and up.</p>
<div class="sum-actions">
  <button class="btn lime" id="go">Checkout</button>
  <button class="link" id="clr">Clear cart</button>
</div>
</aside></div>`;
      form = box.querySelector('#checkout');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (!check(form, pick('name', 'phone', 'address'))) return;
          const total = subtotal() + shipping();
          const order = { id: 'SK' + Date.now().toString().slice(-7), date: new Date().toISOString(), total, items: cart, name: form.name.value.trim(), phone: form.phone.value.trim(), address: form.address.value.trim(), pay: form.pay.value };
          store.set('sneakers-orders', [...store.get('sneakers-orders', []), order]);
          cart = []; saveCart(); form.reset(); form.hidden = true; box.innerHTML = '';
          const done = $('#order-done'); done.hidden = false;
          done.innerHTML = '<h2>Thank you!</h2><p></p><a class="btn lime" href="product.html">Continue shopping</a>';
          $('p', done).textContent = `Order ${order.id} is placed, ${order.name}. Total: ${peso(total)} (${order.pay}). We will contact you at ${order.phone} to confirm delivery.`;
          done.scrollIntoView({ behavior: 'smooth' });
        });
      }
    };
    box.addEventListener('click', (e) => {
      const row = e.target.closest('.ci'); const item = row && cart.find((i) => i.key === row.dataset.key);
      if (e.target.dataset.d && item) { item.qty = Math.min(item.qty + Number(e.target.dataset.d), 99); if (item.qty <= 0) cart = cart.filter((i) => i !== item); saveCart(); render(); }
      else if (e.target.matches('.rm') && item) { cart = cart.filter((i) => i !== item); saveCart(); render(); }
      else if (e.target.id === 'clr' && confirm('Remove all items from your cart?')) { cart = []; saveCart(); render(); }
    });
    render();
  }

  /* ================= Contact page ================= */
  const cform = $('#contact-form');
  if (cform) {
    cform.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!check(cform, pick('name', 'email', 'message'))) return;
      store.set('sneakers-messages', [...store.get('sneakers-messages', []), { name: cform.name.value.trim(), email: cform.email.value.trim(), message: cform.message.value.trim(), date: new Date().toISOString() }]);
      cform.hidden = true; const d = $('#contact-done'); d.hidden = false;
      d.innerHTML = '<h2>Message sent</h2><p>Thanks for reaching out. We will get back to you soon.</p>';
    });
  }

  /* ================= Size finder (home page) ================= */
  const sizeForm = $('#size-form');
  if (sizeForm) {
    sizeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cm = parseFloat(sizeForm.foot.value); const msg = $('.msg', sizeForm); const out = $('#size-result');
      if (!(cm >= 20 && cm <= 34)) { msg.textContent = 'Enter a length between 20 and 34 cm.'; return; }
      msg.textContent = '';
      const half = (n) => Math.round(n * 2) / 2;
      const m = half(6 + (cm - 24) / 0.846);           /* approximate US men's size */
      const box = (label, val) => `<div class="sz"><span>${label}</span><b>${val}</b></div>`;
      const pickSize = Math.ceil(m);
      out.innerHTML = `<div class="sz-grid">${box('US men', m)}${box('US women', m + 1.5)}${box('UK', m - 1)}${box('EU', half(40 + (m - 7) * 1.33))}</div>
<p class="meta">${pickSize >= 6 && pickSize <= 12 ? `In our shop, choose <strong>US ${pickSize}</strong> in the size menu.` : 'This is outside the US 6\u201312 range we stock. Contact us and we will help.'} Sizes are approximate and vary by brand.</p>`;
    });
  }

  /* ================= Newsletter (home page) ================= */
  const news = $('#news-form');
  if (news) {
    news.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!check(news, pick('email'))) return;
      store.set('sneakers-subscribers', [...store.get('sneakers-subscribers', []), news.email.value.trim()]);
      news.hidden = true; $('#news-done').hidden = false;
    });
  }

  /* ================= Scroll reveal + counters ================= */
  const io = 'IntersectionObserver' in window && new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
  $$('.reveal').forEach((n) => (io ? io.observe(n) : n.classList.add('in')));

  const animateCounter = (node) => {
    const target = Number(node.dataset.target || 0);
    const decimals = Number(node.dataset.decimals || 0);
    const suffix = node.dataset.suffix || '';
    const duration = 900;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = target * progress;
      node.textContent = `${Number(current).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll('.stat-number');
  if (counters.length) {
    const counterObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .4 }) : null;

    counters.forEach((node) => {
      node.textContent = '0';
      if (counterObserver) counterObserver.observe(node); else animateCounter(node);
    });
  }

  window.addEventListener('storage', (e) => { if (e.key === KEY) { cart = store.get(KEY, []); updateBadge(); } });
})();
