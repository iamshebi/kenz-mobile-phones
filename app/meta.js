import { site, content } from "./content";

// Link preview image (WhatsApp, Facebook, X…): 1200×630 banner, English or Arabic
export const ogImage = (lang) => ({ url: lang === "ar" ? "/og-ar.jpg" : "/og.jpg", width: 1200, height: 630, alt: lang === "ar" ? "كنز للهواتف المتحركة، رأس الخيمة" : "KENZ Mobile Phones, Ras Al Khaimah" });

export function buildMetadata(lang) {
  const t = content[lang];
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    alternates: {
      canonical: t.path,
      languages: { en: "/", ar: "/ar", "x-default": "/" },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.ogDescription,
      images: [ogImage(lang)],
      type: "website",
      siteName: lang === "ar" ? "كنز للهواتف المتحركة" : "KENZ Mobile Phones",
      locale: lang === "ar" ? "ar_AE" : "en_AE",
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.ogDescription, images: [ogImage(lang).url] },
  };
}

export const viewport = { themeColor: "#fbfaf7" };

export function schema(lang) {
  const t = content[lang];
  return {
    "@context": "https://schema.org",
    "@type": ["MobilePhoneStore", "ElectronicsStore"],
    name: lang === "ar" ? "كنز للهواتف المتحركة" : "KENZ Mobile Phones",
    alternateName: lang === "ar" ? "KENZ Mobile Phones" : "كنز الهواتف المتحركة",
    description: t.meta.description,
    image: `${site.url}/logo.jpg`,
    logo: `${site.url}/logo.jpg`,
    telephone: site.phoneIntl,
    url: `${site.url}${t.path === "/" ? "" : t.path}`,
    hasMap: site.mapsLink,
    inLanguage: lang,
    address: {
      "@type": "PostalAddress",
      streetAddress: lang === "ar" ? "مركز ميسوني، الظيت الجنوبي" : "Maisooni Center, Al Dhait South",
      addressLocality: lang === "ar" ? "رأس الخيمة" : "Ras Al Khaimah",
      addressCountry: "AE",
    },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "23:59",
    }],
    paymentAccepted: "Cash, Credit Card, Tabby, Tamara",
  };
}

export function shopMeta(lang) {
  const ar = lang === "ar";
  const title = ar ? "المتجر | كنز للهواتف المتحركة، رأس الخيمة" : "Shop | KENZ Mobile Phones, Ras Al Khaimah";
  const description = ar
    ? "تصفح هواتف آيفون وجالكسي وإكسسوارات أبل وسامسونج وهواوي الأصلية والسماعات والشواحن والساعات الذكية والبخور في كنز للهواتف المتحركة، الظيت الجنوبي، رأس الخيمة. اشترِ أو استفسر عبر واتساب."
    : "Browse iPhone and Galaxy phones, genuine Apple, Samsung and Huawei accessories, audio, chargers, smart watches, bakhoor and more at KENZ Mobile Phones, Al Dhait South, Ras Al Khaimah. Buy or enquire on WhatsApp.";
  return {
    title, description,
    alternates: { canonical: ar ? "/ar/shop" : "/shop", languages: { en: "/shop", ar: "/ar/shop" } },
    openGraph: { title, description, images: [ogImage(lang)], type: "website", locale: ar ? "ar_AE" : "en_AE" },
    twitter: { card: "summary_large_image", title, description, images: [ogImage(lang).url] },
  };
}
