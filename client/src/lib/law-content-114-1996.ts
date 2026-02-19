export interface LawTableData {
  headers: string[];
  rows: string[][];
}

export interface LawSection {
  type: "chapter" | "article" | "paragraph" | "note" | "annexa" | "table";
  id?: string;
  title?: string;
  content?: string;
  items?: string[];
  children?: LawSection[];
  tableData?: LawTableData;
}

export const LAW_114_1996_CONTENT: LawSection[] = [
  {
    type: "paragraph",
    content: "Reglementarea cadrului general de realizare, exploatare și administrare a locuințelor are la baza următoarele principii:",
  },
  {
    type: "paragraph",
    content: "Accesul liber și neîngrădit la locuința este un drept al fiecărui cetățean.",
  },
  {
    type: "paragraph",
    content: "Realizarea locuințelor constituie un obiectiv major, de interes național, pe termen lung, al administrației publice centrale și locale.",
  },
  {
    type: "note",
    content: "Articolul V din LEGEA nr. 45 din 8 martie 2022, publicată în MONITORUL OFICIAL nr. 237 din 10 martie 2022 prevede: Articolul V (1) În vederea respectării caracterului multianual al programului de construcții de locuințe sociale finanțat în baza Legii locuinței nr. 114/1996, republicată, cu modificările și completările ulterioare, și ale Normelor metodologice pentru punerea în aplicare a prevederilor Legii locuinței nr. 114/1996, aprobate prin Hotărârea Guvernului nr. 1.275/2000, cu modificările și completările ulterioare, se pot încheia contracte de finanțare multianuale cu autoritățile publice locale ale unităților/subdiviziunilor administrativ-teritoriale care au blocuri de locuințe incluse în program la data intrării în vigoare a prezentei legi, pentru a asigura finalizarea blocurilor de locuințe cuprinse în program, în limita creditelor de angajament aprobate. (2) Pentru blocurile de locuințe incluse în programul prevăzut la alin. (1), în vederea încheierii contractelor de finanțare multianuale, autoritățile publice locale ale unităților/ subdiviziunilor administrativ-teritoriale transmit Ministerului Dezvoltării, Lucrărilor Publice și Administrației, în termen de 60 de zile de la data intrării în vigoare a prezentei legi, necesarul de fonduri de la bugetul de stat pentru finalizarea blocurilor de locuințe.",
  },
  {
    type: "chapter",
    id: "cap-1",
    title: "Capitolul I - Dispoziții generale",
    children: [
      {
        type: "article",
        id: "art-1",
        title: "Articolul 1",
        content: "Prezenta lege reglementează aspectele sociale, economice, tehnice și juridice ale construcției și folosinței locuințelor.",
      },
      {
        type: "article",
        id: "art-2",
        title: "Articolul 2",
        content: "Termenii utilizați în cuprinsul prezentei legi au următorul înțeles:",
        items: [
          "a) Locuința Construcție alcătuită din una sau mai multe camere de locuit, cu dependințele, dotările și utilitățile necesare, care satisface cerințele de locuit ale unei persoane sau familii.",
          "b) Locuința convenabilă Locuința care, prin gradul de satisfacere a raportului dintre cerința utilizatorului și caracteristicile locuinței, la un moment dat, acoperă necesitățile esențiale de odihna, preparare a hranei, educație și igiena, asigurând exigentele minimale prezentate în anexa nr. 1 la prezenta lege.",
          "c) Locuința socială Locuința care se atribuie cu chirie subvenționată unor persoane sau familii, a căror situație economică nu le permite accesul la o locuința în proprietate sau închirierea unei locuințe în condițiile pieței.",
          "d) Locuința de serviciu Locuința destinată funcționarilor publici, angajaților unor instituții sau agenți economici, acordata în condițiile contractului de muncă, potrivit prevederilor legale.",
          "e) Locuința de intervenție Locuința destinată cazării personalului unităților economice sau bugetare, care, prin contractul de muncă, îndeplinește activități sau funcții ce necesita prezenta permanenta sau în caz de urgență în cadrul unităților economice.",
          "f) Locuință de necesitate Locuință destinată cazării temporare:",
          "(i) a persoanelor și familiilor ale căror locuințe au devenit inutilizabile în urma unor catastrofe naturale sau accidente sau ale căror locuințe sunt supuse demolării în vederea realizării de lucrări de utilitate publică, precum și lucrărilor de reabilitare ce nu se pot efectua în clădiri ocupate de locatari;",
          "(ii) victimelor violenței domestice, ca măsură complementară celor prevăzute de lege în domeniul asistenței sociale și protecției victimelor violenței domestice.",
          "f^1) Locuință de sprijin Locuință cu o suprafață utilă de cel mult 100 mp, care se atribuie cu chirie unor persoane sau familii care au fost evacuate prin proceduri de executare silită din locuințele proprietate personală, în urma neachitării obligațiilor contractuale prevăzute în contracte de credit ipotecar, și a căror situație economică nu le permite accesul la o locuință în proprietate sau închirierea unei locuințe în condițiile pieței.",
          "g) Locuința de protocol Locuința destinată utilizării de către persoanele care sunt alese sau numite în unele funcții ori demnități publice, exclusiv pe durata exercitării acestora.",
          "h) Casa de vacanță Locuința ocupată temporar, ca reședință secundara, destinată odihnei și recreerii.",
          "i) Condominiu Imobilul format din teren cu una sau mai multe construcții, dintre care unele proprietăți sunt comune, iar restul sunt proprietăți individuale, pentru care se întocmesc o carte funciară colectivă și câte o carte funciară individuală pentru fiecare unitate individuală aflată în proprietate exclusivă, care poate fi reprezentată de locuințe și spații cu altă destinație, după caz. Constituie condominiu:",
          "– un corp de clădire multietajat sau, în condițiile în care se poate delimita proprietatea comună, fiecare tronson cu una sau mai multe scări din cadrul acestuia;",
          "– un ansamblu rezidențial format din locuințe și construcții cu altă destinație, individuale, amplasate izolat, înșiruit sau cuplat, în care proprietățile individuale sunt interdependențe printr-o proprietate comună forțată și perpetuă.",
          "j) Unitate individuală Unitate funcțională, componentă a unui condominiu, formată din una sau mai multe camere de locuit și/sau spații cu altă destinație situate la același nivel al clădirii sau la niveluri diferite, cu dependințele, dotările și utilitățile necesare, având acces direct și intrare separată, și care a fost construită sau transformată în scopul de a fi folosită, de regulă, de o singură gospodărie. În cazul în care accesul la unitatea funcțională sau la condominiu nu se face direct dintr-un drum public, acesta trebuie să fie asigurat printr-o cale de acces sau servitute de trecere, menționate obligatoriu în actele juridice și înscrise în cartea funciară.",
        ],
        children: [
          {
            type: "note",
            content: "(la 30-07-2022, Litera f) din Articolul 2 , Capitolul I a fost modificată de Punctul 1, Articolul I din LEGEA nr. 253 din 20 iulie 2022, publicată în MONITORUL OFICIAL nr. 754 din 27 iulie 2022 )",
          },
          {
            type: "note",
            content: "(la 23-06-2017, Articolul 2 din Capitolul I a fost completat de Punctul 1, ARTICOL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
          {
            type: "note",
            content: "(la 12-10-2009, Litera i) a art. 2 a fost modificată de pct. 1 al articolului unic din LEGEA nr. 310 din 6 octombrie 2009, publicată în MONITORUL OFICIAL nr. 680 din 9 octombrie 2009, care modifică pct. 1 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 210 din 4 decembrie 2008, publicată în MONITORUL OFICIAL nr. 835 din 11 decembrie 2008. )",
          },
          {
            type: "note",
            content: "(la 12-10-2009, Litera j) a art. 2 a fost modificată de pct. 1 al articolului unic din LEGEA nr. 310 din 6 octombrie 2009, publicată în MONITORUL OFICIAL nr. 680 din 9 octombrie 2009, care modifică pct. 1 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 210 din 4 decembrie 2008, publicată în MONITORUL OFICIAL nr. 835 din 11 decembrie 2008. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-3",
        title: "Articolul 3",
        content: "Autorizarea executării construcțiilor de locuințe noi, indiferent de natura proprietății sau a amplasamentului, se face pe baza satisfacerii exigentelor minimale, prevăzute în anexa nr. 1 la prezenta lege. Consiliile județene și locale, potrivit competentelor stabilite prin lege, pot autoriza executarea etapizata a construcțiilor de locuințe.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-2",
    title: "Capitolul II - Dezvoltarea construcției de locuințe",
    children: [
      {
        type: "article",
        id: "art-4",
        title: "Articolul 4",
        content: "Persoanele fizice sau juridice române pot realiza, cu respectarea prevederilor legale, construcții de locuințe pentru folosința proprie sau în scopul valorificării acestora.",
      },
      {
        type: "article",
        id: "art-5",
        title: "Articolul 5",
        content: "Abrogat. Locuințele care se realizează prin investiții din profit de către persoane juridice române, precum și în condițiile art. 7 și 20 din prezenta lege se pot amplasa pe terenurile aparținând persoanelor fizice beneficiare de locuințe, ale persoanelor juridice investitoare sau pe terenuri concesionate în acest scop de consiliile locale persoanelor juridice sau fizice, cu o reducere de până la 95% din taxa de concesiune. Lucrările privind clădirile și terenurile necesare pentru construirea de locuințe prin Agenția Națională pentru Locuințe, cu excepția caselor de vacanță, sunt de utilitate publică. Construcțiile de locuințe se pot amplasa, după caz, pe terenuri aparținând persoanelor fizice, persoanelor juridice, pe terenuri aparținând domeniului public sau privat al statului și/sau al unităților administrativ-teritoriale, identificate printr-un singur număr cadastral și număr de carte funciară, în condițiile legii. Beneficiarul/investitorul trebuie să dețină și să probeze un drept real asupra terenului destinat amplasării construcțiilor de locuințe, cu actele de proprietate și extrasul de carte funciară pentru informare.",
        children: [
          {
            type: "note",
            content: "(la 01-10-1999, Alin. 1 al art. 5 a fost abrogat de art. 4 din ORDONANȚA DE URGENȚĂ nr. 127 din 10 septembrie 1999, publicată în MONITORUL OFICIAL nr. 455 din 20 septembrie 1999. )",
          },
          {
            type: "note",
            content: "(la 28-03-2000, Alin. 2 al art. 5 a fost modificat de pct. 1 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 22 din 23 martie 2000, publicată în MONITORUL OFICIAL nr. 129 din 28 martie 2000. )",
          },
          {
            type: "note",
            content: "(la 28-03-2000, Alin. 4 al art. 5 a fost modificat de pct. 2 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 22 din 23 martie 2000, publicată în MONITORUL OFICIAL nr. 129 din 28 martie 2000. )",
          },
          {
            type: "note",
            content: "(la 11-12-2008, Alin. 5 al art. 5 a fost introdus de pct. 2 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 210 din 4 decembrie 2008, publicată în MONITORUL OFICIAL nr. 835 din 11 decembrie 2008. )",
          },
          {
            type: "note",
            content: "(la 11-12-2008, Alin. 6 al art. 5 a fost introdus de pct. 2 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 210 din 4 decembrie 2008, publicată în MONITORUL OFICIAL nr. 835 din 11 decembrie 2008. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-5-1",
        title: "Articolul 5^1",
        content: "Eliminat.",
        children: [
          {
            type: "note",
            content: "Art. 5^1 a fost eliminat prin abrogarea LEGII nr. 62 din 22 martie 2006, publicate în MONITORUL OFICIAL nr. 268 din 24 martie 2006 de către de art. 3 din ORDONANȚA DE URGENȚĂ nr. 51 din 28 iunie 2006, publicată în MONITORUL OFICIAL nr. 566 din 30 iunie 2006.",
          },
        ],
      },
      {
        type: "article",
        id: "art-6",
        title: "Articolul 6",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 01-10-1999, Art. 6 a fost abrogat de de art. 4 din ORDONANȚA DE URGENȚĂ nr. 127 din 10 septembrie 1999, publicată în MONITORUL OFICIAL nr. 455 din 20 septembrie 1999. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-7",
        title: "Articolul 7",
        content: "Consiliile locale pot realiza din depozitele special constituite locuințe cu suprafețele construite prevăzute în anexa nr. 1 la prezenta lege, exercitând controlul asupra prețului de vânzare, în vederea înlesnirii accesului la proprietate pentru unele categorii de persoane, în următoarea ordine de prioritate: Dobânda la suma avansată din depozitul special, care se restituie în rate, este de 5% anual. Abrogat. Abrogat. În cazul nerestituirii la termenele stabilite a ratelor scadente, se va plăti o dobândă de 10% anual asupra acestor rate. Autoritățile publice locale, prin administratori delegați de acestea, vor încheia cu persoanele fizice prevăzute în prezentul articol contracte de împrumut pentru sumele avansate din depozitul special, potrivit normelor legale în vigoare.",
        items: [
          "a) tinerii căsătoriți care, la data contractării locuinței, au, fiecare, vârsta de până la 35 de ani;",
          "b) persoanele care beneficiază de facilități la cumpărarea sau construirea unei locuințe, potrivit prevederilor Legii nr. 42/1990, republicată;",
          "c) persoanele calificate din agricultură, învățământ, sănătate, administrație publică și culte, care își stabilesc domiciliul în mediul rural;",
          "d) alte categorii de persoane stabilite de consiliile locale. Persoanele din categoriile menționate la lit. a)-d) pot beneficia de o subvenție de la bugetul de stat, în limitele prevederilor bugetare anuale, în raport cu venitul mediu net lunar pe membru de familie, de până la 30% din valoarea locuinței calculată la valoarea finala a acesteia, precum și de plată în rate lunare, pe termen de 20 de ani, a diferenței față de prețul final al locuinței, după ce s-au scăzut subvenția și avansul minim obligatoriu de 10% achitat de contractant, din valoarea locuințelor calculată la data contractării*).",
        ],
        children: [
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 2 al art. 7 a fost modificat de pct. 2 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
          {
            type: "note",
            content: "(la 28-03-2000, Alin. 2^1 al art. 7 a fost introdus de pct. 3 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 22 din 23 martie 2000, publicată în MONITORUL OFICIAL nr. 129 din 28 martie 2000. )",
          },
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 3 al art. 7 a fost abrogat de pct. 3 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 4 al art. 7 a fost abrogat de pct. 3 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-8",
        title: "Articolul 8",
        content: "Persoanele fizice prevăzute la art. 7 se vor adresa consiliilor locale, care vor analiza și vor aproba, după caz, cererile respective, stabilind, totodată, și ordinea de prioritate. Cuantumul subvenției se stabilește în raport cu venitul mediu net lunar pe membru de familie, potrivit normelor aprobate anual de Guvern*).",
        children: [
          {
            type: "note",
            content: "*) A se vedea Nota de la alin. 2 al art. 7.",
          },
        ],
      },
      {
        type: "article",
        id: "art-9",
        title: "Articolul 9",
        content: "Depozitele special constituite pe seama consiliilor locale se alimentează din următoarele surse:",
        items: [
          "a) sumele aprobate anual în bugetele locale, destinate realizării locuințelor;",
          "b) încasările realizate din vânzarea locuințelor și a spațiilor cu altă destinație din clădirile de locuit, cu excepția celor care se fac venituri la bugetele locale, potrivit prevederilor legale în vigoare, precum și sumele încasate potrivit prevederilor art. 7;",
          "c) alocațiile din bugetul de stat, în limita prevederilor aprobate anual cu această destinație;",
          "d) alte surse constituite potrivit legii.",
        ],
      },
      {
        type: "article",
        id: "art-10",
        title: "Articolul 10",
        content: "De prevederile art. 7 din prezenta lege beneficiază, o singura data, persoanele fizice care, împreună cu familia, nu au deținut și nu au în proprietate o locuință, cu excepția persoanelor prevăzute la art. 7 lit. c), sau dacă locuința în care gospodăresc împreună nu satisface exigentele minimale de suprafață, prevăzute în anexa nr. 1, corespunzător numărului de persoane din familie. Abrogat. Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 01-01-2016, Paragraful 2 al art. 10 a fost abrogat de pct. 8 al alin. (1) al art. 502 din LEGEA nr. 227 din 8 septembrie 2015, publicată în MONITORUL OFICIAL nr. 688 din 10 septembrie 2015. )",
          },
          {
            type: "note",
            content: "(la 01-01-2016, Paragraful 3 al art. 10 a fost abrogat de pct. 8 al alin. (1) al art. 502 din LEGEA nr. 227 din 8 septembrie 2015, publicată în MONITORUL OFICIAL nr. 688 din 10 septembrie 2015. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-10-1",
        title: "Articolul 10^1",
        content: "Locuințele și unitățile individuale pot fi înstrăinate și dobândite prin acte juridice între vii, încheiate în formă autentică notarială, sub sancțiunea nulității absolute. Dovada dreptului de proprietate și a celorlalte drepturi reale asupra unei unități de locuit se face numai pe baza actelor de proprietate și a extrasului de carte funciară pentru informare.",
        children: [
          {
            type: "note",
            content: "(la 24-07-2010, Art. 10^1 a fost modificat de art. II din LEGEA nr. 170 din 16 iulie 2010, publicată în MONITORUL OFICIAL nr. 507 din 21 iulie 2010. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-11",
        title: "Articolul 11",
        content: "Locuințele care se realizează în condițiile art. 7-9 din prezenta lege se vor amplasa, prin grija consiliilor locale, pe terenurile aflate în proprietatea unităților administrativ-teritoriale sau pe terenurile aparținând persoanelor fizice beneficiare, în condițiile prevederilor Codului civil, cu respectarea documentațiilor de urbanism legal aprobate și cu asigurarea utilităților și dotărilor edilitare necesare condițiilor de locuit.",
      },
      {
        type: "article",
        id: "art-12",
        title: "Articolul 12",
        content: "Lucrările de viabilizare a terenurilor destinate construcțiilor de locuințe, care constau în: drumuri publice, rețele de alimentare cu apă și canalizare, rețele electrice și, după caz, rețele de gaze, telefonice și de termoficare se finanțează după cum urmează: Abrogat.",
        items: [
          "a) drumurile publice, rețelele de alimentare cu apă și canalizare și, după caz, rețelele de termoficare, din bugetele locale și din alte fonduri legal constituite cu această destinație;",
          "b) rețelele electrice stradale, inclusiv posturile de transformare aferente și, după caz, de gaze și telefonice stradale, din bugetele de venituri și cheltuieli ale regiilor autonome de profil, din credite bancare contractate de acestea, precum și din alte fonduri constituite cu această destinație.",
        ],
        children: [
          {
            type: "note",
            content: "(la 01-10-1999, Alin. 2 al art. 12 a fost abrogat de de art. 4 din ORDONANȚA DE URGENȚĂ nr. 127 din 10 septembrie 1999, publicată în MONITORUL OFICIAL nr. 455 din 20 septembrie 1999. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-13",
        title: "Articolul 13",
        content: "Deschiderea finanțării și începerea lucrărilor din fonduri publice se efectuează după contractarea cu viitorii beneficiari a cel puțin 70% din numărul locuințelor prevăzute a fi începute. Locuințele nerepartizate sau necontractate până la finalizare pot fi vândute în condițiile prevederilor legale.",
        children: [
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 2 al art. 13 a fost introdus de pct. 4 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-14",
        title: "Articolul 14",
        content: "Folosirea sumelor existente în depozitele constituite la nivelul consiliilor locale este de competenta și în răspunderea acestora.",
      },
      {
        type: "article",
        id: "art-15",
        title: "Articolul 15",
        content: "Alocațiile de la bugetul de stat se fundamentează de către consiliile locale, cu ocazia elaborării bugetului de stat, distinct pentru terminarea locuințelor și pentru realizarea de noi locuințe, și se transmit consiliului județean și, respectiv, Consiliului General al Municipiului București, după caz. Propunerile de alocații din bugetul de stat ale consiliilor locale, centralizate pe fiecare județ și municipiul București, se transmit Ministerului Dezvoltării Regionale și Locuinței de către consiliile județene și Consiliul General al Municipiului București. Pentru alocațiile de la bugetul de stat privind sprijinul statului pentru finanțarea construcțiilor de locuințe potrivit prevederilor prezentei legi, Ministerul Dezvoltării Regionale și Locuinței îndeplinește atribuțiile ordonatorului principal de credite, prevăzute în Legea privind finanțele publice. În execuția bugetului de stat, alocațiile pentru construcții de locuințe se repartizează și se acordă consiliilor locale beneficiare de către Ministerul Dezvoltării Regionale și Locuinței, prin intermediul consiliilor județene și al Consiliului General al Municipiului București, potrivit normelor metodologice.",
        children: [
          {
            type: "note",
            content: "(la 12-04-2007, Art. 15 a fost modificat de art. 8 din ORDONANȚA DE URGENȚĂ nr. 24 din 11 aprilie 2007, publicată în MONITORUL OFICIAL nr. 247 din 12 aprilie 2007, prin înlocuirea denumirii \"Ministerul Transporturilor, Construcțiilor și Turismului\" cu denumirea \"Ministerul Dezvoltării, Lucrărilor Publice și Locuințelor\". )",
          },
        ],
      },
      {
        type: "article",
        id: "art-15-1",
        title: "Articolul 15^1",
        content: "Numărul locuințelor definite conform prevederilor art. 2 lit. c)-f^1) și gradul de ocupare al acestora se afișează de către autoritățile administrației publice centrale și locale care le dețin în administrare pe pagina de internet proprie și se actualizează ori de câte ori intervin modificări.",
        children: [
          {
            type: "note",
            content: "(la 30-07-2022, Capitolul II a fost completat de Punctul 2, Articolul I din LEGEA nr. 253 din 20 iulie 2022, publicată în MONITORUL OFICIAL nr. 754 din 27 iulie 2022 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-16",
        title: "Articolul 16",
        content: "Lista cuprinzând numărul, structura pe numărul de camere și amplasamentul locuințelor, precum și lista persoanelor care vor beneficia de locuințe, în ordinea de prioritate stabilită conform art. 7 de către consiliile locale, se afișează la sediul acestora.",
      },
      {
        type: "article",
        id: "art-17",
        title: "Articolul 17",
        content: "Prin familie, în sensul prezentei legi, se înțelege soțul, soția, copiii și părinții soților, care locuiesc și gospodăresc împreună.",
      },
      {
        type: "article",
        id: "art-18",
        title: "Articolul 18",
        content: "Până la restituirea sumelor datorate de către beneficiarii locuințelor, se instituie ipoteca legală asupra locuinței.",
      },
      {
        type: "article",
        id: "art-19",
        title: "Articolul 19",
        content: "Înstrăinarea, prin acte intre vii, a locuințelor pentru realizarea cărora s-au acordat subvenții se poate face numai după restituirea integrala a sumelor actualizate datorate și pe baza dovezii depunerii integrale a contravalorii sumelor actualizate, obținute ca subvenții de la bugetul de stat, potrivit prevederilor art. 7, în depozitul constituit pentru realizarea locuințelor, în condițiile prezentei legi.",
      },
      {
        type: "article",
        id: "art-20",
        title: "Articolul 20",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 01-06-2005, Art. 20 a fost abrogat de lit. b) a art. 8 din ORDONANȚA DE URGENȚĂ nr. 42 din 26 mai 2005, publicată în MONITORUL OFICIAL nr. 463 din 1 iunie 2005. )",
          },
        ],
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-3",
    title: "Capitolul III - Închirierea locuințelor",
    children: [
      {
        type: "article",
        id: "art-21",
        title: "Articolul 21",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 21 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-22",
        title: "Articolul 22",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 22 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-23",
        title: "Articolul 23",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 23 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-24",
        title: "Articolul 24",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 24 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-25",
        title: "Articolul 25",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 25 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-26",
        title: "Articolul 26",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 26 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-27",
        title: "Articolul 27",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 27 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-28",
        title: "Articolul 28",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 28 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-29",
        title: "Articolul 29",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 29 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-30",
        title: "Articolul 30",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 30 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-31",
        title: "Articolul 31",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 31 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-32",
        title: "Articolul 32",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 32 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-33",
        title: "Articolul 33",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 13-06-2011, Art. 33 a fost abrogat de lit. s) a art. 230 din LEGEA nr. 71 din 3 iunie 2011, publicată în MONITORUL OFICIAL nr. 409 din 10 iunie 2011. )",
          },
        ],
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-4",
    title: "Capitolul IV - Administrarea clădirilor de locuit",
    children: [
      {
        type: "article",
        id: "art-34",
        title: "Articolul 34",
        content: "Clădirile de locuit pot fi date de proprietar în administrarea unor persoane fizice sau juridice, asociații, servicii publice sau agenți economici specializați, după caz. Obligațiile celor care administrează sunt, în principal, următoarele:",
        items: [
          "a) gestionarea bunurilor și a fondurilor bănești;",
          "b) efectuarea formalităților necesare în angajarea contractelor cu furnizorii serviciilor pentru exploatarea și întreținerea clădirii, derularea și urmărirea realizării acestor contracte;",
          "c) asigurarea cunoașterii și respectării regulilor de locuit în comun;",
          "d) reprezentarea intereselor proprietarului în raport cu autoritățile publice;",
          "e) îndeplinirea oricăror alte obligații prevăzute de lege.",
        ],
        children: [
          {
            type: "note",
            content: "(la 09-09-1999, Lit. b) a alin. 2 al art. 34 a fost modificată de pct. 8 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-35",
        title: "Articolul 35",
        content: "În clădirile de locuit cu mai multe locuințe, proprietarul răspunde de asigurarea condițiilor de funcționare normală a locuinței aflate în proprietate exclusivă și a spațiilor aflate în proprietate indiviză. În acest scop proprietarii se pot constitui în asociații cu personalitate juridică.",
        children: [
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 2 al art. 35 a fost modificat de pct. 9 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-35-1",
        title: "Articolul 35^1",
        content: "Eliminat.",
        children: [
          {
            type: "note",
            content: "Art. 35^1 a fost eliminat prin abrogarea pct. 4 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 210 din 4 decembrie 2008, publicată în MONITORUL OFICIAL nr. 835 din 11 decembrie 2008 de către pct. 2 al articolului unic din LEGEA nr. 310 din 6 octombrie 2009, publicată în MONITORUL OFICIAL nr. 680 din 9 octombrie 2009.",
          },
        ],
      },
      {
        type: "article",
        id: "art-36",
        title: "Articolul 36",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 22-08-2007, Art. 36 a fost abrogat de art. 61 din LEGEA nr. 230 din 6 iulie 2007, publicată în MONITORUL OFICIAL nr. 490 din 23 iulie 2007. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-37",
        title: "Articolul 37",
        content: "Chiriașii clădirilor cu mai multe locuințe se pot asocia, potrivit legii, în scopul reprezentării intereselor lor în raporturile cu proprietarii, precum și cu alte persoane juridice sau persoane fizice. În același scop, în cazul neconstituirii asociației, chiriașii pot mandata un reprezentant.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-5",
    title: "Capitolul V - Locuința socială",
    children: [
      {
        type: "article",
        id: "art-38",
        title: "Articolul 38",
        content: "Construcțiile de locuințe sociale se pot realiza, în orice localitate, pe amplasamentele prevăzute în documentațiile de urbanism și în condițiile prezentei legi. Constituirea fondului de locuințe sociale se face prin realizarea de construcții noi și prin reabilitarea unor construcții existente. Consiliile locale controlează și răspund de fondul de locuințe sociale situate pe teritoriul unităților administrativ-teritoriale respective.",
      },
      {
        type: "article",
        id: "art-39",
        title: "Articolul 39",
        content: "Locuințele sociale aparțin domeniului public al unităților administrativ-teritoriale.",
      },
      {
        type: "article",
        id: "art-40",
        title: "Articolul 40",
        content: "Locuințele sociale se vor amplasa numai pe terenurile aparținând unităților administrativ-teritoriale, potrivit prevederilor art. 11.",
      },
      {
        type: "article",
        id: "art-41",
        title: "Articolul 41",
        content: "Locuința socială se realizează cu respectarea suprafeței utile și a dotărilor stabilite în limita suprafeței construite, potrivit anexei nr. 1 la prezenta lege. Pentru locuințele care se realizează prin reabilitarea construcțiilor existente se considera obligatorii numai prevederile legate de dotarea minima.",
      },
      {
        type: "article",
        id: "art-42",
        title: "Articolul 42",
        content: "Au acces la locuință socială, în vederea închirierii, familiile sau persoanele cu un venit mediu net lunar pe persoană, realizat în ultimele 12 luni, sub nivelul câștigului salarial mediu net lunar pe total economie, comunicat de Institutul Național de Statistică în ultimul Buletin statistic anterior lunii în care se analizează cererea, precum și anterior lunii în care se repartizează locuința. Abrogat. Venitul net lunar pe familie se stabilește pe baza declarației de venit și a actelor doveditoare, potrivit prevederilor legale. Declarațiile de venit, făcute cu nesinceritate, atrag răspunderea materială sau penală, după caz.",
        children: [
          {
            type: "note",
            content: "(la 09-05-2008, Alin. 1 al art. 42 a fost modificat de pct. 1 al art. I din ORDONANȚA DE URGENȚĂ nr. 57 din 7 mai 2008, publicată în MONITORUL OFICIAL nr. 358 din 9 mai 2008. )",
          },
          {
            type: "note",
            content: "(la 09-05-2008, Alin. 2 al art. 42 a fost abrogat de pct. 2 al art. I din ORDONANȚA DE URGENȚĂ nr. 57 din 7 mai 2008, publicată în MONITORUL OFICIAL nr. 358 din 9 mai 2008. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-43",
        title: "Articolul 43",
        content: "Locuințele sociale se repartizează de către autoritățile administrației publice locale care le au în administrare pe baza criteriilor stabilite anual de acestea, în condițiile prevederilor prezentului capitol, și de ele pot beneficia, în ordinea de prioritate stabilită de autoritățile administrației publice locale, potrivit legii, oricare dintre următoarele categorii de persoane: persoanele și familiile evacuate sau care urmează a fi evacuate din locuințele retrocedate foștilor proprietari, tinerii care au vârsta de până la 35 de ani, tinerii proveniți din instituții de ocrotire socială și care au împlinit vârsta de 18 ani, invalizii de gradele I și II, persoanele cu handicap, pensionarii, veteranii și văduvele de război, beneficiarii prevederilor Legii recunoștinței pentru victoria Revoluției Române din Decembrie 1989, pentru revolta muncitorească anticomunistă de la Brașov din noiembrie 1987 și pentru revolta muncitorească anticomunistă din Valea Jiului - Lupeni - august 1977 nr. 341/2004, cu modificările și completările ulterioare, și ai prevederilor Decretului-lege nr. 118/1990 privind acordarea unor drepturi persoanelor persecutate din motive politice de dictatura instaurată cu începere de la 6 martie 1945, precum și celor deportate în străinătate ori constituite în prizonieri, republicat, cu modificările și completările ulterioare, victimele violenței domestice sau alte persoane sau familii îndreptățite.",
        children: [
          {
            type: "note",
            content: "(la 30-07-2022, Articolul 43 din Capitolul V a fost modificat de Punctul 3, Articolul I din LEGEA nr. 253 din 20 iulie 2022, publicată în MONITORUL OFICIAL nr. 754 din 27 iulie 2022 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-44",
        title: "Articolul 44",
        content: "Contractul de închiriere se încheie de către primar sau de către o persoană împuternicită de acesta cu beneficiarii stabiliți de consiliul local, pe o perioada de 5 ani, cu posibilitatea de prelungire pe baza declarației de venituri și a actelor doveditoare necesare conform prevederilor legale. Nivelul chiriei nu va depăși 10% din venitul net lunar, calculat pe ultimele 12 luni, pe familie. Diferența până la valoarea nominala a chiriei, calculată potrivit art. 31, va fi subvenționată de la bugetul local al unității administrativ-teritoriale unde este situată locuința socială.",
      },
      {
        type: "article",
        id: "art-45",
        title: "Articolul 45",
        content: "Titularul contractului de închiriere este obligat să comunice primarului, în termen de 30 de zile, orice modificare produsă în venitul net lunar al familiei acestuia, sub sancțiunea rezilierii contractului de închiriere. În cazurile în care venitul net lunar pe familie s-a modificat, autoritatea administrației publice locale va opera modificarea chiriei și a subvenției acordate, cuvenite proprietarului.",
      },
      {
        type: "article",
        id: "art-46",
        title: "Articolul 46",
        content: "Contractul de închiriere se poate rezilia:",
        items: [
          "a) în condițiile prevăzute la art. 24 din prezenta lege;",
          "b) în cazul în care venitul mediu net lunar pe familie, realizat în 2 ani fiscali consecutivi, depășește cu peste 20% nivelul minim prevăzut la art. 42 din prezenta lege, iar titularul contractului de închiriere nu a achitat valoarea nominala a chiriei în termen de 90 de zile de la comunicare.",
        ],
      },
      {
        type: "article",
        id: "art-47",
        title: "Articolul 47",
        content: "Locuințele sociale realizate potrivit prezentei legi nu pot fi vândute.",
      },
      {
        type: "article",
        id: "art-48",
        title: "Articolul 48",
        content: "(1) Nu pot beneficia de locuințe sociale, potrivit prezentei legi, persoanele sau familiile care:",
        items: [
          "a) dețin în proprietate o locuință;",
          "b) au înstrăinat o locuință după data de 1 ianuarie 1990;",
          "c) au beneficiat de sprijinul statului în credite și execuție pentru realizarea unei locuințe;",
          "d) dețin, în calitate de chiriaș, o altă locuință din fondul locativ de stat. (2) Prin excepție de la prevederile alin. (1) lit. a) pot beneficia de locuințe sociale victimele violenței domestice numai până la data finalizării partajului prin una dintre modalitățile prevăzute de lege.",
        ],
        children: [
          {
            type: "note",
            content: "(la 30-07-2022, Articolul 48 din Capitolul V a fost modificat de Punctul 4, Articolul I din LEGEA nr. 253 din 20 iulie 2022, publicată în MONITORUL OFICIAL nr. 754 din 27 iulie 2022 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-49",
        title: "Articolul 49",
        content: "Beneficiarii locuințelor sociale nu au dreptul să subinchirieze, să transmită dreptul de locuire sau să schimbe destinația spațiului închiriat, sub sancțiunea rezilierii contractului de închiriere și a suportării eventualelor daune aduse locuinței și clădirii, după caz.",
      },
      {
        type: "article",
        id: "art-50",
        title: "Articolul 50",
        content: "(1) Finanțarea locuințelor sociale se asigură din bugetele locale, în limitele prevederilor bugetare aprobate anual, ale consiliilor locale, în care scop se instituie o subdiviziune de cheltuieli distinctă în aceste bugete. (2) Statul sprijină construcția de locuințe sociale prin programul multianual de construcții locuințe sociale prin care transferă sume de la bugetul de stat, în limita creditelor de angajament și a creditelor bugetare aprobate anual cu această destinație și a estimărilor pentru următorii 3 ani, prevăzute în legea bugetară anuală, Ministerului Dezvoltării, Lucrărilor Publice și Administrației. (3) Persoanele fizice și agenții economici pot sprijini prin donații sau contribuții construcția de locuințe sociale. (4) În termen de 30 de zile de la data intrării în vigoare a legii bugetului de stat, autoritățile publice locale ale unităților/ subdiviziunilor administrativ-teritoriale transmit Ministerului Dezvoltării, Lucrărilor Publice și Administrației solicitările cu obiectivele de investiții noi propuse a fi incluse în program și necesarul de sume pentru anul în curs și estimările pentru următorii ani. Pentru obiectivele de investiții finanțate prin program pentru care sunt încheiate contracte de finanțare multianuale, autoritățile publice locale ale unităților/ subdiviziunilor administrativ-teritoriale transmit solicitarea cu necesarul de sume pentru finalizarea obiectivelor de investiții în situația în care apar modificări ale valorilor transmise inițial, precum și după recepția la terminarea lucrărilor pentru a stabili valoarea finală a investiției. (5) Ministerul Dezvoltării, Lucrărilor Publice și Administrației centralizează propunerile transmise conform alin. (4) și în baza analizei proprii de specialitate, în limita creditelor de angajament și a creditelor bugetare aprobate anual cu această destinație și a estimărilor pentru următorii 3 ani, prevăzute în legea bugetară anuală, întocmește lista de obiective propuse spre finanțare, listă care se aprobă prin ordin al ministrului dezvoltării, lucrărilor publice și administrației. (6) În vederea transferării sumelor alocate de la bugetul de stat, prin derogare de la prevederile art. 34 alin. (2) lit. e) și h) și alin. (3) din Legea nr. 273/2006 privind finanțele publice locale, cu modificările și completările ulterioare, se încheie contracte de finanțare multianuale între Ministerul Dezvoltării, Lucrărilor Publice și Administrației și autoritățile publice locale ale unităților/subdiviziunilor administrativ-teritoriale, pe o perioadă de maximum 4 ani bugetari, în limita creditelor de angajament aprobate și a creditelor bugetare aprobate și/sau estimate cu această destinație, fără eșalonarea anuală a creditelor bugetare, care se înscriu cumulat pentru toată perioada de finanțare. Pe durata de valabilitate a contractelor de finanțare, valoarea creditelor de angajament este egală cu valoarea creditelor bugetare. (7) În funcție de prevederile bugetare aprobate cu această destinație în bugetul Ministerului Dezvoltării, Lucrărilor Publice și Administrației prin legea bugetară anuală sau în situația în care beneficiarul notifică Ministerul Dezvoltării, Lucrărilor Publice și Administrației că nu a recepționat obiectivul de investiții în perioada de valabilitate a contractului de finanțare, durata contractelor de finanțare prevăzută la alin. (6) poate fi prelungită până la maximum 2 ani bugetari. (8) În baza documentelor prevăzute la alin. (4) transmise de către autoritățile publice locale ale unităților/subdiviziunilor administrativ-teritoriale, Ministerul Dezvoltării, Lucrărilor Publice și Administrației poate modifica valoarea creditelor de angajament alocate în perioada de valabilitate a contractelor de finanțare, valoarea finală a obiectivului de investiții determinată după recepția la terminarea lucrărilor, în baza devizului general actualizat și aprobat în condițiile legii, conducând la stabilirea valorii finale a creditelor de angajament alocate prin ordin și prevăzute în contractele de finanțare fiind modificate corespunzător. (9) Mecanismul de finanțare, documentele care trebuie transmise de autoritățile publice locale ale unităților/ subdiviziunilor administrativ-teritoriale, categoriile de lucrări și cheltuielile care se finanțează, modalitatea de transfer al fondurilor de la bugetul de stat, monitorizarea utilizării sumelor se stabilesc prin normele metodologice de aplicare a programului multianual de construcții locuințe sociale/locuințe de necesitate. (10) Autoritățile publice locale ale unităților/subdiviziunilor administrativ-teritoriale răspund de organizarea și derularea procedurilor de atribuire a contractelor de achiziție publică de bunuri/servicii/lucrări, în conformitate cu prevederile legale și cu obligațiile din contractele prevăzute la alin. (6), precum și de modul de utilizare a sumelor alocate de la bugetul de stat prin program potrivit destinației pentru care au fost alocate. (11) Autoritățile publice locale ale unităților/subdiviziunilor administrativ-teritoriale au obligația să transmită Ministerului Dezvoltării, Lucrărilor Publice și Administrației toate documentele necesare monitorizării și finanțării prin program a obiectivelor de investiții și sunt responsabili pentru realitatea, exactitatea și legalitatea datelor prezentate. Articolul XVIII (1) Dispozițiile art. IV, VII și XI intră în vigoare la data aprobării legii bugetare anuale pe anul următor intrării în vigoare a prezentei legi. (2) Contractele de finanțare multianuale prevăzute la art. V alin. (1), art. VIII alin. (1), art. XIII alin. (1) și art. XV alin. (1) se încheie începând cu data intrării în vigoare a dispozițiilor art. IV, VII și XI conform alin. (1), în limita creditelor de angajament aprobate. Articolul X din LEGEA nr. 45 din 8 martie 2022, publicată în MONITORUL OFICIAL nr. 237 din 10 martie 2022 prevede: Articolul X (1) Pentru obiectivele de investiții incluse în Programul național multianual privind creșterea performanței energetice la blocurile de locuințe, derulat conform Ordonanței de urgență a Guvernului nr. 18/2009 privind creșterea performanței energetice a blocurilor de locuințe, aprobată cu modificări și completări prin Legea nr. 158/2011, cu modificările și completările ulterioare, în Programul multianual de construcții locuințe sociale derulat conform Legii locuinței nr. 114/1996, republicată, cu modificările și completările ulterioare, și în Programul multianual de investiții în construcția de locuințe sociale derulat conform Ordonanței de urgență a Guvernului nr. 74/2007 privind asigurarea fondului de locuințe sociale destinate chiriașilor evacuați sau care urmează a fi evacuați din locuințele retrocedate foștilor proprietari, aprobată cu modificări și completări prin Legea nr. 84/2008, cu modificările și completările ulterioare, care nu au fost finalizate, se pot transfera sume care se pot deconta de la bugetul de stat și pentru lucrările efectuate anterior încheierii contractului de finanțare multianual dacă sunt nedecontate de beneficiar, în limita creditelor bugetare aferente anului în curs, conform contractului de finanțare. (2) În cazul în care autoritățile publice locale ale unităților/subdiviziunilor administrativ-teritoriale utilizează sumele transferate pentru realizarea obiectivelor de investiții prevăzute la art. I, IV, V, VII și VIII din prezenta lege, cu nerespectarea prevederilor legale sau contractuale, Ministerul Dezvoltării, Lucrărilor Publice și Administrației notifică autoritățile publice locale ale unităților/subdiviziunilor administrativ-teritoriale cu privire la prevederile încălcate și solicită restituirea în termen de 30 de zile calendaristice a sumelor decontate necuvenit. După expirarea acestui termen se percep dobânzi penalizatoare, în conformitate cu prevederile art. 3 alin. (2) din Ordonanța Guvernului nr. 13/2011 privind dobânda legală remuneratorie și penalizatoare pentru obligații bănești, precum și pentru reglementarea unor măsuri financiar-fiscale în domeniul bancar, aprobată prin Legea nr. 43/2012, cu completările ulterioare. (3) În situația în care autoritățile publice locale ale unităților/subdiviziunilor administrativ-teritoriale nu restituie sumele decontate necuvenit în termenul stabilit, Ministerul Dezvoltării, Lucrărilor Publice și Administrației solicită în scris direcțiilor generale regionale ale finanțelor publice în a căror rază teritorială se află beneficiarii respectivi sistarea alimentării atât cu cote defalcate din impozitul pe venit, cât și cu sume defalcate din unele venituri ale bugetului de stat pentru echilibrare, cu excepția plăților pentru achitarea drepturilor salariale și a contribuțiilor aferente atunci când nu pot fi asigurate din venituri proprii, precum și a sumelor provenite din diverse surse de finanțare pentru realizarea altor obiective de investiții. Alocarea și utilizarea cotelor defalcate din impozitul pe venit și a sumelor defalcate din unele venituri ale bugetului de stat pentru echilibrarea bugetelor locale, care au fost sistate în condițiile altor acte normative, se mențin. (4) După recuperarea sumelor de la autoritățile publice locale ale unităților/subdiviziunilor administrativ-teritoriale, Ministerul Dezvoltării, Lucrărilor Publice și Administrației le comunică în scris direcțiilor generale regionale ale finanțelor publice în a căror rază teritorială se află beneficiarii respectivi, care dispun încetarea restricțiilor prevăzute la alin. (3). (5) La cererea ordonatorilor principali de credite ai bugetelor locale prin care se angajează să achite sumele decontate necuvenit prevăzute la alin. (2) și în care se menționează Ministerul Dezvoltării, Lucrărilor Publice și Administrației ca beneficiar al sumelor și detaliile privind plata, directorii generali ai direcțiilor generale regionale ale finanțelor publice/directorul general al Direcției Generale Regionale a Finanțelor Publice București/șefii de administrație ai administrațiilor județene ale finanțelor publice alimentează conturile acestora atât cu cote defalcate din impozitul pe venit, cât și cu sume defalcate din unele venituri ale bugetului de stat pentru echilibrarea bugetelor locale, până la nivelul sumelor solicitate pentru plata sumelor decontate necuvenit prevăzute la alin. (2). (6) În termen de două zile lucrătoare de la data alocării sumelor, ordonatorii principali de credite ai bugetelor locale prezintă unităților teritoriale ale Trezoreriei Statului documentele de plată prin care achită sumele decontate necuvenit, prevăzute la alin. (2), potrivit celor menționate în cerere. (7) În cazul în care ordonatorii de credite nu prezintă documentele de plată în termenul prevăzut la alin. (6) sau în cazul în care acestea nu sunt întocmite potrivit destinației prevăzute la alin. (5), unitățile teritoriale ale Trezoreriei Statului au obligația să retragă din conturile bugetelor locale sumele aferente cotelor defalcate din impozitul pe venit, precum și sumele defalcate din unele venituri ale bugetului de stat pentru echilibrarea bugetelor locale, care au fost alocate pe baza cererii, corespunzătoare documentelor de plată neprezentate sau întocmite eronat. Unitățile teritoriale ale Trezoreriei Statului au obligația să comunice de îndată ordonatorilor principali de credite ai bugetelor locale sumele care au fost retrase și motivele pentru care au fost retrase.",
        children: [
          {
            type: "note",
            content: "(la 13-03-2022, Articolul 50 din Capitolul V a fost modificat de Articolul IV din LEGEA nr. 45 din 8 martie 2022, publicată în MONITORUL OFICIAL nr. 237 din 10 martie 2022 )",
          },
          {
            type: "note",
            content: "Articolul XVIII din LEGEA nr. 45 din 8 martie 2022, publicată în MONITORUL OFICIAL nr. 237 din 10 martie 2022 prevede:",
          },
        ],
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-6",
    title: "Capitolul VI - Locuința de serviciu și locuința de intervenție",
    children: [
      {
        type: "article",
        id: "art-51",
        title: "Articolul 51",
        content: "Fondul de locuințe de serviciu se compune din:",
        items: [
          "a) locuințe existente, care, potrivit prevederilor legale, rămân cu destinația de locuințe de serviciu la data intrării în vigoare a prezentei legi;",
          "b) locuințe noi. Condițiile și durata de închiriere vor fi stipulate în contractul de închiriere încheiat intre părțile contractante, accesoriu la contractul de muncă.",
        ],
      },
      {
        type: "article",
        id: "art-52",
        title: "Articolul 52",
        content: "Locuințele noi se finanțează, în condițiile legii, din:",
        items: [
          "a) bugetul de stat și bugetele locale, în limitele prevederilor bugetare aprobate anual cu această destinație;",
          "b) bugetele agenților economici, pentru salariații acestora.",
        ],
      },
      {
        type: "article",
        id: "art-53",
        title: "Articolul 53",
        content: "Locuințele de serviciu finanțate de la bugetul de stat sau de la bugetele locale se realizează cu respectarea suprafeței utile și a dotărilor, în limita suprafeței construite pe apartament, potrivit anexei nr. 1. Locuințele de serviciu se vor amplasa după cum urmează:",
        items: [
          "a) pe terenurile aflate în proprietatea statului sau a unităților administrativ-teritoriale, pentru locuințele finanțate de la bugetul de stat sau de la bugetele locale, cu asigurarea viabilizării terenurilor, potrivit prevederilor art. 12;",
          "b) pe terenurile aparținând agenților economici, pentru locuințele și lucrările de viabilizare a terenurilor, finanțate din bugetele acestora. În situații deosebite, determinate de natura amplasamentului și de caracterul zonei, cu aprobarea ordonatorilor de credite, locuințele prevăzute la alin. 1 se pot construi cu suprafețe majorate cu până la 20% față de cele prevăzute în anexa nr. 1, iar peste această limită, cu aprobarea Guvernului. Locuințele de serviciu realizate în condițiile prezentei legi, finanțate din bugetul de stat și din bugetele locale, pot fi vândute în condițiile legii, cu aprobarea Guvernului, în situația în care activitatea care a generat realizarea locuințelor respective s-a restrâns sau a încetat.",
        ],
      },
      {
        type: "article",
        id: "art-54",
        title: "Articolul 54",
        content: "Locuința de intervenție urmează regimul locuinței de serviciu. Locuințele de intervenție se realizează o dată cu obiectivul de investiție și se amplasează în incinta acestuia sau în imediata apropiere. Locuințele de intervenție nu pot fi vândute chiriașilor.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-7",
    title: "Capitolul VII - Locuința de necesitate",
    children: [
      {
        type: "article",
        id: "art-55",
        title: "Articolul 55",
        content: "(1) Locuința de necesitate se finanțează și se realizează în condițiile stabilite pentru locuința socială. (2) Locuința de necesitate se acordă temporar, în regim de urgență:",
        items: [
          "a) persoanelor și familiilor ale căror locuințe au devenit inutilizabile potrivit prevederilor art. 2 lit. f) pct. (i);",
          "b) victimelor violenței domestice prevăzute la art. 2 lit. f) pct. (ii). (3) Contractul de închiriere se încheie de către primarul localității sau de către o persoană împuternicită de acesta, pe baza hotărârii consiliului local:",
          "a) până la înlăturarea efectelor care au făcut inutilizabile locuințele potrivit prevederilor art. 2 lit. f) pct. (i);",
          "b) pe perioada de valabilitate a ordinului de protecție provizoriu emis de polițist și/sau a ordinului de protecție emis de instanța judecătorească în condițiile legii, în cazul victimelor violenței domestice prevăzute la art. 2 lit. f) pct. (ii). (4) Până la momentul încheierii contractului de închiriere, persoanele prevăzute la alin. (3) lit. b) pot fi cazate în mod gratuit în locuințele de necesitate disponibile, numai în măsura în care autoritățile administrației publice locale nu dețin locuri de cazare disponibile, destinate victimelor violenței domestice, în locuințe protejate sau altele asemenea.",
        ],
        children: [
          {
            type: "note",
            content: "(la 30-07-2022, Articolul 55 din Capitolul VII a fost modificat de Punctul 5, Articolul I din LEGEA nr. 253 din 20 iulie 2022, publicată în MONITORUL OFICIAL nr. 754 din 27 iulie 2022 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-56",
        title: "Articolul 56",
        content: "Consiliile locale pot declara, în cazuri de extrema urgentă, drept locuințe de necesitate, locuințele libere aflate în fondul de locuințe sociale. Locuințele de necesitate libere se pot constitui temporar ca fond de locuințe sociale.",
        children: [
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 2 al art. 56 a fost introdus de pct. 13 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
        ],
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-7-1",
    title: "Capitolul VII^1 - Locuința de sprijin",
    children: [
      {
        type: "article",
        id: "art-56-1",
        title: "Articolul 56^1",
        content: "Locuințele de sprijin aparțin domeniului public al unităților administrativ-teritoriale și nu pot fi înstrăinate de către acestea.",
        children: [
          {
            type: "note",
            content: "(la 23-06-2017, Capitolul VII^1 a fost completat de Punctul 2, ARTICOLUL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-56-2",
        title: "Articolul 56^2",
        content: "Locuințele de sprijin se repartizează de către autoritățile administrației publice locale, care le-au cumpărat prin licitație publică, pe baza criteriilor stabilite anual prin hotărâre a consiliului local, în condițiile prevederilor prezentului capitol. De aceste locuințe pot beneficia persoanele și familiile care urmează a fi evacuate sau au fost evacuate prin proceduri de executare silită din locuințe, în urma neachitării obligațiilor derivate din contractele de credit ipotecar.",
        children: [
          {
            type: "note",
            content: "(la 23-06-2017, Capitolul VII^1 a fost completat de Punctul 2, ARTICOLUL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-56-3",
        title: "Articolul 56^3",
        content: "(1) Contractul de închiriere se încheie de către primar sau de către o persoană împuternicită de acesta cu beneficiarii stabiliți de consiliul local, pe o perioadă de 5 ani, cu posibilitatea prelungirii pe baza declarației de venituri și a actelor doveditoare necesare conform prevederilor legale. (2) Nivelul chiriei nu va depăși 10% din venitul net lunar, calculat pe ultimele 12 luni, pe familie. Diferența până la valoarea nominală a chiriei va fi subvenționată de la bugetul local al unității administrativ-teritoriale unde este situată locuința de sprijin.",
        children: [
          {
            type: "note",
            content: "(la 23-06-2017, Capitolul VII^1 a fost completat de Punctul 2, ARTICOLUL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-56-4",
        title: "Articolul 56^4",
        content: "Contractul de închiriere se poate rezilia:",
        items: [
          "a) la cererea chiriașului, cu condiția notificării prealabile întrun termen de minimum 60 de zile;",
          "b) la cererea proprietarului, în cazul în care:",
          "– chiriașul nu a respectat clauzele contractului de închiriere;",
          "– chiriașul nu a achitat valoarea nominală a chiriei în termen de 90 de zile de la comunicare;",
          "– chiriașul nu și-a achitat obligațiile ce îi revin din cheltuielile comune pe o perioadă de 90 de zile, dacă au fost stabilite prin contractul de închiriere în sarcina chiriașului;",
          "– chiriașul are un comportament care face imposibilă conviețuirea sau împiedică folosirea normală a locuinței.",
        ],
        children: [
          {
            type: "note",
            content: "(la 23-06-2017, Capitolul VII^1 a fost completat de Punctul 2, ARTICOLUL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-56-5",
        title: "Articolul 56^5",
        content: "Nu pot beneficia de locuințe de sprijin, potrivit prezentei legi, persoanele sau familiile care:",
        items: [
          "a) dețin în proprietate o altă locuință;",
          "b) dețin, în calitate de chiriaș, o altă locuință din fondul locativ de stat.",
        ],
        children: [
          {
            type: "note",
            content: "(la 23-06-2017, Capitolul VII^1 a fost completat de Punctul 2, ARTICOLUL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-56-6",
        title: "Articolul 56^6",
        content: "Beneficiarii locuințelor de sprijin nu au dreptul să subînchirieze, să transmită dreptul de locuire sau să schimbe destinația spațiului închiriat, sub sancțiunea rezilierii contractului de închiriere și a suportării eventualelor daune aduse locuinței și clădirii, după caz.",
        children: [
          {
            type: "note",
            content: "(la 23-06-2017, Capitolul VII^1 a fost completat de Punctul 2, ARTICOLUL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-56-7",
        title: "Articolul 56^7",
        content: "(1) În cazul în care locuința de sprijin nu este solicitată de către fostul proprietar al locuinței, aceasta va fi repartizată altor persoane a căror locuință a fost executată silit în urma neplății unui contract de credit ipotecar. (2) Situația este valabilă și în cazul expirării termenului prevăzut la art. 56^4, dacă chiriașul nu dorește să prelungească contractul de închiriere.",
        children: [
          {
            type: "note",
            content: "(la 23-06-2017, Capitolul VII^1 a fost completat de Punctul 2, ARTICOLUL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-56-8",
        title: "Articolul 56^8",
        content: "În cazul în care numărul cererilor pentru închirierea locuințelor de sprijin la nivelul unei autorități ale administrației publice locale este, timp de cel puțin un an, constant mai redus decât numărul locuințelor de sprijin aflate în proprietatea autorității administrației publice locale, aceasta poate aproba închirierea locuințelor de sprijin și altor categorii de solicitanți, cu respectarea prevederilor prezentei legi.",
        children: [
          {
            type: "note",
            content: "(la 23-06-2017, Capitolul VII^1 a fost completat de Punctul 2, ARTICOLUL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
        ],
      },
      {
        type: "article",
        id: "art-56-9",
        title: "Articolul 56^9",
        content: "Prin derogare de la prevederile art. 2 din Ordonanța de urgență a Guvernului nr. 37/2008 privind reglementarea unor măsuri financiare în domeniul bugetar, aprobată cu modificări prin Legea nr. 275/2008, cu modificările și completările ulterioare, autoritățile administrației publice locale pot decide achiziționarea, prin licitație publică, a locuințelor reglementate de prezentul capitol.",
        children: [
          {
            type: "note",
            content: "(la 23-06-2017, Capitolul VII^1 a fost completat de Punctul 2, ARTICOLUL UNIC din LEGEA nr. 143 din 16 iunie 2017, publicată în MONITORUL OFICIAL nr. 461 din 20 iunie 2017 )",
          },
        ],
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-8",
    title: "Capitolul VIII - Locuința de protocol",
    children: [
      {
        type: "article",
        id: "art-57",
        title: "Articolul 57",
        content: "Locuințele de protocol sunt proprietate publică a statului. Administrarea fondului locativ de protocol se face de către Regia Autonoma \"Administrația Patrimoniului Protocolului de Stat\", care asigură evidența, întreținerea, repararea și conservarea acestuia, precum și încasarea chiriei. Atribuirea, ocuparea și folosirea locuințelor de protocol se fac în condițiile prezentei legi.",
      },
      {
        type: "article",
        id: "art-58",
        title: "Articolul 58",
        content: "Președintele României, președintele Senatului, președintele Camerei Deputaților și primul-ministru beneficiază, în condițiile prezentei legi, de câte o locuință de protocol, ca reședință oficială. Reședințele oficiale ale persoanelor prevăzute la alin. (1) se atribuie de către Guvern și sunt puse la dispoziția lor, împreună cu dotările aferente, pe perioada exercitării funcției, de către Regia Autonomă «Administrația Patrimoniului Protocolului de Stat» . Lista cuprinzând imobilele cu destinație de reședință oficială, precum și celelalte locuințe de protocol și condițiile pe care acestea trebuie să le îndeplinească, inclusiv cele de dotare și confort, se stabilesc prin hotărâre a Guvernului.",
        children: [
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 2 al art. 58 a fost modificat de pct. 14 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 3 al art. 58 a fost modificat de pct. 14 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-59",
        title: "Articolul 59",
        content: "Pot beneficia de locuința de protocol, la cerere, cu plata chiriei prevăzute de lege, persoanele care îndeplinesc următoarele funcții publice: vicepreședinți ai Senatului și ai Camerei Deputaților, miniștri de stat, miniștrii și asimilații acestora, precum și președintele Curții Supreme de Justiție, președintele Curții Constituționale, președintele Curții de Conturi, președintele Consiliului Legislativ și avocatul poporului, pe durata exercitării funcției sau a mandatului. Pentru persoanele prevăzute la alin. 1, atribuirea locuinței de protocol se face prin decizie a primului-ministru și se pune la dispoziția lor de către Regia Autonoma \"Administrația Patrimoniului Protocolului de Stat\". Atribuirea locuințelor de protocol se poate face numai dacă persoanele prevăzute la alin. 1 nu dețin, în localitatea în care își desfășoară activitatea, o altă locuință care să corespundă condițiilor stabilite potrivit art. 58 alin. 3. Locuințele de protocol se amplasează numai în clădiri cu număr redus de apartamente destinate acestei folosințe. Suprafețele locuințelor de protocol vor fi cu cel puțin 30% mai mari decât cele prevăzute în anexa nr. 1, care face parte integrantă din prezenta lege.",
        children: [
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 4 al art. 59 a fost introdus de pct. 15 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
          {
            type: "note",
            content: "(la 09-09-1999, Alin. 5 al art. 59 a fost introdus de pct. 15 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-60",
        title: "Articolul 60",
        content: "Pentru reședințele oficiale, Regia Autonoma \"Administrația Patrimoniului Protocolului de Stat\" va încheia contracte de închiriere cu serviciile de specialitate ale instituțiilor în care își desfășoară activitatea persoanele beneficiare. Pentru locuințele de protocol, contractele de închiriere se încheie de către Regia Autonoma \"Administrația Patrimoniului Protocolului de Stat\" cu beneficiarii direcți, care, pe această bază, vor putea ocupa locuința respectivă împreună cu membrii familiei. Contractul de închiriere a locuințelor de protocol și a celor cu destinație de reședință oficială încetează de drept în termen de 60 de zile de la data eliberării din funcție a beneficiarului. Atribuirea, în condițiile prezentei legi, a unei reședințe oficiale, respectiv a unei locuințe de protocol, nu afectează drepturile locative deținute de persoanele prevăzute la art. 58 și 59.",
      },
    ],
  },
  {
    type: "chapter",
    id: "cap-9",
    title: "Capitolul IX - Dispoziții tranzitorii și finale",
    children: [
      {
        type: "article",
        id: "art-61",
        title: "Articolul 61",
        content: "Orice litigiu în legătură cu aplicarea prevederilor prezentei legi se soluționează de către instanțele judecătorești.",
      },
      {
        type: "article",
        id: "art-61-1",
        title: "Articolul 61^1",
        content: "Prevederile art. 35 se aplică tuturor proprietarilor din cadrul condominiilor definite la art. 2 lit. i).",
        children: [
          {
            type: "note",
            content: "(la 12-10-2009, Art. 61^1 a fost introdus de pct. 3 al articolului unic din LEGEA nr. 310 din 6 octombrie 2009, publicată în MONITORUL OFICIAL nr. 680 din 9 octombrie 2009, care completează articolul unic din ORDONANȚA DE URGENȚĂ nr. 210 din 4 decembrie 2008, publicată în MONITORUL OFICIAL nr. 835 din 11 decembrie 2008, cu pct. 4^1. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-62",
        title: "Articolul 62",
        content: "Prevederile Ordonanței Guvernului nr. 19/1994 privind stimularea investițiilor pentru realizarea unor lucrări publice și construcții de locuințe, aprobată și modificată prin Legea nr. 82/1995, se aplică în continuare până la terminarea locuințelor începute. Abrogat. Abrogat. Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 01-09-2001, Alin. 2 al art. 62 a fost abrogat de art. II din ORDONANȚA nr. 76 din 30 august 2001, publicată în MONITORUL OFICIAL nr. 540 din 1 septembrie 2001. )",
          },
          {
            type: "note",
            content: "(la 01-09-2001, Alin. 3 al art. 62 a fost abrogat de art. II din ORDONANȚA nr. 76 din 30 august 2001, publicată în MONITORUL OFICIAL nr. 540 din 1 septembrie 2001. )",
          },
          {
            type: "note",
            content: "(la 01-09-2001, Alin. 4 al art. 62 a fost abrogat de art. II din ORDONANȚA nr. 76 din 30 august 2001, publicată în MONITORUL OFICIAL nr. 540 din 1 septembrie 2001. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-63",
        title: "Articolul 63",
        content: "Abrogat. Persoanele juridice române care investesc din profit pentru lucrările prevăzute la art. 5, 6 și 12, separat sau cumulativ, beneficiază de scutirea de impozit pe profitul investit, conform prevederilor art. 5 din prezenta lege. Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 01-01-2000, Alin. 1 al art. 63 a fost abrogat de art. 86 din ORDONANȚA nr. 73 din 27 august 1999, publicată în MONITORUL OFICIAL nr. 419 din 31 august 1999. ORDONANȚA nr. 73 din 27 august 1999, publicată în MONITORUL OFICIAL nr. 419 din 31 august 1999 a fost abrogată de art. 85 din ORDONANȚA nr. 7 din 19 iulie 2001, publicată în MONITORUL OFICIAL nr. 435 din 3 august 2001. ORDONANȚA nr. 7 din 19 iulie 2001, publicată în MONITORUL OFICIAL nr. 435 din 3 august 2001 a fost abrogată de art. 298 din LEGEA nr. 571 din 22 decembrie 2003, publicată în MONITORUL OFICIAL nr. 927 din 23 decembrie 2003. )",
          },
          {
            type: "note",
            content: "Alin. 3 al art. 63 a fost eliminat prin abrogarea LEGII nr. 62 din 22 martie 2006, publicate în MONITORUL OFICIAL nr. 268 din 24 martie 2006 de către de art. 3 din ORDONANȚA DE URGENȚĂ nr. 51 din 28 iunie 2006, publicată în MONITORUL OFICIAL nr. 566 din 30 iunie 2006.",
          },
        ],
      },
      {
        type: "article",
        id: "art-64",
        title: "Articolul 64",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 22-08-2007, Art. 64 a fost abrogat de art. 61 din LEGEA nr. 230 din 6 iulie 2007, publicată în MONITORUL OFICIAL nr. 490 din 23 iulie 2007. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-65",
        title: "Articolul 65",
        content: "Construirea caselor de vacanță se autorizează, la cererea persoanelor fizice și a agenților economici, numai pe terenurile aflate în proprietatea acestora sau concesionate în condițiile legii, în zonele stabilite prin documentațiile de urbanism și amenajare a teritoriului, aprobate potrivit legii.",
      },
      {
        type: "article",
        id: "art-65-1",
        title: "Articolul 65^1",
        content: "Terenurile cu sau fără construcții care fac obiectul prezentei legi se identifică prin număr cadastral și număr de carte funciară, după caz.",
        children: [
          {
            type: "note",
            content: "(la 11-12-2008, Art. 65^1 a fost introdus de pct. 5 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 210 din 4 decembrie 2008, publicată în MONITORUL OFICIAL nr. 835 din 11 decembrie 2008. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-66",
        title: "Articolul 66",
        content: "Plata chiriei pentru reședințele oficiale se face din bugetele Președenției României, Senatului, Camerei Deputaților și Secretariatului General al Guvernului, în limitele prevederilor bugetare aprobate anual.",
      },
      {
        type: "article",
        id: "art-67",
        title: "Articolul 67",
        content: "Guvernul răspunde de aplicarea unitara, pe întreg teritoriul tarii, a politicii de dezvoltare a construcției de locuințe. Programul de dezvoltare a construcției de locuințe se elaborează de Ministerul Dezvoltării Regionale și Locuinței, pe baza fundamentării organelor administrației publice centrale interesate, a consiliilor județene și locale, în acord cu documentațiile de urbanism și amenajare a teritoriului, aprobate conform legii.",
        children: [
          {
            type: "note",
            content: "(la 12-04-2007, Alin. 2 al art. 67 a fost modificat de art. 8 din ORDONANȚA DE URGENȚĂ nr. 24 din 11 aprilie 2007, publicată în MONITORUL OFICIAL nr. 247 din 12 aprilie 2007, prin înlocuirea denumirii \"Ministerul Transporturilor, Construcțiilor și Turismului\" cu denumirea \"Ministerul Dezvoltării, Lucrărilor Publice și Locuințelor\". )",
          },
        ],
      },
      {
        type: "article",
        id: "art-68",
        title: "Articolul 68",
        content: "Pentru aducerea la îndeplinire a dispozițiilor prezentei legi, Guvernul va adopta norme metodologice de aplicare*).",
        children: [
          {
            type: "note",
            content: "*) Normele metodologice au fost aprobate prin Hotărârea Guvernului nr. 446 din 12 august 1997, publicate în Monitorul Oficial al României, Partea I, nr. 203 din 21 august 1997.",
          },
        ],
      },
      {
        type: "article",
        id: "art-69",
        title: "Articolul 69",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 22-08-2007, Art. 69 a fost abrogat de art. 61 din LEGEA nr. 230 din 6 iulie 2007, publicată în MONITORUL OFICIAL nr. 490 din 23 iulie 2007. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-70",
        title: "Articolul 70",
        content: "Abrogat.",
        children: [
          {
            type: "note",
            content: "(la 09-09-1999, Art. 70 a fost abrogat de pct. 18 al art. I din LEGEA nr. 145 din 27 iulie 1999, publicată în MONITORUL OFICIAL nr. 439 din 9 septembrie 1999. )",
          },
        ],
      },
      {
        type: "article",
        id: "art-71",
        title: "Articolul 71",
        content: "Persoanele care beneficiază de drepturi mai favorabile decât cele prevăzute în prezenta lege, consacrate prin legi speciale, care se referă, printre altele, la materia raporturilor juridice locative și a celor conexe acestora, se bucură în continuare de aplicarea drepturilor mai favorabile.",
      },
      {
        type: "article",
        id: "art-72",
        title: "Articolul 72",
        content: "Dispozițiile prezentei legi privind închirierea locuințelor se completează cu dispozițiile Codului civil privind contractul de locațiune.",
      },
      {
        type: "article",
        id: "art-73",
        title: "Articolul 73",
        content: "La data intrării în vigoare a prezentei legi se abrogă:",
        items: [
          "– Legea nr. 5/1973 privind administrarea fondului locativ și reglementarea raporturilor dintre proprietari și chiriași, cu excepția cap. 4 și a art. 63 cu referire la cap. 4 din aceeași lege, exclusiv dispozițiile referitoare la suprafețele locative proprietate personală;",
          "– H.C.M. nr. 860/1973 pentru stabilirea masurilor de executare a Legii nr. 5/1973, în ceea ce privește închirierea de locuințe;",
          "– Decretul Consiliului de Stat nr. 256/1984 privind îmbunătățirea regimului de construire a locuințelor și modificarea unor reglementari referitoare la stabilirea prețurilor limită ale locuințelor care se construiesc din fondurile statului, a prețurilor de contractare ale locuințelor proprietate personală și a prețurilor de vânzare ale locuințelor din fondul locativ de stat, cu excepția art. III și a anexelor nr. 3 și 4;",
          "– Decretul Consiliului de Stat nr. 68/1975 privind îmbunătățirea regimului de construire a locuințelor din fondurile statului sau din fondurile populației cu sprijinul statului în credite și execuție;",
          "– art. 12 alin. 1 lit. a) și alin. 2, art. 21-25 și art. 35 alin. 2 din Legea nr. 50/1991 privind autorizarea executării construcțiilor și unele măsuri pentru realizarea locuințelor;",
          "– orice alte dispoziții contrare prevederilor prezentei legi.",
        ],
      },
    ],
  },
  {
    type: "annexa",
    id: "anexa-1",
    title: "Anexa nr. 1 - EXIGENȚE MINIMALE pentru locuințe",
    children: [
      {
        type: "article",
        id: "anexa-1-a",
        title: "A. Cerințe minimale",
        items: [
          "– acces liber individual la spațiul locuibil, fără tulburarea posesiei și a folosinței exclusive a spațiului deținut de către o altă persoană sau familie;",
          "– spațiu pentru odihnă;",
          "– spațiu pentru prepararea hranei;",
          "– grup sanitar;",
          "– acces la energia electrică și apă potabilă, evacuarea controlată a apelor uzate și a reziduurilor menajere;",
          "– Eliminată.",
        ],
        children: [
          {
            type: "note",
            content: "Ultima liniuță de la litera A din anexa 1 a fost eliminată prin abrogarea pct. 6 al articolului unic din ORDONANȚA DE URGENȚĂ nr. 210 din 4 decembrie 2008, publicată în MONITORUL OFICIAL nr. 835 din 11 decembrie 2008 de către pct. 4 al articolului unic din LEGEA nr. 310 din 6 octombrie 2009, publicată în MONITORUL OFICIAL nr. 680 din 9 octombrie 2009.",
          },
        ],
      },
      {
        type: "article",
        id: "anexa-1-b",
        title: "B. Suprafețe minimale",
        children: [
          {
            type: "table",
            tableData: {
              headers: ["Persoane/familie", "Camere/locuință", "Camera de zi (mp)", "Dormitoare (mp)", "Loc de luat masă (mp)", "Bucătărie (mp)", "Încăperi sanitare (mp)", "Spații de depozitare (mp)", "Suprafața utilă (mp)", "Suprafața construită (mp)"],
              rows: [
                ["1", "1", "18,00", "-", "2,50", "5,00", "4,50", "2,00", "37,00", "58,00"],
                ["2", "2", "18,00", "12,00", "3,00", "5,00", "4,50", "2,00", "52,00", "81,00"],
                ["3", "3", "18,00", "22,00", "3,00", "5,50", "6,50", "2,50", "66,00", "102,00"],
                ["4", "3", "19,00", "24,00", "3,50", "5,50", "6,50", "3,50", "74,00", "115,00"],
                ["5", "4", "20,00", "34,00", "3,50", "6,00", "7,50", "4,00", "87,00", "135,00"],
                ["6", "4", "21,00", "36,00", "4,50", "6,00", "7,50", "4,50", "93,00", "144,00"],
                ["7", "5", "22,00", "46,00", "5,00", "6,50", "9,00", "5,00", "107,00", "166,00"],
                ["8", "5", "22,00", "48,00", "6,00", "6,50", "9,00", "5,50", "110,00", "171,00"],
              ],
            },
          },
          {
            type: "note",
            content: "Suprafața camerei de zi de la locuința cu o cameră include spațiul pentru dormit.",
          },
          {
            type: "note",
            content: "Locul de luat masă poate fi înglobat în bucătărie sau în camera de zi.",
          },
          {
            type: "note",
            content: "Înălțimea liberă minimă a camerelor de locuit va fi de 2,55 m, cu excepția mansardelor, supantelor și nișelor, la care se va asigura un volum minim de 15 mc de persoană.",
          },
          {
            type: "note",
            content: "Suprafața locuibilă este suprafața desfășurată a încăperilor de locuit. Ea cuprinde suprafața dormitoarelor și a camerei de zi.",
          },
          {
            type: "note",
            content: "Suprafața utilă este suprafața desfășurată, mai puțin suprafața aferentă pereților.",
          },
          {
            type: "note",
            content: "Suprafața utilă a locuinței este suma tuturor suprafețelor utile ale încăperilor. Ea cuprinde: camera de zi, dormitoare, băi, WC, duș, bucătărie, spații de depozitare și de circulație din interiorul locuinței. Nu se cuprind: suprafața logiilor și a balcoanelor, pragurile golurilor de uși, ale trecerilor cu deschideri până la 1,00 m, nișele de radiatoare, precum și suprafețele ocupate de sobe și cazane de baie (câte 0,50 mp pentru fiecare sobă și cazan de baie).",
          },
          {
            type: "note",
            content: "Suprafața construită pe locuință, prevăzută în tabelul B, este suma suprafețelor utile ale încăperilor, logiilor, balcoanelor, precum și a cotei-părți din suprafețele părților comune ale clădirilor (spălătorii, uscătorii, casa scării, inclusiv anexele pentru colectarea, depozitarea și evacuarea deșeurilor menajere, casa liftului etc.), la care se adaugă suprafața aferentă pereților interiori și exteriori ai locuinței; în cazul încălzirii cu combustibil solid sau lichid se va prevedea și suprafața necesară depozitării combustibilului.",
          },
          {
            type: "note",
            content: "Suprafața încăperii sanitare principale din locuință va permite accesul la cada de baie al persoanelor imobilizate în scaun cu rotile.",
          },
          {
            type: "note",
            content: "Încăperea sanitară se include în locuință, în cazul în care pot fi asigurate alimentarea cu apă și canalizarea.",
          },
          {
            type: "note",
            content: "Lățimea minimă de circulație a coridoarelor și a vestibulului din interiorul locuinței va fi de 120 cm.",
          },
          {
            type: "note",
            content: "În funcție de amplasamentul construcției, suprafețele construite pot avea abateri în limitele de ±10%.",
          },
          {
            type: "note",
            content: "Numărul de persoane pe locuință se utilizează la repartizarea locuințelor sociale, de intervenție, de serviciu și de necesitate.",
          },
        ],
      },
      {
        type: "article",
        id: "anexa-1-c",
        title: "C. Încăperi sanitare",
        children: [
          {
            type: "table",
            tableData: {
              headers: ["", "1 cameră", "2 camere", "3 camere", "4 camere", "5 camere"],
              rows: [
                ["Baie", "1", "1", "1", "1", "2"],
                ["Duș", "-", "-", "-", "1", "-"],
                ["WC", "-", "-", "1", "-", "-"],
              ],
            },
          },
        ],
      },
      {
        type: "article",
        id: "anexa-1-d",
        title: "D. Dotarea minimă a încăperilor sanitare",
        children: [
          {
            type: "table",
            tableData: {
              headers: ["", "Baie", "Duș", "WC"],
              rows: [
                ["Cadă de baie", "1", "-", "-"],
                ["Vas WC", "1", "1", "1"],
                ["Lavoar mare", "1", "-", "-"],
                ["Lavoar mic", "-", "1", "1"],
                ["Cuvă pentru duș", "-", "1", "-"],
                ["Etajeră mare", "1", "-", "-"],
                ["Etajeră mică", "-", "1", "1"],
                ["Oglindă mare", "1", "-", "-"],
                ["Oglindă mică", "-", "1", "1"],
                ["Portprosop", "1", "1", "1"],
                ["Portsăpun", "1", "1", "1"],
                ["Porthârtie", "1", "1", "1"],
                ["Cuier", "1", "1", "-"],
                ["Sifon pardoseală", "1", "1", "-"],
              ],
            },
          },
          {
            type: "note",
            content: "În baie se va prevedea spațiul pentru mașina de spălat rufe.",
          },
          {
            type: "note",
            content: "Încăperile sanitare vor fi ventilate direct sau prin coș de ventilație.",
          },
        ],
      },
      {
        type: "article",
        id: "anexa-1-e",
        title: "E. Dotarea minimă a bucătăriei",
        children: [
          {
            type: "table",
            tableData: {
              headers: ["Nr. de camere/locuință", "1-2", "3", "4", "5"],
              rows: [
                ["Spălător cu cuvă și picurător", "1", "1", "1", "1"],
              ],
            },
          },
          {
            type: "note",
            content: "În bucătărie se vor prevedea: coș de ventilație, spațiu pentru frigider și pentru masă de lucru.",
          },
        ],
      },
      {
        type: "article",
        id: "anexa-1-f",
        title: "F. Dotarea minimă cu instalații electrice",
        children: [
          {
            type: "table",
            tableData: {
              headers: ["", "Dormitor", "Camera de zi", "Bucătărie", "Baie", "Duș", "WC"],
              rows: [
                ["Loc de lampă", "1", "1", "-", "-", "-", "-"],
                ["Aplică", "-", "-", "1", "1", "1", "1"],
                ["Comutator", "1", "1", "-", "-", "-", "-"],
                ["Întrerupător", "-", "-", "1", "1", "1", "1"],
                ["Priză", "2", "3", "1", "-", "-", "-"],
                ["Priză cu contact de protecție", "-", "-", "1", "1", "-", "-"],
              ],
            },
          },
          {
            type: "note",
            content: "Se vor prevedea întrerupătoare și aplice pentru fiecare spațiu de depozitare și spațiu de circulație.",
          },
          {
            type: "note",
            content: "Priza cu contact de protecție, instalată pentru baie, se montează în exteriorul încăperii.",
          },
          {
            type: "note",
            content: "Fiecare locuință va fi prevăzută cu instalație de sonerie.",
          },
          {
            type: "note",
            content: "În clădiri cu mai multe locuințe se vor prevedea instalații și prize pentru antenă colectivă și telefon.",
          },
          {
            type: "note",
            content: "Pentru locuințele situate în mediu rural, dotările minime privind încăperile sanitare și bucătăria se vor putea realiza pe parcursul existenței construcției, în corelare cu racordarea locuinței la rețelele de utilitate publică sau la sistemul propriu de alimentare cu apă și evacuare controlată a apelor uzate.",
          },
        ],
      },
      {
        type: "article",
        id: "anexa-1-g",
        title: "G. Spații și instalații de folosință comună pentru clădiri cu mai multe locuințe",
        items: [
          "– Instalații de prevenire și stingere a incendiilor, precum și ascensor conform normelor în vigoare.",
          "– Spații pentru biciclete, cărucioare și pentru uscarea rufelor.",
          "– Spații destinate colectării, depozitării și evacuării deșeurilor menajere.",
          "– Spații pentru depozitarea combustibililor solizi sau lichizi, în situațiile în care nu se pot asigura încălzirea centrală și/sau gaze la bucătărie.",
          "– Rampă de acces pentru persoanele imobilizate în scaun cu rotile.",
        ],
      },
    ],
  },
];
