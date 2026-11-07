# Góp ý giao diện vòng 14 — đã triển khai

Ngày cập nhật: 07/11/2026

Phạm vi: runbar mobile và cụm chọn Nguồn/Đích.

## 1. Yêu cầu

- Bỏ nút **Kết quả** khỏi thanh tiến trình trên giao diện mobile.
- Thu gọn khối chọn node nguồn và node đích; không để surface phủ gần hết chiều ngang ở thiết bị rộng.
- Thiết kế lại nhãn và vùng giá trị để select không lấn, cắt hoặc làm mất chữ **Nguồn/Đích**.
- Đối chiếu trực tiếp với ảnh 620×870 do người dùng cung cấp.

## 2. Giải pháp đã triển khai

- `.runbar .table-toggle` bị ẩn dưới 768px; nút **Kết quả** ở hàng đáy vẫn giữ và là điểm mở panel duy nhất trên mobile.
- Cụm `.selectors` căn giữa, rộng tối đa 360px ở trạng thái thường thay vì kéo từ mép trái tới mép phải.
- Khi xuất hiện nút xóa 44×44px, surface tự nới tối đa 380px để giữ đủ không gian cho hai select.
- Mỗi nhóm dùng grid hai cột: nhãn `max-content` và giá trị `minmax(0, 1fr)`; nhãn font 10px, gap 2px, padding trái 3px.
- Vùng select có chiều rộng tối đa khoảng 150px ở trạng thái thường; nhãn luôn hiển thị trọn.
- Tại viewport 390px khi có nút xóa, mỗi select vẫn rộng ít nhất 120px và nút xóa giữ đủ bốn cạnh border.

## 3. File thay đổi

- `src/styles/app.css`
- `e2e/app.spec.ts`
- `Góp ý.md`, `Đặc tả.md`, `Giao việc cho agent.md`, `PROMPT_UY_THAC_AGENT_CODE.md`, `README.md`, `AGENTS.md`, `Vận hành.md`

## 4. Kiểm tra bằng ảnh và Playwright

- Thêm viewport 620×870 đúng tỷ lệ ảnh tham chiếu, bên cạnh 360×740, 390×844, 430×932.
- Ảnh sau thay đổi: `mobile-compact-620x870.png` và `mobile-result-620x870.png` trong artifact Playwright.
- [x] Runbar mobile không còn nút Kết quả.
- [x] Nút Kết quả ở đáy vẫn mở được toàn panel.
- [x] Selectors thường không rộng quá 360px; trạng thái có nút xóa không quá 380px.
- [x] Nhãn Nguồn/Đích không bị cắt.
- [x] Vùng giá trị trạng thái thường không rộng quá 150px.
- [x] Select đạt tối thiểu 120px ở 390px khi có nút xóa.
- [x] Không phát sinh cuộn ngang trang hoặc giao nhau với control đáy.

## 5. Commit

- `08e8dc3` — `fix: compact mobile endpoint controls`

Kết quả kiểm tra cuối và lịch sử vận hành được ghi trong `Vận hành.md`.

Kết quả lần chạy cuối: lint PASS; 24/24 unit test PASS; production build PASS; 17/17 Playwright E2E PASS.
