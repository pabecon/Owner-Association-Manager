export interface LawSection {
  type: "chapter" | "article" | "paragraph" | "note";
  id?: string;
  title?: string;
  content?: string;
  items?: string[];
  children?: LawSection[];
}

export const LAW_114_1996_CONTENT: LawSection[] = [
  {
    type: "paragraph",
    content: "Reglementarea cadrului general de realizare, exploatare si administrare a locuintelor are la baza urmatoarele principii:",
  },
  {
    type: "paragraph",
    content: "Accesul liber si neingragit la locuinta este un drept al fiecarui cetatean. Realizarea locuintelor constituie un obiectiv major, de interes national, pe termen lung, al administratiei publice centrale si locale.",
  },
  {
    type: "chapter",
    id: "cap-1",
    title: "Capitolul I - Dispozitii generale",
    children: [
      {
        type: "article",
        id: "art-1",
        title: "Articolul 1",
        content: "Prezenta lege reglementeaza aspectele sociale, economice, tehnice si juridice ale constructiei si folosintei locuintelor.",
      },
      {
        type: "article",
        id: "art-2",
        title: "Articolul 2",
        content: "Termenii utilizati in cuprinsul prezentei legi au urmatorul inteles:",
        items: [
          "a) Locuinta - Constructie alcatuita din una sau mai multe camere de locuit, cu dependintele, dotarile si utilitatile necesare, care satisface cerintele de locuit ale unei persoane sau familii.",
          "b) Locuinta convenabila - Locuinta care, prin gradul de satisfacere a raportului dintre cerinta utilizatorului si caracteristicile locuintei, la un moment dat, acopera necesitatile esentiale de odihna, preparare a hranei, educatie si igiena, asigurand exigentele minimale prezentate in anexa nr. 1 la prezenta lege.",
          "c) Locuinta sociala - Locuinta care se atribuie cu chirie subventionata unor persoane sau familii, a caror situatie economica nu le permite accesul la o locuinta in proprietate sau inchirierea unei locuinte in conditiile pietei.",
          "d) Locuinta de serviciu - Locuinta destinata functionarilor publici, angajatilor unor institutii sau agenti economici, acordata in conditiile contractului de munca, potrivit prevederilor legale.",
          "e) Locuinta de interventie - Locuinta destinata cazarii personalului unitatilor economice sau bugetare, care, prin contractul de munca, indeplineste activitati sau functii ce necesita prezenta permanenta sau in caz de urgenta in cadrul unitatilor economice.",
          "f) Locuinta de necesitate - Locuinta destinata cazarii temporare: (i) a persoanelor si familiilor ale caror locuinte au devenit inutilizabile in urma unor catastrofe naturale sau accidente sau ale caror locuinte sunt supuse demolarii in vederea realizarii de lucrari de utilitate publica, precum si lucrarilor de reabilitare ce nu se pot efectua in cladiri ocupate de locatari; (ii) victimelor violentei domestice, ca masura complementara celor prevazute de lege in domeniul asistentei sociale si protectiei victimelor violentei domestice.",
          "f^1) Locuinta de sprijin - Locuinta cu o suprafata utila de cel mult 100 mp, care se atribuie cu chirie unor persoane sau familii care au fost evacuate prin proceduri de executare silita din locuintele proprietate personala, in urma neachitarii obligatiilor contractuale prevazute in contracte de credit ipotecar, si a caror situatie economica nu le permite accesul la o locuinta in proprietate sau inchirierea unei locuinte in conditiile pietei.",
          "g) Locuinta de protocol - Locuinta destinata utilizarii de catre persoanele care sunt alese sau numite in unele functii ori demnitati publice, exclusiv pe durata exercitarii acestora.",
          "h) Casa de vacanta - Locuinta ocupata temporar, ca resedinta secundara, destinata odihnei si recreerii.",
          "i) Condominium - Imobilul format din teren cu una sau mai multe constructii, dintre care unele proprietati sunt comune, iar restul sunt proprietati individuale, pentru care se intocmesc o carte funciara colectiva si cate o carte funciara individuala pentru fiecare unitate individuala aflata in proprietate exclusiva.",
          "j) Unitate individuala - Unitate functionala, componenta a unui condominiu, formata din una sau mai multe camere de locuit si/sau spatii cu alta destinatie situate la acelasi nivel al cladirii sau la niveluri diferite, cu dependintele, dotarile si utilitatile necesare, avand acces direct si intrare separata.",
        ],
      },
      {
        type: "article",
        id: "art-3",
        title: "Articolul 3",
        content: "Autorizarea executarii constructiilor de locuinte noi, indiferent de natura proprietatii sau a amplasamentului, se face pe baza satisfacerii exigentelor minimale, prevazute in anexa nr. 1 la prezenta lege. Consiliile judetene si locale, potrivit competentelor stabilite prin lege, pot autoriza executarea etapizata a constructiilor de locuinte.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-2",
    title: "Capitolul II - Dezvoltarea constructiei de locuinte",
    children: [
      {
        type: "article",
        id: "art-4",
        title: "Articolul 4",
        content: "Persoanele fizice sau juridice romane pot realiza, cu respectarea prevederilor legale, constructii de locuinte pentru folosinta proprie sau in scopul valorificarii acestora.",
      },
      {
        type: "article",
        id: "art-5",
        title: "Articolul 5",
        content: "Locuintele care se realizeaza prin investitii din profit de catre persoane juridice romane, precum si in conditiile art. 7 si 20 din prezenta lege se pot amplasa pe terenurile apartinand persoanelor fizice beneficiare de locuinte, ale persoanelor juridice investitoare sau pe terenuri concesionate in acest scop de consiliile locale persoanelor juridice sau fizice, cu o reducere de pana la 95% din taxa de concesiune.",
      },
      {
        type: "article",
        id: "art-7",
        title: "Articolul 7",
        content: "Consiliile locale pot realiza din depozitele special constituite locuinte cu suprafetele construite prevazute in anexa nr. 1 la prezenta lege, exercitand controlul asupra pretului de vanzare, in vederea inlesnirii accesului la proprietate pentru unele categorii de persoane, in urmatoarea ordine de prioritate:",
        items: [
          "a) tinerii casatoriti care, la data contractarii locuintei, au, fiecare, varsta de pana la 35 de ani;",
          "b) persoanele care beneficiaza de facilitati la cumpararea sau construirea unei locuinte, potrivit prevederilor Legii nr. 42/1990, republicata;",
          "c) persoanele calificate din agricultura, invatamant, sanatate, administratie publica si culte, care isi stabilesc domiciliul in mediul rural;",
          "d) alte categorii de persoane stabilite de consiliile locale.",
        ],
      },
      {
        type: "article",
        id: "art-8",
        title: "Articolul 8",
        content: "Cuantumul subventiilor de la bugetul de stat, prevazute la art. 7, se stabileste anual si se aproba prin hotarare a Guvernului, la propunerea autoritatii publice centrale implicate.",
      },
      {
        type: "article",
        id: "art-9",
        title: "Articolul 9",
        content: "Persoanele care au beneficiat de subventii pentru realizarea sau cumpararea unei locuinte nu pot instraina locuinta, prin acte intre vii, pe o perioada de 10 ani de la data dobandirii acesteia.",
      },
      {
        type: "article",
        id: "art-10",
        title: "Articolul 10",
        content: "Locuintele dobandite cu sprijinul statului sunt scutite de impozit pe cladiri pe toata durata de rambursare a creditului primit de la stat.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-3",
    title: "Capitolul III - Finantarea constructiei de locuinte",
    children: [
      {
        type: "article",
        id: "art-15",
        title: "Articolul 15",
        content: "Ordonator principal de credite pentru locuintele care se finanteaza din bugetul de stat este conducatorul autoritatii publice centrale implicate.",
      },
      {
        type: "article",
        id: "art-16",
        title: "Articolul 16",
        content: "Lista locuintelor si a beneficiarilor stabiliti in conditiile art. 7 se intocmeste de autoritatile administratiei publice locale, pe baza criteriilor avute in vedere la stabilirea ordinii de prioritate, si se aproba de consiliul local.",
      },
      {
        type: "article",
        id: "art-17",
        title: "Articolul 17",
        content: "Fondurile de la bugetul de stat pentru construirea locuintelor sociale, a locuintelor de serviciu si a celor de necesitate se aloca pentru consiliile locale prin intermediul consiliilor judetene.",
      },
      {
        type: "article",
        id: "art-19",
        title: "Articolul 19",
        content: "Contractarea si garantarea imprumuturilor externe pentru realizarea de programe guvernamentale de constructii de locuinte se fac de catre Guvern, in conditiile legii.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-4",
    title: "Capitolul IV - Administrarea si intretinerea fondului de locuinte",
    children: [
      {
        type: "article",
        id: "art-27",
        title: "Articolul 27",
        content: "Locuintele si celelalte constructii aflate in proprietate se administreaza si se intretin de catre proprietar.",
      },
      {
        type: "article",
        id: "art-28",
        title: "Articolul 28",
        content: "Cheltuielile de intretinere privind proprietatea comuna sunt cele prevazute de normele juridice in vigoare si sunt in sarcina proprietarilor, in conformitate cu regulile asociatiei de proprietari.",
      },
      {
        type: "article",
        id: "art-35",
        title: "Articolul 35",
        content: "Proprietarii locuintelor si ai spatiilor cu alta destinatie decat aceea de locuinta, situate in cladiri cu mai multe apartamente, sau in ansamblu rezidential, constituie asociatia de proprietari, care se organizeaza si functioneaza potrivit legii.",
      },
      {
        type: "article",
        id: "art-36",
        title: "Articolul 36",
        content: "Cheltuielile comune se repartizeaza pe fiecare proprietar in conformitate cu normele legale in vigoare privind organizarea si functionarea asociatiilor de proprietari.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-5",
    title: "Capitolul V - Locuinta sociala si locuinta de necesitate",
    children: [
      {
        type: "article",
        id: "art-42",
        title: "Articolul 42",
        content: "Fondul de locuinte sociale se constituie din:",
        items: [
          "a) locuinte construite sau cumparate de autoritatile publice locale;",
          "b) locuinte donate sau lasate prin testament autoritatilor administratiei publice locale;",
          "c) alte surse conform legii.",
        ],
      },
      {
        type: "article",
        id: "art-43",
        title: "Articolul 43",
        content: "Au acces la locuinta sociala, in vederea inchirierii, familiile sau persoanele cu un venit mediu net lunar pe persoana, realizat in ultimele 12 luni, sub nivelul castigului salarial mediu net lunar pe total economie, comunicat de Institutul National de Statistica in ultimul Buletin statistic anterior lunii in care se analizeaza cererea.",
      },
      {
        type: "article",
        id: "art-44",
        title: "Articolul 44",
        content: "Contractul de inchiriere se incheie de catre primar sau de catre o persoana imputernicita de acesta, pe o perioada de 5 ani, cu posibilitatea prelungirii pe baza declaratiei de venituri si a actelor doveditoare necesare.",
      },
      {
        type: "article",
        id: "art-45",
        title: "Articolul 45",
        content: "Au drept de prioritate la inchirierea unei locuinte sociale, in urmatoarea ordine:",
        items: [
          "a) persoanele si familiile evacuate sau care urmeaza a fi evacuate din locuintele retrocedate fostilor proprietari;",
          "b) tinerii care au varsta de pana la 35 de ani;",
          "c) tinerii proveniti din institutii de ocrotire sociala si care au implinit varsta de 18 ani;",
          "d) invalizii de gradul I si II, persoanele cu handicap;",
          "e) pensionarii;",
          "f) veteranii si vaduvele de razboi;",
          "g) beneficiarii Legii recunostintei fata de eroii-martiri si luptatorii care au contribuit la victoria Revolutiei romane din decembrie 1989;",
          "h) beneficiarii Decretului-lege nr. 118/1990, republicat, privind acordarea unor drepturi persoanelor persecutate din motive politice;",
          "i) victimele violentei domestice.",
        ],
      },
      {
        type: "article",
        id: "art-48",
        title: "Articolul 48",
        content: "Criteriile de acordare a locuintelor sociale se stabilesc anual de consiliile locale ale municipiilor, oraselor si comunelor in care se afla locuinte sociale, pe baza criteriilor orientative prevazute in normele metodologice de aplicare a prezentei legi.",
      },
      {
        type: "article",
        id: "art-54",
        title: "Articolul 54",
        content: "In cazul in care, in urma unor catastrofe naturale sau accidente, sau in cazul in care locuintele sunt supuse demolarii pentru a elibera amplasamentele in vederea realizarii de lucrari de utilitate publica ori pentru reabilitare, locuintele pot fi declarate ca locuinte de necesitate prin hotarare a consiliului local.",
      },
      {
        type: "article",
        id: "art-55",
        title: "Articolul 55",
        content: "Locuintele de necesitate se inchiriaza temporar persoanelor si familiilor care se regasesc in situatiile prevazute la art. 2 lit. f), pe baza hotararii consiliului local.",
      },
      {
        type: "article",
        id: "art-56",
        title: "Articolul 56",
        content: "Autoritatile administratiei publice locale pot declara de necesitate locuinte din fondul existent, pentru cazarea temporara gratuita, pe o perioada de maximum un an, a victimelor violentei domestice.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-6",
    title: "Capitolul VI - Locuinta de serviciu si locuinta de interventie",
    children: [
      {
        type: "article",
        id: "art-51",
        title: "Articolul 51",
        content: "Fondul de locuinte de serviciu se constituie din locuintele existente, dobandite sau realizate de catre autoritatile administratiei publice centrale sau locale, de regii autonome, companii nationale, societati nationale sau alte persoane juridice.",
      },
      {
        type: "article",
        id: "art-52",
        title: "Articolul 52",
        content: "Locuintele de serviciu se finanteaza de la bugetul de stat, bugetele locale sau din bugetele agentilor economici.",
      },
      {
        type: "article",
        id: "art-53",
        title: "Articolul 53",
        content: "Conditiile de inchiriere a locuintelor de serviciu se stipuleaza in contractul de munca al beneficiarului.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-7",
    title: "Capitolul VII^1 - Locuinta de sprijin",
    children: [
      {
        type: "article",
        id: "art-56-1",
        title: "Articolul 56^1",
        content: "Fondul de locuinte de sprijin se constituie din locuinte realizate prin grija consiliilor locale ale municipiilor, oraselor, comunelor si sectoarelor municipiului Bucuresti.",
        children: [
          {
            type: "note",
            content: "Acest capitol a fost introdus prin Legea nr. 143/2017.",
          },
        ],
      },
      {
        type: "article",
        id: "art-56-2",
        title: "Articolul 56^2",
        content: "Au acces la o locuinta de sprijin persoanele sau familiile care au fost evacuate prin proceduri de executare silita din locuintele proprietate personala, in urma neachitarii obligatiilor contractuale prevazute in contracte de credit ipotecar, si indeplinesc cumulativ urmatoarele conditii:",
        items: [
          "a) au un venit mediu net lunar pe persoana sub nivelul castigului salarial mediu net lunar;",
          "b) nu detin in proprietate alta locuinta;",
          "c) nu au instrainat o locuinta in ultimii 5 ani anteriori solicitarii.",
        ],
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-8",
    title: "Capitolul VIII - Dispozitii tranzitorii si finale",
    children: [
      {
        type: "article",
        id: "art-61",
        title: "Articolul 61",
        content: "Litigiile rezultate din aplicarea prevederilor prezentei legi se solutioneaza de instantele judecatoresti.",
      },
      {
        type: "article",
        id: "art-61-1",
        title: "Articolul 61^1",
        content: "Prevederile art. 35 se aplica tuturor proprietarilor din cadrul condominiului.",
      },
      {
        type: "article",
        id: "art-72",
        title: "Articolul 72",
        content: "Prezenta lege se completeaza, in ceea ce priveste contractul de inchiriere, cu dispozitiile Codului civil referitoare la contractul de locatiune.",
      },
      {
        type: "article",
        id: "art-73",
        title: "Articolul 73",
        content: "Pe data intrarii in vigoare a prezentei legi se abroga:",
        items: [
          "Legea nr. 5/1973 privind administrarea fondului locativ si reglementarea raporturilor dintre proprietari si chiriasi;",
          "HCM nr. 860/1973;",
          "Decretul nr. 256/1984;",
          "precum si orice alte dispozitii contrare prezentei legi.",
        ],
      },
    ],
  },
  {
    type: "chapter",
    id: "anexa-1",
    title: "Anexa nr. 1 - Exigente minimale pentru locuinte",
    children: [
      {
        type: "paragraph",
        content: "Exigentele minimale privind suprafetele si dotarile pentru locuinte sunt urmatoarele:",
      },
      {
        type: "article",
        id: "anexa-1-sup",
        title: "Suprafete minime",
        items: [
          "Camera de zi: min. 18 mp",
          "Dormitor matrimonial: min. 12 mp",
          "Dormitor cu 2 paturi: min. 10 mp",
          "Dormitor cu 1 pat: min. 8 mp",
          "Bucatarie: min. 5 mp",
          "Baie: min. 3,5 mp (cu cada) sau 2,5 mp (cu cabina dus)",
          "Hol/vestibul/culoar: min. 2 mp",
        ],
      },
      {
        type: "article",
        id: "anexa-1-dot",
        title: "Dotari si utilitati obligatorii",
        items: [
          "Alimentare cu apa potabila",
          "Canalizare si evacuarea apei menajere",
          "Incalzire (centrala termica sau alta sursa)",
          "Instalatii electrice",
          "Ventilatie naturala sau mecanica",
          "Iluminat natural in camerele de locuit",
        ],
      },
    ],
  },
];
