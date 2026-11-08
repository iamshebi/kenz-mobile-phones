// The KENZ collection — 10 iPhone + 10 Galaxy devices in stock.
// Specs verified against Apple / Samsung published specifications.
// `family` controls the drawn render; `hex` is the finish colour.

const S = (en, ar) => ({ en, ar });

// Shared spec blocks
const iphone18Pro = (max) => ({
  display: S(
    `${max ? "6.9" : "6.3"}-inch Super Retina XDR OLED, ProMotion up to 120Hz, 3,000 nits outdoor`,
    `شاشة Super Retina XDR OLED مقاس ${max ? "6.9" : "6.3"} بوصة، ProMotion حتى 120Hz، سطوع 3000 شمعة في الخارج`
  ),
  chip: S("A20 Pro chip (6-core CPU, 7-core GPU)", "شريحة A20 Pro (معالج 6 أنوية، رسوميات 7 أنوية)"),
  camera: S(
    "48MP Fusion Main with variable aperture, 48MP Ultra Wide, 48MP 4x Telephoto, up to 8x optical-quality zoom",
    "كاميرا رئيسية 48MP بفتحة عدسة متغيرة، واسعة جداً 48MP، مقرّبة 48MP بتقريب 4x، وتقريب حتى 8x بجودة بصرية"
  ),
  front: S("18MP Center Stage front camera", "كاميرا أمامية 18MP بميزة Center Stage"),
  battery: S(
    `Up to ${max ? "43" : "34"} hours video playback`,
    `حتى ${max ? "43" : "34"} ساعة تشغيل فيديو`
  ),
  build: S(
    `Aluminium unibody, Ceramic Shield 2 front, IP68, ${max ? "249" : "211"}g`,
    `هيكل ألمنيوم موحّد، واجهة Ceramic Shield 2، مقاومة IP68، الوزن ${max ? "249" : "211"} غ`
  ),
});

const iphoneAir = {
  display: S("6.5-inch Super Retina XDR OLED, ProMotion up to 120Hz, 3,000 nits outdoor", "شاشة Super Retina XDR OLED مقاس 6.5 بوصة، ProMotion حتى 120Hz، سطوع 3000 شمعة في الخارج"),
  chip: S("A19 Pro chip", "شريحة A19 Pro"),
  camera: S("48MP Fusion camera with 2x optical-quality Telephoto", "كاميرا Fusion بدقة 48MP مع تقريب 2x بجودة بصرية"),
  front: S("18MP Center Stage front camera", "كاميرا أمامية 18MP بميزة Center Stage"),
  battery: S("Up to 27 hours video playback", "حتى 27 ساعة تشغيل فيديو"),
  build: S("Titanium frame, just 5.64mm thin, IP68, 165g", "إطار تيتانيوم بسماكة 5.64 ملم فقط، مقاومة IP68، الوزن 165 غ"),
};

const iphone16 = (plus) => ({
  display: S(`${plus ? "6.7" : "6.1"}-inch Super Retina XDR OLED`, `شاشة Super Retina XDR OLED مقاس ${plus ? "6.7" : "6.1"} بوصة`),
  chip: S("A18 chip", "شريحة A18"),
  camera: S("48MP Fusion Main, 12MP Ultra Wide, Camera Control", "كاميرا رئيسية 48MP، واسعة جداً 12MP، وزر التحكم بالكاميرا"),
  front: S("12MP TrueDepth front camera", "كاميرا أمامية TrueDepth بدقة 12MP"),
  battery: S(`Up to ${plus ? "27" : "22"} hours video playback`, `حتى ${plus ? "27" : "22"} ساعة تشغيل فيديو`),
  build: S(`Aluminium design, Action button, IP68, ${plus ? "199" : "170"}g`, `تصميم ألمنيوم، زر الإجراءات، مقاومة IP68، الوزن ${plus ? "199" : "170"} غ`),
});

const iphone17 = {
  display: S("6.3-inch Super Retina XDR OLED, ProMotion up to 120Hz, 3,000 nits outdoor", "شاشة Super Retina XDR OLED مقاس 6.3 بوصة، ProMotion حتى 120Hz، سطوع 3000 شمعة في الخارج"),
  chip: S("A19 chip", "شريحة A19"),
  camera: S("48MP Fusion Main, 48MP Fusion Ultra Wide", "كاميرا رئيسية Fusion بدقة 48MP، وواسعة جداً Fusion بدقة 48MP"),
  front: S("18MP Center Stage front camera", "كاميرا أمامية 18MP بميزة Center Stage"),
  battery: S("Up to 30 hours video playback", "حتى 30 ساعة تشغيل فيديو"),
  build: S("Aluminium design, Ceramic Shield 2 front, IP68, 177g", "تصميم ألمنيوم، واجهة Ceramic Shield 2، مقاومة IP68، الوزن 177 غ"),
};

const iphone17e = {
  display: S("6.1-inch Super Retina XDR OLED", "شاشة Super Retina XDR OLED مقاس 6.1 بوصة"),
  chip: S("A19 chip", "شريحة A19"),
  camera: S("48MP Fusion camera with 2x optical-quality Telephoto", "كاميرا Fusion بدقة 48MP مع تقريب 2x بجودة بصرية"),
  front: S("12MP TrueDepth front camera", "كاميرا أمامية TrueDepth بدقة 12MP"),
  battery: S("Up to 26 hours video playback, MagSafe charging", "حتى 26 ساعة تشغيل فيديو، وشحن MagSafe"),
  build: S("Aluminium design, Ceramic Shield 2 front, Action button, IP68", "تصميم ألمنيوم، واجهة Ceramic Shield 2، زر الإجراءات، مقاومة IP68"),
};

const iphoneDuo = {
  display: S("7.6-inch inner + 5.4-inch outer Super Retina XDR displays, up to 120Hz", "شاشة داخلية 7.6 بوصة + شاشة خارجية 5.4 بوصة Super Retina XDR، حتى 120Hz"),
  chip: S("A20 Pro chip (6-core CPU, 7-core GPU)", "شريحة A20 Pro (معالج 6 أنوية، رسوميات 7 أنوية)"),
  camera: S("48MP Fusion Main, 48MP Fusion Ultra Wide", "كاميرا رئيسية Fusion بدقة 48MP، وواسعة جداً Fusion بدقة 48MP"),
  front: S("Under-display FaceTime camera on the inner screen", "كاميرا FaceTime مخفية تحت الشاشة الداخلية"),
  battery: S("Dual batteries, up to 24 hours typical use", "بطاريتان، حتى 24 ساعة من الاستخدام المعتاد"),
  build: S("Titanium foldable design, 5.2mm open, Touch ID, IP68, 254g", "تصميم قابل للطي من التيتانيوم، 5.2 ملم عند الفتح، Touch ID، مقاومة IP68، الوزن 254 غ"),
};

const s26Ultra = (tb) => ({
  display: S("6.9-inch QHD+ Dynamic AMOLED 2X, 120Hz, 2,600 nits, Privacy Display", "شاشة Dynamic AMOLED 2X بدقة QHD+ مقاس 6.9 بوصة، 120Hz، سطوع 2600 شمعة، ميزة شاشة الخصوصية"),
  chip: S(`Snapdragon 8 Elite Gen 5 for Galaxy, ${tb ? "16" : "12"}GB RAM`, `معالج Snapdragon 8 Elite Gen 5 for Galaxy، ذاكرة ${tb ? "16" : "12"}GB RAM`),
  camera: S("200MP Wide, 50MP Ultra Wide, 50MP 5x Telephoto, 10MP 3x Telephoto", "كاميرا رئيسية 200MP، واسعة جداً 50MP، مقرّبة 50MP بتقريب 5x، ومقرّبة 10MP بتقريب 3x"),
  front: S("12MP front camera, 4K video", "كاميرا أمامية 12MP، فيديو 4K"),
  battery: S("5,000mAh, 60W wired fast charging", "بطارية 5000 ملي أمبير، شحن سلكي سريع 60 واط"),
  build: S("Built-in S Pen, Gorilla Armor 2, IP68, 214g", "قلم S Pen مدمج، زجاج Gorilla Armor 2، مقاومة IP68، الوزن 214 غ"),
});

const flip7 = {
  display: S("6.9-inch main + 4.1-inch FlexWindow cover screen, 120Hz", "شاشة رئيسية 6.9 بوصة + شاشة خارجية FlexWindow مقاس 4.1 بوصة، 120Hz"),
  chip: S("Exynos 2500, 12GB RAM", "معالج Exynos 2500، ذاكرة 12GB RAM"),
  camera: S("50MP Wide, 12MP Ultra Wide", "كاميرا رئيسية 50MP، وواسعة جداً 12MP"),
  front: S("10MP front camera", "كاميرا أمامية 10MP"),
  battery: S("4,300mAh, 25W fast charging", "بطارية 4300 ملي أمبير، شحن سريع 25 واط"),
  build: S("Compact flip design, Armor Aluminum frame, IP48, 188g", "تصميم صدفي مدمج، إطار Armor Aluminum، مقاومة IP48، الوزن 188 غ"),
};

const s25 = {
  display: S("6.2-inch FHD+ Dynamic AMOLED 2X, 120Hz", "شاشة Dynamic AMOLED 2X بدقة FHD+ مقاس 6.2 بوصة، 120Hz"),
  chip: S("Snapdragon 8 Elite for Galaxy, 12GB RAM", "معالج Snapdragon 8 Elite for Galaxy، ذاكرة 12GB RAM"),
  camera: S("50MP Wide, 12MP Ultra Wide, 10MP 3x Telephoto", "كاميرا رئيسية 50MP، واسعة جداً 12MP، ومقرّبة 10MP بتقريب 3x"),
  front: S("12MP front camera", "كاميرا أمامية 12MP"),
  battery: S("4,000mAh, 25W fast charging", "بطارية 4000 ملي أمبير، شحن سريع 25 واط"),
  build: S("Armor Aluminum frame, Gorilla Glass Victus 2, IP68, 162g", "إطار Armor Aluminum، زجاج Gorilla Glass Victus 2، مقاومة IP68، الوزن 162 غ"),
};

const fold6 = {
  display: S("7.6-inch main + 6.3-inch cover Dynamic AMOLED 2X, 120Hz", "شاشة رئيسية 7.6 بوصة + شاشة خارجية 6.3 بوصة Dynamic AMOLED 2X، 120Hz"),
  chip: S("Snapdragon 8 Gen 3 for Galaxy, 12GB RAM", "معالج Snapdragon 8 Gen 3 for Galaxy، ذاكرة 12GB RAM"),
  camera: S("50MP Wide, 12MP Ultra Wide, 10MP 3x Telephoto", "كاميرا رئيسية 50MP، واسعة جداً 12MP، ومقرّبة 10MP بتقريب 3x"),
  front: S("10MP cover camera + 4MP under-display camera", "كاميرا خارجية 10MP + كاميرا 4MP تحت الشاشة"),
  battery: S("4,400mAh, 25W fast charging", "بطارية 4400 ملي أمبير، شحن سريع 25 واط"),
  build: S("Armor Aluminum frame, IP48, 239g", "إطار Armor Aluminum، مقاومة IP48، الوزن 239 غ"),
};

const s26 = {
  display: S("6.3-inch FHD+ Dynamic AMOLED 2X, 120Hz, 2,600 nits", "شاشة Dynamic AMOLED 2X بدقة FHD+ مقاس 6.3 بوصة، 120Hz، سطوع 2600 شمعة"),
  chip: S("Exynos 2600 or Snapdragon 8 Elite Gen 5 (varies by region), 12GB RAM", "معالج Exynos 2600 أو Snapdragon 8 Elite Gen 5 (حسب المنطقة)، ذاكرة 12GB RAM"),
  camera: S("50MP Wide, 12MP Ultra Wide, 10MP 3x Telephoto", "كاميرا رئيسية 50MP، واسعة جداً 12MP، ومقرّبة 10MP بتقريب 3x"),
  front: S("12MP front camera", "كاميرا أمامية 12MP"),
  battery: S("4,300mAh, 25W fast charging", "بطارية 4300 ملي أمبير، شحن سريع 25 واط"),
  build: S("Armor Aluminum frame, Gorilla Glass Victus 2, IP68, 167g", "إطار Armor Aluminum، زجاج Gorilla Glass Victus 2، مقاومة IP68، الوزن 167 غ"),
};

const s25Edge = {
  display: S("6.7-inch QHD+ Dynamic AMOLED 2X, 120Hz", "شاشة Dynamic AMOLED 2X بدقة QHD+ مقاس 6.7 بوصة، 120Hz"),
  chip: S("Snapdragon 8 Elite for Galaxy, 12GB RAM", "معالج Snapdragon 8 Elite for Galaxy، ذاكرة 12GB RAM"),
  camera: S("200MP Wide, 12MP Ultra Wide", "كاميرا رئيسية 200MP، وواسعة جداً 12MP"),
  front: S("12MP front camera", "كاميرا أمامية 12MP"),
  battery: S("3,900mAh, 25W fast charging", "بطارية 3900 ملي أمبير، شحن سريع 25 واط"),
  build: S("Titanium frame, only 5.8mm thin, Gorilla Glass Ceramic 2, IP68, 163g", "إطار تيتانيوم بسماكة 5.8 ملم فقط، زجاج Gorilla Glass Ceramic 2، مقاومة IP68، الوزن 163 غ"),
};

const s25Ultra = {
  display: S("6.9-inch QHD+ Dynamic AMOLED 2X, 120Hz, 2,600 nits", "شاشة Dynamic AMOLED 2X بدقة QHD+ مقاس 6.9 بوصة، 120Hz، سطوع 2600 شمعة"),
  chip: S("Snapdragon 8 Elite for Galaxy, 12GB RAM", "معالج Snapdragon 8 Elite for Galaxy، ذاكرة 12GB RAM"),
  camera: S("200MP Wide, 50MP Ultra Wide, 50MP 5x Telephoto, 10MP 3x Telephoto", "كاميرا رئيسية 200MP، واسعة جداً 50MP، مقرّبة 50MP بتقريب 5x، ومقرّبة 10MP بتقريب 3x"),
  front: S("12MP front camera", "كاميرا أمامية 12MP"),
  battery: S("5,000mAh, 45W fast charging", "بطارية 5000 ملي أمبير، شحن سريع 45 واط"),
  build: S("Titanium frame, built-in S Pen, Gorilla Armor 2, IP68, 218g", "إطار تيتانيوم، قلم S Pen مدمج، زجاج Gorilla Armor 2، مقاومة IP68، الوزن 218 غ"),
};

const fold7 = {
  display: S("8.0-inch main + 6.5-inch cover Dynamic AMOLED 2X, 120Hz", "شاشة رئيسية 8.0 بوصة + شاشة خارجية 6.5 بوصة Dynamic AMOLED 2X، 120Hz"),
  chip: S("Snapdragon 8 Elite for Galaxy, 16GB RAM", "معالج Snapdragon 8 Elite for Galaxy، ذاكرة 16GB RAM"),
  camera: S("200MP Wide, 12MP Ultra Wide, 10MP 3x Telephoto", "كاميرا رئيسية 200MP، واسعة جداً 12MP، ومقرّبة 10MP بتقريب 3x"),
  front: S("10MP cover camera + 10MP inner camera", "كاميرا خارجية 10MP + كاميرا داخلية 10MP"),
  battery: S("4,400mAh, 25W fast charging", "بطارية 4400 ملي أمبير، شحن سريع 25 واط"),
  build: S("8.9mm folded, 4.2mm unfolded, Armor Aluminum frame, IP48, 215g", "8.9 ملم مطوياً و4.2 ملم مفتوحاً، إطار Armor Aluminum، مقاومة IP48، الوزن 215 غ"),
};

export const products = [
  // ---------- iPhone ----------
  { id: "ip18pm-burgundy-2tb", brand: "iphone", family: "iphone-pro", name: "iPhone 18 Pro Max", color: S("Burgundy", "عنّابي"), hex: "#5e1b2a", mm: 8.7, storage: "2 TB", tag: S("New", "جديد"), specs: iphone18Pro(true) },
  { id: "ipair-skyblue-256", brand: "iphone", family: "iphone-air", name: "iPhone Air", color: S("Sky Blue", "أزرق سماوي"), hex: "#c4daec", mm: 5.6, storage: "256 GB", specs: iphoneAir },
  { id: "ip16-ultramarine-128", brand: "iphone", family: "iphone-16", name: "iPhone 16", color: S("Ultramarine", "أزرق لازوردي"), hex: "#5f6be0", mm: 7.8, storage: "128 GB", specs: iphone16(false) },
  { id: "ip17-sage-512", brand: "iphone", family: "iphone-17", name: "iPhone 17", color: S("Sage", "أخضر مريمي"), hex: "#b6bfa3", mm: 8.0, storage: "512 GB", specs: iphone17 },
  { id: "ip18p-glacier-1tb", brand: "iphone", family: "iphone-pro", name: "iPhone 18 Pro", color: S("Glacier", "أزرق جليدي"), hex: "#cfdfe8", mm: 8.7, storage: "1 TB", tag: S("New", "جديد"), specs: iphone18Pro(false) },
  { id: "ipduo-nightsky-512", brand: "iphone", family: "iphone-duo", name: "iPhone Duo", color: S("Night Sky", "سماء الليل"), hex: "#262b38", mm: 11.3, storage: "512 GB", tag: S("Foldable", "قابل للطي"), specs: iphoneDuo },
  { id: "ip17e-pink-256", brand: "iphone", family: "iphone-e", name: "iPhone 17e", color: S("Soft Pink", "وردي ناعم"), hex: "#f2d9d6", mm: 7.8, storage: "256 GB", specs: iphone17e },
  { id: "ip16plus-teal-256", brand: "iphone", family: "iphone-16", name: "iPhone 16 Plus", color: S("Teal", "أزرق مخضرّ"), hex: "#7fbfb8", mm: 7.8, storage: "256 GB", specs: iphone16(true) },
  { id: "ip18p-burgundy-256", brand: "iphone", family: "iphone-pro", name: "iPhone 18 Pro", color: S("Burgundy", "عنّابي"), hex: "#5e1b2a", mm: 8.7, storage: "256 GB", tag: S("New", "جديد"), specs: iphone18Pro(false) },
  { id: "ipair-gold-512", brand: "iphone", family: "iphone-air", name: "iPhone Air", color: S("Light Gold", "ذهبي فاتح"), hex: "#eadfc8", mm: 5.6, storage: "512 GB", specs: iphoneAir },

  // ---------- Galaxy ----------
  { id: "s26u-violet-1tb", brand: "galaxy", family: "galaxy-ultra26", name: "Galaxy S26 Ultra", color: S("Cobalt Violet", "بنفسجي كوبالتي"), hex: "#5d5578", mm: 7.9, storage: "1 TB", tag: S("New", "جديد"), specs: s26Ultra(true) },
  { id: "flip7-mint-256", brand: "galaxy", family: "galaxy-flip", name: "Galaxy Z Flip7", color: S("Mint", "نعناعي"), hex: "#cde6d6", mm: 13.7, storage: "256 GB", tag: S("Foldable", "قابل للطي"), specs: flip7 },
  { id: "s25-navy-128", brand: "galaxy", family: "galaxy-s", name: "Galaxy S25", color: S("Navy", "كحلي"), hex: "#28324d", mm: 7.2, storage: "128 GB", specs: s25 },
  { id: "fold6-silver-512", brand: "galaxy", family: "galaxy-fold", name: "Galaxy Z Fold6", color: S("Silver Shadow", "فضي داكن"), hex: "#c9cbcf", mm: 12.1, storage: "512 GB", tag: S("Foldable", "قابل للطي"), specs: fold6 },
  { id: "s26-skyblue-256", brand: "galaxy", family: "galaxy-s26", name: "Galaxy S26", color: S("Sky Blue", "أزرق سماوي"), hex: "#bcd2e8", mm: 7.2, storage: "256 GB", tag: S("New", "جديد"), specs: s26 },
  { id: "s25edge-icyblue-512", brand: "galaxy", family: "galaxy-edge", name: "Galaxy S25 Edge", color: S("Titanium Icy Blue", "تيتانيوم أزرق جليدي"), hex: "#c9d7e2", mm: 5.8, storage: "512 GB", specs: s25Edge },
  { id: "s26u-pinkgold-512", brand: "galaxy", family: "galaxy-ultra26", name: "Galaxy S26 Ultra", color: S("Pink Gold", "ذهبي وردي"), hex: "#e9d2c6", mm: 7.9, storage: "512 GB", tag: S("New", "جديد"), specs: s26Ultra(false) },
  { id: "flip7-coral-512", brand: "galaxy", family: "galaxy-flip", name: "Galaxy Z Flip7", color: S("Coral Red", "أحمر مرجاني"), hex: "#e35a48", mm: 13.7, storage: "512 GB", tag: S("Foldable", "قابل للطي"), specs: flip7 },
  { id: "s25u-black-256", brand: "galaxy", family: "galaxy-ultra", name: "Galaxy S25 Ultra", color: S("Titanium Black", "تيتانيوم أسود"), hex: "#2a2b2e", mm: 8.2, frame: "#a7a39b", storage: "256 GB", specs: s25Ultra },
  { id: "fold7-jetblack-1tb", brand: "galaxy", family: "galaxy-fold", name: "Galaxy Z Fold7", color: S("Jet Black", "أسود فاحم"), hex: "#151619", mm: 8.9, storage: "1 TB", tag: S("Foldable", "قابل للطي"), specs: fold7 },
];
