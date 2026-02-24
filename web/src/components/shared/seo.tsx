import { Helmet } from "react-helmet-async";
import { SiteSettings } from "@/types";
import { defaultSettings } from "@/lib/constants";

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  settings?: SiteSettings | null;
};

export function Seo({ title, description, path = "/", keywords = [], image, canonical, settings }: SeoProps) {
  const config = settings || defaultSettings;
  const pageTitle = title ? `${title} | ${config.companyName}` : config.companyName;
  const pageDescription = description || config.shortIntro;
  const url = canonical || `https://webmitra.tech${path}`;
  const ogImage = image || "https://webmitra.tech/og-image.svg";
  const seoKeywords = keywords.filter(Boolean);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.companyName,
    url: "https://webmitra.tech",
    email: config.contact.email,
    telephone: config.contact.phone,
    address: config.contact.address,
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {seoKeywords.length > 0 ? <meta name="keywords" content={seoKeywords.join(", ")} /> : null}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
