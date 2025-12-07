import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AppShell() {
  return (
    <div className="echomedic-gradient min-h-screen flex text-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col backdrop-blur-xl bg-slate-950/40">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

