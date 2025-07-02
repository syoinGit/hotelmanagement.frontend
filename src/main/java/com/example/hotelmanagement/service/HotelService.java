package com.example.hotelmanagement.service;

import com.example.hotelmanagement.data.guest.Guest;
import com.example.hotelmanagement.data.guest.GuestDetailDto;
import com.example.hotelmanagement.data.guest.GuestDto;
import java.util.List;
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

  public List<GuestDetailDto> getAllGuest() {
    return converter.convertGuestDetailDto(
        repository.findAllGuest(),
        repository.findAllBooking(),
        repository.findAllReservation());
  }

  public List<GuestDetailDto> searchGuest(Guest guest) {
    return converter.convertGuestDetailDto(
        repository.searchGuest(guest),
        repository.findAllBooking(),
        repository.findAllReservation());
  }
}