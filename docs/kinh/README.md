# Hướng dẫn thêm nội dung kinh

Tài liệu này dành cho người đóng góp nội dung. File không được xuất bản lên site.

## Thêm một bộ kinh mới

1. Tạo thư mục `docs/kinh/{slug}/` (ví dụ `kinh/truong-bo/`).
2. Thêm `meta.json`:

```json
{
  "id": "truong-bo",
  "title": "Kinh Trường Bộ",
  "pali": "Dīgha Nikāya",
  "tagline": "Trường Bộ",
  "hue": 0,
  "description": "Mô tả ngắn về bộ kinh...",
  "translations": [
    {
      "id": "thich-minh-chau",
      "label": "Thích Minh Châu",
      "lang": "vi",
      "desc": "Mô tả bản dịch..."
    }
  ]
}
```

3. Tạo `index.md` với frontmatter `layout: book`.

## Thêm bản dịch

1. Tạo thư mục `docs/kinh/{slug}/{trans-id}/`.
2. Tạo `index.md` với frontmatter:

```yaml
---
layout: toc
translation: thich-minh-chau
book: truong-bo
label: Thích Minh Châu
lang: vi
---
```

## Thêm bài kinh

Tạo file `.md` trong thư mục bản dịch, ví dụ `dnc-1-kinh-pham-vong.md`:

```yaml
---
code: "DNC 1"
title: "Kinh Phạm Võng"
pali: "Brahmajāla Sutta"
group: "Giới uẩn phẩm (Sīlakkhandhavagga)"
translation: thich-minh-chau
book: truong-bo
description: "Mô tả ngắn..."
draft: true
---

Nội dung bài kinh viết bằng Markdown.
```

- Để trống phần thân hoặc đặt `draft: true` nếu chưa có nội dung — trang sẽ hiện *Nội dung đang được biên soạn*.
- Sau khi thêm file, chạy `npm run docs:dev` để data loader cập nhật mục lục và tìm kiếm.
