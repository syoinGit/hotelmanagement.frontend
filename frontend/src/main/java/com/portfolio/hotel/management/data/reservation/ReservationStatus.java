package com.portfolio.hotel.management.data.reservation;

public enum ReservationStatus {
  TEMPORARY("仮予約"),
  NOT_CHECKED_IN("未チェックイン"),
  CHECKED_IN("チェックイン"),
  CHECKED_OUT("チェックアウト"),
  CANCELLED("キャンセル");

  private final String label;

  ReservationStatus(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }

}

