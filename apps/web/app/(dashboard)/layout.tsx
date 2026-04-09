import Sidebar from '@/components/ui/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main
        className="min-h-screen"
        style={{ marginLeft: 'var(--sidebar-width)', padding: '32px 40px 48px' }}
      >
        {children}
      </main>
    </>
  );
}
