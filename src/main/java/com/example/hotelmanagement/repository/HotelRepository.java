package com.example.hotelmanagement.repository;

import com.example.hotelmanagement.data.booking.BookingDto;
import com.example.hotelmanagement.data.guest.Guest;
import com.example.hotelmanagement.data.guest.GuestDto;
import com.example.hotelmanagement.data.reservation.ReservationDto;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface HotelRepository {

  List<GuestDto> findAllGuest();

  List<BookingDto> findAllBooking();

  List<ReservationDto> findAllReservation();

  List<GuestDto> searchGuest(@Param("guest") Guest guest);

}