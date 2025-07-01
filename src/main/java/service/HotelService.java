package service;

import controller.HotelController;
import org.springframework.stereotype.Service;
import repository.HotelRepository;

@Service
public class HotelService {

  private final HotelRepository repository;

  public HotelService(HotelRepository repository){
    this.repository = repository;

  }





}
