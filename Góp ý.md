# Góp ý giao diện vòng 10 — trạng thái đã xử lý

Cập nhật ngày 07/11/2026. Hai ảnh người dùng cung cấp là tham chiếu cho các lỗi mobile dưới đây; yêu cầu trong tài liệu này là nguồn quyết định, không coi chữ tình cờ xuất hiện trong ảnh là đặc tả bổ sung.

## Yêu cầu

- Header của bảng hướng dẫn phải dính liền với mép trên và che kín nội dung khi cuộn; không để dòng hướng dẫn ló ra phía trên header.
- Nội dung hướng dẫn trên mobile phải được viết riêng cho thao tác cảm ứng, không hiển thị nguyên danh sách phím tắt desktop.
- Nút thùng rác trong cụm Nguồn/Đích phải có đủ viền trên, phải, dưới và trái.

## Cách đã triển khai

- Tách `.shortcut-heading` khỏi `.shortcut-body`: popover dùng `overflow: hidden`, chỉ body cuộn dọc. Header có nền đặc, border dưới và không di chuyển theo scroll nên nội dung không thể lọt qua mép trên.
- Desktop hiển thị **Hướng dẫn phím tắt**; dưới 768px thay bằng **Hướng dẫn thao tác trên điện thoại** với nội dung riêng: chạm để chọn, chạm đúp để tạo/đổi tên, kéo điểm nối, chỉnh trọng số, xóa bằng nút thùng rác, kéo/chụm canvas và điều khiển thuật toán bằng các nút cảm ứng.
- Nút xóa mobile giữ kích thước 44×44px và dùng `border: 1px solid` đủ bốn cạnh cùng bo góc control; vẫn nằm ở cột cuối của grid Nguồn/Đích.

## Nghiệm thu tự động

- Playwright kiểm tra ở 390×640: nội dung hướng dẫn thực sự cuộn, vị trí header không đổi, popover chặn overflow và chỉ hướng dẫn mobile được hiển thị.
- Playwright kiểm tra bốn `border-*-width` của nút xóa đều bằng `1px`, hai select không bị thu hẹp và nút vẫn nằm gọn trong surface.
- `npm run lint`: đạt.
- `npm run test`: đạt 24/24.
- `npm run build`: đạt.
- `npm run e2e`: đạt 16/16 sau lần chạy cuối.
