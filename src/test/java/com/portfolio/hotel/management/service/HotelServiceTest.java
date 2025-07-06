package com.portfolio.hotel.management.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.portfolio.hotel.management.HotelService;
import com.portfolio.hotel.management.converter.HotelConverter;
import com.portfolio.hotel.management.data.booking.BookingDto;
import com.portfolio.hotel.management.data.guest.GuestDetailDto;
import com.portfolio.hotel.management.data.guest.GuestDto;
import com.portfolio.hotel.management.data.reservation.ReservationDto;
import com.portfolio.hotel.management.repository.HotelRepository;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

  @Mock
  private HotelRepository repository;

  @Mock
  private HotelConverter converter;

  @Test
  void 宿泊者情報の全件検索機能_リポジトリとコンバーターが呼び出せていること() {
    HotelService sut = new HotelService(repository, converter);

    List<GuestDto> guestDto = new ArrayList<>();
    List<BookingDto> bookingDto = new ArrayList<>();
    List<ReservationDto> reservationDto = new ArrayList<>();
    List<GuestDetailDto> converted = new ArrayList<>();

    Mockito.when(repository.findAllGuest()).thenReturn(guestDto);
    Mockito.when(repository.findAllBooking()).thenReturn(bookingDto);
    Mockito.when(repository.findAllReservation()).thenReturn(reservationDto);
    Mockito.when(converter.convertGuestDetailDto(guestDto, bookingDto, reservationDto))
        .thenReturn(converted);

    List<GuestDetailDto> actual = sut.getAllGuest();

    Mockito.verify(repository, Mockito.times(1)).findAllGuest();
    Mockito.verify(repository, Mockito.times(1)).findAllBooking();
    Mockito.verify(repository, Mockito.times(1)).findAllReservation();

    Mockito.verify(converter, Mockito.times(1))
        .convertGuestDetailDto(guestDto, bookingDto, reservationDto);

    assertNotNull(actual);
    assertEquals(actual, converted);

  }

  @Test
  void 泊者情報の単一検索機能_ID_名前_かな名_電話番号から宿泊者情報が呼び出せていること() {
    HotelService sut = new HotelService(repository, converter);

    List<GuestDto> guestDto = new ArrayList<>();






  }
}