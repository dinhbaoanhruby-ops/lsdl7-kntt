const GOOGLE_SCRIPT_URL = ""; // Dán link Web App Google Apps Script tại đây nếu muốn thu điểm về Google Sheets

const CURRICULUM = {
  lichsu: [
    {
      id: "ls1",
      chapter: "Chương 1. Tây Âu từ thế kỉ V đến nửa đầu thế kỉ XVI",
      code: "Bài 1",
      title: "Quá trình hình thành và phát triển chế độ phong kiến ở Tây Âu",
      pages: "Sách trang 8–12",
      summary: {
        overview: "Từ thế kỉ V, người Giéc-man tràn vào tiêu diệt đế quốc Rô-ma, lập nên nhiều vương quốc mới và hình thành xã hội phong kiến Tây Âu với hai giai cấp cơ bản là lãnh chúa phong kiến và nông nô.",
        facts: [
          { num: "Năm 476", desc: "Đế quốc Tây Rô-ma sụp đổ, mở đầu thời kì trung đại ở Tây Âu." },
          { num: "Thế kỉ IX", desc: "Lãnh địa phong kiến trở thành đơn vị chính trị – kinh tế cơ bản." },
          { num: "Thế kỉ XI", desc: "Thành thị trung đại xuất hiện, phá vỡ kinh tế tự nhiên." },
          { num: "2 giai cấp", desc: "Lãnh chúa phong kiến (bóc lột) và nông nô (bị bóc lột)." }
        ],
        sections: [
          {
            heading: "1. Sự hình thành xã hội phong kiến Tây Âu",
            bullets: [
              "Năm 476, người Giéc-man tiêu diệt đế quốc Tây Rô-ma, thành lập các vương quốc mới (Ăng-glô Xắc-xông, Phơ-răng...).",
              "Quý tộc Giéc-man và tăng lữ được ban cấp ruộng đất trở thành lãnh chúa phong kiến; nô lệ và nông dân mất ruộng trở thành nông nô."
            ],
            caption: "Sơ đồ tổ chức xã hội phong kiến Tây Âu (SGK trang 9)"
          },
          {
            heading: "2. Lãnh địa phong kiến và thành thị trung đại",
            bullets: [
              "Lãnh địa là khu đất rộng lớn thuộc quyền sở hữu của lãnh chúa, kinh tế tự cung tự cấp, đóng kín.",
              "Từ thế kỉ XI, thủ công nghiệp phát triển dẫn đến sự ra đời của các thành thị trung đại (thợ thủ công và thương nhân sinh sống), thúc đẩy kinh tế hàng hóa."
            ],
            caption: "Cảnh sinh hoạt trong lãnh địa và hội chợ thành thị trung đại (SGK trang 10–11)"
          }
        ]
      },
      pictureQuiz: {
        part1: [
          {
            question: "Mô tả nào đúng với 'Lãnh địa phong kiến Tây Âu'?",
            svgLabel: "🏰 Lâu đài lãnh chúa có hào sâu, tường cao bao quanh ruộng đất",
            options: ["Khu buôn bán tự do của thương nhân", "Đơn vị kinh tế tự cung tự cấp của lãnh chúa", "Xưởng sản xuất công nghiệp lớn", "Trường đại học đầu tiên ở Tây Âu"],
            answer: 1,
            explain: "Lãnh địa phong kiến là vùng đất riêng của lãnh chúa, có lâu đài kiên cố và hoạt động kinh tế tự cung tự cấp."
          }
        ],
        part2: [
          { id: "p1", label: "Lãnh địa phong kiến", hint: "Có lâu đài lãnh chúa, tường thành bao quanh, kinh tế đóng kín" },
          { id: "p2", label: "Thành thị trung đại", hint: "Nơi tập trung thợ thủ công và thương nhân buôn bán nhộn nhịp" }
        ]
      },
      quizzes: [
        {
          id: "de1",
          title: "Đề 1: Sự hình thành xã hội phong kiến Tây Âu",
          passageTitle: "Từ Rô-ma cổ đại đến lãnh địa trung đại",
          sentences: [
            "Năm 476, người Giéc-man từ phương Bắc tràn xuống tiêu diệt đế quốc Tây Rô-ma, mở đầu thời kì phong kiến ở Tây Âu.",
            "Các thủ lĩnh quân sự Giéc-man tự xưng vua, phong tước vị và chia ruộng đất chiếm được cho quý tộc và nhà thờ.",
            "Những người được ban cấp ruộng đất trở thành lãnh chúa phong kiến, nắm mọi quyền hành trong vùng đất của mình.",
            "Trong khi đó, nô lệ được giải phóng và nông dân mất ruộng đất phải nhận ruộng của lãnh chúa để cày cấy và nộp tô thuế nặng nề.",
            "Họ bị lệ thuộc chặt chẽ vào lãnh chúa và trở thành giai cấp nông nô."
          ],
          questions: [
            {
              type: "mcq",
              diff: "Dễ",
              prompt: "Đế quốc Tây Rô-ma bị người Giéc-man tiêu diệt vào năm nào?",
              options: ["Năm 476", "Năm 1010", "Năm 1492", "Năm 1831"],
              answer: 0,
              evidenceIdx: 0,
              wrongReasons: [
                "",
                "Năm 1010 là mốc lịch sử ở Việt Nam, không phải Tây Âu.",
                "Năm 1492 là năm Cô-lôm-bô tìm ra châu Mĩ.",
                "Năm 1831 không thuộc thời kì hình thành phong kiến Tây Âu."
              ],
              explain: "Câu đầu tiên của đoạn ghi rõ: Năm 476, người Giéc-man tiêu diệt đế quốc Tây Rô-ma."
            },
            {
              type: "fill",
              diff: "Dễ",
              prompt: "Kéo thẻ chữ vào chỗ trống (hoặc chạm thẻ rồi chạm ô trống).",
              template: ["Hai giai cấp cơ bản trong xã hội phong kiến Tây Âu là ", " và ", "."],
              blanks: ["lãnh chúa phong kiến", "nông nô"],
              bank: ["lãnh chúa phong kiến", "nông nô", "tư sản", "vô sản"],
              evidenceIdx: 4,
              explain: "Xã hội phong kiến Tây Âu gồm hai giai cấp chính là lãnh chúa phong kiến và nông nô."
            },
            {
              type: "sort",
              diff: "Trung bình",
              prompt: "Sắp xếp diễn biến hình thành xã hội phong kiến Tây Âu theo đúng trình tự thời gian.",
              items: [
                "Người Giéc-man tràn vào tiêu diệt đế quốc Tây Rô-ma (476)",
                "Vua Giéc-man chia ruộng đất cho quý tộc và tăng lữ",
                "Hình thành hai giai cấp lãnh chúa phong kiến và nông nô",
                "Thành thị trung đại xuất hiện phá vỡ kinh tế lãnh địa (thế kỉ XI)"
              ],
              explain: "Trình tự đúng: Sụp đổ Tây Rô-ma (476) → Chia ruộng đất → Hình thành giai cấp → Thành thị ra đời (thế kỉ XI)."
            },
            {
              type: "match",
              diff: "Trung bình",
              prompt: "Nối mỗi khái niệm với đặc điểm đúng.",
              pairs: [
                { left: "Lãnh chúa", right: "Sở hữu ruộng đất, có quyền hành như vua con" },
                { left: "Nông nô", right: "Nhận ruộng cày cấy, nộp tô và lệ thuộc lãnh chúa" },
                { left: "Lãnh địa", right: "Đơn vị kinh tế tự cung tự cấp, đóng kín" },
                { left: "Thành thị", right: "Trung tâm thủ công nghiệp và buôn bán từ thế kỉ XI" }
              ],
              explain: "Mỗi khái niệm gắn với đặc trưng kinh tế – xã hội riêng của Tây Âu trung đại."
            },
            {
              type: "tf",
              diff: "Khó",
              prompt: "Mỗi nhận định sau đây Đúng hay Sai?",
              statements: [
                { text: "Kinh tế trong lãnh địa phong kiến chủ yếu là giao thương buôn bán với bên ngoài.", answer: false, explain: "Sai: Kinh tế lãnh địa mang tính tự cung tự cấp, đóng kín." },
                { text: "Sự ra đời của thành thị trung đại góp phần thúc đẩy kinh tế hàng hóa phát triển.", answer: true, explain: "Đúng: Thành thị là nơi tập trung thợ thủ công và thương nhân buôn bán." },
                { text: "Nông nô có quyền tự do bỏ lãnh địa đi nơi khác bất cứ lúc nào.", answer: false, explain: "Sai: Nông nô bị gắn chặt vào ruộng đất và lệ thuộc vào lãnh chúa." }
              ]
            }
          ]
        }
      ]
    },
    { id: "ls2", chapter: "Chương 1. Tây Âu từ thế kỉ V đến nửa đầu thế kỉ XVI", code: "Bài 2", title: "Các cuộc phát kiến địa lí", pages: "Sách trang 13–16", summary: null },
    { id: "ls3", chapter: "Chương 1. Tây Âu từ thế kỉ V đến nửa đầu thế kỉ XVI", code: "Bài 3", title: "Sự hình thành quan hệ sản xuất tư bản chủ nghĩa ở Tây Âu", pages: "Sách trang 17–19", summary: null },
    { id: "ls4", chapter: "Chương 1. Tây Âu từ thế kỉ V đến nửa đầu thế kỉ XVI", code: "Bài 4", title: "Văn hóa Phục hưng và Cải cách tôn giáo", pages: "Sách trang 20–24", summary: null },
    { id: "ls5", chapter: "Chương 2. Trung Quốc từ thế kỉ VII đến giữa thế kỉ XIX", code: "Bài 5", title: "Tiến trình lịch sử Trung Quốc từ thế kỉ VII đến giữa thế kỉ XIX", pages: "Sách trang 25–29", summary: null },
    { id: "ls6", chapter: "Chương 2. Trung Quốc từ thế kỉ VII đến giữa thế kỉ XIX", code: "Bài 6", title: "Một số thành tựu văn hóa Trung Quốc từ thế kỉ VII đến giữa thế kỉ XIX", pages: "Sách trang 30–33", summary: null },
    { id: "ls7", chapter: "Chương 3. Ấn Độ từ thế kỉ IV đến giữa thế kỉ XIX", code: "Bài 7", title: "Vương triều Gúp-ta", pages: "Sách trang 34–36", summary: null },
    { id: "ls8", chapter: "Chương 3. Ấn Độ từ thế kỉ IV đến giữa thế kỉ XIX", code: "Bài 8", title: "Vương triều Hồi giáo Đê-li và Vương triều Mô-gôn", pages: "Sách trang 37–41", summary: null },
    { id: "ls9", chapter: "Chương 4. Đông Nam Á từ nửa sau thế kỉ X đến nửa đầu thế kỉ XVI", code: "Bài 9", title: "Khái quát về Đông Nam Á từ nửa sau thế kỉ X đến nửa đầu thế kỉ XVI", pages: "Sách trang 42–45", summary: null },
    { id: "ls10", chapter: "Chương 4. Đông Nam Á từ nửa sau thế kỉ X đến nửa đầu thế kỉ XVI", code: "Bài 10", title: "Vương quốc Cam-pu-chia", pages: "Sách trang 46–48", summary: null },
    { id: "ls11", chapter: "Chương 4. Đông Nam Á từ nửa sau thế kỉ X đến nửa đầu thế kỉ XVI", code: "Bài 11", title: "Vương quốc Lào", pages: "Sách trang 49–51", summary: null },
    { id: "ls12", chapter: "Chương 5. Việt Nam từ đầu thế kỉ X đến đầu thế kỉ XVI", code: "Bài 12", title: "Nước Đại Cồ Việt thời Ngô – Đinh – Tiền Lê", pages: "Sách trang 52–57", summary: null }
  ],
  diali: [
    {
      id: "dl1",
      chapter: "Chương 1. Châu Âu",
      code: "Bài 1",
      title: "Vị trí địa lí, đặc điểm tự nhiên châu Âu",
      pages: "Sách trang 96–101",
      summary: {
        overview: "Châu Âu là một bộ phận của lục địa Á – Âu, diện tích hơn 10 triệu km², có đường bờ biển bị cắt xẻ mạnh và phần lớn lãnh thổ nằm trong đới khí hậu ôn hòa.",
        facts: [
          { num: "> 10 triệu km²", desc: "Diện tích châu Âu (lớn thứ 5 thế giới, chỉ lớn hơn châu Đại Dương)." },
          { num: "36°B – 71°B", desc: "Phạm vi vĩ độ phần đất liền, chủ yếu ở đới ôn hòa." },
          { num: "2 khu vực", desc: "Đồng bằng chiếm 2/3 diện tích; miền núi gồm núi già và núi trẻ." },
          { num: "4 đới khí hậu", desc: "Cực và cận cực, ôn đới, cận nhiệt và khí hậu núi cao." }
        ],
        sections: [
          {
            heading: "1. Vị trí địa lí và địa hình",
            bullets: [
              "Tiếp giáp: Bắc giáp Bắc Băng Dương, Tây giáp Đại Tây Dương, Nam giáp Địa Trung Hải, Đông ngăn cách châu Á bởi dãy U-ran.",
              "Đường bờ biển bị cắt xẻ mạnh, tạo thành nhiều bán đảo (Xcan-đi-na-vi, I-bê-rích...) và biển ăn sâu vào đất liền.",
              "Đồng bằng chiếm 2/3 diện tích (kéo dài từ tây sang đông); núi trẻ tập trung ở phía nam (An-pơ, Các-pát...)."
            ],
            caption: "Bản đồ tự nhiên châu Âu (SGK trang 97)"
          },
          {
            heading: "2. Khí hậu, sông ngòi và đới thiên nhiên",
            bullets: [
              "Khí hậu ôn đới chiếm diện tích lớn nhất (phân hóa thành ôn đới hải dương ở phía tây và ôn đới lục địa ở phía đông).",
              "Sông ngòi dày đặc, lượng nước dồi dào; các sông lớn: Von-ga, Đa-nuýp, Rai-nơ."
            ],
            caption: "Bản đồ các đới và kiểu khí hậu châu Âu (SGK trang 99)"
          }
        ]
      },
      pictureQuiz: {
        part1: [
          {
            question: "Đặc điểm nổi bật nhất của đường bờ biển châu Âu là gì?",
            svgLabel: "🗺️ Bờ biển nhiều vịnh, biển ăn sâu vào đất liền và nhiều bán đảo",
            options: ["Thẳng tắp, ít vũng vịnh", "Bị cắt xẻ mạnh, tạo nhiều bán đảo và biển ăn sâu vào đất liền", "Bị băng bao phủ quanh năm ở mọi phía", "Chỉ tiếp giáp duy nhất một đại dương"],
            answer: 1,
            explain: "Đường bờ biển châu Âu bị cắt xẻ mạnh, tạo nhiều bán đảo, vũng vịnh và biển ăn sâu vào đất liền."
          }
        ],
        part2: [
          { id: "dp1", label: "Ôn đới hải dương", hint: "Ven Đại Tây Dương: mùa hạ mát, mùa đông không quá lạnh, mưa quanh năm" },
          { id: "dp2", label: "Ôn đới lục địa", hint: "Sâu trong nội địa phía đông: mùa hạ nóng, mùa đông lạnh giá, mưa ít" }
        ]
      },
      quizzes: [
        {
          id: "de1",
          title: "Đề 1: Vị trí địa lí & Địa hình châu Âu",
          passageTitle: "Khái quát tự nhiên châu Âu",
          sentences: [
            "Châu Âu nằm ở phía tây của lục địa Á – Âu, có diện tích hơn 10 triệu km².",
            "Ranh giới tự nhiên phía đông ngăn cách châu Âu với châu Á là dãy núi U-ran.",
            "Đường bờ biển châu Âu bị cắt xẻ mạnh, biển ăn sâu vào đất liền tạo thành nhiều bán đảo và vũng vịnh.",
            "Địa hình đồng bằng chiếm tới 2/3 diện tích châu lục, trải dài từ tây sang đông.",
            "Hệ thống núi trẻ như An-pơ, Các-pát, Ban-căng tập trung chủ yếu ở phía nam."
          ],
          questions: [
            {
              type: "mcq",
              diff: "Dễ",
              prompt: "Ranh giới tự nhiên phía đông ngăn cách châu Âu với châu Á là dãy núi nào?",
              options: ["Dãy An-pơ", "Dãy U-ran", "Dãy Hi-ma-lay-a", "Dãy Các-pát"],
              answer: 1,
              evidenceIdx: 1,
              wrongReasons: [
                "Dãy An-pơ là núi trẻ nằm ở phía nam châu Âu.",
                "",
                "Dãy Hi-ma-lay-a nằm ở châu Á.",
                "Dãy Các-pát nằm ở Trung và Đông Âu."
              ],
              explain: "Câu 2 của đoạn ghi rõ: Ranh giới tự nhiên phía đông ngăn cách châu Âu với châu Á là dãy U-ran."
            },
            {
              type: "fill",
              diff: "Dễ",
              prompt: "Kéo thẻ chữ vào chỗ trống.",
              template: ["Địa hình ", " chiếm tới 2/3 diện tích châu Âu, còn núi trẻ tập trung chủ yếu ở phía ", "."],
              blanks: ["đồng bằng", "nam"],
              bank: ["đồng bằng", "nam", "cao nguyên", "bắc"],
              evidenceIdx: 3,
              explain: "Đồng bằng chiếm 2/3 diện tích châu Âu; núi trẻ tập trung ở phía nam."
            },
            {
              type: "tf",
              diff: "Trung bình",
              prompt: "Mỗi nhận định sau về tự nhiên châu Âu Đúng hay Sai?",
              statements: [
                { text: "Phần lớn lãnh thổ châu Âu nằm trong đới khí hậu nhiệt đới.", answer: false, explain: "Sai: Phần lớn lãnh thổ châu Âu nằm trong đới khí hậu ôn hòa." },
                { text: "Dòng biển nóng Bắc Đại Tây Dương và gió Tây ôn đới giúp khí hậu Tây Âu ấm áp, mưa nhiều.", answer: true, explain: "Đúng: Đây là hai nhân tố làm kiểu khí hậu ôn đới hải dương dịu mát, ẩm ướt." },
                { text: "Sông Von-ga là con sông dài nhất châu Âu.", answer: true, explain: "Đúng: Sông Von-ga chảy ở Đông Âu là sông dài nhất châu lục này." }
              ]
            }
          ]
        }
      ]
    },
    { id: "dl2", chapter: "Chương 1. Châu Âu", code: "Bài 2", title: "Đặc điểm dân cư, xã hội châu Âu", pages: "Sách trang 102–104", summary: null },
    { id: "dl3", chapter: "Chương 1. Châu Âu", code: "Bài 3", title: "Khai thác, sử dụng và bảo vệ thiên nhiên ở châu Âu", pages: "Sách trang 105–108", summary: null },
    { id: "dl4", chapter: "Chương 1. Châu Âu", code: "Bài 4", title: "Liên minh châu Âu (EU)", pages: "Sách trang 109–111", summary: null },
    { id: "dl5", chapter: "Chương 2. Châu Á", code: "Bài 5", title: "Vị trí địa lí, đặc điểm tự nhiên châu Á", pages: "Sách trang 112–118", summary: null },
    { id: "dl6", chapter: "Chương 2. Châu Á", code: "Bài 6", title: "Đặc điểm dân cư, xã hội châu Á", pages: "Sách trang 119–121", summary: null }
  ],
  exams: [
    {
      id: "exam_hk1_1",
      title: "Đề thi thử Học kì 1 – Tổng hợp Lịch sử & Địa lí 7 (Đề số 1)",
      durationMinutes: 25,
      desc: "Tổng hợp câu hỏi trọng tâm Lịch sử (Bài 1–12) và Địa lí (Bài 1–6). Nộp bài chấm ngay thang 10 kèm bảng đáp án từng câu.",
      questions: [
        { q: "Năm 476 gắn với sự kiện lịch sử nào ở Tây Âu?", options: ["Đế quốc Tây Rô-ma sụp đổ", "Cô-lôm-bô tìm ra châu Mĩ", "Thành thị trung đại ra đời", "Phong trào Cải cách tôn giáo bùng nổ"], answer: 0, explain: "Năm 476, người Giéc-man tiêu diệt đế quốc Tây Rô-ma, mở đầu thời kì phong kiến Tây Âu." },
        { q: "Hai giai cấp cơ bản trong xã hội phong kiến Tây Âu là gì?", options: ["Địa chủ và nông dân", "Lãnh chúa phong kiến và nông nô", "Tư sản và vô sản", "Chủ nô và nô lệ"], answer: 1, explain: "Xã hội phong kiến Tây Âu gồm hai giai cấp cơ bản là lãnh chúa phong kiến và nông nô." },
        { q: "Ai là người đầu tiên thực hiện chuyến đi vòng quanh thế giới bằng đường biển (1519–1522)?", options: ["C. Cô-lôm-bô", "V. Ga-ma", "Ph. Ma-gien-lăng", "B. Đi-a-xơ"], answer: 2, explain: "Đoàn thám hiểm của Ph. Ma-gien-lăng đã hoàn thành chuyến đi vòng quanh thế giới lần đầu tiên." },
        { q: "Tứ đại phát minh kĩ thuật của Trung Quốc thời phong kiến gồm những gì?", options: ["Giấy, kĩ thuật in, la bàn, thuốc súng", "La bàn, đồng hồ, giấy, tàu thủy", "Thuốc súng, động cơ hơi nước, giấy, in", "Kính thiên văn, la bàn, giấy, thuốc súng"], answer: 0, explain: "Bốn phát minh vĩ đại của Trung Quốc là kĩ thuật làm giấy, kĩ thuật in, la bàn và thuốc súng." },
        { q: "Ngô Quyền đánh bại quân Nam Hán trên sông Bạch Đằng vào năm nào?", options: ["Năm 938", "Năm 968", "Năm 981", "Năm 1010"], answer: 0, explain: "Năm 938, Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng, chấm dứt hơn 1000 năm Bắc thuộc." },
        { q: "Ranh giới tự nhiên phía đông ngăn cách châu Âu với châu Á là dãy núi nào?", options: ["Dãy An-pơ", "Dãy U-ran", "Dãy Hi-ma-lay-a", "Dãy Côn Luân"], answer: 1, explain: "Dãy U-ran là ranh giới tự nhiên phía đông giữa châu Âu và châu Á." },
        { q: "Dạng địa hình nào chiếm tới 2/3 diện tích châu Âu?", options: ["Núi trẻ", "Cao nguyên", "Đồng bằng", "Sơn nguyên"], answer: 2, explain: "Đồng bằng chiếm 2/3 diện tích châu Âu, kéo dài từ tây sang đông." },
        { q: "Phần lớn lãnh thổ châu Âu nằm trong đới khí hậu nào?", options: ["Đới nóng", "Đới ôn hòa", "Đới lạnh", "Đới cận xích đạo"], answer: 1, explain: "Châu Âu trải dài từ 36°B đến 71°B nên phần lớn nằm trong đới ôn hòa." },
        { q: "Đặc điểm nổi bật của cơ cấu dân số châu Âu hiện nay là gì?", options: ["Cơ cấu dân số trẻ", "Cơ cấu dân số già", "Tỉ lệ gia tăng tự nhiên rất cao", "Tỉ lệ dân thành thị dưới 30%"], answer: 1, explain: "Châu Âu có tỉ suất sinh thấp, tuổi thọ trung bình cao nên cơ cấu dân số già." },
        { q: "Châu lục nào có diện tích lớn nhất thế giới (khoảng 44,4 triệu km² tính cả các đảo)?", options: ["Châu Âu", "Châu Phi", "Châu Mĩ", "Châu Á"], answer: 3, explain: "Châu Á là châu lục rộng lớn nhất thế giới với diện tích khoảng 44,4 triệu km²." }
      ]
    }
  ]
};
