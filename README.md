# 🏛️ Quỹ đất 2026 — Dashboard quản lý, khai thác cơ sở nhà, đất

> **Kho dữ liệu sạch + dashboard tĩnh** phục vụ truy vấn, thống kê, theo dõi và giám sát công tác quản lý, khai thác các cơ sở nhà, đất năm 2026 của Trung tâm Phát triển quỹ đất tỉnh Vĩnh Long.

![Data](https://img.shields.io/badge/data-62_cơ_sở-0f766e)
![Received](https://img.shields.io/badge/đã_tiếp_nhận-8-15803d)
![Surveyed](https://img.shields.io/badge/đã_khảo_sát_chưa_tiếp_nhận-25-b45309)
![Pending](https://img.shields.io/badge/chưa_liên_hệ_bàn_giao-29-b91c1c)
![Schema](https://img.shields.io/badge/schema-1.1.0-0369a1)
![License](https://img.shields.io/badge/code-MIT-blue)

## 🎯 Mục tiêu

Repository được thiết kế lại theo hướng **data-first**: không dùng các bảng Excel rời làm lớp truy vấn trực tiếp, mà chuẩn hóa thành các bản ghi có ID ổn định, có dấu vết nguồn và có cờ chất lượng.

Mỗi cơ sở có thể theo dõi:

- trạng thái bàn giao/tiếp nhận;
- số và ngày quyết định;
- diện tích đất, diện tích nhà;
- nguyên giá, giá trị còn lại khi nguồn có dữ liệu;
- đơn vị bàn giao;
- phương án cho thuê ngắn hạn/kêu gọi đầu tư;
- chênh lệch diện tích giữa hồ sơ và phụ lục khai thác;
- cảnh báo cần xác minh nghiệp vụ.

Dashboard chạy bằng **HTML + CSS + JavaScript thuần**, không framework, không CDN, không backend. Dữ liệu nằm trong JSON có thể mở bằng Excel/Power BI/Python hoặc tái sử dụng cho hệ thống khác.

## 📊 Mẫu số chuẩn

| Nhóm trạng thái | Số cơ sở | Tỷ trọng |
|---|---:|---:|
| ✅ Đã tiếp nhận | 8 | 12,9% |
| 🟠 Đã khảo sát, chưa tiếp nhận | 25 | 40,3% |
| 🔴 Chưa liên hệ bàn giao | 29 | 46,8% |
| **Tổng** | **62** | **100%** |

Ngoài ra dữ liệu hiện liên kết **9 cơ sở** trong Phụ lục 4 (cho thuê ngắn hạn) và **5 cơ sở** trong Phụ lục 5 (kêu gọi đầu tư).

## 🧭 Dashboard

Dashboard hỗ trợ:

- 🔎 tìm kiếm không dấu theo tên, địa chỉ, đơn vị bàn giao, số quyết định, mã tài sản;
- 🎛️ lọc trạng thái, quyết định, phương án khai thác, chất lượng dữ liệu;
- ↕️ sắp xếp trực tiếp trên tiêu đề bảng;
- 📈 KPI và thanh tiến độ 8/25/29;
- 🧾 xem hồ sơ chi tiết từng cơ sở;
- 🏷️ đối chiếu diện tích hồ sơ với diện tích trong Phụ lục 4/5;
- ⚠️ hiển thị `quality_flags` thay vì che giấu mâu thuẫn nguồn;
- 📤 xuất CSV theo đúng bộ lọc đang xem;
- 🌙 sáng/tối và responsive desktop/mobile.

## 🗂️ Cấu trúc repository

```text
quydat/
├─ index.html
├─ style.css
├─ app.js
├─ data/
│  ├─ meta.json
│  ├─ assets-received.json        # 8 cơ sở
│  ├─ assets-surveyed.json        # 25 cơ sở
│  ├─ assets-not-contacted.json   # 29 cơ sở
│  └─ source-manifest.json        # SHA-256 của 5 tệp nguồn
├─ docs/
│  ├─ DATA_DICTIONARY.md
│  └─ DATA_QUALITY.md
├─ scripts/
│  └─ validate_data.py
├─ .github/workflows/
│  ├─ validate.yml
│  └─ pages.yml
└─ LICENSE
```

## 🧬 Quy tắc “data sạch dùng lâu dài”

1. **ID bất biến:** `asset_id` dạng `CSND-2026-001` → `CSND-2026-062`; không tái sử dụng ID.
2. **Không ghi đè mâu thuẫn:** `land_area_m2` và `plans[].plan_area_m2` là hai ngữ cảnh nguồn khác nhau.
3. **Không suy diễn:** không có dữ liệu thì để `null`, không tự điền cho đẹp bảng.
4. **Có nguồn gốc:** `source` lưu phụ lục/STT/dòng nhập; `source-manifest.json` lưu SHA-256 tệp nguồn.
5. **Mâu thuẫn phải nhìn thấy:** dùng `quality_flags` và `docs/DATA_QUALITY.md`.
6. **Kiểm tra tự động:** CI xác minh đủ 62 ID, đúng 8/25/29, đúng 9/5 phương án và không có số âm.
7. **Git là lịch sử dữ liệu:** khi có văn bản mới, sửa bằng commit mới; không xóa lịch sử để mất dấu nguồn cũ.

## ⚠️ 5 điểm dữ liệu cần ưu tiên xác nhận

- Văn bản nêu “đã tiếp nhận 08/62, còn lại 55”, trong khi 8 + 25 + 29 = 62 nên số chưa tiếp nhận theo phân nhóm là **54**.
- Tổng diện tích **14.582,5 m²** ở phần đấu giá khớp 7 cơ sở nếu không tính Huyện đội thị xã Bình Minh.
- Huyện đội thị xã Bình Minh: hồ sơ tổng hợp dùng **4.568,8 m²**, Phụ lục 4/5 dùng **3.928,2 m²**.
- Trung tâm CNTT-TT: Phụ lục 2 dùng **1.226,0 m²**, Phụ lục 4/5 dùng **1.218,5 m²**.
- Trung tâm CNTT-TT vẫn ở trạng thái đã khảo sát/chưa tiếp nhận nhưng đã xuất hiện trong Phụ lục 4 và 5.

Chi tiết và quy trình xử lý nằm tại [`docs/DATA_QUALITY.md`](docs/DATA_QUALITY.md).

## 🚀 Chạy trên máy

Do dashboard nạp JSON bằng `fetch()`, hãy chạy qua HTTP server thay vì mở `index.html` bằng `file://`:

```bash
python -m http.server 8080
```

Sau đó mở:

```text
http://localhost:8080
```

## 🌐 GitHub Pages

Repository đã có workflow `.github/workflows/pages.yml`. Nếu GitHub Pages chưa được bật, vào:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

Khi Pages được bật và workflow deploy thành công, URL dự kiến:

```text
https://base27-cvnss.github.io/quydat/
```

## ✅ Kiểm định dữ liệu

```bash
python scripts/validate_data.py
```

Kỳ vọng:

```text
OK: 62 tài sản; trạng thái 8/25/29; Phụ lục 4 = 9; Phụ lục 5 = 5; ID duy nhất; số liệu không âm.
```

## 🔄 Quy trình cập nhật dữ liệu mới

```text
Văn bản/Excel mới
      ↓
Đối chiếu asset_id hiện có
      ↓
Cập nhật đúng trường được xác nhận
      ↓
Bổ sung SHA-256 vào source-manifest
      ↓
Xử lý/giữ lại quality_flags
      ↓
python scripts/validate_data.py
      ↓
Commit → CI → GitHub Pages
```

Không tạo ID mới chỉ vì đổi tên cơ quan hoặc đổi địa chỉ hành chính nếu vẫn là cùng một cơ sở vật lý. Chỉ tạo ID mới khi xác định đó là một tài sản/cơ sở độc lập mới trong nghiệp vụ.

## 📚 Nguồn biên soạn hiện tại

Bộ dữ liệu được biên soạn ngày **13/08/2026** từ 5 tệp nguồn:

- Phương án quản lý, khai thác các cơ sở nhà, đất năm 2026;
- Phụ lục 2 — đã khảo sát nhưng chưa tiếp nhận;
- Phụ lục 3 — đơn vị bàn giao tài sản chưa liên hệ bàn giao;
- Phụ lục 4 — các thửa đất cho thuê ngắn hạn;
- Phụ lục 5 — các thửa đất kêu gọi đầu tư thực hiện dự án.

Dấu vân tay SHA-256 nằm tại [`data/source-manifest.json`](data/source-manifest.json).

## 📄 Giấy phép

Mã nguồn dashboard và script kiểm tra phát hành theo **MIT License**. Dữ liệu hành chính/tài sản vẫn phải được sử dụng theo quy định, thẩm quyền và chế độ pháp lý áp dụng cho dữ liệu nguồn; MIT License của phần mềm không làm thay đổi chế độ pháp lý đó.
