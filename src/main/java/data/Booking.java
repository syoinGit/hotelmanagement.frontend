package data;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class Booking {

  private UUID id;
  private String name;
  private String description;
  private BigDecimal price;
  private Boolean isAvailable = true;
}