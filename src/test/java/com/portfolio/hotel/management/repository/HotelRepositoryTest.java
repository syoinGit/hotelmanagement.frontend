package com.portfolio.hotel.management.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.portfolio.hotel.management.data.booking.BookingDto;
import com.portfolio.hotel.management.data.guest.Guest;
import com.portfolio.hotel.management.data.guest.GuestDto;
import com.portfolio.hotel.management.data.reservation.ReservationDto;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;


@MybatisTest
class HotelRepositoryTest {

  @Autowired
  HotelRepository sut;

  @Test
  void 宿泊者の全件検索ができること() {
    List<GuestDto> actual = sut.findAllGuest();
    assertThat(actual.size()).isEqualTo(2);
  }

  @Test
  void 宿泊プランの全件検索ができること() {
    List<BookingDto> actual = sut.findAllBooking();
    assertThat(actual.size()).isEqualTo(2);

  }

  @Test
  void 宿泊者情報の全件検索ができること() {
    List<ReservationDto> actual = sut.findAllReservation();
    assertThat(actual.size()).isEqualTo(2);

  }

  @Test
  void 宿泊者の単一検索_IDから宿泊者を検索できるか確認() {
    GuestDto guestDto = new GuestDto();
    guestDto.setId("11111111-1111-1111-1111-111111111111");
    List<GuestDto> actual = sut.searchGuest(guestDto);

    GuestDto result = actual.getFirst();
    assertThat(actual.size()).isEqualTo(1);
    assertThat(result.getName()).isEqualTo("佐藤花子");
    assertThat(result.getKanaName()).isEqualTo("サトウハナコ");
    assertThat(result.getGender()).isEqualTo("FEMALE");

  }

  @Test
  void 宿泊者の完全一致検索_名前_かな名_電話番号の組み合わせから宿泊者を検索できるか確認() {
    Guest guest = new Guest();
    guest.setName("佐藤花子");
    guest.setKanaName("サトウハナコ");
    guest.setPhone("08098765432");

    GuestDto actual = sut.matchGuest(guest);

  }


}