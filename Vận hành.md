# Vận hành dự án

## Quy tắc commit

1. Mỗi nhóm thay đổi độc lập phải được kiểm tra bằng các lệnh phù hợp trước khi commit.
2. Không trộn thay đổi chức năng, bố cục lớn và đồng bộ tài liệu vào cùng một commit nếu có thể tách hợp lý.
3. Commit message dùng dạng ngắn gọn `type: mô tả`.
4. Trước khi bàn giao phải chạy đủ `npm run lint`, `npm run test`, `npm run build`, `npm run e2e`.
5. Không push remote nếu người dùng chưa yêu cầu rõ.

## Nhật ký thay đổi vòng 13

| Commit | Phạm vi | Xác minh trước commit |
| --- | --- | --- |
| `c51bfd2` | Mốc giao diện và tài liệu vòng 12 trước khi bắt đầu yêu cầu mới | lint, 24 unit test, build, 17 E2E đã pass ở lượt trước |
| `6406ce8` | Thêm speed `0.5x/1x/1.5x/2x`, thay interval autoplay và test control | lint pass, 24 unit test pass, E2E preset pass |
| `288d076` | Khôi phục toolbar mobile hai tầng, thu gọn runbar, hiện progress, nút Hướng dẫn chữ và panel Kết quả toàn vùng | lint pass; 3 E2E responsive/splitter pass; ảnh 360/390/430px đã xem trực tiếp |
| `08e8dc3` | Bỏ Kết quả khỏi runbar mobile; thu selectors thường còn 360px và trạng thái có nút xóa tối đa 380px | lint pass; 2 E2E mobile pass; ảnh 620×870 đã xem trực tiếp |
| `562df94` | Đưa Thêm ví dụ lên toolbar chính mobile; SVG inline undo/redo, bỏ Ví dụ tầng dưới | lint pass; E2E toolbar tại 360/390/430/620px pass; ảnh 620×870 đã xem trực tiếp |
| `d93b3b3` | Chuẩn hóa bo góc mọi surface/control mobile là 4px và ổn định assertion màu dark theme | lint pass; 24 unit test pass; build pass; 17 E2E pass |

## Checklist bàn giao vòng 13

- [x] Mỗi nhóm chức năng có commit riêng.
- [x] Ảnh responsive đã được sinh và xem lại trong quá trình sửa.
- [x] Không thêm dependency.
- [x] Không thay engine, schema hoặc số liệu preset.
- [x] Bộ kiểm tra cuối: lint PASS; 24/24 unit test PASS; build PASS; 17/17 E2E PASS.
- [ ] Nghiệm thu thủ công trên điện thoại thật có safe area/notch.

## Kết quả xác minh cuối vòng 13

| Lệnh | Kết quả |
| --- | --- |
| `npm run lint` | PASS |
| `npm run test` | PASS — 24/24 |
| `npm run build` | PASS — TypeScript + Vite production build |
| `npm run e2e` | PASS — 17/17 |

Các kết quả trên được chạy lại sau commit `d93b3b3`, bao gồm phép đo mới ở viewport 620×870, toolbar Ví dụ/undo/redo và bo góc mobile 4px.
