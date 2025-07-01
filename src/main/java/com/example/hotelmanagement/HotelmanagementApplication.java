package com.example.hotelmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HotelmanagementApplication {

  public static void main(String[] args) {
    SpringApplication.run(HotelmanagementApplication.class, args);

    System.out.println("DB URL: " + System.getProperty("spring.datasource.url"));

  }
}