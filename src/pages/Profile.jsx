import { useState, useEffect } from "react";
import profileData from "../JSON/profile.json";

export default function Profile() {
  const [company, setCompany] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (profileData.length > 0) {
      setCompany(profileData[0]);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => setEditing(!editing);

  const handleSave = () => {
    setEditing(false);
    alert("Profil perusahaan berhasil disimpan!");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6 border-b pb-2 border-blue-200">
        Company Profile
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Nama Perusahaan" name="nama" value={company.nama || ""} onChange={handleChange} disabled={!editing} />
        <InputField label="Kota / Lokasi" name="kota" value={company.kota || ""} onChange={handleChange} disabled={!editing} />
        <InputField label="Alamat" name="alamat" value={company.alamat || ""} onChange={handleChange} disabled={!editing} className="md:col-span-2" />
        <InputField label="Email" name="email" type="email" value={company.email || ""} onChange={handleChange} disabled={!editing} />
        <InputField label="Telepon" name="telepon" value={company.telepon || ""} onChange={handleChange} disabled={!editing} />
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
            >
              💾 Simpan
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg shadow"
            >
              ❌ Batal
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
          >
            ✏️ Edit Profil
          </button>
        )}
      </div>
    </div>
  );
}

// Komponen input modular dengan penyesuaian gaya
function InputField({ label, name, value, onChange, disabled, type = "text", className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 border ${
          disabled ? "bg-gray-100 text-gray-500" : "bg-white"
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
      />
    </div>
  );
}
