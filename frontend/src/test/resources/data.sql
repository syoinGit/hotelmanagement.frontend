-- guest（宿泊者）テーブル
INSERT INTO guest (id, name, kana_name, gender, age, region, email, phone, deleted)
VALUES
  ('11111111-1111-1111-1111-111111111111', '佐藤花子', 'サトウハナコ', 'FEMALE', 28, '東京', 'hanako@example.com', '08098765432', 0),
  ('22222222-2222-2222-2222-222222222222', '田中太郎', 'タナカタロウ', 'MALE', 35, '大阪', 'taro@example.com', '08011112222', 0);

-- booking（宿泊プラン）テーブル
INSERT INTO booking (id, name, description, price, is_available)
VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '朝食付きプラン', '和洋朝食が選べるプラン', 10000.00, 1),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '素泊まりプラン', '食事なし・シンプルステイ', 7000.00, 1);

-- reservation（予約）テーブル
INSERT INTO reservation (id, guest_id, booking_id, check_in_date, stay_days, total_price, status, memo, created_at)
VALUES
  ('rsv00001-aaaa-bbbb-cccc-000000000001', '11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '2025-07-15', 2, 20000.00, 'NOT_CHECKED_IN', '観光で利用', '2025-07-01 10:00:00'),

  ('rsv00002-bbbb-cccc-dddd-000000000002', '22222222-2222-2222-2222-222222222222', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '2025-07-18', 1, 7000.00, 'CHECKED_IN', '出張で利用', '2025-07-02 15:30:00');