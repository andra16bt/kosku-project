const rp = (n) => "Rp " + n.toLocaleString("id-ID");
const area = (k) =>
  k.alamat
    .split(",")[0]
    .replace(/^Jl\.\s*/, "")
    .replace(/\s+(No\.|Gang).*/, "");
const stars = (r) => "★".repeat(Math.round(r));
const km = (a, b) => {
  const r = (x) => (x * Math.PI) / 180;
  const h =
    Math.sin(r(b.lat - a.lat) / 2) ** 2 +
    Math.cos(r(a.lat)) *
      Math.cos(r(b.lat)) *
      Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};
const AM = {
  AC: "ac_unit",
  "Kamar Mandi Dalam": "shower",
  "Wi-Fi": "wifi",
  Kasur: "bed",
  Lemari: "checkroom",
};
const GI = { Putri: "female", Putra: "male", Campur: "wc" };
const GKEY = { Putri: "putri", Putra: "putra", Campur: "mix" };
const icon = (n) => `<span class="material-symbols-outlined">${n}</span>`;
const TUGU = { lat: -7.2459, lng: 112.7378 };
const waLink = (k) =>
  `https://wa.me/${k.noWhatsapp}?text=${encodeURIComponent("Halo, saya tertarik dengan " + k.nama + " yang saya lihat di KosKu. Apakah kamar masih tersedia?")}`;
