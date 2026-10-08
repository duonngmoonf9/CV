/**
 * Trịnh Hữu Dương - Portfolio Interactive Logic
 * Handles animations, AI workflow tabs, project filtering, CV preview modal, and toast alerts.
 */

// Data for AI Agent Workflows
const aiWorkflowData = {
  framework: {
    title: "Master Framework 3-Pha: Brainstorm → Plan & Technical Map → Execute",
    description: "Quy trình chuẩn mực được đúc kết từ hệ thống FetchCRM (.agents) giúp định hướng AI Agent làm việc có tính dự đoán cao (deterministic), loại bỏ ảo giác (hallucination) và bám sát kiến trúc hệ thống.",
    steps: [
      { phase: "Pha 1: Brainstorm & Requirements", desc: "Tổng hợp yêu cầu từ PRD / Khách hàng, xác định các trường hợp biên (edge cases), bảo mật và hiệu năng." },
      { phase: "Pha 2: Technical Map & Plan", desc: "Lập sơ đồ kỹ thuật chi tiết: database schemas, Drizzle/Prisma relations, API contracts, dependencies." },
      { phase: "Pha 3: Deterministic Execution", desc: "AI Agent thực thi từng bước nhỏ kèm test tự động, commit sạch theo chuẩn Conventional Commits." }
    ],
    terminalCode: `# Workflow thực thi 3 pha chuẩn mực (trích từ .agents/plan.md)
[INPUT] User Task: "Tích hợp Webhook nạp tiền tự động qua QR Code"
  │
  ├──> Phase 1: Context Ingestion & Security Audit
  │    - Đọc schema bảng payment_transactions & invoices
  │    - Kiểm tra chữ ký số HMAC-SHA256 & replay attacks
  │
  ├──> Phase 2: Technical Mapping
  │    - Tạo Drizzle migration: add field 'gateway_reference'
  │    - Thiết kế BullMQ worker: 'process-payment-webhook'
  │
  └──> Phase 3: TDD Execution & Verification
       - Run test: payment.service.spec.ts [PASS]
       - AI Agent commit & ghi nhận bài học vào Knowledge Base`
  },
  knowledge: {
    title: "Domain-Driven Knowledge Base (AI Learning Workflow)",
    description: "Hệ thống quản trị tri thức phân tán theo phân hệ (Modular Knowledge Base) tại FetchCRM. Mọi quyết định kỹ thuật, quy ước và bug fix thực tế được lưu vào đúng domain để AI kế thừa xuyên suốt các phiên làm việc.",
    steps: [
      { phase: "Chống Trôi Ngữ Cảnh (Context Drift)", desc: "AI Agent tự động tra cứu KI (Knowledge Items) trước khi lập trình để tuân thủ mẫu code sẵn có." },
      { phase: "Tích Lũy Tự Động (Continuous Learning)", desc: "Sau mỗi task phức tạp, agent tự trích xuất 'Learnings' và cập nhật vào .agents/workflows/ai-learning.md." },
      { phase: "Phân Tách Theo Domain", desc: "Kiến thức chia tách theo auth, billing, socket, queue, database... giúp prompt luôn tinh gọn." }
    ],
    terminalCode: `# Cấu trúc Modular Knowledge Base của dự án FetchCRM
.agents/
├── AGENTS.md                  # Master Framework & Skill Dispatch Matrix
├── workflows/
│   ├── ai-learning.md         # Domain-Driven Knowledge Workflow
│   └── plan.md                # 3-Phase Execution Map
├── skills/
│   ├── tdd/                   # Test-Driven Development Loop
│   ├── security-and-hardening/# OWASP Top 10 & API Security
│   ├── to-spec/               # Chuyển đổi thảo luận thành PRD
│   └── writing-great-skills/  # Chuẩn hóa kỹ năng AI Agent
└── learnings/                 # Tri thức đúc kết qua từng sprint`
  },
  tdd: {
    title: "Test-Driven Development (TDD) Loop với AI",
    description: "Nguyên tắc 'Red → Green → Refactor' được ép buộc nghiêm ngặt trong skill TDD. AI Agent chỉ được viết code tính năng sau khi đã có test thất bại (Red test) kiểm chứng hành vi người dùng mong đợi.",
    steps: [
      { phase: "Mock Tại Ranh Giới (System Boundaries)", desc: "Chỉ mock cổng thanh toán, Redis, Email API bên ngoài. Không bao giờ mock internal collaborators hay logic nghiệp vụ." },
      { phase: "Integration-Style Tests", desc: "Ưu tiên kiểm thử qua public interface thực tế để test bền vững trước các đợt refactor mã nguồn." },
      { phase: "Tự Động Hóa CI/CD", desc: "Mọi PR và commit đều phải vượt qua bộ suite Jest / Playwright trước khi deploy lên Production." }
    ],
    terminalCode: `// TDD Integration-style Test (Trích từ .agents/skills/tdd/tests.md)
describe('PaymentProcessingService', () => {
  it('should verify VietQR webhook and credit balance atomically', async () => {
    // 1. Arrange: Tạo đơn hàng thử nghiệm
    const order = await createTestOrder({ amount: 500000 });
    
    // 2. Act: Giả lập webhook ngân hàng gửi đến
    const response = await webhookHandler.processPayment({
      signature: generateValidSignature(order.id, 500000),
      orderCode: order.id,
      amount: 500000
    });

    // 3. Assert: Kiểm tra số dư & trạng thái hóa đơn
    expect(response.status).toBe('SUCCESS');
    const updated = await getOrderById(order.id);
    expect(updated.isPaid).toBe(true);
  });
});`
  },
  security: {
    title: "Bảo Mật OWASP & Framework Giao Diện Anti-Slop (Taste-Skill / Impeccable)",
    description: "Kết hợp bộ checklist bảo mật OWASP Top 10 và hai framework thiết kế AI hàng đầu: Taste Skill & Impeccable (59 bộ quy tắc ngăn ngừa AI tạo code frontend rác, giao diện lỗi mốt hay lười sinh mã).",
    steps: [
      { phase: "Security Checklist Tự Động", desc: "Kiểm tra Authorization (RBAC), SQL/NoSQL Injection, Rate Limiting (Throttler), CORS và Header bảo mật (Helmet)." },
      { phase: "Taste Skill Anti-Slop", desc: "Ngăn chặn các lỗi thường gặp của AI như màu sắc nhạt nhẽo, typography tùy tiện, thiếu micro-interactions." },
      { phase: "Khắc Phục LLM Laziness", desc: "Kỹ thuật phân rã token ngăn chặn việc AI bỏ qua code tính năng hoặc để lại placeholder comment '// ...code continues here'." }
    ],
    terminalCode: `# Taste Skill & Impeccable Security Audit Rules
[AUDIT] Kiểm thử tự động trên mã nguồn:
  ✔ OWASP Check: Input sanitized via class-validator & Zod schemas
  ✔ Rate Limiting: Redis-backed Throttler (100 req/min/IP)
  ✔ Token Laziness Detection: 0 placeholders found in implementation
  ✔ Anti-Slop UI Rule #14: Glassmorphic borders use high-contrast cyan token
  ✔ Anti-Slop UI Rule #28: Accessible micro-animations with reduce-motion fallbacks
  >>> RESULT: 100% PRODUCTION READY & ENTERPRISE COMPLIANT`
  }
};

// Switch AI Workflow Tab
function switchAiTab(tabKey) {
  const data = aiWorkflowData[tabKey];
  if (!data) return;

  // Update button active state
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabKey);
  });

  // Update content
  const titleEl = document.getElementById('ai-tab-title');
  const descEl = document.getElementById('ai-tab-desc');
  const stepsEl = document.getElementById('ai-tab-steps');
  const codeEl = document.getElementById('ai-tab-code');

  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.description;
  if (codeEl) codeEl.textContent = data.terminalCode;

  if (stepsEl) {
    stepsEl.innerHTML = data.steps.map(s => `
      <div class="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-emerald-500/10 hover:border-emerald-500/30 transition-all">
        <div class="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
        <div>
          <div class="text-sm font-semibold text-slate-200">${s.phase}</div>
          <div class="text-xs text-slate-400 mt-0.5 leading-relaxed">${s.desc}</div>
        </div>
      </div>
    `).join('');
  }
}

// Copy to clipboard helper
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Đã sao chép ${label}: ${text}`);
  }).catch(() => {
    showToast(`Không thể sao chép! Hãy copy thủ công: ${text}`);
  });
}

// Toast notification
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Filter projects
function filterProjects(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });

  const cards = document.querySelectorAll('.project-item');
  cards.forEach(card => {
    const cardCat = card.dataset.category || '';
    if (category === 'all' || cardCat.includes(category)) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 50);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 200);
    }
  });
}

// CV Modal open/close
function openCvModal() {
  const modal = document.getElementById('cv-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeCvModal() {
  const modal = document.getElementById('cv-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
}

// Project Details Modal Data
const projectDetails = {
  fetchcrm: {
    title: "FetchCRM - Nền Tảng Quản Trị & Vận Hành Doanh Nghiệp Toàn Diện",
    time: "2025 - 2026",
    badge: "AI Agent Master Framework & High Performance",
    overview: "Hệ thống quản lý khách hàng (CRM) và điều phối nghiệp vụ doanh nghiệp mở rộng với kiến trúc micro-modular. Tích hợp sâu AI Agentic Workflows (.agents) giúp đội ngũ phát triển tăng tốc 300% hiệu năng.",
    architecture: [
      "Backend: NestJS với Drizzle ORM, PostgreSQL kết hợp BullMQ xử lý hàng đợi background jobs cực nhanh.",
      "Frontend: Next.js 16 (App Router) với React 19, TanStack Query v5, TanStack Table v9 và Base UI.",
      "Realtime & Messaging: Socket.IO cluster với Redis adapter, tích hợp Zalo ZNS API (zca-js).",
      "AI Engineering (.agents): Quy trình 3 pha chuẩn mực (Brainstorm → Plan → Execute), Domain-Driven Knowledge Base (ai-learning.md), TDD loop và bộ checklist kiểm thử bảo mật tự động."
    ],
    tech: ["NestJS", "Next.js 16", "PostgreSQL", "Drizzle ORM", "BullMQ", "Redis", "Socket.IO", "Zalo API", ".agents", "Docker"],
    link: "G:\\2026\\new-fetch"
  },
  chatduon: {
    title: "DuongUy Chat - Hệ Sinh Thái Nhắn Tin Real-Time Đa Nền Tảng",
    time: "2025 - 2026",
    badge: "Multi-Platform & Anti-Slop AI Design",
    overview: "Ứng dụng chat thời gian thực hỗ trợ đồng bộ trên Web, Desktop (Electron) và Mobile (Android/iOS thông qua Capacitor). Áp dụng Taste Skill & Impeccable framework để thiết kế giao diện chống slop và tối ưu hóa phản hồi AI.",
    architecture: [
      "Backend: NestJS 11, Prisma ORM, Socket.IO WebSockets, JWT Authentication, Passport.",
      "Client Web: Next.js 16, React 19, Framer Motion, Base UI, Sonner, Radix UI.",
      "Offline-first Storage: Dexie (IndexedDB) lưu trữ và đồng bộ tin nhắn ngay cả khi mất mạng.",
      "Cross-Platform Mobile: Capacitor Native Wrapper (Haptics, Splash Screen, Status Bar).",
      "AI Framework: Taste Skill & Impeccable (59 rules ngăn chặn anti-pattern trong AI frontend generation)."
    ],
    tech: ["NestJS 11", "Next.js 16", "React 19", "Capacitor", "Prisma", "Dexie IndexedDB", "Socket.IO", "Taste-Skill", "Impeccable"],
    link: "G:\\2026\\chat-duon-guy"
  },
  nhatro: {
    title: "Nền Tảng Quản Lý Nhà Trọ & Căn Hộ Dịch Vụ Thông Minh",
    time: "2025 - 2026",
    badge: "IoT Integration & Fintech Webhook",
    overview: "Hệ thống quản lý chuỗi căn hộ, phòng trọ với 12 phân hệ quản trị tập trung, tự động hóa thanh toán tiền phòng qua Webhook ngân hàng và quản lý khóa cửa thông minh qua IoT Cloud API.",
    architecture: [
      "Core Architecture: Angular 19 với mô hình Atom Persistent Collections và ApartmentStateService tập trung.",
      "Fintech Automation: Tích hợp Webhook SePAY/Casso/VNPay tự động gạch nợ hóa đơn khi có biến động số dư.",
      "IoT Smart Lock: Điều khiển mã mở khóa phòng từ xa thông qua Cloud API.",
      "Communication: Tự động gửi thông báo hóa đơn, nhắc nợ qua Zalo ZNS và PWA Mobile App cho khách thuê."
    ],
    tech: ["Angular 19", "Capacitor", "Firebase", "SePAY Webhook", "Zalo ZNS API", "IoT Smart Lock", "Chart.js", ".agents"],
    link: "G:\\2026\\nha-tro"
  },
  khungnhom: {
    title: "Khung Nhôm Kính - E-Commerce & Công Cụ Bóc Tách Dự Toán Tự Động",
    time: "2025 - 2026",
    badge: "Engineering Calculation & CMS",
    overview: "Website thương mại điện tử chuyên ngành cơ khí xây dựng, trang bị thuật toán tính toán báo giá chi tiết từng mét nhôm kính kỹ thuật và hệ thống biên tập nội dung chuyên sâu.",
    architecture: [
      "Backend: NestJS, Drizzle ORM, BullMQ, Redis, PostgreSQL.",
      "Frontend: Next.js 16, React, TanStack Query, TanStack Table, TipTap Rich Text Editor.",
      "Pricing Engine: Thuật toán tự động bóc tách quy cách cây nhôm, kính cường lực, phụ kiện cơ khí và nhân công thi công chính xác 100%."
    ],
    tech: ["NestJS", "Next.js 16", "Drizzle ORM", "PostgreSQL", "TipTap", "TailwindCSS"],
    link: "G:\\2026\\khung-nhom"
  },
  meatdeli: {
    title: "MeatDeli - Website Doanh Nghiệp & Truy Xuất Nguồn Gốc Mã QR",
    time: "07/2025 - 11/2025",
    badge: "Masan Group Project | High Traffic",
    overview: "Thiết kế kiến trúc và phát triển website thương hiệu thịt sạch MeatDeli cùng landing page tỷ lệ chuyển đổi cao, xây dựng hệ sinh thái kiểm dịch và truy xuất nguồn gốc qua mã QR.",
    architecture: [
      "Thiết kế schema cơ sở dữ liệu quan hệ tối ưu cho hàng triệu lượt quét mã QR mỗi tháng.",
      "Xây dựng Admin Dashboard quản trị lô sản phẩm và nhật ký kiểm dịch an toàn thực phẩm.",
      "Thiết kế lại toàn bộ giao diện trang chủ responsive, tăng trưởng đột phá tỷ lệ chuyển đổi.",
      "Thiết lập CI/CD pipeline tự động deploy lên môi trường Mock và Production của doanh nghiệp."
    ],
    tech: ["PHP (OOP, MVC)", "Laravel", "MySQL", "QR Traceability", "AWS Cloud", "CI/CD"],
    link: "https://meatdeli.com.vn"
  },
  payment3cx: {
    title: "Cổng Thanh Toán Tự Động Nạp Tiền Cước Tổng Đài 3CX",
    time: "04/2025 - 07/2025",
    badge: "Telecom Fintech & Telegram Bot",
    overview: "Cổng thanh toán tự động quét mã QR cho phép khách hàng doanh nghiệp nạp tiền vào tài khoản gọi thoại tổng đài 3CX một cách tức thì mà không cần can thiệp thủ công.",
    architecture: [
      "Backend: Kiến trúc RESTful APIs bảo mật bằng JWT và RBAC nhiều cấp độ trên Laravel.",
      "Frontend: Giao diện ReactJS tương tác cao, chọn số tiền nạp và tải lên chứng từ chuyển khoản.",
      "Hệ thống xác minh: Tích hợp Bot Telegram gửi thông báo biến động giao dịch tức thì, tự động kích hoạt API nạp tiền vào 3CX PBX server."
    ],
    tech: ["Laravel", "React.js", "JWT", "3CX API", "Telegram Bot API", "MySQL"],
    link: "Enterprise LET JSC"
  },
  projectcost: {
    title: "Công Cụ Quản Lý Dự Án & Dự Toán Chi Phí Xây Dựng",
    time: "07/2024 - 03/2025",
    badge: "Enterprise Internal Tool | Costing Engine",
    overview: "Công cụ quản lý dự án cấp doanh nghiệp giúp tự động hóa định tuyến nhiệm vụ liên phòng ban, bóc tách khối lượng vật tư xây dựng, nhân công và tính toán biên lợi nhuận thời gian thực.",
    architecture: [
      "Thiết kế kiến trúc cơ sở dữ liệu và phát triển dashboard quản trị tập trung.",
      "Tích hợp API bất đồng bộ hai chiều (jQuery, Ajax) với nền tảng Bitrix24 CRM.",
      "Quy trình định tuyến công việc tự động theo quyền hạn và luồng duyệt cấp quản lý."
    ],
    tech: ["PHP", "Bitrix24 CRM API", "jQuery", "Ajax", "MySQL", "AWS"],
    link: "Enterprise LET JSC"
  },
  masancloud: {
    title: "Hiện Đại Hóa Hệ Sinh Thái Masan Bitrix & Quản Trị AWS Cloud",
    time: "06/2023 - 01/2026",
    badge: "Zero-Downtime Migration & AWS Ops",
    overview: "Dẫn dắt dự án nâng cấp hệ thống Masan Bitrix quy mô lớn từ PHP 5.6 lên 8.3 không gián đoạn dịch vụ; quản trị hạ tầng AWS và mở rộng dung lượng ghi âm cuộc gọi cho Long Biên Golf.",
    architecture: [
      "Xây dựng chiến lược di chuyển theo từng giai đoạn (PHP 5.6 → 7.4 → 8.0 → 8.3) đảm bảo zero-downtime.",
      "Tái cấu trúc mã nguồn cũ, tương thích ngược các module tùy chỉnh và bảo mật máy chủ CentOS 7.",
      "Mở rộng phân vùng máy chủ 3CX, mount liền mạch tập dữ liệu ghi âm khổng lồ (Long Biên Golf).",
      "Nâng cấp phần cứng các instance AWS thông qua Amazon Machine Images (AMI) an toàn tuyệt đối."
    ],
    tech: ["AWS (EC2, AMI, EBS, S3)", "CentOS 7", "Bitrix24 CRM", "PHP 8.3", "3CX PBX"],
    link: "Enterprise LET JSC"
  }
};

function openProjectModal(key) {
  const p = projectDetails[key];
  if (!p) return;

  const modal = document.getElementById('project-modal');
  const title = document.getElementById('proj-modal-title');
  const time = document.getElementById('proj-modal-time');
  const badge = document.getElementById('proj-modal-badge');
  const overview = document.getElementById('proj-modal-overview');
  const arch = document.getElementById('proj-modal-arch');
  const tech = document.getElementById('proj-modal-tech');

  if (title) title.textContent = p.title;
  if (time) time.textContent = p.time;
  if (badge) badge.textContent = p.badge;
  if (overview) overview.textContent = p.overview;

  if (arch) {
    arch.innerHTML = p.architecture.map(item => `
      <li class="flex items-start gap-2 text-slate-300 text-sm">
        <span class="text-emerald-400 mt-1 shrink-0">▹</span>
        <span>${item}</span>
      </li>
    `).join('');
  }

  if (tech) {
    tech.innerHTML = p.tech.map(t => `
      <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
        ${t}
      </span>
    `).join('');
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Init default AI tab
  switchAiTab('framework');

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // Navbar background change on scroll
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('bg-obsidian-900/90', 'backdrop-blur-md', 'border-b', 'border-emerald-500/20', 'shadow-lg');
    } else {
      nav.classList.remove('bg-obsidian-900/90', 'backdrop-blur-md', 'border-b', 'border-emerald-500/20', 'shadow-lg');
    }
  });

  // Calculate dynamic stats
  const startYear = 2022;
  const currentYear = new Date().getFullYear();
  const expYears = currentYear - startYear;
  const expEl = document.getElementById('stat-exp-years');
  if (expEl) expEl.textContent = `${expYears}+`;

  // Close modals when clicking backdrop or ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCvModal();
      closeProjectModal();
    }
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeCvModal();
        closeProjectModal();
      }
    });
  });
});
