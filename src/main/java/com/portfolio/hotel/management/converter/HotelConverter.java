package com.portfolio.hotel.management.converter;

import com.portfolio.hotel.management.data.booking.BookingDto;
import com.portfolio.hotel.management.data.guest.GuestDetailDto;
import com.portfolio.hotel.management.data.guest.GuestDto;
import com.portfolio.hotel.management.data.reservation.ReservationDto;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class HotelConverter {

  public List<GuestDetailDto> convertGuestDetailDto(List<GuestDto> guestDtos,
      List<BookingDto> bookingDtos, List<ReservationDto> reservationDtos) {

    List<GuestDetailDto> guestDetailDtos = new ArrayList<>();

    for (GuestDto guestDto : guestDtos) {
      GuestDetailDto guestDetailDto = new GuestDetailDto();
      guestDetailDto.setGuest(guestDto);

      List<ReservationDto> matchedReservations = reservationDtos.stream()
          .filter(s -> s.getGuestId().equals(guestDetailDto.getGuest().getId()))
          .toList();
      guestDetailDto.setReservations(matchedReservations);

      List<String> bookingIds = guestDetailDto.getReservations().stream()
          .map(ReservationDto::getBookingId)
          .distinct()
          .toList();

      List<BookingDto> matchBookings = bookingDtos.stream()
          .filter(s -> bookingIds.contains(s.getId()))
          .toList();

      guestDetailDto.setBookings(matchBookings);

      guestDetailDtos.add(guestDetailDto);
    }
    return guestDetailDtos;
  }
}