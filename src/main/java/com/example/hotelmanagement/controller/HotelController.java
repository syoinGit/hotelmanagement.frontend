package com.example.hotelmanagement.controller;

import com.example.hotelmanagement.data.booking.Booking;
import com.example.hotelmanagement.data.guest.Guest;
import com.example.hotelmanagement.data.guest.GuestDetailDto;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.example.hotelmanagement.service.HotelService;

@RestController
public class HotelController {

  private final HotelService service;

  public HotelController(HotelService service) {
    this.service = service;
  }

  // ゲスト情報の全権取得
  @GetMapping("/guestList")
  public List<GuestDetailDto> getGuestList() {
    return service.getAllGuest();
  }

  // ゲストの単一検索
  @GetMapping("/searchGuest")
  public List<GuestDetailDto> searchGuest(@ModelAttribute Guest guest) {
    return service.searchGuest(guest);
  }

  // ゲスト情報の登録
  @PutMapping("/insertGuest")
  public ResponseEntity<String> insertStudent(@RequestBody GuestDetailDto guestDetailDto) {
    service.insertGuest(guestDetailDto);
    return ResponseEntity.ok("宿泊者情報の登録が完了しました。");
  }
  @PutMapping("/insertBooking")
  public ResponseEntity<String> insertStudent(@RequestBody Booking booking){
    service.insertBooking(booking);
    return ResponseEntity.ok("宿泊プランの登録が完了しました。");
  }
}