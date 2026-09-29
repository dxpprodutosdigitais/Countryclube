/**
 * Mapa de imagens do site.
 *
 * - `OFICIAL`: URLs reais em lagoanossa.com.br (fotos de História e logo).
 * - `STOCK`: placeholders (Unsplash) usados onde a foto real ainda não foi
 *   coletada. Ver CONTEUDO-PENDENTE.md — substituir por fotos do clube
 *   (`public/images/modalidades/<slug>.jpg`, `public/images/infraestrutura/<slug>.jpg`).
 */
export const OFICIAL = {
  logo: "/logo-country-clube-formiga.png",
  logoRemoto: "https://lagoanossa.com.br/wp-content/uploads/2021/02/logo-Country-Clube-de-Formiga.png",
  historia1: "https://lagoanossa.com.br/wp-content/uploads/2021/03/foto_historia1.jpg",
  historia2: "https://lagoanossa.com.br/wp-content/uploads/2021/03/foto_historia2.jpg",
  historia3: "https://lagoanossa.com.br/wp-content/uploads/2021/03/foto_historia3.jpg",
  historia4: "https://lagoanossa.com.br/wp-content/uploads/2021/03/foto_historia4.jpg",
  historia5: "https://lagoanossa.com.br/wp-content/uploads/2021/03/foto_historia5.jpg",
  historia6: "https://lagoanossa.com.br/wp-content/uploads/2021/03/foto_historia6.jpg",
} as const;

const U = (id: string, w = 1400) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const STOCK = {
  praia: U("photo-1507525428034-b723cf961d3e"),
  lagoa: U("photo-1500530855697-b586d89ba3ee"),
  lagoaSunset: U("photo-1473773508845-188df298d2d1"),
  entardecer: U("photo-1499678329028-101435549a4e", 1920),
  tenis: U("photo-1554068865-24cecd4e34b8"),
  tenis2: U("photo-1622279457486-62dcc4a431d6"),
  futebol: U("photo-1459865264687-595d652de67e"),
  futebol2: U("photo-1551958219-acbc608c6377"),
  academia: U("photo-1534438327276-14e5300c3a48"),
  academia2: U("photo-1571902943202-507ec2618e8f"),
  piscina: U("photo-1576013551627-0cc20b96c2a7"),
  volei: U("photo-1612872087720-bb876e2e67d1"),
  beachTenis: U("photo-1626224583764-f87db24ac4ea"),
  futevolei: U("photo-1517649763962-0c623066013b"),
  churrasco: U("photo-1529543544282-ea669407fca3"),
  churrasco2: U("photo-1555939594-58d7cb561ad1"),
  familia: U("photo-1502086223501-7ea6ecd79368"),
  evento: U("photo-1492684223066-81342ee5ff30"),
  show: U("photo-1501281668745-f7f57925c3b4"),
  casamento: U("photo-1519741497674-611481863552"),
  salao: U("photo-1519671482749-fd09be7ccebf"),
  quadraCoberta: U("photo-1518614846840-bd2f49df1a4d"),
  deck: U("photo-1499793983690-e29da59ef1c2"),
  caminhada: U("photo-1551632811-561732d1e306"),
  natacao: U("photo-1530549387789-4c1017266635"),
  hidro: U("photo-1576678927484-cc907957088c"),
  yoga: U("photo-1599901860904-17e6ed7083a0"),
  pilates: U("photo-1518611012118-696072aa579a"),
  diretoria: U("photo-1521737711867-e3b97375f902"),
  basquete: U("photo-1546519638-68e109498ffc"),
  futsal: U("photo-1575361204480-aadea25e6e68"),
  ballet: U("photo-1508807526345-15e9b5f4eaff"),
  jiujitsu: U("photo-1555597673-b21d5c935865"),
  karate: U("photo-1544367567-0f2fcb009e0b"),
  musculacao: U("photo-1581009146145-b5ef050c2e1e"),
  funcional: U("photo-1517836357463-d25dfeac3438"),
  localizada: U("photo-1518310383802-640c2de311b2"),
  fisioterapia: U("photo-1559757148-5c350d0d3c56"),
  massagem: U("photo-1544161515-4ab6ce6db874"),
  peteca: U("photo-1461896836934-ffe607ba8211"),
  bar: U("photo-1514933651103-005eec06c04b"),
  restaurante: U("photo-1552566626-52f8b828add9"),
  quiosque: U("photo-1533105079780-92b9be482077"),
  sinuca: U("photo-1575553939928-d4d1a2bf2c7d"),
  parquinho: U("photo-1596464716127-f2a82984de30"),
  sauna: U("photo-1583417267826-aebc4d1542e1"),
  secretaria: U("photo-1497366216548-37526070297c"),
  ginasio: U("photo-1504450758481-7338eba7524a"),
  artesMarciais: U("photo-1552072092-7f9b8d63efcb"),
  criancas: U("photo-1472162072942-cd5147eb3902"),
  rock: U("photo-1470229722913-7c0e2dbbafd3"),
  festaJunina: U("photo-1533174072545-7a4b6ad7a6c3"),
  copa: U("photo-1489944440615-453fc2b6a9a9"),
  aniversario: U("photo-1464349095431-e9a21285b5f3"),
} as const;

export type StockKey = keyof typeof STOCK;

/* Prévia estática (Artifact): o visualizador bloqueia imagens externas, então
   NEXT_PUBLIC_LOCAL_PLACEHOLDERS=1 troca todas as fotos por SVGs ilustrativos locais. */
const LOCAL = process.env.NEXT_PUBLIC_LOCAL_PLACEHOLDERS === "1";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const IMG = (LOCAL
  ? Object.fromEntries(Object.keys(STOCK).map((k) => [k, `${BASE}/images/placeholder/${k}.svg`]))
  : STOCK) as Record<StockKey, string>;
export const FOTOS = (LOCAL
  ? { ...OFICIAL, ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((i) => [`historia${i}`, `${BASE}/images/placeholder/historia${i}.svg`])) }
  : OFICIAL) as typeof OFICIAL;
