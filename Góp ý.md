# Góp ý giao diện vòng 15 — đã triển khai

Ngày cập nhật: 07/11/2026

## Yêu cầu

- Trên mobile, đưa nút **Thêm ví dụ** lên hàng công cụ chính.
- Thay phần hiển thị chữ **Hoàn tác** và **Làm lại** bằng icon, theo ảnh tham chiếu.

## Cách thực hiện

- Hàng chính mobile theo thứ tự: **Chọn · Nối cạnh · Thêm ví dụ · Hoàn tác · Làm lại · ⋮**.
- Hàng chính dùng lưới sáu cột: ba action chữ co giãn, hai action icon 34px và nút ba chấm 34px; không để thừa khoảng trống ở bên phải.
- Hoàn tác/Làm lại dùng SVG inline mũi tên cong, không thêm thư viện icon. Button giữ `aria-label` và `title` tiếng Việt; desktop vẫn hiển thị chữ đầy đủ.
- **Thêm ví dụ** bị ẩn ở tầng dưới mobile để không lặp action; desktop giữ vị trí toolbar hiện có.
- Theo quy tắc giao diện hiện hành, surface và control mobile dùng bo góc 4px nhất quán.

## Đối chiếu ảnh

- Ảnh Playwright 620×870 xác nhận Ví dụ ở hàng đầu, hai icon mũi tên hiển thị rõ, ba chấm ở mép phải và không có overlap.
- Kiểm tra tại 360×740, 390×844, 430×932, 620×870 vẫn giữ toolbar/runbar/selectors trong viewport và không tạo cuộn ngang trang.

## Commit và kiểm tra

- `562df94` — `feat: promote example action on mobile toolbar`
- `npm run lint`: PASS.
- `npm run test`: PASS — 24/24.
- `npm run build`: PASS.
- `npm run e2e`: PASS — 17/17; bao gồm 360×740, 390×844, 430×932 và 620×870.

Kết quả kiểm tra đầy đủ và lịch sử commit được ghi trong `Vận hành.md`.
