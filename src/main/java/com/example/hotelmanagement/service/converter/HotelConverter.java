package com.example.hotelmanagement.service.converter;

import com.example.hotelmanagement.data.booking.BookingDto;
import com.example.hotelmanagement.data.guest.GuestDetailDto;
import com.example.hotelmanagement.data.guest.GuestDto;
import com.example.hotelmanagement.data.reservation.ReservationDto;
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