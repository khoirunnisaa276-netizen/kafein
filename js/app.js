/* ========== DATA DUMMY ========== */
const CAFES = [
  { id: 1, name: 'Kopi Tujuh', area: 'Kota Yogyakarta', rating: 4.8, reviews: 320, status: 'sedang', updated: 10, img: 'img/cafe1.png', lat: -7.7956, lng: 110.3695, address: 'Jl. Prawirotaman No.7, Kota Yogyakarta', hours: '07.00 - 22.00 WIB', phone: '0812-1111-2222', facilities: ['Wi-Fi', 'Colokan listrik', 'Area indoor'], desc: 'Kafe hangat dengan kopi single origin pilihan, cocok untuk ngobrol santai.' },
  { id: 2, name: 'Loka Kafe', area: 'Sleman', rating: 4.6, reviews: 210, status: 'sepi', updated: 5, img: 'img/cafe2.png', lat: -7.7520, lng: 110.3860, address: 'Jl. Kaliurang Km 5, Sleman', hours: '08.00 - 23.00 WIB', phone: '0812-2222-3333', facilities: ['Wi-Fi', 'Area outdoor', 'Colokan listrik'], desc: 'Kafe taman tropis yang asri, tenang untuk membaca dan bekerja.' },
  { id: 3, name: 'Ruang Rasa', area: 'Bantul', rating: 4.5, reviews: 150, status: 'ramai', updated: 3, img: 'img/cafe3.png', lat: -7.8880, lng: 110.3300, address: 'Jl. Parangtritis Km 6, Bantul', hours: '10.00 - 24.00 WIB', phone: '0812-3333-4444', facilities: ['Wi-Fi', 'Area indoor'], desc: 'Coffee bar bergaya industrial dengan barista berpengalaman.' },
  { id: 4, name: 'Hutan Kopi', area: 'Kulon Progo', rating: 4.7, reviews: 180, status: 'sepi', updated: 8, img: 'img/cafe4.png', lat: -7.8240, lng: 110.1640, address: 'Jl. Wates Km 20, Kulon Progo', hours: '09.00 - 21.00 WIB', phone: '0812-4444-5555', facilities: ['Area outdoor', 'Wi-Fi'], desc: 'Kafe joglo di tengah hijaunya perbukitan Menoreh.' },
  { id: 5, name: 'Sejiwa Coffee', area: 'Sleman', rating: 4.7, reviews: 190, status: 'ramai', updated: 3, img: 'img/cafe1.png', lat: -7.7650, lng: 110.3780, address: 'Jl. Kaliurang No.12, Sleman, Yogyakarta', hours: '08.00 - 23.00 WIB', phone: '0812-3456-7890', facilities: ['Wi-Fi', 'Colokan listrik', 'Area outdoor', 'Area indoor'], desc: 'Kafe dengan suasana nyaman, cocok untuk mengerjakan tugas maupun berkumpul bersama teman.' },
  { id: 6, name: 'Tanah Senja', area: 'Kota Yogyakarta', rating: 4.5, reviews: 150, status: 'penuh', updated: 2, img: 'img/cafe4.png', lat: -7.8010, lng: 110.3640, address: 'Jl. Malioboro No.30, Kota Yogyakarta', hours: '15.00 - 01.00 WIB', phone: '0812-5555-6666', facilities: ['Area outdoor', 'Wi-Fi'], desc: 'Tempat terbaik menikmati senja dengan live music di akhir pekan.' },
  { id: 7, name: 'Ruma Kopi', area: 'Kota Yogyakarta', rating: 4.6, reviews: 210, status: 'sepi', updated: 4, img: 'img/cafe2.png', lat: -7.7830, lng: 110.3750, address: 'Jl. Kotabaru No.15, Kota Yogyakarta', hours: '07.00 - 22.00 WIB', phone: '0812-6666-7777', facilities: ['Wi-Fi', 'Colokan listrik', 'Area indoor'], desc: 'Rumah kolonial yang disulap menjadi kafe homey.' },
  { id: 8, name: 'Bukit Seduh', area: 'Gunungkidul', rating: 4.4, reviews: 95, status: 'sedang', updated: 12, img: 'img/cafe3.png', lat: -7.9650, lng: 110.6000, address: 'Jl. Baron Km 3, Gunungkidul', hours: '09.00 - 20.00 WIB', phone: '0812-7777-8888', facilities: ['Area outdoor'], desc: 'Ngopi dengan pemandangan bukit kapur Gunungkidul.' },
];
const AREAS = ['Kota Yogyakarta', 'Sleman', 'Bantul', 'Kulon Progo', 'Gunungkidul'];
const STATUS = { sepi: { label: 'Sepi', color: '#4caf6e' }, sedang: { label: 'Sedang', color: '#e9a93a' }, ramai: { label: 'Ramai', color: '#e8763c' }, penuh: { label: 'Penuh', color: '#e05561' } };

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null || raw === 'null' || raw === 'undefined') return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch (error) {
    return fallback;
  }
}
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function readStatusOverrides() {
  const stored = readStorage('kafein_status', {});
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};

  return Object.fromEntries(CAFES.flatMap(c => {
    const item = stored[c.id];
    if (!item || typeof item !== 'object' || !Object.prototype.hasOwnProperty.call(STATUS, item.status)) return [];
    return [[c.id, {
      status: item.status,
      time: Number.isFinite(item.time) ? item.time : Date.now(),
      note: typeof item.note === 'string' ? item.note : ''
    }]];
  }));
}

// Status override dari dashboard pengelola (disimpan di localStorage)
(function applyOverrides() {
  const overrides = readStatusOverrides();
  CAFES.forEach(c => {
    const item = overrides[c.id];
    if (item) {
      c.status = item.status;
      c.updated = Math.max(0, Math.round((Date.now() - item.time) / 60000));
    }
  });
})();

/* ========== ICONS ========== */
const ICON = {
  logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><path d="M7 2c0 1 1 1 1 2s-1 1-1 2M11 2c0 1 1 1 1 2s-1 1-1 2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-7-6.2-7-12a7 7 0 0114 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>',
  menu: '<svg width="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
};

/* ========== HELPERS ========== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const badge = s => `<span class="badge ${s}">${STATUS[s].label}</span>`;
const updatedText = m => m <= 0 ? 'Diperbarui baru saja' : `Diperbarui ${m} menit lalu`;
const getFavs = () => {
  const stored = readStorage('kafein_favs', []);
  return Array.isArray(stored) ? stored.filter(v => Number.isInteger(v)) : [];
};
function toggleFav(id, btn) {
  let f = getFavs();
  f = f.includes(id) ? f.filter(x => x !== id) : [...f, id];
  const ok = writeStorage('kafein_favs', f);
  if (ok) {
    btn && btn.classList.toggle('on', f.includes(id));
    toast(f.includes(id) ? 'Disimpan ke favorit ❤️' : 'Dihapus dari favorit');
  } else {
    toast('Tidak bisa menyimpan favorit di browser ini');
  }
}
function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200);
}

function cardHTML(c, i = 0) {
  const on = getFavs().includes(c.id) ? 'on' : '';
  return `<article class="card" style="animation-delay:${i * 60}ms" onclick="location.href='detail.html?id=${c.id}'">
    <div class="card-img"><img src="${c.img}" alt="${c.name}" loading="lazy">
      <button class="fav ${on}" aria-label="Simpan" onclick="event.stopPropagation();toggleFav(${c.id},this)">${ICON.heart}</button></div>
    <div class="card-body">
      <div class="card-title"><h3>${c.name}</h3>${badge(c.status)}</div>
      <div class="meta">${c.area} · <span class="rating">★ ${c.rating}</span></div>
      <div class="meta">${updatedText(c.updated)}</div>
    </div></article>`;
}

/* Marker peta Leaflet sesuai status */
function cafeMarker(c) {
  return L.marker([c.lat, c.lng], {
    icon: L.divIcon({ className: '', html: `<div class="pin" style="background:${STATUS[c.status].color}"></div>`, iconSize: [30, 30], iconAnchor: [15, 30] })
  });
}
function baseMap(id, center = [-7.80, 110.37], zoom = 12, opts = {}) {
  const m = L.map(id, { zoomControl: true, scrollWheelZoom: false, ...opts }).setView(center, zoom);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap © CARTO', maxZoom: 19 }).addTo(m);
  return m;
}

/* ========== LAYOUT (navbar, footer, bottom-nav) ========== */
function renderLayout(active) {
  const links = [['index.html', 'Beranda', 'home'], ['daftar.html', 'Jelajahi', 'compass'], ['peta.html', 'Peta', 'map'], ['dashboard.html', 'Pengelola', 'user']];
  const nav = document.createElement('header');
  nav.className = 'navbar';
  nav.innerHTML = `<div class="container">
    <a href="index.html" class="logo">${ICON.logo}Kafein</a>
    <nav class="nav-links" id="navLinks">${links.map(([h, t]) => `<a href="${h}" class="${active === h ? 'active' : ''}">${t}</a>`).join('')}</nav>
    <a href="dashboard.html" class="btn btn-primary" id="btnMasuk">Masuk</a>
    <button class="menu-toggle" id="menuToggle" aria-label="Menu">${ICON.menu}</button></div>`;
  document.body.prepend(nav);
  $('#menuToggle').onclick = () => $('#navLinks').classList.toggle('open');

  const bn = document.createElement('nav');
  bn.className = 'bottom-nav';
  bn.innerHTML = links.map(([h, t, i]) => `<a href="${h}" class="${active === h ? 'active' : ''}">${ICON[i]}${t}</a>`).join('');
  document.body.appendChild(bn);
}
function renderFooter() {
  const f = document.createElement('footer');
  f.innerHTML = `<div class="container">© 2026 Kafein — Temukan kafe favoritmu di Yogyakarta.</div>`;
  document.body.appendChild(f);
}
