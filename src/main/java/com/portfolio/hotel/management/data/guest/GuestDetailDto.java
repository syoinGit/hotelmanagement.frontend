package com.portfolio.hotel.management.data.guest;

import com.portfolio.hotel.management.data.booking.BookingDto;
import com.portfolio.hotel.management.data.reservation.ReservationDto;
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