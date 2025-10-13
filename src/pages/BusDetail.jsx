import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import dataBus from '../JSON/databus.json'; // Pastikan path ini benar
import PageHeader from '../components/PageHeader'; // Asumsi path ini benar
import { FiArrowLeft, FiClock, FiUsers, FiDollarSign, FiWifi, FiWind, FiShield, FiMapPin } from 'react-icons/fi'; // Mengganti FiKey dengan FiShield untuk Toilet

export default function BusDetail() {
  const { id_layanan } = useParams(); // id_layanan dari URL adalah string
  const navigate = useNavigate();

  // Temukan bus: pastikan perbandingan tipe data id_layanan benar
  // id_layanan dari JSON adalah number, dari URL adalah string. Perlu konversi.
  const bus = dataBus.find(b => b.id_layanan.toString() === id_layanan);

  if (!bus) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
        <PageHeader title="Bus Not Found" breadcrumb={["Dashboard", "Bus List", "Not Found"]} />
        <div className="mt-10 bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
            <FiShield size={60} className="text-red-400 mx-auto mb-6" /> {/* Contoh ikon error */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oops! Bus Not Found</h2>
            <p className="text-gray-500 mb-8">
            We couldn't find the bus details for ID: <span className="font-semibold">{id_layanan}</span>. It might have been removed or the ID is incorrect.
            </p>
            <Link
                to="/listbus"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
            >
                <FiArrowLeft size={20} />
                <span>Back to Bus List</span>
            </Link>
        </div>
      </div>
    );
  }

  // Menangani path gambar relatif
  // Jika gambar ada di folder public, pathnya akan seperti: /img/bus1.jpg
  // Jika gambar diimpor/di-bundle oleh Vite/CRA, cara penanganannya berbeda.
  // Asumsi sederhana: path `./img/` berarti di folder public relatif terhadap root.
  const imageUrl = bus.url_gambar.startsWith('./') ? bus.url_gambar.substring(2) : bus.url_gambar;
  // Untuk Vite, gambar di public bisa diakses langsung: `/img/bus1.jpg`
  // Untuk CRA, gambar di public bisa diakses dengan `%PUBLIC_URL%/img/bus1.jpg` atau langsung `/img/bus1.jpg`

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader 
        title={bus.tipe_bus || "Bus Detail"} 
        breadcrumb={["Dashboard", "Bus List", `ID: ${bus.id_layanan}`]}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg shadow hover:shadow-md transition-all duration-200 ease-in-out"
        >
          <FiArrowLeft size={20} />
          <span>Back</span>
        </button>
      </PageHeader>

      <div className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Gambar Bus */}
          <div className="md:w-2/5 md:flex-shrink-0 bg-gray-100">
            <img 
              src={`/${imageUrl}`} // Tambahkan '/' di depan jika path di folder public
              alt={`Image of ${bus.tipe_bus}`} 
              className="h-64 w-full object-contain md:h-full md:object-cover p-2" // object-contain agar tidak terpotong, atau object-cover jika ingin mengisi penuh
            />
          </div>

          {/* Detail Informasi Bus */}
          <div className="p-6 md:p-8 flex-grow md:w-3/5">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{bus.tipe_bus}</h2>
                    <p className="text-sm text-gray-500">Operated by: <span className="font-semibold text-indigo-600">{bus.operator_bus}</span></p>
                </div>
                <span className="text-xs font-semibold text-gray-400">ID: {bus.id_layanan}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-6 border-t pt-4 mt-4">
              <DetailItem icon={<FiMapPin />} label="Route" value={bus.rute_perjalanan} />
              <DetailItem icon={<FiClock />} label="Schedule" value={`${bus.jadwal.waktu_berangkat} - ${bus.jadwal.waktu_tiba}`} />
              <DetailItem icon={<FiUsers />} label="Capacity" value={`${bus.kapasitas_tempat_duduk} seats`} />
              <DetailItem 
                icon={<FiDollarSign />} 
                label="Price" 
                value={`${bus.harga.mata_uang} ${Number(bus.harga.harga_tiket).toLocaleString('id-ID')}`} 
                valueClass="text-green-600 font-bold text-xl" 
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-t pt-4 mt-4">Facilities</h3>
            <div className="flex flex-wrap gap-3">
                {bus.fasilitas.wifi && <FacilityBadge icon={<FiWifi/>} text="Wifi" />}
                {bus.fasilitas.ac && <FacilityBadge icon={<FiWind/>} text="Air Conditioner" />}
                {bus.fasilitas.toilet && <FacilityBadge icon={<FiShield/>} text="Toilet" />} 
                {/* Jika tidak ada fasilitas */}
                {!(bus.fasilitas.wifi || bus.fasilitas.ac || bus.fasilitas.toilet) && (
                    <p className="text-sm text-gray-500">No special facilities listed.</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen helper (tetap sama atau sedikit disesuaikan)
function DetailItem({ icon, label, value, valueClass = "text-gray-800" }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center mb-0.5">
        {icon && <span className="mr-2 text-gray-400 text-base">{icon}</span>}
        {label}
      </p>
      <p className={`text-base font-medium ${valueClass}`}>{value}</p>
    </div>
  );
}

function FacilityBadge({icon, text}) {
    return (
        <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors">
            {icon && <span className="mr-1.5 text-base -ml-0.5 text-gray-500">{icon}</span>}
            {text}
        </span>
    )
}