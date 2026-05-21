import { getEntregas } from "@/lib/api";

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-800",
  "em_transito": "bg-blue-100 text-blue-800",
  entregue: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  em_transito: "Em Trânsito",
  entregue: "Entregue",
  cancelado: "Cancelado",
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

const filtros = [
  { label: "Todas", value: "" },
  { label: "Pendentes", value: "pendente" },
  { label: "Em Trânsito", value: "em_transito" },
  { label: "Entregues", value: "entregue" },
  { label: "Canceladas", value: "cancelado" },
];

export default async function EntregasPage({
  searchParams,
}: {
  searchParams: { status?: string; loja?: string };
}) {
  const status = searchParams.status || "";
  const loja = searchParams.loja ? parseInt(searchParams.loja) : undefined;

  const entregas = await getEntregas(status || undefined, loja, 200).catch(
    () => [] as any[],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Entregas</h2>
        <p className="text-sm text-slate-500">
          {entregas.length} entrega{entregas.length !== 1 ? "s" : ""} encontrada{entregas.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filtros.map((f) => (
          <a
            key={f.value}
            href={
              f.value
                ? `/entregas?status=${f.value}${loja ? `&loja=${loja}` : ""}`
                : `/entregas${loja ? `?loja=${loja}` : ""}`
            }
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === f.value
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3 font-medium">Pedido</th>
                <th className="text-left p-3 font-medium">Cliente</th>
                <th className="text-left p-3 font-medium">Endereço</th>
                <th className="text-left p-3 font-medium">Bairro</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Entregador</th>
                <th className="text-left p-3 font-medium">Previsão</th>
                <th className="text-left p-3 font-medium">Obs</th>
              </tr>
            </thead>
            <tbody>
              {entregas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Nenhuma entrega encontrada.
                  </td>
                </tr>
              ) : (
                entregas.map((e: any) => (
                  <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">{e.numero_pedido}</td>
                    <td className="p-3">{e.cliente}</td>
                    <td className="p-3 max-w-[200px] truncate">{e.endereco}</td>
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
                    <td className="p-3 text-xs whitespace-nowrap">
                      {formatData(e.data_previsao)} {formatHora(e.hora_previsao)}
                    </td>
                    <td className="p-3 text-xs max-w-[150px] truncate text-slate-500">
                      {e.observacao || "—"}
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
