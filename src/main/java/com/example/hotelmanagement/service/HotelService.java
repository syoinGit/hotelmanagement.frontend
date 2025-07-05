package com.example.hotelmanagement.service;

import com.example.hotelmanagement.data.booking.Booking;
import com.example.hotelmanagement.data.guest.Guest;
import com.example.hotelmanagement.data.guest.GuestDetailDto;
import com.example.hotelmanagement.data.guest.GuestDto;
import com.example.hotelmanagement.data.reservation.ReservationDto;
import com.example.hotelmanagement.data.reservation.ReservationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.example.hotelmanagement.repository.HotelRepository;
import com.example.hotelmanagement.service.converter.HotelConverter;

@Service
public class HotelService {

  private final HotelRepository repository;
  private final HotelConverter converter;

  public HotelService(HotelRepository repository, HotelConverter converter) {
    this.repository = repository;
    this.converter = converter;

  }

  // ゲスト情報の全権取得
  public List<GuestDetailDto> getAllGuest() {
    return converter.convertGuestDetailDto(
        repository.findAllGuest(),
        repository.findAllBooking(),
        repository.findAllReservation());
  }

  // ゲスト情報の単一検索
  public List<GuestDetailDto> searchGuest(Guest guest, ReservationStatus reservationStatus) {
    String status = reservationStatus.toString();
    return converter.convertGuestDetailDto(
        repository.searchGuest(guest, status),
        repository.findAllBooking(),
        repository.findAllReservation());
  }

  // 宿泊者の完全一致検索
  public List<GuestDto> matchGuest(GuestDto guest) {
    return repository.matchGuest(guest);
  }

  // ゲストの登録
  public void insertGuest(GuestDetailDto guestDetailDto) {
    guestDetailDto.getGuest().setId(UUID.randomUUID().toString());
    repository.insertGuest(guestDetailDto.getGuest());
    initReservation(guestDetailDto);
  }

  // 宿泊予約の登録
  private void initReservation(GuestDetailDto guestDetailDto) {
    String guestId = guestDetailDto.getGuest().getId();
    List<ReservationDto> reservationDto = guestDetailDto.getBookings().stream()
        .map(s -> {
          ReservationDto r = new ReservationDto();
          r.setId(UUID.randomUUID().toString());
          r.setGuestId(guestId);
          r.setBookingId(s.getId());
          r.setCheckInDate(LocalDate.now().plusDays(1));
          r.setStayDays(0);
          r.setTotalPrice(repository.findTotalPriceById(r.getBookingId()));
          r.setMemo("");
          r.setStatus(ReservationStatus.TEMPORARY);
          r.setCreatedAt(LocalDateTime.now());
          return r;
        })
        .toList();
    repository.insertReservation(reservationDto);
  }

  // 宿泊プランの登録
  public void insertBooking(Booking booking) {
    booking.setId(UUID.randomUUID().toString());
    repository.insertBooking(booking);
  }

  // 宿泊者の編集
  public void editGuest(GuestDetailDto guestDetailDto) {
    repository.editGuest(guestDetailDto.getGuest());
    repository.editReservation(guestDetailDto.getReservations());
  }

  // チェックイン処理の作成
  public void checkIn(String reservationId) {
    ReservationStatus status = repository.findStatusById(reservationId);
    if (status == ReservationStatus.NOT_CHECKED_IN) {
      repository.checkIn(reservationId);
    } else {
      throw new IllegalStateException("未チェックインの予約のみチェックイン可能です");
    }
  }

  // チェックアウト処理の作成
  public void checkOut(String reservationId) {
    repository.checkOut(reservationId);
    ReservationStatus status = repository.findStatusById(reservationId);
    if (status == ReservationStatus.CHECKED_IN) {
      repository.checkOut(reservationId);
    } else {
      throw new IllegalStateException("チェックイン済みの予約のみチェックアウト可能です");
    }
  }
}