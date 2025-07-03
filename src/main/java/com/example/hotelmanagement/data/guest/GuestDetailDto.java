package com.example.hotelmanagement.data.guest;

import com.example.hotelmanagement.data.booking.BookingDto;
import com.example.hotelmanagement.data.reservation.ReservationDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GuestDetailDto {
  private GuestDto guest;
  private List<BookingDto> bookings;
  private List<ReservationDto> reservations;
}