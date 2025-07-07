import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/SimpleNotificationContext';
import OfflineManager from '@/components/offline/OfflineManager';
import OfflineNotification from '@/components/offline/OfflineNotification';
import OfflineInit from './offline-init';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CareerPath - Karyera yo\'lingizni rejalashtiring',
  description: 'Karyera yo\'lingizni rejalashtirish va rivojlantirish uchun AI asosidagi platforma',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CareerPath',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    shortcut: '/icons/favicon.ico',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#2563EB',
      },
    ],
  },
  themeColor: '#2563EB',
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="h-full">
      <head>
        <meta name='application-name' content='CareerPath' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='CareerPath' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='msapplication-TileColor' content='#2563EB' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta name='theme-color' content='#2563EB' />
        {/* Accessibility improvements */}
        <meta name="description" content="Karyera yo'lingizni rejalashtirish va rivojlantirish uchun AI asosidagi platforma" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#2563EB' />
        <link rel='shortcut icon' href='/favicon.ico' />
      </head>
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <NotificationProvider>
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-blue-600 focus:text-white focus:z-50"
            >
              Asosiy tarkibga o'tish
            </a>
            
            {/* Add an ID to main content for skip link */}
            <main id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </main>
            
            <OfflineManager />
            <OfflineNotification />
            <OfflineInit />
            <PerformanceMonitor />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
