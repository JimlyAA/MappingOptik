// Inisialisasi Peta
const map = L.map('map').setView([-6.385, 106.83], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Data Lokasi Optik (PASTIKAN ANDA SUDAH MENGISINYA DENGAN KECAMATAN)
const dataToko = [
    { nama: "kajamata", kecamatan: "Beji", lat: -6.352943247241355, lon: 106.83688346770158 },
    { nama: "Optik yogya", kecamatan: "Sukmajaya", lat: -6.355037412823192, lon: 106.84279919005748 },
    { nama: "Optik mikeda", kecamatan: "Beji", lat: -6.358804721947621, lon: 106.8203525052386 },
    { nama: "Optik seis", kecamatan: "Beji", lat: -6.3702351485575255, lon: 106.84060854681871 },
    { nama: "pesona square seis", kecamatan: "Sukmajaya", lat: -6.377741558914672, lon: 106.8503932448701 },
    { nama: "kacamata blushing depok", kecamatan: "Sukmajaya", lat: -6.351127427058779, lon: 106.84043688544939 },
    { nama: "Banana optik", kecamatan: "Beji", lat: -6.359765121814708, lon: 106.8325534935426 },
    { nama: "Ezia margonda", kecamatan: "Beji", lat: -6.369469914174375, lon: 106.8372984476038 },
    { nama: "Optik Saturdays", kecamatan: "Beji", lat: -6.373043999014269, lon: 106.8338688799091 },
    { nama: "Optik melawai margo city", kecamatan: "Beji", lat: -6.373534475359879, lon: 106.83451261004404 },
    { nama: "Optik your glasses store", kecamatan: "Pancoran Mas", lat: -6.379867975593465, lon: 106.832559961968 },
    { nama: "Optik express", kecamatan: "Pancoran Mas", lat: -6.370183421595739, lon: 106.81477742125007 },
    { nama: "Optik tunggal margo city depok", kecamatan: "Beji", lat: -6.372793548719584, lon: 106.83462605358382 },
    { nama: "Optik PABD Melawai Margonda", kecamatan: "Pancoran Mas", lat: -6.385370077232084, lon: 106.82897948426852 },
    { nama: "King optik", kecamatan: "Pancoran Mas", lat: -6.3704564469711435, lon: 106.79984719111513 },
    { nama: "Optik Kusuma Depok Town Square", kecamatan: "Beji", lat: -6.371685997251732, lon: 106.83116030755686 },
    { nama: "Optik AZ10", kecamatan: "Pancoran Mas", lat: -6.380557829793153, lon: 106.81454656043047 },
    { nama: "Visio first Optik depok town square", kecamatan: "Beji", lat: -6.371631871678194, lon: 106.83073256632741 },
    { nama: "Optik Ezia - Depok Town Square", kecamatan: "Beji", lat: -6.372049298378823, lon: 106.83235931156004 },
    { nama: "Optik Melawai - Verbena Grand Depok City", kecamatan: "Sukmajaya", lat: -6.412249372654965, lon: 106.82101751935564 },
    { nama: "DHANIA OPTIC GRAND DEPOK CITY", kecamatan: "Cilodong", lat: -6.4125295677888134, lon: 106.8201057700838 },
    { nama: "Optik B.RISKI DEPOK", kecamatan: "Sukmajaya", lat: -6.421696870672656, lon: 106.8281170428903 },
    { nama: "Optik Bimo", kecamatan: "Sukmajaya", lat: -6.426039219696846, lon: 106.82192651390345 },
    { nama: "Optik MARLIN", kecamatan: "Cilodong", lat: -6.432311436177565, lon: 106.82629629907063 },
    { nama: "Green Optik", kecamatan: "Sukmajaya", lat: -6.432350973370834, lon: 106.8460130747702 },
    { nama: "OPTIK PADI GDC", kecamatan: "Cilodong", lat: -6.4403682046377515, lon: 106.8210850351199 },
    { nama: "OPTIK POLARIS", kecamatan: "Cilodong", lat: -6.442255594394748, lon: 106.81943624773703 }
];


// Variabel Global
const markers = {};
let geojsonDataKecamatan; // Untuk menyimpan data GeoJSON kecamatan
let currentBoundaryLayer = null; // Untuk melacak layer batas yang sedang aktif

// --- FUNGSI-FUNGSI UTAMA ---

// Mengisi daftar sidebar
function populateSidebar(data) {
    const storeList = document.getElementById('store-list');
    const storeCount = document.getElementById('store-count');
    storeList.innerHTML = '';
    storeCount.textContent = data.length;

    if (data.length === 0) {
        storeList.innerHTML = `<li class="p-4 text-center text-gray-500">Lokasi tidak ditemukan.</li>`;
        return;
    }

    data.forEach(toko => {
        const li = document.createElement('li');
        li.className = 'p-4 cursor-pointer hover:bg-blue-50 transition-colors';
        li.innerHTML = `
            <h4 class="font-semibold text-gray-800">${toko.nama}</h4>
            <p class="text-xs text-gray-500">Kecamatan ${toko.kecamatan}</p>
        `;
        
        li.addEventListener('click', () => {
            const targetMarker = markers[toko.nama];
            if (targetMarker) {
                map.flyTo(targetMarker.getLatLng(), 15); // Zoom tidak terlalu dekat agar batas terlihat
                targetMarker.openPopup();
                showKecamatanBoundary(toko.kecamatan); // Panggil fungsi untuk menampilkan batas
            }
        });
        storeList.appendChild(li);
    });
}

// Menambahkan marker ke peta
function addMarkers(data) {
    data.forEach(toko => {
        const popupContent = `
            <div class="text-sm">
                <div class="font-bold mb-1">${toko.nama}</div>
                <div class="text-gray-600">${toko.kecamatan}</div>
            </div>
        `;
        const marker = L.marker([toko.lat, toko.lon]).addTo(map)
            .bindPopup(popupContent);
        
        // Tambahkan event klik pada marker itu sendiri
        marker.on('click', () => {
            showKecamatanBoundary(toko.kecamatan); // Tampilkan batas saat marker diklik
        });

        markers[toko.nama] = marker;
    });
}

// Fungsi PENCARIAN
function filterStores(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = dataToko.filter(toko => 
        toko.nama.toLowerCase().includes(searchTerm) ||
        toko.kecamatan.toLowerCase().includes(searchTerm)
    );
    populateSidebar(filteredData);
}

// FUNGSI BARU: Menampilkan batas kecamatan tertentu
function showKecamatanBoundary(kecamatanName) {
    // Hapus layer batas sebelumnya jika ada
    if (currentBoundaryLayer) {
        map.removeLayer(currentBoundaryLayer);
    }

    // Pastikan data geojson sudah dimuat
    if (!geojsonDataKecamatan) return;

    // Cari fitur (poligon) kecamatan yang sesuai
    const kecamatanFeature = geojsonDataKecamatan.features.find(
        feature => feature.properties.KECAMATAN.toLowerCase() === kecamatanName.toLowerCase()
    );

    if (kecamatanFeature) {
        // Style untuk batas yang disorot
        const highlightStyle = {
            color: "#0000FF", // Biru terang
            weight: 3,
            opacity: 1,
            fillColor: "#0000FF",
            fillOpacity: 0.2
        };

        // Buat layer GeoJSON hanya untuk kecamatan yang dipilih dan tambahkan ke peta
        currentBoundaryLayer = L.geoJSON(kecamatanFeature, { style: highlightStyle }).addTo(map);
    }
}

// --- INISIALISASI APLIKASI ---

// 1. Tambahkan marker ke peta
addMarkers(dataToko);

// 2. Isi sidebar dengan semua data awal
populateSidebar(dataToko);

// 3. Tambahkan event listener ke kotak pencarian
const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', filterStores);

// 4. Muat data GeoJSON Kecamatan di latar belakang
fetch('kecamatan-depok.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonDataKecamatan = data; // Simpan data ke variabel global
        console.log("Data batas kecamatan berhasil dimuat.");
    })
    .catch(error => {
        console.error('Gagal memuat data GeoJSON kecamatan:', error);
    });