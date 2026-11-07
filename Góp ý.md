# Góp ý giao diện vòng 13 — đã triển khai

Ngày cập nhật: 07/11/2026

Phạm vi: tốc độ chạy, toolbar/runbar mobile, nút Hướng dẫn và panel Kết quả.

## 1. Yêu cầu đã chốt

- Thêm điều chỉnh tốc độ nhưng phần nhìn thấy chỉ là `0.5x`, `1x`, `1.5x`, `2x`; không hiện chữ **Tốc độ**.
- Khôi phục toolbar mobile hai tầng: hàng chính chia đều, nút ba chấm đứng mở tầng công cụ dưới.
- Mobile bo cong, thu nhỏ control/chữ/viền để giao diện thanh thoát và không chồng lấn.
- Progress runbar phải nhìn thấy đầy đủ, không bị surface cắt.
- Nút mở hướng dẫn mobile dùng chữ **Hướng dẫn** ở góc phải dưới thay icon.
- Khi mở, khu vực Kết quả dùng toàn bộ vùng còn lại và cho phép cuộn tới đủ Result, Bảng bước giải, Diễn giải.
- Vừa triển khai vừa chụp ảnh Playwright để tự đối chiếu và sửa tiếp.
- Sau mỗi nhóm thay đổi hoàn chỉnh phải tạo commit riêng và ghi vào tài liệu vận hành.

## 2. Thiết kế mobile cuối cùng

- Hàng chính toolbar cao 44px, surface bo 10px; bốn action chia đều và nút ba chấm rộng 34px ở mép phải.
- Tầng dưới nằm trong cùng surface, toolbar mở cao 82px; control cao 32px, font 12px, cuộn ngang ẩn scrollbar.
- Thứ tự tầng dưới: Vô/Có hướng, Nhập, Xuất, Toàn màn hình, Reset, Thêm ví dụ, theme.
- Runbar cao 48px; transport rộng 28px, Play 32px, speed 48px, Kết quả 52px. Range cao 14px nằm sát đáy và được phép tràn 1px để thumb không bị cắt.
- Select tốc độ có accessible name **Tốc độ chạy** nhưng chỉ hiển thị hệ số.
- Nguồn/Đích giữ một hàng 44px; select vẫn đạt tối thiểu 120px tại 390px khi có nút xóa 44×44px.
- Khi có runbar, zoom ẩn. Ở đáy, Kết quả nằm bên trái và Hướng dẫn 96px nằm bên phải, cách nhau 8px.
- Panel Kết quả mở từ dưới runbar tới cách đáy 8px; nội dung cuộn dọc trong panel.

## 3. File đã thay đổi

- `src/App.tsx`: state tốc độ và interval autoplay theo hệ số.
- `src/components/Controls.tsx`: select speed dạng hệ số.
- `src/components/Toolbar.tsx`: nút ba chấm đứng và thứ tự/class tầng hai.
- `src/components/ShortcutHelp.tsx`: thêm nhãn chữ Hướng dẫn cho mobile.
- `src/i18n/vi.ts`: accessible label tốc độ.
- `src/styles/app.css`: toàn bộ kích thước, radius, bố cục hai tầng, runbar/progress, nút đáy và panel mobile.
- `e2e/app.spec.ts`: đo/chụp ba viewport, speed, progress, không giao nhau và panel toàn vùng.
- Tài liệu: `AGENTS.md`, `README.md`, `Đặc tả.md`, `Giao việc cho agent.md`, `PROMPT_UY_THAC_AGENT_CODE.md`, `Vận hành.md`.

## 4. Đối chiếu ảnh và nghiệm thu

Playwright sinh ảnh sau thay đổi tại:

- `mobile-compact-360x740.png`, `mobile-compact-390x844.png`, `mobile-compact-430x932.png`.
- `mobile-result-360x740.png`, `mobile-result-390x844.png`, `mobile-result-430x932.png`.

Kết quả quan sát:

- [x] Hàng chính phủ kín chiều ngang, không còn khoảng trống dư bên phải.
- [x] Ba chấm đứng hiển thị bằng ba dot CSS thật, không phụ thuộc glyph font.
- [x] Tầng dưới không chồng runbar và cuộn ngang được.
- [x] Transport/runbar nhỏ gọn, speed chỉ hiện hệ số.
- [x] Track và thumb progress nhìn thấy đầy đủ.
- [x] Kết quả và Hướng dẫn nằm cùng hàng, cách nhau 8px; Hướng dẫn không xuống dòng.
- [x] Panel mở hiển thị Kết quả, Bảng và phần đầu Diễn giải, phần còn lại truy cập bằng cuộn dọc.
- [x] Không cuộn ngang trang ở 360×740, 390×844, 430×932.
- [ ] Cần nghiệm thu thêm trên điện thoại thật có notch/safe-area; Playwright desktop không mô phỏng đầy đủ phần cứng.

## 5. Xác minh bắt buộc

```text
npm run lint
npm run test
npm run build
npm run e2e
```

Kết quả cuối và các commit liên quan được ghi trong `Vận hành.md`.

Kết quả lần chạy cuối: lint PASS; 24/24 unit test PASS; production build PASS; 17/17 Playwright E2E PASS.
