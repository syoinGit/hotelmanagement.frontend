package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.data.booking.Booking;
import com.example.hotelmanagement.data.guest.Guest;
import com.example.hotelmanagement.data.guest.GuestDetailDto;
import com.example.hotelmanagement.data.reservation.ReservationDto;
import com.example.hotelmanagement.data.reservation.ReservationStatus;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.hotelmanagement.service.HotelService;

@RestController
public class HotelController {

  private final HotelService service;

  public HotelController(HotelService service) {
    this.service = service;
  }

  @Operation(summary = "全件検索", description = "ゲスト情報の全件検索を行います。")
  @GetMapping("/guestList")
  public List<GuestDetailDto> getGuestList() {
    return service.getAllGuest();
  }

  @Operation(summary = "単一検索", description = "ゲストID、ゲスト名、ふりがな、電話番号からゲスト情報を検索します。")
  @GetMapping("/searchGuest")
  public List<GuestDetailDto> searchGuest(@ModelAttribute Guest guest,
      @RequestParam(required = false) ReservationStatus status) {
    return service.searchGuest(guest, status);
  }

  @Operation(summary = "ゲスト情報登録", description = "ゲスト情報を入力し、ゲスト情報を登録します。")
  @PutMapping("/insertGuest")
  public ResponseEntity<String> insertStudent(@RequestBody GuestDetailDto guestDetailDto) {
    service.insertGuest(guestDetailDto);
    return ResponseEntity.ok("宿泊者情報の登録が完了しました。");
  }

  @Operation(summary = "宿泊プラン登録", description = "宿泊プラン情報を入力し、登録します。")
  @PutMapping("/insertBooking")
  public ResponseEntity<String> insertStudent(@RequestBody Booking booking) {
    service.insertBooking(booking);
    return ResponseEntity.ok("宿泊プランの登録が完了しました。");
  }

  @Operation(summary = "ゲスト情報の変更", description = "ゲスト情報の変更を行います")
  @PutMapping("/editGuest")
  public ResponseEntity<String> editGuest(@RequestBody GuestDetailDto guestDetailDto) {
    service.editGuest(guestDetailDto);
    return ResponseEntity.ok("宿泊者情報の変更が完了しました");
  }

  @Operation(summary = "チェックイン", description = "宿泊客のチェックインを行います")
  @PutMapping("/checkIn")
  public ResponseEntity<String> checkIn(@RequestBody ReservationDto reservationDto) {

    // 会計などの処理を作る。

    service.checkIn(reservationDto.getId());
    return ResponseEntity.ok("チェックインが完了しました");
  }
}