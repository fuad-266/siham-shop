import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { CartProvider } from '@/providers/cart-provider';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-display',
});

export const metadata: Metadata = {
    title: 'Alora Abayas | Premium Modest Fashion',
    description: 'Production-level e-commerce store for Alora Abayas, offering elegant and high-quality abayas.',
    keywords: ['abaya', 'modest fashion', 'hijab', 'premium abayas', 'Ethiopia fashion'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body className="min-h-screen flex flex-col font-sans antialiased">
                <AuthProvider>
                    <CartProvider>
                        <Toaster position="top-center" />
                        <Header />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
