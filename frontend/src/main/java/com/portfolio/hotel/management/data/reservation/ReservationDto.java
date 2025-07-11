package com.portfolio.hotel.management.data.reservation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ReservationDto {

  private String id;
  private String guestId;
  private String bookingId;
  private LocalDate checkInDate;
  private Integer stayDays;
  private BigDecimal totalPrice;
  private ReservationStatus status;
  private String memo;
  private LocalDateTime createdAt = LocalDateTime.now();
}