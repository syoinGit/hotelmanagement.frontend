package com.example.hotelmanagement.repository;

import com.example.hotelmanagement.data.booking.Booking;
import com.example.hotelmanagement.data.booking.BookingDto;
import com.example.hotelmanagement.data.guest.Guest;
import com.example.hotelmanagement.data.guest.GuestDto;
import com.example.hotelmanagement.data.reservation.ReservationDto;
import com.example.hotelmanagement.data.reservation.ReservationStatus;
import java.math.BigDecimal;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface HotelRepository {


  // 宿泊者の全件検索
  List<GuestDto> findAllGuest();

  // 宿泊プランの全件検索
  List<BookingDto> findAllBooking();

  // 宿泊予約の全件検索
  List<ReservationDto> findAllReservation();

  // 宿泊者IDから宿泊者を検索
  List<GuestDto> searchGuest(@Param("guest") Guest guest, @Param("status") String status);

  // 宿泊者IDから宿泊者を完全一致検索
  List<GuestDto> matchGuest(@Param("guest")GuestDto guest);

  // 宿泊プランIDから金額を検索
  BigDecimal findTotalPriceById(@Param("id") String id);

  // 宿泊予約IDから宿泊予約状況を検索
  ReservationStatus findStatusById(@Param("id") String id);

  // 宿泊者の登録
  void insertGuest(GuestDto guest);

  // 宿泊プランの登録
  void insertBooking(@Param("booking") Booking booking);

  // 宿泊予約の登録
  void insertReservation(@Param("list") List<ReservationDto> reservationList);

  // 宿泊者情報の変更
  void editGuest(GuestDto guestDto);

  // 宿泊予約の変更
  void editReservation(@Param("List") List<ReservationDto> reservationDtoList);

  // チェックイン処理
  void checkIn(@Param("id") String id);

  // チェックアウト処理
  void checkOut(@Param("id") String id);
}