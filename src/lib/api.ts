/** Backend API base URL */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface DashboardMetricas {
  em_aberto: number;
  hoje: number;
  em_transito: number;
  entregues_7d: number;
}

export interface Entrega {
  id: number;
  identrega_erp?: number;
  nome_cliente?: string;
  cliente?: string;
  endereco: string;
  bairro: string;
  cidade?: string;
  status?: string;
  prioridade?: number;
  observacao?: string | null;
  data_previsao?: string | null;
  hora_previsao?: string | null;
  codentreg?: number | null;
  entregador_id?: number | null;
  entregador_nome?: string | null;
  created_at?: string;
  updated_at?: string;
  numero_pedido?: string;
  lat?: number | null;
  lng?: number | null;
}

export interface ZonaEntrega {
  id: number;
  nome: string;
  codloja: number;
  sla_minutos: number;
  prioridade: number;
  taxa_entrega: number | null;
  bairros: string[];
  qtd_bairros: number;
}

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export async function getDashboard(loja?: number): Promise<DashboardMetricas> {
  const params = loja ? `?codloja=${loja}` : "";
  return fetchApi<DashboardMetricas>(`/painel/dashboard${params}`);
}

export async function getTracker(loja?: number): Promise<Entrega[]> {
  const params = loja ? `?codloja=${loja}` : "";
  return fetchApi<Entrega[]>(`/painel/tracker${params}`);
}

export async function getEntregas(
  status?: string,
  loja?: number,
  limit = 100,
): Promise<Entrega[]> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (loja) params.set("codloja", String(loja));
  params.set("limit", String(limit));
  return fetchApi<Entrega[]>(`/painel/entregas?${params}`);
}

export async function getZonas(loja?: number): Promise<ZonaEntrega[]> {
  const params = loja ? `?codloja=${loja}` : "";
  return fetchApi<ZonaEntrega[]>(`/painel/zonas${params}`);
}

export async function getEntregadores() {
  return fetchApi<any[]>("/painel/entregadores");
}
