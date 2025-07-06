package com.portfolio.hotel.management.data.booking;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class Booking {

  private String id;
  private String name;
  private String description;
  private BigDecimal price;
  private Boolean isAvailable = true;
}