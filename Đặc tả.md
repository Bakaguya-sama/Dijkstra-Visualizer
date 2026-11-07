# Dijkstra Algorithm Visualizer — Tài liệu đặc tả

Tác giả: Huy · Trạng thái: đã cập nhật theo góp ý giao diện vòng 15 (07/11/2026) · Tài liệu tham chiếu: ECE 307, "Transshipment and Shortest Path Problems" (George Gross, UIUC), slide 51–68

## 1. Tổng quan

### 1.1 Mục tiêu

Xây dựng một web app giúp người học nhìn thấy từng bước của thuật toán Dijkstra trên đồ thị do chính họ vẽ, và nhận được lời giải rõ ràng, đối chiếu được với cách giải tay trong tài liệu (bảng nhãn L⁽ᵏ⁾, nhãn tạm thời/vĩnh viễn, truy vết đường đi).

### 1.2 Vấn đề giải quyết

- Giải tay Dijkstra dễ sai ở bước cập nhật nhãn và bước truy vết.
- Các công cụ có sẵn thường chỉ chạy animation, ít giải thích công thức tính từng nhãn.
- Người học cần tự dựng đồ thị của mình và thử các trường hợp biên (hòa, không tới được, trọng số âm).

### 1.3 Người dùng mục tiêu

Hai nhóm dùng chính: giảng viên minh họa thuật toán trên lớp, và sinh viên tự học ngoài giờ (Kỹ thuật ra quyết định, Cấu trúc dữ liệu & Giải thuật, Vận trù học). Tự học nghĩa là người dùng phải dùng được mà không cần ai hướng dẫn.

## 2. Phạm vi

### 2.1 Bản đầu (MVP)

- Vẽ và chỉnh sửa đồ thị trực tiếp trên canvas: nhấp đúp để thêm node ở mode Chọn, chọn **Nối cạnh** rồi click/chạm hai node để thêm cạnh, `Backspace` để xóa, sửa nhãn/trọng số tại chỗ và kéo thả node theo thời gian thực.
- Đồ thị vô hướng và có hướng.
- Chạy Dijkstra từng bước (tới, lùi, tự chạy, nhảy bước) theo đúng thuật toán trong tài liệu.
- Bảng bước giải (bật/tắt được, mặc định tắt) và giải thích bằng văn bản cho từng bước.
- Kết quả cuối: độ dài ngắn nhất, đường đi, truy vết ngược.
- Kiểm tra dữ liệu đầu vào (trọng số âm, đích không tới được...).
- Ứng dụng mở bằng canvas trống; nút Thêm ví dụ trên toolbar mới nạp VD1, layout, nguồn và đích chuẩn.
- Nhập/xuất JSON.

### 2.2 Bản sau (v2)

- Chia sẻ đồ thị qua URL.
- Hiển thị tất cả đường ngắn nhất khi có hòa.

### 2.3 Ngoài phạm vi

- Max-flow, min-cut, transshipment (cùng tài liệu nhưng là chủ đề khác).
- Đồ thị rất lớn (trên khoảng 50 node).
- Tài khoản người dùng, backend, lưu trữ trên server.
- Thuật toán xử lý trọng số âm (Bellman-Ford). Chỉ cảnh báo, không giải.
- Preset bài toán thay thế thiết bị và bài toán xếp sách (slide 69–82).
- Nhập đồ thị bằng ma trận kề.
- Phiên bản priority queue và so sánh độ phức tạp với bản O(n²).
- Tự động lưu đồ thị trong trình duyệt; chỉ xuất/nhập file JSON.
- Chọn tay node khi hòa; luôn tự động chọn node có ID nhỏ nhất.

## 3. Cơ sở thuật toán

Phần này chuyển nội dung tài liệu thành quy tắc mà ứng dụng phải tuân thủ.

### 3.1 Bài toán và giả thiết

- Đồ thị gồm tập node N = {1, 2, ..., n}, nguồn s = 1, đích t = n (ứng dụng cho phép chọn bất kỳ cặp node, theo slide 64).
- Mỗi cạnh (i, j) có khoảng cách d\_ij.
- Giả thiết bắt buộc: d\_ij ≥ 0.
- Hai node không nối trực tiếp có d\_ij = ∞.

### 3.2 Các bước (theo slide 55–56)

1. **Bước 0**: gán nhãn vĩnh viễn 0 cho node nguồn.
2. **Bước 1**: gán nhãn tạm cho các node còn lại: d\_1j nếu nối trực tiếp, ∞ nếu không. Chọn nhãn tạm nhỏ nhất, chuyển thành vĩnh viễn. Hòa thì chọn tùy ý.
3. **Bước 2**: gọi A là node vừa được gán nhãn vĩnh viễn. Với mỗi node j còn nhãn tạm, tính lại nhãn = min{ nhãn tạm hiện tại của j, nhãn vĩnh viễn của A + d\_Aj }.
4. **Bước 3**: chọn nhãn tạm nhỏ nhất, chuyển thành vĩnh viễn. Hòa thì chọn tùy ý.
5. **Bước 4**: nếu node vừa chốt là đích thì dừng, ngược lại quay lại Bước 2.

### 3.3 Truy vết (slide 57, 63)

Từ đích n, chọn node j sao cho nhãn vĩnh viễn của j + d\_jn = khoảng cách ngắn nhất. Lặp lại cho tới nguồn. Tài liệu lưu ý một số node có thể bị bỏ qua, nghĩa là có thể tồn tại nhiều node thỏa điều kiện (nhiều đường ngắn nhất bằng nhau).

### 3.4 Quyết định thiết kế quan trọng

- Bước 0 và Bước 1 trong tài liệu tách riêng. Ứng dụng có thể gộp thành bước "Khởi tạo" nhưng vẫn hiển thị đủ hai trạng thái trong bảng nhãn.
- Đồ thị vô hướng được xử lý bằng cách coi mỗi cạnh là hai cạnh có hướng cùng trọng số.
- Khi hòa, tự động chọn node có ID nhỏ nhất, hiển thị rõ "hòa giữa X và Y".

## 4. Yêu cầu chức năng

### 4.1 Chỉnh sửa đồ thị

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-01 | Trong chế độ Chọn, nhấp đúp vùng trống của canvas để thêm node | MVP |
| FR-02 | Shift-chọn nhiều node/cạnh rồi nhấn `Backspace` để xóa cùng một transaction; xóa node kéo theo cạnh và undo khôi phục toàn bộ | MVP |
| FR-03 | Kéo thả node, cạnh đi theo node theo thời gian thực | MVP |
| FR-04 | Toolbar có mode **Nối cạnh**; click/chạm node đầu rồi node cuối để tạo cạnh. Handle kỹ thuật luôn ẩn và không nhận tương tác | MVP |
| FR-05 | Chọn cạnh mở thanh thao tác tại cạnh gồm giảm trọng số, giá trị/sửa, tăng trọng số và xóa; không có đổi chiều | MVP |
| FR-06 | Xóa bằng `Backspace`, nút xóa trên thanh cạnh hoặc nút thùng rác mobile cạnh Nguồn/Đích; không có nút Xóa toàn cục trên toolbar | MVP |
| FR-07 | Nhấp một lần để chọn node; nhấp đúp node để đổi tên/nhãn tại chỗ | MVP |
| FR-08 | Chuyển đổi chế độ vô hướng/có hướng cho toàn đồ thị | MVP |
| FR-09 | Hoàn tác/làm lại (undo/redo) khi chỉnh sửa | MVP |
| FR-10 | Reset tạo canvas trống hoàn toàn: graph vô hướng rỗng, layout rỗng, nguồn/đích null, bước 0 | MVP |
| FR-11 | Nút Thêm ví dụ trên toolbar nạp VD1, layout, nguồn và đích chuẩn rồi vừa khung | MVP |

### 4.2 Điều khiển thuật toán

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-20 | Chọn node nguồn và node đích ở thanh nổi dưới canvas; hai node không được trùng nhau | MVP |
| FR-21 | Cụm điều khiển Đầu, Lùi, bộ đếm bước, Tiếp, Cuối và Chạy/Dừng theo bố cục transport bar; thanh chạy chỉ hiện khi lựa chọn nguồn/đích hợp lệ | MVP |
| FR-22 | Tự chạy (play/pause) ở nhịp cố định; bấm Chạy ở snapshot cuối phải về bước 0 và phát lại | MVP |
| FR-23 | Thanh trượt nhảy tới bước bất kỳ | MVP |
| FR-24 | Chế độ "chạy đến khi hết node" để xem khoảng cách từ nguồn tới mọi node | MVP |

### 4.3 Trực quan hóa

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-30 | Node chỉ hiển thị nhãn khoảng cách khi hữu hạn; node chưa tới được không hiện ∞ trên canvas | MVP |
| FR-31 | Bốn trạng thái node bằng màu và hình: chưa xét, nhãn tạm, nhãn vĩnh viễn, đang xét | MVP |
| FR-32 | Làm nổi bật cạnh đang được relax ở bước hiện tại | MVP |
| FR-33 | Cạnh thuộc đường ngắn nhất được tô riêng khi kết thúc | MVP |
| FR-34 | Bảng bước giải theo mẫu ở mục 8.8; bật/tắt được, mặc định tắt | MVP |
| FR-35 | Chú giải màu | MVP |

### 4.4 Lời giải chi tiết

| Mã | Yêu cầu | Ưu tiên |
| --- | --- | --- |
| FR-40 | Dưới bảng có phần Diễn giải chi tiết từng bước & Truy vết đầy đủ từ snapshot cuối ngay khi panel được mở, độc lập với bước đang hiển thị trên canvas | MVP |
| FR-41 | Với mỗi node được cập nhật, hiển thị phép tính: min(∞, 4 + 3) = 7 | MVP |
| FR-42 | Bảng bước giải chỉ để đọc, không nhận click để đổi snapshot; điều hướng bước chỉ qua runbar/phím tắt | MVP |
| FR-43 | Khối Kết quả cuối chỉ hiện độ dài và đường đi theo chiều xuôi, không badge số thứ tự và không khối truy vết; truy vết vẫn nằm trong Diễn giải chi tiết | MVP |
| FR-44 | Khi có nhiều đường ngắn nhất, liệt kê tất cả | v2 |
| FR-45 | Xuất lời giải ra văn bản hoặc PDF | v2 |

### 4.5 Kiểm tra dữ liệu và trường hợp biên

| Tình huống | Hành vi mong đợi |
| --- | --- |
| Trọng số âm | Chặn nhập, báo lỗi "Dijkstra yêu cầu d\_ij ≥ 0" |
| Trọng số không phải số, hoặc rỗng | Từ chối, giữ giá trị cũ |
| Trọng số bằng 0 | Cho phép |
| Cạnh tự nối (i, i) | Không cho tạo |
| Cạnh trùng (cùng cặp, cùng hướng) | Không cho tạo, gợi ý sửa trọng số cạnh cũ |
| Nguồn trùng đích | Không cho chọn trong giao diện; reducer, validation và import JSON đều từ chối với thông báo "Nguồn và đích phải là hai node khác nhau" |
| Đích không tới được | Hiển thị "Không có đường đi" và các nhãn ∞ |
| Đồ thị không liên thông | Thuật toán vẫn chạy, node ngoài vùng tới được giữ nhãn ∞ |
| Sửa đồ thị khi đang chạy | Hiển thị cảnh báo và reset phiên chạy về đầu |
| Đồ thị trống | Vô hiệu hóa nút chạy, hiển thị gợi ý |
| Đồ thị 1 node | Chỉ chạy được ở chế độ "Tất cả node"; không thể chọn cùng node làm cả nguồn và đích |

## 5. Yêu cầu phi chức năng

- **Hiệu năng**: mượt khi kéo thả với đồ thị tới 50 node và 200 cạnh; kéo node không chạy lại engine, node/cạnh được memo hóa và React Flow chỉ render phần tử đang nằm trong viewport.
- **Tương thích**: Chrome, Firefox, Safari, Edge bản mới; hỗ trợ cảm ứng (kéo thả bằng ngón tay trên điện thoại/máy tính bảng).
- **Đáp ứng màn hình**: bố cục hai cột từ 768px trở lên, một cột dưới 768px; kiểm tra ở 1280, 820 và 390px (mục 8.2).
- **Khả năng truy cập**: không dùng màu làm tín hiệu duy nhất (kèm hình/viền/biểu tượng), điều khiển được bằng bàn phím cho các nút bước, tương phản đạt WCAG AA.
- **Độ chính xác**: kết quả của engine phải trùng với cách giải tay trong tài liệu ở các ví dụ mẫu.
- **Không phụ thuộc mạng**: chạy hoàn toàn ở phía client, hoạt động offline sau khi tải.
- **Ngôn ngữ**: giao diện tiếng Việt, có thể thêm tiếng Anh sau (tách chuỗi văn bản ra file riêng ngay từ đầu).

* **Dùng khi giảng dạy**: cỡ chữ nhãn node, trọng số và bảng nhãn đọc được từ cuối lớp; có nút phóng to canvas toàn màn hình.

## 6. Mô hình dữ liệu

### 6.1 Đồ thị

Vị trí node được lưu tách khỏi dữ liệu đồ thị, để kéo thả không kích hoạt tính lại thuật toán.

```ts
type NodeId = string;

interface GraphNode { id: NodeId; label: string; }

interface GraphEdge {
  id: string;
  from: NodeId;
  to: NodeId;
  weight: number; // >= 0
}

interface Graph {
  directed: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

type Layout = Record<NodeId, { x: number; y: number }>;
```

### 6.2 Snapshot của thuật toán

Engine là một hàm thuần, nhận đồ thị, nguồn, đích và trả về mảng snapshot. Giao diện chỉ việc hiển thị snapshot thứ k, nên bước lùi/tới và nhảy bước không cần tính lại.

```ts
interface RelaxInfo {
  to: NodeId;
  edgeId: string;
  oldLabel: number;   // Infinity nếu chưa có
  candidate: number;  // nhãn vĩnh viễn của A + d_Aj
  newLabel: number;
  updated: boolean;
}

interface Snapshot {
  step: number;
  phase: 'init' | 'select' | 'relax' | 'done';
  current: NodeId | null;               // node A vừa được chốt
  labels: Record<NodeId, number>;       // Infinity = ∞
  permanent: NodeId[];
  predecessors: Record<NodeId, NodeId[]>; // nhiều phần tử nếu hòa
  relaxations: RelaxInfo[];
  tieBetween: NodeId[] | null;          // các node hòa khi chọn
  explanation: string;                  // văn bản giải thích
}

interface DijkstraResult {
  snapshots: Snapshot[];
  distance: number | null;              // null nếu không tới được
  paths: NodeId[][];                    // tất cả đường ngắn nhất
}
```

Khi xuất JSON, ∞ được lưu là null.

### 6.3 Định dạng file xuất/nhập

```json
{
  "version": 1,
  "directed": false,
  "nodes": [{ "id": "1", "label": "1", "x": 80, "y": 200 }],
  "edges": [{ "from": "1", "to": "2", "weight": 3 }],
  "source": "1",
  "target": "6"
}
```

Khi nhập phải kiểm tra: phiên bản, node tham chiếu tồn tại, trọng số hợp lệ, giới hạn kích thước.

## 7. Thiết kế engine

- Cài đặt phiên bản O(n²) đúng như tài liệu (quét mảng nhãn tạm để chọn nhỏ nhất). Phù hợp với mục đích dạy học và đồ thị nhỏ.
- Mỗi vòng lặp sinh ít nhất hai snapshot: một cho bước chọn node, một cho bước relax. Bước 0/1 gộp trong snapshot khởi tạo.
- Lưu danh sách predecessor (không chỉ một) để dựng mọi đường ngắn nhất.
- Truy vết dùng điều kiện của tài liệu (nhãn vĩnh viễn của j + d\_jn = khoảng cách) và đối chiếu bằng predecessor để đảm bảo hai cách cho cùng kết quả.
- Đồ thị vô hướng được mở rộng thành hai cạnh có hướng khi chạy, nhưng giao diện vẫn vẽ một đường.
- Điều kiện dừng: node đích được chốt. Ở chế độ "hết node", dừng khi không còn nhãn tạm hữu hạn.
- Kiểm tra đầu vào trước khi chạy; engine không tự sửa dữ liệu.

## 8. Thiết kế giao diện

### 8.1 Nguyên tắc thiết kế

Giao diện là một công cụ làm việc gọn, gần với trình soạn thảo hơn là trang giới thiệu sản phẩm, và trông như do một người thiết kế có chủ đích: chữ rõ ràng, bố cục quen thuộc, không hiệu ứng làm màu. Các quy tắc dưới đây đủ cụ thể để kiểm tra được bằng mắt và bằng thước đo.

| Hạng mục | Quy tắc | Tránh |
| --- | --- | --- |
| Bo góc | 6px cho nút/ô nhập và 10px cho thanh nổi; node là hình tròn | Bo dạng viên thuốc, nhiều giá trị bo tùy hứng |
| Viền và bóng | Phân vùng bằng khoảng trắng; splitter 10px giữa canvas/panel; bóng hai lớp nhẹ chỉ cho menu, popover và thanh nổi | Thẻ lồng thẻ, viền quanh mọi khối, glassmorphism, hiệu ứng phát sáng |
| Màu | Có theme sáng/tối đồng bộ; nền canvas và lưới theo ảnh tham chiếu, xanh lam cho trạng thái thuật toán, cam ấm cho trạng thái chạy/hoàn tất; màu node theo mục 8.3 | Gradient, màu neon hoặc quá nhiều màu trang trí |
| Chữ | Một họ font sans của hệ thống; monospace cho nhãn số và bảng; ba cỡ 12 / 14 / 16px; in đậm chỉ cho tiêu đề và kết quả | Nhiều họ font, tiêu đề cỡ lớn, in đậm khắp nơi, emoji |
| Lưới và căn chỉnh | Lưới 8px, mọi khoảng cách là bội của 4px; nút và ô nhập desktop cao 34px, vùng chạm mobile tối thiểu 44px; văn bản căn trái, ô bảng căn giữa; nhãn và ô nhập thẳng hàng | Căn giữa đoạn văn, khoảng cách tùy hứng, control lệch chiều cao, padding quá rộng |
| Biểu tượng | Không dùng thư viện icon. Play/Pause, bàn phím, chevron và thùng rác dùng SVG nội tuyến có `aria-label` trên button | Icon trang trí, ký hiệu không có nhãn truy cập |
| Văn bản giao diện | Câu ngắn, động từ rõ: "Bước tiếp", "Đặt làm nguồn", "Hiện kết quả" | Câu quảng cáo, giọng "Khám phá sức mạnh của...", chữ hoa toàn bộ |
| Chuyển động | Kéo node/cạnh cập nhật liên tục; hoạt ảnh trạng thái khoảng 150ms, có ý nghĩa và tôn trọng `prefers-reduced-motion` | Hiệu ứng nảy, parallax, hiệu ứng khi tải trang, animation lặp vô hạn |

### 8.2 Bố cục

- **Canvas là trung tâm**: chiếm toàn bộ vùng làm việc, nền phẳng có lưới mờ. Mọi thanh điều khiển là thanh nổi đặt đè lên canvas, cách mép 16px, rộng vừa đủ nội dung, không chiếm hết chiều ngang.
- **Thanh công cụ nổi** ở gần mép trên: Chọn, Nối cạnh, Hoàn tác, Làm lại, Vô hướng/Có hướng, Nhập, Xuất, Toàn màn hình, Reset, Thêm ví dụ. Không có tên Dijkstra, Thêm node, Thêm cạnh hoặc Xóa.
- **Thanh chạy nổi** nằm ngay dưới thanh công cụ và chỉ hiện khi lựa chọn hợp lệ. Thứ tự: Đầu, Lùi, bộ đếm `4 / 12`, Tiếp, Cuối; vạch phân cách; Chạy/Dừng; select tốc độ chỉ hiện `0.5x/1x/1.5x/2x`; bật/tắt Kết quả. Không hiện chữ “Tốc độ” hoặc nhãn Hoàn tất/Đang chạy; thanh range nằm sát đáy và không bị cắt.
- **Thanh chọn Nguồn/Đích nổi** đặt ở đáy canvas, giữa; khoảng cách nhóm 12px, nhãn–select 8px, select tối thiểu 118px và cao 38px.
- **Cụm zoom/theme** ở góc dưới trái: thu nhỏ, phần trăm zoom, phóng to và nút Sáng/Tối. Theme được lưu trong `localStorage`.
- **Panel bên phải** đóng mặc định. Nút Hiện kết quả mở Kết quả cuối, toàn bộ Bảng và toàn bộ Diễn giải/Truy vết ngay ở mọi snapshot; snapshot `done` vẫn tự mở panel. Separator có nút đóng, mép phải canvas có nút mở. Panel mặc định khoảng 500px, tối thiểu 320px và bị chặn để canvas desktop còn khoảng 470px. Panel chỉ cuộn dọc; bảng rộng cuộn ngang trong `.table-scroll` riêng.
- **Control đáy canvas**: zoom/theme ở trái, Nguồn/Đích ở giữa, hướng dẫn phím tắt ở phải. Khi canvas hẹp, Nguồn/Đích chuyển lên hàng trên để không che hai cụm còn lại.
- **Responsive**: từ 768px trở lên giữ bố cục desktop; toolbar bị giới hạn trong canvas và tự cuộn ngang khi splitter làm canvas hẹp. Dưới 768px, toolbar và control bo 4px, hàng chính cao 44px: Chọn, Nối cạnh, Thêm ví dụ, icon Hoàn tác, icon Làm lại, ba chấm. Tầng dưới cuộn ngang chứa phần còn lại, không lặp Ví dụ và đẩy runbar xuống 8px. Runbar cao 48px, progress luôn nhìn thấy, không chứa nút Kết quả. Nguồn/Đích căn giữa, tối đa 360px thường/380px khi có nút xóa, nhãn nằm ở cột riêng. Kết quả và Hướng dẫn nằm cạnh nhau ở đáy; panel Kết quả mở chiếm trọn vùng còn lại. Kiểm tra thêm viewport ảnh tham chiếu 620×870 bên cạnh 360×740, 390×844, 430×932.
- Wireframe chi tiết ở mục 3 của tab "Giao việc cho agent".

### 8.3 Quy ước hiển thị node

| Trạng thái | Biểu diễn |
| --- | --- |
| Chưa xét (nhãn ∞ trong engine) | Viền xám nhạt; không vẽ ký hiệu ∞ trên node |
| Có nhãn tạm | Viền đứt, nhãn là số |
| Nhãn vĩnh viễn | Nền đặc, viền liền, nhãn khoảng cách có dấu \* |
| Đang xét (A) | Vòng sáng ngoài, nhấn mạnh |
| Nguồn / Đích | Chỉ đánh dấu nguồn bằng chữ s; không vẽ chữ t ở đích |
| Thuộc đường ngắn nhất | Nền đổi màu riêng, cạnh nối dày hơn |

### 8.4 Thân thiện với người dùng

- **Không có màn hình chào hoặc hộp nạp ví dụ.** Mở trang là canvas trống và popover Hướng dẫn phím tắt tự mở để giới thiệu cách tạo/chỉnh graph và thao tác mobile.
- **Hành động chính luôn ở một chỗ.** Nút "Bước tiếp" và "Chạy" không đổi vị trí giữa các trạng thái.
- **Luôn biết đang ở đâu.** Một dòng trạng thái cố định: "Bước 4/9 — đang xét node 4".
- **Sửa tại chỗ.** Nhấp node để chọn; nhấp đúp node để sửa nhãn; chọn cạnh để mở thanh giảm/sửa/tăng trọng số và xóa. Enter xác nhận, Esc hủy.
- **Không hộp thoại chặn.** Xóa node hoặc cạnh thực hiện ngay và cho hoàn tác (Ctrl+Z), thay vì hỏi "Bạn có chắc không?".
- **Phím tắt:** ←/→ lùi/tới, Home/End về đầu/cuối, `Backspace` xóa selection, Ctrl+Z / Ctrl+Shift+Z hoàn tác/làm lại. Space không còn là phím global; chỉ kích hoạt Chạy/Dừng theo hành vi native sau khi nút Play/Pause đã được focus/click.
- **Kéo thả:** chuột và cảm ứng dùng chung cơ chế của React Flow; node và cạnh đi theo con trỏ ngay trong lúc kéo ở mode Chọn. Mode Nối cạnh khóa kéo node và tạo cạnh bằng hai lần chọn node.
- **Hình học anchor:** handle kỹ thuật chỉ dùng để React Flow định vị, luôn ẩn và không nhận pointer. Cạnh đã tồn tại cắt trực tiếp tại viền tròn theo hướng hình học. Nhiều cạnh giữa cùng một cặp node được chia thành các làn song song liên tục trên viền, không dồn vào một chấm và không chồng nhãn trọng số.
- **Nhấp đúp:** nhấp đúp nền thêm node nhưng không làm zoom; nhấp đúp node không tạo node nền. Fit view tự động không vượt 125%.
- **Hướng dẫn:** popover mở mặc định ở lần tải trang; desktop hiển thị phím tắt chuột/bàn phím, mobile hiển thị riêng thao tác chạm, kéo và chụm. Header nằm ngoài body cuộn, có nền đặc để nội dung không ló lên phía trên; `?` mở/đóng, `Escape` đóng.
- **Rê chuột vào node** hiện tooltip nhỏ: nhãn hiện tại, node đứng trước trên đường ngắn nhất.
- **Trạng thái rỗng:** canvas trống hoàn toàn, không overlay. Toolbar vẫn cung cấp Thêm ví dụ.

### 8.5 Luồng sử dụng chính

1. Mở trang với canvas trống; tự vẽ graph hoặc bấm Thêm ví dụ để nạp VD1.
2. Chỉnh đồ thị; chọn nguồn và đích ở thanh nổi dưới canvas.
3. Thanh chạy hiện ra; dùng Tiếp/Lùi hoặc Chạy.
4. Quan sát màu node; bật bảng bước giải khi cần xem bảng nhãn và lời giải thích.
5. Xem kết quả và đường đi ở panel bên phải; xuất file nếu cần.

### 8.6 Thông báo lỗi

Thông báo ngắn, nêu nguyên nhân và cách sửa, hiển thị ngay cạnh phần tử gây lỗi (không dùng hộp thoại chặn màn hình).

### 8.7 Tiêu chí nghiệm thu giao diện

- [ ] Nút/ô nhập dùng bo 6px, thanh nổi dùng bo 10px; node là hình tròn.
- [ ] Không có thẻ lồng thẻ; mỗi vùng tách bằng khoảng trắng hoặc một đường kẻ 1px.
- [ ] Mọi khoảng cách là bội của 4px; nút và ô nhập desktop cùng cao 34px, vùng chạm mobile tối thiểu 44px.
- [ ] Ô bảng bước giải căn giữa, dùng font monospace, các cột thẳng hàng.
- [ ] Không có thư viện icon, gradient trang trí, glassmorphism, hiệu ứng phát sáng hay emoji; SVG nội tuyến chỉ dùng cho Play/Pause và bàn phím, button có tên truy cập.
- [ ] Bảng bước giải mặc định tắt, bật/tắt được; canvas luôn là vùng lớn nhất.
- [ ] Dùng được ở desktop 1280×800 và mobile 360×740, 390×844, 430×932; trang không cuộn ngang; nếu bảng rộng, chỉ `.table-scroll` cuộn ngang, panel không cuộn ngang.
- [ ] Người dùng mới vẽ xong một đồ thị và chạy hết thuật toán trong dưới 2 phút mà không cần đọc hướng dẫn (thử với ít nhất 3 người).
- [ ] Mọi control chính dùng được bằng bàn phím/focus và cảm ứng; Play/Pause không có Space global.
- [ ] Độ tương phản chữ đạt WCAG AA.
- [ ] Splitter thay đổi được độ rộng panel bằng kéo và bàn phím; canvas/panel co giãn bù nhau, bật bảng tự mở rộng panel khi đủ chỗ.
- [ ] Không có nút Xóa toàn cục; Shift-chọn nhiều + `Backspace` xóa một transaction. Cạnh có nút xóa ngữ cảnh và mobile có thùng rác cạnh Nguồn/Đích.
- [ ] Có theme sáng/tối trong cụm zoom, áp dụng đồng bộ và giữ lựa chọn sau reload.
- [ ] Node không hiện điểm nối ở bất kỳ mode nào; mode Nối cạnh tạo cạnh bằng hai click/chạm và nhấn mạnh node đầu.
- [ ] Cạnh cắt tại viền node; hai cạnh cùng cặp node dùng hai làn/endpoint và hai nhãn trọng số tách biệt.
- [ ] Panel đóng mặc định, tự mở ở bước done và đóng/mở được từ runbar/separator.
- [ ] Click node chỉ chọn; double-click node sửa tên; double-click nền thêm node mà không zoom.
- [ ] Mở trang và Reset đều cho canvas trống; Thêm ví dụ nạp VD1 và vừa khung; không có overlay nạp mẫu.
- [ ] Bấm Chạy ở snapshot cuối đưa về 0 và autoplay lại.
- [ ] Node chưa tới được không hiện ∞; đích không hiện t; nguồn vẫn hiện s.
- [ ] Cụm Nguồn/Đích desktop có select tối thiểu 118px × 38px; mobile dùng hai cột co giãn và mỗi select rộng ít nhất 120px tại viewport 390px.
- [ ] Bảng nằm trước Diễn giải chi tiết; không còn component/heading Giải thích bước cũ; toàn bộ bảng, truy vết và kết luận hiện ngay khi mở panel, không phụ thuộc step canvas.
- [ ] Popover phím tắt phản ánh đúng các phím đang hỗ trợ.
- [ ] SVG chevron và bàn phím dùng màu tương phản trong dark mode.
- [ ] Khu Kết quả/Phân tích chỉ có border ở surface ngoài; badge, card, wrapper và ô bảng không lạm dụng border.
- [ ] Kết quả, Bảng bước giải và Diễn giải chỉ hiển thị tên đỉnh đã nhập; không lộ ID nội bộ khi label khác ID.
- [ ] Bảng bước giải không chứa button, không có click handler và không làm thay đổi snapshot khi bấm vào hàng/ô.
- [ ] Toàn màn hình là toggle: bấm lần hai thoát; nút đổi nhãn theo trạng thái.
- [ ] Kết quả không có badge số thứ tự trước path và không lặp khối Truy vết.
- [ ] Ở 390×844, popover hướng dẫn không giao với toolbar, Nguồn/Đích, zoom/theme hoặc nút bàn phím; nền popover đặc và chữ không bị nhòe.
- [ ] Cụm Nguồn/Đích mobile dùng grid, mỗi select rộng ít nhất 120px; thùng rác nằm sát cột phải với khoảng đệm không quá 12px và không làm cắt nội dung select.
- [ ] Trên mobile, header hướng dẫn là vùng cố định riêng ngoài body cuộn; nội dung không được xuất hiện trong khoảng phía trên header khi kéo tới bất kỳ vị trí nào.
- [ ] Mobile chỉ hiển thị **Hướng dẫn thao tác trên điện thoại** với hành vi cảm ứng; không hiển thị danh sách phím tắt desktop trong body.
- [ ] Nút thùng rác mobile là vùng chạm 44×44px có viền 1px đủ bốn cạnh và bo góc control.
- [ ] Runbar không có chữ Tốc độ hoặc Hoàn tất/Đang chạy; select chỉ hiện hệ số `0.5x/1x/1.5x/2x` và thực sự đổi nhịp autoplay.
- [ ] Toolbar mobile có hàng chính 44px gồm Chọn, Nối cạnh, Thêm ví dụ, icon Hoàn tác, icon Làm lại, ba chấm đứng; tầng dưới xuất hiện bên trong cùng surface, cuộn ngang, không lặp Ví dụ và không chồng runbar.
- [ ] Mobile dùng bo 4px cho surface và control; cỡ chữ 11–13px, control runbar 28–52px để không chiếm gần hết chiều ngang.
- [ ] Mobile không có icon bàn phím hoặc note cố định; nút chữ **Hướng dẫn** ở góc phải dưới và không chồng nút Kết quả.
- [ ] Progress mobile nhìn thấy đầy đủ; khi mở Kết quả, panel phủ toàn vùng còn lại dưới toolbar/runbar và hiển thị đủ Result, Bảng, Diễn giải qua cuộn nội bộ.
- [ ] Mobile không có nút Kết quả trong runbar; nút Kết quả ở hàng đáy là điểm mở panel.
- [ ] Cụm Nguồn/Đích căn giữa, tối đa 360px thường và 380px khi có nút xóa; nhãn không bị cắt, vùng giá trị thường không rộng quá 150px.
- [ ] Đồ thị vô hướng vẽ đúng một đường, một nhãn trọng số và không có mũi tên cho mỗi cạnh.

### 8.8 Bảng bước giải

Mẫu tham chiếu là bảng "Bảng kê các bước lặp Dijkstra" trong tab Ghi chú. Bảng là phần phụ: mặc định tắt, canvas luôn là trung tâm.

- **Cột:** "Bước lặp", "Đỉnh cố định", rồi mỗi node một cột "Đỉnh {label}"; `{label}` là tên đỉnh người dùng đã nhập, không phải ID nội bộ.
- **Hàng:** "Khởi tạo", rồi "Bước 1", "Bước 2", ... mỗi hàng là một vòng lặp.
- **Nội dung ô:** ∞ khi chưa có nhãn; nhãn tạm viết kèm **tên** đỉnh đứng trước trong ngoặc, ví dụ "5 (B)", khi hòa viết "5 (B, D)"; "—" khi node đã chốt ở hàng trước; node vừa chốt ở hàng này viết "5\*" trên nền nhạt. Ô nguồn ở hàng Khởi tạo viết "0 ()".
- **Hiện dần theo bước:** hàng của một vòng xuất hiện ở bước chọn node (nhãn giữ như hàng trước, chỉ ô vừa chốt có dấu \*), rồi được điền ở bước cập nhật nhãn (ô đổi nhãn có nền nhạt). Vòng 1 là vòng của nguồn, không có bước chọn riêng nên hàng "Bước 1" hiện cùng bước cập nhật đầu tiên. Hàng của bước hiện tại tô nền nhạt nhưng toàn bảng là nội dung tĩnh, không có button/click để nhảy bước.
- **Bật/tắt:** nút chữ "Hiện kết quả" / "Ẩn kết quả" điều khiển toàn bộ panel Kết quả + Bảng + Diễn giải chi tiết. Mặc định đóng; khi thuật toán tới `done`, panel tự mở.
- **Chú thích:** một dòng nhỏ 12px phía trên bảng: "Dấu (\*) là nhãn vĩnh viễn", như mẫu.
- **Responsive:** bảng dùng `width: max-content`; overflow nằm ở toàn vùng nội dung kết quả. Khi kéo ngang, toàn bộ bảng—including cột Bước và Đỉnh cố định—di chuyển cùng nhau; chỉ header giữ sticky theo chiều dọc. Trang không bao giờ cuộn ngang.
- **Số liệu mong đợi** của ví dụ A nằm ở mục 2 tab "Giao việc cho agent".

## 9. Kiến trúc và công nghệ

| Thành phần | Đề xuất | Lý do |
| --- | --- | --- |
| Giao diện | React + TypeScript | Quen thuộc, dễ quản lý trạng thái |
| Vẽ đồ thị | React Flow | Có sẵn kéo thả, nối cạnh, zoom/pan nên ít phải viết code tương tác; node và cạnh được tùy biến để khớp mục 8.1 |
| Quản lý trạng thái | useReducer hoặc Zustand | Cần undo/redo và phiên chạy |
| Build | Vite | Nhanh, đơn giản |
| Style | Tailwind hoặc CSS module | Tùy sở thích |
| Test | Vitest (engine), Playwright (luồng chính) | Engine là logic thuần |
| Triển khai | Static hosting (Vercel, Netlify, GitHub Pages) | Không cần backend |

Cấu trúc thư mục gợi ý:

```
src/
  engine/        dijkstra.ts, validate.ts, trace.ts   (không phụ thuộc React)
  model/         types.ts, graphReducer.ts
  components/    Canvas, NodeView, EdgeView, Controls, LabelTable, DetailedExplanation, Result
  presets/       samples.ts
  i18n/          vi.ts
```

Nguyên tắc: tầng engine không biết gì về giao diện; giao diện chỉ đọc snapshot.

## 10. Kế hoạch kiểm thử

### 10.1 Kiểm thử engine

- Ví dụ 6 node (slide 58–62): kết quả mong đợi là khoảng cách 10, đường đi 1 → 4 → 5 → 6.
- Ví dụ 5 node (slide 65–68): đối chiếu vector nhãn L⁽ᵏ⁾ với slide.
- Đồ thị có hòa (hai đường cùng độ dài): trả về đủ mọi đường.
- Đồ thị không liên thông, đích không tới được.
- Nguồn trùng đích bị từ chối ở UI/validation/import; trọng số 0; đồ thị 1 node chạy ở chế độ tất cả node.
- Đồ thị có hướng với cạnh một chiều.
- Kiểm tra chéo: so với Bellman-Ford hoặc brute force trên các đồ thị ngẫu nhiên nhỏ (tối đa 8 node, trọng số không âm).
- Kiểm tra bất biến: nhãn vĩnh viễn không bao giờ giảm sau khi được chốt; thứ tự các nhãn được chốt không giảm.

### 10.2 Kiểm thử giao diện

- Thêm/xóa/kéo node, tạo/xóa cạnh, sửa trọng số, undo/redo.
- Bước tới rồi lùi trả về đúng trạng thái trước đó.
- Sửa đồ thị khi đang chạy thì reset.
- Xuất rồi nhập lại cho đồ thị y hệt.
- Chạy được trên màn hình cảm ứng.

## 11. Lộ trình đề xuất

| Giai đoạn | Nội dung | Kết quả |
| --- | --- | --- |
| 1 | Engine + test + hai ví dụ mẫu | Engine đúng, có test xanh |
| 2 | Canvas: vẽ, kéo thả, sửa cạnh, vô hướng/có hướng | Chỉnh sửa đồ thị được |
| 3 | Chạy từng bước: điều khiển, màu node, bảng nhãn, giải thích | Trực quan hóa hoàn chỉnh |
| 4 | Kết quả, truy vết, kiểm tra dữ liệu, xuất/nhập JSON | MVP hoàn thiện |
| 5 | Trau chuốt: cảm ứng, truy cập, tài liệu README | Bản phát hành đầu |
| 6 (v2) | Hiển thị mọi đường ngắn nhất, chia sẻ URL | Mở rộng |

Chưa ước lượng thời gian, vì phụ thuộc vào quỹ thời gian của bạn. Giai đoạn 1 và 2 độc lập nhau, có thể làm song song.

## 12. Rủi ro và lưu ý

- **Dữ liệu ví dụ trong PDF**: văn bản trích từ slide bị lẫn ký tự, trọng số một số cạnh không chắc chắn. Đã đối chiếu với ảnh slide 58 và 65; số liệu chuẩn nằm ở mục 1 của tab "Giao việc cho agent".
- **Kéo thả trên cảm ứng** thường phát sinh lỗi (xung đột cuộn trang); cần thử sớm.
- **Hòa khi chọn node** làm lời giải khác nhau giữa các cách chọn, dù kết quả cuối giống nhau. Cần giải thích rõ để người học không nhầm là lỗi.
- **Phạm vi phình to**: giữ trọng tâm vào trực quan hóa thuật toán; chức năng nào ngoài mục 2.1 đều để sau.

* **Tùy biến React Flow**: mặc định node là hình hộp kiểu sơ đồ luồng; cần tùy biến node tròn, cạnh có trọng số và mũi tên khi có hướng để khớp mục 8.1. Nên dựng thử node và cạnh tùy biến ngay ở giai đoạn 2.

## 13. Các quyết định đã chốt

1. **Phạm vi MVP**: theo mục 2.1 (đã gồm bảng bước giải bật/tắt được).
2. **Công nghệ**: React với React Flow để vẽ và tương tác đồ thị, tùy biến node tròn và cạnh có trọng số.
3. **Ngôn ngữ giao diện**: tiếng Việt.
4. **Khi hòa**: tự động chọn node có ID nhỏ nhất, hiển thị rõ "hòa giữa X và Y".
5. **Lưu trữ**: chỉ xuất/nhập file JSON, không tự lưu trong trình duyệt.
6. **Đối tượng**: giảng dạy trên lớp và học viên tự học.
7. **Giao diện**: không dùng thư viện icon; Play/Pause và bàn phím dùng SVG nội tuyến, các nút có nhãn truy cập; trông như do người thiết kế có chủ đích (mục 8.1).
8. **Bố cục**: canvas là trung tâm với các thanh điều khiển dạng nổi; panel Kết quả + Bảng đóng mặc định, tự mở khi hoàn tất và đóng/mở được từ runbar/separator.
9. **Responsive**: hai cột từ 768px, một cột dưới 768px; kiểm tra ở 1280, 820 và 390px.
10. **Góp ý giao diện vòng 2**: runbar dạng transport, panel có splitter và nguồn/đích bắt buộc khác nhau.
11. **Góp ý giao diện vòng 3**: light/dark trong cụm zoom; thời điểm đó dùng VD1 mặc định; không màn hình chào; toolbar bỏ tên Dijkstra và các nút Thêm/Xóa; kéo bốn điểm nối để tạo cạnh; `Backspace` xóa; kéo node trực tiếp; cạnh thẳng. Cơ chế click sửa tên được thay bằng vòng 4; nút Ví dụ được khôi phục ở vòng 5; VD1 mặc định bị thay bởi canvas trống ở vòng 6.
12. **Góp ý giao diện vòng 4**: click node chỉ chọn, double-click sửa tên; double-click nền không zoom; phân tán handle cạnh; panel đóng mặc định/tự mở khi done; Reset; nút đóng/mở separator; control đáy không chồng; panel kết quả nổi bật; Play/Pause SVG; popover phím tắt.
13. **Góp ý giao diện vòng 5**: tối ưu toàn nhóm handle để tránh cạnh cắt chéo; chevron/bàn phím tương phản ở dark mode; Reset tạo canvas trống; Ví dụ nạp VD1; chỉ giữ border ở surface ngoài của khu kết quả.
14. **Góp ý giao diện vòng 6**: khởi động canvas trống, Thêm ví dụ mới nạp VD1, không empty overlay; replay từ đầu khi bấm Chạy ở bước cuối; ẩn ∞ và t; làm thoáng Nguồn/Đích; thay Giải thích bước bằng diễn giải đầy đủ dưới bảng và truy vết khi done.
15. **Góp ý giao diện vòng 7**: toàn bộ panel dùng tên đỉnh (`label`) do người dùng nhập thay cho ID nội bộ; Bảng bước giải chuyển thành nội dung chỉ đọc và không còn thao tác nhảy bước bằng click.
16. **Góp ý giao diện vòng 8**: handle chỉ hiện khi chọn/đang nối; chọn cạnh mở thanh −/trọng số/+/xóa; bảng bỏ sticky ngang hai cột đầu; fullscreen toggle; hướng dẫn mở mặc định và có mobile; Shift multi-delete; đổi Hiện/Ẩn kết quả; Result bỏ badge path và truy vết; cạnh dùng anchor liên tục trên viền và chia làn theo cặp node; mobile có nút xóa; Space không còn global.
17. **Góp ý giao diện vòng 9**: mobile tách popover hướng dẫn vào safe area có top/bottom cố định và scroll nội bộ; Nguồn/Đích chuyển từ flex select 88px sang grid hai cột co giãn (thực tế khoảng 140px ở viewport 390) cùng cột xóa 44px, loại bỏ chồng lấn, cắt chữ và khoảng trống thừa bên phải.
18. **Góp ý giao diện vòng 10**: tách header hướng dẫn khỏi body cuộn để che kín mép trên; mobile dùng bộ hướng dẫn cảm ứng riêng thay cho phím tắt desktop; nút thùng rác 44×44px có viền 1px đủ bốn cạnh.
19. **Góp ý giao diện vòng 11**: panel luôn hiển thị lời giải cuối đầy đủ ngay khi mở và bảng cuộn ngang nội bộ; tạo cạnh chuyển sang mode Nối cạnh với hai lần chọn node, mọi handle bị ẩn; runbar bỏ Tốc độ/trạng thái. Mô tả toolbar hai tầng/note của vòng này đã được vòng 12 thay thế.
20. **Góp ý giao diện vòng 12**: desktop toolbar cuộn nội bộ khi canvas bị thu hẹp; mobile chuẩn hóa thanh 44px/control 36px/bo 4px, toolbar một hàng có nút Khác, bỏ icon và note hướng dẫn, selector một hàng, ẩn zoom khi chạy, dùng drawer Kết quả 44px và kiểm thử tại 360×740, 390×844, 430×932.
21. **Góp ý giao diện vòng 13**: khôi phục toolbar mobile hai tầng bằng nút ba chấm đứng, chia đều hàng chính và thu nhỏ control; thêm select tốc độ chỉ hiện hệ số; giữ progress lộ hoàn toàn; đưa nút chữ Hướng dẫn xuống góc phải và mở panel Kết quả toàn vùng khả dụng. Vòng này thay thế các chi tiết mobile một hàng/Khác/radius 4px của vòng 12.
22. **Góp ý giao diện vòng 14**: bỏ Kết quả khỏi runbar mobile, giữ nút Kết quả ở đáy; giới hạn cụm Nguồn/Đích ở 360/380px và tách cột nhãn–giá trị để không mất chữ tại viewport ảnh 620×870 lẫn mobile nhỏ.
23. **Góp ý giao diện vòng 15**: chuyển Thêm ví dụ lên hàng toolbar mobile chính; thay chữ Hoàn tác/Làm lại bằng SVG inline, giữ nhãn truy cập và không thêm thư viện icon; tầng dưới không lặp Ví dụ.
