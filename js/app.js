let DATA = [];
const $ = s => document.querySelector(s);
const FAS = ['AC', 'Kamar Mandi Dalam', 'Wi-Fi', 'Kasur', 'Lemari'];
const PRICES = [500000, 800000, 1000000, 1500000, 2000000];
const rp = n => 'Rp ' + n.toLocaleString('id-ID');
const km = (a, b) => {
  const r = x => x * Math.PI / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

function buildFilters() {
  const opt = (v, t) => `<option value="${v}">${t}</option>`;
  $('#fMin').innerHTML = opt(0, 'Harga min') + PRICES.map(p => opt(p, '≥ ' + rp(p))).join('');
  $('#fMax').innerHTML = opt('', 'Harga maks') + PRICES.map(p => opt(p, '≤ ' + rp(p))).join('');
  $('#fFas').innerHTML = FAS.map(f => `<label><input type="checkbox" value="${f}"> ${f}</label>`).join('');
}

function readFilters() {
  const s = Filter.state;
  s.tipe = $('#fTipe').value;
  s.min = +$('#fMin').value;
  s.max = +$('#fMax').value || Infinity;
  s.fas = [...document.querySelectorAll('#fFas input:checked')].map(i => i.value);
  render();
}

function card(k) {
  const saved = Fav.has(k.id);
  return `<article class="card" id="card-${k.id}" data-id="${k.id}">
    <img src="${k.gambarUtama}" alt="${k.nama}" loading="lazy">
    <div class="info">
      <div class="row"><h3>${k.nama}</h3>
        <button class="heart" data-fav="${k.id}" aria-label="Simpan ke favorit">${saved ? '❤️' : '🤍'}</button></div>
      <p class="price">${rp(k.hargaBulanan)} <small>/ bln</small></p>
      <p class="muted">⭐ ${k.rating} · ${k.jarakTerdekat}</p>
      <div class="tags"><span class="tag t-${k.tipe}">${k.tipe}</span>
        ${k.fasilitas.slice(0, 3).map(f => `<span class="tag">${f}</span>`).join('')}
        <span class="tag">Sisa ${k.sisaKamar} kamar</span></div>
    </div></article>`;
}

function render() {
  const list = Filter.apply(DATA);
  $('#list').innerHTML = list.length ? list.map(card).join('') : '<p class="empty">Tidak ada kos yang cocok. Coba longgarkan filter.</p>';
  $('#favCount').textContent = Fav.get().length;
  if (Maps.map) Maps.setMarkers(list);
}

function focusCard(id) {
  document.querySelectorAll('.card.sel').forEach(c => c.classList.remove('sel'));
  const el = $('#card-' + id);
  if (el) { el.classList.add('sel'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}

function openTab(id) { location.href = 'detail.html?id=' + id; }

function search(q) {
  q = q.trim();
  $('#q').value = q;
  Filter.state.q = q;
  if (q && !Filter.apply(DATA).length) { // tidak ada nama yang cocok: anggap nama lokasi, geser peta
    Filter.state.q = '';
    render();
    Maps.geocode(q);
  } else render();
}

// --- Event listeners ---
$('.filters').addEventListener('change', readFilters);
$('#searchForm').addEventListener('submit', e => { e.preventDefault(); search($('#q').value); });
$('#favToggle').addEventListener('click', e => {
  Filter.state.favOnly = !Filter.state.favOnly;
  e.currentTarget.classList.toggle('on');
  render();
});
$('#toggleView').addEventListener('click', e => {
  const map = document.body.classList.toggle('show-map');
  e.currentTarget.textContent = map ? 'Lihat daftar' : 'Lihat peta';
  render();
});

const listEl = $('#list');
let hover = null;
listEl.addEventListener('click', e => {
  const h = e.target.closest('[data-fav]');
  if (h) {
    h.textContent = Fav.toggle(h.dataset.fav) ? '❤️' : '🤍';
    $('#favCount').textContent = Fav.get().length;
    if (Filter.state.favOnly) render();
    return;
  }
  const c = e.target.closest('.card');
  if (c) openTab(c.dataset.id);
});
listEl.addEventListener('mouseover', e => {
  const c = e.target.closest('.card'), id = c && c.dataset.id;
  if (id !== hover) { Maps.highlight(hover, false); Maps.highlight(id, true); hover = id; }
});
listEl.addEventListener('mouseleave', () => { Maps.highlight(hover, false); hover = null; });


// --- Inisialisasi ---
Maps.init(id => innerWidth <= 768 ? openTab(id) : focusCard(id));

fetch('data/kos.json').then(r => r.json()).then(d => {
    DATA = d; buildFilters();
    const p = new URLSearchParams(location.search), q = p.get('q');
    if (p.get('fav')) { Filter.state.favOnly = true; $('#favToggle').classList.add('on'); }
    q ? search(q) : render();
  })
  .catch(() => { listEl.innerHTML = '<p class="empty">Data gagal dimuat. Jalankan lewat server lokal (mis. Live Server), bukan file://.</p>'; });