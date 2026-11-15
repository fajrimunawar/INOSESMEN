/* ============================================================
   INFOTRINK — site.js (kode bersama untuk semua halaman)
   Arsitektur multi-halaman murni (tanpa delay):
   - index.html      : Beranda + halaman sub-menu kosong (?menu=&submenu=)
   - mediasosial.html: halaman Media Digital / Media Sosial
   - Semua tombol "Telusuri" adalah tautan nyata (<a href>) —
     klik langsung pindah halaman, tidak ada setTimeout.
   - Daftar Isi: overlay persisten, animasi murni CSS via .open.
   ============================================================ */
(function(){
"use strict";

/* ===== STATE ===== */
const state = {
  view: 'beranda',         // 'beranda' | 'submenu'
  menu: null,              // menu induk halaman saat ini
  submenu: null,           // nama sub-menu halaman saat ini
  activeMenu: null,        // overlay daftar isi yang sedang terbuka
  lastActiveMenu: null,    // nav yang terakhir aktif (garis bawah)
  scale: 0,
  contentHeight: 0,
  navPositions: {}
};

/* ===== KONSTANTA ===== */
const NAV_ITEMS = ["Beranda","Publikasi","Informasi","Galeri","Mengenal INFOTRINK"];

const SUB_MENUS = {
  Publikasi: {
    description: "Pusat seluruh konten yang diterbitkan.",
    items: ["Media Informasi & Penjelasan","Hasil Riset dan Penelitian","Kajian dan Analisis","Laporan & Catatan Perkembangan","Data dan Referensi","Gagasan & Konsep Pengembangan"]
  },
  Informasi: {
    description: "Pengelompokan informasi berdasarkan bidang.",
    items: ["Media Digital","Pembangunan","Personal","Bidang lainnya"]
  },
  Galeri: {
    description: "Arsip visual dan dokumentasi.",
    items: ["Dokumentasi riset","Dokumentasi media digital","Dokumentasi pembangunan","Dokumentasi personal","Visual dan infografis"]
  },
  "Mengenal INFOTRINK": {
    description: "Menjelaskan konsep dan keberadaan INFOTRINK sebagai sebuah wadah, bukan profil perusahaan atau lembaga.",
    items: ["Pengenalan INFOTRINK","Latar Belakang","Tujuan dan Fungsi","Ruang Lingkup","Prinsip Pengelolaan"]
  }
};

const NAV_X = { Beranda:820, Publikasi:910, Informasi:1000, Galeri:1085, "Mengenal INFOTRINK":1190 };
const LINE_START_Y = 78, LINE_TURN_Y = 150, BOX_LEFT = 70, BOX_RIGHT = 1210, BOX_BOTTOM = 680;

const MARQUEE_WORDS = ["BERKEMBANG","KETERAMPILAN","KETEKUNAN","KERJA KERAS","KONSISTEN","KEMAJUAN","KEBERHASILAN","PERJUANGAN","TEKAD"];
const HERO_MARQUEE_ITEMS = ["Instagram @jri_munawar","Twitter @Jri_munawar","Bagian dari jaringan JRI MUNAWAR GROUP"];

const PLATFORMS_SOSIAL = [
  { name:"Instagram", logo:"slide/logo-instagram.png" },
  { name:"X (Twitter)", logo:"slide/logo-x.png" },
  { name:"Facebook", logo:"slide/logo-facebook.png" },
  { name:"YouTube", logo:"slide/logo-youtube.png" },
  { name:"Threads", logo:"slide/logo-threads.png" },
  { name:"TikTok", logo:"slide/logo-tiktok.png" },
  { name:"BeReal", logo:"slide/logo-bereal.png" }
];

const PLATFORMS_CHATTING = [
  { name:"Telegram", bg:"#26A5E4", svg:"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" },
  { name:"WhatsApp", bg:"#25D366", svg:"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" },
  { name:"WeChat", logo:"slide/logo-wechat.png" },
  { name:"MS Teams", logo:"slide/logo-teams.png" },
  { name:"Discord", bg:"#5865F2", svg:"M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" },
  { name:"Line", logo:"slide/logo-line.png" },
  { name:"Slack", logo:"slide/logo-slack.png" }
];

/* ===== NAVIGASI ANTAR HALAMAN (instan, tanpa delay) ===== */
const PAGE_BERANDA = "index.html";
const PAGE_MEDIASOSIAL = "mediasosial.html";

// URL tujuan tombol "Telusuri" untuk sebuah sub-menu.
function telusuriHref(menu, submenu){
  if(menu === "Informasi" && submenu === "Media Digital") return PAGE_MEDIASOSIAL;
  return PAGE_BERANDA + "?menu=" + encodeURIComponent(menu)
    + (submenu ? "&submenu=" + encodeURIComponent(submenu) : "");
}

/* ===== HELPERS ===== */
// Bungkus "INFOTRINK" dengan translate="no" agar Google Translate tidak menerjemahkan nama merek.
function brandText(text){
  if(text == null) return "";
  text = String(text);
  if(text.indexOf("INFOTRINK") === -1) return escapeHtml(text);
  const parts = text.split("INFOTRINK");
  return parts.map((p,i) => escapeHtml(p) + (i < parts.length-1 ? '<span translate="no">INFOTRINK</span>' : '')).join('');
}
function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function escapeAttr(s){ return escapeHtml(s); }
// Ubah objek style menjadi string CSS (camelCase -> kebab-case).
function S(o){
  const out = [];
  for(const k in o){
    if(o[k] == null) continue;
    let v = o[k];
    if(typeof v === 'number' && k !== 'opacity' && k !== 'zIndex' && k !== 'fontWeight' && k !== 'lineHeight' && k !== 'flexGrow' && k !== 'flexShrink' && k !== 'zoom') v = v + 'px';
    const kk = k.replace(/[A-Z]/g, m => '-'+m.toLowerCase());
    out.push(kk+':'+v);
  }
  return out.join(';');
}
function getSlide(){
  return document.querySelector('[data-slide-content]');
}
function ovSelector(menuKey){
  return '.overlay-menu[data-menu="'+menuKey+'"]';
}

/* ===== IKON (lucide-style inline SVG, 24x24 stroke) ===== */
const ICONS = {
  Lightbulb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
  Compass: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  PenLine: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  Flag: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>',
  Workflow: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>',
  Archive: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
  TrendingUp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B6E6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>'
};

/* ===== HEADER BERSAMA (logo + nav) ===== */
function renderHeader(){
  let navLinks = '';
  for(const item of NAV_ITEMS){
    if(item === "Beranda"){
      navLinks += '<a class="nav-link" href="'+PAGE_BERANDA+'" data-nav="Beranda" onclick="return IFTRK.navBeranda(event)">'+brandText(item)+'</a>';
    } else {
      navLinks += '<a class="nav-link" href="'+escapeAttr(telusuriHref(item))+'" data-nav="'+escapeAttr(item)+'" onclick="return IFTRK.navClick(\''+escapeAttr(item)+'\', event)">'+brandText(item)+'</a>';
    }
  }
  return '<header style="'+S({position:"absolute", top:"32px", left:"70px", right:"70px", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10})+'">'
    + '<a href="'+PAGE_BERANDA+'" style="'+S({display:"flex", alignItems:"center", gap:"12px", padding:"8px 22px 8px 10px", background:"rgba(255,255,255,0.85)", backdropFilter:"blur(10px)", borderRadius:"999px", boxShadow:"0 4px 16px rgba(11,59,58,0.12)", border:"1px solid rgba(255,255,255,0.6)", textDecoration:"none"})+'">'
    + '<img src="slide/logo_icon.png" alt="Infotrink logo" style="'+S({width:"42px", height:"42px", objectFit:"contain", display:"block", filter:"drop-shadow(0 2px 4px rgba(11,59,58,0.15))"})+'">'
    + '<img src="slide/logo_text.png" alt="Infotrink" style="'+S({width:"125px", height:"40px", objectFit:"contain", display:"block"})+'">'
    + '</a>'
    + '<nav style="'+S({display:"flex", alignItems:"center", gap:"32px", padding:"10px 26px", background:"rgba(255,255,255,0.55)", backdropFilter:"blur(8px)", borderRadius:"999px", boxShadow:"0 4px 16px rgba(11,59,58,0.10)"})+'">'
    + navLinks + '</nav></header>';
}

/* ===== OVERLAY DAFTAR ISI (garis L + kotak putih + kartu + X) =====
   Dirender SEKALI per halaman dan tetap di DOM. Membuka/menutup hanya
   menambah/menghapus class .open, sehingga transisi CSS benar-benar jalan. */
function renderOverlay(menuKey){
  const menuData = SUB_MENUS[menuKey];
  const navX = state.navPositions[menuKey] != null ? state.navPositions[menuKey] : NAV_X[menuKey];
  const linePath = "M "+navX+" "+LINE_START_Y+" L "+navX+" "+LINE_TURN_Y+" L "+BOX_LEFT+" "+LINE_TURN_Y;

  // Kartu — jeda berurutan lewat CSS custom property --d
  let cards = '';
  for(let i=0; i<menuData.items.length; i++){
    const item = menuData.items[i];
    const delay = (0.85 + i*0.08).toFixed(2);
    cards += '<div class="ov-card" style="--d:'+delay+'s">'
      + '<span class="ov-num">'+String(i+1).padStart(2,'0')+'</span>'
      + '<div class="ov-title">'+brandText(item)+'</div>'
      + '<a class="ov-btn" href="'+escapeAttr(telusuriHref(menuKey,item))+'">Telusuri →</a>'
      + '</div>';
  }

  return '<div class="overlay-menu" data-menu="'+escapeAttr(menuKey)+'">'
    + '<svg class="ov-svg" width="1280" height="720">'
    + '<circle class="ov-dot-start" cx="'+navX+'" cy="'+LINE_START_Y+'" r="5"></circle>'
    + '<path class="ov-line" d="'+linePath+'" pathLength="1"></path>'
    + '<circle class="ov-dot-end" cx="'+BOX_LEFT+'" cy="'+LINE_TURN_Y+'" r="5"></circle>'
    + '</svg>'
    + '<div class="ov-box">'
    + '<div class="ov-head">'
    + '<h2 class="ov-h2">'+brandText(menuKey)+'</h2>'
    + '<p class="ov-desc">'+brandText(menuData.description)+'</p>'
    + '</div>'
    + '<div class="ov-divider"></div>'
    + '<div class="ov-cards">'+cards+'</div>'
    + '</div>'
    + '<button class="ov-x" onclick="IFTRK.closeOverlay()" aria-label="Tutup daftar isi">✕</button>'
    + '</div>';
}

function renderAllOverlays(){
  let overlays = '';
  for(const menuKey of Object.keys(SUB_MENUS)){
    overlays += renderOverlay(menuKey);
  }
  return overlays;
}

/* ===== HERO (Beranda atas, 1280x720) — hanya di index.html ===== */
function renderHero(){
  return '<div data-slide-content class="slide-root" style="'+S({position:"relative", width:"1280px", height:"720px", overflow:"hidden", background:"linear-gradient(180deg, #81F6EF 0%, #9CF4ED 22%, #B2FBF6 45%, #CFFCF6 68%, #E1FFFD 88%, #E8FEFC 100%)", fontFamily:"'Open Sans', 'Segoe UI', Tahoma, sans-serif"})+'">'
    // Konten hero (meredup saat overlay Daftar Isi terbuka)
    + '<div class="hero-dim">'
    + renderHeader()
    // Konten utama (kolom kiri)
    + '<div style="'+S({position:"absolute", left:"70px", top:"150px", width:"560px", zIndex:5})+'">'
    + '<h1 style="'+S({fontFamily:"'Open Sans', sans-serif", fontWeight:800, fontSize:"32px", lineHeight:1.3, color:"#0B3B3A", letterSpacing:"-0.5px", textTransform:"uppercase", margin:0, textAlign:"left"})+'">Satu Wadah untuk Perjalanan<br>Gagasan dan Berbagai Karya</h1>'
    + '<div style="'+S({display:"flex", alignItems:"flex-start", marginTop:"44px", gap:"10px"})+'">'
    + '<img src="slide/quote.svg" alt="" width="48" height="34" style="'+S({flexShrink:0, width:"48px", height:"34px", marginTop:"-12px", userSelect:"none"})+'">'
    + '<p style="'+S({fontFamily:"'Open Sans', sans-serif", fontWeight:400, fontSize:"16.5px", lineHeight:1.6, color:"#1F2937", textAlign:"justify", textJustify:"inter-word", width:"470px", margin:0})+'">INFOTRINK menghimpun informasi dan dokumentasi di beragam bidang, dirangkum mulai dari awal mula, perencanaan, sampai perwujudan dan pengembangannya — semuanya tertata rapi dan terus diperbarui, sehingga perjalanan di balik setiap gagasan dan karya dapat dikenali dengan jelas.</p>'
    + '</div>'
    // 2 tombol
    + '<div style="'+S({display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"52px", marginLeft:"58px", width:"470px"})+'">'
    + '<a href="'+escapeAttr(telusuriHref("Publikasi", SUB_MENUS["Publikasi"].items[0]))+'" style="'+S({position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"flex-end", height:"44px", width:"auto", paddingRight:"40px", paddingLeft:"60px", cursor:"pointer", textDecoration:"none"})+'">'
    + '<img src="slide/button2.png" alt="Tombol Telusuri" style="'+S({position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"fill", display:"block", zIndex:0})+'">'
    + '<span style="'+S({position:"relative", zIndex:1, fontFamily:"'Open Sans', sans-serif", fontSize:"16px", fontWeight:700, color:"#1a1a1a", letterSpacing:"0.3px", pointerEvents:"none"})+'">Telusuri</span></a>'
    + '<a href="'+escapeAttr(telusuriHref("Mengenal INFOTRINK", SUB_MENUS["Mengenal INFOTRINK"].items[0]))+'" style="'+S({position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"flex-start", height:"44px", width:"auto", paddingLeft:"40px", paddingRight:"60px", cursor:"pointer", textDecoration:"none"})+'">'
    + '<img src="slide/button1.png" alt="Tombol Kenali" style="'+S({position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"fill", display:"block", zIndex:0})+'">'
    + '<span style="'+S({position:"relative", zIndex:1, fontFamily:"'Open Sans', sans-serif", fontSize:"16px", fontWeight:700, color:"#1a1a1a", letterSpacing:"0.3px", pointerEvents:"none"})+'">Kenali</span></a>'
    + '</div>'
    // Marquee hero
    + '<div aria-label="Instagram @jri_munawar, Twitter @Jri_munawar, Bagian dari jaringan JRI MUNAWAR GROUP" style="'+S({marginTop:"44px", marginLeft:"58px", width:"470px", padding:"10px 0", background:"rgba(11,110,106,0.07)", borderRadius:"999px", border:"1px solid rgba(11,110,106,0.22)", overflow:"hidden", whiteSpace:"nowrap", WebkitMaskImage:"linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)", maskImage:"linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)"})+'">'
    + '<div style="'+S({display:"inline-flex", alignItems:"center", animation:"infotrinkMarqueeHero 40s linear infinite", willChange:"transform"})+'">'
    + heroMarqueeInner() + heroMarqueeInner(true)
    + '</div></div>'
    + '</div>'
    // Kolase foto (kanan)
    + '<div style="'+S({position:"absolute", left:"660px", top:"150px", width:"550px", height:"555px", zIndex:3})+'">'
    + renderPhoto(0, 0, "slide/hero_studio_kreatif.jpg", "Tim kreatif berkolaborasi mengelola konten media digital di ruang kerja")
    + renderPhoto(20, 294, "slide/hero_4_narasumber.jpg", "Narasumber menyampaikan penjelasan saat sesi wawancara")
    + renderPhoto(279, 0, "slide/hero_berbagi_sesama.jpg", "Relawan menyerahkan bantuan kepada warga dalam kegiatan berbagi bersama")
    + renderPhoto(299, 294, "slide/hero_pembangunan.jpg", "Petugas memeriksa denah pembangunan di lokasi proyek konstruksi")
    + '</div>'
    + '</div>'
    // Overlay (persisten, di atas hero)
    + renderAllOverlays()
    + '</div>';
}

function heroMarqueeInner(second){
  let reps = '';
  for(let rep=0; rep<2; rep++){
    for(let i=0; i<HERO_MARQUEE_ITEMS.length; i++){
      reps += '<span style="'+S({display:"inline-flex", alignItems:"center"})+'">'
        + '<span style="'+S({fontSize:"12px", fontWeight:600, letterSpacing:"2px", color:"rgba(11,110,106,0.85)", padding:"0 22px", whiteSpace:"nowrap"})+'">'+escapeHtml(HERO_MARQUEE_ITEMS[i])+'</span>'
        + '<span style="'+S({color:"rgba(11,110,106,0.4)", fontSize:"11px", margin:"0 5px"})+'">•</span></span>';
    }
  }
  return '<div'+(second?' aria-hidden="true"':'')+' style="'+S({display:"inline-flex", alignItems:"center"})+'">'+reps+'</div>';
}

function renderPhoto(top, left, src, alt){
  return '<div style="'+S({position:"absolute", top:top, left:left, width:"256px", height:"256px"})+'">'
    + '<div style="'+S({position:"absolute", top:"18px", left:"-18px", width:"100%", height:"100%", background:"linear-gradient(135deg, #0B6E6A 0%, #5B7A78 100%)", borderRadius:"18px", opacity:0.3})+'"></div>'
    + '<div style="'+S({position:"relative", width:"100%", height:"100%", padding:"8px", background:"linear-gradient(155deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.36) 55%, rgba(129,246,239,0.38) 100%)", border:"1px solid rgba(255,255,255,0.7)", borderRadius:"18px", boxShadow:"0 8px 22px rgba(11,59,58,0.12)", backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)"})+'">'
    + '<img src="'+escapeAttr(src)+'" alt="'+escapeAttr(alt)+'" width="240" height="240" loading="eager" style="'+S({width:"240px", height:"240px", objectFit:"cover", borderRadius:"12px", display:"block"})+'">'
    + '</div></div>';
}

/* ===== SECTION BERANDA (di bawah hero) ===== */
function renderBerandaSections(){
  return '<div style="'+S({position:"absolute", top:"720px", left:0, width:"1280px"})+'">'
    + renderSectionPengenalanSingkat()
    + renderSectionAlurPerjalanan()
    + renderSectionKutipanSemangat()
    + renderSectionPenutup()
    + '</div>';
}

function renderSectionPengenalanSingkat(){
  return '<section style="'+S({position:"relative", minHeight:"700px", padding:"50px 80px 30px", background:"white", backdropFilter:"blur(6px)"})+'">'
    + '<div style="'+S({float:"right", marginTop:"50px", marginLeft:"40px", marginBottom:"24px", position:"relative"})+'">'
    + '<div style="'+S({position:"absolute", top:"18px", left:"-18px", width:"100%", height:"100%", background:"linear-gradient(135deg, #0B6E6A 0%, #5B7A78 100%)", borderRadius:"22px", opacity:0.3})+'"></div>'
    + '<div style="'+S({position:"relative", width:"516px", height:"348px", borderRadius:"22px", overflow:"hidden", background:"white", boxShadow:"0 0 0 1px rgba(11,110,106,0.10), 0 14px 34px rgba(11,59,58,0.18)", border:"6px solid white"})+'">'
    + '<img src="slide/tim_kolaborasi.jpg" alt="Suasana kerja kolaboratif" style="'+S({width:"100%", height:"100%", objectFit:"contain", display:"block"})+'">'
    + '<div style="'+S({position:"absolute", bottom:"16px", left:"16px", padding:"10px 16px", background:"rgba(255,255,255,0.95)", borderRadius:"12px", boxShadow:"0 4px 12px rgba(0,0,0,0.1)"})+'">'
    + '<div style="'+S({fontSize:"11px", color:"#5B7A78", fontWeight:600, letterSpacing:"0.5px"})+'">RUANG DOKUMENTASI</div>'
    + '<div style="'+S({fontSize:"14px", color:"#0B3B3A", fontWeight:700})+'">Perjalanan Gagasan dan Karya</div>'
    + '</div></div></div>'
    + '<div>'
    + '<div style="'+S({display:"inline-block", fontSize:"13px", fontWeight:700, color:"#0B6E6A", background:"rgba(11,110,106,0.1)", padding:"6px 14px", borderRadius:"999px", letterSpacing:"1px", marginBottom:"18px"})+'">TENTANG PLATFORM</div>'
    + '<h2 style="'+S({fontSize:"26px", fontWeight:800, color:"#0B3B3A", margin:"0 0 22px 0", letterSpacing:"0.5px", lineHeight:1.3, overflow:"hidden", textTransform:"uppercase"})+'">Setiap Pembangunan<br>Mempunyai Awal</h2>'
    + '<p style="'+S({fontSize:"16.5px", lineHeight:1.75, color:"#1F2937", margin:0, textAlign:"justify"})+'">Keyakinan sederhana itulah yang melatarbelakangi INFOTRINK: hampir semua hal yang berdiri hari ini bermula dari sebuah gagasan yang dirumuskan dan dirancang sebelum akhirnya diwujudkan sedikit demi sedikit. Atas dasar itu, perjalanan pada berbagai lini dicatat sesuai tahapannya, mulai dari perencanaan dan perintisan, berlanjut ke perwujudan dan pelaksanaan, hingga pengelolaan dan pengembangannya. Penyajiannya dibuat jujur pada posisinya. Yang masih berupa gagasan diperkenalkan sebagai gagasan, sedangkan yang sudah berjalan dipaparkan sebagaimana perkembangannya, tanpa diperbesar dan tanpa diperkecil. Kedudukannya pun dijaga dengan batas yang jelas. INFOTRINK tidak berperan sebagai pihak yang memiliki atau membawahi apa yang diperkenalkan, dan setiap hal tetap berada di bawah pengelolaan pihaknya masing-masing. Yang tersaji di sini hanyalah gambaran, uraian, dan tautan yang mengarah pada sumbernya, bukan pengganti dari peran resminya. Berbeda dengan unggahan yang cepat berganti atau pemberitaan yang mudah berlalu, dokumentasi semacam ini disusun untuk bertahan lebih lama: setiap kemajuan ditambahkan, setiap perubahan diperbarui, agar yang terbaca selalu sesuai keadaan terkininya dan tidak berhenti pada versi lama. Dengan cara itulah sebuah awal tidak berakhir sebagai kenangan, melainkan terus hidup sebagai catatan yang berguna, baik bagi pihak yang melanjutkan perjalanannya maupun bagi siapa pun yang ingin memahami dari mana semuanya dimulai.</p>'
    + '</div>'
    + '<div style="clear:both"></div>'
    + '</section>';
}

function renderSectionAlurPerjalanan(){
  const stages = [
    { icon:"Lightbulb", title:"Gagasan", desc:"Bermula dari pemikiran yang dicatat apa adanya." },
    { icon:"Compass", title:"Perencanaan", desc:"Tujuan, kebutuhan, dan kemampuan disusun terarah." },
    { icon:"PenLine", title:"Perancangan", desc:"Rencana diberi bentuk, struktur, dan identitas." },
    { icon:"Flag", title:"Perintisan", desc:"Langkah pertama diambil sesuai kesiapan." },
    { icon:"Workflow", title:"Pelaksanaan", desc:"Konsep dijalankan melalui kegiatan yang nyata." },
    { icon:"Archive", title:"Pengelolaan", desc:"Yang berjalan dirawat dan dievaluasi secara teratur." },
    { icon:"TrendingUp", title:"Pengembangan", desc:"Kualitas ditingkatkan bertahap dan terukur." }
  ];
  const xs = [80, 235, 390, 545, 700, 855, 1010];
  const yLow = 345, yHigh = 110;
  const jalur = "M 80 345 C 140 345 175 110 235 110 C 295 110 330 345 390 345 C 450 345 485 110 545 110 C 605 110 640 345 700 345 C 760 345 795 110 855 110 C 915 110 950 345 1010 345";

  let stageNodes = '';
  for(let i=0; i<stages.length; i++){
    const st = stages[i];
    const high = i % 2 === 1;
    const y = high ? yHigh : yLow;
    const labelTop = high ? 2 : 366;
    const labelLeft = i === 0 ? 2 : (xs[i] - 85);
    const labelWidth = i === 0 ? 156 : 170;
    stageNodes += '<div>'
      + '<div style="'+S({position:"absolute", left:(xs[i]-24), top:(y-24), width:"48px", height:"48px", borderRadius:"50%", background:"#FFFFFF", border:"2px solid #0B6E6A", boxShadow:"0 0 0 6px rgba(11,110,106,0.09), 0 6px 14px rgba(11,59,58,0.14)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1})+'">'+(ICONS[st.icon]||'')+'</div>'
      + '<div style="'+S({position:"absolute", left:labelLeft, top:labelTop, width:labelWidth, textAlign:"center", display:"flex", flexDirection:"column", gap:"4px"})+'">'
      + '<span style="'+S({fontSize:"14.5px", fontWeight:800, color:"#0B3B3A", letterSpacing:"0.2px", textTransform:"uppercase", whiteSpace:"nowrap"})+'">'+escapeHtml(st.title)+'</span>'
      + '<span style="'+S({fontSize:"12.3px", lineHeight:1.5, color:"#4A6A67"})+'">'+escapeHtml(st.desc)+'</span>'
      + '</div></div>';
  }

  return '<section aria-label="Alur perjalanan sebuah pembangunan" style="'+S({position:"relative", padding:"56px 80px 58px", background:"#FFFFFF", borderTop:"1px solid rgba(11,110,106,0.12)", borderBottom:"1px solid rgba(11,110,106,0.12)", backgroundImage:"linear-gradient(rgba(11,110,106,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(11,110,106,0.035) 1px, transparent 1px)", backgroundSize:"40px 40px", overflow:"hidden"})+'">'
    + '<div style="'+S({display:"inline-block", fontSize:"12.5px", fontWeight:700, color:"#0B6E6A", background:"rgba(11,110,106,0.1)", padding:"6px 14px", borderRadius:"999px", letterSpacing:"1.5px", marginBottom:"16px"})+'">FILOSOFI DASAR</div>'
    + '<h2 style="'+S({fontSize:"27px", fontWeight:800, color:"#0B3B3A", margin:"0 0 12px 0", letterSpacing:"0.5px", lineHeight:1.3, maxWidth:"1060px", textTransform:"uppercase"})+'">Menumbuhkan Pembangunan Langkah demi Langkah</h2>'
    + '<p style="'+S({fontSize:"15px", lineHeight:1.72, color:"#37605D", margin:"0 0 10px 0", textAlign:"justify"})+'">Seperti menumbuhkan sesuatu dari tanah, sebuah pembangunan tidak langsung berdiri dalam bentuk akhirnya. Ia melewati urutan tahap yang saling menyambung — dimulai dari pemikiran yang dirumuskan, disusun dan dirancang, diwujudkan, kemudian dirawat dan terus dikembangkan. Jalur di bawah ini menggambarkan alur itulah yang dicatat pada setiap dokumentasi, sehingga yang terbaca bukan hanya bentuk jadinya, tetapi juga perjalanan yang membentuknya.</p>'
    + '<div style="'+S({position:"relative", height:"472px", marginTop:"14px"})+'">'
    + '<svg width="1120" height="472" viewBox="0 0 1120 472" role="img" aria-label="Jalur tahapan pembangunan dari gagasan hingga pengembangan" style="'+S({position:"absolute", inset:0})+'">'
    + '<path d="'+jalur+'" fill="none" stroke="rgba(11,110,106,0.08)" stroke-width="9" stroke-linecap="round"></path>'
    + '<path d="'+jalur+'" fill="none" stroke="#0B6E6A" stroke-width="2" stroke-dasharray="7 7" stroke-linecap="round" opacity="0.5"></path>'
    + '<line x1="34" y1="345" x2="76" y2="345" stroke="#0B6E6A" stroke-width="2" stroke-dasharray="5 6" opacity="0.45"></line>'
    + '<circle cx="28" cy="345" r="4" fill="#0B6E6A" opacity="0.45"></circle>'
    + '<line x1="1010" y1="345" x2="1080" y2="345" stroke="#0B6E6A" stroke-width="2" stroke-dasharray="5 6" opacity="0.45"></line>'
    + '<polygon points="1080,338 1094,345 1080,352" fill="#0B6E6A" opacity="0.7"></polygon>'
    + '</svg>'
    + stageNodes
    + '</div></section>';
}

function renderSectionKutipanSemangat(){
  const corner = "position:absolute; width:38px; height:38px; border-color:rgba(11,110,106,0.45); border-style:solid;";
  return '<section aria-label="Semangat dalam bekerja" style="'+S({position:"relative", overflow:"hidden", background:"linear-gradient(180deg, #A5F4EC 0%, #C4FAF3 45%, #E2FEFA 100%)"})+'">'
    + '<div aria-hidden="true" style="'+S({height:"3px", background:"linear-gradient(90deg, rgba(11,110,106,0) 0%, #0B6E6A 18%, #D9B45B 50%, #0B6E6A 82%, rgba(11,110,106,0) 100%)"})+'"></div>'
    + '<div aria-hidden="true" style="'+S({position:"absolute", top:"-120px", left:"50%", transform:"translateX(-50%)", width:"760px", height:"300px", borderRadius:"50%", background:"radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0))"})+'"></div>'
    + '<div aria-hidden="true" style="'+S({position:"absolute", top:"34px", left:"34px", fontFamily:"Georgia, 'Times New Roman', serif", fontSize:"110px", lineHeight:1, color:"rgba(11,110,106,0.16)", userSelect:"none"})+'">&ldquo;</div>'
    + '<div aria-hidden="true" style="'+S({position:"absolute", bottom:"-30px", right:"34px", fontFamily:"Georgia, 'Times New Roman', serif", fontSize:"110px", lineHeight:1, color:"rgba(11,110,106,0.16)", userSelect:"none"})+'">&rdquo;</div>'
    + '<div aria-hidden="true" style="'+S({position:"absolute", top:"30px", bottom:"30px", left:"44px", right:"44px", pointerEvents:"none"})+'">'
    + '<div style="'+corner+'top:0; left:0; border-width:2px 0 0 2px;"></div>'
    + '<div style="'+corner+'top:0; right:0; border-width:2px 2px 0 0;"></div>'
    + '<div style="'+corner+'bottom:0; left:0; border-width:0 0 2px 2px;"></div>'
    + '<div style="'+corner+'bottom:0; right:0; border-width:0 2px 2px 0;"></div>'
    + '</div>'
    + '<div style="'+S({position:"relative", padding:"58px 96px"})+'">'
    + '<div style="'+S({display:"flex", justifyContent:"center"})+'">'
    + '<div style="'+S({display:"inline-flex", alignItems:"center", gap:"10px", fontSize:"12px", fontWeight:800, color:"#0B6E6A", background:"rgba(255,255,255,0.8)", border:"1px solid rgba(11,110,106,0.35)", padding:"8px 22px", borderRadius:"999px", letterSpacing:"3px", boxShadow:"0 3px 12px rgba(11,59,58,0.08)"})+'">'
    + '<span style="'+S({width:"6px", height:"6px", borderRadius:"50%", background:"#D9B45B", display:"inline-block"})+'"></span>SEMANGAT KERJA<span style="'+S({width:"6px", height:"6px", borderRadius:"50%", background:"#D9B45B", display:"inline-block"})+'"></span></div></div>'
    + '<h2 style="'+S({fontSize:"36px", fontWeight:800, color:"#0B3B3A", textAlign:"center", whiteSpace:"nowrap", lineHeight:1.25, letterSpacing:"0.5px", textTransform:"uppercase", margin:"24px 0 0"})+'">Tidak Ada Perkembangan Tanpa Kesungguhan</h2>'
    + '<div aria-hidden="true" style="'+S({display:"flex", alignItems:"center", justifyContent:"center", gap:"14px", width:"460px", margin:"24px auto 26px"})+'">'
    + '<div style="'+S({flex:1, height:"1.5px", background:"linear-gradient(90deg, rgba(11,110,106,0), rgba(11,110,106,0.6))"})+'"></div>'
    + '<div style="'+S({width:"9px", height:"9px", transform:"rotate(45deg)", background:"#D9B45B", boxShadow:"0 0 0 3px rgba(217,180,91,0.25)"})+'"></div>'
    + '<div style="'+S({flex:1, height:"1.5px", background:"linear-gradient(270deg, rgba(11,110,106,0), rgba(11,110,106,0.6))"})+'"></div></div>'
    + '<p style="'+S({fontSize:"17px", lineHeight:1.9, color:"#1F4E4B", fontWeight:500, textAlign:"justify", textJustify:"inter-word", margin:0})+'">Menumbuhkan sesuatu menuntut kerja yang sungguh-sungguh: disiplin dalam menjalankan, teliti dalam memeriksa, sabar dalam menanti hasil, dan rendah hati dalam memperbaiki kekurangan. Kecepatan tidak boleh mengorbankan ketelitian, dan hasil yang dicapai tidak boleh mengabaikan tanggung jawab — sebab perkembangan yang baik selalu dibangun di atas proses yang benar.</p>'
    + '</div></section>';
}

function renderSectionPenutup(){
  const marqueeInner = (function(){
    let copy1 = '';
    for(let i=0; i<MARQUEE_WORDS.length; i++){
      copy1 += '<span style="'+S({display:"inline-flex", alignItems:"center"})+'">'
        + '<span style="'+S({fontSize:"13px", fontWeight:700, letterSpacing:"2.5px", color:"#81F6EF", padding:"0 20px", whiteSpace:"nowrap"})+'">'+escapeHtml(MARQUEE_WORDS[i])+'</span>'
        + '<span style="'+S({color:"rgba(129,246,239,0.45)", fontSize:"11px"})+'">•</span></span>';
    }
    return '<div style="'+S({display:"inline-flex", alignItems:"center"})+'">'+copy1+'</div>';
  })();
  const marquee = '<div aria-label="Berkembang, Keterampilan, Ketekunan, Kerja Keras, Konsisten, Kemajuan, Keberhasilan, Perjuangan, Tekad" style="'+S({display:"block", maxWidth:"829px", marginBottom:"18px", padding:"11px 0", background:"rgba(129,246,239,0.08)", borderRadius:"999px", border:"1px solid rgba(129,246,239,0.25)", overflow:"hidden", whiteSpace:"nowrap", WebkitMaskImage:"linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)", maskImage:"linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)"})+'">'
    + '<div style="'+S({display:"inline-flex", alignItems:"center", animation:"infotrinkMarquee 26s linear infinite", willChange:"transform"})+'">'+marqueeInner+marqueeInner.replace('<div','<div aria-hidden="true"')+'</div></div>';

  // Semua tautan footer adalah navigasi nyata antar halaman
  const navFooter = NAV_ITEMS.map(i => '<li><a href="'+escapeAttr(i==="Beranda"?PAGE_BERANDA:telusuriHref(i))+'" style="'+S({fontSize:"13px", color:"rgba(255,255,255,0.75)", textDecoration:"none"})+'">'+brandText(i)+'</a></li>').join('');
  const bidangFooter = ["Media Digital","Pembangunan","Personal","Bidang Lainnya"].map(i => '<li><a href="'+escapeAttr(i==="Media Digital"?PAGE_MEDIASOSIAL:telusuriHref("Informasi", i==="Bidang Lainnya"?"Bidang lainnya":i))+'" style="'+S({fontSize:"13px", color:"rgba(255,255,255,0.75)", textDecoration:"none"})+'">'+escapeHtml(i)+'</a></li>').join('');
  const JENIS_MAP = [
    ["Media Informasi","Media Informasi & Penjelasan"],
    ["Hasil Riset","Hasil Riset dan Penelitian"],
    ["Kajian & Analisis","Kajian dan Analisis"],
    ["Laporan","Laporan & Catatan Perkembangan"],
    ["Data & Referensi","Data dan Referensi"],
    ["Gagasan","Gagasan & Konsep Pengembangan"]
  ];
  const jenisFooter = JENIS_MAP.map(pair => '<li><a href="'+escapeAttr(telusuriHref("Publikasi", pair[1]))+'" style="'+S({fontSize:"13px", color:"rgba(255,255,255,0.75)", textDecoration:"none"})+'">'+escapeHtml(pair[0])+'</a></li>').join('');

  return '<section style="'+S({position:"relative", background:"linear-gradient(180deg, #0B3B3A 0%, #0B6E6A 60%, #0B3B3A 100%)", overflow:"hidden"})+'">'
    + '<div aria-hidden="true" style="'+S({position:"absolute", top:"-150px", right:"-150px", width:"400px", height:"400px", borderRadius:"50%", background:"rgba(129,246,239,0.08)"})+'"></div>'
    + '<div aria-hidden="true" style="'+S({position:"absolute", bottom:"-100px", left:"-100px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(129,246,239,0.06)"})+'"></div>'
    + '<div aria-hidden="true" style="'+S({position:"absolute", top:"40%", left:"35%", width:"150px", height:"150px", borderRadius:"50%", background:"rgba(129,246,239,0.04)"})+'"></div>'
    + '<div style="'+S({position:"relative", padding:"30px 80px 24px"})+'">'
    + marquee
    + '<div style="'+S({display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"60px"})+'">'
    + '<div style="'+S({flex:1, minWidth:0, maxWidth:"829px"})+'">'
    + '<h2 style="'+S({fontSize:"22px", fontWeight:800, color:"white", margin:"0 0 16px 0", letterSpacing:"0.2px", lineHeight:1.35, textTransform:"uppercase"})+'">Dokumentasi yang Terhimpun Menanti untuk Ditelusuri</h2>'
    + '<p style="'+S({fontSize:"16px", lineHeight:1.7, color:"rgba(255,255,255,0.85)", margin:0, textAlign:"justify", textJustify:"inter-word"})+'">Berbagai gagasan, karya, dan inisiatif telah terdokumentasi dalam satu wadah yang terstruktur. Setiap catatan memuat konteks dan tahapan perkembangannya sehingga siap dijelajahi dan dimanfaatkan kembali kapan saja.</p>'
    + '</div>'
    + '<div style="'+S({display:"flex", flexDirection:"column", gap:"14px", minWidth:"220px"})+'">'
    + '<a href="'+escapeAttr(telusuriHref("Publikasi", SUB_MENUS["Publikasi"].items[0]))+'" style="'+S({display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"16px 32px", background:"#FDEEC5", color:"#0B3B3A", border:"2px solid #0B3B3A", borderRadius:"999px", fontSize:"15px", fontWeight:700, textDecoration:"none", boxShadow:"0 4px 14px rgba(0,0,0,0.2)", letterSpacing:"0.3px", whiteSpace:"nowrap"})+'">Telusuri →</a>'
    + '<a href="'+escapeAttr(telusuriHref("Mengenal INFOTRINK", SUB_MENUS["Mengenal INFOTRINK"].items[0]))+'" style="'+S({display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"16px 32px", background:"rgba(255,255,255,0.1)", color:"white", border:"2px solid rgba(255,255,255,0.4)", borderRadius:"999px", fontSize:"15px", fontWeight:700, textDecoration:"none", letterSpacing:"0.3px", whiteSpace:"nowrap"})+'">'+brandText("Kenali INFOTRINK")+'</a>'
    + '</div></div></div>'
    + '<div style="'+S({position:"relative", padding:"32px 80px 24px", display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr", gap:"40px"})+'">'
    + '<div>'
    + '<div style="'+S({display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px"})+'">'
    + '<img src="slide/logo_icon.png" alt="Infotrink" style="'+S({width:"36px", height:"36px", objectFit:"contain", display:"block"})+'">'
    + '<img src="slide/logo_text.png" alt="Infotrink" style="'+S({width:"110px", height:"36px", objectFit:"contain", display:"block"})+'">'
    + '</div>'
    + '<p style="'+S({fontSize:"12.5px", lineHeight:1.65, color:"rgba(255,255,255,0.7)", margin:"0 0 16px 0", textAlign:"justify", textJustify:"inter-word"})+'">Tempat perjalanan gagasan dan karya diperkenalkan melalui informasi dan dokumentasi.</p>'
    + '<div style="'+S({display:"flex", gap:"8px"})+'">'
    + ['M:#3B82F6','P:#10B981','Pe:#F59E0B','L:#8B5CF6'].map(t => { const p = t.split(':'); return '<div style="'+S({fontSize:"10px", fontWeight:700, color:"white", background:p[1]+'40', border:"1px solid "+p[1]+'80', padding:"3px 10px", borderRadius:"6px", letterSpacing:"0.3px"})+'">'+escapeHtml(p[0])+'</div>'; }).join('')
    + '</div></div>'
    + '<div><h4 style="'+S({fontSize:"12px", fontWeight:700, color:"#81F6EF", letterSpacing:"1px", margin:"0 0 16px 0"})+'">NAVIGASI</h4><ul style="'+S({listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"9px"})+'">'+navFooter+'</ul></div>'
    + '<div><h4 style="'+S({fontSize:"12px", fontWeight:700, color:"#81F6EF", letterSpacing:"1px", margin:"0 0 16px 0"})+'">BIDANG</h4><ul style="'+S({listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"9px"})+'">'+bidangFooter+'</ul></div>'
    + '<div><h4 style="'+S({fontSize:"12px", fontWeight:700, color:"#81F6EF", letterSpacing:"1px", margin:"0 0 16px 0"})+'">JENIS MATERI</h4><ul style="'+S({listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"9px"})+'">'+jenisFooter+'</ul></div>'
    + '</div>'
    + '<div style="'+S({position:"relative", padding:"18px 80px", background:"rgba(0,0,0,0.25)", display:"flex", alignItems:"center", gap:"28px"})+'">'
    + '<div style="'+S({fontSize:"11.5px", color:"rgba(255,255,255,0.65)", lineHeight:1.55, flex:1, minWidth:0})+'">© '+new Date().getFullYear()+' '+brandText("INFOTRINK")+'. Hak cipta dilindungi. Seluruh materi yang dipublikasikan merupakan hasil riset, kajian, pemikiran, dan dokumentasi yang dikelola secara terstruktur untuk kepentingan pengetahuan.</div>'
    + '<div style="'+S({width:"1px", alignSelf:"stretch", background:"rgba(129,246,239,0.2)", flexShrink:0})+'"></div>'
    + '<div style="'+S({display:"flex", gap:"12px", fontSize:"11px", color:"rgba(255,255,255,0.5)", letterSpacing:"0.3px", flexShrink:0, whiteSpace:"nowrap"})+'"><span>Syarat &amp; Ketentuan</span><span style="'+S({opacity:0.4})+'">•</span><span>Kebijakan Privasi</span></div>'
    + '</div></section>';
}

/* ===== SHELL HALAMAN (header + overlay + breadcrumb) =====
   Dipakai halaman sub-menu & mediasosial.html.
   Halaman sub-menu TIDAK berisi apa pun di bawah breadcrumb. */
function renderPageShell(menu, submenu, contentHtml){
  const crumbSub = submenu
    ? '<span style="'+S({opacity:0.5})+'">›</span><span style="'+S({color:"#0B3B3A", fontWeight:700})+'">'+brandText(submenu)+'</span>'
    : '';
  return '<div data-slide-content class="slide-root" style="'+S({position:"relative", width:"1280px", minHeight:"720px", background:"linear-gradient(180deg, #81F6EF 0%, #9CF4ED 22%, #B2FBF6 45%, #CFFCF6 68%, #E1FFFD 88%, #E8FEFC 100%)", fontFamily:"'Open Sans', 'Segoe UI', Tahoma, sans-serif"})+'">'
    + renderHeader()
    + renderAllOverlays()
    + '<div style="'+S({position:"absolute", top:"110px", left:"70px", right:"70px", display:"flex", alignItems:"center", gap:"10px", fontSize:"13px", color:"#5B7A78", fontWeight:600, zIndex:5})+'">'
    + '<a href="'+PAGE_BERANDA+'" style="'+S({display:"inline-flex", alignItems:"center", gap:"5px", padding:"6px 14px", background:"white", color:"#0B6E6A", border:"1px solid rgba(11,110,106,0.2)", borderRadius:"999px", fontSize:"12px", fontWeight:700, cursor:"pointer", letterSpacing:"0.3px", textDecoration:"none"})+'">← Beranda</a>'
    + '<span style="'+S({opacity:0.5})+'">›</span>'
    + '<span>'+brandText(menu)+'</span>'
    + crumbSub
    + '</div>'
    + (contentHtml || '')
    + '</div>';
}

/* ===== HALAMAN MEDIA DIGITAL / MEDIA SOSIAL (mediasosial.html) ===== */
function renderMediaDigital(){
  const sosialCards = PLATFORMS_SOSIAL.map(p =>
    '<div class="hover-card" style="'+S({background:"white", borderRadius:"16px", padding:"24px 16px", textAlign:"center", cursor:"pointer", border:"1px solid rgba(11,110,106,0.06)", boxShadow:"0 4px 12px rgba(11,59,58,0.06)"})+'">'
    + '<div style="'+S({width:"56px", height:"56px", borderRadius:"16px", background:"white", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", border:"2px solid rgba(0,0,0,0.06)"})+'">'
    + '<img src="'+escapeAttr(p.logo)+'" alt="'+escapeAttr(p.name)+'" style="'+S({width:"36px", height:"36px", objectFit:"contain", display:"block"})+'"></div>'
    + '<div style="'+S({fontSize:"12px", fontWeight:700, color:"#0B3B3A"})+'">'+escapeHtml(p.name)+'</div></div>'
  ).join('');
  const chattingCards = PLATFORMS_CHATTING.map(p => {
    const hasLogo = !!p.logo;
    const icon = hasLogo ? '<img src="'+escapeAttr(p.logo)+'" alt="'+escapeAttr(p.name)+'" style="'+S({width:"36px", height:"36px", objectFit:"contain", display:"block"})+'">' : '<svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="'+escapeAttr(p.svg)+'"/></svg>';
    return '<div class="hover-card" style="'+S({background:"white", borderRadius:"16px", padding:"24px 16px", textAlign:"center", cursor:"pointer", border:"1px solid rgba(11,110,106,0.06)", boxShadow:"0 4px 12px rgba(11,59,58,0.06)"})+'">'
      + '<div style="'+S({width:"56px", height:"56px", borderRadius:"16px", background: hasLogo?"white":p.bg, margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", border: hasLogo?"2px solid rgba(0,0,0,0.06)":"none"})+'">'+icon+'</div>'
      + '<div style="'+S({fontSize:"12px", fontWeight:700, color:"#0B3B3A"})+'">'+escapeHtml(p.name)+'</div></div>';
  }).join('');
  const bidangs = [{name:"Pembangunan",target:"Pembangunan",color:"#10B981",svg:"M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"},{name:"Personal",target:"Personal",color:"#F59E0B",svg:"M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a6 6 0 0 0-6 6v1h12v-1a6 6 0 0 0-6-6z"},{name:"Bidang Lainnya",target:"Bidang lainnya",color:"#8B5CF6",svg:"M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"}];
  const bidangCards = bidangs.map(b =>
    '<a class="hover-card-sm" href="'+escapeAttr(telusuriHref("Informasi", b.target))+'" style="'+S({display:"flex", alignItems:"center", gap:"14px", padding:"16px", background:"#F8FAFA", borderRadius:"12px", border:"1px solid rgba(11,110,106,0.06)", cursor:"pointer", textDecoration:"none"})+'">'
    + '<div style="'+S({width:"40px", height:"40px", borderRadius:"10px", background:b.color+"15", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0})+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="'+escapeAttr(b.svg)+'" stroke="'+escapeAttr(b.color)+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
    + '<div><div style="'+S({fontSize:"14px", fontWeight:700, color:"#0B3B3A"})+'">'+escapeHtml(b.name)+'</div><div style="'+S({fontSize:"11px", color:"#9CB3B0"})+'">Lihat materi →</div></div></a>'
  ).join('');

  return '<div style="'+S({padding:"165px 70px 60px"})+'">'
    + '<div style="'+S({marginBottom:"40px"})+'">'
    + '<h1 style="'+S({fontSize:"36px", fontWeight:800, color:"#0B3B3A", margin:"0 0 12px 0", letterSpacing:"0.5px", textTransform:"uppercase"})+'">Media Digital</h1>'
    + '<p style="'+S({fontSize:"15.5px", color:"#5B7A78", margin:0, lineHeight:1.7, textAlign:"justify", textJustify:"inter-word"})+'">Ruang yang menampilkan perkembangan dan kreativitas aktivitas digital di berbagai platform media sosial dan media chatting, mulai dari pertumbuhan konten, perubahan tren, hingga dokumentasi setiap platform yang terus berkembang seiring waktu. Kehadiran media sosial dan media chatting saling melengkapi — keduanya menjadi bagian dari ekosistem digital yang menghubungkan komunikasi, ekspresi, dan interaksi dalam kehidupan sehari-hari.</p></div>'
    // Media Sosial
    + '<div style="'+S({marginBottom:"32px"})+'">'
    + '<div style="'+S({display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px"})+'">'
    + '<div style="'+S({width:"32px", height:"32px", borderRadius:"8px", background:"linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)", display:"flex", alignItems:"center", justifyContent:"center"})+'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5zm-5 5.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z" stroke="white" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1" fill="white"/></svg></div>'
    + '<h2 style="'+S({fontSize:"22px", fontWeight:800, color:"#0B3B3A", margin:0, textTransform:"uppercase"})+'">Media Sosial</h2></div>'
    + '<div style="'+S({display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"16px"})+'">'+sosialCards+'</div></div>'
    // Media Chatting
    + '<div style="'+S({marginBottom:"40px"})+'">'
    + '<div style="'+S({display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px"})+'">'
    + '<div style="'+S({width:"32px", height:"32px", borderRadius:"8px", background:"linear-gradient(135deg, #26A5E4 0%, #25D366 100%)", display:"flex", alignItems:"center", justifyContent:"center"})+'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
    + '<h2 style="'+S({fontSize:"22px", fontWeight:800, color:"#0B3B3A", margin:0, textTransform:"uppercase"})+'">Media Chatting</h2></div>'
    + '<div style="'+S({display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"16px"})+'">'+chattingCards+'</div></div>'
    // Bidang lainnya
    + '<div style="'+S({background:"white", borderRadius:"16px", padding:"28px 32px", marginBottom:"32px", border:"1px solid rgba(11,110,106,0.06)", boxShadow:"0 2px 8px rgba(11,59,58,0.04)"})+'">'
    + '<h3 style="'+S({fontSize:"16px", fontWeight:700, color:"#0B3B3A", margin:"0 0 18px 0", textTransform:"uppercase"})+'">Bidang Lainnya</h3>'
    + '<div style="'+S({display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"16px"})+'">'+bidangCards+'</div></div>'
    // CTA
    + '<div style="'+S({background:"linear-gradient(135deg, #0B3B3A 0%, #0B6E6A 100%)", borderRadius:"16px", padding:"32px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"24px", overflow:"hidden", position:"relative"})+'">'
    + '<div style="'+S({position:"absolute", top:"-60px", right:"-60px", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(129,246,239,0.06)"})+'"></div>'
    + '<div style="'+S({position:"relative", flex:1})+'"><h3 style="'+S({fontSize:"20px", fontWeight:800, color:"white", margin:"0 0 6px 0", textTransform:"uppercase"})+'">Punya materi Media Digital?</h3><p style="'+S({fontSize:"14px", color:"rgba(255,255,255,0.8)", margin:0})+'">Publikasikan riset, kajian, atau dokumentasi media digital di sini.</p></div>'
    + '<a href="'+escapeAttr(telusuriHref("Publikasi", SUB_MENUS["Publikasi"].items[0]))+'" style="'+S({position:"relative", padding:"12px 24px", background:"#FDEEC5", color:"#0B3B3A", border:"2px solid #0B3B3A", borderRadius:"999px", fontSize:"14px", fontWeight:700, cursor:"pointer", flexShrink:0, textDecoration:"none"})+'">Publikasikan →</a>'
    + '</div></div>';
}

/* ===== NAV HIGHLIGHT (tanpa re-render; toggle class .on) ===== */
function updateNavHighlight(){
  const slide = getSlide();
  if(!slide) return;
  const links = slide.querySelectorAll('.nav-link');
  for(let i=0; i<links.length; i++){
    const item = links[i].getAttribute('data-nav');
    const isActive = state.activeMenu === item;
    const isLastActive = !state.activeMenu && state.lastActiveMenu === item;
    const isDefaultBeranda = item === "Beranda" && !state.activeMenu && !state.lastActiveMenu;
    links[i].classList.toggle('on', !!(isActive || isLastActive || isDefaultBeranda));
  }
}

/* ===== EVENT HANDLERS ===== */
// Nav "Beranda": jika sudah di beranda, hanya scroll ke atas & tutup overlay.
// Jika dari halaman lain, biarkan browser pindah halaman (instan, tanpa delay).
function navBeranda(ev){
  const path = window.location.pathname;
  const onHome = path === '/' || path.endsWith('/index.html');
  const hasMenuQuery = window.location.search.indexOf('menu=') !== -1;
  if(onHome && !hasMenuQuery){
    if(ev) ev.preventDefault();
    if(state.activeMenu) closeOverlay();
    scrollTop();
    return false;
  }
  return true;
}

// Nav selain Beranda: buka/tutup overlay daftar isi di halaman ini.
function navClick(item, ev){
  if(ev) ev.preventDefault();
  const slide = getSlide();
  if(!slide) return false;
  if(state.activeMenu === item){
    closeOverlay();
    return false;
  }
  if(state.activeMenu){
    const oldOv = slide.querySelector(ovSelector(state.activeMenu));
    if(oldOv) oldOv.classList.remove('open');
  }
  // Pastikan garis L memakai posisi nav terukur, lalu buka (animasi jalan)
  measureNavPositions();
  state.activeMenu = item;
  state.lastActiveMenu = item;
  const ov = slide.querySelector(ovSelector(item));
  if(ov) ov.classList.add('open');
  slide.classList.add('menu-open');
  updateNavHighlight();
  return false;
}

function closeOverlay(){
  if(!state.activeMenu) return;
  const slide = getSlide();
  const ov = slide.querySelector(ovSelector(state.activeMenu));
  if(ov) ov.classList.remove('open');
  slide.classList.remove('menu-open');
  state.activeMenu = null;
  updateNavHighlight();
}

function scrollTop(){
  const c = document.getElementById('container');
  if(c) c.scrollTop = 0;
}

// Handler dipublikasikan agar bisa dipanggil dari atribut onclick
window.IFTRK = { navClick: navClick, navBeranda: navBeranda, closeOverlay: closeOverlay };

/* ===== SCALE / ZOOM ===== */
function updateScale(){
  const el = document.getElementById('container');
  if(!el) return;
  const w = el.clientWidth;
  state.scale = Math.max(w/1280, 0.5);
}
function applyZoom(){
  const content = document.getElementById('content');
  if(content && state.scale > 0){
    content.style.zoom = state.scale;
  }
}
function measureContentHeight(){
  const content = document.getElementById('content');
  if(!content) return;
  // Dengan CSS zoom, scrollHeight nilainya TIDAK terskala; tinggi visual = scrollHeight × scale.
  const actualHeight = content.scrollHeight * state.scale;
  if(actualHeight > 0){
    state.contentHeight = actualHeight;
    const wrapper = document.getElementById('wrapper');
    if(wrapper) wrapper.style.height = actualHeight + 'px';
  }
}
function measureNavPositions(){
  const el = document.getElementById('container');
  if(!el) return;
  const slideEl = getSlide();
  if(!slideEl) return;
  const slideRect = slideEl.getBoundingClientRect();
  const currentScale = slideRect.width / 1280;
  if(currentScale === 0) return;
  const positions = {};
  const navEls = slideEl.querySelectorAll('[data-nav]');
  for(let i=0; i<navEls.length; i++){
    const navEl = navEls[i];
    const item = navEl.getAttribute('data-nav');
    const navRect = navEl.getBoundingClientRect();
    const centerX = (navRect.left + navRect.width/2 - slideRect.left) / currentScale;
    positions[item] = centerX;
  }
  state.navPositions = positions;
  updateOverlayPositions();
}
function updateOverlayPositions(){
  const slideEl = getSlide();
  if(!slideEl) return;
  const overlays = slideEl.querySelectorAll('.overlay-menu');
  for(let i=0; i<overlays.length; i++){
    const menuKey = overlays[i].getAttribute('data-menu');
    const navX = state.navPositions[menuKey] != null ? state.navPositions[menuKey] : NAV_X[menuKey];
    const linePath = "M "+navX+" "+LINE_START_Y+" L "+navX+" "+LINE_TURN_Y+" L "+BOX_LEFT+" "+LINE_TURN_Y;
    const path = overlays[i].querySelector('path');
    if(path) path.setAttribute('d', linePath);
    const circles = overlays[i].querySelectorAll('circle');
    if(circles.length >= 1) circles[0].setAttribute('cx', navX);
  }
}

/* ===== BOOT — tentukan isi halaman dari data-page <body> ===== */
function mount(html){
  const content = document.getElementById('content');
  content.innerHTML = html;
  applyZoom();
  updateNavHighlight();
  requestAnimationFrame(function(){
    measureContentHeight();
    measureNavPositions();
  });
}

function boot(){
  updateScale(); // skala siap sebelum render pertama agar zoom langsung tepat
  const page = document.body.getAttribute('data-page') || 'beranda';
  const params = new URLSearchParams(window.location.search);
  const qMenu = params.get('menu');
  const qSub = params.get('submenu');

  if(page === 'mediasosial'){
    // Halaman Media Digital / Media Sosial (file terpisah)
    state.view = 'submenu';
    state.menu = 'Informasi';
    state.submenu = 'Media Digital';
    state.lastActiveMenu = 'Informasi';
    mount(renderPageShell('Informasi', 'Media Digital', renderMediaDigital()));
  } else {
    // index.html: beranda atau shell sub-menu kosong via ?menu=&submenu=
    const validMenu = qMenu && Object.prototype.hasOwnProperty.call(SUB_MENUS, qMenu) ? qMenu : null;
    if(validMenu){
      const validSub = qSub && SUB_MENUS[validMenu].items.indexOf(qSub) !== -1 ? qSub : null;
      // Media Digital punya halaman sendiri — arahkan ke sana
      if(validMenu === 'Informasi' && validSub === 'Media Digital'){
        window.location.replace(PAGE_MEDIASOSIAL);
        return;
      }
      state.view = 'submenu';
      state.menu = validMenu;
      state.submenu = validSub;
      state.lastActiveMenu = validMenu;
      mount(renderPageShell(validMenu, validSub, ''));
    } else {
      state.view = 'beranda';
      state.menu = null; state.submenu = null; state.lastActiveMenu = null;
      mount(renderHero() + renderBerandaSections());
    }
  }

  // Skala & pengukuran ulang
  window.addEventListener('resize', function(){
    updateScale();
    applyZoom();
    measureContentHeight();
    measureNavPositions();
  });
  window.addEventListener('orientationchange', function(){
    setTimeout(function(){
      updateScale();
      applyZoom();
      measureContentHeight();
      measureNavPositions();
    }, 100);
  });
  setTimeout(function(){ updateScale(); applyZoom(); measureContentHeight(); measureNavPositions(); }, 100);
  setTimeout(function(){ updateScale(); applyZoom(); measureContentHeight(); measureNavPositions(); }, 500);
  const content = document.getElementById('content');
  if(content && typeof MutationObserver !== 'undefined'){
    const mo = new MutationObserver(function(){
      requestAnimationFrame(measureContentHeight);
    });
    mo.observe(content, { childList:true, subtree:true, characterData:true });
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
})();

