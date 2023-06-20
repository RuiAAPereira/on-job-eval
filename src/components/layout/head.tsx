import Head from "next/head";

interface PageHeadProps {
    title: string;
}

export default function PageHead({ title }: PageHeadProps) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content="Avaliação On Job Training" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}
