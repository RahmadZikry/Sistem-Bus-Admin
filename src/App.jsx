import React, { Suspense } from "react";
import "./assets/tailwind.css";
import { Route, Routes } from "react-router-dom";

// Impor Komponen Layout dan Halaman (Lazy Loaded)
const MainLayout = React.lazy(() => import("./layout/MainLayout"));
const AuthLayout = React.lazy(() => import("./layout/AuthLayout"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute")); 
const Loading = React.lazy(() => import("./components/Loading"));

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const Booking = React.lazy(() => import("./pages/Bookings"));
const BookingDetail = React.lazy(() => import("./pages/BookingDetail"));
const ListBus = React.lazy(() => import("./pages/ListBus"));
const BusDetail = React.lazy(() => import("./pages/BusDetail"));
const AddBookings = React.lazy(() => import("./pages/AddBookings"));
const Contact = React.lazy(() => import("./pages/Contact"));
const ContactDetail = React.lazy(() => import("./pages/ContactDetail"));
const Review = React.lazy(() => import("./pages/Review"));
const ReviewDetail = React.lazy(() => import("./pages/ReviewDetail"));
const Tim = React.lazy(() => import("./pages/Tim"));
const TimDetail = React.lazy(() => import("./pages/TimDetail"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const FaqDetail = React.lazy(() => import("./pages/FaqDetail"));
const Artikel = React.lazy(() => import("./pages/Artikel"));
const ArticleDetail = React.lazy(() => import("./pages/ArticleDetail"));
const Layanan = React.lazy(() => import("./pages/layanan"));
const JadwalOperasional = React.lazy(() => import("./pages/JadwalOperasional"));
const PerawatanArmada = React.lazy(() => import("./pages/PerawatanArmada"));
const PromoDiskon = React.lazy(() => import("./pages/PromoDiskon"));
const Testimoni = React.lazy(() => import("./pages/Testimoni"));
const TestimoniDetail = React.lazy(() => import("./pages/TestimoniDetail"));
const Job = React.lazy(() => import("./pages/Job"));
const JobDetail = React.lazy(() => import("./pages/JobDetail"));

const Login = React.lazy(() => import("./pages/auth/Login"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const Register = React.lazy(() => import("./pages/auth/Register"));

const ErrorPage = React.lazy(() => import("./pages/ErrorPage"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/:id" element={<BookingDetail />} />
            <Route path="/addbookings" element={<AddBookings />} />

            <Route path="/listbus" element={<ListBus />} />
            <Route path="/listbus/:id_layanan" element={<BusDetail />} />

            <Route path="/layanan" element={<Layanan />} />
            <Route path="/jadwal" element={<JadwalOperasional />} />
            <Route path="/perawatan" element={<PerawatanArmada />} />
            <Route path="/promo" element={<PromoDiskon />} />

            <Route path="/testimoni" element={<Testimoni />} />
            <Route path="/testimoni/:id" element={<TestimoniDetail />} />

            <Route path="/job" element={<Job />} />
            <Route path="/job/:id" element={<JobDetail />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/contact/:id" element={<ContactDetail />} />

            <Route path="/review" element={<Review />} />
            <Route path="/review/:id" element={<ReviewDetail />} />

            <Route path="/tim" element={<Tim />} />
            <Route path="/tim/:id" element={<TimDetail />} />

            <Route path="/faq" element={<FAQ />} />
            <Route path="/faq/:id" element={<FaqDetail />} />

            <Route path="/artikel" element={<Artikel />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={<ErrorPage kode="404" deskripsi="Page Not Found" />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
