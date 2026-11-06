# Góp ý giao diện vòng 7 — trạng thái đã xử lý

## Yêu cầu

- [x] Ở toàn bộ vùng kết quả — gồm **Kết quả**, **Bảng bước giải** và **Diễn giải chi tiết & Truy vết** — sử dụng đúng tên đỉnh (`label`) người dùng đã nhập thay vì ID nội bộ như 1, 2, 3, 4.
- [x] Không cho thao tác bấm vào Bảng bước giải để đổi bước.

## Cách triển khai đã chốt

1. Engine, snapshot và đường đi vẫn dùng `NodeId` để bảo đảm thuật toán ổn định.
2. Tại lớp hiển thị, mọi ID được ánh xạ sang `node.label`; áp dụng cho tiêu đề cột, đỉnh cố định, predecessor, phép cập nhật, đường đi và truy vết.
3. Bảng bước giải đã bỏ callback nhảy bước, `onClick` ở hàng và button số bước. Hàng hiện tại vẫn được tô để người dùng biết trạng thái đang xem.
4. Điều hướng bước tiếp tục thực hiện bằng runbar, thanh trượt hoặc phím tắt.

## Tiêu chí nghiệm thu

- [x] Import graph có ID khác label và chạy tới cuối: panel chỉ hiển thị label, không lộ ID.
- [x] Bảng không có button tương tác.
- [x] Bấm vào một hàng không thay đổi bộ đếm bước.
- [x] Có E2E bảo vệ đầy đủ hai yêu cầu trên.

## Kết quả xác minh ngày 06/11/2026

- `npm run lint`: đạt.
- `npm run test`: đạt, 24/24 unit test.
- `npm run build`: đạt.
- `npm run e2e`: đạt, 12/12 bài Playwright.
- QA trực quan ở trạng thái đầu và cuối panel: bảng, kết quả, diễn giải và truy vết đều hiển thị “Bắt đầu / Trung gian / Kết thúc”; không xuất hiện `id-a / id-b / id-c`.
