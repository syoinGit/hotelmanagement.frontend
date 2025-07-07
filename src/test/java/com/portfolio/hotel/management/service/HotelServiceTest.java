package com.portfolio.hotel.management.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;

import com.portfolio.hotel.management.HotelService;
import com.portfolio.hotel.management.converter.HotelConverter;
import com.portfolio.hotel.management.data.booking.Booking;
import com.portfolio.hotel.management.data.booking.BookingDto;
import com.portfolio.hotel.management.data.guest.Guest;
import com.portfolio.hotel.management.data.guest.GuestDetailDto;
import com.portfolio.hotel.management.data.guest.GuestDto;
import com.portfolio.hotel.management.data.reservation.Reservation;
import com.portfolio.hotel.management.data.reservation.ReservationDto;
import com.portfolio.hotel.management.data.reservation.ReservationStatus;
import com.portfolio.hotel.management.repository.HotelRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

  private static final Logger log = LogManager.getLogger(HotelServiceTest.class);
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

    verify(repository, Mockito.times(1)).findAllGuest();
    verify(repository, Mockito.times(1)).findAllBooking();
    verify(repository, Mockito.times(1)).findAllReservation();

    verify(converter, Mockito.times(1))
        .convertGuestDetailDto(guestDto, bookingDto, reservationDto);

    assertNotNull(actual);
    assertEquals(actual, converted);

  }

  @Test
  void 宿泊者情報の単一検索機能_ID_名前_かな名_電話番号から宿泊者情報が呼び出せていること() {
    HotelService sut = new HotelService(repository, converter);

    GuestDto guest = new GuestDto();
    List<GuestDto> guestDto = new ArrayList<>();
    List<BookingDto> bookingDto = new ArrayList<>();
    List<ReservationDto> reservationDto = new ArrayList<>();
    List<GuestDetailDto> converted = new ArrayList<>();

    guest.setId("35c1d2ce-5651-11f0-b59f-a75edf46bde3");
    guest.setName("佐藤花子");

    Mockito.when(repository.searchGuest(guest)).thenReturn(guestDto);
    Mockito.when(repository.findAllBooking()).thenReturn(bookingDto);
    Mockito.when(repository.findAllReservation()).thenReturn(reservationDto);
    Mockito.when(converter.convertGuestDetailDto(guestDto, bookingDto, reservationDto))
        .thenReturn(converted);

    List<GuestDetailDto> actual = sut.searchGuest(guest);

    verify(repository, Mockito.times(1)).searchGuest(guest);
    verify(repository, Mockito.times(1)).findAllBooking();
    verify(repository, Mockito.times(1)).findAllReservation();
    verify(converter, Mockito.times(1))
        .convertGuestDetailDto(guestDto, bookingDto, reservationDto);

    assertNotNull(actual);
    assertEquals(converted, actual);
  }

  @Test
  void 宿泊者情報の完全一致致検索_名前_ふりがな_電話番号から宿泊者情報が呼び出せていること() {
    HotelService sut = new HotelService(repository, converter);

    GuestDto guest = new GuestDto();
    List<GuestDto> guestDto = new ArrayList<>();
    List<BookingDto> bookingDto = new ArrayList<>();
    List<ReservationDto> reservationDto = new ArrayList<>();
    List<GuestDetailDto> converted = new ArrayList<>();

    guest.setName("佐藤花子");
    guest.setKanaName("サトウハナコ");
    guest.setPhone("08098765432");

    Mockito.when(repository.matchGuest(guest)).thenReturn(guestDto);
    Mockito.when(repository.findAllBooking()).thenReturn(bookingDto);
    Mockito.when(repository.findAllReservation()).thenReturn(reservationDto);
    Mockito.when(converter.convertGuestDetailDto(guestDto, bookingDto, reservationDto))
        .thenReturn(converted);

    List<GuestDetailDto> actual = sut.searchGuest(guest);

    verify(repository, Mockito.times(1)).searchGuest(guest);
    verify(repository, Mockito.times(1)).findAllBooking();
    verify(repository, Mockito.times(1)).findAllReservation();
    verify(converter, Mockito.times(1))
        .convertGuestDetailDto(guestDto, bookingDto, reservationDto);

    assertNotNull(actual);
    assertEquals(converted, actual);
  }

  @Test
  void ゲスト情報登録_登録が行われているか確認() {
    HotelService sut = new HotelService(repository, converter);

    GuestDetailDto actual = getGuestDetailDto();
    sut.insertGuest(actual);

    ArgumentCaptor<GuestDto> guestCaptor = ArgumentCaptor.forClass(GuestDto.class);
    verify(repository).insertGuest(guestCaptor.capture());

    @SuppressWarnings("unchecked")
    ArgumentCaptor<List<ReservationDto>> reservationCaptor = ArgumentCaptor.forClass(
        List.class);
    verify(repository).insertReservation(reservationCaptor.capture());

    GuestDto updateGuest = guestCaptor.getValue();
    List<ReservationDto> updateReservation = reservationCaptor.getValue();

    assertEquals("山田太郎", updateGuest.getName());
    assertEquals("3822609c-5651-11f0-b59f-a75edf46bde3",
        updateReservation.getFirst().getBookingId());
  }

  @Test
  void ゲスト情報登録_IDが登録済みの場合登録が行われないか確認() {
    HotelService sut = new HotelService(repository, converter);

    GuestDetailDto actual = getGuestDetailDto();
    actual.getGuest().setId("3822609c-5651-11f0-b59f-a75edf46bde3");
    sut.insertGuest(actual);

    verify(repository, Mockito.times(0)).insertGuest(actual.getGuest());

  }

  @Test
  void 宿泊プランの登録_登録が行われているか確認() {
    HotelService sut = new HotelService(repository, converter);
    Booking booking = createBooking();
    sut.insertBooking(booking);

    ArgumentCaptor<Booking> captor = ArgumentCaptor.forClass(Booking.class);
    verify(repository).insertBooking(captor.capture());
    Booking update = captor.getValue();

    assertEquals("朝食付きプラン", update.getName());
  }

  @Test
  void 宿泊プランの変更_宿泊情報が変更されているか確認() {
    HotelService sut = new HotelService(repository, converter);
    Guest actual = new Guest();
    actual.setName("山田太郎");

    sut.editGuest(actual);

    ArgumentCaptor<Guest> captor = ArgumentCaptor.forClass(Guest.class);
    verify(repository).editGuest(captor.capture());
    Guest update = captor.getValue();

    assertEquals("山田太郎", update.getName());

  }

  @Test
  void 宿泊プランの変更_宿泊予約が変更されているか確認() {
    HotelService sut = new HotelService(repository, converter);
    Reservation actual = new Reservation();
    actual.setTotalPrice(BigDecimal.valueOf(1000));

    sut.editReservation(actual);

    ArgumentCaptor<Reservation> captor = ArgumentCaptor.forClass(Reservation.class);
    verify(repository).editReservation(captor.capture());
    Reservation update = captor.getValue();

    assertEquals(BigDecimal.valueOf(1000), update.getTotalPrice());

  }

  @Test
  void チェックイン処理の作成_チェックインが行われているかの確認() {
    HotelService sut = new HotelService(repository, converter);
    String reservationId = "3822609c-5651-11f0-b59f-a75edf46bde3";
    Mockito.when(repository.findStatusById(reservationId))
        .thenReturn(ReservationStatus.NOT_CHECKED_IN);

    sut.checkIn(reservationId);

    verify(repository, Mockito.times(1)).findStatusById(reservationId);
  }

  @Test
  void チェックイン処理の作成_ステータスが未チェックイン以外の場合エラーが発生するかの確認() {
    HotelService sut = new HotelService(repository, converter);
    String reservationId = "3822609c-5651-11f0-b59f-a75edf46bde3";
    Mockito.when(repository.findStatusById(reservationId))
        .thenReturn(ReservationStatus.CHECKED_IN);

    Assertions.assertThrows(IllegalStateException.class, () -> {
      sut.checkIn(reservationId);
    });

    verify(repository, Mockito.times(1)).findStatusById(reservationId);
  }

  @Test
  void チェックアウト処理の作成_チェックアウトが行われているかの確認() {
    HotelService sut = new HotelService(repository, converter);
    String reservationId = "3822609c-5651-11f0-b59f-a75edf46bde3";
    Mockito.when(repository.findStatusById(reservationId))
        .thenReturn(ReservationStatus.CHECKED_IN);

    sut.checkOut(reservationId);
    verify(repository, Mockito.times(1)).findStatusById(reservationId);
  }

  @Test
  void チェックアウト処理の作成_ステータスがチェックイン済み以外の場合エラーが発生するかの確認() {
    HotelService sut = new HotelService(repository, converter);
    String reservationId = "3822609c-5651-11f0-b59f-a75edf46bde3";
    Mockito.when(repository.findStatusById(reservationId))
        .thenReturn(ReservationStatus.CHECKED_OUT);

    Assertions.assertThrows(IllegalStateException.class, () -> {
      sut.checkOut(reservationId);
    });

    verify(repository, Mockito.times(1)).findStatusById(reservationId);
  }

  // 生成用
  private GuestDetailDto getGuestDetailDto() {
    GuestDetailDto actual = new GuestDetailDto();
    actual.setGuest(createGuestDto());
    actual.setBookings(createBookingDtoList());
    return actual;
  }

  private List<BookingDto> createBookingDtoList() {
    BookingDto bookingDto = new BookingDto();
    bookingDto.setId("3822609c-5651-11f0-b59f-a75edf46bde3");
    bookingDto.setName("朝食付きプラン");
    bookingDto.setPrice(BigDecimal.valueOf(1000));
    bookingDto.setDescription("和洋朝食が選べるお得なプラン");
    return List.of(bookingDto);
  }

  private static GuestDto createGuestDto() {
    GuestDto guestDto = new GuestDto();

    guestDto.setName("山田太郎");
    guestDto.setKanaName("ヤマダタロウ");
    guestDto.setGender("MALE");
    guestDto.setAge(30);
    guestDto.setRegion("青森県");
    guestDto.setEmail("yamadamori@mail.com");
    guestDto.setPhone("010-1234-5678");
    return guestDto;
  }

  private static Booking createBooking() {
    Booking booking = new Booking();

    booking.setId("3822609c-5651-11f0-b59f-a75edf46bde3");
    booking.setName("朝食付きプラン");
    booking.setPrice(BigDecimal.valueOf(1000));
    booking.setDescription("朝食が付いたプランです");
    return booking;
  }

}