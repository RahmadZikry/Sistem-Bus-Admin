import { Users, CalendarDays, ChevronDown } from 'lucide-react';

const packages = [
  {
    image: 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Cultural Exploration',
    title: 'Seoul, South Korea',
    duration: '10 Days / 9 Nights',
    price: '2,100',
  },
  {
    image: 'https://images.pexels.com/photos/599982/pexels-photo-599982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Venice Dreams',
    title: 'Venice, Italy',
    duration: '8 Days / 7 Nights',
    price: '1,500',
  },
  {
    image: 'https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Safari Adventure',
    title: 'Serengeti, Tanzania',
    duration: '8 Days / 7 Nights',
    price: '3,200',
  }
];

const PackageCard = ({ pkg }) => (
  <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
    <div className="relative">
      <img src={pkg.image} alt={pkg.title} className="w-full h-40 object-cover" />
      <span className="absolute top-3 left-3 bg-white/90 text-blue-600 text-xs font-semibold px-2 py-1 rounded-md">{pkg.category}</span>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-800">{pkg.title}</h3>
      <div className="flex items-center text-sm text-gray-500 mt-2 gap-4">
        <span className="flex items-center gap-1.5"><Users size={16}/> per person</span>
        <span className="flex items-center gap-1.5"><CalendarDays size={16}/> {pkg.duration}</span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-xl font-bold text-gray-900">${pkg.price}</p>
          <p className="text-xs text-gray-500">per person</p>
        </div>
        <button className="bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-colors">
          See Detail
        </button>
      </div>
    </div>
  </div>
);

export default function TravelPackages() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Travel Packages</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Sort by:</span>
          <button className="flex items-center gap-2 text-sm font-medium bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">
            Latest <ChevronDown size={16} />
          </button>
          <button className="text-sm font-medium text-blue-600">View All</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => <PackageCard key={index} pkg={pkg} />)}
      </div>
    </div>
  );
}