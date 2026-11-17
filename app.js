/* ============================================================
   T-DEE Production System - Main Application Logic
   app.js
============================================================ */

'use strict';

// ============================================================
// STATE & DATA
// ============================================================

let currentRole = 'pemilik'; // 'pemilik' | 'admin'

// Tarif borongan per pasang (Rp)
let tarif = {
  pola:      5000,
  upper:     18000,
  sol:       8000,
  finishing: 7000
};

// Data pekerja produksi (12 orang sesuai komposisi UMKM T-DEE)
let pekerja = [
  { id: 'P001', nama: 'Pak Suryana',    tahap: 'pola',      telp: '081234567890', aktif: true },
  // 8 pekerja Upper
  { id: 'P002', nama: 'Bu Tati',        tahap: 'upper',     telp: '081345678901', aktif: true },
  { id: 'P003', nama: 'Pak Deden',      tahap: 'upper',     telp: '081456789012', aktif: true },
  { id: 'P004', nama: 'Bu Neni',        tahap: 'upper',     telp: '081567890123', aktif: true },
  { id: 'P005', nama: 'Pak Asep',       tahap: 'upper',     telp: '081678901234', aktif: true },
  { id: 'P006', nama: 'Bu Yati',        tahap: 'upper',     telp: '081789012345', aktif: true },
  { id: 'P007', nama: 'Pak Hendra',     tahap: 'upper',     telp: '081890123456', aktif: true },
  { id: 'P008', nama: 'Bu Lilis',       tahap: 'upper',     telp: '081901234567', aktif: true },
  { id: 'P009', nama: 'Pak Rudi',       tahap: 'upper',     telp: '082012345678', aktif: true },
  // 1 pekerja Sol
  { id: 'P010', nama: 'Pak Wahyu',      tahap: 'sol',       telp: '082123456789', aktif: true },
  // 2 pekerja Finishing
  { id: 'P011', nama: 'Bu Sari',        tahap: 'finishing', telp: '082234567890', aktif: true },
  { id: 'P012', nama: 'Pak Jajang',     tahap: 'finishing', telp: '082345678901', aktif: true },
];

// Orders / Rencana Produksi
let orders = [
  {
    id: 'ORD-2024-001',
    klien: 'Toko Sepatu Maju Jaya - Bandung',
    model: 'Oxford Classic Pria',
    warna: 'Hitam Glossy',
    ukuran: '38(15), 39(25), 40(30), 41(20), 42(10)',
    jumlah: 100,
    target: '2024-11-20',
    tanggalMulai: '2024-11-04',
    catatan: 'Kulit sapi kualitas A, jahitan benang hitam',
    stages: {
      pola:      { selesai: 100, mulai: '2024-11-04' },
      upper:     { selesai: 100, mulai: '2024-11-05' },
      sol:       { selesai: 100, mulai: '2024-11-12' },
      finishing: { selesai: 100, mulai: '2024-11-14' }
    }
  },
  {
    id: 'ORD-2024-002',
    klien: 'CV Anugrah Footwear - Jakarta',
    model: 'Pantofel Semi Formal',
    warna: 'Cokelat Tan',
    ukuran: '39(20), 40(40), 41(30), 42(10)',
    jumlah: 100,
    target: '2024-11-22',
    tanggalMulai: '2024-11-06',
    catatan: 'Model khusus untuk seragam kantor',
    stages: {
      pola:      { selesai: 100, mulai: '2024-11-06' },
      upper:     { selesai: 100, mulai: '2024-11-07' },
      sol:       { selesai: 80,  mulai: '2024-11-13' },
      finishing: { selesai: 0,   mulai: null }
    }
  },
  {
    id: 'ORD-2024-003',
    klien: 'Toko Shoes Corner - Garut',
    model: 'Sneaker Kasual Pria',
    warna: 'Putih Cream',
    ukuran: '40(30), 41(40), 42(20), 43(10)',
    jumlah: 100,
    target: '2024-11-18',
    tanggalMulai: '2024-11-08',
    catatan: 'URGENT - Target sebelum tanggal 18',
    stages: {
      pola:      { selesai: 100, mulai: '2024-11-08' },
      upper:     { selesai: 65,  mulai: '2024-11-09' },
      sol:       { selesai: 0,   mulai: null },
      finishing: { selesai: 0,   mulai: null }
    }
  },
  {
    id: 'ORD-2024-004',
    klien: 'Distributor Nusantara - Surabaya',
    model: 'Heels Wanita Formal',
    warna: 'Hitam Matte',
    ukuran: '36(20), 37(30), 38(25), 39(15), 40(10)',
    jumlah: 100,
    target: '2024-11-28',
    tanggalMulai: '2024-11-11',
    catatan: 'Hak 5cm, kulit sintetis premium',
    stages: {
      pola:      { selesai: 100, mulai: '2024-11-11' },
      upper:     { selesai: 40,  mulai: '2024-11-12' },
      sol:       { selesai: 0,   mulai: null },
      finishing: { selesai: 0,   mulai: null }
    }
  },
  {
    id: 'ORD-2024-005',
    klien: 'Koperasi Pegawai Pemda Garut',
    model: 'Sepatu Dinas PDH',
    warna: 'Hitam Glossy',
    ukuran: '39(10), 40(20), 41(30), 42(20), 43(10), 44(10)',
    jumlah: 100,
    target: '2024-12-05',
    tanggalMulai: '2024-11-14',
    catatan: 'Sesuai standar PDH Pemda, logo tidak diperlukan',
    stages: {
      pola:      { selesai: 60,  mulai: '2024-11-14' },
      upper:     { selesai: 0,   mulai: null },
      sol:       { selesai: 0,   mulai: null },
      finishing: { selesai: 0,   mulai: null }
    }
  },
  {
    id: 'ORD-2024-006',
    klien: 'PT Rimba Retail - Bogor',
    model: 'Loafer Casual Wanita',
    warna: 'Cokelat Muda',
    ukuran: '36(15), 37(25), 38(35), 39(20), 40(5)',
    jumlah: 100,
    target: '2024-12-10',
    tanggalMulai: '2024-11-16',
    catatan: 'Bahan suede, sol tipis',
    stages: {
      pola:      { selesai: 20,  mulai: '2024-11-16' },
      upper:     { selesai: 0,   mulai: null },
      sol:       { selesai: 0,   mulai: null },
      finishing: { selesai: 0,   mulai: null }
    }
  }
];

// Riwayat validasi harian
let riwayatValidasi = [
  // ORD-2024-001 (sudah selesai semua)
  { id: 'V001', tanggal: '2024-11-04', orderId: 'ORD-2024-001', tahap: 'pola',      pekerjaId: 'P001', jumlah: 100, catatan: '',                              upah: 100 * 5000 },
  { id: 'V002', tanggal: '2024-11-05', orderId: 'ORD-2024-001', tahap: 'upper',     pekerjaId: 'P002', jumlah: 15, catatan: '',                               upah: 15 * 18000 },
  { id: 'V003', tanggal: '2024-11-05', orderId: 'ORD-2024-001', tahap: 'upper',     pekerjaId: 'P003', jumlah: 15, catatan: '',                               upah: 15 * 18000 },
  { id: 'V004', tanggal: '2024-11-06', orderId: 'ORD-2024-001', tahap: 'upper',     pekerjaId: 'P004', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V005', tanggal: '2024-11-06', orderId: 'ORD-2024-001', tahap: 'upper',     pekerjaId: 'P005', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V006', tanggal: '2024-11-07', orderId: 'ORD-2024-001', tahap: 'upper',     pekerjaId: 'P006', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V007', tanggal: '2024-11-07', orderId: 'ORD-2024-001', tahap: 'upper',     pekerjaId: 'P007', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V008', tanggal: '2024-11-08', orderId: 'ORD-2024-001', tahap: 'upper',     pekerjaId: 'P008', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V009', tanggal: '2024-11-11', orderId: 'ORD-2024-001', tahap: 'upper',     pekerjaId: 'P009', jumlah: 14, catatan: 'Pekerja kembali setelah libur',   upah: 14 * 18000 },
  { id: 'V010', tanggal: '2024-11-12', orderId: 'ORD-2024-001', tahap: 'sol',       pekerjaId: 'P010', jumlah: 100, catatan: '',                              upah: 100 * 8000 },
  { id: 'V011', tanggal: '2024-11-14', orderId: 'ORD-2024-001', tahap: 'finishing', pekerjaId: 'P011', jumlah: 55, catatan: '',                               upah: 55 * 7000 },
  { id: 'V012', tanggal: '2024-11-15', orderId: 'ORD-2024-001', tahap: 'finishing', pekerjaId: 'P012', jumlah: 45, catatan: '',                               upah: 45 * 7000 },
  // ORD-2024-002
  { id: 'V013', tanggal: '2024-11-06', orderId: 'ORD-2024-002', tahap: 'pola',      pekerjaId: 'P001', jumlah: 100, catatan: '',                              upah: 100 * 5000 },
  { id: 'V014', tanggal: '2024-11-07', orderId: 'ORD-2024-002', tahap: 'upper',     pekerjaId: 'P002', jumlah: 15, catatan: '',                               upah: 15 * 18000 },
  { id: 'V015', tanggal: '2024-11-07', orderId: 'ORD-2024-002', tahap: 'upper',     pekerjaId: 'P003', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V016', tanggal: '2024-11-08', orderId: 'ORD-2024-002', tahap: 'upper',     pekerjaId: 'P004', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V017', tanggal: '2024-11-08', orderId: 'ORD-2024-002', tahap: 'upper',     pekerjaId: 'P005', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V018', tanggal: '2024-11-11', orderId: 'ORD-2024-002', tahap: 'upper',     pekerjaId: 'P006', jumlah: 15, catatan: '',                               upah: 15 * 18000 },
  { id: 'V019', tanggal: '2024-11-11', orderId: 'ORD-2024-002', tahap: 'upper',     pekerjaId: 'P007', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V020', tanggal: '2024-11-12', orderId: 'ORD-2024-002', tahap: 'upper',     pekerjaId: 'P008', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V021', tanggal: '2024-11-13', orderId: 'ORD-2024-002', tahap: 'sol',       pekerjaId: 'P010', jumlah: 80, catatan: 'Lem sol habis, dilanjut besok',   upah: 80 * 8000 },
  // ORD-2024-003
  { id: 'V022', tanggal: '2024-11-08', orderId: 'ORD-2024-003', tahap: 'pola',      pekerjaId: 'P001', jumlah: 100, catatan: '',                              upah: 100 * 5000 },
  { id: 'V023', tanggal: '2024-11-09', orderId: 'ORD-2024-003', tahap: 'upper',     pekerjaId: 'P002', jumlah: 10, catatan: '',                               upah: 10 * 18000 },
  { id: 'V024', tanggal: '2024-11-09', orderId: 'ORD-2024-003', tahap: 'upper',     pekerjaId: 'P003', jumlah: 10, catatan: '',                               upah: 10 * 18000 },
  { id: 'V025', tanggal: '2024-11-11', orderId: 'ORD-2024-003', tahap: 'upper',     pekerjaId: 'P004', jumlah: 10, catatan: '',                               upah: 10 * 18000 },
  { id: 'V026', tanggal: '2024-11-11', orderId: 'ORD-2024-003', tahap: 'upper',     pekerjaId: 'P005', jumlah: 10, catatan: 'Pekerja kurang sehat',            upah: 10 * 18000 },
  { id: 'V027', tanggal: '2024-11-12', orderId: 'ORD-2024-003', tahap: 'upper',     pekerjaId: 'P006', jumlah: 10, catatan: '',                               upah: 10 * 18000 },
  { id: 'V028', tanggal: '2024-11-13', orderId: 'ORD-2024-003', tahap: 'upper',     pekerjaId: 'P007', jumlah: 15, catatan: '',                               upah: 15 * 18000 },
  // ORD-2024-004
  { id: 'V029', tanggal: '2024-11-11', orderId: 'ORD-2024-004', tahap: 'pola',      pekerjaId: 'P001', jumlah: 100, catatan: '',                              upah: 100 * 5000 },
  { id: 'V030', tanggal: '2024-11-12', orderId: 'ORD-2024-004', tahap: 'upper',     pekerjaId: 'P008', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V031', tanggal: '2024-11-12', orderId: 'ORD-2024-004', tahap: 'upper',     pekerjaId: 'P009', jumlah: 14, catatan: '',                               upah: 14 * 18000 },
  { id: 'V032', tanggal: '2024-11-13', orderId: 'ORD-2024-004', tahap: 'upper',     pekerjaId: 'P002', jumlah: 12, catatan: 'Keterlambatan bahan kulit',       upah: 12 * 18000 },
  // ORD-2024-005
  { id: 'V033', tanggal: '2024-11-14', orderId: 'ORD-2024-005', tahap: 'pola',      pekerjaId: 'P001', jumlah: 60, catatan: 'Pola ukuran 44 perlu revisi',    upah: 60 * 5000 },
  // ORD-2024-006
  { id: 'V034', tanggal: '2024-11-16', orderId: 'ORD-2024-006', tahap: 'pola',      pekerjaId: 'P001', jumlah: 20, catatan: '',                               upah: 20 * 5000 },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function formatRupiah(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function formatDate(str) {
  if (!str) return '-';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(d1, d2) {
  const ms = new Date(d2) - new Date(d1);
  return Math.floor(ms / 86400000);
}

function getStageStatus(order, stageKey) {
  const stageOrder = ['pola', 'upper', 'sol', 'finishing'];
  const idx = stageOrder.indexOf(stageKey);
  const stage = order.stages[stageKey];

  if (stage.selesai >= order.jumlah) return 'selesai';
  if (stage.selesai > 0) {
    // Cek apakah terlambat
    const daysRunning = stage.mulai ? daysBetween(stage.mulai, todayStr()) : 0;
    const isLate = isOrderLate(order, stageKey);
    return isLate ? 'terlambat' : 'berjalan';
  }
  // Cek apakah stage sebelumnya sudah selesai
  if (idx > 0) {
    const prevKey = stageOrder[idx - 1];
    if (order.stages[prevKey].selesai >= order.jumlah) return 'menunggu'; // siap dimulai
    return 'menunggu';
  }
  return 'menunggu';
}

function isOrderLate(order, stageKey) {
  const today = new Date(todayStr());
  const target = new Date(order.target);
  const stage = order.stages[stageKey];
  if (!stage.mulai) return false;
  // Hitung target selesai per stage (kasar)
  const stageOrder = ['pola', 'upper', 'sol', 'finishing'];
  const idx = stageOrder.indexOf(stageKey);
  const totalDays = daysBetween(order.tanggalMulai, order.target);
  const stageTargetDays = Math.floor(totalDays / 4);
  const stageDeadline = new Date(order.tanggalMulai);
  stageDeadline.setDate(stageDeadline.getDate() + (idx + 1) * stageTargetDays);
  if (stage.selesai < order.jumlah && today > stageDeadline) return true;
  if (today > target && stage.selesai < order.jumlah) return true;
  return false;
}

function getOrderOverallStatus(order) {
  const all = ['pola','upper','sol','finishing'];
  if (all.every(s => order.stages[s].selesai >= order.jumlah)) return 'selesai';
  const today = new Date(todayStr());
  const target = new Date(order.target);
  if (today > target) return 'terlambat';
  // Cek keterlambatan stage aktif
  for (const s of all) {
    if (isOrderLate(order, s) && order.stages[s].selesai < order.jumlah) return 'terlambat';
  }
  return 'aktif';
}

function getStageDuration(order, stageKey) {
  const stage = order.stages[stageKey];
  if (!stage.mulai) return '-';
  const end = stage.selesai >= order.jumlah ? getStageEndDate(order, stageKey) : todayStr();
  const days = daysBetween(stage.mulai, end || todayStr());
  if (days === 0) return '< 1 hari';
  return days + ' hari';
}

function getStageEndDate(order, stageKey) {
  // Perkiraan: ambil dari riwayat validasi terakhir untuk stage ini
  const records = riwayatValidasi
    .filter(v => v.orderId === order.id && v.tahap === stageKey)
    .sort((a,b) => b.tanggal.localeCompare(a.tanggal));
  if (records.length) return records[0].tanggal;
  return null;
}

function getWeekLabel(weekStart) {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  return formatDate(weekStart) + ' – ' + formatDate(end.toISOString().split('T')[0]);
}

function getWeekStartFor(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0=Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function isInWeek(dateStr, weekStart) {
  const d = new Date(dateStr);
  const ws = new Date(weekStart);
  const we = new Date(weekStart);
  we.setDate(we.getDate() + 6);
  return d >= ws && d <= we;
}

function generateId(prefix) {
  return prefix + '-' + Date.now();
}

// ============================================================
// AUTH / ROLE
// ============================================================

function loginAs(role) {
  currentRole = role;
  document.getElementById('page-login').classList.add('hidden');
  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-app').classList.remove('hidden');
  document.getElementById('page-app').classList.add('active');
  applyRole();
  navigateTo('dashboard');
  updateHeaderDate();
  showToast('Selamat datang, ' + (role === 'pemilik' ? 'Bapak Teddy Rifky!' : 'Admin Operasional!'), 'success');
}

function logout() {
  document.getElementById('page-app').classList.add('hidden');
  document.getElementById('page-app').classList.remove('active');
  document.getElementById('page-login').classList.remove('hidden');
  document.getElementById('page-login').classList.add('active');
  if (window.innerWidth < 900) closeSidebar();
}

function switchRole(role) {
  currentRole = role;
  applyRole();
  showToast('Beralih ke peran: ' + (role === 'pemilik' ? 'Pemilik (Bapak Teddy Rifky)' : 'Admin Operasional'), 'info');
  // Jika di halaman input dan bukan admin, pindah ke dashboard
  const activeContent = document.querySelector('.content-page.active');
  if (activeContent && activeContent.id === 'content-input' && role === 'pemilik') {
    navigateTo('dashboard');
  }
}

function applyRole() {
  const isPemilik = currentRole === 'pemilik';

  // Role toggle buttons
  document.getElementById('role-btn-pemilik').classList.toggle('active', isPemilik);
  document.getElementById('role-btn-admin').classList.toggle('active', !isPemilik);

  // Header user info
  document.getElementById('user-name').textContent = isPemilik ? 'Bapak Teddy Rifky' : 'Admin Operasional';
  document.getElementById('user-role').textContent  = isPemilik ? 'Pemilik' : 'Admin';
  document.getElementById('user-avatar').textContent = isPemilik ? 'TR' : 'AO';

  // Show/hide role-specific elements
  document.querySelectorAll('.pemilik-only').forEach(el => {
    el.style.display = isPemilik ? '' : 'none';
  });

  // Nav input - tampilkan untuk semua tapi Admin-only badge tetap ada
  const navInput = document.getElementById('nav-input');
  if (!isPemilik) {
    navInput.style.opacity = '1';
    navInput.style.pointerEvents = 'auto';
  } else {
    navInput.style.opacity = '0.5';
    navInput.style.pointerEvents = 'auto'; // pemilik tetap bisa lihat, tapi ada badge admin
  }

  // Render ulang komponen yang terpengaruh role
  renderKPI();
  renderOrderTracker();
}

// ============================================================
// NAVIGATION
// ============================================================

function navigateTo(page) {
  // Deactivate all nav and content
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.content-page').forEach(el => el.classList.remove('active'));

  document.getElementById('nav-' + page).classList.add('active');
  document.getElementById('content-' + page).classList.add('active');

  // Page-specific initialization
  if (page === 'dashboard') {
    renderKPI();
    renderOrderTracker();
    renderDelayLog();
  } else if (page === 'input') {
    initInputForm();
    renderRiwayat();
    renderTodayStats();
  } else if (page === 'upah') {
    initUpahPage();
    renderUpah();
  } else if (page === 'settings') {
    renderTarifGrid();
    renderPekerjaTable();
  }

  if (window.innerWidth < 900) closeSidebar();
}

// ============================================================
// SIDEBAR TOGGLE
// ============================================================

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const isOpen = sidebar.classList.contains('open');
  if (isOpen) closeSidebar();
  else {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ============================================================
// HEADER DATE
// ============================================================

function updateHeaderDate() {
  const el = document.getElementById('header-date');
  const now = new Date();
  const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  el.innerHTML = now.toLocaleDateString('id-ID', opts);
}

// ============================================================
// DASHBOARD - KPI
// ============================================================

function renderKPI() {
  const grid = document.getElementById('kpi-grid');
  if (!grid) return;

  const totalAktif = orders.filter(o => getOrderOverallStatus(o) === 'aktif').length;
  const totalSelesai = orders.filter(o => getOrderOverallStatus(o) === 'selesai').length;
  const terlambat = orders.filter(o => getOrderOverallStatus(o) === 'terlambat').length;

  // Sepatu selesai minggu ini (finishing 100%)
  const weekStart = getWeekStartFor(todayStr());
  const selesaiMingguIni = riwayatValidasi
    .filter(v => v.tahap === 'finishing' && isInWeek(v.tanggal, weekStart))
    .reduce((s, v) => s + v.jumlah, 0);

  const targetMinggu = 400;
  const pctTarget = Math.min(100, Math.round(selesaiMingguIni / targetMinggu * 100));

  grid.innerHTML = `
    <div class="kpi-card kpi-brand">
      <div class="kpi-top">
        <div class="kpi-icon"></div>
        <span class="kpi-trend trend-up">+${orders.length} Total</span>
      </div>
      <div class="kpi-value">${totalAktif}</div>
      <div class="kpi-label">Order Aktif</div>
      <div class="kpi-sub">${totalSelesai} order selesai</div>
    </div>
    <div class="kpi-card kpi-blue">
      <div class="kpi-top">
        <div class="kpi-icon"></div>
        <span class="kpi-trend trend-neutral">${pctTarget}%</span>
      </div>
      <div class="kpi-value">${targetMinggu.toLocaleString('id-ID')}</div>
      <div class="kpi-label">Target Pasang Minggu Ini</div>
      <div class="kpi-sub">Progress: ${selesaiMingguIni} / ${targetMinggu} pasang</div>
    </div>
    <div class="kpi-card kpi-green">
      <div class="kpi-top">
        <div class="kpi-icon"></div>
        <span class="kpi-trend trend-up">+${selesaiMingguIni}</span>
      </div>
      <div class="kpi-value">${selesaiMingguIni}</div>
      <div class="kpi-label">Sepatu Selesai Minggu Ini</div>
      <div class="kpi-sub">${pctTarget}% dari target 400 pasang</div>
    </div>
    <div class="kpi-card kpi-red">
      <div class="kpi-top">
        <div class="kpi-icon"></div>
        <span class="kpi-trend trend-down">${terlambat > 0 ? 'Perlu Tindakan' : 'Aman'}</span>
      </div>
      <div class="kpi-value">${terlambat}</div>
      <div class="kpi-label">Order Terlambat / Kendala</div>
      <div class="kpi-sub">${terlambat > 0 ? 'Segera tinjau progress' : 'Semua order on-track'}</div>
    </div>
  `;

  // Alert terlambat
  const alertEl = document.getElementById('delay-alert');
  const alertText = document.getElementById('delay-alert-text');
  if (terlambat > 0) {
    const lateOrders = orders.filter(o => getOrderOverallStatus(o) === 'terlambat')
      .map(o => o.id).join(', ');
    alertText.textContent = ` ${terlambat} order melewati target atau terdapat kendala: ${lateOrders}`;
    alertEl.style.display = 'flex';
  } else {
    alertEl.style.display = 'none';
  }
}

// ============================================================
// DASHBOARD - ORDER TRACKER
// ============================================================

function renderOrderTracker() {
  const container = document.getElementById('order-tracker');
  if (!container) return;

  const filter = document.getElementById('filter-order-status')?.value || 'all';
  const stageLabels = { pola: 'Pola', upper: 'Upper', sol: 'Sol', finishing: 'Finishing' };
  const stageIcons  = { pola: 'Pola', upper: 'Upper', sol: 'Sol', finishing: 'Finishing' };

  let filtered = orders;
  if (filter !== 'all') {
    filtered = orders.filter(o => getOrderOverallStatus(o) === filter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon"></div><p>Tidak ada order ditemukan</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(order => {
    const status = getOrderOverallStatus(order);
    const statusLabel = { aktif: 'Aktif', selesai: 'Selesai', terlambat: 'Terlambat' }[status];
    const daysLeft = daysBetween(todayStr(), order.target);
    const daysLeftText = daysLeft < 0 ? `${Math.abs(daysLeft)} hari lewat` : (daysLeft === 0 ? 'Hari ini' : `${daysLeft} hari lagi`);

    const stagesHtml = ['pola','upper','sol','finishing'].map(sk => {
      const st = order.stages[sk];
      const stStatus = getStageStatus(order, sk);
      const pct = Math.round(st.selesai / order.jumlah * 100);
      const dur = getStageDuration(order, sk);
      return `
        <div class="stage-card stage-${stStatus}">
          <div class="stage-header">
            <span class="stage-name">${stageIcons[sk]} ${stageLabels[sk]}</span>
            <div class="stage-dot"></div>
          </div>
          <div class="stage-progress-wrap">
            <div class="stage-numbers">
              <span>Selesai</span>
              <span>${st.selesai}/${order.jumlah}</span>
            </div>
            <div class="stage-current-val">${pct}%</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${pct}%"></div>
            </div>
          </div>
          <div class="stage-duration">⏱ ${dur}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="order-card ${status === 'terlambat' ? 'order-terlambat' : ''}">
        <div class="order-card-header" onclick="openDetailOrder('${order.id}')">
          <div class="order-info">
            <div class="order-code">${order.id}</div>
            <div class="order-name">${order.klien}</div>
            <div class="order-meta">
              <span class="order-meta-chip">${order.model}</span>
              <span class="order-meta-chip">${order.warna}</span>
              <span class="order-meta-chip">${order.jumlah} Pasang</span>
              <span class="order-meta-chip">Target: ${formatDate(order.target)}</span>
            </div>
          </div>
          <div class="order-badges">
            <span class="kpi-trend ${daysLeft < 0 ? 'trend-down' : daysLeft <= 3 ? 'trend-down' : 'trend-neutral'}">${daysLeftText}</span>
            <span class="status-badge status-${status}">${statusLabel}</span>
          </div>
        </div>
        <div class="order-stages">${stagesHtml}</div>
      </div>
    `;
  }).join('');
}

// ============================================================
// DASHBOARD - DELAY LOG
// ============================================================

function renderDelayLog() {
  const container = document.getElementById('delay-log');
  const countEl   = document.getElementById('delay-log-count');
  if (!container) return;

  const logs = riwayatValidasi
    .filter(v => v.catatan && v.catatan.trim() !== '')
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  countEl.textContent = logs.length;

  if (logs.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon"></div><p>Tidak ada catatan kendala</p></div>`;
    return;
  }

  container.innerHTML = logs.map(v => {
    const pk = pekerja.find(p => p.id === v.pekerjaId);
    const ord = orders.find(o => o.id === v.orderId);
    return `
      <div class="delay-item">
        <div class="delay-icon"></div>
        <div class="delay-info">
          <div class="delay-title">${ord ? ord.id : v.orderId} · ${v.tahap.charAt(0).toUpperCase() + v.tahap.slice(1)} · ${pk ? pk.nama : v.pekerjaId}</div>
          <div class="delay-desc">${v.catatan}</div>
        </div>
        <div class="delay-time">${formatDate(v.tanggal)}</div>
      </div>
    `;
  }).join('');
}

// ============================================================
// INPUT FORM
// ============================================================

function initInputForm() {
  // Set default date ke hari ini
  document.getElementById('f-tanggal').value = todayStr();

  // Populate order dropdown
  const orderSel = document.getElementById('f-order');
  orderSel.innerHTML = '<option value="">-- Pilih Order --</option>';
  orders.filter(o => getOrderOverallStatus(o) !== 'selesai').forEach(o => {
    orderSel.innerHTML += `<option value="${o.id}">${o.id} – ${o.klien}</option>`;
  });

  updateTahapOptions();
  updatePekerjaOptions();
  hideKuotaInfo();
}

function updateTahapOptions() {
  // Tahap dipilih manual, tidak tergantung order saat ini
  // Hanya reset pekerja
  updatePekerjaOptions();
  updateKuotaInfo();
}

function updatePekerjaOptions() {
  const tahap = document.getElementById('f-tahap').value;
  const pekerjaSel = document.getElementById('f-pekerja');
  pekerjaSel.innerHTML = '<option value="">-- Pilih Pekerja --</option>';

  if (!tahap) return;

  pekerja.filter(p => p.tahap === tahap && p.aktif).forEach(p => {
    pekerjaSel.innerHTML += `<option value="${p.id}">${p.nama}</option>`;
  });

  updateKuotaInfo();
}

function updateKuotaInfo() {
  const orderId = document.getElementById('f-order').value;
  const tahap   = document.getElementById('f-tahap').value;

  if (!orderId || !tahap) { hideKuotaInfo(); return; }

  const order = orders.find(o => o.id === orderId);
  if (!order) { hideKuotaInfo(); return; }

  const stage = order.stages[tahap];
  const selesai = stage.selesai;
  const total = order.jumlah;
  const pct = Math.min(100, Math.round(selesai / total * 100));
  const sisa = total - selesai;

  document.getElementById('kuota-info').style.display = 'block';
  document.getElementById('kuota-text').textContent = `${selesai} / ${total} Pasang`;
  document.getElementById('kuota-fill').style.width = pct + '%';
  document.getElementById('kuota-sisa-val').textContent = sisa;
  document.getElementById('f-jumlah').max = sisa;
}

function hideKuotaInfo() {
  document.getElementById('kuota-info').style.display = 'none';
}

function resetForm() {
  document.getElementById('f-tanggal').value = todayStr();
  document.getElementById('f-order').value = '';
  document.getElementById('f-tahap').value = '';
  document.getElementById('f-jumlah').value = '';
  document.getElementById('f-catatan').value = '';
  updatePekerjaOptions();
  hideKuotaInfo();
}

function submitProgres(e) {
  e.preventDefault();

  const tanggal   = document.getElementById('f-tanggal').value;
  const orderId   = document.getElementById('f-order').value;
  const tahap     = document.getElementById('f-tahap').value;
  const pekerjaId = document.getElementById('f-pekerja').value;
  const jumlahRaw = parseInt(document.getElementById('f-jumlah').value);
  const catatan   = document.getElementById('f-catatan').value.trim();

  // Validasi
  if (!tanggal || !orderId || !tahap || !pekerjaId || !jumlahRaw) {
    showToast('Lengkapi semua field yang wajib diisi!', 'error'); return;
  }
  if (jumlahRaw <= 0) {
    showToast('Jumlah pasang tidak boleh 0 atau negatif!', 'error'); return;
  }

  const order = orders.find(o => o.id === orderId);
  if (!order) { showToast('Order tidak ditemukan!', 'error'); return; }

  const stage = order.stages[tahap];
  const sisa = order.jumlah - stage.selesai;

  if (jumlahRaw > sisa) {
    showToast(`Jumlah melebihi sisa kuota! Sisa: ${sisa} pasang`, 'error'); return;
  }

  // Cek pekerja sesuai tahap
  const pk = pekerja.find(p => p.id === pekerjaId);
  if (pk && pk.tahap !== tahap) {
    showToast(`Pekerja ${pk.nama} bukan bagian ${tahap}!`, 'error'); return;
  }

  // Update stages
  stage.selesai += jumlahRaw;
  if (!stage.mulai) stage.mulai = tanggal;

  // Hitung upah
  const upahPerPasang = tarif[tahap] || 0;
  const totalUpah = jumlahRaw * upahPerPasang;

  // Tambah riwayat
  const newValidasi = {
    id: generateId('V'),
    tanggal, orderId, tahap, pekerjaId,
    jumlah: jumlahRaw,
    catatan,
    upah: totalUpah
  };
  riwayatValidasi.unshift(newValidasi);

  showToast(`✅ Validasi berhasil! ${jumlahRaw} pasang · ${formatRupiah(totalUpah)}`, 'success');
  resetForm();
  renderRiwayat();
  renderTodayStats();
  renderKPI();
}

// ============================================================
// RIWAYAT VALIDASI
// ============================================================

function renderRiwayat() {
  const tbody = document.getElementById('riwayat-tbody');
  if (!tbody) return;

  const filterTahap = document.getElementById('filter-riwayat-tahap')?.value || 'all';
  const tahapLabels = { pola: 'Pola', upper: 'Upper', sol: 'Sol', finishing: 'Finishing' };
  const tahapColors = { pola: 'trend-neutral', upper: 'trend-up', sol: 'trend-neutral', finishing: 'trend-up' };

  let filtered = [...riwayatValidasi].sort((a,b) => b.tanggal.localeCompare(a.tanggal));
  if (filterTahap !== 'all') filtered = filtered.filter(v => v.tahap === filterTahap);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--slate-400);padding:24px">Belum ada riwayat validasi</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(v => {
    const pk  = pekerja.find(p => p.id === v.pekerjaId);
    const ord = orders.find(o => o.id === v.orderId);
    return `
      <tr>
        <td><span style="font-weight:600;color:var(--slate-700)">${formatDate(v.tanggal)}</span></td>
        <td><span style="font-size:0.78rem;font-weight:700;color:var(--brand-700)">${v.orderId}</span><br><span style="font-size:0.72rem;color:var(--slate-400)">${ord ? ord.model : ''}</span></td>
        <td><span class="status-badge status-berjalan" style="font-size:0.68rem">${tahapLabels[v.tahap]}</span></td>
        <td><span style="font-weight:600">${pk ? pk.nama : v.pekerjaId}</span></td>
        <td><span style="font-weight:700;color:var(--slate-900)">${v.jumlah}</span> <span style="font-size:0.75rem;color:var(--slate-400)">pasang</span></td>
        <td><span style="font-weight:700;color:var(--green-700)">${formatRupiah(v.upah)}</span></td>
        <td>${v.catatan ? `<span style="font-size:0.78rem;color:var(--orange-500)" title="${v.catatan}">${v.catatan.substring(0,30)}${v.catatan.length>30?'...':''}</span>` : '<span style="color:var(--slate-300)">–</span>'}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="deleteValidasi('${v.id}')" title="Hapus"></button>
        </td>
      </tr>
    `;
  }).join('');
}

function deleteValidasi(id) {
  if (!confirm('Hapus entri validasi ini? Progres order akan dikurangi kembali.')) return;
  const idx = riwayatValidasi.findIndex(v => v.id === id);
  if (idx === -1) return;
  const v = riwayatValidasi[idx];
  // Kurangi stages
  const order = orders.find(o => o.id === v.orderId);
  if (order) {
    order.stages[v.tahap].selesai = Math.max(0, order.stages[v.tahap].selesai - v.jumlah);
  }
  riwayatValidasi.splice(idx, 1);
  renderRiwayat();
  renderTodayStats();
  renderKPI();
  showToast('Entri validasi dihapus', 'warning');
}

// ============================================================
// TODAY STATS
// ============================================================

function renderTodayStats() {
  const container = document.getElementById('today-stats');
  if (!container) return;

  const today = todayStr();
  const todayRecords = riwayatValidasi.filter(v => v.tanggal === today);
  const totalPasang  = todayRecords.reduce((s, v) => s + v.jumlah, 0);
  const totalUpah    = todayRecords.reduce((s, v) => s + v.upah, 0);
  const jumlahPerkerja = [...new Set(todayRecords.map(v => v.pekerjaId))].length;
  const jumlahOrder  = [...new Set(todayRecords.map(v => v.orderId))].length;

  container.innerHTML = [
    { icon: '', label: 'Total Pasang', val: totalPasang + ' pasang', bg: '#FEF3C7' },
    { icon: '', label: 'Total Upah Hari Ini', val: formatRupiah(totalUpah), bg: '#DCFCE7' },
    { icon: '', label: 'Pekerja Tercatat', val: jumlahPerkerja + ' orang', bg: '#DBEAFE' },
    { icon: '', label: 'Order Dikerjakan', val: jumlahOrder + ' order', bg: '#F3E8FF' },
  ].map(s => `
    <div class="today-stat-item">
      <div class="today-stat-label">
        <div class="today-stat-icon" style="background:${s.bg}">${s.icon}</div>
        ${s.label}
      </div>
      <div class="today-stat-value">${s.val}</div>
    </div>
  `).join('');
}

// ============================================================
// REKAPITULASI UPAH
// ============================================================

function initUpahPage() {
  const sel = document.getElementById('filter-minggu');
  if (!sel) return;

  // Kumpulkan semua minggu yang ada di riwayat
  const weeks = [...new Set(riwayatValidasi.map(v => getWeekStartFor(v.tanggal)))].sort().reverse();
  sel.innerHTML = weeks.map(w => `<option value="${w}">${getWeekLabel(w)}</option>`).join('');
}

function renderUpah() {
  const weekStart   = document.getElementById('filter-minggu')?.value;
  const filterTahap = document.getElementById('filter-upah-tahap')?.value || 'all';
  if (!weekStart) return;

  // Filter validasi untuk minggu ini
  let filtered = riwayatValidasi.filter(v => isInWeek(v.tanggal, weekStart));
  if (filterTahap !== 'all') filtered = filtered.filter(v => v.tahap === filterTahap);

  // Agregasi per pekerja
  const pekerjaMap = {};
  filtered.forEach(v => {
    if (!pekerjaMap[v.pekerjaId]) {
      pekerjaMap[v.pekerjaId] = { totalPasang: 0, totalUpah: 0, records: [] };
    }
    pekerjaMap[v.pekerjaId].totalPasang += v.jumlah;
    pekerjaMap[v.pekerjaId].totalUpah   += v.upah;
    pekerjaMap[v.pekerjaId].records.push(v);
  });

  const tahapLabels = { pola: 'Pola', upper: 'Upper', sol: 'Sol', finishing: 'Finishing' };
  const tbody = document.getElementById('upah-tbody');
  const grandTotalEl = document.getElementById('grand-total-upah');

  const entries = Object.entries(pekerjaMap);
  let grandTotal = 0;

  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--slate-400);padding:24px">Tidak ada data upah untuk periode ini</td></tr>`;
    grandTotalEl.textContent = formatRupiah(0);
    renderUpahSummary(0, 0, 0, 0);
    return;
  }

  tbody.innerHTML = entries.map(([pid, data], idx) => {
    const pk = pekerja.find(p => p.id === pid);
    grandTotal += data.totalUpah;
    return `
      <tr>
        <td style="font-weight:600;color:var(--slate-500)">${idx + 1}</td>
        <td>
          <div style="font-weight:700;color:var(--slate-900)">${pk ? pk.nama : pid}</div>
        </td>
        <td><span class="status-badge status-berjalan">${pk ? tahapLabels[pk.tahap] : '-'}</span></td>
        <td><span style="font-weight:700;font-size:1.05rem">${data.totalPasang.toLocaleString('id-ID')}</span> <span style="color:var(--slate-400);font-size:0.78rem">pasang</span></td>
        <td style="font-weight:600;color:var(--brand-700)">${formatRupiah(pk ? tarif[pk.tahap] : 0)}</td>
        <td><span style="font-weight:800;color:var(--green-700);font-size:1.05rem">${formatRupiah(data.totalUpah)}</span></td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="openSlipUpah('${pid}', '${weekStart}')">🧾 Slip</button>
        </td>
      </tr>
    `;
  }).join('');

  grandTotalEl.textContent = formatRupiah(grandTotal);

  // Summary cards
  const totalPasangAll = entries.reduce((s, [, d]) => s + d.totalPasang, 0);
  const jumlahPekerja  = entries.length;
  const rataUpah       = jumlahPekerja > 0 ? Math.round(grandTotal / jumlahPekerja) : 0;
  renderUpahSummary(grandTotal, totalPasangAll, jumlahPekerja, rataUpah);
}

function renderUpahSummary(total, pasang, pekerjaCount, rata) {
  const grid = document.getElementById('upah-summary-grid');
  if (!grid) return;
  grid.innerHTML = [
    { icon: '', val: formatRupiah(total),  label: 'Total Pengeluaran Upah' },
    { icon: '', val: pasang.toLocaleString('id-ID') + ' pasang', label: 'Total Pasang Dikerjakan' },
    { icon: '', val: pekerjaCount + ' orang', label: 'Pekerja Aktif Periode Ini' },
    { icon: '', val: formatRupiah(rata),   label: 'Rata-rata Upah per Pekerja' },
  ].map(c => `
    <div class="upah-summary-card">
      <div class="upah-summary-icon">${c.icon}</div>
      <div class="upah-summary-val">${c.val}</div>
      <div class="upah-summary-label">${c.label}</div>
    </div>
  `).join('');
}

function openSlipUpah(pekerjaId, weekStart) {
  const pk = pekerja.find(p => p.id === pekerjaId);
  if (!pk) return;

  const records = riwayatValidasi
    .filter(v => v.pekerjaId === pekerjaId && isInWeek(v.tanggal, weekStart))
    .sort((a,b) => a.tanggal.localeCompare(b.tanggal));

  const totalPasang = records.reduce((s, v) => s + v.jumlah, 0);
  const totalUpah   = records.reduce((s, v) => s + v.upah, 0);
  const tahapLabels = { pola: 'Pola', upper: 'Upper', sol: 'Sol', finishing: 'Finishing' };

  const content = document.getElementById('slip-content');
  content.innerHTML = `
    <div class="slip-header">
      <div class="slip-logo">T-DEE</div>
      <div class="slip-title">SLIP UPAH BORONGAN · ${getWeekLabel(weekStart)}</div>
    </div>
    <div class="slip-info-grid">
      <div class="slip-info-item"><label>Nama Pekerja</label><span>${pk.nama}</span></div>
      <div class="slip-info-item"><label>Bagian</label><span>${tahapLabels[pk.tahap]}</span></div>
      <div class="slip-info-item"><label>ID Pekerja</label><span>${pk.id}</span></div>
      <div class="slip-info-item"><label>Tarif / Pasang</label><span>${formatRupiah(tarif[pk.tahap])}</span></div>
    </div>
    <table class="slip-detail-table">
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Order</th>
          <th>Tahap</th>
          <th>Pasang</th>
          <th>Upah</th>
          <th>Catatan</th>
        </tr>
      </thead>
      <tbody>
        ${records.map(v => {
          const ord = orders.find(o => o.id === v.orderId);
          return `
            <tr>
              <td>${formatDate(v.tanggal)}</td>
              <td style="font-weight:600;font-size:0.75rem;color:var(--brand-700)">${v.orderId}</td>
              <td>${tahapLabels[v.tahap]}</td>
              <td style="font-weight:700">${v.jumlah}</td>
              <td style="font-weight:700;color:var(--green-700)">${formatRupiah(v.upah)}</td>
              <td style="font-size:0.75rem;color:var(--slate-500)">${v.catatan || '–'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    <div class="slip-total">
      <div>
        <div class="slip-total-label">Total Pasang: <strong>${totalPasang} pasang</strong></div>
        <div style="font-size:0.75rem;opacity:.8">Periode: ${getWeekLabel(weekStart)}</div>
      </div>
      <div class="slip-total-val">${formatRupiah(totalUpah)}</div>
    </div>
    <div style="text-align:center;margin-top:12px;font-size:0.72rem;color:var(--slate-400)">
      Dicetak oleh Sistem T-DEE Production · ${new Date().toLocaleString('id-ID')}
    </div>
  `;

  openModal('modal-slip');
}

function printSlip() {
  window.print();
}

function printUpah() {
  window.print();
}

// ============================================================
// SETTINGS - TARIF
// ============================================================

function renderTarifGrid() {
  const grid = document.getElementById('tarif-grid');
  if (!grid) return;

  const stages = [
    { key: 'pola',      label: 'Pola',      icon: '', desc: '1 pekerja – memotong pola kulit sesuai ukuran' },
    { key: 'upper',     label: 'Upper',     icon: '', desc: '8 pekerja – menjahit bagian atas sepatu' },
    { key: 'sol',       label: 'Sol',       icon: '', desc: '1 pekerja – memasang dan merekatkan sol' },
    { key: 'finishing', label: 'Finishing', icon: '', desc: '2 pekerja – penyelesaian akhir & QC' },
  ];

  grid.innerHTML = stages.map(s => `
    <div class="tarif-item">
      <div class="tarif-label">
        <div class="tarif-stage-icon" style="background:var(--brand-100)">${s.icon}</div>
        ${s.label}
      </div>
      <div class="tarif-input-wrap">
        <span class="tarif-prefix">Rp</span>
        <input class="tarif-input" id="tarif-${s.key}" type="number" value="${tarif[s.key]}" min="0" step="500">
      </div>
      <div class="tarif-desc">${s.desc}</div>
    </div>
  `).join('');
}

function saveTarif() {
  ['pola','upper','sol','finishing'].forEach(k => {
    const val = parseInt(document.getElementById('tarif-' + k)?.value);
    if (!isNaN(val) && val >= 0) tarif[k] = val;
  });
  showToast('Tarif borongan berhasil disimpan!', 'success');
  renderUpah();
}

// ============================================================
// SETTINGS - PEKERJA TABLE
// ============================================================

function renderPekerjaTable() {
  const tbody = document.getElementById('pekerja-tbody');
  if (!tbody) return;

  const tahapLabels = { pola: 'Pola', upper: 'Upper', sol: 'Sol', finishing: 'Finishing' };
  const weekStart = getWeekStartFor(todayStr());

  tbody.innerHTML = pekerja.map((pk, idx) => {
    // Hitung total upah minggu ini
    const upahMingguIni = riwayatValidasi
      .filter(v => v.pekerjaId === pk.id && isInWeek(v.tanggal, weekStart))
      .reduce((s, v) => s + v.upah, 0);

    return `
      <tr>
        <td style="font-weight:600;color:var(--slate-500)">${idx + 1}</td>
        <td style="font-weight:700">${pk.nama}</td>
        <td><span class="status-badge status-berjalan">${tahapLabels[pk.tahap]}</span></td>
        <td style="font-weight:600;color:var(--brand-700)">${formatRupiah(tarif[pk.tahap])}/pasang</td>
        <td style="font-weight:700;color:var(--green-700)">${formatRupiah(upahMingguIni)}</td>
        <td>
          <span class="status-badge ${pk.aktif ? 'status-selesai' : 'status-terlambat'}">
            ${pk.aktif ? 'Aktif' : 'Nonaktif'}
          </span>
        </td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-sm btn-secondary" onclick="toggleAktifPekerja('${pk.id}')">
              ${pk.aktif ? '⏸ Nonaktifkan' : '▶ Aktifkan'}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleAktifPekerja(id) {
  const pk = pekerja.find(p => p.id === id);
  if (!pk) return;
  pk.aktif = !pk.aktif;
  renderPekerjaTable();
  showToast(`${pk.nama} ${pk.aktif ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
}

function openModalPekerja() {
  document.getElementById('p-nama').value = '';
  document.getElementById('p-tahap').value = '';
  document.getElementById('p-telp').value = '';
  openModal('modal-pekerja');
}

function submitPekerja(e) {
  e.preventDefault();
  const nama  = document.getElementById('p-nama').value.trim();
  const tahap = document.getElementById('p-tahap').value;
  const telp  = document.getElementById('p-telp').value.trim();

  if (!nama || !tahap) { showToast('Lengkapi nama dan bagian pekerja!', 'error'); return; }

  const newPekerja = {
    id: 'P' + String(pekerja.length + 1).padStart(3, '0'),
    nama, tahap, telp, aktif: true
  };
  pekerja.push(newPekerja);
  renderPekerjaTable();
  closeModal('modal-pekerja');
  showToast(`Pekerja ${nama} berhasil ditambahkan!`, 'success');
}

// ============================================================
// MODAL ORDER
// ============================================================

function openModalOrder() {
  // Generate kode order
  const nextNum = String(orders.length + 1).padStart(3, '0');
  const year = new Date().getFullYear();
  document.getElementById('o-kode').value = `ORD-${year}-${nextNum}`;
  document.getElementById('o-klien').value = '';
  document.getElementById('o-model').value = '';
  document.getElementById('o-warna').value = '';
  document.getElementById('o-jumlah').value = '';
  document.getElementById('o-ukuran').value = '';
  document.getElementById('o-catatan').value = '';
  // Default target 2 minggu dari sekarang
  const target = new Date();
  target.setDate(target.getDate() + 14);
  document.getElementById('o-target').value = target.toISOString().split('T')[0];
  openModal('modal-order');
}

function submitOrder(e) {
  e.preventDefault();

  const kode   = document.getElementById('o-kode').value;
  const klien  = document.getElementById('o-klien').value.trim();
  const model  = document.getElementById('o-model').value.trim();
  const warna  = document.getElementById('o-warna').value.trim();
  const jumlah = parseInt(document.getElementById('o-jumlah').value);
  const target = document.getElementById('o-target').value;
  const ukuran = document.getElementById('o-ukuran').value.trim();
  const catatan= document.getElementById('o-catatan').value.trim();

  if (!klien || !model || !warna || !jumlah || !target) {
    showToast('Lengkapi semua field yang wajib!', 'error'); return;
  }
  if (jumlah <= 0) {
    showToast('Jumlah pasang harus lebih dari 0!', 'error'); return;
  }

  const newOrder = {
    id: kode,
    klien, model, warna,
    ukuran: ukuran || '-',
    jumlah, target,
    tanggalMulai: todayStr(),
    catatan,
    stages: {
      pola:      { selesai: 0, mulai: null },
      upper:     { selesai: 0, mulai: null },
      sol:       { selesai: 0, mulai: null },
      finishing: { selesai: 0, mulai: null }
    }
  };

  orders.push(newOrder);
  closeModal('modal-order');
  renderKPI();
  renderOrderTracker();
  showToast(`Order ${kode} untuk ${klien} berhasil dibuat!`, 'success');
}

// ============================================================
// MODAL DETAIL ORDER
// ============================================================

function openDetailOrder(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const status = getOrderOverallStatus(order);
  const statusLabel = { aktif: 'Aktif', selesai: 'Selesai', terlambat: 'Terlambat' }[status];
  const tahapLabels = { pola: 'Pola', upper: 'Upper', sol: 'Sol', finishing: 'Finishing' };

  // Riwayat untuk order ini
  const orderRecords = riwayatValidasi
    .filter(v => v.orderId === orderId)
    .sort((a,b) => b.tanggal.localeCompare(a.tanggal));

  const content = document.getElementById('detail-order-content');
  content.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
      <div>
        <span style="font-size:0.75rem;font-weight:700;color:var(--brand-700);letter-spacing:.5px">${order.id}</span>
        <h3 style="font-size:1.1rem;font-weight:800;color:var(--slate-900);margin-top:4px">${order.klien}</h3>
      </div>
      <span class="status-badge status-${status}">${statusLabel}</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      ${[
        ['Model', order.model], ['Warna', order.warna],
        ['Jumlah', order.jumlah + ' pasang'], ['Target', formatDate(order.target)],
        ['Mulai Produksi', formatDate(order.tanggalMulai)], ['Ukuran', order.ukuran || '-'],
      ].map(([l, v]) => `
        <div style="background:var(--slate-50);border-radius:8px;padding:10px 12px;border:1px solid var(--slate-200)">
          <div style="font-size:0.72rem;font-weight:600;color:var(--slate-500);margin-bottom:3px">${l}</div>
          <div style="font-size:0.9rem;font-weight:600;color:var(--slate-800)">${v}</div>
        </div>
      `).join('')}
    </div>
    ${order.catatan ? `<div style="background:var(--brand-50);border:1px solid var(--brand-200);border-radius:8px;padding:10px 12px;margin-bottom:16px;font-size:0.85rem;color:var(--slate-700)">📝 ${order.catatan}</div>` : ''}
    <h4 style="font-size:0.88rem;font-weight:700;margin-bottom:10px;color:var(--slate-700)">Log Riwayat Produksi (${orderRecords.length} entri)</h4>
    ${orderRecords.length > 0 ? `
      <div style="border:1px solid var(--slate-200);border-radius:8px;overflow:hidden;max-height:260px;overflow-y:auto">
        <table style="width:100%;border-collapse:collapse;font-size:0.82rem">
          <thead><tr>
            <th style="padding:8px 10px;background:var(--slate-800);color:white;text-align:left;font-size:0.72rem">Tanggal</th>
            <th style="padding:8px 10px;background:var(--slate-800);color:white;text-align:left;font-size:0.72rem">Tahap</th>
            <th style="padding:8px 10px;background:var(--slate-800);color:white;text-align:left;font-size:0.72rem">Pekerja</th>
            <th style="padding:8px 10px;background:var(--slate-800);color:white;text-align:left;font-size:0.72rem">Pasang</th>
            <th style="padding:8px 10px;background:var(--slate-800);color:white;text-align:left;font-size:0.72rem">Catatan</th>
          </tr></thead>
          <tbody>
            ${orderRecords.map(v => {
              const pk = pekerja.find(p => p.id === v.pekerjaId);
              return `<tr>
                <td style="padding:7px 10px;border-bottom:1px solid var(--slate-100)">${formatDate(v.tanggal)}</td>
                <td style="padding:7px 10px;border-bottom:1px solid var(--slate-100)"><span class="status-badge status-berjalan" style="font-size:0.65rem">${tahapLabels[v.tahap]}</span></td>
                <td style="padding:7px 10px;border-bottom:1px solid var(--slate-100);font-weight:600">${pk ? pk.nama : v.pekerjaId}</td>
                <td style="padding:7px 10px;border-bottom:1px solid var(--slate-100);font-weight:700">${v.jumlah}</td>
                <td style="padding:7px 10px;border-bottom:1px solid var(--slate-100);color:var(--slate-500);font-size:0.75rem">${v.catatan || '–'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    ` : `<div class="empty-state" style="padding:16px"><p>Belum ada riwayat produksi</p></div>`}
  `;

  openModal('modal-detail-order');
}

// ============================================================
// MODAL HELPERS
// ============================================================

function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons = { success: '', error: '', warning: '', info: '' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderDate();

  // Keyboard shortcut ESC menutup modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });

  // Set initial state login page
  document.getElementById('page-login').classList.add('active');
});
