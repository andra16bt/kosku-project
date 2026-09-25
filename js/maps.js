// Peta Leaflet + OpenStreetMap: price marker bergaya pill, clustering, popup detail, sinkronisasi, geocoding
const Maps = {
  map: null, layer: null, markers: {},

  init(onMarkerClick) {
    this.onMarkerClick = onMarkerClick;
    this.map = L.map('map', { zoomControl: false }).setView([-7.2756, 112.7912], 13);
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; kontributor OpenStreetMap'
    }).addTo(this.map);
    this.layer = L.markerClusterGroup();
    this.map.addLayer(this.layer);
  },

  rupiah(n) {
    return n >= 1e6 ? 'Rp ' + (n / 1e6).toFixed(2).replace(/0$/, '').replace('.', ',') + ' jt' : 'Rp ' + Math.round(n / 1000) + ' rb';
  },

  pinHtml(k) {
    return `<div class="pin-body"><div class="pin-pill"><span class="material-symbols-outlined" style="font-size:14px">hotel</span><span>${this.rupiah(k.hargaBulanan)}</span></div><div class="pin-tail"></div><div class="pin-pulse"></div></div>`;
  },

  setMarkers(list, popupHtml) {
    this.map.invalidateSize();
    this.layer.clearLayers();
    this.markers = {};
    const arr = list.map(k => {
      const m = L.marker([k.lat, k.lng], {
        title: k.nama,
        icon: L.divIcon({ className: 'map-pin', iconSize: [0, 0], html: this.pinHtml(k) })
      });
      m.bindPopup(popupHtml(k), { closeButton: true, className: 'kos-popup', maxWidth: 240 });
      m.on('click', () => this.onMarkerClick(k.id));
      this.markers[k.id] = m;
      return m;
    });
    this.layer.addLayers(arr);
    if (list.length) this.map.fitBounds(list.map(k => [k.lat, k.lng]), { padding: [50, 50], maxZoom: 16 });
  },

  highlight(id, on) {
    const m = this.markers[id];
    const el = m && m.getElement(); // null jika marker sedang masuk cluster
    if (!el) return;
    el.classList.toggle('active', on);
  },

  focus(id) {
    const m = this.markers[id];
    if (!m) return;
    this.map.panTo(m.getLatLng());
    m.openPopup();
  },

  geocode(query) { // Nominatim (OpenStreetMap), cukup untuk prototipe
    fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(query + ', Surabaya'))
      .then(r => r.json())
      .then(res => { if (res[0]) this.map.setView([+res[0].lat, +res[0].lon], 15); })
      .catch(() => {});
  }
};