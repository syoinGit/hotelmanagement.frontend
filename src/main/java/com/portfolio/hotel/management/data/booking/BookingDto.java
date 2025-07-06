package com.portfolio.hotel.management.data.booking;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class BookingDto {

  private String id;
  private String name;
  private String description;
  private BigDecimal price;
}