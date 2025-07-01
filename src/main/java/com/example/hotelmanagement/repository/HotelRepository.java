package com.example.hotelmanagement.repository;

import com.example.hotelmanagement.data.booking.BookingDto;
import com.example.hotelmanagement.data.guest.GuestDto;
import com.example.hotelmanagement.data.reservation.ReservationDto;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface HotelRepository {

  @Select("SELECT * FROM guest")
  List<GuestDto> findAllGuest();

  @Select("SELECT * FROM booking")
  List<BookingDto> findAllBooking();

  @Select("SELECT * FROM Reservation")
  List<ReservationDto> findAllReservation();
}