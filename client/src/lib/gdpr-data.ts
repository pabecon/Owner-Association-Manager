export interface GdprSection {
  type: "heading" | "subheading" | "paragraph" | "list" | "table";
  title?: string;
  content?: string;
  items?: string[];
  tableData?: { headers: string[]; rows: string[][] };
}

export interface GdprDocument {
  id: string;
  title: string;
  lastUpdated: string;
  sections: GdprSection[];
}

export const GDPR_DOCUMENTS: GdprDocument[] = [
  {
    id: "politica-cookies",
    title: "Politica de Cookies",
    lastUpdated: "29 aprilie 2022",
    sections: [
      {
        type: "heading",
        title: "Ce este un cookie?",
      },
      {
        type: "paragraph",
        content:
          "Un cookie este un mic pachet de date (fisier text), pe care site-urile web il stocheaza prin browser, in dispozitivul pe care il folositi pentru a naviga pe site-ul web. Aceste cookie-uri sunt esentiale pentru buna functionare a site-ului web. In aceasta politica se explica modul in care utilizam cookie-urile si ce optiuni aveti la dispozitie in legatura cu acestea, ca utilizator.",
      },
      {
        type: "heading",
        title: "De ce sunt cookie-urile utile pentru utilizatorul site-ului?",
      },
      {
        type: "paragraph",
        content:
          "Site-ul web depinde de cookie-uri pentru functionarea corecta si pentru a asigura o navigare optima pentru utilizator. Cookie-urile va permit, de exemplu, sa navigati cu usurinta pe site-uri web pe care ati optat pentru anumite preferinte sau sa accesati continut personalizat pe acestea.",
      },
      {
        type: "heading",
        title: "Durata de viata a unui cookie",
      },
      {
        type: "paragraph",
        content:
          "Durata de viata a unui cookie poate varia semnificativ, depinzand de scopul pentru care este plasat. Unele cookie-uri sunt folosite exclusiv pentru o singura sesiune (cookie-uri de sesiune) si nu mai sunt retinute cand utilizatorul paraseste website-ul. Unele cookie-uri sunt retinute si refolosite de fiecare data cand utilizatorul revine pe acel website (cookie-uri permanente). In orice caz, cookie-urile pot fi sterse de utilizator in orice moment prin intermediul setarilor browserului.",
      },
      {
        type: "heading",
        title: "Cookie-uri pe site-ul web AdminBloc",
      },
      {
        type: "paragraph",
        content:
          "Pentru a asigura functionarea optima a site-ului nostru web si cea mai buna experienta de utilizare posibila, folosim cookie-uri pe site-ul web AdminBloc. Puteti sterge cookie-urile de pe dispozitiul dvs. in orice moment si puteti configura browserul pentru a le dezactiva. Cu toate acestea, prin dezactivarea cookie-urilor, puteti constata ca site-ul web nu va fi pe deplin operational. Pentru mai multe informatii despre datele pe care le prelucreaza aceste cookie-uri, va rugam sa consultati Politica de confidentialitate, pe care o puteti accesa facand click aici.",
      },
      {
        type: "heading",
        title: "Cookie-uri plasate de terti (third party)",
      },
      {
        type: "paragraph",
        content:
          'Anumite sectiuni de continut de pe website pot fi furnizate prin intermediul unor terte parti/furnizori (de exemplu: o reclama, un videoclip etc.). Aceste terte parti pot plasa cookie-uri prin intermediul site-ului si ele se numesc "cookie-uri terta parte" pentru ca nu sunt plasate de titularului site-ului. Aceste terte parti pot, de asemenea, sa plaseze cookie-uri si semnalizatoare web pe computerul utilizatorului sau pot utiliza tehnologii similare pentru a colecta date pentru a trimite reclame directionate catre utilizator in legatura cu propriile servicii. In astfel de cazuri, prelucrarea datelor este guvernata de politicile de confidentialitate si politicile privind cookie-urile stabilite de acesti terti, pe care va recomandam sa le consultati.',
      },
      {
        type: "subheading",
        title: "Cookie-uri necesare",
      },
      {
        type: "paragraph",
        content:
          "Fara aceste cookie-uri, site-ul web nu va functiona corect. Aceste cookie-uri permit folosirea unor functii de baza precum navigarea pe pagini si accesul in zonele securizate ale site-ului. Ele nu pot fi dezactivate si, de obicei, sunt declansate pe baza interactiunilor dvs. cu site-ul web, cum ar fi setarea optiunilor de confidentialitate.",
      },
      {
        type: "table",
        tableData: {
          headers: ["Nume", "Furnizor", "Descriere", "Perioada de stocare"],
          rows: [
            [
              "laravel_session",
              "AdminBloc",
              "laravel_session este folosit pentru a indetifica o instanta de sesiune pentru un utilizator",
              "Sesiune",
            ],
            [
              "575d5dcc4b4bb301b6736497f2d835a6c908ebc7",
              "AdminBloc",
              "-",
              "2 ore",
            ],
          ],
        },
      },
      {
        type: "subheading",
        title: "Cookie-uri de preferinta",
      },
      {
        type: "paragraph",
        content:
          "Aceste module cookie permit paginii noastre sa-si aminteasca alegerile pe care le faceti (cum ar fi numele dvs. de utilizator, limba sau regiunea in care va aflati) pentru a oferi o experienta online mai personalizata. Aceste module cookie pot fi, de asemenea, folosite pentru a va aminti modificarile aduse dimensiunii textului, fonturilor si altor parti ale paginilor de internet pe care le puteti personaliza. In mod similar, ele pot fi utilizate pentru a urmari ce functionalitati ale site-ului folositi si pentru a va permite sa accesati platforme sociale. Daca nu acceptati aceste module cookie, aceasta poate afecta performanta si functionalitatea paginii de internet si poate restrictiona accesul la continutul acesteia.",
      },
      {
        type: "table",
        tableData: {
          headers: ["Nume", "Furnizor", "Descriere", "Perioada de stocare"],
          rows: [],
        },
      },
      {
        type: "subheading",
        title: "Cookie-uri statistice",
      },
      {
        type: "paragraph",
        content:
          "Aceste cookie-uri ne permit sa intelegem modul in care dvs. interactionati cu website-ul nostru, de exemplu ce pagini sunt accesate cel mai des sau daca intampinati erori de navigare pe anumite pagini, astfel incat sa putem masura si imbunatati performanta site-ului nostru. Aceste cookie-uri nu va identifica ca persoana fizica. Toate informatiile pe care le colecteaza aceste cookie-uri sunt agregate. Acest tip de cookie este folosit pentru a imbunatati modul in care site-ul web functioneaza.",
      },
      {
        type: "table",
        tableData: {
          headers: ["Nume", "Furnizor", "Descriere", "Perioada de stocare"],
          rows: [],
        },
      },
      {
        type: "subheading",
        title: "Cookie-uri de marketing",
      },
      {
        type: "paragraph",
        content:
          "Cookie-urile pentru marketing ne ajuta sa ne promovam site-ul si serviciile pe care le oferim prin intermediul acestuia.",
      },
      {
        type: "paragraph",
        content:
          "Aceste module cookie sunt utilizate pentru a furniza continut mai relevant pentru dvs. si interesele dvs. Ele sunt, de asemenea, folosite pentru a retine vizita pe site, paginile accesate, pentru a observa sectiunile de site vizualizate in scopul de a creste nivelul de relevanta al continutului publicat pe pagina noastra. Aceste cookie-uri pot fi, de asemenea, legate de functionalitatea site-ului furnizata de terte parti.",
      },
      {
        type: "table",
        tableData: {
          headers: ["Nume", "Furnizor", "Descriere", "Perioada de stocare"],
          rows: [],
        },
      },
      {
        type: "heading",
        title: "Modificarea preferintelor privind cookie-urile",
      },
      {
        type: "paragraph",
        content:
          "Cookie-urile pot fi configurate manual de catre utilizator. Toate cookie-urile stocate pot fi eliminate, iar stocarea lor poate fi dezactivata cu setarile corecte. Puteti configura aceste setari prin accesarea butonului de preferinte privind cookie-urile.",
      },
      {
        type: "paragraph",
        content:
          "De asemenea, puteti gestiona preferintele privind cookie-urile direct din browser, urmand instructiunile furnizate pe linkurile de mai jos in functie de tipul de browser.",
      },
      {
        type: "list",
        items: [
          "Microsoft Internet Explorer: https://support.microsoft.com/ro-ro/topic/cum-se-%C8%99terg-fi%C8%99ierele-module-cookie-%C3%AEn-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc",
          "Microsoft Edge: https://support.microsoft.com/ro-ro/microsoft-edge/%C8%99tergerea-modulelor-cookie-%C3%AEn-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
          "Firefox: https://support.mozilla.org/ro/kb/activarea-si-dezactivarea-cookie-urilor",
          "Chrome: https://support.google.com/chrome/answer/95647?hl=RO",
          "Safari: https://support.apple.com/ro-ro/guide/safari/sfri11471/mac",
          "iOS Safari: https://support.apple.com/ro-ro/HT201265",
        ],
      },
      {
        type: "paragraph",
        content:
          "Pentru mai multe informatii in legatura cu datele folosite de cookie-urile active pe site-ul web va rugam sa consultati Politica de confidentialitate aici.",
      },
      {
        type: "paragraph",
        content:
          "De asemenea pentru orice informatii privind prelucrarea datelor cu caracter personal puteti contacta persoana responsabila cu protectia datelor la adresa gdpr@adminbloc.ro.",
      },
    ],
  },
  {
    id: "politica-prelucrare-date",
    title: "Politica de Prelucrare a Datelor cu Caracter Personal",
    lastUpdated: "29 aprilie 2022",
    sections: [
      {
        type: "paragraph",
        content:
          'Regulamentul (UE) 2016/679 privind protectia persoanelor fizice in ceea ce priveste prelucrarea datelor cu caracter personal ("GDPR") este extrem de important pentru AdminBloc si in acest sens va informam ca tratam cu responsabilitate colectarea si procesarea datelor cu caracter personal.',
      },
      {
        type: "paragraph",
        content:
          "Pentru orice intrebari sau cereri referitoare la datele cu caracter personal pe care ni le-ati transmis, inclusiv in vederea exercitarii drepturilor pe care le aveti, astfel cum sunt mentionate mai jos, ne puteti contacta la adresa de e-mail gdpr@adminbloc.ro.",
      },
      {
        type: "paragraph",
        content:
          "AdminBloc actioneaza in calitate de operator al datelor cu caracter personal, intrucat stabileste scopurile si mijloacele de prelucrare a datelor cu caracter personal.",
      },
      {
        type: "paragraph",
        content:
          "In sectiunea urmatoare, AdminBloc a redat toate informatiile care sunt necesare pentru a intelege activitatile de prelucrare a datelor cu caracter personal.",
      },
      {
        type: "heading",
        title: "Definitii",
      },
      {
        type: "paragraph",
        content:
          'Date cu caracter personal - inseamna orice informatii privind o persoana fizica identificata sau identificabila ("persoana vizata"); o persoana fizica identificabila este o persoana care poate fi identificata, direct sau indirect, in special prin referire la un element de identificare, cum ar fi un nume, un numar de identificare, date de localizare, un identificator online sau la unul sau mai multe elemente specifice, proprii identitatii sale fizice, fiziologice, genetice, psihice, economice, culturale sau sociale.',
      },
      {
        type: "paragraph",
        content:
          "Prelucrare inseamna orice operatiune sau set de operatiuni efectuate asupra datelor cu caracter personal sau asupra seturilor de date cu caracter personal, cu sau fara utilizarea de mijloace automatizate, cum ar fi colectarea, inregistrarea, organizarea, structurarea, stocarea, adaptarea sau modificarea, extragerea, consultarea, utilizarea, divulgarea prin transmitere, diseminarea sau punerea la dispozitie in orice alt mod, alinierea sau combinarea, restrictionarea, stergerea sau distrugerea.",
      },
      {
        type: "heading",
        title: "Identitatea si datele de contact ale operatorului",
      },
      {
        type: "paragraph",
        content:
          "Operatorul AdminBloc, cu sediul in Municipiul Bucuresti, Sector 1, Str. Dr. Iacob Felix nr.28, et.4, este inregistrat la Registrul Comertului sub nr. J40/547/2008, avand CUI 23070587.",
      },
      {
        type: "paragraph",
        content:
          "In cazul in care se solicita informatii suplimentare cu privire la prelucrarea datelor cu caracter personal de catre AdminBloc, va rugam sa contactati Persoana Responsabila cu Protectia Datelor la adresa de e-mail gdpr@adminbloc.ro.",
      },
      {
        type: "heading",
        title: "Datele cu caracter personal prelucrate",
      },
      {
        type: "paragraph",
        content:
          "In cadrul activitatilor sale in legatura cu serviciile site-ului AdminBloc, AdminBloc realizeaza diferite operatiuni de colectare si prelucrare a datelor cu caracter personal, cum ar fi:",
      },
      {
        type: "subheading",
        title:
          "Datele apartinand persoanelor vizate care au completat formularul de contact de pe site-ul AdminBloc:",
      },
      {
        type: "list",
        items: [
          "nume, prenume;",
          "adresa de e-mail;",
          "numar de telefon;",
          "alte date cu caracter personal continute in mesajul din formular;",
        ],
      },
      {
        type: "subheading",
        title:
          "Datele apartinand persoanelor vizate care ne contacteaza prin e-mail, din orice motiv, ulterior interactiunii cu site-ul/ navigarii pe site:",
      },
      {
        type: "list",
        items: [
          "nume, prenume;",
          "adresa de e-mail;",
          "numar de telefon;",
          "adresa postala;",
          "date in legatura cu serviciile de care este interesata persoana vizata;",
          "alte date cu caracter personal in functie de specificul interactiunii;",
        ],
      },
      {
        type: "subheading",
        title:
          "Datele apartinand persoanelor vizate cu care interactionam in cadrul campaniilor de marketing online sau offline:",
      },
      {
        type: "list",
        items: [
          "nume, prenume;",
          "adresa de e-mail;",
          "numar de telefon;",
          "date in legatura cu serviciile de care este interesata persoana vizata;",
          "alte date cu caracter personal in functie de specificul interactiunii;",
        ],
      },
      {
        type: "subheading",
        title:
          "Datele apartinand persoanelor vizate care formuleaza reclamatii/ sesizari/ feedback cu privire la activitatea AdminBloc transmise in orice forma, prin oricare dintre canalele de contact ale AdminBloc:",
      },
      {
        type: "list",
        items: [
          "nume, prenume;",
          "adresa de e-mail;",
          "numar de telefon;",
          "adresa postala;",
          "alte date cu caracter personal in functie de specificul interactiunii;",
        ],
      },
      {
        type: "subheading",
        title: "Datele colectate prin modulele cookie de pe site:",
      },
      {
        type: "list",
        items: [
          "adresa IP;",
          "date despre device-ul utilizat;",
          "date despre browser;",
          "date despre activitatea pe site: pagini accesate, preferinte, interese, servicii solicitate etc.",
        ],
      },
      {
        type: "paragraph",
        content:
          "Pentru detalii privind folosirea modulelor cookie va rugam sa consultati Politica Cookie disponibila pe site.",
      },
      {
        type: "heading",
        title:
          "Scopurile pentru care AdminBloc prelucreaza datele cu caracter personal",
      },
      {
        type: "paragraph",
        content:
          "AdminBloc prelucreaza datele cu caracter personal ale persoanelor vizate:",
      },
      {
        type: "list",
        items: [
          "pentru a putea raspunde prompt solicitarilor din partea potentialilor clienti, interesati de serviciile societatii;",
          "pentru a raspunde oricaror sesizari/ reclamatii/ feedback ale persoanelor vizate;",
          "pentru a furniza informatii comerciale (marketing) cu privire la serviciile societatii, pentru a desfasura campanii de marketing;",
          "pentru a realiza analize de piata pe baza informatiilor primite de la persoanele vizate si a le putea folosi in strategia de marketing a societatii;",
          "pentru efectuarea diverselor analize, raportari privind modul de functionare a site-ului, pentru a se asigura functionarea corecta a site-ului si in vederea imbunatatirii experientei oferite pe site.",
        ],
      },
      {
        type: "heading",
        title:
          "Temeiurile legale pentru prelucrarea datelor cu caracter personal",
      },
      {
        type: "list",
        items: [
          "Prelucrarea este necesara pentru incheierea unor contracte, precum si executarea acestora (Art. 6 (1) b) - GDPR);",
          "Persoana vizata si-a oferit consimtamantul pentru a primi informatii si comunicari comerciale (de marketing), punctual sau in mod regulat; pentru folosirea de cookie-uri altele decat cele strict necesare (Art. 6 (1) a) - GDPR);",
          "Prelucrarea este determinata de dispozitii legale ce impun obligatii operatorului (Art. 6 (1) c) - GDPR);",
          "Prelucrarea este necesara in temeiul interesului legitim al societatii (de exemplu, pentru a raspunde unor sesizari sau solicitari ale persoanelor vizate) (Art. 6 (1) f) - GDPR).",
        ],
      },
      {
        type: "heading",
        title:
          "Dezvaluirea datelor cu caracter personal unor destinatari sau unor categorii de destinatari",
      },
      {
        type: "paragraph",
        content:
          "Ca regula, AdminBloc nu va dezvalui date cu caracter personal catre o parte terta din afara societatii. Datele cu caracter personal sunt distribuite numai catre membrii societatii implicati in mod direct in procesul de comunicare si analiza de marketing.",
      },
      {
        type: "paragraph",
        content:
          "AdminBloc ar putea dezvalui date cu caracter personal catre entitati contractate de societate pentru externalizarea unor servicii in cadrul carora va fi necesara prelucrarea datelor cu caracter personal, precum furnizori de cloud, servere, servicii de gestionare/trimitere e-mail, furnizori de servicii IT, furnizori de servicii de contabilitate sau juridice.",
      },
      {
        type: "paragraph",
        content:
          "In toate situatiile, datele dumneavoastra vor fi transmise catre terte parti cu care operatorul a incheiat acorduri privind prelucrarea datelor cu caracter personal, asigurandu-se ca acesti parteneri respecta toate standardele privind prelucrarea datelor in siguranta si ca prelucreaza datele exclusiv in scopurile in care le-au fost destinate.",
      },
      {
        type: "heading",
        title: "Perioada de retentie a datelor cu caracter personal",
      },
      {
        type: "paragraph",
        content:
          "Toate datele cu caracter personal ale persoanelor care completeaza formularul de contact in baza temeiului legal al consimtamantului vor fi prelucrate pana in momentul retragerii consimtamantului oferit pentru prelucrarea datelor cu caracter personal.",
      },
      {
        type: "paragraph",
        content:
          "Toate datele cu caracter personal prelucrate in temeiul incheierii sau executarii unui contract vor fi stocate pe tot parcursul contractului.",
      },
      {
        type: "paragraph",
        content:
          "Dispozitiile legale incidente pot prevedea perioade de stocare fixe.",
      },
      {
        type: "paragraph",
        content:
          "In orice caz, datele cu caracter personal vor fi stocate pe o perioada strict necesara realizarii scopurilor pentru care au fost prelucrate.",
      },
      {
        type: "heading",
        title:
          "Drepturile persoanelor vizate cu privire la prelucrarea datelor cu caracter personal",
      },
      {
        type: "paragraph",
        content:
          "AdminBloc asigura exercitarea drepturilor pe care fiecare individ le are in ceea ce priveste prelucrarea datelor sale cu caracter personal si ofera mai jos o informare completa in legatura cu aceste drepturi:",
      },
      {
        type: "list",
        items: [
          "Dreptul de acces \u2013 persoana vizata poate solicita confirmarea faptului ca datele sale cu caracter personal sunt prelucrate sau nu de catre societate, iar in caz afirmativ, poate solicita accesul la acestea, precum si anumite informatii despre acestea (mentionate in art. 15 din GDPR). Pe baza de solicitare, Operatorul va elibera si o copie asupra datelor cu caracter personal prelucrate. Dreptul de acces este un drept fundamental al individului pe care Operatorul il va respecta. Operatorul poate refuza sa raspunda pozitiv unei cereri de acces in cazul in care persoana vizata depune o cerere in mod vadit nefondata sau excesiva.",
          "Dreptul la rectificare este aplicabil in situatiile in care Operatorul detine date cu caracter personal inexacte sau incomplete, date pe care persoana vizata are dreptul sa ceara sa fie rectificate sau completate.",
          "Dreptul la stergerea datelor se exercita de persoana vizata prin solicitarea stergerii tuturor datelor sale personale din evidenta Operatorului, iar acesta va proceda in consecinta, daca nu exista alt motiv de prelucrare a datelor, in concordanta cu dispozitiile legale.",
          "Dreptul la restrictionarea prelucrarii \u2013 aplicabil atunci cand acuratetea datelor cu caracter personal este contestata, pentru perioada necesara in vederea gestionarii situatiei. Acest drept este, de asemenea, aplicabil cand prelucrarea datelor este neconforma si stergerea datelor nu a fost ceruta. (conform articolului 18 din GDPR in care sunt descrise toate situatiile in care se va putea restrictiona prelucrarea datelor).",
          "Dreptul la portabilitatea datelor \u2013 reprezinta dreptul persoanei vizate de a primi datele cu caracter personal intr-un format structurat, comun utilizat si care poate fi citit automat. Acest drept la portabilitate va fi aplicabil numai cu privire la datele cu caracter personal pe care persoanele vizate ni le-au oferit in mod direct, in format electronic.",
          "Dreptul de a se opune \u2013 constand in posibilitatea de opozitie la prelucrarea bazata pe interesul legitim al operatorului, in functie situatia particulara a persoanei vizate. Daca persoana vizata se opune prelucrarii ce vizeaza marketingul direct, operatorul inceteaza imediat prelucrarea in acest scop.",
          "Dreptul persoanei vizate de a-si retrage consimtamantul pentru prelucrarea de catre Operator a datelor cu caracter personal. Persoanele care si-au dat consimtamantul pentru primirea unor informatii de in mod punctual din partea Operatorului vor putea sa transmita retragerea acestui consimtamant printr-un mail la adresa gdpr@adminbloc.ro.",
          "Dreptul persoanei vizate de a depune o plangere unei autoritati de supraveghere. Persoanele vizate care considera ca le-au fost incalcate drepturile vor putea sa se adreseze Autoritatii Nationale de Supraveghere a Prelucrarii Datelor cu Caracter Personal.",
        ],
      },
      {
        type: "heading",
        title: "Informatii de contact ale Autoritatii de Supraveghere",
      },
      {
        type: "list",
        items: [
          "Website: http://www.dataprotection.ro/",
          "Email: anspdcp@dataprotection.ro",
          "Telefon: +40 21 252 5599",
        ],
      },
      {
        type: "paragraph",
        content:
          "Pentru orice intrebari suplimentare cu privire la modul in care datele cu caracter personal sunt prelucrate si pentru a va exercita drepturile mentionate mai sus, precum si pentru a rezolva orice sesizare pe cale amiabila, va rugam sa adresati solicitarile dvs. la adresa de email gdpr@adminbloc.ro.",
      },
      {
        type: "paragraph",
        content:
          "Acest Site foloseste fisiere de tip cookie. Pentru mai multe informatii cu privire la modul in care se folosesc aceste fisiere, va rugam sa accesati urmatorul link.",
      },
    ],
  },
];
