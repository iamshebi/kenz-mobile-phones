import { site, content } from "./content";

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
      images: ["/logo.jpg"],
      type: "website",
      locale: lang === "ar" ? "ar_AE" : "en_AE",
    },
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
