import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import RequireAuth from "./routes/RequireAuth";
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

  const hideHeaderPaths = ['/', '/login', '/register-user'];
  const hideHomeButtonPaths = ['/', '/login', '/register-user'];

  const hideHeader = hideHeaderPaths.includes(location.pathname);
  const hideHomeButton = hideHomeButtonPaths.includes(location.pathname);


  return (
    <>
      {/* ヘッダーは必要なページだけ表示 */}
      {!hideHeader && <TopHeader />}

      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/login" element={<LoginPage />} />
      {/* ここから保護ページ。RequireAuth で包む */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/guests"
          element={
            <RequireAuth>
              <GuestList />
            </RequireAuth>
          }
        />
        <Route
          path="/bookings"
          element={
            <RequireAuth>
              <BookingListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/search"
          element={
            <RequireAuth>
              <SearchGuestPage />
            </RequireAuth>
          }
        />
        <Route
          path="/match"
          element={
            <RequireAuth>
              <RegisterReservationPage />
            </RequireAuth>
          }
        />
        <Route
          path="/register-booking"
          element={
            <RequireAuth>
              <RegisterBookingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/check-in"
          element={
            <RequireAuth>
              <CheckInPage />
            </RequireAuth>
          }
        />
        <Route
          path="/check-out"
          element={
            <RequireAuth>
              <CheckOutPage />
            </RequireAuth>
          }
        />
          <Route
          path="/RegisterUserPage"
          element={
            <RequireAuth>
              <RegisterUserPage />
            </RequireAuth>
          }
        />
      </Routes>


      {/* Homeボタンも条件表示（ログイン/登録/トップでは非表示） */}
      {!hideHomeButton && <HomeButton />}
    </>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;