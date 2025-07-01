package com.example.hotelmanagement.data.guest;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class GuestDto {

  private String id;
  private String name;
  private String kanaName;
  private String gender;
  private Integer age;
  private String region;
  private String email;
  private String phone;

}