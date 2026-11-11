// Photos for the in-house workshop section (Unsplash, hotlinked as Unsplash's API terms require).
const u = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=72`;

export const workshop = [
  { key: "screen", img: u("1550041473-d296a3a8a18a", 900, 1200), by: "Clint Bustrillos", ref: "clintbustrillos",
    en: ["Screen & glass", "Cracked screens, dead touch, back glass and camera lens"], ar: ["الشاشات والزجاج", "الشاشات المكسورة، اللمس المعطل، الزجاج الخلفي وعدسة الكاميرا"],
    msg: "Screen & Glass" },
  { key: "board", img: u("1746005514010-93d5fc20e85a", 1200, 800), by: "Fotografia Lui Vlad", ref: "fotografialuivlad",
    en: ["Board-level repair", "No power, no charging, boot loops and short circuits"], ar: ["صيانة اللوحة الأم", "لا يعمل، لا يشحن، إعادة التشغيل المتكرر والقصر الكهربائي"],
    msg: "Board-level repair" },
  { key: "chip", img: u("1640955785023-1854685dae05", 1200, 900), by: "Vishnu Mohanan", ref: "vishnumaiea",
    en: ["Restoration & water damage", "Chip-level work to bring dead and drowned devices back"], ar: ["الاستعادة وأضرار الماء", "عمل على مستوى الشرائح لإعادة الأجهزة المتوقفة والغارقة"],
    msg: "Water damage / restoration" },
  { key: "parts", img: u("1746005718004-1f992c399428", 1200, 800), by: "Fotografia Lui Vlad", ref: "fotografialuivlad",
    en: ["Batteries, ports & cameras", "Quality parts, fitted and tested the same day"], ar: ["البطاريات والمنافذ والكاميرات", "قطع عالية الجودة تُركّب وتُختبر في نفس اليوم"],
    msg: "Battery / port / camera" },
  { key: "laptop", img: u("1721333089073-215a56fd710c", 900, 1200), by: "Samsung Memory", ref: "samsungmemory",
    en: ["Laptops & computers", "Screens, keyboards, SSD & RAM upgrades, overheating"], ar: ["اللابتوب والكمبيوتر", "الشاشات ولوحات المفاتيح وترقية SSD والذاكرة وارتفاع الحرارة"],
    msg: "Laptop / computer" },
  { key: "soft", img: u("1426024084828-5da21e13f5dc", 1200, 800), by: "Firmbee.com", ref: "firmbee",
    en: ["Software, data & setup", "System repair, virus removal, backups and transfers"], ar: ["البرمجيات والبيانات والإعداد", "إصلاح النظام وإزالة الفيروسات والنسخ الاحتياطي ونقل البيانات"],
    msg: "Software / data" },
];

export const workshopHero = { img: u("1539331586018-346b53b2aaa4", 1600, 1000), by: "max bushuev", ref: "ib00sh" };
export const credit = (ref) => `https://unsplash.com/@${ref}?utm_source=kenz_mobile_phones&utm_medium=referral`;
