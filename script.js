// Inisialisasi Peta
const map = L.map('map').setView([-6.385, 106.83], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Data Lokasi Optik (tetap sama)
const dataToko = [
    { nama: "kajamata", lat: -6.352943247241355, lon: 106.83688346770158 },
    { nama: "Optik yogya", lat: -6.355037412823192, lon: 106.84279919005748 },
    { nama: "Optik mikeda", lat: -6.358804721947621, lon: 106.8203525052386 },
    { nama: "Optik seis", lat: -6.3702351485575255, lon: 106.84060854681871 },
    { nama: "pesona square seis", lat: -6.377741558914672, lon: 106.8503932448701 },
    { nama: "kacamata blushing depok", lat: -6.351127427058779, lon: 106.84043688544939 },
    { nama: "Banana optik", lat: -6.359765121814708, lon: 106.8325534935426 },
    { nama: "Ezia margonda", lat: -6.369469914174375, lon: 106.8372984476038 },
    { nama: "Optik Saturdays", lat: -6.373043999014269, lon: 106.8338688799091 },
    { nama: "Optik melawai margo city", lat: -6.373534475359879, lon: 106.83451261004404 },
    { nama: "Optik your glasses store", lat: -6.379867975593465, lon: 106.832559961968 },
    { nama: "Optik express", lat: -6.370183421595739, lon: 106.81477742125007 },
    { nama: "Optik tunggal margo city depok", lat: -6.372793548719584, lon: 106.83462605358382 },
    { nama: "Optik PABD Melawai Margonda", lat: -6.385370077232084, lon: 106.82897948426852 },
    { nama: "King optik", lat: -6.3704564469711435, lon: 106.79984719111513 },
    { nama: "Optik Kusuma Depok Town Square", lat: -6.371685997251732, lon: 106.83116030755686 },
    { nama: "Optik AZ10", lat: -6.380557829793153, lon: 106.81454656043047 },
    { nama: "Visio first Optik depok town square", lat: -6.371631871678194, lon: 106.83073256632741 },
    { nama: "Optik Ezia - Depok Town Square", lat: -6.372049298378823, lon: 106.83235931156004 },
    { nama: "Optik Melawai - Verbena Grand Depok City", lat: -6.412249372654965, lon: 106.82101751935564 },
    { nama: "DHANIA OPTIC GRAND DEPOK CITY", lat: -6.4125295677888134, lon: 106.8201057700838 },
    { nama: "Optik B.RISKI DEPOK", lat: -6.421696870672656, lon: 106.8281170428903 },
    { nama: "Optik Bimo", lat: -6.426039219696846, lon: 106.82192651390345 },
    { nama: "Optik MARLIN", lat: -6.432311436177565, lon: 106.82629629907063 },
    { nama: "Green Optik", lat: -6.432350973370834, lon: 106.8460130747702 },
    { nama: "OPTIK PADI GDC", lat: -6.4403682046377515, lon: 106.8210850351199 },
    { nama: "OPTIK POLARIS", lat: -6.442255594394748, lon: 106.81943624773703 }
];


// Variabel global untuk menyimpan referensi ke marker
const markers = {};

// Fungsi untuk mengisi daftar sidebar (dengan kelas Tailwind)
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
        // Menggunakan kelas Tailwind untuk tampilan list item
        li.className = 'p-4 cursor-pointer hover:bg-blue-50 transition-colors';
        li.innerHTML = `
            <h4 class="font-semibold text-gray-800">${toko.nama}</h4>
            <p class="text-xs text-gray-500">Lat: ${toko.lat.toFixed(5)}, Lon: ${toko.lon.toFixed(5)}</p>
        `;
        
        li.addEventListener('click', () => {
            const targetMarker = markers[toko.nama];
            if (targetMarker) {
                map.flyTo(targetMarker.getLatLng(), 17);
                targetMarker.openPopup();
            }
        });

        storeList.appendChild(li);
    });
}

// Fungsi untuk menambahkan marker ke peta (dengan popup yang lebih baik)
function addMarkers(data) {
    data.forEach(toko => {
        const popupContent = `
            <div class="text-sm">
                <div class="font-bold mb-1">${toko.nama}</div>
                <div class="text-gray-600">
                    ${toko.lat.toFixed(6)}, ${toko.lon.toFixed(6)}
                </div>
            </div>
        `;
        const marker = L.marker([toko.lat, toko.lon]).addTo(map)
            .bindPopup(popupContent);
        markers[toko.nama] = marker;
    });
}

// Fungsi untuk filter pencarian (tetap sama)
function filterStores(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = dataToko.filter(toko => 
        toko.nama.toLowerCase().includes(searchTerm)
    );
    populateSidebar(filteredData);
}

// Event Listener untuk kotak pencarian
const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', filterStores);


// --- Inisialisasi Aplikasi ---
addMarkers(dataToko);
populateSidebar(dataToko);

// --- TAMBAHKAN KODE BARU DI BAWAH INI ---

// Fungsi untuk mengatur style garis batas
function styleBatas(feature) {
    return {
        color: "#e60000",      // Warna garis (merah menyala)
        weight: 2,           // Ketebalan garis
        opacity: 0.8,        // Transparansi garis
        fillColor: "#e60000",  // Warna isian poligon
        fillOpacity: 0.1     // Transparansi isian
    };
}

// Memuat dan menampilkan file GeoJSON
fetch('depok-boundary.geojson')
    .then(response => {
        // Cek jika file berhasil diakses
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Ubah response menjadi format JSON
    })
    .then(data => {
        // Tampilkan data GeoJSON di peta Leaflet dengan style yang sudah ditentukan
        L.geoJSON(data, { style: styleBatas }).addTo(map);
    })
    .catch(error => {
        // Tampilkan pesan error di console jika file tidak ditemukan atau gagal dimuat
        console.error('Error memuat GeoJSON:', error);
        alert('Gagal memuat data batas wilayah. Pastikan file depok-boundary.geojson ada di folder yang benar.');
    });