# 🏛️ Quỹ đất 2026 — Dashboard quản lý, khai thác cơ sở nhà, đất

> **Kho dữ liệu sạch + dashboard tĩnh** phục vụ truy vấn, thống kê, theo dõi và giám sát công tác quản lý, khai thác các cơ sở nhà, đất năm 2026 của Trung tâm Phát triển quỹ đất tỉnh Vĩnh Long.

![Data](https://img.shields.io/badge/data-62_cơ_sở-0f766e)
![Status](https://img.shields.io/badge/đã_tiếp_nhận-8-15803d)
![Surveyed](https://img.shields.io/badge/đã_khảo_sát_chưa_tiếp_nhận-25-b45309)
![Pending](https://img.shields.io/badge/chưa_liên_hệ_bàn_giao-29-b91c1c)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Mục tiêu

Repository này không chỉ lưu các bảng Excel rời. Dữ liệu được tái cấu trúc thành **một bộ dữ liệu chuẩn có mã định danh ổn định**, tách rõ:

- **trạng thái tiếp nhận**;
- **quyết định giao/thu hồi**;
- **diện tích đất, diện tích nhà**;
- **nguyên giá, giá trị còn lại**;
- **đơn vị bàn giao**;
- **phương án khai thác**;
- **cảnh báo chất lượng dữ liệu và xung đột giữa nguồn**.

Dashboard hoạt động thuần HTML/CSS/JavaScript, không framework, không CDN và không có backend nên phù hợp để lưu trữ lâu dài trên GitHub Pages.

## 📊 Số liệu chuẩn đang sử dụng

| Nhóm | Số cơ sở | Tỷ trọng |
|---|---:|---:|
| ✅ Đã tiếp nhận | 8 | 12,9% |
| 🟠 Đã khảo sát, chưa tiếp nhận | 25 | 40,3% |
| 🔴 Chưa liên hệ bàn giao | 29 | 46,8% |
| **Tổng** | **62** | **100%** |

Quy tắc chuẩn hóa ưu tiên **phân nhóm chi tiết 8 + 25 + 29 = 62**. Các sai lệch trong văn bản nguồn không bị “sửa lặng”; chúng được đưa vào `quality_flags` và tài liệu kiểm soát chất lượng.

## 🧭 Dashboard có gì?

- 🔎 Tìm kiếm toàn văn theo tên, địa chỉ, đơn vị bàn giao, mã tài sản, quyết định.
- 🎛️ Lọc theo trạng thái, quyết định, phương án khai thác và cảnh báo dữ liệu.
- 📈 KPI và thanh tiến độ tiếp nhận.
- 🧾 Xem hồ sơ chi tiết từng cơ sở.
- 🏷️ Theo dõi tài sản nằm trong Phụ lục **cho thuê ngắn hạn** hoặc **kêu gọi đầu tư**.
- ⚠️ Hiển thị mâu thuẫn nguồn thay vì che giấu.
- 📤 Xuất CSV theo bộ lọc hiện tại ngay trên trình duyệt.
- 🌙 Giao diện sáng/tối, responsive cho desktop và mobile.

## 🗂️ Cấu trúc

```text
quydat/
├─ index.html
├─ style.css
├─ app.js
├─ data/
│  ├─ assets.json          # nguồn dữ liệu chuẩn, 62 cơ sở
│  ├─ assets.js            # mirror cho dashboard tĩnh
│  ├─ assets.csv           # dùng cho Excel/BI
│  ├─ plans.csv            # danh mục khai thác PL4/PL5
│  ├─ plan-2026.json       # nhịp quản lý, mốc thực hiện, cảnh báo
│  └─ source-manifest.json # dấu vân tay SHA-256 của nguồn nhập
├─ docs/
│  ├─ DATA_DICTIONARY.md
│  └─ DATA_QUALITY.md
├─ scripts/
│  ├─ validate_data.py
│  └─ export_csv.py
└─ .github/workflows/
   ├─ validate.yml
   └─ pages.yml
```

## 🧬 Nguyên tắc “data sạch dùng lâu dài”

1. `asset_id` là khóa chính và **không tái sử dụng**.
2. Dữ liệu hồ sơ và dữ liệu phương án khai thác được giữ **riêng trường**, không ghi đè khi diện tích khác nhau.
3. Không suy diễn thông tin còn thiếu; trường chưa xác định để `null`.
4. Mọi xung đột nguồn phải có `quality_flags`.
5. Mỗi lần thay nguồn cần cập nhật `source-manifest.json`.
6. CI bắt buộc kiểm tra: 62 ID duy nhất, đúng cơ cấu 8/25/29, giá trị không âm và liên kết phương án hợp lệ.

## ⚠️ Các điểm cần xác nhận nghiệp vụ

Hiện dataset chủ động gắn cờ một số vấn đề:

- Văn bản nêu “đã tiếp nhận 08/62, còn lại 55”, nhưng phân nhóm chi tiết cho kết quả **54 chưa tiếp nhận**.
- Tổng diện tích **14.582,5 m²** trong phần đấu giá trùng tổng của 7 cơ sở nếu không tính Huyện đội thị xã Bình Minh.
- Huyện đội thị xã Bình Minh: hồ sơ tổng hợp cũ **4.568,8 m²**, Phụ lục 4/5 **3.928,2 m²**.
- Trung tâm CNTT-TT: Phụ lục 2 **1.226,0 m²**, Phụ lục 4/5 **1.218,5 m²**.
- Trung tâm CNTT-TT vẫn thuộc nhóm “đã khảo sát, chưa tiếp nhận” nhưng đồng thời có trong Phụ lục 4/5.

Xem chi tiết tại [`docs/DATA_QUALITY.md`](docs/DATA_QUALITY.md).

## 🚀 Chạy

Không cần cài đặt:

```bash
python -m http.server 8080
```

Mở `http://localhost:8080`.

### GitHub Pages

Workflow `.github/workflows/pages.yml` đã được chuẩn bị. Nếu Pages của repository chưa bật, vào **Settings → Pages → Source → GitHub Actions**.

Sau khi bật, địa chỉ dự kiến:

```text
https://base27-cvnss.github.io/quydat/
```

## ✅ Kiểm tra dữ liệu

```bash
python scripts/validate_data.py
```

Xuất lại CSV:

```bash
python scripts/export_csv.py
```

## 📚 Nguồn biên soạn

Bộ dữ liệu được lập từ các tài liệu người dùng cung cấp ngày 13/08/2026:

- Phương án quản lý, khai thác các cơ sở nhà, đất năm 2026.
- Phụ lục 2: đã khảo sát nhưng chưa đủ điều kiện tiếp nhận.
- Phụ lục 3: chủ tài sản chưa liên hệ bàn giao.
- Phụ lục 4: khai thác cho thuê ngắn hạn.
- Phụ lục 5: kêu gọi đầu tư thực hiện dự án.

Dấu vân tay SHA-256 của từng tệp nằm trong `data/source-manifest.json`.

## 📄 Giấy phép

Mã nguồn dashboard và các script trong repository phát hành theo **MIT License**. Dữ liệu hành chính/tài sản cần được sử dụng theo quy định và thẩm quyền của cơ quan quản lý; MIT License không làm thay đổi chế độ pháp lý của dữ liệu nguồn.
