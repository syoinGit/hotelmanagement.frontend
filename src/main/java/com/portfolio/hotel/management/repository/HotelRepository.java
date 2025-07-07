package com.portfolio.hotel.management.repository;

import com.portfolio.hotel.management.data.booking.Booking;
import com.portfolio.hotel.management.data.booking.BookingDto;
import com.portfolio.hotel.management.data.guest.Guest;
import com.portfolio.hotel.management.data.guest.GuestDto;
import com.portfolio.hotel.management.data.reservation.Reservation;
import com.portfolio.hotel.management.data.reservation.ReservationDto;
import com.portfolio.hotel.management.data.reservation.ReservationStatus;
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
  List<GuestDto> searchGuest(@Param("guest") GuestDto guestDto);

  // 宿泊者IDから宿泊者を完全一致検索
  List<GuestDto> matchGuest(@Param("guest") GuestDto guestDto);

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
  void editGuest(Guest guest);

  // 宿泊予約の変更
  void editReservation(Reservation reservation);

  // チェックイン処理
  void checkIn(@Param("id") String id);

  // チェックアウト処理
  void checkOut(@Param("id") String id);
}