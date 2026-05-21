import { getDashboard, getTracker } from "@/lib/api";
import Link from "next/link";

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-800",
  em_transito: "bg-blue-100 text-blue-800",
  entregue: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
  registrada: "bg-slate-100 text-slate-800",
  na_fila: "bg-indigo-100 text-indigo-800",
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  em_transito: "Em Trânsito",
  entregue: "Entregue",
  cancelado: "Cancelado",
  registrada: "Registrada",
  na_fila: "Na Fila",
};

function formatHora(hora: string | null): string {
  if (!hora) return "—";
  return hora.substring(0, 5);
}

function formatData(data: string | null): string {
  if (!data) return "—";
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR");
}

export default async function DashboardPage() {
  const [metricas, transito] = await Promise.all([
    getDashboard().catch(() => ({
      em_aberto: 0,
      hoje: 0,
      em_transito: 0,
      entregues_7d: 0,
    })),
    getTracker().catch(() => [] as any[]),
  ]);

  const cards = [
    { label: "Em Aberto", value: metricas.em_aberto, color: "bg-slate-800 text-white" },
    { label: "Hoje", value: metricas.hoje, color: "bg-indigo-500 text-white" },
    { label: "Em Trânsito", value: metricas.em_transito, color: "bg-blue-500 text-white" },
    { label: "Entregues (7d)", value: metricas.entregues_7d, color: "bg-green-500 text-white" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500">Visão geral das entregas</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.color} rounded-xl p-4 shadow-sm`}
          >
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm opacity-80 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Em Trânsito */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">
            Em Trânsito ({transito.length})
          </h3>
          <Link
            href="/entregas?status=em_transito"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3 font-medium">Pedido</th>
                <th className="text-left p-3 font-medium">Cliente</th>
                <th className="text-left p-3 font-medium">Bairro</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Entregador</th>
                <th className="text-left p-3 font-medium">Previsão</th>
              </tr>
            </thead>
            <tbody>
              {transito.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Nenhuma entrega em trânsito.
                  </td>
                </tr>
              ) : (
                transito.map((e: any) => (
                  <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">{e.identrega_erp || e.id}</td>
                    <td className="p-3">{e.nome_cliente || e.cliente}</td>
                    <td className="p-3">{e.bairro}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[e.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusLabels[e.status] || e.status}
                      </span>
                    </td>
                    <td className="p-3">{e.entregador_nome || "—"}</td>
                    <td className="p-3 text-xs">
                      {formatData(e.data_previsao)} {formatHora(e.hora_previsao)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
