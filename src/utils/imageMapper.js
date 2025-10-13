// src/utils/imageMapper.js

// Gambar-gambar ini diambil dari Pexels, bebas digunakan.
const destinationImages = {
    'Bandung': 'https://images.pexels.com/photos/1684151/pexels-photo-1684151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Malang': 'https://images.pexels.com/photos/10792341/pexels-photo-10792341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Yogyakarta': 'https://images.pexels.com/photos/672322/pexels-photo-672322.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Parapat': 'https://images.pexels.com/photos/3601094/pexels-photo-3601094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Ubud': 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Toraja': 'https://images.pexels.com/photos/1586795/pexels-photo-1586795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Default': 'https://images.pexels.com/photos/3889852/pexels-photo-3889852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
};

export const getDestinationImage = (destination) => {
    // Mencari kunci yang cocok di dalam string destinasi
    for (const key in destinationImages) {
        if (destination.includes(key)) {
            return destinationImages[key];
        }
    }
    // Jika tidak ada yang cocok, kembalikan gambar default
    return destinationImages['Default'];
};