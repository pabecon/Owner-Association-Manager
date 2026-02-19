export interface LegislationItem {
  id: string;
  shortTitle: string;
  fullTitle: string;
  publishedIn: string;
  status: "in_vigoare" | "abrogata";
  url: string;
  content?: string;
}

export const LEGISLATION_ITEMS: LegislationItem[] = [
  {
    id: "legea-114-1996",
    shortTitle: "Legea nr. 114/1996",
    fullTitle: "Legea locuinței nr. 114 din 11 octombrie 1996",
    publishedIn: "Monitorul Oficial nr. 393 din 31 decembrie 1997 (republicare)",
    status: "in_vigoare",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/8597",
  },
  {
    id: "legea-10-1995",
    shortTitle: "Legea nr. 10/1995",
    fullTitle: "Legea nr. 10 din 18 ianuarie 1995 privind calitatea in constructii",
    publishedIn: "M.O. nr. 765 din 30 septembrie 2016 (republicata)",
    status: "in_vigoare",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/5729",
  },
  {
    id: "og-85-2001",
    shortTitle: "OG nr. 85/2001",
    fullTitle: "Ordonanta Guvernului nr. 85 din 30 august 2001 privind organizarea si functionarea asociatiilor de proprietari",
    publishedIn: "Monitorul Oficial nr. 544 din 1 septembrie 2001",
    status: "abrogata",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/30381",
  },
  {
    id: "hg-400-2003",
    shortTitle: "HG nr. 400/2003",
    fullTitle: "Hotararea Guvernului nr. 400 din 2 aprilie 2003 pentru aprobarea Normelor metodologice privind organizarea si functionarea asociatiilor de proprietari",
    publishedIn: "Monitorul Oficial nr. 311 din 8 mai 2003",
    status: "abrogata",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/43623",
  },
  {
    id: "hg-1386-2003",
    shortTitle: "HG nr. 1.386/2003",
    fullTitle: "Hotararea Guvernului nr. 1.386 din 27 noiembrie 2003 pentru modificarea si completarea Normelor metodologice privind organizarea si functionarea asociatiilor de proprietari (aprobate prin HG nr. 400/2003)",
    publishedIn: "Monitorul Oficial nr. 864 din 4 decembrie 2003",
    status: "abrogata",
    url: "https://legislatie.just.ro/Public/DetaliiDocumentAfis/49385",
  },
  {
    id: "legea-307-2006",
    shortTitle: "Legea nr. 307/2006",
    fullTitle: "Legea nr. 307 din 12 iulie 2006 privind apararea impotriva incendiilor",
    publishedIn: "Monitorul Oficial nr. 633 din 21 iulie 2006 (republicata in M.O. nr. 297 din 17 aprilie 2019)",
    status: "in_vigoare",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/73657",
  },
  {
    id: "legea-230-2007",
    shortTitle: "Legea nr. 230/2007",
    fullTitle: "Legea nr. 230 din 6 iulie 2007 privind infiintarea, organizarea si functionarea asociatiilor de proprietari",
    publishedIn: "Monitorul Oficial nr. 490 din 23 iulie 2007",
    status: "abrogata",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/83753",
  },
  {
    id: "hg-1588-2007",
    shortTitle: "HG nr. 1.588/2007",
    fullTitle: "Hotararea Guvernului nr. 1.588 din 19 decembrie 2007 pentru aprobarea Normelor metodologice de aplicare a Legii nr. 230/2007 privind infiintarea, organizarea si functionarea asociatiilor de proprietari",
    publishedIn: "Monitorul Oficial nr. 43 din 18 ianuarie 2008",
    status: "abrogata",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/88906",
  },
  {
    id: "norme-2007",
    shortTitle: "Norme metodologice 2007",
    fullTitle: "Normele metodologice din 19 decembrie 2007 de aplicare a Legii nr. 230/2007 privind infiintarea, organizarea si functionarea asociatiilor de proprietari",
    publishedIn: "Monitorul Oficial nr. 43 din 18 ianuarie 2008",
    status: "abrogata",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/88907",
  },
  {
    id: "legea-196-2018",
    shortTitle: "Legea nr. 196/2018",
    fullTitle: "Legea nr. 196 din 20 iulie 2018 privind infiintarea, organizarea si functionarea asociatiilor de proprietari si administrarea condominiilor",
    publishedIn: "Monitorul Oficial nr. 660 din 30 iulie 2018",
    status: "in_vigoare",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/203233",
  },
  {
    id: "ordin-1058-2019",
    shortTitle: "Ordinul nr. 1.058/2019",
    fullTitle: "Ordinul nr. 1.058 din 11 februarie 2019 privind aprobarea continutului-cadru al statutului asociatiei de proprietari si al regulamentului condominiului",
    publishedIn: "Monitorul Oficial nr. 149 din 25 februarie 2019",
    status: "in_vigoare",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/211163",
  },
  {
    id: "ordin-959-2023",
    shortTitle: "Ordinul nr. 959/2023",
    fullTitle: "Ordinul nr. 959 din 18 mai 2023 privind modificarea normativului pentru proiectarea si executarea instalatiilor electrice (NP 061-2022)",
    publishedIn: "Monitorul Oficial nr. 512 din 12 iunie 2023",
    status: "in_vigoare",
    url: "https://legislatie.just.ro/Public/DetaliiDocument/271142",
  },
];
