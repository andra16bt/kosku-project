// Logika filter & pencarian data kos
const Filter = {
  state: { q: '', tipe: '', min: 0, max: Infinity, fas: [], favOnly: false },

  apply(data) {
    const s = this.state, q = s.q.toLowerCase();
    return data.filter(k =>
      (!q || [k.nama, k.alamat, k.jarakTerdekat].some(t => t.toLowerCase().includes(q))) &&
      (!s.tipe || k.tipe === s.tipe) &&
      k.hargaBulanan >= s.min && k.hargaBulanan <= s.max &&
      s.fas.every(f => k.fasilitas.includes(f)) &&
      (!s.favOnly || Fav.has(k.id))
    );
  }
};
