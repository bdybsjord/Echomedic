export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Echomedic</h2>
      <nav className="flex flex-col gap-2">
        <a href="/" className="hover:bg-gray-700 px-3 py-2 rounded">Dashboard</a>
        <a href="/login" className="hover:bg-gray-700 px-3 py-2 rounded">Login</a>
      </nav>
    </aside>
  );
}
