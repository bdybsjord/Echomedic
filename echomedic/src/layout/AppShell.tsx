import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
