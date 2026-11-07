# AGENTS.md

## Dự án
Dijkstra Visualizer: web app tĩnh, giao diện tiếng Việt, trực quan hóa thuật toán Dijkstra theo từng bước, dùng để giảng dạy và tự học.
Đặc tả đầy đủ: `Đặc tả.md`, `Giao việc cho agent.md` và `Góp ý.md`. Thứ tự ưu tiên khi còn mâu thuẫn: `Góp ý.md` > `Giao việc cho agent.md` > `Đặc tả.md`.

## Công nghệ
React, TypeScript, Vite, React Flow, Vitest, Playwright. Không backend. Không thêm thư viện khác khi chưa hỏi. Node LTS ghi trong `.nvmrc`.

## Lệnh
- `npm install`
- `npm run dev`
- `npm run test`
- `npm run e2e`
- `npm run lint`
- `npm run build`

## Cấu trúc
`src/engine` là thuật toán thuần; `src/model` chứa kiểu và reducer; `src/components` chứa UI; `src/presets` chứa ví dụ; `src/i18n` chứa chuỗi; `src/styles` chứa token.

## Quy tắc bắt buộc
1. `src/engine` không import React hay thư viện giao diện.
2. Kiểu dùng chung nằm ở `src/model/types.ts`.
3. Chuỗi tiếng Việt hiển thị nằm trong `src/i18n/vi.ts`.
4. Màu, cỡ chữ, khoảng cách lấy từ `src/styles/tokens.css`.
5. Desktop: control bo 6px, thanh nổi bo 10px. Mobile dưới 768px: mọi thanh/control/menu bo 4px. Không gradient trang trí, emoji, glassmorphism hay thư viện icon. Play/Pause, bàn phím, chevron và thùng rác dùng SVG nội tuyến có nhãn truy cập. Hỗ trợ theme sáng/tối đồng bộ và lưu lựa chọn.
6. Preset phải khớp `Giao việc cho agent.md`; không sửa số liệu.
7. Không giả định ID node bắt đầu từ 1.
8. Trước khi báo xong phải chạy lint, test, build và e2e; không để `console.log`, code chết hay TODO vô chủ.
9. Nguồn và đích cụ thể phải khác nhau; `target = null` là chế độ chạy tới tất cả node.
10. Desktop có splitter cho panel. Panel chỉ cuộn dọc; Bảng bước giải có scrollbar ngang riêng trong `.table-scroll`.
11. Toolbar không có tên Dijkstra hoặc nút Thêm node/Thêm cạnh/Xóa. App mở canvas trống, không empty overlay; Reset tạo canvas trống, Thêm ví dụ nạp VD1.
12. Ở chế độ Chọn: nhấp đúp canvas thêm node, click node chọn, Shift+click chọn nhiều, double-click sửa tên. Handle chỉ hiện khi node được chọn/đang nối; `Backspace` xóa toàn selection trong một transaction.
13. Node/cạnh phải đi theo con trỏ trong lúc kéo; cạnh ưu tiên đường thẳng, trọng số hiển thị trực tiếp trên cạnh.
14. Panel đóng mặc định, Hiện kết quả mở toàn panel và snapshot done tự mở; separator có nút đóng/mở.
15. Cạnh đã tồn tại dùng điểm cắt liên tục trên viền node. Các cạnh cùng cặp node phải chia làn song song, tách endpoint và nhãn; handle kỹ thuật luôn ẩn/không tương tác. Tạo cạnh bằng mode Nối cạnh rồi chọn hai node.
16. Chevron panel và bàn phím dùng SVG màu tương phản ở dark mode. Kết quả/Phân tích chỉ có border ở surface ngoài, không ở element con.
17. Play ở snapshot cuối phải về 0 và chạy lại. Node không vẽ ∞ hoặc marker t; chỉ giữ marker nguồn s.
18. LabelTable đứng trước DetailedExplanation; không còn Explanation snapshot đơn. Khi panel mở, Result, toàn bộ LabelTable và DetailedExplanation luôn dùng snapshot cuối, độc lập với step canvas.
19. Toàn bộ Kết quả, Bảng bước giải và Diễn giải phải hiển thị `node.label`, không lộ ID nội bộ. Bảng bước giải chỉ để đọc, không có button/click để đổi snapshot; điều hướng dùng runbar hoặc phím tắt.
20. Bảng không sticky ngang hai cột đầu. Chọn cạnh mở thanh −/trọng số/+/xóa, không đổi chiều. Mobile có xóa cạnh Nguồn/Đích. Fullscreen toggle hai chiều; Space không là phím global.
21. Hướng dẫn tự mở khi tải trang, có hướng dẫn tạo/chỉnh graph và mobile. Mobile mở lại bằng nút chữ Hướng dẫn ở góc phải dưới; không có icon bàn phím hoặc note cố định. Result chỉ giữ khoảng cách + path, không badge số thứ tự và không khối trace lặp.
22. Mobile 390px: hướng dẫn nằm trong safe area giữa thanh trên và control đáy, tự cuộn và không chồng khối khác. Nguồn/Đích dùng grid hai cột, select ≥120px, thùng rác 44px sát mép phải và không cắt chữ.
23. Header hướng dẫn nằm ngoài body cuộn, nền đặc và che kín mép trên. Mobile dùng nội dung cảm ứng riêng, không hiện phím tắt desktop. Nút thùng rác 44×44px phải có border 1px đủ bốn cạnh.
24. Runbar không có chữ Tốc độ hoặc trạng thái Hoàn tất/Đang chạy; có select nhỏ chỉ hiện `0.5x/1x/1.5x/2x` và thay đổi nhịp autoplay thật. Mobile dùng toolbar hai tầng: hàng chính Chọn/Nối cạnh/Thêm ví dụ/undo icon/redo icon/nút ba chấm đứng; tầng dưới cuộn nội bộ chứa công cụ còn lại, không lặp Ví dụ.
25. Desktop toolbar phải nằm trọn trong canvas và cuộn ngang nội bộ khi splitter làm canvas hẹp. Mobile ẩn zoom khi runbar hiện, giữ progress nhìn thấy đầy đủ, đặt Kết quả và Hướng dẫn cạnh nhau ở đáy; khi mở, panel Kết quả chiếm toàn bộ vùng còn lại và cuộn nội bộ. Kiểm tra tại 360×740, 390×844, 430×932. Cạnh vô hướng chỉ có một đường, một nhãn và không mũi tên.
26. Sau mỗi nhóm thay đổi hoàn chỉnh phải chạy kiểm tra liên quan rồi tạo commit riêng. Ghi commit chức năng và kết quả xác minh vào `Vận hành.md`; không push nếu người dùng chưa yêu cầu.
27. Mobile không hiển thị nút Kết quả trong runbar; chỉ dùng nút Kết quả ở hàng đáy. Cụm Nguồn/Đích căn giữa, tối đa 360px khi thường và 380px khi có nút xóa; nhãn có cột riêng, không bị select lấn hoặc cắt.
