// Pengelolaan kos favorit via localStorage
const Fav = (() => {
  const KEY = 'kos_favorit';
  const get = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  };
  const has = id => get().includes(id);
  const toggle = id => {
    const list = get();
    const i = list.indexOf(id);
    i > -1 ? list.splice(i, 1) : list.push(id);
    localStorage.setItem(KEY, JSON.stringify(list));
    return i === -1; // true = sekarang tersimpan
  };
  return { get, has, toggle };
})();
