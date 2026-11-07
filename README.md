# Dijkstra Algorithm Visualizer

Ứng dụng web trực quan hóa thuật toán Dijkstra bằng tiếng Việt. Người dùng có thể tự vẽ đồ thị, chọn nguồn và đích, chạy thuật toán từng bước, xem bảng nhãn, phép tính cập nhật và đường đi ngắn nhất.

Ứng dụng chạy hoàn toàn trên trình duyệt, không cần backend, tài khoản hay cơ sở dữ liệu.

## Chạy nhanh

Mở Terminal hoặc PowerShell tại thư mục dự án rồi chạy:

```bash
npm install
npm run dev
```

Khi Terminal hiện địa chỉ tương tự dưới đây, mở địa chỉ đó bằng trình duyệt:

```text
http://localhost:5173/
```

Nhấn `Ctrl+C` trong Terminal để dừng ứng dụng.

## 1. Yêu cầu hệ thống

Trước khi bắt đầu, máy cần có:

- Node.js 24, là phiên bản được ghi trong `.nvmrc`;
- npm, được cài kèm Node.js;
- trình duyệt Chrome, Edge, Firefox hoặc Safari phiên bản mới.

Kiểm tra Node.js và npm:

```bash
node --version
npm --version
```

Kết quả `node --version` nên bắt đầu bằng `v24`. Nếu lệnh không tồn tại, hãy cài Node.js trước rồi mở lại Terminal.

Nếu đang dùng NVM, chuyển đúng phiên bản bằng:

```bash
nvm install
nvm use
```

Trên một số bản NVM cho Windows, cần ghi rõ phiên bản:

```powershell
nvm install 24
nvm use 24
```

## 2. Mở thư mục mã nguồn

Mở Terminal ngay trong thư mục chứa `package.json`.

Ví dụ trên Windows PowerShell:

```powershell
cd "D:\UIT\Dijkstra"
Get-ChildItem package.json
```

Trên macOS hoặc Linux:

```bash
cd /duong-dan-den/Dijkstra
ls package.json
```

Nếu nhìn thấy file `package.json`, bạn đang đứng đúng thư mục.

## 3. Cài dependency

Chỉ cần thực hiện khi chạy lần đầu hoặc sau khi `package.json` thay đổi:

```bash
npm install
```

Lệnh này tạo thư mục `node_modules` và cài React, Vite, React Flow cùng các công cụ kiểm thử. Không cần cài React, Vite hoặc TypeScript ở phạm vi toàn hệ thống.

Nếu PowerShell chặn file `npm.ps1`, dùng:

```powershell
npm.cmd install
```

## 4. Chạy ứng dụng

Chạy môi trường phát triển:

```bash
npm run dev
```

Terminal sẽ hiển thị địa chỉ tương tự:

```text
VITE ready
Local: http://localhost:5173/
```

Mở địa chỉ `Local` trong trình duyệt. Khi sửa mã nguồn, trang sẽ tự cập nhật. Nhấn `Ctrl+C` trong Terminal để dừng server.

Nếu cổng 5173 đang được sử dụng, Vite có thể tự chọn cổng khác. Luôn dùng đúng địa chỉ được in trong Terminal. Cũng có thể tự chọn cổng:

```bash
npm run dev -- --port 5174
```

Để thiết bị khác trong cùng mạng LAN truy cập:

```bash
npm run dev -- --host 0.0.0.0
```

Sau đó mở địa chỉ mạng mà Vite hiển thị. Hệ điều hành có thể yêu cầu cho phép Node.js đi qua tường lửa.

## 5. Cách sử dụng

### Chạy VD1 mẫu

1. Mở ứng dụng: canvas hoàn toàn trống và không có hộp nạp mẫu. Nhấn **Thêm ví dụ** trên toolbar để nạp VD1.
2. Kiểm tra hai ô **Nguồn** và **Đích** ở phía dưới canvas.
3. Dùng cụm transport `|‹`, `‹`, `›`, `›|` và nút SVG Play/Pause để về đầu, lùi, tiến, tới cuối hoặc chạy/dừng tự động. Chọn `0.5x`, `1x`, `1.5x` hoặc `2x` để đổi tốc độ; control không hiển thị thêm chữ “Tốc độ”.
4. Panel kết quả đóng mặc định. Nhấn **Hiện kết quả** để mở Kết quả, Bảng bước giải và Diễn giải chi tiết; khi thuật toán hoàn tất, panel tự mở.
5. Kéo separator để đổi độ rộng panel; dùng nút trên separator để đóng và nút ở mép phải canvas để mở lại. Panel luôn chừa đủ chỗ cho control canvas. Panel chỉ cuộn dọc; bảng rộng có thanh cuộn ngang riêng trong vùng Bảng bước giải.
6. Tới bước cuối để xem khoảng cách, đường đi và diễn giải từng bước. Truy vết nằm trong phần Diễn giải chi tiết, không lặp lại ở thẻ Kết quả. Bấm **Chạy** lần nữa ở bước cuối để phát lại từ bước 0.
7. Dùng cụm góc dưới trái để thu/phóng và chuyển **Sáng/Tối**. Lựa chọn theme được giữ lại sau khi tải lại trang.

Kết quả, tiêu đề cột, đỉnh cố định, predecessor, đường đi và truy vết đều dùng đúng tên đỉnh đã nhập. ID chỉ là khóa nội bộ và không xuất hiện trong panel khi khác tên. Bảng bước giải là nội dung chỉ đọc; bấm vào hàng/ô không đổi bước. Hãy dùng runbar, thanh trượt hoặc phím tắt để điều hướng.

### Tự tạo đồ thị

1. Ở chế độ **Chọn**, nhấp đúp vùng trống trên canvas để thêm node.
2. Bấm **Nối cạnh**, sau đó click/chạm node đầu và node cuối. Node đầu được nhấn mạnh; cạnh được tạo sau lần chọn thứ hai. Không còn chấm nối hoặc thao tác kéo handle.
3. Chọn cạnh để mở thanh `− / trọng số / + / xóa`. Bấm giá trị để nhập trực tiếp; trọng số phải hữu hạn và không âm. Thanh không có thao tác đổi chiều.
4. Nhấp một lần vào node để chọn; nhấp đúp để đổi tên hiển thị. Nhấn `Enter` để lưu hoặc `Escape` để hủy.
5. Chọn **Nguồn** và **Đích** khác nhau. Ứng dụng vô hiệu hóa node nguồn trong danh sách đích và ngược lại. Chọn **Tất cả node** nếu muốn tính khoảng cách từ nguồn tới mọi node có thể tới; đây cũng là chế độ chạy hợp lệ cho đồ thị một node.
6. Dùng **Tiếp**, **Lùi**, **Đầu**, **Cuối**, **Chạy/Dừng** hoặc thanh trượt để điều hướng.

Để xóa nhiều phần tử, giữ `Shift` và chọn từng node/cạnh rồi nhấn `Backspace`; toàn bộ được xóa trong một transaction nên **Hoàn tác** khôi phục một lần. Có thể xóa một cạnh từ thanh cạnh. Trên mobile, sau khi chọn phần tử sẽ có nút thùng rác ngay cạnh Nguồn/Đích.

Khi kéo node, node và mọi cạnh liên quan chuyển động theo con trỏ ngay trong lúc giữ chuột. Cạnh mới ưu tiên đường thẳng; trọng số được đặt trực tiếp trên cạnh.

Nhấp đúp vùng trống thêm node nhưng không thay đổi zoom. Cạnh đã tạo bám trực tiếp vào viền tròn thay vì bốn chấm. Hai cạnh giữa cùng cặp node được tách thành hai làn song song nên endpoint và trọng số không chồng nhau.

Nút **Reset** làm mới thành canvas trống hoàn toàn. Nút **Thêm ví dụ** nạp VD1 cùng layout, nguồn và đích chuẩn. Không có hộp hay nút nạp mẫu ở giữa canvas.

Node chưa có khoảng cách hữu hạn không hiện `∞`; node đích không hiện chữ `t`. Node nguồn vẫn có chữ `s`. Canvas vẫn trực quan hóa theo từng bước, nhưng khi mở panel, Kết quả, toàn bộ Bảng bước giải và toàn bộ Diễn giải/Truy vết luôn hiện lời giải cuối ngay từ đầu.

Hướng dẫn tự mở khi tải trang. Desktop hiển thị phím tắt chuột/bàn phím và giữ nút SVG bàn phím; mobile tự chuyển sang **Hướng dẫn thao tác trên điện thoại** với mode Chọn/Nối cạnh, cách chạm, chạm đúp, chỉnh/xóa phần tử, kéo/chụm canvas và điều khiển thuật toán. Trên mobile không có icon/note hướng dẫn cố định; nút chữ **Hướng dẫn** ở góc phải dưới mở lại popover.

Trên mobile dưới 768px, toolbar có hai tầng bo tròn: hàng chính chia đều **Chọn · Nối cạnh · Hoàn tác · Làm lại · ⋮**; chạm nút ba chấm mở tầng dưới cuộn ngang với hướng đồ thị, Nhập, Xuất, Toàn màn hình, Reset, Thêm ví dụ và theme. Runbar thu gọn nhưng vẫn hiện đầy đủ progress và select tốc độ dạng `1x/2x`. Nguồn/Đích nằm cùng một hàng; khi chạy, zoom ẩn để dành chỗ cho **Kết quả** và **Hướng dẫn** ở đáy. Khi mở Kết quả, panel dùng toàn bộ vùng còn lại dưới toolbar/runbar và tự cuộn, không che control trên.

Nút **Toàn màn hình** hoạt động hai chiều: bấm lần đầu để vào và bấm lại để thoát. Nếu thoát bằng `Escape`, nhãn nút cũng tự đồng bộ.

### Phím tắt

| Phím | Hành động |
| --- | --- |
| `←` | Lùi một snapshot |
| `→` | Tới một snapshot |
| `Home` | Về snapshot đầu |
| `End` | Tới snapshot cuối |
| `Backspace` | Xóa node hoặc cạnh đang chọn trong chế độ Chọn |
| `Ctrl+Z` | Hoàn tác |
| `Ctrl+Shift+Z` | Làm lại |
| `Enter` | Lưu khi đang sửa nhãn hoặc trọng số |
| `Escape` | Hủy khi đang sửa nhãn hoặc trọng số |
| `?` | Mở hoặc đóng hướng dẫn phím tắt |

`Space` không phải phím tắt toàn cục. Sau khi người dùng click/focus nút Play/Pause, Space hoặc Enter có thể kích hoạt chính button theo hành vi bàn phím native. Các phím tắt toàn cục khác không chạy khi con trỏ ở ô nhập hoặc danh sách chọn.

## 6. Nhập và xuất JSON

- Nhấn **Xuất** để tải graph hiện tại xuống dưới dạng file JSON.
- Nhấn **Nhập** và chọn file JSON hợp lệ để thay graph hiện tại.
- Thao tác nhập là một transaction, vì vậy có thể dùng **Hoàn tác** để trở về graph trước đó.

Schema version 1:

```json
{
  "version": 1,
  "directed": false,
  "nodes": [
    { "id": "1", "label": "1", "x": 60, "y": 218 },
    { "id": "2", "label": "2", "x": 290, "y": 60 }
  ],
  "edges": [
    { "id": "e1", "from": "1", "to": "2", "weight": 3 }
  ],
  "source": "1",
  "target": "2"
}
```

Quy ước:

- `directed: true` là đồ thị có hướng; `false` là đồ thị vô hướng;
- `source` là ID node nguồn và phải tồn tại;
- `target: null` nghĩa là chạy tới mọi node có thể tới;
- `source` và `target` cụ thể bắt buộc khác nhau; file có hai giá trị trùng bị từ chối;
- cạnh nhập vào có thể thiếu `id`; ứng dụng sẽ sinh ID tất định;
- trọng số phải là số hữu hạn `>= 0`;
- không cho self-loop hoặc cạnh song song;
- giới hạn là 50 node và 200 cạnh;
- snapshot và nhãn thuật toán không được lưu trong file graph.

## 7. Build bản production

Tạo bundle tĩnh tối ưu:

```bash
npm run build
```

Kết quả nằm trong thư mục `dist`. Có thể đưa toàn bộ nội dung thư mục này lên static hosting như GitHub Pages, Netlify, Vercel hoặc một web server tĩnh khác.

Để xem thử bundle production trên máy:

```bash
npx vite preview
```

Sau đó mở địa chỉ được in trong Terminal, thường là `http://localhost:4173/`.

## 8. Chạy kiểm thử

### Unit test

Kiểm tra engine Dijkstra, validation, reducer và import/export:

```bash
npm run test
```

### Lint

Kiểm tra TypeScript và các quy tắc kiến trúc:

```bash
npm run lint
```

### E2E bằng Playwright

Lần đầu chạy E2E, cài Chromium dành cho Playwright:

```bash
npx playwright install chromium
```

Sau đó chạy:

```bash
npm run e2e
```

E2E sẽ tự khởi động web server cục bộ và kiểm tra các luồng chính ở desktop 1280×800 cùng mobile 360×740, 390×844 và 430×932.

### Kiểm tra đầy đủ trước khi bàn giao

```bash
npm install
npm run lint
npm run test
npm run build
npm run e2e
```

## 9. Xử lý lỗi thường gặp

### `node` hoặc `npm` không được nhận diện

Cài Node.js 24, sau đó đóng và mở lại Terminal. Kiểm tra lại bằng `node --version` và `npm --version`.

### PowerShell báo không thể chạy `npm.ps1`

Dùng các file lệnh Windows trực tiếp:

```powershell
npm.cmd install
npm.cmd run dev
```

### Trang không mở ở cổng 5173

Đọc địa chỉ `Local` trong Terminal. Vite có thể đã chọn cổng khác. Nếu cần, chạy:

```bash
npm run dev -- --port 5174
```

### E2E báo thiếu browser executable

```bash
npx playwright install chromium
```

Sau đó chạy lại `npm run e2e`.

### E2E báo cổng 4173 đang được sử dụng

Dừng tiến trình Vite hoặc Playwright cũ bằng `Ctrl+C`, rồi chạy lại. Không mở đồng thời một server khác trên cổng 4173 khi chạy E2E.

### Graph không chạy

Kiểm tra thông báo trong giao diện. Các nguyên nhân thường gặp:

- chưa chọn nguồn;
- nguồn hoặc đích không còn tồn tại;
- nguồn và đích trùng nhau;
- trọng số âm, rỗng hoặc không phải số;
- self-loop hoặc cạnh trùng;
- chuyển sang vô hướng trong khi có hai cạnh đối hướng giữa cùng một cặp node.

## 10. Cấu trúc dự án

```text
src/
  components/   Canvas và các thanh/panel giao diện
  engine/       Validation, Dijkstra O(n²), dựng đường và truy vết
  i18n/         Chuỗi giao diện tiếng Việt
  model/        Kiểu dữ liệu, reducer, import/export
  presets/      VD1 dùng bởi nút Thêm ví dụ, các ví dụ chuẩn và fixtures kiểm thử
  styles/       Design tokens và CSS responsive
e2e/            Kiểm thử Playwright
```

Tầng `src/engine` là các hàm thuần và không phụ thuộc React hoặc DOM. Giao diện chỉ đọc các snapshot được engine tính trước.

## 11. Thêm preset mới

1. Mở `src/presets/samples.ts`.
2. Tạo dữ liệu theo schema JSON version 1.
3. Chuyển dữ liệu bằng helper `fromData`.
4. Thêm preset vào object `presets`.
5. Nút **Thêm ví dụ** hiện chỉ nạp VD1. Nếu muốn preset mới xuất hiện trong giao diện, cập nhật hành vi nút/menu theo đặc tả thay vì tự động đưa mọi fixture kiểm thử lên toolbar.
6. Thêm unit test cho số node, số cạnh, nguồn, đích và kết quả mong đợi.

Không đưa snapshot, nhãn tạm hoặc nhãn vĩnh viễn vào dữ liệu preset.
