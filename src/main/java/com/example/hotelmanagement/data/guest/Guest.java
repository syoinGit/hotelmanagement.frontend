package com.example.hotelmanagement.data.guest;

import java.util.List;
import lombok.*;
import java.util.UUID;

@Getter
@Setter
public class Guest {

  private String id;
  private String name;
  private String kanaName;
  private String gender;
  private Integer age;
  private String region;
  private String email;
  private String phone;
  private Boolean deleted = false;

  }