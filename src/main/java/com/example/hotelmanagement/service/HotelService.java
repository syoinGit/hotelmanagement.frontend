package com.example.hotelmanagement.service;

import com.example.hotelmanagement.data.guest.Guest;
import com.example.hotelmanagement.data.guest.GuestDetailDto;
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
  public List<GuestDetailDto> searchGuest(Guest guest) {
    return converter.convertGuestDetailDto(
        repository.searchGuest(guest),
        repository.findAllBooking(),
        repository.findAllReservation());
  }

  // ゲストの登録
  public void insertGuest(GuestDetailDto guestDetailDto) {
    guestDetailDto.getGuest().setId(UUID.randomUUID().toString());
    repository.insertGuest(guestDetailDto.getGuest());
    initReservation(guestDetailDto);
  }


  // 宿泊情報の登録
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
}