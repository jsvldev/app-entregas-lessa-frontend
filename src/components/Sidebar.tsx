import Link from "next/link";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/entregas", label: "Entregas", icon: "🚚" },
  { href: "/zonas", label: "Zonas", icon: "🗺️" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-lg font-bold">Lessa Entregas</h1>
        <p className="text-xs text-slate-400">Painel de Gestão</p>
      </div>
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        v0.2.0
      </div>
    </aside>
  );
}
