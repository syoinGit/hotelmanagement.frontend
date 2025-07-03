package com.example.hotelmanagement.controller;

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

  @GetMapping("/guestList")
  public List<GuestDetailDto> getGuestList() {
    return service.getAllGuest();
  }

  @GetMapping("/searchGuest")
  public List<GuestDetailDto> searchGuest(@ModelAttribute Guest guest) {
    return service.searchGuest(guest);
  }

  @PutMapping("/insertGuest")
  public ResponseEntity<String> registerStudent(@RequestBody GuestDetailDto guestDetailDto) {
    service.insertGuest(guestDetailDto);
    return ResponseEntity.ok("更新処理が完了しました。");
  }
}