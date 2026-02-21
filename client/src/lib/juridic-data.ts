export interface JuridicSection {
  type: "heading" | "subheading" | "paragraph" | "list" | "table" | "numbered-list";
  title?: string;
  content?: string;
  items?: string[];
  tableData?: { headers: string[]; rows: string[][] };
}

export interface JuridicDocument {
  id: string;
  title: string;
  description: string;
  sections: JuridicSection[];
}

export interface JuridicCategory {
  id: string;
  title: string;
  description: string;
  documents: JuridicDocument[];
}

export const JURIDIC_CATEGORIES: JuridicCategory[] = [
  {
    id: "constituire-asociatie",
    title: "Constituire Asociație",
    description: "Documente necesare pentru constituirea asociației de proprietari",
    documents: [
      {
        id: "procedura-creare",
        title: "Procedura creare asociație de proprietari",
        description: "Pașii necesari pentru constituirea unei asociații de proprietari",
        sections: [
          {
            type: "heading",
            title: "Constituire asociație de proprietari — Procedura",
          },
          {
            type: "numbered-list",
            items: [
              "Se stabilește ziua pentru convocarea proprietarilor din clădiri pentru constituirea asociației de proprietari. Cu 10 zile înainte de această dată, se afișează convocarea într-un loc vizibil pentru toți proprietarii.",
              "Dacă la această reuniune nu se prezintă majoritatea proprietarilor (jumătate plus 1), aceștia își pot da ulterior acordul semnând un tabel nominal.",
              "Statutul asociației trebuie să conțină:",
            ],
          },
          {
            type: "list",
            items: [
              "Numele, forma juridică, sediul, durata de funcționare",
              "Scopul și obiectul de activitate",
              "Mijloace materiale și bănești de care poate dispune asociația de proprietari; structura veniturilor și cheltuielilor",
              "Membrii asociației, drepturile și obligațiile acestora",
              "Structura organizatorică, modul de funcționare, managementul asociației de proprietari",
              "Repartizarea cheltuielilor asociației",
              "Condițiile în care se dizolvă asociația",
            ],
          },
          {
            type: "numbered-list",
            items: [
              "Acordul de asociere trebuie să conțină:",
            ],
          },
          {
            type: "list",
            items: [
              "Adresa și individualizarea proprietății individuale, potrivit actului de proprietate",
              "Numele și prenumele proprietarilor",
              "Descrierea proprietății: descrierea clădirii, structura, numărul de etaje, numărul de apartamente structurate pe număr de camere, suprafața terenului aferent clădirii",
              "Enumerarea și descrierea părților aflate în proprietatea comună",
            ],
          },
          {
            type: "numbered-list",
            items: [
              "Statutul și acordul de asociere se multiplică, se legalizează și se predă câte un exemplar fiecărui proprietar.",
              "Statutul, actul de asociere și procesul verbal al adunării generale, împreună cu o cerere se depun la administrația financiară.",
              "Asociația dobândește personalitate juridică în baza încheierii dată de judecătorul delegat desemnat la administrația financiară locală de către președintele judecătoriei sectorului. Apoi asociația primește un cod fiscal.",
              "Pentru a se asigura fondurile necesare pentru plățile curente, asociația stabilește cuantumul și cota de participare a fiecărui proprietar la constituirea fondului de rulment. În mod normal, fondul de rulment reprezintă suma necesară pentru a acoperi cheltuielile pe o lună. Acest fond se constituie pentru plata anticipată a cotei de participare ce îi corespunde fiecărui proprietar.",
              "Se constituie și un fond de reparații a zonelor comune de construcții sau instalații, fond ce se va vira în contul asociației și se va folosi doar cu acordul adunării generale a proprietarilor.",
              "Cota de contribuție la cheltuielile asociației, calculate pentru fiecare proprietar va fi plătită în maxim 20 de zile de la înștiințare.",
            ],
          },
        ],
      },
      {
        id: "cerere-inscriere",
        title: "Cerere de înscriere în asociația de proprietari",
        description: "Model de cerere pentru înscrierea ca membru în asociația de proprietari",
        sections: [
          {
            type: "heading",
            title: "CERERE DE ÎNSCRIERE ÎN ASOCIAȚIA DE PROPRIETARI",
          },
          {
            type: "paragraph",
            content: "Doamnă/Domnule Președinte,",
          },
          {
            type: "paragraph",
            content: "Subsemnatul/a ……………………………… proprietar al apartamentului/spațiului nr………….din cadrul imobilului situat în localitatea …………………………………… str. …………………………………… nr. ………… , sector/județ …………………………… vă rog să binevoiți a-mi aproba înscrierea ca membru în Asociația de Proprietari Bloc …..",
          },
          {
            type: "paragraph",
            content: "Data: ………………",
          },
          {
            type: "paragraph",
            content: "Semnătura,",
          },
        ],
      },
      {
        id: "act-constitutiv",
        title: "Act Constitutiv",
        description: "Model de act constitutiv pentru asociația de proprietari",
        sections: [
          {
            type: "heading",
            title: "ANEXĂ LA STATUT — ACT CONSTITUTIV",
          },
          {
            type: "paragraph",
            content: "Noi, subsemnații, proprietari asociați, am consimțit prin prezentul act la constituirea Asociației de Proprietari Bloc ……, din localitatea …………………, Str. ……………………………………..., Nr. ……., asociație non-profit, non-guvernamentală, apolitică cu scop socio-administrativ, având ca obiect de activitate administrarea și dezvoltarea condominiului.",
          },
          {
            type: "paragraph",
            content: "Constituirea se face în baza legilor și actelor normative ale statului român, cu privire la asocierea persoanelor fizice/juridice cu scopuri comune, organizarea și funcționarea condominiilor, gestiunea și administrarea locuințelor (H.G. 400/2003; Legea locuinței nr.114/1996, republicată în 1997, completată și modificată prin Legea 145/1999; HG nr.1275/2000).",
          },
          {
            type: "paragraph",
            content: "Noi, membrii Asociației de Proprietari Bloc ……, împuternicim pe dl./dna. ………………… în calitate de ……………………, să reprezinte asociația la perfectarea actelor, în vederea obținerii personalității juridice.",
          },
          {
            type: "paragraph",
            content: "Semnat azi: …………………….",
          },
          {
            type: "table",
            title: "Tabel membri asociație",
            tableData: {
              headers: [
                "Nr. crt.",
                "Nr. apart.",
                "Numele și prenumele",
                "Act de identitate (B.I./C.I. Seria, Nr.)",
                "Calitatea (funcția în asoc sau membru)",
                "Semnătura",
              ],
              rows: [
                ["1", "1", "Ionescu Dan", "V.C. nr. 123876", "membru", ""],
              ],
            },
          },
          {
            type: "paragraph",
            content: "PREȘEDINTE,",
          },
        ],
      },
      {
        id: "act-aditional",
        title: "Act Adițional la Acordul de Asociere",
        description: "Model de act adițional la acordul de asociere al asociației de proprietari",
        sections: [
          {
            type: "heading",
            title: "ACT ADIȚIONAL LA ACORDUL DE ASOCIERE",
          },
          {
            type: "paragraph",
            content: "ASOCIAȚIA DE PROPRIETARI BLOC ........",
          },
          {
            type: "paragraph",
            content: "În conformitate cu H.G.R nr. 1275/2000 art. 46 se încheie prezentul act adițional la Acordul de Asociere al Asociației de Proprietari Bloc ………… cu sediul în localitatea ………………………………., str ………………………………………………………………….. nr. ……… sector/județ ………………………. dosar P.J. nr. ………………../data ……………… înregistrat la Judecătoria …………………………………………….. .",
          },
          {
            type: "paragraph",
            content: "Prezentul act adițional prevede modificări sau completări cu privire la: modificarea proprietarului membru al asociației / înscrierea în asociația de proprietari / modificări asupra datelor privind apartamentul, conform tabelului de mai jos:",
          },
          {
            type: "table",
            title: "Tabel modificări proprietate",
            tableData: {
              headers: [
                "Nr. crt.",
                "Nr. apart./spațiu",
                "Numele și prenumele (titular/titulari/reprezentant legal)",
                "Adresa de domiciliu",
                "Act de proprietate (denumire/număr/data) *",
                "Cotă-parte Indiviză de proprietate [%]",
                "Suprafață utilă",
                "Semnătura Ștampilă",
                "Precizări privind modificarea/completarea **",
              ],
              rows: [],
            },
          },
          {
            type: "paragraph",
            content: "* contract de vânzare-cumpărare, titlu de proprietate, contract de construire, certificat de moștenitor, act de donație etc.",
          },
          {
            type: "paragraph",
            content: "** se va menționa: modifică poziția ………. din acordul de asociere / completează acordul de asociere prin înscriere nouă / modifică titularul sau adresa sau cota-parte indiviză sau suprafața utilă.",
          },
          {
            type: "paragraph",
            content: "Președinte,                                              Comisia de Cenzori",
          },
          {
            type: "paragraph",
            content: "L.S.",
          },
        ],
      },
      {
        id: "acord-asociere",
        title: "Acord de Asociere",
        description: "Model de acord de asociere privind constituirea asociației de proprietari",
        sections: [
          {
            type: "heading",
            title: "ACORD DE ASOCIERE",
          },
          {
            type: "paragraph",
            content: "privind constituirea ASOCIAȚIEI DE PROPRIETARI BLOC …….. Str. ………………………………………….Nr………..",
          },
          {
            type: "heading",
            title: "1. Asocierea",
          },
          {
            type: "subheading",
            title: "1.1.",
            content: "Prin prezentul acord de asociere, având în vedere prevederile legale în vigoare, noi, proprietarii de bunuri imobiliare (locuințe/apartamente și/sau spații cu altă destinație decât cea de locuință) din condominiul situat în localitatea ..., str. ... nr. ..., județul ..., sectorul ..., am hotărât să ne asociem în asociație de proprietari, care va fi înregistrată la …………………………………………………………….",
          },
          {
            type: "paragraph",
            content: "În cadrul asociației se includ și proprietățile aflate la adresele următoare: ………………………………………………………………………………………………….",
          },
          {
            type: "subheading",
            title: "1.2.",
            content: "Asocierea a fost determinată de existența proprietății comune, indivizibil legată de proprietățile individuale pe care le deținem în cadrul condominiului. Asociația de proprietari constituie forma de organizare și de reprezentare a intereselor tuturor proprietarilor, legate de întreținerea, funcționarea, dezvoltarea și exploatarea proprietății pe care o deținem în comun.",
          },
          {
            type: "heading",
            title: "2. Proprietarii unităților imobiliare",
          },
          {
            type: "subheading",
            title: "2.1.",
            content: "Asociații sunt posesori ai unei (unor) unități de proprietate imobiliară, compusă dintr-un spațiu de locuit (apartament) sau spațiu cu altă destinație decât cea de locuință, ca proprietate individuală, împreună cu cota-parte din proprietatea comună.",
          },
          {
            type: "subheading",
            title: "2.2.",
            content: "Lista proprietarilor, a datelor lor personale precum și cotele-părți de proprietate indiviză din proprietatea comună, conform contractului de vânzare-cumpărare/contractului de construire, se prezintă în procesul-verbal ANEXA nr.1 la acest acord de asociere, care cuprinde și semnătura individuală, valabilă, pentru constituirea asociației.",
          },
          {
            type: "heading",
            title: "3. Descrierea proprietății",
          },
          {
            type: "subheading",
            title: "3.1.",
            content: "Proprietatea, pentru care se constituie asociația de proprietari, se află la adresa menționată la punctul 1 al acestui acord de asociere. Ea figurează în planul de urbanism al localității ……………",
          },
          {
            type: "subheading",
            title: "3.2.",
            content: "Condominiul are următoarele caracteristici:",
          },
          {
            type: "list",
            items: [
              "bloc de locuințe cu/fără spații comerciale la parter (nivelul ...) și cu/fără alte spații destinate unor activități lucrative ...;",
              "regim de înălțime: subsol, demisol, parter, mezanin și număr de etaje. Subsolurile sunt niveluri tehnice sau, după caz, destinate unor activități lucrative, depozite, adăposturi de apărare civilă și altele asemenea;",
              "structura în funcție de destinația proprietății: un număr de ... apartamente, cu o suprafață utilă totală de ...mp., destinate locuirii, din care: cu 1 cameră/garsoniere: ... (nr.) ...; cu 2 camere: ... (nr.) ...; cu 3 camere: ... (nr.) ...; cu 4 camere: ... (nr.) ...; etc. ...; un număr de ... spații comerciale, birouri, sedii de societăți comerciale și altele asemenea, situate la ..., însumând o suprafață utilă de ...mp.;",
              "structura clădirii (de exemplu: diafragme din beton armat, integral prefabricate, cu pereți interiori neportanți, stâlpi și grinzi, precum și cadre; diafragme din beton armat sau înlocuitori, planșee din beton armat sau din lemn și altele asemenea, cu acoperiș tip șarpantă/terasă);",
              "clădirea a fost dată în folosință în anul ... și este/nu este inclusă în Lista monumentelor istorice;",
              "clădirea este legată la rețelele de utilități (termoficare, apă rece, canalizare, telefonie, electricitate și altele asemenea) comunale sau, după caz, are centrală termică proprie ori alte surse proprii de utilități.",
            ],
          },
          {
            type: "subheading",
            title: "3.3.",
            content: "Proprietatea, în cadrul asociației de proprietari, este reprezentată prin proprietatea individuală și proprietatea comună.",
          },
          {
            type: "subheading",
            title: "3.4.",
            content: "Proprietatea individuală (apartamentul sau spațiul cu altă destinație decât cea de locuință) aparține exclusiv proprietarului și este un bun al său, asupra căruia poate decide în deplină libertate. Fiecare apartament sau spațiu cu altă destinație decât cea de locuință constă din suprafața cuprinsă între zidurile, subdiviziunile dintr-un apartament sau spațiu cu altă destinație decât cea de locuință și zidurile de perimetru cu suprafața interioară a acestora. Zidurile interioare, podelele și tavanele se consideră ca făcând parte din apartament, respectiv din spațiul în care sunt cuprinse.",
          },
          {
            type: "paragraph",
            content: "Zidurile de învecinare între apartamente și/sau spațiu fac parte în cota-parte egală din fiecare dintre acestea.",
          },
          {
            type: "paragraph",
            content: "Sunt considerate că fac parte din proprietatea individuală și dependințele situate la același nivel sau la niveluri diferite, nelegate structural de apartamentul sau de spațiul respectiv, dar făcând parte din acesta. Proprietății asupra unui apartament sau spațiu cu altă destinație decât cea de locuință îi corespunde și o cotă-parte proporțională din proprietatea comună, alocată conform cotelor înscrise în anexa la prezentul acord de asociere, preluate potrivit actului de proprietate sau care au fost recalculate potrivit prevederilor art. 45 din Normele metodologice privind organizarea și funcționarea asociațiilor de proprietari. Prin proprietate individuală, în sensul prezentului acord de asociere, se înțelege și proprietatea aparținând unei singure persoane, în indiviziune cu cotele stabilite sau în devălmășie, ca bunuri comune ale soților.",
          },
          {
            type: "subheading",
            title: "3.5.",
            content: "Proprietatea comună include toate părțile din condominiu care nu sunt părți dintr-un apartament sau spațiu cu altă destinație decât cea de locuință. Toate aceste părți formează obiecte ale coproprietății forțate, adică ale stării de indiviziune forțată și perpetuă, destinate a fi utilizate în comun de proprietari.",
          },
          {
            type: "paragraph",
            content: "Proprietatea comună include următoarele: terenul aferent construcției, în suprafață totală de ...mp., fundațiile, fațada, intrările, suprafața exterioară a zidurilor de perimetru ale proprietății individuale, scările comune, casa scării, casa ascensorului, ascensoarele, trotuarele, centrala termică sau punctul termic, canalizarea, instalațiile de apă și încălzire centrală, de gaze, electricitate și telefonice de la punctul de branșament sau de racordare la rețeaua stradală (exclusiv acesta) până la punctul de racord la instalația interioară a apartamentului sau spațiului cu altă destinație decât cea de locuință, spălătoria, uscătoria, culoarele clădirii, subsolul sau nivelul tehnic, încăperile personalului de serviciu al clădirii, încăperea/construcția destinată depozitării gunoaielor, tubul colector, instalații de ventilație, canale termice, spațiile care deservesc crematorii, podul, acoperișul și învelitoarea acestuia, antena și cablul TV până la priza de branșament.",
          },
          {
            type: "paragraph",
            content: "Se consideră, de asemenea, în indiviziune forțată boxele din subsoluri sau camerele de serviciu din mansarde, poduri, magazii și garaje, platforme exterioare sau încorporate clădirii, amplasate, de regulă, separat de proprietatea individuală, dacă au destinația de a servi, în comun, toate aceste proprietăți individuale. Suprafețele exterioare zidurilor de perimetru ale proprietăților individuale, podelele și tavanele din jurul acestor proprietăți și orice conducte, cabluri, linii de utilități, care trec prin acestea și care deservesc mai mult de o asemenea proprietate, sunt considerate obiecte de folosință comună, fiind supuse stării de indiviziune forțată.",
          },
          {
            type: "paragraph",
            content: "Terenul aferent construcției (clădirii) este în suprafață totală de ………..m.p. și este în proprietatea comună a proprietarilor clădirii.",
          },
          {
            type: "paragraph",
            content: "Regimul de folosire a proprietății comune, ca și drepturile și obligațiile proprietarilor în legătură cu ele, vor fi conforme cu prevederile legale și cu hotărârile și măsurile adoptate de către adunarea generală a proprietarilor în condițiile impuse de statutul și regulamentele interne ale asociației.",
          },
          {
            type: "subheading",
            title: "3.6.",
            content: "Fiecare apartament sau spațiu cu altă destinație decât cea de locuință, împreună cu cota-parte indiviză a sa din proprietatea comună, reprezintă o parcelă individuală de proprietate imobiliară și formează o unitate care poate fi înstrăinată sau transferată în orice mod numai ca un tot.",
          },
          {
            type: "subheading",
            title: "3.7.",
            content: "Fiecare dintre aceste proprietăți imobiliare poate fi folosită, ipotecată sau înstrăinată în deplină libertate de către proprietarul/proprietarii acesteia, ținându-se seama de condiția menționată mai sus și de legile și reglementările în vigoare.",
          },
          {
            type: "subheading",
            title: "3.8.",
            content: "Baza tehnico-materială a asociației, la data semnării prezentului acord de asociere, este formată din: …………………………………………….Asociații pot hotărî dezvoltarea și după caz, restrângerea bazei tehnico-materiale, numai în cadrul adunării generale a proprietarilor conform statutului asociației.",
          },
          {
            type: "subheading",
            title: "3.9.",
            content: "Pentru identificarea, prin localizare și suprafață, a fiecărui apartament, respectiv spațiu cu altă destinație decât cea de locuință, sunt anexate la prezentul acord de asociere planșe sau schițe, inclusiv ale terenului aferent construcției.",
          },
          {
            type: "heading",
            title: "4. Modificarea proprietății",
          },
          {
            type: "subheading",
            title: "4.1.",
            content: "La constituirea asociației de proprietari și la semnarea procesului-verbal anexat prezentului acord de asociere, proprietarii din condominiu dețin cotele-părți din proprietatea comună conform ANEXEI nr.1.",
          },
          {
            type: "subheading",
            title: "4.2.",
            content: "Recalcularea cotei-părți de proprietate indiviză din proprietatea comună (%) se face raportând suprafața utilă sau cu altă destinație decât cea de locuință, modificată, la suprafața totală destinată locuirii sau altor activități, în cadrul blocului [suprafața anterioară apartamentului sau spațiului +/- suprafața nou creată] / suprafața totală anterioară modificării +/- suprafața nou creată în ansamblul clădirii (m.p.)]",
          },
          {
            type: "heading",
            title: "5. Înregistrarea proprietății",
          },
          {
            type: "subheading",
            title: "5.1.",
            content: "Proprietățile imobiliare sunt în număr de ..., în totalitate, înscrise în cartea funciară ori, după caz, în registrul de transcripțiuni și inscripțiuni de la biroul de carte funciară de pe lângă judecătoria în a cărei circumscripție este situat imobilul.",
          },
          {
            type: "subheading",
            title: "5.2.",
            content: "În cadrul condominiului, un număr de ... proprietăți imobiliare sunt proprietate a persoanelor juridice de drept public sau privat și sunt gestionate de ... (autoritate sau instituție publică, agent economic, persoană juridică fără scop patrimonial și altele asemenea).",
          },
          {
            type: "subheading",
            title: "5.3.",
            content: "Pentru fiecare proprietate imobiliară care a fost trecută în proprietate privată și la fiecare transfer de proprietate ulterior se vor face consemnările necesare în cartea funciară, prin grija proprietarului/proprietarilor acesteia.",
          },
          {
            type: "subheading",
            title: "5.4.",
            content: "În momentul dobândirii unui apartament sau a unui spațiu cu altă destinație decât cea de locuință, fiecare proprietar poate deveni membru al asociației de proprietari.",
          },
          {
            type: "subheading",
            title: "5.5.",
            content: "Fiecare proprietar va rămâne membru al asociației de proprietari până la pierderea calității de proprietar în cadrul condominiului.",
          },
          {
            type: "heading",
            title: "6. Restricții privind folosința și construcțiile",
          },
          {
            type: "subheading",
            title: "6.1.",
            content: "Fiecare proprietar, indiferent dacă face parte sau nu din prezenta asociație de proprietari, are dreptul de a folosi proprietatea comună din clădire, în condițiile stabilite de lege, de regulamente ale autorităților în drept, dar nici un proprietar nu poate folosi această proprietate astfel încât să lezeze drepturile sau interesele oricărui alt proprietar al acesteia, inclusiv cele stabilite prin prezentul acord de asociere și prin statutul asociației de proprietari.",
          },
          {
            type: "subheading",
            title: "6.2.",
            content: "Proprietatea comună, definită la pct. 3.5., se află în grija tuturor proprietarilor, care participă, proporțional, cu cota-parte indiviză de proprietate la întreținerea și repararea ei.",
          },
          {
            type: "subheading",
            title: "6.3.",
            content: "Chiriașii din proprietățile imobiliare individuale, aferente condominiului, nu pot participa la managementul acestora sau la adoptarea de decizii ale asociației de proprietari, ci trebuie să se supună regulilor adoptate de asociația de proprietari, în măsură în care acestea se aplică tuturor ocupanților clădirii.",
          },
          {
            type: "subheading",
            title: "6.4.",
            content: "Proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință îl poate folosi conform destinației: pentru sine, pentru familia sa, pentru chiriași sau pentru musafiri.",
          },
          {
            type: "paragraph",
            content: "Proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință are dreptul de a-l închiria, cu condiția ca respectivul chiriaș să accepte folosirea acestuia în condițiile prevăzute în prezentul acord de asociere sau respectând orice reguli ori regulamente ale asociației de proprietari.",
          },
          {
            type: "subheading",
            title: "6.5.",
            content: "Proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință este obligat să mențină apartamentul sau spațiul respectiv în bună stare și este răspunzător de daunele provocate din cauza neîndeplinirii acestei obligații.",
          },
          {
            type: "paragraph",
            content: "Proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință poate face lucrări de construcții sau renovări ale acestuia fără a afecta structura de rezistență a imobilului, doar dacă aceste lucrări sunt realizate în conformitate cu prevederile stabilite de lege și pe riscul și cheltuiala sa.",
          },
          {
            type: "subheading",
            title: "6.6.",
            content: "Orice instalație suplimentară față de cele cuprinse în cartea tehnică a construcției pe proprietatea comună, în favoarea unuia sau a mai multor proprietari (fire electrice, elemente de calorifer, antene de televiziune, mașini și echipamente, dispozitive de aer condiționat, instalații telefonice și altele asemenea), pe pereții exteriori ai clădirii, precum și pe pereții interiori ai spațiilor comune sau străpungerea acoperiṣului se poate realiza numai cu acordul asociației de proprietari și după obținerea aprobărilor legale.",
          },
          {
            type: "subheading",
            title: "6.7.",
            content: "Reprezentanții asociației de proprietari au dreptul să intre într-un apartament sau într-un spațiu cu altă destinație decât cea de locuință, în baza unui preaviz de 15 zile, semnat pentru luare la cunoștință de către proprietar și înmânat acestuia, pentru a efectua lucrări de întreținere, reparare, renovare sau de înlocuire a părților proprietății comune din apartament sau din spațiul cu altă destinație decât cea de locuință, la care accesul se poate face numai prin acestea.",
          },
          {
            type: "paragraph",
            content: "Dacă necesitatea de a intra în apartament sau în spațiul cu altă destinație decât cea de locuință este urgentă (cazuri de calamitate: incendiu, inundație, emanații de gaz, scurgeri de substanțe chimice nocive și altele asemenea), nu este nevoie de preaviz, iar reprezentanții asociației de proprietari pot intra, indiferent dacă proprietarul este sau nu este prezent, cu respectarea prevederilor legale referitoare la cazurile de necesitate.",
          },
          {
            type: "paragraph",
            content: "În cazul în care proprietarii care nu au semnat acordul de asociere se opun acestor prevederi, se vor utiliza căile legale de atac al unor asemenea poziții, asociația de proprietari rezervându-și dreptul de a calcula și de a pretinde daune morale și materiale provocate de acest refuz.",
          },
          {
            type: "subheading",
            title: "6.8.",
            content: "Orice tip de publicitate în/pe proprietatea comună se poate face numai cu acordul adunării generale a asociației de proprietari. Ocupanții apartamentelor și ai spațiilor cu altă destinație decât cea de locuință trebuie să se abțină de la acțiunile care duc la tulburarea liniștii locatarilor între orele 22,00 - 8,00, prin producerea de zgomote, larmă sau prin folosirea oricărui aparat, obiect ori instrument muzical la intensitate mare. (Se pot preciza și alte restricții, ca de exemplu: depozitarea de substanțe și produse periculoase și altele asemenea.)",
          },
          {
            type: "paragraph",
            content: "Proprietarii care dețin animale în apartament sau în spațiul cu altă destinație decât cea de locuință nu pot lăsa în libertate ori fără supraveghere animalele care pot prezenta pericol pentru persoane sau bunuri. Acești proprietari răspund pentru deteriorarea proprietății comune de către animale și trebuie să ia măsuri pentru a nu afecta liniștea și confortul proprietarilor/locuitorilor din imobil.",
          },
          {
            type: "heading",
            title: "7. Administrare, sancțiuni și reguli interne",
          },
          {
            type: "subheading",
            title: "7.1.",
            content: "Asociația de proprietari va răspunde de administrarea și de funcționarea condominiului/condominiilor și de întreținerea, repararea, renovarea și îmbunătățirea proprietății comune, iar costurile aferente vor fi calculate conform cotei părți proporționale de proprietate sau, după caz, conform numărului de persoane prevăzute în anexa la prezentul acord de asociere. (Se pot face precizări concrete privind repartizarea cheltuielilor comune de întreținere pe cota-parte indiviză sau pe număr de persoane, după caz, avându-se în vedere prevederile legale și opțiunile asociațiilor de proprietari, acolo unde legea permite acest lucru.)",
          },
          {
            type: "subheading",
            title: "7.2.",
            content: "Nici un proprietar de apartament sau de spațiu cu altă destinație decât cea de locuință nu va fi exceptat de obligația de a contribui la plata cheltuielilor comune, ca urmare a renunțării la folosirea unei părți din proprietatea comună, a abandonării apartamentului sau a spațiului cu altă destinație decât cea de locuință ori în alte situații.",
          },
          {
            type: "subheading",
            title: "7.3.",
            content: "Administrarea condominiului se va face în conformitate cu prevederile legislației în vigoare, ale prezentului acord de asociere și ale statutului asociației de proprietari, precum și cu regulile și regulamentele care se vor adopta prin hotărâre de către adunarea generală a asociației de proprietari.",
          },
          {
            type: "subheading",
            title: "7.4.",
            content: "Fiecare proprietar, chiriaș sau ocupant al unui apartament ori spațiu cu altă destinație decât cea de locuință se va conforma regulilor prezentului acord de asociere, regulilor și regulamentelor asociației de proprietari, precum și hotărârilor și rezoluțiilor adoptate legal de către asociația de proprietari.",
          },
          {
            type: "paragraph",
            content: "Nerespectarea acestor prevederi, hotărâri și rezoluții va constitui temeiul acțiunii în justiție a asociației de proprietari împotriva celor în cauză, pentru recuperarea daunelor sau în vederea obligării la conformare. În cazul în care un chiriaș sau alt ocupant al apartamentului ori spațiului cu altă destinație decât cea de locuință nu respectă reglementările menționate, asociația de proprietari îl poate chema în judecată pe chiriașul/ocupantul sau pe proprietarul respectivului apartament ori al spațiului cu altă destinație decât cea de locuință sau pe ambii, după cum hotărăște asociația de proprietari.",
          },
          {
            type: "subheading",
            title: "7.5.",
            content: "Dacă o hotărâre a adunării generale a asociației de proprietari sau prevederile prezentului acord de asociere conduc la lezarea intereselor unei minorități a proprietarilor, orice proprietar poate intenta acțiune în justiție împotriva asociației de proprietari, pentru invalidarea hotărârii sau a prevederii respective, în termen de 60 de zile de la adoptarea acesteia.",
          },
          {
            type: "paragraph",
            content: "Președintele comitetului executiv va reprezenta asociația de proprietari în procesele intentate împotriva proprietarilor sau de către proprietari.",
          },
          {
            type: "paragraph",
            content: "Orice hotărâre a adunării generale a asociației de proprietari ce intră sub incidența acestei reglementări se aplică numai după expirarea termenului de 60 de zile de la adoptarea acesteia.",
          },
          {
            type: "heading",
            title: "8. Revocarea sau amendarea acordului de asociere",
          },
          {
            type: "paragraph",
            content: "Prezentul acord de asociere poate fi revocat sau amendat cu acordul a cel puțin 2/3 din semnatarii acestuia, în cadrul Adunării Generale a proprietarilor, conform prevederilor Statutului asociației.",
          },
          {
            type: "heading",
            title: "9. Dispoziții finale",
          },
          {
            type: "subheading",
            title: "9.1.",
            content: "Asociația, ca persoană juridică română și subiect de drept privat, va dezvolta relațiile sale cu terții (persoane fizice și/sau juridice române și străine), în condițiile economiei de piață și cu respectarea legislației române.",
          },
          {
            type: "subheading",
            title: "9.2.",
            content: "Asociații sunt de acord, fără a avea o restricție legală în acest sens, ca asociația să întreprindă activități cu scop lucrativ, potrivit unor programe și bugete de venituri și cheltuieli aprobate de către adunarea generală în condițiile statutului propriu, folosind și elemente sau părți din proprietatea comună, având drept scop creșterea resurselor financiare și diminuarea eforturilor materiale ale proprietarilor asociați din condominiu.",
          },
          {
            type: "paragraph",
            content: "În scop similar, asociații propun plasarea fondurilor asociației, în condițiile legii și a propriului statut și fără a prejudicia asociația, în acțiuni profitabile scopurilor asociației, generatoare de venituri.",
          },
          {
            type: "subheading",
            title: "9.3.",
            content: "Oricare drepturi și obligații ale membrilor asociației, născute din calitatea de asociat, se transmit dobânditorilor sau subdobânditorilor eventuali, conform legislației în vigoare referitoare la asemenea cazuri.",
          },
          {
            type: "subheading",
            title: "9.4.",
            content: "Eventualele litigii dintre asociație și alte persoane fizice sau juridice, sunt de competența instanțelor judecătorești sau de arbitraj, iar litigiile dintre asociați se vor rezolva, pe cât posibil, pe cale amiabilă sau, în caz contrar, prin hotărâre judecătorească.",
          },
          {
            type: "subheading",
            title: "9.5.",
            content: "Pentru problemele neprecizate în prezentul acord de asociere, se vor aplica prevederile H.G. 400/2003 și prevederile Legii locuinței nr.114/1996 cu modificările și completările ulterioare, precum și prevederile altor legi și acte normative apărute ulterior datei semnării prezentului acord.",
          },
          {
            type: "subheading",
            title: "9.6.",
            content: "Anexa nr.1 este parte integrantă din prezentul acord de asociere.",
          },
          {
            type: "heading",
            title: "10. Semnarea acordului de asociere",
          },
          {
            type: "subheading",
            title: "10.1.",
            content: "Acordul fiecărui proprietar se consemnează, prin semnătură individuală a titularului/titularilor sau a reprezentantului legal al acestuia, în procesul-verbal din ANEXA nr.1",
          },
        ],
      },
      {
        id: "regulament-condominiu",
        title: "Regulament Condominiu",
        description: "Regulamentul de coproprietate al Ansamblului Rezidențial METROPOLIS",
        sections: [
          {
            type: "heading",
            title: "REGULAMENTUL DE COPROPRIETATE AL ANSAMBLULUI REZIDENȚIAL METROPOLIS",
          },
          {
            type: "heading",
            title: "DISPOZIȚII GENERALE. DEFINIȚII",
          },
          {
            type: "paragraph",
            content: "Prezentul Regulament stabilește cadrul general aplicabil proprietarilor apartamentelor și spațiilor cu altă destinație decât aceea de locuință, edificate în Ansamblul Rezidențial METROPOLIS, situat în București, str. Telega nr. 6, Sector 1, denumit în continuare Condominiul și/sau Ansamblul Rezidențial.",
          },
          {
            type: "heading",
            title: "NORME GENERALE DE UTILIZARE A UNITĂȚILOR DE LOCUIT",
          },
          {
            type: "paragraph",
            content: "Fiecare proprietar, indiferent dacă face parte sau nu din prezenta Asociație de Proprietari, are dreptul de a folosi proprietatea comună din clădire, în condițiile stabilite de lege, de regulamente ale autorităților în drept, dar nici un proprietar nu poate folosi această proprietate astfel încât să lezeze drepturile sau interesele oricărui alt proprietar al acesteia, inclusiv cele stabilite prin prezentul acord de asociere și prin statutul asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "Proprietatea comună se află în grija tuturor proprietarilor, care participă, proporțional, cu cota-parte indiviză de proprietate la întreținerea și repararea ei.",
          },
          {
            type: "paragraph",
            content: "Chiriaşii din proprietățile imobiliare individuale, aferente condominiului, nu pot participa la managementul acestora sau la adoptarea de decizii ale asociației de proprietari, ci trebuie să se supună regulilor adoptate de Asociația de proprietari, în măsură în care acestea se aplică tuturor ocupanților clădirii.",
          },
          {
            type: "paragraph",
            content: "Proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință îl poate folosi conform destinației: pentru sine, pentru familia sa, pentru chiriași sau pentru musafiri.",
          },
          {
            type: "paragraph",
            content: "Proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință are dreptul de a-l închiria, cu condiția ca respectivul chiriaș să accepte folosirea acestuia în condițiile prevăzute în prezentul regulament sau respectând orice reguli ori regulamente ale asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "Proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință este obligat să mențină apartamentul sau spațiul respectiv în bună stare și este răspunzător de daunele provocate din cauza neîndeplinirii acestei obligații.",
          },
          {
            type: "paragraph",
            content: "Proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință poate face lucrări de construcții sau renovări ale acestuia fără a afecta structura de rezistență a imobilului, doar dacă aceste lucrări sunt realizate în conformitate cu prevederile stabilite de lege și pe riscul și cheltuiala sa.",
          },
          {
            type: "paragraph",
            content: "Orice instalație suplimentară față de cele cuprinse în cartea tehnică a construcției pe proprietatea comună, în favoarea unuia sau a mai multor proprietari (fire electrice, elemente de calorifer, antene de televiziune, mașini și echipamente, dispozitive de aer condiționat, închiderea balcoanelor, instalații telefonice și altele asemenea), pe pereții exteriori ai clădirii, precum și pe pereții interiori ai spațiilor comune sau străpungerea acoperiṣului se poate realiza numai cu acordul asociației de proprietari (aprobat într-o Adunare Generală a Proprietarilor) și după obținerea aprobărilor legale.",
          },
          {
            type: "paragraph",
            content: "Reprezentanții asociației de proprietari au dreptul să intre într-un apartament sau într-un spațiu cu altă destinație decât cea de locuință, în baza unui preaviz de 5 zile, semnat pentru luare la cunoștință de către proprietar și înmânat acestuia, pentru a efectua lucrări de întreținere, reparare, renovare sau de înlocuire a părților proprietății comune din apartament sau din spațiul cu altă destinație decât cea de locuință, la care accesul se poate face numai prin acestea.",
          },
          {
            type: "paragraph",
            content: "Dacă necesitatea de a intra în apartament sau în spațiul cu altă destinație decât cea de locuință este urgentă (cazuri de calamitate: incendiu, inundație, emanații de gaz, scurgeri de substanțe chimice nocive și altele asemenea), nu este nevoie de preaviz, iar reprezentanții asociației de proprietari pot intra, indiferent dacă proprietarul este sau nu este prezent, cu respectarea prevederilor legale referitoare la cazurile de necesitate.",
          },
          {
            type: "paragraph",
            content: "În cazul în care proprietarii care nu fac parte din asociația de proprietari se opun acestor prevederi, se vor utiliza căile legale de atac al unor asemenea poziții, asociația de proprietari rezervându-și dreptul de a calcula și de a pretinde daune morale și materiale provocate de acest refuz.",
          },
          {
            type: "paragraph",
            content: "Orice tip de publicitate în/pe proprietatea comună se poate face numai cu acordul adunării generale a asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "Proprietarii care dețin animale în apartament sau în spațiul cu altă destinație decât cea de locuință nu pot lăsa în libertate ori fără supraveghere animalele care pot prezenta pericol pentru persoane sau bunuri. Acești proprietari răspund pentru deteriorarea sau murdărirea proprietății comune de către animale și trebuie să ia măsuri pentru a nu afecta liniștea și confortul proprietarilor/locuitorilor din imobil.",
          },
          {
            type: "paragraph",
            content: "În interiorul complexului Metropolis autovehiculele trebuie parcate exclusiv pe locurile de parcare special amenajate, fiind interzisă staționarea autovehiculelor în afara acestor spații. Parcările special marcate «Pentru Vizitatori» sunt destinate exclusiv folosinței vizitatorilor.",
          },
          {
            type: "heading",
            title: "ESTE STRICT INTERZISĂ:",
          },
          {
            type: "list",
            items: [
              "Depozitarea deșeurilor menajere în alte locuri decât în cele special amenajate",
              "Producerea de zgomote de natură a afecta ceilalți proprietari",
              "Introducerea și/sau depozitarea în condominiu a substanțelor chimice, explozibililor, substanțelor poluante, deșeurilor, precum și a altor materiale periculoase care ar putea afecta nociv proprietarii sau ansamblul rezidențial",
              "Efectuarea de lucrări în cadrul proprietății exclusive, de natură a afecta siguranța și estetica ansamblului rezidențial sau a unei părți a acestuia",
              "Conducerea autoturismelor pe drumurile de acces din cadrul ansamblului cu o viteză mai mare de 10 km/h",
              "Blocarea căilor de acces sau a intrărilor în locurile de parcare sau în clădiri",
              "Extinderea proprietății exclusive pe Spațiile Comune",
              "Blocarea spațiilor comune prin depozitarea de diverse obiecte sau în orice alt mod",
              "Poluarea de orice natură",
              "Fumatul în interiorul clădirii, în lift și în toate spațiile comune ale imobilului, inclusiv în garaj",
              "Instalarea de antene de satelit pe pereți sau pe fațadele externe ale clădirii de către Proprietari sau chiriași, inclusiv pe balcoane sau terase de apartamente, în cazul în care un astfel de echipament este vizibil din exterior, fără aprobarea comitetului executiv și respectarea legislației în vigoare, a normelor de siguranță și a recomandărilor producătorului acelui echipament",
              "Este interzisă aruncarea în scurgeri, cămine și/sau în instalații, în conductele clădirii sau în părțile comune ale acesteia, a oricărui material sau substanță solidă sau lichidă care le poate bloca sau provoca daune. Cheltuielile pentru a restabili buna funcționare a scurgerilor, precum și cele pentru repararea eventualelor pagube cauzate părților comune ale clădirii sau celorlalți proprietari sau locuitori, vor fi suportate de către cel care le-a cauzat",
              "Aruncarea apei sau a oricăror alte obiecte de la ferestrele, terasele și balcoanele clădirii",
              "Întinderea rufelor, prosoapelor etc. pe parapetele balcoanelor",
              "Călcarea grădinilor și a spațiilor verzi ale complexului imobiliar și aruncarea hârtiilor sau gunoaielor în zonele comune",
              "Ținerea în unitățile de locuit a animalelor considerate periculoase din cauza agresivității lor, sau din motive igienico-sanitare, sau din motive legate de păstrarea liniștii în clădire în orele considerate sensibile",
              "Fiecare persoană aflată în Complexul Metropolis (inclusiv proprietar/locatar/chiriaș/musafir) trebuie să respecte liniștea maximă în orele sensibile. Prin ore sensibile se înțeleg: i) intervalul 00:00-08:00, în orice zi a anului; ii) intervalul 14:00-16:00, în orice zi a anului; iii) intervalul 22:00-24:00, de Duminică până Joi. Această restricție este luată cu scopul garantării odihnei celorlalți locuitori din complex. Volumul aparatelor radio/TV trebuie redus, pentru a nu deranja vecinii. În situațiile în care se efectuează lucrări de reparații în interiorul unităților de locuit, este interzisă execuția acestora în timpul orelor sensibile specificate mai sus. Singura excepție de la restricțiile de mai sus este sărbătoarea de Revelion, caz în care restricțiile nu se aplică pentru intervalul 22:00-24:00 în 31 Decembrie și pentru intervalul 00:00-02:00 în 1 Ianuarie.",
              "Să se lase să circule orice tip de animale, singure sau însoțite, în zonele verzi comune ale complexului imobiliar, chiar dacă acestea nu sunt considerate periculoase sau sunt de dimensiuni mici",
              "Poziționarea plantelor sau vaselor de flori pe pervazul ferestrelor și pe parapetele balcoanelor dacă acestea nu sunt prevăzute cu dispozitive sau suporturi de sprijin speciale din fier sau oțel astfel încât să fie asigurată siguranța acestora în orice condiții de mediu. Proprietarii poartă întreaga răspundere pentru orice fel de incident rezultat din nerespectarea acestei reguli.",
              "Eventuala modificare, închidere, chiar parțială, a balcoanelor clădirilor sau a perdelelor de soare sau a unor elemente de protecție solară de alt tip se va realiza în baza unui proiect unitar aprobat de Adunarea Generală a Asociaților, care să nu strice imaginea fațadelor, a clădirii și a întregului complex imobiliar",
              "Utilizarea imobilelor pentru altă destinație decât cea originală, fără obținerea autorizației legale și a acordului Asociației de Proprietari",
              "Efectuarea de modificări la instalațiile de uz general, atât în interiorul, cât și în afara unităților imobiliare, fără acordul Adunării Generale a Asociației de Proprietari",
              "Introducerea și păstrarea în unitățile imobiliare a unor piese de mobilier sau a altor obiecte cu o greutate specifică mai mare decât capacitatea structurală prevăzută pentru planșee",
              "Sunt interzise lucrările de modificare a clădirii sau ale zonelor comune ale acesteia fără aprobarea prealabilă a Adunării Generale a Asociației de Proprietari, fie că modifică sau nu aspectul arhitectonic al acesteia",
              "Proprietarii/locuitorii sunt răspunzători de respectarea normelor de utilizare și funcționare a liftului, atât personal cât și pentru rudele, vizitatorii sau furnizorii lor care nu le respectă. Pentru utilizarea liftului trebuie respectate dispozițiile cuprinse în Regulamentul afișat în cabină, și anume cele cu privire la utilizarea liftului de către copii, sau cele referitoare la introducerea în cabină a animalelor, bagajelor și mărfurilor grele în general. Orice daune rezultate din nerespectarea acestor prevederi vor fi suportate de către proprietar sau de persoana care le-a provocat. Dacă nu s-a identificat persoana care a cauzat daune părților comune ale imobilelor, cheltuielile pentru refacerea acestora vor fi distribuite proporțional între toți proprietarii clădirii",
              "Proprietarii/locuitorii sunt răspunzători pentru nerespectarea obligațiilor referitoare la utilizarea parcării (garaj). Pentru aceasta, fiecare proprietar are următoarele obligații: să închidă ușile de acces de fiecare dată când le utilizează; să nu spele mașinile în locurile de acces sau în parcare; să nu efectueze nici o activitate de întreținere a propriei mașini în parcare care ar putea afecta curățenia și calitatea aerului din parcare (schimbarea uleiului etc.); să nu staționeze cu mașina în părțile comune sau de tranzit ale clădirii sau ale complexului imobiliar; să nu parcheze astfel încât să blocheze mașinile altora, intrările în parcare sau depozitele magazinelor sau spațiile din parcare cu destinație tehnică; să nu staționeze cu mașinile care funcționează cu gaz în zonele acoperite ale condominiului",
              "Deținătorii de animale de companie au obligația de a lua măsurile necesare pentru a preveni murdărirea sau deteriorarea spațiilor de folosință comună (holuri, scări, lift, spații verzi, alei). Dacă acest lucru s-a produs, proprietarii animalelor au obligația de a efectua curățenia, dezinfecția și refacerea spațiilor deteriorate. Neîndeplinirea acestor obligații va putea deriva în penalizări (bănești) care vor fi stabilite de către Comitetul Executiv. În cazul în care proprietarul nu achită penalizarea respectivă de trei ori într-un an, proprietarului respectiv i se va putea interzice deținerea de animale. De asemenea, câinii periculoși vor purta botniță și vor fi ținuți în lesă când vor fi scoși la plimbare. Se va folosi doar ușa din spate pentru accesul în/din clădire cu animalele de companie. Cetățenii care locuiesc în apartamente pot crește și întreține animale de companie deținând carnete de sănătate pentru fiecare animal în parte, carnet pe care trebuie să-l prezinte la solicitarea reprezentanților asociației de proprietari, a organelor sanitar veterinare și a altor organisme abilitate.",
              "Parcarea în perimetrul «alei spații de circulație» ESTE INTERZISĂ în consecință orice proprietar are dreptul să solicite organelor competente ridicarea autovehiculelor parcate necorespunzător",
              "Lucrările curente de întreținere, cu excepția celor care reclamă urgență, vor fi efectuate în zilele lucrătoare, între orele 9:00-18:00",
            ],
          },
          {
            type: "heading",
            title: "OBLIGAȚIILE PROPRIETARILOR",
          },
          {
            type: "paragraph",
            content: "Fiecare proprietar este obligat să își mențină proprietatea imobiliară (proprietatea individuală și cota-parte de proprietate comună indiviză aferentă acesteia) în bună stare și este răspunzător de daunele provocate din cauza neîndeplinirii acestei obligații.",
          },
          {
            type: "paragraph",
            content: "Proprietarii de apartamente și spații cu altă destinație decât cea de locuință sunt obligați să plătească cotele de întreținere obișnuite sau speciale către asociația de proprietari, pentru a se putea acoperi toate cheltuielile comune ale clădirii.",
          },
          {
            type: "paragraph",
            content: "Proprietarii din condominiu, indiferent dacă fac parte sau nu din asociația de proprietari, sunt obligați:",
          },
          {
            type: "list",
            items: [
              "a) Să anunțe, în scris, numele persoanelor care locuiesc temporar, venite în vizită, sau care prestează activități gospodărești în timpul zilei, de minimum 15 zile pe lună, conform prevederilor art. 18 alin. (5) lit. c) din Normele metodologice privind organizarea și funcționarea asociațiilor de proprietari;",
              "b) Să semnaleze în timp util orice problemă care apare la instalațiile de folosință comună;",
              "c) Să respecte prezentul regulament al asociației de proprietari cu privire la normele de conviețuire socială în cadrul condominiului, să anunțe comitetul executiv al asociației de proprietari despre intenția de a schimba destinația proprietății individuale, cerând acordul în scris, și să prezinte, în copie, toate documentele necesare desfășurării activităților propuse (contracte, avize și altele asemenea), în termen de 30 de zile lucrătoare de la obținerea acordului;",
              "d) Să nu schimbe aspectul proprietății comune fără acceptul scris al comitetului executiv al asociației de proprietari;",
              "e) Să accepte accesul în spațiul său cu un preaviz de 5 zile, al unui reprezentant al asociației de proprietari, atunci când este necesar să se repare sau să se înlocuiască elemente din proprietatea comună, la care se poate avea acces numai prin spațiul respectiv.",
              "f) Reprezentantul asociației de proprietari va fi însoțit de persoana care va repara defecțiunea și de cel puțin un martor din cadrul asociației de proprietari. Fac excepție cazurile de maximă urgență, când nu este necesar nici un preaviz;",
              "g) În condiții de neparticipare la luarea deciziilor și la desfășurarea activităților în cadrul asociației de proprietari, să nu aducă prejudicii morale celorlalți proprietari asociați sau celor care desfășoară activități pentru asociație;",
              "h) Să încheie cu asociația de proprietari contracte de închiriere, pe care le negociază cu comitetul executiv, pentru elemente sau suprafețe din proprietatea comună folosită în interes personal.",
              "i) Să respecte statutul asociației de proprietari;",
              "j) Să respecte orice angajament făcut față de asociația de proprietari;",
              "k) Să nu aducă prejudicii materiale asociației de proprietari;",
              "l) Să participe, atunci când este solicitat, la acțiuni deosebite, de maximă urgență, corespunzătoare scopurilor asociației de proprietari;",
              "m) Să se conformeze obligațiilor proprietarilor din condominiu.",
              "n) Proprietarii sunt obligați să lase administratorului o copie după cartea sa de identitate, un număr de telefon și o adresă de e-mail sau să comunice orice modificare a datelor sale de contact, după caz, pentru a putea fi contactat de administrator în orice moment, dacă situația va impune acest lucru;",
              "o) Să anunțe administratorului vânzarea propriului imobil/spațiu, așa cum este definit de prezentul Regulament, comunicând, de asemenea, datele noului proprietar;",
              "p) Să anunțe administratorului, în cazul contractului de comodat pentru apartamentul/spațiul ce face parte din condominiu, furnizând datele de identitate ale chiriașului/comodatarului.",
              "q) În cazul în care imobilul său va rămâne nelocuit pentru o anumită perioadă, să închidă din interior sursele de alimentare cu apă și curent și să stingă centrala termică, comunicând, de asemenea, administratorului, adresa și datele persoanei de contact care se află în posesia cheilor, cu scopul de a permite o eventuală intervenție în caz de necesitate pentru condominiu.",
              "r) Dacă proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință sau orice altă persoană care acționează în numele său provoacă daune oricărei părți din proprietatea comună sau altei proprietăți individuale, trebuie să realizeze reparațiile necesare ori să plătească cheltuielile pentru lucrările de reparații.",
              "s) În cazul spațiilor cu altă destinație decât cea de locuință, respectiv al apartamentelor, cu mai mult de un proprietar, relațiile de coproprietate dintre proprietari vor fi reglementate în conformitate cu prevederile Codului civil.",
              "t) Zidurile dintre apartamentele alăturate, care nu fac parte din structura de rezistență a condominiului, pot fi reamplasate, prin acord între proprietarii apartamentelor sau spațiilor respective și cu înștiințarea și acordul asociației de proprietari, în condițiile legii.",
              "u) Zidurile dintre apartamente și proprietatea comună, care nu fac parte din structura de rezistență a condominiului, pot fi reamplasate numai prin amendarea acordului de asociere.",
              "v) Dacă unul dintre proprietari împiedică, cu bună știință și sub orice formă, folosirea normală a condominiului, creând prejudicii celorlalți proprietari, după caz, măsurile pentru folosirea normală a condominiului se vor hotărî pe cale judecătorească, la solicitarea asociației de proprietari.",
              "w) Fiecare proprietar, chiriaș sau ocupant al unui apartament ori spațiu cu altă destinație decât cea de locuință are obligația să se conformeze prezentului regulament, precum și regulilor, hotărârilor și rezoluțiilor adoptate legal de asociația de proprietari.",
              "x) Puncte de lucru: Condiții aprobare puncte de lucru: vor putea desfășura activități doar persoanele fizice și juridice care respectă următoarele condiții: a) Se va putea desfășura orice tip de activitate economică, atâta timp cât desfășurarea respectivei activități nu afectează liniștea vecinilor și nu va fi compromisă imaginea ansamblului; b) Trebuie să se respecte orele de liniște, limitând orarul de relații cu publicul între 8:00-21:00 de luni până vineri; c) Trebuie să aibă aprobarea comitetului executiv și a vecinilor direct afectați (sus; jos; stânga; dreapta); d) Trebuie să achite asociației cota extraordinară corespunzătoare întreținerii lunare, conform celor stabilite de Comitetul executiv sau de Adunarea Generală; e) Comitetul poate refuza acordarea aprobării dacă prin specificul activității sunt afectate interesele celorlalți proprietari; în acest caz acordul se va putea acorda doar cu aprobarea Adunării Generale.",
            ],
          },
          {
            type: "heading",
            title: "ASIGURAREA CLĂDIRII ȘI A PĂRȚILOR COMUNE ALE ACESTEIA",
          },
          {
            type: "paragraph",
            content: "Fiecare proprietar este obligat conform legii nr. 260/2008 privind asigurarea obligatorie a locuințelor, să semneze individual o poliță de asigurare cu o societate primară de asigurări, cu scopul de a asigura proprietatea și dependințele acesteia pentru:",
          },
          {
            type: "list",
            items: [
              "riscuri privitoare la calamități naturale (de ex. trăsnete, aluviuni, etc.)",
              "daune provocate de nefuncționarea instalațiilor comune (chiar dacă sunt acoperite de garanție sau contracte de asistență)",
              "daune provocate de acte vandalice clădirii sau dependințelor acesteia de terți neidentificați",
            ],
          },
        ],
      },
    ],
  },
];
