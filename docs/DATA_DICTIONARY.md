# 📘 Từ điển dữ liệu Quỹ đất 2026

Bộ dữ liệu được tách theo trạng thái để dễ kiểm soát phiên bản và hạn chế một tệp JSON quá lớn:

- `data/assets-received.json`: 8 cơ sở đã tiếp nhận.
- `data/assets-surveyed.json`: 25 cơ sở đã khảo sát nhưng chưa hoàn thành tiếp nhận.
- `data/assets-not-contacted.json`: 29 cơ sở chủ tài sản chưa liên hệ/chưa mời khảo sát bàn giao.
- `data/meta.json`: phiên bản schema, nhãn trạng thái, số lượng chuẩn và định nghĩa cờ chất lượng.
- `data/source-manifest.json`: SHA-256 của 5 tệp nguồn dùng để biên soạn.

## Trường cấp tài sản

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `asset_id` | string | Khóa chính ổn định, dạng `CSND-2026-001`; không tái sử dụng |
| `name` | string | Tên cơ sở nhà, đất theo nguồn |
| `address` | string/null | Địa chỉ có thể xác định từ nguồn |
| `status` | enum | `received`, `surveyed_not_received`, `not_contacted` |
| `decision_no` | string/null | Số quyết định liên quan |
| `decision_date` | string/null | Ngày quyết định theo nguồn |
| `land_area_m2` | number/null | Diện tích đất trong hồ sơ trạng thái |
| `building_area_m2` | number/null | Diện tích nhà/công trình khi nguồn có số liệu |
| `original_value_vnd` | number/null | Nguyên giá theo nguồn, đơn vị VND |
| `residual_value_vnd` | number/null | Giá trị còn lại theo nguồn, đơn vị VND |
| `handover_unit` | string/null | Đơn vị/chủ tài sản bàn giao |
| `plans` | array | Liên kết Phụ lục 4/5 về phương án khai thác |
| `quality_flags` | array | Cảnh báo chất lượng cần kiểm tra nghiệp vụ |
| `source` | object | Dấu vết phụ lục, STT và dòng nguồn dùng khi nhập liệu |

`status_label` và diễn giải tiến độ được dashboard suy ra từ `data/meta.json`; không lặp trong từng bản ghi để giảm nguy cơ lệch nhãn.

## Trường `plans[]`

| Trường | Ý nghĩa |
|---|---|
| `mode` | `short_term_lease` hoặc `investment_call` |
| `mode_label` | Nhãn tiếng Việt |
| `appendix` | 4 hoặc 5 |
| `appendix_stt` | STT trong phụ lục |
| `plan_area_m2` | Diện tích ghi riêng trong phụ lục khai thác |
| `plan_address` | Địa chỉ trong phụ lục khai thác |
| `note` | Ghi chú/phương hướng thực hiện nếu nguồn có |

## Quy tắc quan trọng

**Không ghi đè `land_area_m2` bằng `plans[].plan_area_m2`.** Hai số liệu thuộc hai ngữ cảnh nguồn khác nhau và có thể mâu thuẫn. Chênh lệch phải được giữ lại, gắn `quality_flags` và xác minh bằng văn bản nghiệp vụ mới.

## Cờ chất lượng hiện dùng

| Cờ | Ý nghĩa |
|---|---|
| `STATUS_SOURCE_CONFLICT` | Trạng thái trong nguồn tổng hợp cũ khác trạng thái cập nhật của Phương án 2026 |
| `AREA_PLAN_CONFLICT` | Diện tích hồ sơ khác diện tích dùng trong phụ lục khai thác |
| `PARTIAL_DETAIL_SOURCE` | Chỉ có dữ liệu cơ bản; một số trường chi tiết chưa tìm thấy trong nguồn được cung cấp |
| `PLAN_BEFORE_RECEIPT` | Có tên trong phụ lục khai thác nhưng trạng thái vẫn chưa hoàn thành tiếp nhận |
| `PLAN_AREA_CONFLICT` | `plan_area_m2` khác `land_area_m2` |

## Phiên bản hóa

- Thay đổi giá trị dữ liệu nhưng không đổi cấu trúc: giữ schema, cập nhật commit và manifest nguồn.
- Thêm/xóa/đổi ý nghĩa trường: tăng `schema_version` trong `data/meta.json`.
- Không xóa dấu vết mâu thuẫn đã từng tồn tại; giải quyết bằng nguồn mới và commit có mô tả rõ ràng.
