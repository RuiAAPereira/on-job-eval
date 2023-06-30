import Head from "next/head";

interface PageHeadProps {
    title: string;
}

export default function PageHead({ title }: PageHeadProps) {
    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content="Avaliação On Job Training" />
        <meta name="author" content="Rui Pereira" />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    );
}
