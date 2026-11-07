# Giao việc cho agent code

Tab này gom những thứ agent cần để bắt tay làm mà không phải đoán: dữ liệu ví dụ chuẩn, định nghĩa một bước, design tokens, nội dung AGENTS.md và danh sách tác vụ có điều kiện nghiệm thu. Đọc cùng tab đặc tả chính; khi hai tab mâu thuẫn, tab này thắng.

## 1. Dữ liệu ví dụ chuẩn

Ví dụ A và B lấy từ slide 58–62 và 65–68; trọng số đã đối chiếu với ảnh slide và tính lại bằng tay. Ví dụ C và D là dữ liệu tự đặt (không có trong slide) để kiểm tra trường hợp hòa và các trường hợp biên. Agent không được sửa số liệu ở mục này. Quy ước: dấu `*` là nhãn vĩnh viễn; trong JSON, ∞ lưu là `null`; bước đánh số từ 0 theo định nghĩa ở mục 2.

### Ví dụ A: mạng vô hướng 6 node (slide 58–62)

```json
{
  "version": 1, "directed": false, "source": "1", "target": "6",
  "nodes": [
    {"id":"1","label":"1","x":60,"y":218}, {"id":"2","label":"2","x":290,"y":60},
    {"id":"3","label":"3","x":290,"y":218}, {"id":"4","label":"4","x":290,"y":352},
    {"id":"5","label":"5","x":532,"y":352}, {"id":"6","label":"6","x":532,"y":80}
  ],
  "edges": [
    {"from":"1","to":"2","weight":3}, {"from":"1","to":"3","weight":7},
    {"from":"1","to":"4","weight":4}, {"from":"2","to":"3","weight":2},
    {"from":"2","to":"6","weight":9}, {"from":"3","to":"4","weight":1},
    {"from":"3","to":"5","weight":3}, {"from":"3","to":"6","weight":6},
    {"from":"4","to":"5","weight":3}, {"from":"5","to":"6","weight":3}
  ],
  "expected": {"distance": 10, "paths": [["1","4","5","6"]], "snapshotCount": 12}
}
```

Nhãn sau mỗi bước (thứ tự cột là node 1 đến 6):

| Bước | Loại | Node A | Nhãn sau bước |
| --- | --- | --- | --- |
| 0 | init | 1 | \[0\*, ∞, ∞, ∞, ∞, ∞\] |
| 1 | relax | 1 | \[0\*, 3, 7, 4, ∞, ∞\] |
| 2 | select | 2 | \[0\*, 3\*, 7, 4, ∞, ∞\] |
| 3 | relax | 2 | \[0\*, 3\*, 5, 4, ∞, 12\] |
| 4 | select | 4 | \[0\*, 3\*, 5, 4\*, ∞, 12\] |
| 5 | relax | 4 | \[0\*, 3\*, 5, 4\*, 7, 12\] |
| 6 | select | 3 | \[0\*, 3\*, 5\*, 4\*, 7, 12\] |
| 7 | relax | 3 | \[0\*, 3\*, 5\*, 4\*, 7, 11\] |
| 8 | select | 5 | \[0\*, 3\*, 5\*, 4\*, 7\*, 11\] |
| 9 | relax | 5 | \[0\*, 3\*, 5\*, 4\*, 7\*, 10\] |
| 10 | select | 6 | \[0\*, 3\*, 5\*, 4\*, 7\*, 10\*\] |
| 11 | done | — | giữ nguyên |

Khi chạy hết node, khoảng cách là \[0, 3, 5, 4, 7, 10\]. Node 3 có hai node đứng trước hợp lệ (2 và 4, cùng nhãn 5), dùng để kiểm tra `predecessors`; đường ngắn nhất tới node 6 vẫn duy nhất. Truy vết: từ 6 chọn node 5 vì 7 + 3 = 10; từ 5 chọn node 4 vì 4 + 3 = 7; từ 4 chọn node 1 vì 0 + 4 = 4.

### Ví dụ B: mạng có hướng 5 node (slide 65–68)

Id node bắt đầu từ 0 như slide; engine không được giả định id bắt đầu từ 1.

```json
{
  "version": 1, "directed": true, "source": "0", "target": "4",
  "nodes": [
    {"id":"0","label":"0","x":60,"y":200}, {"id":"1","label":"1","x":230,"y":200},
    {"id":"2","label":"2","x":400,"y":200}, {"id":"3","label":"3","x":570,"y":200},
    {"id":"4","label":"4","x":740,"y":200}
  ],
  "edges": [
    {"from":"0","to":"1","weight":3}, {"from":"0","to":"2","weight":4},
    {"from":"0","to":"3","weight":8}, {"from":"0","to":"4","weight":10},
    {"from":"1","to":"2","weight":3}, {"from":"1","to":"3","weight":4},
    {"from":"1","to":"4","weight":8}, {"from":"2","to":"3","weight":2},
    {"from":"2","to":"4","weight":4}, {"from":"3","to":"4","weight":3}
  ],
  "expected": {"distance": 8, "paths": [["0","2","4"]], "snapshotCount": 10}
}
```

Nhãn sau mỗi bước (thứ tự cột là node 0 đến 4):

| Bước | Loại | Node A | Nhãn sau bước |
| --- | --- | --- | --- |
| 0 | init | 0 | \[0\*, ∞, ∞, ∞, ∞\] |
| 1 | relax | 0 | \[0\*, 3, 4, 8, 10\] |
| 2 | select | 1 | \[0\*, 3\*, 4, 8, 10\] |
| 3 | relax | 1 | \[0\*, 3\*, 4, 7, 10\] |
| 4 | select | 2 | \[0\*, 3\*, 4\*, 7, 10\] |
| 5 | relax | 2 | \[0\*, 3\*, 4\*, 6, 8\] |
| 6 | select | 3 | \[0\*, 3\*, 4\*, 6\*, 8\] |
| 7 | relax | 3 | \[0\*, 3\*, 4\*, 6\*, 8\] |
| 8 | select | 4 | \[0\*, 3\*, 4\*, 6\*, 8\*\] |
| 9 | done | — | giữ nguyên |

Bước 7 không đổi nhãn vì 6 + 3 = 9 lớn hơn 8. Khi chạy hết node, khoảng cách là \[0, 3, 4, 6, 8\]. Truy vết: từ 4 chọn node 2 vì 4 + 4 = 8; từ 2 chọn node 0 vì 0 + 4 = 4.

### Ví dụ C (tự đặt): hòa khi chọn node và hai đường ngắn nhất

```json
{
  "version": 1, "directed": false, "source": "1", "target": "4",
  "nodes": [
    {"id":"1","label":"1","x":60,"y":150}, {"id":"2","label":"2","x":240,"y":60},
    {"id":"3","label":"3","x":240,"y":240}, {"id":"4","label":"4","x":420,"y":150}
  ],
  "edges": [
    {"from":"1","to":"2","weight":2}, {"from":"1","to":"3","weight":2},
    {"from":"2","to":"4","weight":2}, {"from":"3","to":"4","weight":2}
  ],
  "expected": {"distance": 4, "paths": [["1","2","4"],["1","3","4"]], "snapshotCount": 8}
}
```

| Bước | Loại | Node A | Nhãn sau bước | Ghi chú |
| --- | --- | --- | --- | --- |
| 0 | init | 1 | \[0\*, ∞, ∞, ∞\] |  |
| 1 | relax | 1 | \[0\*, 2, 2, ∞\] |  |
| 2 | select | 2 | \[0\*, 2\*, 2, ∞\] | Hòa giữa 2 và 3, chọn 2 (ID nhỏ nhất); `tieBetween` = \["2","3"\] |
| 3 | relax | 2 | \[0\*, 2\*, 2, 4\] |  |
| 4 | select | 3 | \[0\*, 2\*, 2\*, 4\] |  |
| 5 | relax | 3 | \[0\*, 2\*, 2\*, 4\] | 2 + 2 = 4 bằng nhãn cũ: nhãn không đổi nhưng thêm 3 vào `predecessors` của 4 |
| 6 | select | 4 | \[0\*, 2\*, 2\*, 4\*\] |  |
| 7 | done | — | giữ nguyên |  |

### Ví dụ D (tự đặt): các trường hợp biên

| Tên | Đồ thị | Kết quả mong đợi |
| --- | --- | --- |
| Không tới được | Vô hướng, 3 node, chỉ có cạnh 1–2 trọng số 5; nguồn 1, đích 3 | `distance` = null, `paths` = \[\], bước `done` báo không có đường đi, nhãn node 3 vẫn ∞ |
| Nguồn trùng đích | Bất kỳ; nguồn = đích = 1 | `validate` trả lỗi `same-endpoints`; UI không cho chọn, import JSON từ chối, engine không chạy |
| Trọng số 0 | Vô hướng; 1–2: 0, 2–3: 4; nguồn 1, đích 3 | `distance` = 4, đường \["1","2","3"\] |
| Cạnh một chiều | Có hướng; chỉ có 1→2 trọng số 1 | Nguồn 1, đích 2: `distance` = 1. Nguồn 2, đích 1: không tới được |
| Trọng số âm | Cạnh 1–2 trọng số −1 | `validate` trả lỗi, engine không chạy |
| Đồ thị 1 node | 1 node, không cạnh; nguồn 1, `target = null` | 3 snapshot (`init`, `relax`, `done`), chế độ tính tới tất cả node; không cho chọn node 1 làm đích |

## 2. Định nghĩa một bước

Mỗi lần bấm "Bước tiếp" chuyển sang đúng một snapshot kế tiếp. Engine sinh toàn bộ snapshot một lần; giao diện chỉ hiển thị snapshot thứ k. Hàm vào: `runDijkstra(graph, source, target)`, với `target = null` nghĩa là chạy hết node.

### Thứ tự snapshot

1. `init`: nguồn nhận nhãn vĩnh viễn 0, mọi node khác có nhãn tạm ∞.
2. `relax` cho nguồn: gán nhãn tạm cho các node kề của nguồn (tương ứng bước 1 ở slide 55).
3. Mỗi vòng sau đó gồm hai snapshot: `select` (chọn node có nhãn tạm nhỏ nhất, chốt vĩnh viễn) rồi `relax` (cập nhật nhãn tạm của các node kề chưa chốt).
4. Khi `select` chốt node đích thì dừng ngay, không `relax` thêm; snapshot kế tiếp là `done`. Ở chế độ chạy hết node, vẫn `relax` sau mỗi `select` và dừng khi không còn nhãn tạm hữu hạn (ví dụ A có 13 snapshot, ví dụ B có 11).

### Quy tắc `relax`

- Chỉ xét cạnh đi ra từ node A tới node chưa chốt. Đồ thị vô hướng coi mỗi cạnh là hai chiều.
- Với mỗi node j: `candidate` = nhãn của A + trọng số cạnh; nhãn mới = min(nhãn cũ, `candidate`), đúng công thức ở slide 56.
- `updated` = true chỉ khi nhãn giảm hẳn; khi đó `predecessors[j]` = \[A\].
- Nếu `candidate` bằng nhãn cũ (hữu hạn): nhãn giữ nguyên, `updated` = false, nhưng thêm A vào `predecessors[j]`.
- Snapshot `relax` vẫn được tạo khi không có node nào cần cập nhật.

### Quy tắc `select`

- Chọn node có nhãn tạm hữu hạn nhỏ nhất.
- Hòa thì tự động chọn node có ID nhỏ nhất (so số nếu cả hai id là số nguyên, ngược lại so chuỗi) và ghi các node hòa vào `tieBetween`.
- Không còn nhãn tạm hữu hạn thì chuyển sang `done`.

### Truy vết

Theo slide 63: từ đích n, node j đứng trước nếu nhãn vĩnh viễn của j cộng d\_jn bằng nhãn vĩnh viễn của n. Bổ sung vào `DijkstraResult` ở mục 6.2 của tab đặc tả:

```ts
interface TraceStep {
  node: NodeId;        // node đang truy vết
  via: NodeId[];       // các node đứng trước thỏa điều kiện (nhiều phần tử nếu hòa)
  equations: string[]; // một phép tính cho mỗi phần tử của via, ví dụ "7 + 3 = 10"
}
// DijkstraResult thêm trường: trace: TraceStep[]  (đi ngược từ đích về nguồn)
```

### Mẫu câu giải thích

Chuỗi nằm trong `src/i18n/vi.ts`; chỗ `{...}` là giá trị điền vào.

| Tình huống | Mẫu câu |
| --- | --- |
| `init` | Gán nhãn vĩnh viễn 0 cho node {s}. Các node còn lại có nhãn tạm ∞. |
| `relax`, tiêu đề | Xét các node kề của {A} (nhãn vĩnh viễn {dA}). |
| `relax`, nhãn giảm | Node {j}: min({cũ}, {dA} + {w}) = {mới}. Cập nhật. |
| `relax`, nhãn không giảm | Node {j}: min({cũ}, {dA} + {w}) = {mới}. Giữ nguyên. |
| `relax`, bằng nhãn cũ | Node {j}: min({cũ}, {dA} + {w}) = {mới}. Giữ nguyên nhãn, ghi nhận thêm một đường ngắn nhất qua {A}. |
| `relax`, không có node kề | {A} không có node kề nào còn nhãn tạm. |
| `select` | Trong các nhãn tạm, node {j} nhỏ nhất ({d}), nên được chốt vĩnh viễn. |
| `select`, hòa | Node {a} và {b} cùng có nhãn nhỏ nhất ({d}). Chọn node {a} vì ID nhỏ hơn. |
| `done`, một đường | Đã chốt node đích {t}. Khoảng cách ngắn nhất từ {s} đến {t} là {d}. Đường đi: {s} → ... → {t}. |
| `done`, nhiều đường | Có {k} đường đi ngắn nhất, cùng dài {d}: {danh sách đường}. |
| `done`, không tới được | Các nhãn tạm còn lại đều là ∞, nên không có đường đi từ {s} đến {t}. |
| `done`, chạy hết node | Đã chốt mọi node tới được từ {s}. Khoảng cách: {danh sách}. |
| Truy vết | Từ {n} chọn node {j} vì {dj} + {w} = {dn}. |

### Bảng bước giải: nội dung mong đợi

Bảng của ví dụ A theo mẫu ở mục 8.8 tab đặc tả (cột là node 1 đến 6). Hàng "Khởi tạo" ứng với snapshot `init`; hàng "Bước k" ứng với snapshot `relax` của vòng k, và xuất hiện sớm hơn một snapshot (ở `select`) với nhãn như hàng trước, chỉ ô vừa chốt có dấu \*. Riêng "Bước 1" là vòng của nguồn, không có `select` riêng nên hiện cùng snapshot 1.

| Bước lặp | Đỉnh cố định | Đỉnh 1 | Đỉnh 2 | Đỉnh 3 | Đỉnh 4 | Đỉnh 5 | Đỉnh 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Khởi tạo | — | 0 () | ∞ | ∞ | ∞ | ∞ | ∞ |
| Bước 1 | 1 (d=0)\* | 0\* | 3 (1) | 7 (1) | 4 (1) | ∞ | ∞ |
| Bước 2 | 2 (d=3)\* | — | 3\* | 5 (2) | 4 (1) | ∞ | 12 (2) |
| Bước 3 | 4 (d=4)\* | — | — | 5 (2, 4) | 4\* | 7 (4) | 12 (2) |
| Bước 4 | 3 (d=5)\* | — | — | 5\* | — | 7 (4) | 11 (3) |
| Bước 5 | 5 (d=7)\* | — | — | — | — | 7\* | 10 (5) |
| Bước 6 | 6 (d=10)\* | — | — | — | — | — | 10\* |

Ví dụ: ở snapshot 4 (`select` node 4), hàng "Bước 3" hiện ra với đỉnh cố định "4 (d=4)\*", ô node 4 là "4\*", các ô khác như hàng "Bước 2"; sang snapshot 5 (`relax`), ô node 3 thành "5 (2, 4)" và ô node 5 thành "7 (4)" (hai ô này có nền nhạt vì vừa đổi).

## 3. Design tokens và wireframe

Mọi màu, cỡ chữ và khoảng cách lấy từ file `src/styles/tokens.css` dưới đây; agent không thêm giá trị mới ngoài file này. Giá trị cụ thể là đề xuất để bạn duyệt (xem mục 6).

### tokens.css

```css
:root {
  --bg: #f7f8fa; --bg-canvas: #fbfcfe; --bg-subtle: #f0f3f6; --surface: #ffffff;
  --surface-floating: #20242b; --surface-floating-hover: #2b3039;
  --border: #d8dee6; --border-strong: #aeb8c5;
  --text: #1d2633; --text-muted: #667384; --text-on-dark: #f4f7fa; --text-on-dark-muted: #aeb7c3;
  --accent: #1769d2; --accent-warm: #ff8956; --warn: #b66a00; --ok: #16803c; --error: #c7353f;
  --node-unvisited-fill: #ffffff; --node-unvisited-stroke: #b9c2cf; --node-unvisited-text: #586679;
  --node-temp-fill: #ffffff; --node-temp-stroke: #1769d2; --node-temp-text: #1d2633;
  --node-perm-fill: #1769d2; --node-perm-stroke: #1769d2; --node-perm-text: #ffffff;
  --node-current-ring: #d97706;
  --node-path-fill: #16803c; --node-path-stroke: #16803c; --node-path-text: #ffffff;
  --cell-fixed-bg: #dff1ff; --cell-changed-bg: #fff2bd;
  --edge: #7f8a99; --edge-active: #d97706; --edge-path: #16803c;
  --font-sans: system-ui, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --fs-sm: 12px; --fs-md: 14px; --fs-lg: 16px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --radius-control: 6px; --radius-floating: 10px;
  --control-h: 34px; --toolbar-h: 48px; --runbar-h: 72px; --panel-w: 500px;
  --float-offset: 16px; --node-size: 44px;
  --shadow-popover: 0 8px 24px rgba(20, 27, 38, 0.2), 0 2px 6px rgba(20, 27, 38, 0.14);
}
```

### Cách dùng trên canvas

| Thành phần | Quy tắc |
| --- | --- |
| Tên node | Ở giữa hình tròn, 16px, font sans |
| Nhãn khoảng cách | Phía trên node, 14px, font mono; ∞ khi chưa có nhãn |
| Trọng số cạnh | Giữa cạnh, 14px, font mono, nền trắng đệm 2px để che nét cạnh |
| Chưa xét | Viền xám liền, chữ xám |
| Nhãn tạm | Viền xanh nét đứt, nền trắng |
| Nhãn vĩnh viễn | Nền xanh đặc, chữ trắng, nhãn khoảng cách có dấu \* |
| Đang xét (node A) | Thêm vòng ngoài màu `--warn` |
| Thuộc đường ngắn nhất | Nền xanh lá, cạnh nối dày 3px |
| Cạnh đang cập nhật | Nét 2.5px màu `--warn` |

Trạng thái luôn có thêm dấu hiệu ngoài màu (nét đứt, dấu \*, vòng ngoài, độ dày nét). Các cặp màu chữ/nền phải đạt WCAG AA. Không dùng thư viện icon; điều hướng dùng ký hiệu văn bản, còn Play/Pause và bàn phím dùng SVG nội tuyến. Mỗi button phải có `aria-label`/tooltip tiếng Việt. Ô bảng bước giải dùng `--cell-fixed-bg` cho ô vừa chốt và `--cell-changed-bg` cho ô vừa đổi nhãn.

### Wireframe (từ 768px trở lên): trạng thái mặc định

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                │
│          ╔══════════════════════════════════════════════════════════════════════════╗          │
│          ║ Chọn | [Vô hướng] | Hoàn tác  Làm lại | Nhập  Xuất  Toàn màn hình        ║          │
│          ╚══════════════════════════════════════════════════════════════════════════╝          │
│                                                                                                │
│                                                                                                │
│                                      CANVAS (React Flow)                                       │
│                                     toàn bộ vùng làm việc                                      │
│                                                                                                │
│                                                                                                │
│                                                                                                │
│                                 ╔════════════════════════════╗                                 │
│                                 ║ Nguồn [   ]    Đích [   ]  ║                                 │
│                                 ╚════════════════════════════╝                                 │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Khung đôi (╔═╗) là thanh nổi: nằm đè lên canvas, cách mép 16px, rộng vừa đủ nội dung, có viền 1px và bóng nhẹ. Toolbar không có tên Dijkstra hay nút Thêm node/Thêm cạnh/Xóa; có Reset tạo canvas trống và Thêm ví dụ nạp VD1. Ứng dụng mở bằng canvas trống, không overlay.

### Wireframe (từ 768px trở lên): đang chạy, bảng bước giải bật

```text
┌──────────────────────────────────────────────────────────────────────┬────────────────────────────────────────┐
│                                                                      │ Kết quả                                │
│    ╔════════════════════════════════════════════════════════════╗    │ Khoảng cách: 10                        │
│    ║ Chọn | [Vô hướng] | Hoàn tác Làm lại | Nhập Xuất ...       ║    │ Đường đi: 1 → 4 → 5 → 6                │
│    ╚════════════════════════════════════════════════════════════╝    │ Truy vết: 6 ← 5 ← 4 ← 1                │
│    ╔════════════════════════════════════════════════════════════╗    │ ────────────────────────────────────── │
│    ║ |‹  ‹  4/12  ›  ›|  |  ▶  [1x]  Bước 4  | Ẩn kết quả       ║    │ Bảng + Diễn giải chi tiết              │
│    ╚════════════════════════════════════════════════════════════╝    │ Node 4 có nhãn tạm nhỏ nhất (4),       │
│                                                                      │ nên được chốt vĩnh viễn.               │
│                         CANVAS (React Flow)                          │ ────────────────────────────────────── │
│                        node đổi màu theo bước                        │ Bảng bước giải  (dấu (*) là nhãn       │
│                                                                      │ vĩnh viễn)                             │
│                                                                      │ Bước | Đỉnh cố định | Đỉnh 1 | ...     │
│                                                                      │ Khởi tạo | — | 0 () | ∞ | ...          │
│                                                                      │ Bước 1 | 1 (d=0)* | 0* | 3 (1) | ...   │
│                                                                      │ Bước 2 | 2 (d=3)* | — | 3* | ...       │
│                    ╔════════════════════════════╗                    │ ...                                    │
│                    ║ Nguồn [ 1 ]    Đích [ 6 ]  ║                    │                                        │
│                    ╚════════════════════════════╝                    │                                        │
│                                                                      │                                        │
└──────────────────────────────────────────────────────────────────────┴────────────────────────────────────────┘
```

Khi đã chọn nguồn và một đích khác nguồn (hoặc "Tất cả node"): thanh chạy hiện nhưng panel đóng mặc định. "Hiện kết quả" mở toàn bộ Kết quả, Diễn giải và Bảng; snapshot `done` tự mở panel. Separator có nút đóng, mép canvas có nút mở. Panel khoảng 500px, tối thiểu 320px nhưng phải chừa canvas khoảng 470px. Bảng không có scrollbar riêng: toàn vùng nội dung panel chịu trách nhiệm overflow; cuộn ngang kéo toàn bảng, chỉ header sticky theo chiều dọc.

### Wireframe (dưới 768px)

```text
┌──────────────────────────────────────┐
│ ╔══════════════════════════════════╗ │
│ ║ Chọn  Vô hướng  Hoàn tác ...     ║ │
│ ╚══════════════════════════════════╝ │
│ ╔══════════════════════════════════╗ │
│ ║ |‹  ‹  4/12  ›  ›|  ▶  1x       ║ │
│ ╚══════════════════════════════════╝ │
│                                      │
│         CANVAS (React Flow)          │
│                                      │
│    ╔════════════════════════════╗    │
│    ║ Nguồn [ 1 ]    Đích [ 6 ]  ║    │
│    ╚════════════════════════════╝    │
├──────────────────────────────────────┤
│ Kết quả (ngăn kéo, chạm để mở)       │
└──────────────────────────────────────┘
```

Dưới 768px: thanh công cụ và thanh chạy được giới hạn trong canvas; thanh chọn Nguồn/Đích nổi ở đáy canvas. Panel bên phải thành ngăn kéo từ đáy màn hình. Bảng và Diễn giải chi tiết nằm trong ngăn kéo; overflow thuộc nội dung ngăn kéo, không ở mức trang.

## 4. Nội dung AGENTS.md

Tác vụ T0 tạo file này ở gốc repo. Mọi agent đọc nó trước khi làm; nó ngắn có chủ đích để agent không bỏ sót luật.

```markdown
# AGENTS.md

## Dự án
Dijkstra Visualizer: web app tĩnh, giao diện tiếng Việt, trực quan hóa thuật toán Dijkstra
theo từng bước, dùng để giảng dạy và tự học.
Đặc tả đầy đủ: `Góp ý.md`, `Giao việc cho agent.md` và `Đặc tả.md`.
Thứ tự ưu tiên: `Góp ý.md` > `Giao việc cho agent.md` > `Đặc tả.md`.

## Công nghệ
React, TypeScript, Vite, React Flow, Vitest, Playwright. Không backend.
Không thêm thư viện khác khi chưa hỏi. Node: bản LTS hiện hành, ghi vào .nvmrc ở tác vụ T0.

## Lệnh
- npm install
- npm run dev    (chạy thử)
- npm run test   (unit test, Vitest)
- npm run e2e    (luồng chính, Playwright)
- npm run lint
- npm run build

## Cấu trúc
src/engine      thuật toán, kiểm tra dữ liệu, truy vết (không phụ thuộc React)
src/model       types.ts, graphReducer.ts
src/components  Canvas, NodeView, EdgeView, Controls, LabelTable, DetailedExplanation, Result
src/presets     samples.ts (ví dụ A, B, C, D)
src/i18n        vi.ts
src/styles      tokens.css

## Quy tắc bắt buộc
1. src/engine không import React hay thư viện giao diện; chỉ hàm thuần, không tác dụng phụ.
2. Kiểu dữ liệu dùng chung nằm ở src/model/types.ts. Chỉ tác vụ T1 được sửa file này;
   tác vụ khác cần đổi thì ghi đề xuất ở cuối PR.
3. Chuỗi tiếng Việt hiển thị cho người dùng nằm trong src/i18n/vi.ts, không viết cứng
   trong component.
4. Màu, cỡ chữ, khoảng cách chỉ lấy từ src/styles/tokens.css; không dùng giá trị rời.
5. Giao diện theo mục 8.1 của đặc tả: bo 6px cho control, 10px cho thanh nổi; không gradient,
   glassmorphism hay emoji. Không dùng thư viện icon; Play/Pause và bàn phím được dùng SVG nội tuyến có nhãn truy cập.
6. Dữ liệu trong src/presets/samples.ts phải khớp mục 1 của tab "Giao việc cho agent";
   không sửa số liệu.
7. Không giả định id node bắt đầu từ 1 (ví dụ B bắt đầu từ 0).
8. Mỗi tác vụ một nhánh, một PR nhỏ; chỉ sửa các file được liệt kê cho tác vụ đó.
9. Toolbar không có tên Dijkstra hay nút Thêm node/Thêm cạnh/Xóa. Mở app là canvas trống; có Reset và Thêm ví dụ.
10. Chọn: nhấp đúp canvas thêm node, click/Shift+click để chọn, double-click node sửa tên; Backspace xóa toàn selection. Nối cạnh: click/chạm hai node; handle luôn ẩn.
11. Light/dark nằm trong cụm zoom; kéo node cập nhật trực tiếp; bảng có scrollbar ngang riêng, panel chỉ cuộn dọc.

## Trước khi báo xong
- lint, test, build đều thành công.
- Điều kiện nghiệm thu của tác vụ được đáp ứng.
- Cuối PR ghi ba mục: Đã làm / Chưa làm / Cần hỏi.
- Không để lại console.log, code chết hay TODO không có người nhận.
```

## 5. Danh sách tác vụ

Sáu tác vụ sau T0, mỗi tác vụ có phụ thuộc, danh sách file được sửa và điều kiện nghiệm thu kiểm tra được. T2 và T3 độc lập nhau nên chạy song song sau T1.

| Mã | Tác vụ | Phụ thuộc | File được sửa |
| --- | --- | --- | --- |
| T0 | Khởi tạo repo: Vite + React + TypeScript, lint, Vitest, Playwright, `AGENTS.md`, `tokens.css`, `vi.ts` rỗng, `.nvmrc` | Không | Gốc repo, `src/styles/`, `src/i18n/` |
| T1 | Kiểu dữ liệu và ví dụ: `types.ts` theo mục 6 tab đặc tả cộng `TraceStep`; `samples.ts` chứa ví dụ A, B, C, D | T0 | `src/model/types.ts`, `src/presets/samples.ts` |
| T2 | Engine: `validate.ts`, `dijkstra.ts`, `trace.ts` và test | T1 | `src/engine/` |
| T3 | Canvas React Flow: node tròn, cạnh có trọng số và mũi tên khi có hướng, thêm/xóa/kéo node, nối cạnh, sửa trọng số tại chỗ, vô hướng/có hướng, hoàn tác/làm lại (`graphReducer`) | T1 | `src/model/graphReducer.ts`, Canvas, NodeView, EdgeView trong `src/components/` |
| T4 | Chạy từng bước: Controls, LabelTable, DetailedExplanation, Result, màu node theo snapshot, phím tắt | T2, T3 | Các component còn lại trong `src/components/`, `src/i18n/vi.ts` |
| T5 | Nhập/xuất JSON, canvas trống mặc định, Thêm ví dụ và lỗi biên | T3, T4 | Toolbar và ImportExport trong `src/components/`, tạo mới `src/model/serialize.ts` |
| T6 | Hoàn thiện: cảm ứng, bàn phím, phóng to toàn màn hình, README | T4, T5 | Theo nhu cầu, cộng `README.md` |

### Điều kiện nghiệm thu

**T0**

- `npm run dev`, `test`, `lint`, `build`, `e2e` chạy được trên repo trắng.
- `AGENTS.md` khớp mục 4.
- Lint chặn import React trong `src/engine` (thử bằng một import cố ý, phải báo lỗi).

**T1**

- Biên dịch không lỗi.
- Test kiểm tra số node, số cạnh, nguồn, đích: A (6 node, 10 cạnh), B (5 node, 10 cạnh), C (4 node, 4 cạnh).

**T2**

- Ví dụ A: 12 snapshot, nhãn sau từng bước khớp bảng mục 1, `distance` 10, `paths` \[\["1","4","5","6"\]\], `predecessors` của node 3 là \["2","4"\].
- Ví dụ B: 10 snapshot, `distance` 8, đường \["0","2","4"\].
- Ví dụ C: bước 2 có `tieBetween` \["2","3"\] và chọn node 2; `paths` có đúng hai đường.
- Bảng ví dụ D đạt toàn bộ; chạy hết node (`target = null`): A có 13 snapshot, B có 11.
- 200 đồ thị ngẫu nhiên tối đa 8 node, trọng số nguyên 0–9: khoảng cách khớp Bellman-Ford.
- `validate` chặn trọng số âm, cạnh tự nối, cạnh trùng.
- Nhãn vĩnh viễn không bao giờ giảm sau khi đã chốt.

**T3**

- Đáp ứng FR-01 đến FR-09 ở mục 4.1 tab đặc tả.
- Node là hình tròn 44px; đồ thị có hướng có mũi tên ở đầu cạnh, vô hướng thì không; trọng số nằm giữa cạnh.
- Test `graphReducer`: thêm/xóa node (xóa kéo theo xóa cạnh), thêm/xóa cạnh, sửa trọng số, đổi chế độ, hoàn tác/làm lại trả đúng trạng thái.
- Playwright: thêm 3 node, nối 2 cạnh, sửa một trọng số, kéo một node, xóa một cạnh, hoàn tác.
- Thanh công cụ là thanh nổi trên canvas: không dính mép trên, không rộng hết chiều ngang (mục 3 của tab này).
- Chỉ dùng giá trị từ `tokens.css`; không dùng thư viện icon. Play/Pause và bàn phím dùng SVG nội tuyến; mọi control có nhãn/tooltip tiếng Việt.

**T4**

- Đáp ứng FR-20 đến FR-24, FR-30 đến FR-35, FR-40 đến FR-43 ở tab đặc tả.
- Thanh chọn Nguồn/Đích là thanh nổi ở đáy canvas và không cho hai lựa chọn trùng nhau. Thanh chạy gồm `|‹`, `‹`, bộ đếm, `›`, `›|`, SVG Play/Pause, tốc độ, trạng thái và bật/tắt panel; chỉ hiện khi lựa chọn hợp lệ.
- Panel đóng mặc định dù thanh chạy đã hiện; Hiện kết quả mở Kết quả/Bảng/Diễn giải chi tiết và snapshot done tự mở panel.
- Chạy ví dụ A: màu node đúng mục 3 và câu giải thích đúng mẫu mục 2 (Playwright kiểm ở bước 5, 7 và 11).
- Toàn panel Kết quả + Bảng đóng mặc định. Khi mở, ở mọi snapshot nội dung các hàng khớp bảng mong đợi ở mục 2; bảng chỉ để đọc và không nhận click để đổi bước.
- Bước lùi rồi tới trả đúng trạng thái trước đó; điều hướng bằng runbar, thanh trượt và phím tắt, không bằng bảng.
- Phím ←, → hoạt động; Space global bị loại bỏ ở vòng 8.
- Sửa đồ thị khi đang chạy thì có cảnh báo và reset về bước đầu.

**T5**

- Xuất rồi nhập lại cho đồ thị y hệt, kể cả vị trí node; file sai bị từ chối kèm thông báo rõ (phiên bản, node thiếu, trọng số).
- Mọi dòng của bảng 4.5 ở tab đặc tả có hành vi đúng và có test.
- Canvas trống khi mở và không có empty overlay; Thêm ví dụ mới nạp VD1.

**T6**

- Mọi mục ở danh sách 8.7 của tab đặc tả được tick.
- Giao diện dùng được ở 1280, 820 và 390px: trang không cuộn ngang; khi bảng rộng, toàn vùng kết quả cuộn và toàn bộ bảng dịch ngang cùng nhau (Playwright chụp màn hình ở ba cỡ này).
- Kéo thả, nối cạnh và chạy từng bước dùng được trên màn hình cảm ứng (điện thoại thật hoặc giả lập).
- Có nút phóng to canvas toàn màn hình; chữ đọc được khi chiếu.
- `README.md` nêu cách chạy, cấu trúc thư mục, cách thêm ví dụ.
- Splitter kéo được bằng chuột/cảm ứng và bàn phím; canvas/panel co giãn bù nhau; bật bảng tự mở rộng panel nếu có chỗ và bảng không cuộn riêng.
- Không có nút Xóa toàn cục; Shift multi-select + `Backspace` xóa một transaction; cạnh và mobile có nút xóa ngữ cảnh.
- Nhấp đúp canvas thêm node; click/Shift+click chọn; handle chỉ hiện sau khi chọn hoặc đang nối; cạnh đã có bám viền liên tục và chia làn theo cặp node.
- Có light/dark trong cụm zoom và lựa chọn được giữ sau reload.
- React Flow bật render phần tử trong viewport; kéo layout không tính lại engine; kiểm tra thao tác mượt ở 50 node/200 cạnh.

### Cách giao việc và tránh xung đột

- Một agent một tác vụ, một nhánh riêng, chỉ sửa file được liệt kê.
- `types.ts` chỉ T1 được sửa; nếu T2 hay T3 cần đổi kiểu, ghi đề xuất ở cuối PR và bạn quyết định.
- T4 chỉ bắt đầu khi T2 và T3 đã gộp vào nhánh chính.
- Mẫu lời giao việc, thay `Tn`:

```text
Bạn làm tác vụ Tn của dự án Dijkstra Visualizer. Đọc AGENTS.md ở gốc repo và tài liệu đặc tả
(tab đặc tả và tab "Giao việc cho agent"). Chỉ sửa các file được liệt kê cho Tn. Làm đến khi
mọi điều kiện nghiệm thu của Tn đạt, rồi ghi cuối PR: Đã làm / Chưa làm / Cần hỏi.
Gặp chỗ tài liệu mâu thuẫn hoặc thiếu thì hỏi, đừng đoán.
```

## 6. Việc bạn cần chốt trước khi giao

Những việc dưới đây cần quyết định của bạn; agent không làm thay được.

- [x] Xem lại bảng màu và wireframe ở mục 3; đổi giá trị trong `tokens.css` nếu chưa hợp mắt.
- [x] Đọc ví dụ C và D ở mục 1 (dữ liệu tự đặt, không có trong slide) và xác nhận kết quả mong đợi đúng ý.
- [x] Xác nhận mẫu câu giải thích ở mục 2, nhất là cách gọi "node", "nhãn tạm", "nhãn vĩnh viễn" có khớp thuật ngữ bạn dùng khi giảng không.
- [x] Chọn nơi đặt repo và loại agent dùng cho từng tác vụ.
- [x] Khi có repo, thay chỗ nhắc tài liệu đặc tả trong `AGENTS.md` bằng link thật.
- [x] Giao T0 trước, kiểm tra kết quả, rồi mới giao T1 và các tác vụ sau.

## 7. Điều chỉnh sau vòng góp ý giao diện 2

Mục này ghi nhận yêu cầu phát sinh sau bản triển khai đầu và thắng các nội dung cũ nếu còn sót mâu thuẫn:

1. Toolbar và runbar dùng nền than đậm, bề mặt gọn và tương phản; canvas/panel vẫn sáng. Không sao chép nguyên ảnh tham chiếu, chỉ dùng ngôn ngữ bố cục và nhịp điều khiển.
2. Runbar sắp theo transport bar: `|‹`, `‹`, bộ đếm hiện tại/tổng, `›`, `›|`, phân cách, chạy/dừng, tốc độ, trạng thái và bật/tắt bảng; thanh range nằm ở đáy. Mọi ký hiệu có accessible name tiếng Việt.
3. Desktop có splitter `role="separator"` rộng 10px giữa canvas và panel. Kéo trái/phải hoặc dùng phím mũi tên để đổi panel từ 320 tới 760px; canvas chiếm phần còn lại. Mobile dưới 768px tiếp tục dùng bottom drawer và không hiện splitter.
4. Bảng bước giải có header sticky theo chiều dọc; hai cột đầu không sticky ngang, nên cuộn kéo toàn bảng. Không làm trang tràn ngang.
5. Chế độ Chọn quản lý selection ở state ứng dụng. Cách xóa được thay thế bởi mục 8.
6. Nguồn và đích cụ thể bắt buộc khác nhau. Option trùng bị disable, reducer và `validateGraph` chặn, JSON import cùng endpoint bị từ chối. `target = null` (Tất cả node) vẫn hợp lệ; graph một node chỉ chạy theo chế độ này.
7. Tối ưu canvas: node/edge và callback ổn định bằng memoization, kéo node chỉ cập nhật layout và giữ nguyên tham chiếu graph, tọa độ node mới dùng `screenToFlowPosition`, React Flow dùng `onlyRenderVisibleElements`, và phím xóa mặc định của React Flow bị tắt để tránh UI lệch model.
8. E2E bắt buộc kiểm tra splitter, nguồn/đích không trùng, Backspace, cascade delete/undo, transport bar và ba viewport chuẩn.

## 8. Điều chỉnh sau vòng góp ý giao diện 3

Mục này là yêu cầu mới nhất và thắng mọi wireframe/tiêu chí cũ nếu còn mâu thuẫn:

1. Dùng hai ảnh Graphisual do người dùng cung cấp làm tham chiếu hình ảnh cho cả theme sáng và tối; không sao chép thương hiệu hay chức năng ngoài phạm vi Dijkstra.
2. Toolbar bỏ tên Dijkstra và các nút Thêm node, Thêm cạnh, Xóa. Nút Ví dụ được khôi phục ở vòng 5 và đổi nhãn Thêm ví dụ ở vòng 6.
3. Quy tắc VD1 mặc định được thay ở vòng 6: mở app là canvas trống, không màn hình chào/hộp nạp mẫu.
4. Trong chế độ Chọn: nhấp đúp vùng trống thêm node; click node chỉ chọn, double-click sửa tên; kéo từ một trong bốn điểm nối trên/phải/dưới/trái sang node khác để tạo cạnh; chọn node/cạnh rồi nhấn `Backspace` để xóa.
5. Kéo node phải cập nhật node và các cạnh liên quan theo thời gian thực trong lúc giữ con trỏ. Chỉ commit layout vào history ở `drag stop` để tránh tạo nhiều bản ghi undo.
6. Node hình tròn có hatch nhẹ; cạnh ưu tiên đường thẳng; điểm nối được phân bố quanh node theo vị trí tương đối của hai đầu cạnh. Trọng số là chữ đặt trực tiếp giữa cạnh, có nền nhỏ cùng màu canvas và không có badge viền nặng.
7. Cụm zoom góc dưới trái chứa thu nhỏ, phần trăm, phóng to và Sáng/Tối. Theme áp dụng đồng bộ và lưu bằng `localStorage`.
8. Panel kết quả dùng các khối rõ ràng cho độ dài, đường đi, truy vết và khoảng cách. Khi bật bảng, tự mở rộng panel nếu có thể. `.table-scroll` không tự cuộn; overflow thuộc `.panel-content` hoặc vùng kết quả tương đương.
9. E2E phải kiểm tra: các nút cũ không tồn tại; thêm node bằng nhấp đúp; click chọn/double-click sửa tên; tạo cạnh qua handle; bốn handle; cạnh thẳng; drag sống trước mouseup; Backspace/cascade/undo; theme và persistence; panel/table; các viewport 1280/820/390 không tràn ngang trang.

## 9. Điều chỉnh sau vòng góp ý giao diện 4

Mục này thắng các wireframe và điều kiện cũ nếu có mâu thuẫn:

1. Nút Hiện kết quả/Ẩn kết quả điều khiển toàn bộ panel. Thành phần Giải thích cũ được thay bằng Bảng + Diễn giải chi tiết ở vòng 6. Panel đóng mặc định và tự mở khi snapshot chuyển sang `done`.
2. Separator chứa nút đóng panel; lúc đóng, mép phải canvas có nút mở. Mobile dùng bottom drawer và nút đầu drawer đóng toàn panel.
3. Toolbar thêm Reset ngay sau Toàn màn hình. Hành vi Reset được thay thế ở vòng 5: tạo canvas trống thay vì nạp VD1.
4. Click node chỉ chọn; double-click node mới sửa tên. Double-click nền thêm node nhưng `zoomOnDoubleClick=false`; fit view không vượt 125%.
5. Phân bố cạnh theo toàn bộ incident edges của node: sắp theo góc và chọn handle trên/phải/dưới/trái gần nhất còn trống. Khi hơn bốn cạnh mới tái sử dụng handle.
6. Panel desktop không được làm canvas hẹp dưới khoảng 470px. Khi canvas hẹp, Nguồn/Đích chuyển lên trên zoom/theme và nút hướng dẫn để ba cụm không chồng nhau.
7. Panel dùng surface nổi bật, chữ/badge/số kết quả lớn hơn và khoảng cách giữa các khối gọn hơn; bảng vẫn không có scrollbar riêng.
8. Play/Pause dùng SVG nội tuyến đúng hình; không dùng ký tự `Ⅱ`. Không cài thư viện icon.
9. Góc phải dưới có nút bàn phím mở popover hướng dẫn. Popover tự mở khi tải trang; `?` toggle, `Escape` đóng; nội dung gồm tạo/chỉnh graph, undo/redo, zoom, multi-select, Backspace, arrows, Home/End và mobile; không có Space global.
10. E2E bổ sung panel đóng/mở/tự mở, Reset, click/double-click, double-click không zoom, anchor đích khác nhau, shortcut popover và control đáy không chồng.

## 10. Điều chỉnh sau vòng góp ý giao diện 5

Mục này là quyết định mới nhất và thắng nội dung cũ:

1. Thay thuật toán cấp handle tham lam bằng phép gán tối ưu toàn nhóm cho node có tối đa bốn incident edges: thử các hoán vị handle và tối thiểu hóa tổng sai lệch góc. Điều này phải giữ thứ tự cạnh trên–giữa–dưới và ngăn cắt chéo sát node. Trên bốn cạnh thì dùng handle gần góc nhất, cho phép tái sử dụng.
2. Nút mở/đóng panel dùng SVG chevron; nút hướng dẫn dùng SVG bàn phím. Trong dark mode, cả hai dùng `--accent-warm`, `--border-strong`, surface nổi và stroke rõ; button có accessible name, SVG `aria-hidden`.
3. Reset tạo `GraphDocument` trống hoàn toàn: undirected, không node/cạnh, layout rỗng, source/target null. Đồng thời dừng play, về bước 0, xóa selection/message, đóng panel và reset viewport.
4. Toolbar có nút Thêm ví dụ để nạp VD1 chuẩn và fit view. Empty overlay/nút Nạp VD1 bị loại bỏ ở vòng 6.

## 11. Điều chỉnh sau vòng góp ý giao diện 6

Mục này thắng mọi mô tả cũ nếu còn mâu thuẫn:

1. `useReducer` khởi tạo bằng `emptyDocument`, không phải preset. Canvas trống không hiện hộp thoại, câu hướng dẫn hoặc nút Nạp VD1. Toolbar đổi nhãn thành **Thêm ví dụ**; chỉ nút này mới nạp VD1.
2. Khi bấm Play ở snapshot cuối và hiện không playing, đặt step về 0 rồi bật autoplay. Ở giữa tiến trình tiếp tục từ bước hiện tại; Space global bị loại bỏ ở vòng 8.
3. Node chỉ render `.node-distance` khi khoảng cách hữu hạn. Bỏ marker `t`; marker `s` của nguồn vẫn giữ.
4. Cụm Nguồn/Đích dùng gap 12px, label gap 8px, select tối thiểu 118px × 38px, padding ngang 12px và viền inset nhẹ.
5. Xóa `Explanation.tsx`. Trong panel, render `LabelTable` trước rồi `DetailedExplanation`.
6. DetailedExplanation sinh từ snapshots đã đạt tới: Bước 0 khởi tạo; mỗi node cố định có câu chọn, nhãn `*`, phép min/cập nhật hoặc câu không cần hạ nhãn. Khi done mới thêm truy vết ngược và kết luận cho từng path; hỗ trợ no-path và target null.
7. E2E kiểm tra initial 0 node/no overlay, Thêm ví dụ thành 6 node, replay 11→0, không ∞/t nhưng có s, kích thước selectors, không còn heading Giải thích bước, có diễn giải khởi tạo/từng bước/truy vết.
5. Khu kết quả chỉ dùng border ở hai surface ngoài Kết quả và Phân tích. Bỏ border ở status badge, result empty, distance card/item, table wrapper và từng cell; dùng background, spacing, header/zebra/sticky/highlight để phân cấp.
6. E2E phải kiểm tra thứ tự anchor source của ba cạnh trên–giữa–dưới, endpoint target không trùng, icon SVG và màu dark mode, Reset về 0 node, Ví dụ về 6 node, border ngoài 1px/inner 0px và responsive.

## 12. Điều chỉnh sau vòng góp ý giao diện 7

Mục này thắng mọi mô tả cũ nếu còn mâu thuẫn:

1. Engine, snapshot, predecessor và đường đi tiếp tục dùng `NodeId` làm khóa ổn định; không đổi hợp đồng thuật toán chỉ để phục vụ hiển thị.
2. Tại biên giao diện, tạo ánh xạ từ `node.id` sang `node.label`. Cả ba vùng **Kết quả**, **Bảng bước giải** và **Diễn giải chi tiết & Truy vết** phải dùng label người dùng nhập cho tiêu đề cột, đỉnh cố định, predecessor, phép cập nhật, đường đi và truy vết. Chỉ fallback về ID nếu dữ liệu label tương ứng không tồn tại.
3. `LabelTable` không nhận callback nhảy bước, không đặt `onClick` lên hàng/ô và không render button cho số bước. Highlight hàng hiện tại vẫn được giữ như chỉ dấu trực quan.
4. Điều hướng snapshot chỉ dùng runbar (`Đầu/Lùi/Tới/Cuối`, Play/Pause, range) và các phím tắt đã đặc tả.
5. E2E phải import một graph có ID khác hoàn toàn label, chạy tới cuối và xác nhận panel chỉ có label; đồng thời xác nhận bảng không có button và bấm hàng không đổi bộ đếm bước.

## 13. Điều chỉnh sau vòng góp ý giao diện 8

Mục này là yêu cầu mới nhất và thắng mọi mô tả cũ nếu còn mâu thuẫn:

1. Hover node không hiện handle. Chọn node mới hiện bốn handle; khi đang kéo nối, handle đích được hiện tạm để hoàn tất kết nối.
2. Chọn đúng một cạnh mở toolbar nổi tại cạnh gồm giảm trọng số, giá trị/sửa, tăng trọng số và SVG thùng rác; tuyệt đối không có đổi chiều.
3. `LabelTable` bỏ sticky ngang ở cột Bước và Đỉnh cố định. Overflow vẫn thuộc panel, nhưng cuộn ngang phải kéo toàn bảng; header chỉ sticky theo trục dọc.
4. Toàn màn hình phải toggle vào/thoát và đồng bộ trạng thái qua `fullscreenchange`.
5. Hướng dẫn tự mở khi tải trang; bổ sung tạo node/cạnh, chỉnh sửa, chọn nhiều và hướng dẫn mobile chi tiết. Xóa dòng Space global.
6. Shift+click chọn nhiều node/cạnh; `Backspace` xóa selection bằng action reducer duy nhất để undo một lần khôi phục đủ.
7. Runbar đổi nhãn thành **Hiện kết quả / Ẩn kết quả**.
8. Result path bỏ badge tròn số thứ tự và bỏ block Truy vết; DetailedExplanation vẫn giữ truy vết học thuật khi done.
9. Cạnh đã tồn tại dùng điểm cắt liên tục trên viền node. Các cạnh cùng một cặp node được nhóm và gán lane offset ổn định để endpoint cùng nhãn không chồng nhau.
10. Dưới 768px, khi selection không rỗng, hiện SVG thùng rác trong cụm Nguồn/Đích và bảo đảm nút nằm trong viewport 390px.
11. Không xử lý Space toàn cục. Play/Pause chỉ được kích hoạt bằng click/tap hoặc hành vi keyboard native khi button đã focus.
12. E2E bắt buộc kiểm tra đủ các mục trên, cùng fullscreen hai chiều và không phát sinh lỗi React update loop.

## 14. Điều chỉnh sau vòng góp ý giao diện 9

Mục này thắng mô tả mobile cũ nếu còn mâu thuẫn:

1. Ở viewport 390×844, popover hướng dẫn không được kéo từ góc dưới xuyên qua cụm Nguồn/Đích. Đặt popover bằng `position: fixed` trong safe area: phía trên cách toolbar/runbar ít nhất 8px, phía dưới cách selectors ít nhất 8px; nội dung dài cuộn bên trong.
2. Popover mobile dùng nền surface đặc, border rõ, shadow nhẹ và header đóng sticky; không để nội dung phía sau làm chữ mất nét.
3. Cụm Nguồn/Đích mobile dùng grid hai cột co giãn và một cột auto cho thùng rác. Label đặt phía trên select; không ép select còn 88px.
4. Ở viewport 390px, mỗi select phải rộng ít nhất 120px. Nút thùng rác 44×44px nằm trong cùng surface, cách mép trong bên phải không quá 12px.
5. Khi chưa chọn phần tử, cột auto thu về 0; khi chọn, nút xuất hiện mà không làm hai select chồng nhau, mất chữ hoặc đẩy ra ngoài viewport.
6. E2E đo bounding box giữa guide/toolbar/selectors/dock, chiều rộng select và khoảng cách nút xóa tới mép phải; chụp ảnh cả trạng thái mở hướng dẫn và trạng thái đã chọn node.

## 15. Điều chỉnh sau vòng góp ý giao diện 10

Mục này thắng mô tả hướng dẫn và nút xóa mobile cũ nếu còn mâu thuẫn:

1. Không để toàn popover cùng cuộn. Popover là flex column `overflow: hidden`; header là phần cố định, nền surface đặc và có đường phân cách dưới; chỉ body `overflow-y: auto`.
2. Khi cuộn body tới đầu, giữa hoặc cuối, tọa độ header không đổi và không có nội dung nào hiển thị trong khoảng phía trên/header.
3. Desktop giữ **Hướng dẫn phím tắt**. Dưới 768px ẩn nhóm desktop và hiển thị **Hướng dẫn thao tác trên điện thoại** viết riêng cho cảm ứng: chạm/chạm đúp, mode Nối cạnh hai-chạm, chỉnh cạnh, xóa bằng thùng rác, kéo/chụm canvas và nút điều khiển thuật toán.
4. Nút thùng rác trong grid Nguồn/Đích là button 44×44px, có border 1px ở cả bốn cạnh, bo góc và focus state như control khác. Không thay border đầy đủ bằng divider trái.
5. E2E dùng viewport thấp như 390×640 để buộc body hướng dẫn cuộn; xác nhận `scrollTop > 0`, header giữ nguyên tọa độ và hướng dẫn desktop bị ẩn. Đồng thời kiểm tra riêng `borderTop/Right/Bottom/LeftWidth` của nút xóa đều là 1px.

## 16. Điều chỉnh sau vòng góp ý giao diện 11

Mục này thắng mọi mô tả cũ về handle, panel kết quả, overflow bảng và toolbar/runbar:

1. Kết quả tính toán không phụ thuộc step trình chiếu. Khi panel mở, `Result`, `LabelTable` và `DetailedExplanation` luôn dùng snapshot cuối; hiển thị ngay khoảng cách/path, toàn bộ hàng bảng, toàn bộ diễn giải và truy vết. Canvas vẫn dùng snapshot hiện tại.
2. `.panel-content` chỉ `overflow-y: auto` và `overflow-x: hidden`. `.analysis-content` không dùng `min-width: max-content`; `.table-scroll` chịu `overflow-x: auto`, để chỉ zone bảng có thanh kéo ngang.
3. Thêm `EditorMode = 'select' | 'connect'`. Mode Chọn cho thêm/kéo/đổi tên/chọn/xóa node và chọn/chỉnh/xóa cạnh hiện có. Mode Nối cạnh khóa kéo node; click/chạm node đầu rồi node cuối để tạo cạnh, click lại node đầu hoặc nền để hủy.
4. React Flow vẫn giữ handle kỹ thuật để đo anchor nhưng handle luôn opacity 0, `pointer-events: none`; không tạo cạnh bằng kéo. Node đầu của mode Nối cạnh có ring trạng thái riêng.
5. Runbar bỏ hoàn toàn Tốc độ và nhãn Hoàn tất/Đang chạy; autoplay dùng nhịp cố định 700ms. Mobile dùng nhãn ngắn **Kết quả**.
6. Yêu cầu toolbar mobile hai tầng của vòng này đã được vòng 12 thay thế; các hành vi Chọn/Nối cạnh/Undo/Redo vẫn giữ nguyên.
7. Mobile giữ float offset 8px, select ≥120px tại 390px và nút xóa 44×44px. Note/icon hướng dẫn của vòng này đã được vòng 12 loại bỏ.
8. E2E bắt buộc kiểm tra kết quả cuối ở step giữa, bảng cuộn nội bộ, mode Nối cạnh hai-click, handle ẩn, không overflow ngang và không phát sinh React update loop; tiêu chí bố cục mobile theo vòng 12.

## 17. Điều chỉnh sau vòng góp ý giao diện 12

Mục này thắng mọi mô tả cũ về toolbar desktop/mobile, note hướng dẫn và các thanh nổi dưới 768px:

1. Desktop: toolbar không được tràn qua splitter vào panel kết quả. Giới hạn theo chiều rộng canvas và dùng `overflow-x: auto`; hành vi từ 768px trở lên ngoài điểm này giữ nguyên.
2. Dưới 768px khai báo một chỗ các token `--m-gap: 8px`, `--m-bar-h: 44px`, `--m-control-h: 36px`, `--radius: 4px`. Mọi thanh nổi dùng cùng surface, border 1px, shadow, radius 4px; chữ chỉ 12/14px, weight 400/500.
3. Toolbar mobile là một hàng: Chọn, Nối cạnh, Hoàn tác, Làm lại, Khác; gap 4px, padding ngang 12px, control cao 36px. Khi thiếu chỗ, cuộn ngang nội bộ và ẩn scrollbar. Active chỉ đổi nền/chữ, border 1px luôn trong suốt để không nhảy kích thước.
4. Nút chữ **Khác** thay ký tự `⋮`, mở menu gồm Vô/Có hướng, Thêm ví dụ, Nhập, Xuất, Chế độ sáng/tối và Hướng dẫn. Mobile không hiện icon bàn phím và không còn note **Xem hướng dẫn tại đây →**.
5. Thanh Nguồn/Đích cao 44px, hai ô chia đều; label 12px nằm cùng hàng với giá trị 14px. Nút xóa vẫn là vùng chạm 44×44px có border đủ bốn cạnh; tại 390px hai select không hẹp dưới 120px.
6. Hàng tiện ích cao 44px chỉ có `− 125% +`. Khi runbar 44px hiện ngay dưới toolbar, ẩn zoom; panel kết quả đóng thành drawer 44px chữ **Kết quả**. Thanh dưới cách đáy tối thiểu `24px + env(safe-area-inset-bottom)`.
7. Dời attribution React Flow tới vùng trống; không để giao toolbar, runbar, selectors, hướng dẫn hoặc drawer. Khi chưa chạy, tổng vùng cao bị các thanh che không quá 25% viewport.
8. Mỗi cạnh vô hướng chỉ render một đường, một nhãn và không marker mũi tên. Không thay đổi engine, state, schema hoặc dữ liệu preset.
9. Playwright đo tại 360×740, 390×844, 430×932: thanh 44±1, control 36±1, radius 4px, font chỉ 12/14px, không weight 700, không giao nhau và không cuộn ngang trang. Desktop 1280×800 phải giữ giao diện, đồng thời kéo splitter xác nhận toolbar nằm trọn trong canvas và có scroll nội bộ.

## 18. Điều chỉnh sau vòng góp ý giao diện 13

Mục này thắng phần mobile một hàng, nút Khác, radius 4px và autoplay cố định của vòng 11–12:

1. Thêm select tốc độ vào runbar với các giá trị `0.5x`, `1x`, `1.5x`, `2x`; giao diện chỉ hiện hệ số, không có chữ **Tốc độ**. Interval autoplay phải tính theo hệ số đã chọn.
2. Khôi phục toolbar mobile hai tầng. Hàng chính cao 44px, chia đều bốn action Chọn/Nối cạnh/Hoàn tác/Làm lại và nút ba chấm đứng 34px ở mép phải, không để khoảng trống dư.
3. Tầng dưới nằm trong cùng surface, mở bằng nút ba chấm, cao gọn và cuộn ngang ẩn scrollbar. Thứ tự: Vô/Có hướng, Nhập, Xuất, Toàn màn hình, Reset, Thêm ví dụ, theme. Khi mở phải tăng chiều cao toolbar và đẩy runbar xuống ít nhất 8px.
4. Mobile dùng surface bo 10px, control bo 7px, chữ 11–13px; control runbar rộng 28–52px. Không để cụm Đầu/Lùi/Tiếp/Cuối chiếm gần hết chiều ngang.
5. Runbar mobile cao 48px. Range cao đủ cho thumb/track, nằm sát đáy nhưng không bị `overflow` cắt; select tốc độ và nút Kết quả vẫn nằm trên cùng một hàng.
6. Nút mở hướng dẫn mobile là chữ **Hướng dẫn** ở góc phải dưới, không dùng icon. Khi có kết quả đóng, nút Kết quả nằm bên trái và cách Hướng dẫn ít nhất 8px.
7. Khi mở trên mobile, panel Kết quả có top ngay dưới toolbar + runbar và bottom 8px; dùng toàn bộ vùng còn lại, panel-content tự cuộn để truy cập đủ Result, Bảng và Diễn giải.
8. Playwright chụp và đo tại 360×740, 390×844, 430×932: hàng chính kín chiều ngang, toolbar mở cao 82px, runbar cao 48px, progress nằm trong vùng nhìn thấy, Kết quả/Hướng dẫn không giao nhau, panel mở dùng toàn vùng và trang không overflow ngang.
9. Sau mỗi nhóm thay đổi hoàn chỉnh, chạy kiểm tra liên quan và commit riêng. Ghi hash, phạm vi và kết quả test của commit chức năng vào `Vận hành.md`; không push nếu chưa được yêu cầu.

## 19. Điều chỉnh sau vòng góp ý giao diện 14

Mục này thắng các mô tả cũ về nút Kết quả trong runbar và chiều rộng selectors mobile:

1. Dưới 768px ẩn `.runbar .table-toggle`; không xóa nút Kết quả desktop. Mobile chỉ dùng nút Kết quả ở hàng đáy để mở panel.
2. `.selectors` mobile căn giữa bằng `left: 50%` và `translateX(-50%)`, rộng `min(360px, calc(100% - 16px))` khi không có selection.
3. Khi có `.mobile-delete`, selectors được phép rộng `min(380px, calc(100% - 16px))` để giữ hai select đủ rộng và nút xóa 44×44px.
4. Mỗi label dùng grid `max-content minmax(0, 1fr)`. Nhãn Nguồn/Đích có cột riêng, không co mất chữ; select chiếm phần còn lại và không phủ nhãn.
5. Ở trạng thái thường, mỗi vùng select không rộng quá 150px. Tại 390px khi có nút xóa, mỗi select vẫn đạt ít nhất 120px.
6. Playwright phải kiểm tra thêm 620×870 theo ảnh người dùng, cùng 360×740, 390×844, 430×932; xác nhận runbar mobile không có Kết quả, selectors đúng max-width, nhãn vừa cột và không overflow trang.
