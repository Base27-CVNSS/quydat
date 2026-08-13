# ⚠️ Kiểm soát chất lượng dữ liệu

## Quy tắc chuẩn

Bộ dữ liệu lấy **62 cơ sở** làm mẫu số chuẩn vì phần phân nhóm chi tiết của phương án xác định:

- 8 cơ sở đã tiếp nhận;
- 25 cơ sở đã khảo sát nhưng chưa hoàn thành tiếp nhận;
- 29 cơ sở chủ tài sản chưa liên hệ bàn giao.

Tổng: **8 + 25 + 29 = 62**.

Mọi sai lệch giữa các nguồn được lưu thành cờ chất lượng, không “sửa cho khớp” bằng suy đoán.

## Danh mục vấn đề cần xác nhận

### DQ-001 · Sai lệch phép cộng

Phần tổng quan ghi “đã tiếp nhận 08/62, còn lại 55”. Nếu tổng là 62 và đã tiếp nhận 8 thì phần còn lại phải là **54**. Dataset không dùng số 55 để tạo bản ghi.

### DQ-002 · Tổng diện tích 14.582,5 m²

Phần đấu giá nêu 8 cơ sở với tổng diện tích đất **14.582,5 m²**. Khi đối chiếu danh mục khai thác, con số này đúng bằng tổng 7 cơ sở nếu không tính Huyện đội thị xã Bình Minh (cũ).

Huyện đội thị xã Bình Minh vẫn xuất hiện trong Phụ lục 4 và 5 với diện tích **3.928,2 m²**. Vì vậy tổng 14.582,5 m² cần được cơ quan nghiệp vụ xác nhận lại.

### DQ-003 · Huyện đội thị xã Bình Minh

- Hồ sơ tổng hợp dùng để biên soạn: **4.568,8 m²**.
- Phụ lục 4/5: **3.928,2 m²**.

Dataset giữ 4.568,8 m² ở `land_area_m2`, đồng thời giữ 3.928,2 m² ở `plans[].plan_area_m2`, kèm cờ `AREA_PLAN_CONFLICT`/`PLAN_AREA_CONFLICT`.

### DQ-004 · Trung tâm CNTT-TT

- Phụ lục 2: **1.226,0 m²**.
- Phụ lục 4/5: **1.218,5 m²**.

Không tự chọn một số để thay thế số còn lại. Hai giá trị được lưu ở hai trường riêng.

### DQ-005 · Kế hoạch khai thác trước khi hoàn tất tiếp nhận

Trung tâm Công nghệ Thông tin và Truyền thông thuộc Sở Thông tin và Truyền thông cũ nằm trong nhóm **đã khảo sát nhưng chưa hoàn thành tiếp nhận**, nhưng đồng thời xuất hiện trong Phụ lục 4 (cho thuê ngắn hạn) và Phụ lục 5 (kêu gọi đầu tư).

Dashboard gắn cờ `PLAN_BEFORE_RECEIPT`. Cờ này không khẳng định phụ lục sai; nó yêu cầu làm rõ đây là phương án **dự kiến sau tiếp nhận** hay trường hợp có căn cứ triển khai trước.

### DQ-006 · Trạng thái nguồn cũ và Phương án 2026

Một số cơ sở trong bảng tổng hợp chi tiết cũ chưa thể hiện trạng thái đã tiếp nhận, nhưng Phương án 2026 liệt kê trong nhóm 8 cơ sở đã tiếp nhận. Dataset ưu tiên trạng thái mới hơn của Phương án 2026 và giữ cờ `STATUS_SOURCE_CONFLICT` để truy vết.

## Quy trình xử lý khi có văn bản xác nhận mới

1. Lưu văn bản nguồn mới và tính SHA-256.
2. Cập nhật `data/source-manifest.json`.
3. Chỉ sửa trường được văn bản mới xác nhận.
4. Giữ giá trị nguồn cũ trong lịch sử Git/commit; không xóa lịch sử.
5. Bỏ hoặc đổi `quality_flags` khi mâu thuẫn đã được giải quyết.
6. Chạy `python scripts/validate_data.py` trước khi merge/deploy.
7. Tăng `schema_version` chỉ khi cấu trúc/ý nghĩa trường thay đổi.

## Giới hạn sử dụng

Dashboard là lớp **truy vấn và kiểm soát dữ liệu**. Những trường đang có cờ cảnh báo không nên được dùng làm căn cứ duy nhất cho quyết định hành chính, đấu giá, định giá hoặc ký hợp đồng trước khi được cơ quan có thẩm quyền xác nhận.
