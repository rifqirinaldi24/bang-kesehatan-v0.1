import { Helmet } from 'react-helmet-async';

export default function SEOHead({ title, description, path = '' }) {
  const siteName = 'Senadee';
  const fullTitle = title ? `${title} — ${siteName}` : `${siteName} — Portal Kesehatan Preventif`;
  const defaultDescription =
    'Senadee adalah portal media kesehatan tepercaya untuk keluarga muda Indonesia. Semua konten diverifikasi oleh tim medis profesional.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <link rel="canonical" href={`https://bangkesehatan.id${path}`} />
    </Helmet>
  );
}
