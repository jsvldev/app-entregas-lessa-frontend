import { getZonas, getZonasCompleto } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ZonasPage({
  searchParams,
}: {
  searchParams: { loja?: string };
}) {
  const loja = searchParams.loja ? Number(searchParams.loja) : undefined;
  const [zonas, cobertura] = await Promise.all([
    getZonas(loja).catch(() => []),
    getZonasCompleto(loja).catch(() => null),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Zonas de Entrega</h2>
        <p className="text-sm text-slate-500">
          Configuração operacional por bairro, loja e SLA
        </p>
      </div>

      {cobertura && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-2xl font-bold">{cobertura.zonas_cadastradas}</p>
            <p className="text-sm text-slate-500">Zonas</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-2xl font-bold">{cobertura.bairros_cobertos}</p>
            <p className="text-sm text-slate-500">Bairros cobertos</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-2xl font-bold">{cobertura.bairros_descobertos}</p>
            <p className="text-sm text-slate-500">Descobertos</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-2xl font-bold">{cobertura.total_mapeamentos}</p>
            <p className="text-sm text-slate-500">Mapeamentos</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3 font-medium">Zona</th>
              <th className="text-left p-3 font-medium">Loja</th>
              <th className="text-left p-3 font-medium">SLA</th>
              <th className="text-left p-3 font-medium">Prioridade</th>
              <th className="text-left p-3 font-medium">Bairros</th>
            </tr>
          </thead>
          <tbody>
            {zonas.map((zona) => (
              <tr key={zona.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{zona.nome}</td>
                <td className="p-3">{zona.codloja}</td>
                <td className="p-3">{zona.sla_minutos} min</td>
                <td className="p-3">{zona.prioridade}</td>
                <td className="p-3">{zona.bairros.join(", ")}</td>
              </tr>
            ))}
            {zonas.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Nenhuma zona cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
