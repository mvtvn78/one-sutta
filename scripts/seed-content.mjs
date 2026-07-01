import fs from 'node:fs'
import path from 'node:path'

const root = path.join('docs', 'kinh')

const books = {
  'truong-bo': {
    suttas: [
      { file: 'dnc-1-kinh-pham-vong', code: 'DNC 1', title: 'Kinh Phạm Võng', pali: 'Brahmajāla Sutta', group: 'Giới uẩn phẩm (Sīlakkhandhavagga)', desc: 'Bài kinh mở đầu, trình bày 62 loại tà kiến và nền tảng giới hạnh của bậc Thánh.' },
      { file: 'dnc-2-kinh-sa-mon-qua', code: 'DNC 2', title: 'Kinh Sa Môn Quả', pali: 'Sāmaññaphala Sutta', group: 'Giới uẩn phẩm (Sīlakkhandhavagga)', desc: 'Vua A-xà-thế hỏi Đức Phật về quả báo thiết thực của đời sống Sa-môn.' },
      { file: 'dnc-3-kinh-ambattha', code: 'DNC 3', title: 'Kinh Ambattha', pali: 'Ambaṭṭha Sutta', group: 'Giới uẩn phẩm (Sīlakkhandhavagga)', desc: 'Đối thoại về giai cấp và dòng dõi giữa Đức Phật và thanh niên Bà-la-môn Ambattha.' },
      { file: 'dnc-4-kinh-sonadanda', code: 'DNC 4', title: 'Kinh Sonadanda (Chủng Đức)', pali: 'Soṇadaṇḍa Sutta', group: 'Giới uẩn phẩm (Sīlakkhandhavagga)', desc: 'Bàn về những phẩm chất đích thực làm nên một Bà-la-môn chân chính.' },
      { file: 'dnc-5-kinh-kutadanta', code: 'DNC 5', title: 'Kinh Kùtadanta (Cứu-la-đàn-đầu)', pali: 'Kūṭadanta Sutta', group: 'Giới uẩn phẩm (Sīlakkhandhavagga)', desc: 'Đức Phật giảng về tế đàn không sát sinh, thay thế bằng bố thí và trì giới.' },
      { file: 'dnc-14-kinh-dai-bon', code: 'DNC 14', title: 'Kinh Đại Bổn', pali: 'Mahāpadāna Sutta', group: 'Đại phẩm (Mahāvagga)', desc: 'Lịch sử bảy vị Phật quá khứ và cuộc đời của các Ngài.' },
      { file: 'dnc-16-kinh-dai-bat-niet-ban', code: 'DNC 16', title: 'Kinh Đại Bát Niết Bàn', pali: 'Mahāparinibbāna Sutta', group: 'Đại phẩm (Mahāvagga)', desc: 'Những ngày tháng cuối cùng và sự nhập diệt của Đức Phật.', content: true },
    ],
    trans: ['pali-viet', 'thich-minh-chau', 'sujato-vi', 'sujato-en'],
  },
  'trung-bo': {
    suttas: [
      { file: 'mn-1-kinh-phap-mon-can-ban', code: 'MN 1', title: 'Kinh Pháp Môn Căn Bản', pali: 'Mūlapariyāya Sutta', group: 'Căn bản pháp môn', desc: 'Phân tích cách phàm phu, bậc hữu học, A-la-hán và Như Lai nhận thức về các pháp.', content: true },
      { file: 'mn-2-kinh-tat-ca-cac-lau-hoc', code: 'MN 2', title: 'Kinh Tất Cả Các Lậu Hoặc', pali: 'Sabbāsava Sutta', group: 'Căn bản pháp môn', desc: 'Bảy phương pháp đoạn trừ các lậu hoặc để đạt giải thoát.' },
      { file: 'mn-10-kinh-niem-xu', code: 'MN 10', title: 'Kinh Niệm Xứ', pali: 'Satipaṭṭhāna Sutta', group: 'Căn bản pháp môn', desc: 'Bốn nền tảng chánh niệm: thân, thọ, tâm, pháp — trọng tâm của thiền Vipassanā.' },
      { file: 'mn-26-kinh-thanh-cau', code: 'MN 26', title: 'Kinh Thánh Cầu', pali: 'Ariyapariyesanā Sutta', group: 'Chánh cầu & thiền quán', desc: 'Đức Phật kể lại hành trình xuất gia tầm đạo và chứng ngộ của chính Ngài.' },
      { file: 'mn-118-kinh-quan-niem-hoi-tho', code: 'MN 118', title: 'Kinh Quán Niệm Hơi Thở', pali: 'Ānāpānasati Sutta', group: 'Chánh cầu & thiền quán', desc: 'Mười sáu bước thực hành quán niệm hơi thở dẫn đến giác ngộ.' },
    ],
    trans: ['thich-minh-chau', 'bodhi-en', 'sujato-vi'],
  },
  'tuong-ung-bo': {
    suttas: [
      { file: 'sn-12-2-kinh-phan-biet', code: 'SN 12.2', title: 'Kinh Phân Biệt', pali: 'Vibhaṅga Sutta', group: 'Nhân duyên tương ưng', desc: 'Định nghĩa chi tiết mười hai chi phần trong giáo lý Duyên khởi.' },
      { file: 'sn-22-59-kinh-vo-nga-tuong', code: 'SN 22.59', title: 'Kinh Vô Ngã Tướng', pali: 'Anattalakkhaṇa Sutta', group: 'Nhân duyên tương ưng', desc: 'Bài pháp thứ hai của Đức Phật, giảng về đặc tính vô ngã của năm uẩn.' },
      { file: 'sn-45-8-kinh-phan-tich', code: 'SN 45.8', title: 'Kinh Phân Tích', pali: 'Vibhaṅga Sutta (Magga)', group: 'Đạo tương ưng', desc: 'Phân tích chi tiết tám chi phần của Bát Chánh Đạo.' },
      { file: 'sn-56-11-kinh-chuyen-phap-luan', code: 'SN 56.11', title: 'Kinh Chuyển Pháp Luân', pali: 'Dhammacakkappavattana Sutta', group: 'Đạo tương ưng', desc: 'Bài pháp đầu tiên của Đức Phật tại vườn Lộc Uyển, trình bày Tứ Diệu Đế.' },
    ],
    trans: ['thich-minh-chau', 'bodhi-en'],
  },
  'tang-chi-bo': {
    suttas: [
      { file: 'an-4-55-kinh-doi-song-gia-dinh', code: 'AN 4.55', title: 'Kinh Đời Sống Gia Đình', pali: 'Samajīvinā Sutta', group: 'Chương Bốn pháp – Năm pháp', desc: 'Bốn điều kiện để vợ chồng sống hạnh phúc, hòa hợp trong đời sống tại gia.' },
      { file: 'an-5-57-kinh-can-phai-quan-sat', code: 'AN 5.57', title: 'Kinh Cần Phải Quán Sát', pali: 'Ṭhāna Sutta', group: 'Chương Bốn pháp – Năm pháp', desc: 'Năm điều mọi người nên thường xuyên quán tưởng: già, bệnh, chết, ly biệt, nghiệp.' },
      { file: 'an-8-6-kinh-bat-phong', code: 'AN 8.6', title: 'Kinh Bát Phong', pali: 'Lokavipatti Sutta', group: 'Chương Tám pháp – Mười pháp', desc: 'Tám ngọn gió đời: được – mất, danh – nhục, khen – chê, vui – khổ.' },
      { file: 'an-10-176-kinh-thap-thien-nghiep', code: 'AN 10.176', title: 'Kinh Thập Thiện Nghiệp', pali: 'Cunda Sutta', group: 'Chương Tám pháp – Mười pháp', desc: 'Mười nghiệp bất thiện và thiện về thân, khẩu, ý cần tránh và nên tu tập.' },
    ],
    trans: ['thich-minh-chau', 'bodhi-en'],
  },
  'tieu-bo': {
    suttas: [
      { file: 'dhp-1-kinh-phap-cu', code: 'Pc. 1', title: 'Kinh Pháp Cú — Phẩm Song Yếu', pali: 'Dhammapada — Yamakavagga', group: 'Thi kệ & giáo huấn', desc: '20 câu kệ mở đầu nổi tiếng về nhân quả của tâm ý.' },
      { file: 'sn-metta-kinh-tu-bi', code: 'Kt.', title: 'Kinh Từ Bi', pali: 'Metta Sutta (Sutta Nipāta)', group: 'Thi kệ & giáo huấn', desc: 'Bài kinh về việc tu tập tâm từ đến muôn loài chúng sinh.' },
      { file: 'thag-1-truong-lao-tang-ke', code: 'Trlk.', title: 'Trưởng Lão Tăng Kệ (chọn lọc)', pali: 'Theragāthā', group: 'Truyện & Trưởng lão kệ', desc: 'Những vần kệ chứng đạo của các vị Trưởng lão đệ tử Đức Phật.' },
      { file: 'jat-1-bon-sanh', code: 'BS. 1', title: 'Bổn Sanh — Chuyện Tiền Thân số 1', pali: 'Jātaka 1: Apaṇṇaka', group: 'Truyện & Trưởng lão kệ', desc: 'Câu chuyện tiền thân đầu tiên trong 547 chuyện Bổn Sanh.' },
    ],
    trans: ['thich-minh-chau', 'indacanda'],
  },
}

const dnc16Body = `*Như vầy tôi nghe. Trong những ngày tháng cuối cùng trước khi nhập Niết-bàn, Thế Tôn cùng đại chúng Tỳ-kheo du hành qua nhiều xứ, dừng chân giảng pháp tại từng nơi.*

> "Này các Tỷ-kheo, hãy tự mình là ngọn đèn cho chính mình, hãy tự mình nương tựa nơi chính mình, chớ nương tựa một nơi nào khác."
>
> — Kinh Đại Bát Niết-bàn

Đây là một trong những lời dạy sau cùng được lưu truyền rộng rãi nhất của Đức Phật, nhấn mạnh tinh thần tự lực và chánh niệm trên con đường tu tập. Toàn văn bài kinh đang được tiếp tục biên soạn và bổ sung.`

const mn1Body = `*Như vầy tôi nghe.*

Một thời Thế Tôn trú tại (tụ lạc) Ukkattha, trong rừng Subhaga (rừng Hạnh phúc), dưới gốc cây Sa-la vương. Tại chỗ ấy, Thế Tôn gọi các Tỳ-kheo: "Này các Tỳ-kheo!". – "Bạch Thế Tôn", những Tỳ-kheo ấy vâng đáp Thế Tôn. Thế Tôn nói: "Này các Tỳ-kheo. Ta sẽ giảng cho các ngươi 'Pháp môn căn bản tất cả pháp'. Hãy nghe và khéo tác ý, Ta sẽ nói". – "Thưa vâng, bạch Thế Tôn", những Tỳ-kheo ấy vâng đáp Thế Tôn. Thế Tôn nói như sau:

## (Phàm phu)

– Này các Tỳ-kheo, ở đây, có kẻ phàm phu ít nghe, không được thấy các bậc Thánh, không thuần thục pháp các bậc Thánh, không tu tập pháp các bậc Thánh, không được thấy các bậc Chơn nhân, không thuần thục pháp các bậc Chơn nhân, không tu tập pháp các bậc Chơn nhân, tưởng tri địa đại là địa đại. Vì tưởng tri địa đại là địa đại, người ấy nghĩ đến địa đại, nghĩ đến (tự ngã) đối chiếu với địa đại, nghĩ đến (tự ngã) như là địa đại, người ấy nghĩ: "Địa đại là của ta" – dục hỷ địa đại. Vì sao vậy? Ta nói người ấy không liễu tri địa đại.

Người ấy tưởng tri thủy đại là thủy đại... hỏa đại là hỏa đại... phong đại là phong đại. Vì tưởng tri như vậy, người ấy nghĩ: "...đại là của ta" – dục hỷ các đại ấy. Vì sao vậy? Ta nói người ấy không liễu tri các đại ấy.

> Hệ thống chuyển đổi từ các đại sang các cõi trời, các tầng thiền và cuối cùng là Niết-bàn, cho thấy sự chấp thủ sâu sắc của hạng phàm phu.

## (Vị hữu học)

Này các Tỳ-kheo, có Tỳ-kheo, hữu học tâm chưa thành tựu, đang sống cần cầu vô thượng an ổn khỏi khổ ách. Vị ấy thắng tri địa đại là địa đại. Vì thắng tri địa đại là địa đại, vị ấy đã không nghĩ đến địa đại, đã không nghĩ (tự ngã) đối chiếu với địa đại, đã không nghĩ: "Địa đại là của ta" – không dục hỷ địa đại. Vì sao vậy? Ta nói vị ấy có thể liễu tri địa đại.

Vị ấy thắng tri Niết-bàn là Niết-bàn; vì thắng tri Niết-bàn là Niết-bàn, vị ấy đã không nghĩ: "Niết-bàn là của ta" – không dục hỷ Niết-bàn. Vì sao vậy? Ta nói vị ấy có thể liễu tri Niết-bàn.

## (Bậc A-la-hán)

Lại nữa, này các Tỳ-kheo, có Tỳ-kheo là bậc A-la-hán, các lậu hoặc đã tận, tu hành thành mãn, các việc nên làm đã làm, đã đặt gánh nặng xuống, đã thành đạt tự lợi, đã tận trừ hữu kiết sử, chánh trí giải thoát. Vị ấy thắng tri địa đại là địa đại, không nghĩ: "Địa đại là của ta" – không dục hỷ địa đại. Vì sao vậy? Ta nói vị ấy đã liễu tri địa đại.

…

## (Đấng Như Lai)

Này các Tỳ-kheo, Như Lai là bậc A-la-hán, Chánh Đẳng Giác, thắng tri địa đại là địa đại. Vì thắng tri địa đại là địa đại, Như Lai không nghĩ: "Địa đại là của ta" – không dục hỷ địa đại. Vì sao vậy? Ta nói vì Như Lai đã liễu tri địa đại từ lâu.

Thế Tôn thuyết giảng như vậy. Các Tỳ-kheo ấy hoan hỷ tín thọ lời dạy của Thế Tôn.`

function fm(book, trans, s, draft = true) {
  return `---
code: "${s.code}"
title: "${s.title}"
pali: "${s.pali}"
group: "${s.group}"
translation: ${trans}
book: ${book}
description: "${s.desc}"
${draft && !s.content ? 'draft: true\n' : ''}---
`
}

for (const [bookId, cfg] of Object.entries(books)) {
  const bookDir = path.join(root, bookId)
  fs.mkdirSync(bookDir, { recursive: true })
  fs.writeFileSync(
    path.join(bookDir, 'index.md'),
    `---\nlayout: book\nbook: ${bookId}\n---\n`
  )

  for (const trans of cfg.trans) {
    const transDir = path.join(bookDir, trans)
    fs.mkdirSync(transDir, { recursive: true })
    fs.writeFileSync(
      path.join(transDir, 'index.md'),
      `---\nlayout: toc\ntranslation: ${trans}\nbook: ${bookId}\n---\n`
    )

    if (trans !== 'thich-minh-chau') continue

    for (const s of cfg.suttas) {
      let body = ''
      if (s.content && s.file === 'dnc-16-kinh-dai-bat-niet-ban') body = '\n' + dnc16Body
      if (s.content && s.file === 'mn-1-kinh-phap-mon-can-ban') body = '\n' + mn1Body
      fs.writeFileSync(
        path.join(transDir, `${s.file}.md`),
        fm(bookId, trans, s, !s.content) + body
      )
    }
  }
}

console.log('Seed content generated.')
