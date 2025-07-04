package com.example.hotelmanagement.repository;

import com.example.hotelmanagement.data.booking.Booking;
import com.example.hotelmanagement.data.booking.BookingDto;
import com.example.hotelmanagement.data.guest.Guest;
import com.example.hotelmanagement.data.guest.GuestDto;
import com.example.hotelmanagement.data.reservation.ReservationDto;
import java.math.BigDecimal;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface HotelRepository {

  List<GuestDto> findAllGuest();

  List<BookingDto> findAllBooking();

  List<ReservationDto> findAllReservation();

  List<GuestDto> searchGuest(@Param("guest") Guest guest, @Param("status") String status);

  BigDecimal findTotalPriceById(@Param("id") String id);

  void insertGuest(GuestDto guest);

  void insertReservation(@Param("list") List<ReservationDto> reservationList);

  void insertBooking(@Param("booking") Booking booking);

  void editGuest(GuestDto guestDto);

  void editReservation(@Param("List") List<ReservationDto> reservationDtoList);

  void checkIn(@Param("id") String id);

}