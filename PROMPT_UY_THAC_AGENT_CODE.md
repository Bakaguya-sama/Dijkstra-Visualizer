# Prompt ủy thác cho coding agent — Dijkstra Visualizer

Bạn là coding agent chịu trách nhiệm triển khai hoàn chỉnh MVP **Dijkstra Algorithm Visualizer** trong repository hiện tại. Hãy làm việc tự chủ, đọc kỹ tài liệu, triển khai, kiểm thử và chỉ báo hoàn thành khi sản phẩm thực sự chạy được.

## 1. Mục tiêu bàn giao

Xây dựng một web app tĩnh, giao diện tiếng Việt, giúp giảng viên và sinh viên:

- tự vẽ/chỉnh sửa đồ thị có hướng hoặc vô hướng;
- chọn nguồn, đích hoặc chế độ tính tới mọi node;
- chạy Dijkstra từng snapshot bằng Tiếp, Lùi, Đầu, Cuối, Chạy/Dừng và thanh trượt;
- quan sát nhãn tạm, nhãn vĩnh viễn, node đang xét, cạnh đang relax và đường đi ngắn nhất;
- xem giải thích phép tính, bảng bước giải và truy vết;
- nhập/xuất đồ thị bằng JSON;
- sử dụng được trên desktop, tablet và mobile mà không cần backend.

Kết quả phải là một repository có thể cài đặt và chạy bằng các lệnh chuẩn, có unit test và E2E test cho các luồng trọng yếu.

## 2. Tài liệu bắt buộc và thứ tự ưu tiên

Trước khi sửa code, đọc toàn bộ các file sau trong repo:

1. `PROMPT_UY_THAC_AGENT_CODE.md` — prompt này.
2. `Góp ý.md` — các quyết định UI/UX mới nhất và trạng thái nghiệm thu hiện tại.
3. `Giao việc cho agent.md` — dữ liệu chuẩn, định nghĩa snapshot, design tokens, wireframe, tác vụ và điều kiện nghiệm thu.
4. `Đặc tả.md` — phạm vi sản phẩm, yêu cầu chức năng/phi chức năng, kiến trúc và UX.
5. `AGENTS.md` nếu đã tồn tại.

Khi có mâu thuẫn, áp dụng thứ tự ưu tiên: **prompt này > `Góp ý.md` > `Giao việc cho agent.md` > `Đặc tả.md`**. Vòng góp ý có số lớn hơn thắng mô tả vòng cũ. Không tự thay đổi dữ liệu các ví dụ A, B, C, D hoặc số snapshot mong đợi.

Nếu repo mới chỉ có tài liệu, bắt đầu từ T0. Nếu đã có code, trước tiên kiểm tra trạng thái hiện tại, giữ lại thay đổi hợp lệ và tiếp tục từ mốc chưa hoàn tất; không xóa hay ghi đè công việc hiện có một cách mù quáng.

## 3. Công nghệ và ràng buộc

- React, TypeScript, Vite.
- React Flow dùng package `@xyflow/react` và stylesheet chính thức của package.
- Vitest cho unit/integration test; Playwright cho E2E.
- CSS thường hoặc CSS Modules; không thêm Tailwind, Zustand, thư viện icon, UI kit hay dependency khác nếu không thật sự cần. Ưu tiên `useReducer` và API sẵn có của trình duyệt.
- Không backend, tài khoản, database hay runtime network call.
- Production bundle phải chạy hoàn toàn phía client và không phụ thuộc CDN. Không cần biến MVP thành PWA và không cần service worker.
- Engine trong `src/engine` là hàm thuần, không import React, DOM hoặc `@xyflow/react`.
- Mọi kiểu dữ liệu dùng chung đặt ở `src/model/types.ts`.
- Mọi chuỗi giao diện tiếng Việt đặt ở `src/i18n/vi.ts`; không hard-code chuỗi hiển thị trong component.
- Màu, font, cỡ chữ, khoảng cách, bo góc và kích thước thiết kế lấy từ `src/styles/tokens.css`. CSS cấu trúc như `display`, `position`, `grid`, `calc()`, phần trăm và breakpoint được phép dùng trực tiếp.
- Không thư viện icon, emoji, gradient trang trí hay glassmorphism. Điều hướng dùng ký hiệu văn bản; Play/Pause và bàn phím dùng SVG nội tuyến. Mỗi nút phải có `aria-label` và tooltip tiếng Việt.
- Không tạo commit, push hoặc PR trừ khi người dùng yêu cầu riêng. Không sửa hai file đặc tả chỉ để làm cho code khớp.

## 4. Các quyết định đã khóa để tránh suy đoán

### 4.1 Engine và đường đi

- Hàm chính có hợp đồng `runDijkstra(graph, source, target)`, trong đó `target: NodeId | null`; `null` nghĩa là chạy tới khi hết node có thể tới được.
- Dùng Dijkstra O(n²), chọn node bằng cách quét nhãn tạm; không dùng priority queue.
- Tuân thủ chính xác thứ tự snapshot ở mục 2 của `Giao việc cho agent.md`: `init`, `relax` nguồn, các cặp `select`/`relax`, rồi `done`. Khi đích vừa được `select`, snapshot kế tiếp là `done`, không relax đích.
- Hòa khi chọn node: so số nếu cả hai ID là chuỗi biểu diễn số nguyên; nếu không thì so chuỗi. `tieBetween` chứa toàn bộ node cùng nhãn nhỏ nhất theo đúng thứ tự comparator; node đầu tiên được chọn.
- Khi candidate bằng nhãn cũ hữu hạn, không đổi nhãn nhưng thêm predecessor nếu chưa có. Danh sách predecessor phải ổn định, không trùng.
- Engine phải tính được **tất cả đường ngắn nhất** và trace ngay trong MVP vì ví dụ C và điều kiện nghiệm thu T2 phụ thuộc vào chúng. UI cũng hiển thị tất cả đường khi có hòa; đây là ngoại lệ có chủ đích so với dòng “v2” trong `Đặc tả.md`.
- Dựng đường bằng predecessor để tránh vòng lặp ở cạnh trọng số 0. Thứ tự paths phải tất định theo comparator ID. Không để một đường chứa lặp node.
- Không có đường đi: `distance = null`, `paths = []`; nhãn node không tới được vẫn là `Infinity` trong bộ nhớ.
- Nguồn và đích cụ thể trùng nhau là đầu vào không hợp lệ: UI disable option trùng, reducer/validation chặn và import JSON từ chối. Đồ thị một node chỉ chạy với `target = null`, sinh `init`, `relax`, `done`.
- Engine không chạy nếu validation thất bại; không âm thầm sửa graph.

### 4.2 ID, cạnh và validation

- Node ID là chuỗi duy nhất, không giả định bắt đầu từ 0 hoặc 1. Label có thể trùng nhưng ID không được trùng.
- Trọng số phải là số hữu hạn `>= 0`; chấp nhận 0 và số thập phân. Từ chối `NaN`, `Infinity`, chuỗi rỗng và số âm.
- Không cho self-loop.
- Không cho cạnh song song. Với graph có hướng, `A→B` và `B→A` là hai cạnh khác nhau. Với graph vô hướng, `A—B` trùng với `B—A`.
- Mọi endpoint, source và target khác `null` phải tham chiếu node tồn tại; source và target cụ thể phải khác nhau.
- Giới hạn nhập: tối đa 50 node và 200 cạnh.
- Khi chuyển từ có hướng sang vô hướng mà đang có hai cạnh đối hướng giữa cùng một cặp node, không tự làm mất dữ liệu. Chặn chuyển đổi và hiển thị lỗi yêu cầu người dùng xóa/gộp một cạnh trước.

### 4.3 JSON import/export

- Schema version hiện tại là `1`.
- Node trong file có dạng `{ id, label, x, y }`; edge có dạng `{ id?, from, to, weight }`; ngoài ra có `directed`, `source`, `target`.
- Các preset chuẩn không có `edge.id`, nên importer phải chấp nhận thiếu ID và sinh ID duy nhất, tất định. Exporter luôn ghi `edge.id` để round-trip giữ nguyên danh tính cạnh.
- `target` được phép là `null` cho chế độ chạy hết node. `source` phải là ID hợp lệ hoặc `null` nếu chưa chọn.
- Từ chối version không hỗ trợ, field sai kiểu, ID trùng, endpoint thiếu, source/target không tồn tại hoặc trùng nhau, trọng số không hợp lệ, self-loop, cạnh trùng hoặc vượt giới hạn. Thông báo phải chỉ rõ nguyên nhân và cách sửa.
- Không export snapshot/nhãn thuật toán. Nếu một test helper cần serialize `Infinity`, biểu diễn bằng `null`; file graph thông thường không chứa nhãn khoảng cách.

### 4.4 UX/UI đã khóa theo ảnh tham chiếu và góp ý vòng 3

- Thanh chọn có hai select: Nguồn và Đích. Select Đích có lựa chọn “Tất cả node”, ánh xạ thành `target = null`.
- Thanh chạy/panel kết quả xuất hiện khi đã chọn nguồn và một đích khác nguồn **hoặc** “Tất cả node”.
- Đồ thị một node chỉ chạy ở chế độ “Tất cả node”. Chỉ vô hiệu hóa chạy khi thiếu lựa chọn hợp lệ hoặc graph rỗng.
- Dùng hai ảnh Graphisual sáng/tối do người dùng cung cấp làm tham chiếu về canvas lưới, thanh nổi, node tròn hatch, cạnh/trọng số và nhịp màu; không sao chép thương hiệu hoặc chức năng ngoài phạm vi.
- Toolbar không có tên Dijkstra và không có Thêm node, Thêm cạnh hoặc Xóa. Giữ Chọn, Vô hướng/Có hướng, Hoàn tác, Làm lại, Nhập, Xuất, Toàn màn hình, Reset và Thêm ví dụ.
- Ứng dụng mở bằng canvas trống, không overlay/hộp nạp mẫu. Chỉ nút **Thêm ví dụ** mới nạp VD1.
- Chế độ Chọn là mặc định: nhấp đúp nền thêm node; click node chọn, Shift+click chọn nhiều, double-click sửa tên. Handle kỹ thuật luôn ẩn và không nhận pointer. Chế độ **Nối cạnh** tạo cạnh bằng click/chạm node đầu rồi node cuối; node đầu được nhấn mạnh. `Backspace` xóa toàn selection trong một transaction.
- Kéo node phải cập nhật node và cạnh theo con trỏ trước `mouseup`; chỉ commit layout vào undo history khi kết thúc drag.
- Cạnh ưu tiên đường thẳng và cắt trực tiếp tại viền tròn, không bị khóa vào bốn handle sau khi đã tạo. Nhiều cạnh giữa cùng cặp node phải dùng các làn song song khác nhau trên viền và nhãn trọng số tách biệt.
- Chọn đúng một cạnh mở thanh ngữ cảnh tại cạnh gồm `−`, giá trị/sửa trọng số, `+`, và SVG thùng rác; không có nút đổi chiều. Mobile có thêm thùng rác cạnh cụm Nguồn/Đích khi selection không rỗng.
- Cụm zoom góc dưới trái gồm thu nhỏ, phần trăm zoom, phóng to và Sáng/Tối. Theme áp dụng đồng bộ cho canvas, toolbar/runbar, graph và panel; lưu lựa chọn bằng `localStorage`.
- Panel đóng mặc định. **Hiện kết quả/Ẩn kết quả** mở/đóng Kết quả + Bảng + Diễn giải chi tiết; snapshot `done` tự mở. Separator có nút đóng, mép canvas có nút mở; mobile dùng bottom drawer.
- Desktop panel khoảng 500px, tối thiểu 320px nhưng phải chừa canvas khoảng 470px. Khi canvas hẹp, Nguồn/Đích chuyển lên trên zoom/theme và nút hướng dẫn. Panel chỉ cuộn dọc; `.table-scroll` rộng 100% và tự cuộn ngang.
- Khi panel mở ở bất kỳ step nào, `Result`, `LabelTable` và `DetailedExplanation` đều nhận snapshot cuối: hiện ngay kết quả cuối, toàn bộ bảng, các bước giải và truy vết. Canvas/runbar vẫn dùng snapshot hiện tại. Không còn `Explanation` snapshot đơn.
- Engine và snapshot dùng NodeId, nhưng mọi nội dung nhìn thấy trong Kết quả, Bảng bước giải và DetailedExplanation phải ánh xạ sang `node.label` do người dùng nhập: tiêu đề cột, đỉnh cố định, predecessor, phép cập nhật, path và trace. Chỉ fallback ID khi không tìm thấy label.
- Bảng bước giải chỉ để đọc: không callback nhảy bước, không `onClick` trên hàng/ô và không button cho số bước. Không sticky ngang cột Bước/Đỉnh cố định; cuộn ngang kéo toàn bảng, chỉ header sticky theo chiều dọc.
- Runbar desktop theo bố cục: `|‹`, `‹`, bộ đếm hiện tại/tổng, `›`, `›|`, phân cách, chạy/dừng, select chỉ hiện `0.5x/1x/1.5x/2x` và bật/tắt Kết quả. Dưới 768px ẩn riêng nút Kết quả trong runbar; nút Kết quả ở hàng đáy mở panel. Range nằm sát đáy nhưng không bị cắt.
- “Cuối” nhảy tới snapshot `done`; “Đầu” về snapshot 0. Khi đang auto-play, mọi thao tác điều hướng khác phải dừng play trước.
- Khi đang ở snapshot cuối và bấm Chạy, đưa step về 0 rồi autoplay lại; ở giữa tiến trình tiếp tục từ bước hiện tại. Không đăng ký Space global; Space chỉ kích hoạt button theo hành vi native sau khi Play/Pause được focus/click.
- Sửa dữ liệu graph khi đang ở snapshot khác 0 hoặc đang play: dừng play, áp dụng thay đổi, tái tạo kết quả và đưa phiên chạy về snapshot 0, đồng thời báo ngắn gọn. Chỉ kéo vị trí node không làm chạy lại engine.
- Reset tạo canvas trống hoàn toàn: graph vô hướng rỗng, layout rỗng, source/target null; đồng thời về bước 0, dừng autoplay, xóa selection/thông báo, đóng panel và reset viewport. Nút Thêm ví dụ nạp VD1 và fit view.
- Node không render ∞ khi nhãn chưa hữu hạn và không render marker `t`; chỉ giữ marker nguồn `s`.
- Cụm Nguồn/Đích dùng gap 12px, label gap 8px, select tối thiểu 118px × 38px và padding thoáng.
- Fullscreen là toggle hai chiều: bấm lần đầu vào toàn màn hình, lần sau thoát; đồng bộ nhãn khi thoát bằng Esc.
- Play/Pause, chevron panel, bàn phím và thùng rác dùng SVG nội tuyến. Popover hướng dẫn mở mặc định; desktop có phím tắt, mobile có bộ hướng dẫn cảm ứng riêng; `?` toggle và `Escape` đóng.
- Khối Kết quả chỉ giữ khoảng cách và path; bỏ badge số thứ tự trước path và bỏ khối Truy vết lặp. DetailedExplanation vẫn giữ truy vết khi done.
- Ở mobile dưới 768px, không neo popover hướng dẫn từ nút góc dưới theo cách khiến nó phủ Nguồn/Đích. Dùng surface `position: fixed` trong safe area giữa toolbar/runbar và control đáy, nền đặc, scroll nội bộ, header/đóng luôn rõ. Tại 390×844 phải có tối thiểu 8px giữa popover với toolbar và selectors.
- Header popover không nằm trong vùng scroll: popover `overflow: hidden`, header nền đặc/tách bằng border, chỉ body cuộn. Dưới 768px ẩn nội dung desktop và hiện tiêu đề **Hướng dẫn thao tác trên điện thoại** cùng các thao tác chạm, kéo và chụm.
- Desktop toolbar phải nằm trọn trong canvas khi kéo splitter; nếu thiếu chỗ thì cuộn ngang nội bộ, không tràn qua panel kết quả.
- Dưới 768px, toolbar mobile hai tầng dùng surface và control bo 4px. Hàng chính cao 44px chứa Chọn, Nối cạnh, Thêm ví dụ, SVG undo, SVG redo và nút ba chấm đứng; tầng dưới cuộn ngang chứa hướng đồ thị, Nhập, Xuất, Toàn màn hình, Reset và theme, đồng thời đẩy runbar xuống. Không lặp Ví dụ ở tầng dưới; icon SVG có accessible name trên button, không thêm thư viện icon.
- Mobile bỏ icon bàn phím và note **Xem hướng dẫn tại đây →**; nút chữ **Hướng dẫn** ở góc phải dưới mở lại popover cảm ứng.
- Cụm Nguồn/Đích mobile căn giữa, tối đa 360px thường và 380px khi có nút xóa. Bên trong mỗi nhóm dùng grid nhãn `max-content` + giá trị `minmax(0,1fr)` để nhãn không bị lấn; mỗi select vẫn rộng tối thiểu 120px ở viewport 390 khi có nút xóa 44×44px.
- Zoom mobile chỉ còn `− 125% +`; khi runbar 48px xuất hiện thì ẩn zoom. Nút Kết quả đóng nằm bên trái nút Hướng dẫn và không giao nhau; khi mở, panel Kết quả dùng toàn bộ vùng còn lại dưới toolbar/runbar và tự cuộn.
- Nút xóa mobile phải là button 44×44px có border 1px đủ bốn cạnh, không chỉ có divider/border trái.
- Khu Kết quả/Phân tích chỉ có border ở surface ngoài; bỏ border khỏi badge, card, wrapper và cell bảng, dùng background/spacing/sticky/highlight để phân cấp.
- Xóa thực hiện ngay, không confirmation dialog, và có thể undo. Các lỗi nhập hiển thị inline/non-blocking; không dùng `alert()`.
- Undo/redo áp dụng cho thay đổi nội dung graph và layout, không áp dụng cho việc chuyển snapshot. Nạp preset/import là một transaction có thể undo.
- Đổi nhãn node bằng double click. Sửa trọng số qua nút giá trị trên thanh cạnh; Enter lưu, Escape hủy, blur lưu nếu hợp lệ; dữ liệu không hợp lệ giữ giá trị cũ và báo lỗi.
- Đảm bảo thao tác bàn phím không kích hoạt phím tắt toàn cục khi focus đang ở input/select/textarea hoặc phần tử editable.
- Tối ưu React Flow: memo hóa node/edge/callback, dùng `onlyRenderVisibleElements`, dùng `screenToFlowPosition` khi thêm node, tắt delete nội bộ của React Flow để model là nguồn sự thật. Di chuyển node chỉ thay layout và không đổi tham chiếu graph, nhờ đó không chạy lại Dijkstra.

## 5. Cấu trúc tối thiểu

Giữ cấu trúc sau, có thể tách thêm file nhỏ khi cần:

```text
src/
  engine/        dijkstra.ts, validate.ts, trace.ts và test
  model/         types.ts, graphReducer.ts, serialize.ts và test
  components/    Canvas, NodeView, EdgeView, Toolbar, Controls,
                 LabelTable, DetailedExplanation, Result, ImportExport
  presets/       samples.ts
  i18n/          vi.ts
  styles/        tokens.css và stylesheet cần thiết
```

Tạo `AGENTS.md` theo nội dung trong `Giao việc cho agent.md`, nhưng dùng đúng tên hai file Markdown trong repo thay cho khái niệm “tab”. Tạo `.nvmrc`, scripts và cấu hình cần thiết để các lệnh ở mục 8 chạy được.

## 6. Trình tự thực hiện

Thực hiện tuần tự theo T0–T6 trong `Giao việc cho agent.md`:

1. T0 — scaffold, cấu hình lint/test/E2E, tokens, i18n và `AGENTS.md`.
2. T1 — types và presets A–D.
3. T2 — validation, engine, trace và unit test đầy đủ.
4. T3 — graph reducer và canvas editor.
5. T4 — controls, snapshot visualization, bảng bước giải, giải thích và kết quả.
6. T5 — import/export, canvas trống mặc định, Thêm ví dụ và lỗi biên.
7. T6 — responsive, cảm ứng, accessibility, fullscreen, README và E2E hoàn thiện.

Đây là một nhiệm vụ triển khai trọn repo, nên bạn được sửa `types.ts` khi đang thực hiện T1 và được sửa lại nếu integration chứng minh hợp đồng kiểu còn thiếu. Mọi thay đổi hợp đồng sau T1 phải nhỏ, có lý do rõ ràng và có test; không viện quy tắc “chỉ T1 sửa types” để để lại code không biên dịch.

Sau mỗi mốc, chạy test liên quan ngay. Không tiếp tục chồng thêm UI lên engine đang sai.

## 7. Yêu cầu kiểm thử bắt buộc

Ngoài toàn bộ điều kiện nghiệm thu T0–T6 trong `Giao việc cho agent.md`, tối thiểu phải có:

- Unit test chính xác toàn bộ bảng snapshot A, B, C và các case D.
- Test comparator ID gồm ID số (`"2"` trước `"10"`) và ID chuỗi.
- Test cạnh 0, predecessor hòa, path không lặp, graph không liên thông và target `null`.
- Property/random test 200 graph nhỏ đối chiếu khoảng cách với Bellman-Ford; seed phải cố định để test tái lập.
- Test validation cho mọi kiểu cạnh trùng ở directed/undirected, ID trùng, endpoint thiếu, số không hữu hạn và giới hạn kích thước.
- Reducer test cho undo/redo, xóa node kéo theo cạnh, đổi directed và transaction import/preset.
- Test nguồn/đích trùng bị từ chối ở validation, reducer và import; graph một node chạy được với `target = null`.
- Serialize round-trip giữ nguyên graph, layout, source, target và edge ID; preset thiếu edge ID vẫn import được.
- Component/E2E test không phụ thuộc animation timing tùy tiện; ưu tiên trạng thái/role/text/test-id ổn định.
- Playwright ít nhất gồm: chỉnh sửa graph; chạy preset A và kiểm snapshot 5, 7, 11; bật/tắt bảng; điều hướng lùi/tới; import/export; mobile drawer; desktop 1280×800 và mobile 360×740, 390×844, 430×932, 620×870; không có horizontal page overflow.
- Playwright kiểm thêm initial 0 node/no overlay, Thêm ví dụ nạp sáu node, replay cuối→0, không ∞/t nhưng có s, selectors thoáng, bảng trước diễn giải, không heading Giải thích bước, có khởi tạo/từng bước/truy vết; cùng splitter, anchor, dark mode, chỉnh sửa, import/export và responsive.
- Playwright import graph có ID khác label, rồi xác nhận cả ba vùng panel chỉ dùng label; bảng không có button/click navigation và bấm một hàng không đổi snapshot.
- Playwright kiểm handle luôn ẩn; mode Nối cạnh tạo cạnh bằng hai click; thanh cạnh −/sửa/+/xóa; Shift multi-delete; bảng không sticky ngang và tự cuộn trong zone; fullscreen vào/thoát; Space không global; hướng dẫn trong menu Khác; Result không badge/trace; hai cạnh đối hướng tách làn/nhãn; thùng rác mobile luôn nằm trong viewport.
- Playwright tại 390×844 đo bounding box để bảo đảm hướng dẫn không giao toolbar/selectors/zoom, hai select ≥120px, thùng rác cách mép trong bên phải ≤12px và trang không tràn ngang.
- Playwright tại 390×640 buộc body hướng dẫn cuộn, xác nhận header không đổi tọa độ, nội dung desktop bị ẩn và bốn cạnh nút xóa đều có border 1px.
- Playwright tại step giữa xác nhận panel đã có kết quả cuối, đủ hàng bảng và truy vết. Tại ba viewport mobile xác nhận toolbar đóng 44px/mở 82px, hàng chính phân bố kín, tầng dưới cuộn ngang, runbar 48px, progress không bị cắt, speed chỉ hiện hệ số, Kết quả/Hướng dẫn không giao nhau và panel mở chiếm toàn vùng khả dụng; đồ thị vô hướng chỉ có một đường/nhãn và không mũi tên.
- Accessibility cơ bản: semantic button/label, focus visible, keyboard, tên truy cập rõ ràng, trạng thái không chỉ dựa vào màu và tôn trọng `prefers-reduced-motion`.

Nếu tiêu chí “thử với 3 người dùng thật” không thể thực hiện trong môi trường agent, không được tuyên bố đã đạt. Ghi rõ đây là bước nghiệm thu thủ công còn lại và cung cấp checklist ngắn để người dùng thực hiện.

## 8. Definition of Done

Chỉ báo hoàn thành khi đã chạy và thành công:

```text
npm install
npm run lint
npm run test
npm run build
npm run e2e
```

Nếu Playwright thiếu browser binary hoặc môi trường không cho chạy browser, hãy thử cách cài/chạy hợp lệ trong phạm vi được phép. Nếu vẫn bị chặn bởi môi trường, báo chính xác lệnh, lỗi và phần nào chưa được xác minh; không gọi là “đã pass”.

Ngoài ra phải bảo đảm:

- Không còn TypeScript error, lint error, `console.log`, code chết hoặc TODO không có người nhận.
- Không sửa số liệu preset chuẩn.
- Không có runtime network request.
- Giao diện đúng token/wireframe, không dùng thư viện icon, SVG nội tuyến có tên truy cập và không cuộn ngang toàn trang.
- Giao diện light/dark bám ảnh tham chiếu; không startup/empty overlay; canvas trống mặc định; bảng không có vùng cuộn riêng.
- README mô tả cách cài/chạy/test, kiến trúc, schema JSON, cách thêm preset và các phím tắt.

## 9. Cách làm việc và báo cáo cuối

- Chủ động kiểm tra repo và triển khai; không dừng để hỏi những chi tiết đã được khóa trong prompt này.
- Nếu gặp thiếu sót nhỏ, chọn giải pháp đơn giản, nhất quán với mục tiêu giảng dạy và ghi lại trong báo cáo.
- Chỉ hỏi người dùng khi quyết định có thể làm thay đổi đáng kể phạm vi, mất dữ liệu, cần credential/quyền ngoài repo hoặc tài liệu mâu thuẫn mà prompt này chưa giải quyết được.
- Không chỉ mô tả code cần viết: hãy thực sự sửa file và chạy kiểm tra.

Báo cáo cuối theo đúng cấu trúc:

```text
Đã làm
- ...

Đã kiểm tra
- npm run lint: pass/fail
- npm run test: pass/fail (số test)
- npm run build: pass/fail
- npm run e2e: pass/fail (số test)

Chưa làm / nghiệm thu thủ công còn lại
- ...

Quyết định kỹ thuật đáng chú ý
- ...

Cần hỏi
- Không / ...
```

