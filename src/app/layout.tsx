import * as React from 'react';
import CustomLayout from '@/components/CustomLayout';

export const metadata = {
  title: "Flights Search",
  description: "Flights search app by Arbak Martirosyan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomLayout>{children}</CustomLayout>
      </body>
    </html>
  );
}
