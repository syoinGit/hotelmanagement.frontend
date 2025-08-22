import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopPage from './pages/TopPage/TopPage.jsx';
import Home from './pages/Home/Home.jsx';
import RegisterUserPage from './pages/RegisterUserPage/RegisterUserPage.jsx';
import HomeButton from './components/HomeButton.jsx';
import TopHeader from './components/TopHeader.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import GuestList from './pages/GuestListPage/GuestListPage.jsx';
import BookingListPage from './pages/BookingListPage/BookingListPage.jsx';
import SearchGuestPage from './pages/SearchGuestPage/SearchGuestPage.jsx';
import RegisterReservationPage from './pages/RegisterReservationPage/RegisterReservationPage.jsx';
import RegisterBookingPage from './pages/RegisterBookingPage/RegisterBookingPage.jsx';
import CheckInPage from './pages/CheckInPage/CheckInPage.jsx';
import CheckOutPage from './pages/CheckOutPage/CheckOutPage.jsx';

const AppLayout = () => {
  const location = useLocation();
  const hideHeaderPaths = ['/', '/login'];

  return (
    <>
      <HomeButton />
      {!hideHeaderPaths.includes(location.pathname) && <TopHeader />}
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-user" element={<RegisterUserPage/>} />
        <Route path="/guests" element={<GuestList />} />
        <Route path="/bookings" element={<BookingListPage />} />
        <Route path="/search" element={<SearchGuestPage />} />
        <Route path="/match" element={<RegisterReservationPage />} />
        <Route path="/register-booking" element={<RegisterBookingPage />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path='/check-out' element={<CheckOutPage/>} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;