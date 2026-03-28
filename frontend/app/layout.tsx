import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'EduMerge Admission Management',
  description: 'Minimal Admission Management & CRM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
