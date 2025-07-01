package data;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class Reservation {

  private UUID id;
  private Guest guest;
  private Booking booking;
  private LocalDate checkInDate;
  private Integer stayDays;
  private BigDecimal totalPrice;
  private ReservationStatus status;
  private String memo;
  private LocalDateTime createdAt = LocalDateTime.now();
}