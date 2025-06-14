import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template:'%s',
        default: 'Authentication'
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
