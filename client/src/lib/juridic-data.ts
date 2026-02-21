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
  {
    id: "statut-asociatie",
    title: "Statutul Asociației de Proprietari",
    description: "Model de statut pentru asociația de proprietari, conform legislației în vigoare",
    documents: [
      {
        id: "statut-model",
        title: "Statutul asociației de proprietari (model)",
        description: "Model complet de statut pentru asociația de proprietari, cu toate capitolele și articolele necesare",
        sections: [
          {
            type: "heading",
            title: "STATUTUL asociației de proprietari (model)",
          },
          {
            type: "heading",
            title: "CAPITOLUL I - Denumirea, forma juridică, obiectul de activitate, sediul, durata și membrii asociației de proprietari",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 1 - Denumirea asociației de proprietari",
            content: "Denumirea asociației de proprietari este ... \"",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 2 - Forma juridică a asociației de proprietari",
          },
          {
            type: "numbered-list",
            items: [
              "(1) Asociația de proprietari ... (denumirea) este persoana juridică română de drept privat, nonprofit (fără scopuri patrimoniale), constituită în baza prevederilor Legii locuinței nr. 114/1996, republicată, cu modificările și completările ulterioare, și ale O.G. 85/2001 privind organizarea și funcționarea asociațiilor de proprietari, aprobată cu modificări prin Legea 234/2002.",
              "(2) Asociația de proprietari își desfășoară activitatea în conformitate cu legile române și cu prezentul statut. Asociația de proprietari are ștampilă proprie.",
            ],
          },
          {
            type: "subheading",
            title: "ARTICOLUL 3 - Obiectul de activitate",
          },
          {
            type: "paragraph",
            content: "(1) Asociația de proprietari are ca obiect de activitate asigurarea condițiilor de funcționare normală atât a locuințelor (apartamentelor) și spațiilor cu altă destinație decât cea de locuință, denumite în continuare spații, aflate în proprietate exclusivă, cât și a spațiilor construcțiilor și instalațiilor, aflate în proprietate comună indivizibilă, aferentă condominiului.",
          },
          {
            type: "paragraph",
            content: "(2) În scopul realizării obiectului său de activitate asociația de proprietari are următoarele atribuții principale:",
          },
          {
            type: "list",
            items: [
              "a) încheie contracte cu furnizorii de produse și de servicii și își asumă obligații în nume propriu și în numele proprietarilor;",
              "b) angajează și, după caz, suspendă din funcție administratorul proprietății comune indivize și personalul necesar bunei gospodăriri a acestei proprietăți;",
              "c) reglementează folosirea, întreținerea, repararea, înlocuirea și modificarea proprietății comune;",
              "d) adoptă și amendează bugetul de venituri și cheltuieli, precum și fondul de rulment; asigură calcularea și încasarea cotelor obișnuite și speciale pentru cheltuieli comune de la proprietari; impune penalizări pentru întârzierea la plata cotelor de întreținere;",
              "e) adoptă sau amendează decizii, reguli sau regulamente;",
              "f) inițiază și apără în procese, în nume propriu și/sau al asociaților, interesele comune legate de clădire;",
              "g) exercită și alte atribuții care i-au fost conferite prin acordul de asociere sau prin votul asociaților.",
            ],
          },
          {
            type: "paragraph",
            content: "(3) Pentru furnizarea unor servicii necesare realizării obiectului sau de activitate asociația de proprietari poate angaja persoane fizice sau juridice specializate, din cadrul asociației și/sau din afara acesteia. Personalul necesar bunei gospodăriri a proprietății comune din clădire poate fi angajat prin contract individual de muncă sau prin convenție civilă de prestări de servicii, conform celor ce se stabilesc prin negociere.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 4 - Sediul asociației",
            content: "Sediul asociației de proprietari este în România, localitatea ..., str. ... nr. ..., județul/sectorul ... (se va specifica și locul/adresa de primire a corespondenței).",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 5 - Durata asociației de proprietari",
            content: "Durata asociației de proprietari este nelimitată.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 6 - Membrii asociației de proprietari",
            content: "Membrii asociației de proprietari sunt toți proprietarii, persoane fizice sau juridice, deținători ai uneia sau mai multor locuințe ori spații cu altă destinație decât cea de locuință din condominiu (pentru cazurile în care asociația se constituie pe mai multe clădiri, în condițiile de excepție prevăzute de lege), care au semnat acordul de asociere, prezentați în anexă.",
          },
          {
            type: "heading",
            title: "CAPITOLUL II - Patrimoniul asociației de proprietari",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 7",
          },
          {
            type: "paragraph",
            content: "(1) Patrimoniul asociației de proprietari este format din:",
          },
          {
            type: "list",
            items: [
              "a) mijloace bănești, în valoare de ... lei, care pot fi majorate sau reduse în urma deciziei adunării generale a asociației de proprietari, cu respectarea prevederilor legale. Majorarea acestor fonduri se poate face numai prin vărsarea de lichidități;",
              "b) mijloace materiale: scule, dispozitive, utilaje și mijloace fixe necesare în administrarea proprietății comune.",
            ],
          },
          {
            type: "paragraph",
            content: "(2) Mijloacele bănești ale asociației de proprietari sunt alcătuite din fondurile constituite la înființarea asociației, din sumele prevăzute și încasate conform listelor lunare de plată a cotelor de contribuție a proprietarilor la cheltuielile asociației, care reprezintă contravaloarea facturilor sau actelor de plată, precum și din alte venituri ale asociației. Asociația de proprietari are unul sau mai multe conturi la unitatea bancară sau la filiala C.E.C. stabilită de comitetul executiv al acesteia.",
          },
          {
            type: "paragraph",
            content: "(3) Fondul de rulment se constituie pe baza hotărârii adunării generale a asociației de proprietari. Necesitatea constituirii acestuia este determinată de modul de întocmire a listei lunare de plată, termenul de plată a cotelor de contribuție și sistemul de penalizări al asociației de proprietari și al furnizorilor de servicii.",
          },
          {
            type: "paragraph",
            content: "(4) Fondul de rulment se calculează pentru fiecare proprietar în funcție de numărul de persoane înregistrate în cartea de imobil și de cota-parte de proprietate indiviză din proprietatea comună, după natura serviciului facturat (modul de repartizare a consumurilor aferente facturilor).",
          },
          {
            type: "paragraph",
            content: "(5) Valoarea fondului de rulment trebuie să fie egală cu suma corespunzătoare acoperirii cheltuielilor lunare, la nivelul lunii cu cheltuielile cele mai mari, dintr-un an calendaristic.",
          },
          {
            type: "paragraph",
            content: "(6) Dacă este cazul, în condiții de instabilitate economică, fondul de rulment se actualizează periodic prin depunerea de către fiecare proprietar a unei sume reprezentând diferența dintre valoarea existentă și cea necesară acoperirii cheltuielilor lunare ale asociației de proprietari, corespunzătoare fiecărui proprietar.",
          },
          {
            type: "paragraph",
            content: "(7) Fiecare proprietar va beneficia de propriul fond de rulment pentru acoperirea cheltuielilor curente.",
          },
          {
            type: "paragraph",
            content: "(8) Fondul de rulment constituit se utilizează numai pentru plata facturilor curente, aferente consumurilor lunii anterioare. După plata facturilor curente fondul de rulment se reîntregește lunar prin încasarea cotelor de contribuție afișate pe lista de plată a lunii în curs, având ca referință de calcul aceste facturi curente, corespunzătoare consumurilor lunii anterioare.",
          },
          {
            type: "paragraph",
            content: "(9) În perioadele în care valoarea fondului de rulment este mai mare decât volumul cheltuielilor, diferența devine depozit bancar purtător de dobândă.",
          },
          {
            type: "paragraph",
            content: "(10) Fondul de rulment se încasează distinct față de cota de contribuție lunară.",
          },
          {
            type: "paragraph",
            content: "(11) Fondul de rulment se restituie în întregime respectivului proprietar, în momentul pierderii calității de membru al asociației de proprietari, urmând ca viitorul proprietar, membru al asociației, să achite fondul de rulment, corespunzător cheltuielilor aferente lui.",
          },
          {
            type: "paragraph",
            content: "(12) Fondul de reparații se constituie până la limita maximă aprobată de adunarea generală a asociației de proprietari la stabilirea bugetului de venituri și cheltuieli anual, în funcție de necesitățile stabilite de comitetul executiv, prin contribuția lunară a membrilor, proporțional cu cota-parte din proprietatea comună.",
          },
          {
            type: "paragraph",
            content: "(13) După efectuarea reparațiilor, fondul de reparații se reîntregește lunar prin contribuția fiecărui proprietar, iar sumele rămase necheltuite fie se restituie proprietarilor, fie se constituie într-un depozit bancar, urmând a fi incluse în bugetul anual următor, potrivit hotărârii adunării generale a asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "(14) În momentul pierderii calității de membru al asociației de proprietari, fondul de reparații nu se restituie decât în condițiile alineatului precedent, urmând a fi alimentat în continuare de viitorul proprietar.",
          },
          {
            type: "paragraph",
            content: "(15) Fondurile special constituite și alte fonduri au același regim ca și fondul de reparații.",
          },
          {
            type: "paragraph",
            content: "(16) Mijloacele materiale se compun din: mobilier, unelte, utilaje, materiale pentru curățenie și iluminat, consumabile necesare desfășurării activităților în cadrul asociației de proprietari și altele asemenea.",
          },
          {
            type: "paragraph",
            content: "(17) Mijloacele materiale se dobândesc prin cumpărare sau prin donație. Sumele necesare pentru cumpărarea mijloacelor materiale, altele decât cele care sunt cuprinse în cheltuielile administrative, se obțin prin contribuția proprietarilor, proporțional cu cota-parte din proprietatea comună, și se restituie sau se depozitează, în măsura în care nu au fost cheltuite, conform hotărârii adunării generale a asociației de proprietari.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 8",
          },
          {
            type: "paragraph",
            content: "(1) Patrimoniul asociației de proprietari poate proveni și din donații și sponsorizări.",
          },
          {
            type: "paragraph",
            content: "(2) Apartamentele sau spațiile cu altă destinație decât cea de locuință, cumpărate de asociația de proprietari, vor face parte din patrimoniul asociației.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 9",
          },
          {
            type: "paragraph",
            content: "(1) Gestionarea patrimoniului, precum și activitatea financiar-contabilă se exercită fie de membri ai comisiei de cenzori sau alți membri ai asociației de proprietari, cu cunoștințe de specialitate și experiență în domeniile economic, financiar și juridic, fie de persoane fizice sau juridice, asociații ori agenți economici specializați.",
          },
          {
            type: "paragraph",
            content: "(2) Controlul gestiunii patrimoniului, precum și al activității financiar-contabile se exercită de comitetul executiv al asociației de proprietari.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 10",
            content: "Patrimoniul asociației de proprietari nu poate fi grevat de datorii sau de alte obligații personale ale asociaților.",
          },
          {
            type: "heading",
            title: "CAPITOLUL III - Structura organizatorică",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 11 - Adunarea generală",
          },
          {
            type: "paragraph",
            content: "(1) Asociația de proprietari este condusă de adunarea generală. După prima întrunire organizatorică adunarea generală se întrunește cel puțin o dată în fiecare an calendaristic.",
          },
          {
            type: "paragraph",
            content: "(2) Întrunirea adunării generale va fi anunțată în scris prin afișare la loc vizibil, cu cel puțin 10 zile înainte de data convocării.",
          },
          {
            type: "paragraph",
            content: "(3) Pentru ca hotărârile adunării generale să fie valabile, este necesară prezența majorității membrilor asociați, personal sau prin reprezentant.",
          },
          {
            type: "paragraph",
            content: "(4) În cazul în care cvorumul nu este întrunit, adunarea generală va fi convocată la o dată ulterioară, când proprietarii prezenți pot hotărî, cu majoritate de voturi, asupra problemelor înscrise pe ordinea de zi, indiferent de cvorum.",
          },
          {
            type: "paragraph",
            content: "(5) Hotărârile adunării generale vor fi luate cu majoritate de voturi (cu cel puțin jumătate plus unu din voturile proprietarilor prezenți la adunarea generală).",
          },
          {
            type: "paragraph",
            content: "(6) Hotărârile adunării generale privind modificarea statutului sau dizolvarea asociației de proprietari ori perceperea unei sume speciale destinate achitării cheltuielilor comune neprevăzute în buget, dar necesare, se adoptă cu votul a două treimi din numărul membrilor asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "(7) Votul fiecărui proprietar are o pondere egală cu cota-parte din proprietatea comună. Proprietarul poate fi reprezentat de un membru al familiei sau de un alt reprezentant care are o împuternicire semnată de proprietarul în numele căruia votează. Un membru al asociației de proprietari poate reprezenta cel mult încă un membru absent, prin împuternicire scrisă. În cazul egalității de voturi, votul președintelui este decisiv.",
          },
          {
            type: "paragraph",
            content: "(8) Dacă o decizie a asociației de proprietari este contrară legii sau acordului de asociere ori este de natură să producă daune considerabile intereselor unei minorități a proprietarilor, orice proprietar poate inițiă acțiune în justiție împotriva respectivei decizii, în termen de 60 de zile de la adoptarea acesteia. Acțiunea în justiție nu trebuie să întrerupă aplicarea deciziei decât atunci când instanța hotărăște suspendarea aplicării deciziei respective.",
          },
          {
            type: "paragraph",
            content: "(9) Adunarea generală are următoarele atribuții principale:",
          },
          {
            type: "list",
            items: [
              "a) aprobă darea de seamă anuală asupra activității comitetului executiv al asociației de proprietari, raportul comisiei de cenzori și raportul exercițiului bugetar, acordând anual descărcare de gestiune comitetului executiv și celui care exercită administrarea condominiului, în măsura în care cei în cauză nu se fac vinovați de lipsuri în gestiune sau de alte fapte care implică răspunderi materiale ori penale; adoptă și amendează bugetele de venituri și cheltuieli, precum și fondul de rulment, dacă acesta se constituie; validează rectificări ale bugetului de venituri și cheltuieli;",
              "b) adoptă sau amendează deciziile, regulile și regulamentele asociației de proprietari;",
              "c) hotărăște cu majoritate de voturi din numărul membrilor prezenți asupra necesității constituirii fondului de rulment, fondului de reparații și a altor fonduri speciale, în condițiile legii;",
              "d) hotărăște cu acordul a cel puțin două treimi din numărul membrilor asociați modificările ulterioare ale statutului asociației de proprietari și/sau ale acordului de asociere;",
              "e) hotărăște asupra: naturii și volumului mijloacelor materiale și bănești necesare desfășurării activității asociației de proprietari; modului de folosire a mijloacelor bănești, sumele până la care comitetul executiv poate angaja cheltuieli în numele asociației de proprietari și limita maximă sau cuantumul sumelor ce se pot reține în casă proprie pentru efectuarea plăților curente (plafonul de casă);",
              "f) hotărăște modul de asigurare a administrării condominiului de către o persoană fizică sau juridică;",
              "g) hotărăște volumul serviciilor necesare a fi efectuate pentru buna funcționare a condominiului;",
              "h) hotărăște asupra cuantumului salariilor, indemnizațiilor și premiilor pentru personalul angajat cu contract individual de muncă sau cu convenție civilă de prestări de servicii, membri sau nemembri ai asociației de proprietari, și asupra valorii de contractare, în cazul în care managementul clădirii este asigurat de persoane juridice; hotărăște care dintre funcțiile din structura organizatorică a asociației de proprietari pot fi salarizate;",
              "i) hotărăște asupra acordării unor drepturi bănești membrilor asociației de proprietari, aleși sau nu în structura organizatorică a asociației, care desfășoară activități lucrative folositoare acesteia;",
              "j) hotărăște asupra duratei celor care locuiesc temporar, veniți în vizită, sau care prestează activități gospodărești în timpul zilei, precum și asupra perioadei de la care proprietarii, respectiv chiriaşii, pot solicita, în scris, scutirea de la plata cheltuielilor pe persoană;",
              "k) la constituirea asociației de proprietari, hotărăște numărul membrilor comitetului executiv și ai comisiei de cenzori, precum și durata mandatelor acestora;",
              "l) alege, dintre membrii asociației de proprietari, comitetul executiv al asociației, validându-l dintre aceștia pe președinte;",
              "m) alege, dintre membrii asociației de proprietari, Comisia de cenzori sau hotărăște delegarea atribuțiilor comisiei de cenzori unor persoane fizice sau juridice, asociații ori agenți economici specializați, pe bază de contract;",
              "n) revocă, atunci când este cazul, oricare dintre membrii comitetului executiv sau ai comisiei de cenzori, alegând un succesor pentru ocuparea locului vacant, prin votul majorității simple a celor prezenți;",
              "o) hotărăște termenul și forma de plată a cotelor de contribuție a membrilor asociației de proprietari;",
              "p) validează sistemul de penalizări stabilit de comitetul executiv al asociației de proprietari;",
              "r) hotărăște cu votul tuturor membrilor asociației de proprietari asupra necesității angajării de credite bancare pentru îndeplinirea scopurilor asociației de proprietari și modul de garantare a acestora;",
              "s) hotărăște cu votul tuturor membrilor asociației de proprietari asupra participării cu capital la constituirea de agenți economici sau asupra oportunității cumpărării ori preluării în locație de gestiune a spațiilor comerciale situate la parterul condominiului; de asemenea, decide asupra cumpărării de apartamente sau de spații cu altă destinație decât cea de locuință;",
              "t) hotărăște cu votul tuturor membrilor asociației de proprietari preluarea în administrare, concesiune sau închiriere a terenurilor aferente condominiului;",
              "u) adoptă măsuri sau programe sociale privind ajutorarea familiilor nevoiașe, membre ale asociației de proprietari, pe perioade limitate; adoptă programe de instruire și conștientizare a proprietarilor asupra importanței folosirii raționale a utilităților;",
              "v) hotărăște cu votul a două treimi dintre membrii asociației de proprietari schimbarea instalațiilor comune precum: încălzirea centrală, boilerele cu apă caldă, rezervoarele cu apă, lifturile și alte dotări de amploare similară;",
              "x) adoptă măsuri privind condițiile ce trebuie îndeplinite de deținătorii de animale de casă din cadrul condominiului.",
            ],
          },
          {
            type: "paragraph",
            content: "(10) Discuțiile și hotărârile adunării generale se consemnează într-un registru de procese-verbale, care se păstrează la președintele asociației de proprietari; procesul verbal se va semna de toți membrii participanți.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 12 - Comitetul executiv",
          },
          {
            type: "paragraph",
            content: "(1) Autoritatea de a stabili direcțiile privind funcționalitatea și administrarea condominiului poate fi delegată de către asociația de proprietari către comitetul executiv al acesteia.",
          },
          {
            type: "paragraph",
            content: "(2) Comitetul executiv va acționa în numele proprietarilor în ceea ce privește administrarea și funcționalitatea condominiului, cu excepția atribuțiilor rezervate exclusiv acestora.",
          },
          {
            type: "paragraph",
            content: "(3) Comitetul executiv se va întruni de cel puțin 4 ori pe an. Numărul membrilor ce formează comitetul executiv va fi stabilit de adunarea generală a asociației de proprietari, dar va fi un număr impar și nu mai mic de 3.",
          },
          {
            type: "paragraph",
            content: "(4) Comitetul executiv va fi condus de un președinte care va fi desemnat în persoana celui care întrunește cel mai mare număr de voturi la alegerea comitetului executiv.",
          },
          {
            type: "paragraph",
            content: "(5) Comitetul executiv va alege vicepreședintele și secretarul, care sunt membri ai comitetului executiv.",
          },
          {
            type: "paragraph",
            content: "(6) Președintele asociației de proprietari va fi și președintele comitetului executiv.",
          },
          {
            type: "paragraph",
            content: "(7) Atribuțiile comitetului executiv sunt:",
          },
          {
            type: "list",
            items: [
              "a) aduce la îndeplinire hotărârile adunării generale a asociației de proprietari, execută bugetul de venituri și cheltuieli al asociației de proprietari și întocmește proiectul bugetului pentru anul următor; prezintă dări de seamă asupra activității desfășurate, precum și propuneri de măsuri pentru îmbunătățirea acesteia; convoacă adunarea generală a asociației de proprietari în ședințe extraordinare ori de câte ori este nevoie;",
              "b) răspunde de îngrijirea, păstrarea în bune condiții și supravegherea utilităților condominiului, spațiilor comune și instalațiilor. Angajarea personalului se face cu contract individual de muncă sau cu convenție civilă de prestări de servicii, prin negociere;",
              "c) analizează oferte și negociază contracte, în cazul în care administrarea condominiului, parțial sau total, va fi asigurată de persoane juridice;",
              "d) răspunde de încasarea lunară a cotelor de contribuție de la proprietari; emite somații către restanțierii care depășesc termenul de plată; rezolvă contestațiile proprietarilor cu privire la cuantumul cotelor de contribuție;",
              "e) urmărește, în condițiile legii, recuperarea pagubelor produse asociației de proprietari;",
              "f) negociază contracte cu persoane fizice sau juridice, membre sau nemembre ale asociației de proprietari, pentru închirierea ori întrebuințarea unor elemente sau suprafețe din proprietatea comună;",
              "g) propune adunării generale ca managementul de proprietate și managementul financiar, inclusiv atribuțiile comisiei de cenzori, să fie preluate, pe bază de contract, de către persoane juridice;",
              "h) hotărăște necesitatea efectuării operațiunilor de verificare și control asupra modului de gestionare a bunurilor asociației de proprietari;",
              "i) înștiințează proprietarii despre necesitatea efectuării reparațiilor la părțile și instalațiile comune ale clădirii; avizează începerea, într-o ordine de priorități, a lucrărilor de reparații;",
              "j) dă dispoziții de realizare a unui sistem propriu de protejare a bunurilor asociației de proprietari, de securitate a clădirii, a proprietății;",
              "k) propune adunării generale crearea unor fonduri speciale necesare pentru buna funcționare și dezvoltare a clădirii; urmărește completarea la zi a cărții tehnice a construcției;",
              "l) împuternicește administratorul pentru a putea efectua verificări privind: situația reparațiilor la instalațiile proprietate comună, înlăturarea pierderilor de apă, citirea contoarelor individuale și, dacă este cazul, asigurarea unei igiene corespunzătoare;",
              "m) participă la recepția lucrărilor angajate de asociația de proprietari pentru reparații asupra proprietății comune, precum și a altor lucrări;",
              "n) stabilește modul de calcul și de încasare a fondului de rulment, dacă acesta se constituie, și avizează actualizarea acestuia, dacă este cazul;",
              "o) hotărăște asupra managementului financiar al asociației de proprietari; stabilește și supune validării adunării generale sistemul de penalizări pentru neplata cotelor lunare de contribuție;",
              "p) hotărăște acționarea în justiție a proprietarilor vinovați de neplata cotelor lunare de contribuție la cheltuielile asociației de proprietari, timp de mai mult de 90 de zile de la termenul stabilit;",
              "r) hotărăște acționarea în justiție a celor ce se fac vinovați de încălcarea prevederilor contractuale pe care asociația de proprietari le-a angajat;",
              "s) asigură condițiile necesare securității și igienei în procesul muncii, precum și măsuri de prevenire și stingere a incendiilor;",
              "t) supune aprobării adunării generale a asociației de proprietari hotărârea cu privire la transformarea suprafețelor apartamentelor în spații cu altă destinație decât cea de locuință;",
              "u) hotărăște societatea bancară la care asociația de proprietari își va deschide unul sau mai multe conturi;",
              "v) propune adunării generale a asociației de proprietari măsuri și soluții cu privire la dezvoltarea condominiului și eficientizarea activității asociației de proprietari;",
              "x) răspunde tuturor întrebărilor și solicitărilor venite de la proprietari; încurajează și sprijină inițiative personale ale membrilor asociației de proprietari.",
            ],
          },
          {
            type: "paragraph",
            content: "(8) Asociația de proprietari, prin comitetul executiv, poate suspenda din funcție sau poate rezilia contractul individual de muncă ori convenția civilă de prestări de servicii, încheiată cu oricine din rândul personalului angajat ori, după caz, poate rezilia contractele încheiate cu alte persoane fizice sau juridice, în condițiile legii.",
          },
          {
            type: "paragraph",
            content: "(9) Comitetul executiv lucrează valabil în prezența a jumătate plus unu din numărul membrilor săi și adoptă hotărâri cu cel puțin două treimi din numărul membrilor prezenți.",
          },
          {
            type: "paragraph",
            content: "(10) Discuțiile și hotărârile se consemnează în registrul de procese-verbale, care se păstrează la președinte, procesele-verbale semnându-se de toți membrii comitetului executiv prezenți.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 13 - Comisia de cenzori",
          },
          {
            type: "paragraph",
            content: "(1) Adunarea generală a asociației de proprietari alege dintre membrii asociației de proprietari o comisie de cenzori care va verifica situația financiară și contabilă și va concilia asociația în ceea ce privește problemele financiare și statutare.",
          },
          {
            type: "paragraph",
            content: "(2) Numărul membrilor comisiei de cenzori, care va fi impar, dar nu mai mic de 3, și durata mandatului acestora se stabilesc la adunarea generală de constituire a asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "(3) Membrii comisiei de cenzori nu pot face parte din comitetul executiv și trebuie să aibă cunoștințe în domeniile financiar, economic și/sau juridic. Comisia de cenzori va alege dintre membrii săi un președinte.",
          },
          {
            type: "paragraph",
            content: "(4) Mandatul membrilor comisiei de cenzori încetează înainte de expirarea duratei sale, prin revocare sau în cazul imposibilității de a-și continua atribuțiile.",
          },
          {
            type: "paragraph",
            content: "(5) Comisia de cenzori are următoarele atribuții:",
          },
          {
            type: "list",
            items: [
              "a) verifică îndeplinirea condițiilor statutare privind prezența și votul în adunările generale ale asociației de proprietari;",
              "b) verifică execuția bugetară, propunerile pentru proiectul bugetului de venituri și cheltuieli pentru anul următor și propunerile pentru rectificarea bugetului pentru anul în curs;",
              "c) efectuează controlul preventiv pentru plățile cu numerar și urmărește depunerile în contul curent al asociației de proprietari ale numerarului ce depășește plafonul de casă;",
              "d) verifică, cel puțin o dată pe semestru, gestiunea asociației de proprietari, stabilirea și încasarea cotelor de contribuție la cheltuielile asociației;",
              "e) verifică dacă registrele asociației de proprietari îndeplinesc condițiile legale necesare desfășurării corespunzătoare a managementului financiar;",
              "f) întocmește, pe baza verificărilor efectuate, și prezintă adunării generale a asociației de proprietari rapoarte asupra activității sale și asupra gestiunii asociației de proprietari, propunând anual descărcarea de gestiune;",
              "g) propune spre aprobare adunării generale a asociației de proprietari programe cu măsuri necesare desfășurării managementului financiar; propune recuperarea, în condițiile legii, a pagubelor produse de personalul ce deservește asociația de proprietari;",
              "h) în cazul în care managementul financiar se hotărăște a fi asigurat de persoane juridice, Comisia de cenzori, prin președinte sau membri delegați, participă la negocierea contractelor respective.",
            ],
          },
          {
            type: "paragraph",
            content: "(6) Adunarea generală a asociației de proprietari poate hotărî transferarea atribuțiilor comisiei de cenzori unor persoane fizice sau juridice, asociații sau agenți economici specializați, pe bază de contract.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 14 - Președintele",
          },
          {
            type: "paragraph",
            content: "(1) Conducătorul executiv al asociației de proprietari este președintele. Președintele este înlocuit de vicepreședinte, care îi va îndeplini atribuțiile, în cazul absenței acestuia sau când se află în imposibilitatea de a-și îndeplini atribuțiile.",
          },
          {
            type: "paragraph",
            content: "(2) Președintele asociației de proprietari are următoarele atribuții:",
          },
          {
            type: "list",
            items: [
              "a) verifică respectarea și îndeplinirea hotărârilor adoptate de adunarea generală a asociației de proprietari și de comitetul executiv, controlează persoanele care deservesc asociația de proprietari;",
              "b) reprezintă asociația de proprietari în încheierea și derularea contractelor și își asumă obligații în numele asociației; reprezintă asociația de proprietari împotriva unor terți, inclusiv în acțiunile judecătorești;",
              "c) avizează ordinea de priorități și planul lucrărilor de întreținere și reparații ale părților și instalațiilor comune ale condominiului;",
              "d) are drept de semnătură asupra conturilor asociației de proprietari;",
              "e) primește cererile și reclamațiile de la proprietari și sesizările administratorului, pe care le supune dezbaterii comitetului executiv;",
              "f) convoacă comitetul executiv trimestrial sau ori de câte ori este nevoie;",
              "g) întocmește ordinea de zi a ședinței comitetului executiv și conduce lucrările acesteia;",
              "h) eliberează adeverințele necesare proprietarilor care își înstrăinează apartamentele sau spațiile cu altă destinație decât cea de locuință;",
              "i) semnează deciziile de imputare, precum și orice alte acte emise de comitetul executiv; semnează contractele individuale de muncă sau convențiile civile de prestări de servicii;",
              "j) păstrează și folosește ștampila asociației de proprietari.",
            ],
          },
          {
            type: "paragraph",
            content: "(3) La asociațiile de proprietari care cuprind până la 10 proprietari președintele poate îndeplini și funcția de administrator.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 15 - Secretarul comitetului executiv",
          },
          {
            type: "paragraph",
            content: "(1) Secretarul comitetului executiv va păstra și va întocmi procesele-verbale ale ședințelor comitetului executiv și procesele-verbale ale tuturor adunărilor generale ale asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "(2) Secretarul comitetului executiv poate păstra registrele și celelalte acte ale asociației de proprietari, potrivit hotărârii comitetului executiv.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 16 - Contabilul asociației de proprietari",
            content: "Contabilul asociației de proprietari răspunde de organizarea și conducerea contabilității potrivit legii. La asociațiile de proprietari care optează pentru conducerea contabilității în partidă simplă administratorul poate cumula și funcția de contabil.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 17 - Casierul asociației de proprietari",
            content: "Casierul asociației de proprietari răspunde de efectuarea de încasări și plăți în numerar, cu respectarea prevederilor Regulamentului operațiunilor de casă. La asociațiile de proprietari care optează pentru conducerea contabilității în partidă simplă administratorul poate cumula și funcția de casier.",
          },
          {
            type: "heading",
            title: "CAPITOLUL IV - Managementul asociației de proprietari",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 18",
          },
          {
            type: "paragraph",
            content: "(1) Prin managementul asociației de proprietari, managementul condominiului sau administrarea condominiului se înțelege managementul de proprietate (administrarea propriu-zisă a condominiului, a instalațiilor și a tuturor elementelor proprietății comune, funcționarea centralelor termice sau a punctelor termice aflate în proprietatea sau în administrarea asociației de proprietari) și managementul financiar (contabilitate și casierie).",
          },
          {
            type: "paragraph",
            content: "(2) Activitatea de management al condominiului se asigură fie de persoane fizice angajate cu contracte individuale de muncă sau convenții civile de prestări de servicii, fie de persoane juridice, prin contracte de administrare, potrivit hotărârii adunării generale a asociației de proprietari.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 19 - Administratorul",
          },
          {
            type: "paragraph",
            content: "(1) Administratorul, persoana fizică, poate fi desemnat dintre membrii asociației de proprietari sau dintre alte persoane cu cunoștințe profesionale ori cu experiență necesară în domeniu.",
          },
          {
            type: "paragraph",
            content: "(2) Administratorul, persoana fizică, poate fi angajat și pe funcția de contabil, dacă îndeplinește condițiile prevăzute în statut și în normele metodologice.",
          },
          {
            type: "paragraph",
            content: "(3) Asociația de proprietari angajează administratorul și contabilul, persoane fizice, pe baza de contract individual de muncă sau de convenție civilă de prestări de servicii, care prevede drepturile și obligațiile fiecăreia dintre părți, stabilite prin negociere.",
          },
          {
            type: "paragraph",
            content: "(4) Pentru reparații și pentru alte activități de întreținere administratorul, ținând cont de cost, timp de execuție și calitate, propune comitetului executiv, spre analiză și aprobare, agenți economici care satisfac cerințele în vederea executării lucrărilor, conform legilor existente.",
          },
          {
            type: "paragraph",
            content: "(5) Pentru asigurarea funcționării centralelor termice aparținând asociațiilor de proprietari sau aflate în administrarea acestora pot fi angajați fochiști și alte persoane, prin contract individual de muncă sau prin convenție civilă de prestări de servicii, sau poate fi delegat un agent economic specializat, persoana juridică.",
          },
          {
            type: "paragraph",
            content: "(6) Încadrarea personalului cu contract individual de muncă se face cu respectarea dispozițiilor legale în vigoare.",
          },
          {
            type: "paragraph",
            content: "(7) Durata și valoarea contractului individual de muncă și a convenției civile de prestări de servicii, sarcinile, drepturile și obligațiile se stabilesc prin negocieri între părți, cu respectarea prevederilor legale.",
          },
          {
            type: "paragraph",
            content: "(8) Administratorul, persoana fizică sau juridică, are următoarele atribuții principale:",
          },
          {
            type: "paragraph",
            content: "A. asigură managementul financiar al asociației de proprietari prin:",
          },
          {
            type: "list",
            items: [
              "a) gestiunea bunurilor și fondurilor bănești;",
              "b) întocmirea listelor lunare de plată;",
              "c) încasarea, în locuri specifice, a cotelor de contribuție a proprietarilor la cheltuielile curente ale asociației de proprietari;",
              "d) efectuarea plăților și încasărilor;",
              "e) sesizarea comitetului executiv în vederea somării restanțierilor și aplicarea procedurii de recuperare a restanțelor, cu penalizările aferente;",
              "f) calcularea și încasarea penalizărilor conform sistemului aprobat de adunarea generală a asociației de proprietari;",
              "g) actualizarea, dacă este cazul, cu avizul comitetului executiv, a fondului de rulment;",
              "h) întocmirea și păstrarea evidențelor contabile și a registrelor asociației de proprietari, specifice managementului financiar;",
              "i) prezentarea, la solicitarea comitetului executiv sau a comisiei de cenzori, a rapoartelor ori a documentelor necesare unor verificări financiar-contabile ale asociației de proprietari;",
              "j) verificarea sau avizarea, dacă este cazul, a indexului contoarelor de rețea aferente mai multor asociații de proprietari;",
              "k) controlul facturării corecte a consumurilor în funcție de indexul contoarelor de bloc sau al contoarelor individuale;",
              "l) verificarea existenței contractelor între persoanele juridice, membre ale asociației de proprietari și furnizorii de servicii;",
              "m) respectarea altor prevederi privind modul de exercitare a managementului financiar;",
            ],
          },
          {
            type: "paragraph",
            content: "B. asigură managementul de proprietate al asociației de proprietari prin:",
          },
          {
            type: "list",
            items: [
              "a) urmărirea comportării în timp a construcției, pe toata durata contractului; întocmirea fișelor tehnice periodice cu privire la starea clădirii și a instalațiilor acesteia;",
              "b) răspunderea față de funcționalitatea și integritatea elementelor proprietății comune, față de mijloacele materiale ale asociației de proprietari și de utilizarea în bune condiții a acestora;",
              "c) procurarea mijloacelor materiale necesare pentru întreținerea și reparațiile curente ale elementelor proprietății comune; răspunderea asupra integrității acestora;",
              "d) înștiințarea comitetului executiv și luarea măsurilor necesare pentru efectuarea la timp și eficient a lucrărilor de întreținere și reparații;",
              "e) urmărirea realizării contractelor cu persoane fizice sau juridice pentru reparații, închirierea unor spații sau elemente din proprietatea comună, activități sociale și alte tipuri de activități;",
              "f) verificarea existenței contractelor de închiriere între asociația de proprietari și persoane fizice sau juridice care la data constituirii acesteia folosesc spații ori elemente din proprietatea comună;",
              "g) supravegherea execuției lucrărilor de reparații și de întreținere și participarea la recepția lor, consemnând finalizarea acestora;",
              "h) controlul personalului angajat de asociația de proprietari pentru curățenie, încărcarea și evacuarea gunoiului menajer și alte activități;",
              "i) efectuarea de verificări în vederea înlăturării defecțiunilor apărute la instalațiile de folosință comună și a eliminării pierderilor care determină creșterea nejustificată a cheltuielilor asociației de proprietari;",
              "j) asigurarea cunoașterii și respectării regulilor de locuit în condominiu;",
            ],
          },
          {
            type: "paragraph",
            content: "C. îndeplinește orice alte obligații prevăzute de legislația în vigoare.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 20 – Venituri și cheltuieli comune; calculul cotelor de contribuție la cheltuielile asociației de proprietari",
          },
          {
            type: "paragraph",
            content: "(1) Anul fiscal al asociației de proprietari va fi anul calendaristic.",
          },
          {
            type: "paragraph",
            content: "(2) Înainte de începutul următorului an fiscal și pentru fiecare an fiscal ce urmează comitetul executiv va pregăti și va prezenta proprietarilor, în adunarea generală a asociației de proprietari, un buget de venituri și cheltuieli anual, suficient pentru a acoperi cheltuielile anticipate ale asociației.",
          },
          {
            type: "paragraph",
            content: "(3) Bugetul anual de venituri și cheltuieli se adoptă prin votul majorității simple a adunării generale a asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "(4) Toți proprietarii trebuie să plătească în avans cota ce le revine din bugetul pentru cheltuielile comune - cheltuieli repartizate în funcție de cota-parte de proprietate indiviză din proprietatea comună. Plata se face conform hotărârii luate în adunarea generală a asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "(5) Cota de contribuție la cheltuielile asociației de proprietari reprezintă suma pe care fiecare proprietar trebuie să o plătească lunar.",
          },
          {
            type: "paragraph",
            content: "(6) Cheltuielile lunare ale asociației de proprietari sunt repartizate în cheltuieli de întreținere și cheltuieli comune.",
          },
          {
            type: "paragraph",
            content: "(7) Cotele de contribuție se calculează în baza facturilor emise de furnizorii de servicii, fondurilor aprobate în adunarea generală a asociației de proprietari și a normelor metodologice în domeniu.",
          },
          {
            type: "paragraph",
            content: "(8) Cheltuielile de întreținere (apă rece și caldă; combustibil pentru prepararea apei calde; gaze naturale; energie electrică; iluminarea scării; instalații scară și forță ascensor; salubritate; salarii pentru administrare, contabilitate, casierie și curățenie; materiale consumabile; pentru întreținere; alte servicii ce deservesc proprietarii) se repartizează în funcție de numărul de persoane care locuiesc în luna respectivă în condominiu.",
          },
          {
            type: "paragraph",
            content: "(9) Pentru proprietarii care determină consumuri suplimentare (spălări de mașini, covoare și altele asemenea) calculul cotei de contribuție se face conform baremurilor stabilite prin legile sau actele normative existente.",
          },
          {
            type: "paragraph",
            content: "(10) Cheltuielile comune (fonduri stabilite; cheltuieli administrative; întreținerea și repararea ascensorului; întreținerea interfonului; salarii pentru fochist, instalator, electrician, portar și altele asemenea; prime; credite bancare; alte servicii către proprietatea comună) se calculează în funcție de cota-parte indiviză din proprietatea comună.",
          },
          {
            type: "paragraph",
            content: "(11) Facturile primite de asociația de proprietari de la furnizorii de servicii, care nu conțin index de consum, trebuie să respecte normele metodologice de repartizare a consumurilor, conform prevederilor legale.",
          },
          {
            type: "paragraph",
            content: "(12) Stabilirea cotelor-părți din veniturile asociației de proprietari, care sunt venituri comune, se face proporțional cu cota-parte din proprietatea comună aferentă fiecărui proprietar.",
          },
          {
            type: "paragraph",
            content: "(13) Pentru neplata cotelor de contribuție prevăzute în lista de plată afișată lunar, inclusiv a celor neprevăzute, asociația de proprietari, prin sistemul de penalizări propriu, impune o penalizare oricărui proprietar care se face vinovat, după o perioadă mai mare de 30 de zile calendaristice de la termenul stabilit pentru plată, fără ca suma penalizărilor să poată depăși suma cotei de întreținere lunare la care s-a aplicat.",
          },
          {
            type: "paragraph",
            content: "(14) Urmărirea de către asociația de proprietari a sumelor datorate de proprietarii restanțieri se face în baza extrasului din ultima listă de plată. Cheltuielile efectuate în scopul recuperării datoriilor vor fi suportate de restanțierii în cauză.",
          },
          {
            type: "paragraph",
            content: "(15) Sentința dată în favoarea asociației de proprietari pentru sumele datorate de oricare proprietar poate fi pusă în aplicare prin orice modalitate permisă de Codul de procedură civilă pentru acoperirea datoriilor.",
          },
          {
            type: "heading",
            title: "CAPITOLUL V - Obligațiile proprietarilor",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 21",
            content: "Fiecare proprietar este obligat să își mențină proprietatea imobiliară (proprietatea individuală și cota-parte de proprietate comună indiviză aferentă acesteia) în buna stare și este răspunzător de daunele provocate din cauza neîndeplinirii acestei obligații.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 22",
            content: "Proprietarii de apartamente și spații cu altă destinație decât cea de locuință sunt obligați să plătească cotele de întreținere obișnuite sau speciale către asociația de proprietari, pentru a se putea acoperi toate cheltuielile comune ale clădirii.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 23",
            content: "Proprietarii din condominiu, indiferent dacă fac parte sau nu din asociația de proprietari, sunt obligați:",
          },
          {
            type: "list",
            items: [
              "a) să plătească în avans cota ce le revine din bugetul de venituri și cheltuieli al asociației de proprietari;",
              "b) să anunțe, în scris, numele persoanelor care locuiesc temporar, venite în vizită, sau care prestează activități gospodărești în timpul zilei, de minimum 15 zile pe lună;",
              "c) să semnaleze în timp util orice problemă care apare la instalațiile de folosință comună;",
              "d) să respecte regulamentul intern al asociației de proprietari cu privire la normele de conviețuire socială în cadrul condominiului, să anunțe comitetul executiv al asociației de proprietari despre intenția de a schimba destinația proprietății individuale;",
              "e) să nu schimbe aspectul proprietății comune fără acceptul scris al comitetului executiv al asociației de proprietari;",
              "f) să accepte accesul în spațiul sau, cu un preaviz de 15 zile, al unui reprezentant al asociației de proprietari, atunci când este necesar să se repare sau să se înlocuiască elemente din proprietatea comună. Fac excepție cazurile de maximă urgență, când nu este necesar nici un preaviz;",
              "g) în condiții de neparticipare la luarea deciziilor și la desfășurarea activităților în cadrul asociației de proprietari, să nu aducă prejudicii morale celorlalți proprietari asociați;",
              "h) să încheie cu asociația de proprietari contracte de închiriere, pe care le negociază cu comitetul executiv, pentru elemente sau suprafețe din proprietatea comună folosită în interes personal.",
            ],
          },
          {
            type: "subheading",
            title: "ARTICOLUL 24",
            content: "Proprietarii, membri ai asociației de proprietari, au următoarele obligații:",
          },
          {
            type: "list",
            items: [
              "a) să respecte statutul asociației de proprietari;",
              "b) să se supună hotărârilor adunării generale a asociației de proprietari;",
              "c) să participe la adunările generale ale asociației de proprietari;",
              "d) să respecte orice angajament făcut față de asociația de proprietari;",
              "e) să nu aducă prejudicii materiale asociației de proprietari;",
              "f) să participe, atunci când este solicitat, la acțiuni deosebite, de maximă urgență, corespunzătoare scopurilor asociației de proprietari;",
              "g) să se conformeze obligațiilor proprietarilor din condominiu, prevăzute la art. 23.",
            ],
          },
          {
            type: "subheading",
            title: "ARTICOLUL 25",
            content: "Dacă proprietarul unui apartament sau spațiu cu altă destinație decât cea de locuință sau orice altă persoană care acționează în numele sau provoacă daune oricărei părți din proprietatea comună sau altei proprietăți individuale, trebuie să realizeze reparațiile necesare ori să plătească cheltuielile pentru lucrările de reparații.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 26",
            content: "În cazul spațiilor cu altă destinație decât cea de locuință, respectiv al apartamentelor, cu mai mult de un proprietar, relațiile de coproprietate dintre proprietari vor fi reglementate în conformitate cu prevederile Codului civil.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 27",
          },
          {
            type: "paragraph",
            content: "(1) Zidurile dintre apartamentele alăturate, care nu fac parte din structura de rezistență a condominiului, pot fi reamplasate, prin acord între proprietarii apartamentelor sau spațiilor respective și cu înștiințarea asociației de proprietari, în condițiile legii.",
          },
          {
            type: "paragraph",
            content: "(2) Zidurile dintre apartamente și proprietatea comună, care nu fac parte din structura de rezistență a condominiului, pot fi reamplasate numai prin amendarea acordului de asociere.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 28",
            content: "Dacă unul dintre proprietari împiedică, cu bună știință și sub orice formă, folosirea normală a condominiului, creând prejudicii celorlalți proprietari, după caz, măsurile pentru folosirea normală a condominiului se vor hotărî pe cale judecătorească, la solicitarea asociației de proprietari.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 29",
            content: "Fiecare proprietar, chiriaș sau ocupant al unui apartament ori spațiu cu altă destinație decât cea de locuință are obligația să se conformeze regulilor prezentului statut, precum și regulilor, regulamentelor, hotărârilor și rezoluțiilor adoptate legal de asociația de proprietari.",
          },
          {
            type: "heading",
            title: "CAPITOLUL VI - Drepturile proprietarilor",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 30",
            content: "Fiecare proprietar, indiferent dacă face parte sau nu din asociația de proprietari, are dreptul de a folosi proprietatea comună din condominiu în condițiile stabilite de lege, de regulamente ale autorităților în drept, dar nici un proprietar nu poate folosi această proprietate astfel încât să lezeze drepturile sau interesele oricărui alt proprietar al acesteia, inclusiv cele stabilite prin prezentul statut.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 31",
            content: "Fiecare proprietar poate folosi, poate ipoteca sau poate înstrăina, în deplină libertate, proprietatea imobiliară pe care o deține în cadrul condominiului.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 32",
            content: "Membrii asociației de proprietari au și următoarele drepturi:",
          },
          {
            type: "list",
            items: [
              "a) să participe cu vot deliberativ la adunarea generală a asociației de proprietari, să aleagă și să fie aleși în structura organizatorică a asociației. Pentru a beneficia de acest drept, persoana în cauză trebuie să posede capacitate juridică deplină. Minorii și persoanele puse sub interdicție nu pot fi aleși în organele de conducere sau de control ale asociației de proprietari;",
              "b) să solicite și să primească, ori de câte ori este necesar și motivat, explicații cu privire la calculul cotei de contribuție afișat pe lista de plată și să conteste, în scris, la comitetul executiv al asociației de proprietari, în termen de 10 zile de la afișarea listei, cuantumul stabilit al acestei cote;",
              "c) dacă o decizie a asociației de proprietari este contrară statutului, acordului de asociere, legilor sau este de natură să producă daune considerabile unei minorități a proprietarilor, orice proprietar poate acționa în justiție valabilitatea respectivei decizii, în termen de 60 de zile de la adoptarea acesteia;",
              "d) să solicite, în baza unei cereri către președintele asociației de proprietari, diminuarea temporară a cotelor de contribuție la cheltuielile asociației (reducerea cheltuielilor de întreținere, dar nu și a cheltuielilor comune), dacă lipsa din apartament este de cel puțin 15 zile calendaristice pe lună;",
              "e) să pună întrebări și să solicite explicații comitetului executiv, referitoare la activitatea asociației de proprietari;",
              "f) să beneficieze, când este cazul, de toate facilitățile rezultate în urma activităților desfășurate de asociația de proprietari, în funcție de cota-parte de proprietate și de gradul de implicare;",
              "g) să participe la activitățile lucrative ale asociației, benevol, în funcție de capacitățile profesionale;",
              "h) să beneficieze de garanții morale și materiale, stabilite de adunarea generală a asociației de proprietari, pentru inițiative personale, finalizate, în folosul asociației de proprietari;",
              "i) să prezinte spre rezolvare probleme specifice asociației de proprietari sau probleme deosebite, care nu au putut fi soluționate pe cale obișnuită, și să participe activ la acțiunea de soluționare.",
            ],
          },
          {
            type: "heading",
            title: "CAPITOLUL VII - Dizolvarea asociației de proprietari",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 33",
            content: "Asociația de proprietari se va dizolva în situația în care numărul proprietarilor condominiului scade sub 5 sau cu acordul tuturor proprietarilor ori al reprezentanților acestora, în condiții de maximă urgență, când situația sau când starea condominiului o impune.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 34",
            content: "Asociația de proprietari se va putea dizolva și în următoarele cazuri:",
          },
          {
            type: "list",
            items: [
              "a) când scopul pentru care a fost legal înființată nu se îndeplinește;",
              "b) prin hotărârea adunării generale a asociației de proprietari, adoptată cu votul a cel puțin două treimi din numărul membrilor asociați.",
            ],
          },
          {
            type: "subheading",
            title: "ARTICOLUL 35",
            content: "În momentul dizolvării patrimoniul asociației de proprietari, respectiv veniturile provenite din preluarea sau din lichidarea bunurilor asociației, acesta va fi distribuit proprietarilor proporțional cu cotele-părți din proprietatea comună sau, dacă este cazul, după cota de participare a proprietarilor la constituirea bunurilor asociației.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 36",
            content: "Dizolvarea asociației de proprietari va fi anunțată la judecătoria sau administrația financiară unde aceasta a fost înregistrată.",
          },
          {
            type: "heading",
            title: "CAPITOLUL VIII - Dispoziții finale",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 37",
          },
          {
            type: "paragraph",
            content: "(1) Activitatea asociației de proprietari se desfășoară și cu respectarea metodologiei de încheiere, de executare și încetare a raporturilor de muncă, de conducere a evidenței, de efectuare a operațiunilor de disciplină financiară și de casă, precum și de verificare financiar-contabilă, stabilite de ministerele de resort și consiliile locale ale municipiilor, orașelor și comunelor, respectiv ale sectoarelor municipiului București.",
          },
          {
            type: "paragraph",
            content: "(2) Arhivarea documentelor și a registrelor asociației de proprietari se face conform prevederilor legale.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 38",
          },
          {
            type: "paragraph",
            content: "(1) Dacă toți proprietarii, membri ai asociației, sunt abonați individuali, pe bază de contract, ai furnizorilor de servicii, asociația de proprietari este degrevată de atribuțiile avute până la data respectivă, cu referire la calculul și încasarea cotelor de contribuție, precum și la plata facturilor aferente.",
          },
          {
            type: "paragraph",
            content: "(2) Pe baza unui contract între furnizorii de servicii și asociația de proprietari, cu aprobarea adunării generale a asociației de proprietari, asociația poate presta servicii de intermediere, conform statutului și legilor în vigoare.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 39",
            content: "Pentru obținerea de venituri necesare desfășurării activităților sale, asociația de proprietari poate desfășura activități lucrative, în condițiile legii.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 40",
          },
          {
            type: "paragraph",
            content: "(1) Consiliile locale ale municipiilor, orașelor, comunelor și, respectiv, ale sectoarelor municipiului București, cu sprijinul aparatului propriu al consiliilor județene, respectiv al Consiliului General al Municipiului București, vor organiza exercitarea controlului financiar-contabil și gestionar asupra activității asociației de proprietari, la solicitarea unuia sau mai multor membri ai asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "(2) În acest scop asociația de proprietari este obligată să pună la dispoziție autorităților prevăzute la alineatul precedent registrele, actele asociației și toate informațiile considerate utile de acestea.",
          },
          {
            type: "paragraph",
            content: "(3) În situația în care se constată fraude sau lipsuri în gestiune, vor fi sesizate organele de cercetare, iar comitetul executiv al asociației de proprietari va fi îndrumat să folosească căile legale pentru recuperarea prejudiciului și pentru a acționa în justiție împotriva celui care se face vinovat.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 41",
            content: "Organizarea și conducerea contabilității asociației de proprietari se face potrivit legii.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 42",
            content: "În cazul decesului unuia dintre asociați, activitatea asociației de proprietari va putea continua cu succesorii testamentari sau legali, după caz.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 43",
          },
          {
            type: "paragraph",
            content: "(1) Soluționarea litigiilor dintre asociația de proprietari și terțe persoane fizice sau juridice române este de competența instanțelor judecătorești române.",
          },
          {
            type: "paragraph",
            content: "(2) Litigiile asociației de proprietari cu persoane fizice sau juridice străine sunt de competența organelor judecătorești prevăzute în legislația română.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 44",
          },
          {
            type: "paragraph",
            content: "(1) Pentru recuperarea banilor datorați și a dobânzii aferente, asociația de proprietari îi va putea chema în justiție pe proprietarii care nu își achită cotele de întreținere datorate mai mult de 90 de zile.",
          },
          {
            type: "paragraph",
            content: "(2) Executarea acestor hotărâri judecătorești se va face conform Codului de procedură civilă.",
          },
          {
            type: "subheading",
            title: "ARTICOLUL 45",
            content: "Prezentul statut a fost redactat în ... exemplare.",
          },
        ],
      },
    ],
  },
  {
    id: "organe-conducere",
    title: "Organe de Conducere",
    description: "Organele de conducere ale asociației de proprietari: Adunarea Generală și Comitetul Executiv",
    documents: [
      {
        id: "adunarea-generala",
        title: "Adunarea Generală a Proprietarilor",
        description: "Funcționarea, atribuțiile și regulile adunării generale a asociației de proprietari",
        sections: [
          {
            type: "heading",
            title: "Adunarea Generală a Proprietarilor",
          },
          {
            type: "subheading",
            title: "1. Rol și funcționare",
            content: "Asociația de proprietari este condusă de adunarea generală. După prima întrunire organizatorică, adunarea generală se întrunește cel puțin o dată în fiecare an calendaristic.",
          },
          {
            type: "subheading",
            title: "2. Convocarea",
            content: "Întrunirea adunării generale va fi anunțată în scris prin afișare la loc vizibil, cu cel puțin 10 zile înainte de data convocării. Convocarea trebuie să conțină ordinea de zi, data, ora și locul desfășurării.",
          },
          {
            type: "subheading",
            title: "3. Cvorumul",
          },
          {
            type: "paragraph",
            content: "Pentru ca hotărârile adunării generale să fie valabile, este necesară prezența majorității membrilor asociați, personal sau prin reprezentant.",
          },
          {
            type: "paragraph",
            content: "În cazul în care cvorumul nu este întrunit, adunarea generală va fi convocată la o dată ulterioară, când proprietarii prezenți pot hotărî, cu majoritate de voturi, asupra problemelor înscrise pe ordinea de zi, indiferent de cvorum.",
          },
          {
            type: "subheading",
            title: "4. Votul",
          },
          {
            type: "paragraph",
            content: "Hotărârile adunării generale vor fi luate cu majoritate de voturi (cu cel puțin jumătate plus unu din voturile proprietarilor prezenți la adunarea generală).",
          },
          {
            type: "paragraph",
            content: "Votul fiecărui proprietar are o pondere egală cu cota-parte din proprietatea comună. Proprietarul poate fi reprezentat de un membru al familiei sau de un alt reprezentant care are o împuternicire semnată. Un membru al asociației poate reprezenta cel mult încă un membru absent, prin împuternicire scrisă. În cazul egalității de voturi, votul președintelui este decisiv.",
          },
          {
            type: "subheading",
            title: "5. Majorități speciale",
          },
          {
            type: "paragraph",
            content: "Hotărârile adunării generale privind modificarea statutului sau dizolvarea asociației de proprietari ori perceperea unei sume speciale destinate achitării cheltuielilor comune neprevăzute în buget, dar necesare, se adoptă cu votul a două treimi din numărul membrilor asociației de proprietari.",
          },
          {
            type: "subheading",
            title: "6. Atribuții principale",
            content: "Adunarea generală are următoarele atribuții principale:",
          },
          {
            type: "list",
            items: [
              "Aprobă darea de seamă anuală asupra activității comitetului executiv, raportul comisiei de cenzori și raportul exercițiului bugetar, acordând anual descărcare de gestiune",
              "Adoptă sau amendează deciziile, regulile și regulamentele asociației de proprietari",
              "Hotărăște asupra necesității constituirii fondului de rulment, fondului de reparații și a altor fonduri speciale",
              "Hotărăște modificările ulterioare ale statutului asociației de proprietari și/sau ale acordului de asociere (cu 2/3 din voturi)",
              "Hotărăște natura și volumul mijloacelor materiale și bănești necesare desfășurării activității asociației",
              "Hotărăște modul de asigurare a administrării condominiului de către o persoană fizică sau juridică",
              "Hotărăște volumul serviciilor necesare pentru buna funcționare a condominiului",
              "Hotărăște cuantumul salariilor, indemnizațiilor și premiilor pentru personalul angajat",
              "Alege comitetul executiv al asociației și validează președintele",
              "Alege comisia de cenzori sau hotărăște delegarea atribuțiilor",
              "Revocă, atunci când este cazul, membrii comitetului executiv sau ai comisiei de cenzori",
              "Hotărăște termenul și forma de plată a cotelor de contribuție",
              "Validează sistemul de penalizări stabilit de comitetul executiv",
              "Hotărăște asupra participării cu capital și cumpărării de spații",
              "Adoptă măsuri sau programe sociale și de instruire a proprietarilor",
              "Hotărăște schimbarea instalațiilor comune (cu 2/3 din voturi)",
            ],
          },
          {
            type: "subheading",
            title: "7. Contestarea deciziilor",
            content: "Dacă o decizie a asociației de proprietari este contrară legii sau acordului de asociere ori este de natură să producă daune considerabile intereselor unei minorități a proprietarilor, orice proprietar poate inițiă acțiune în justiție împotriva respectivei decizii, în termen de 60 de zile de la adoptarea acesteia.",
          },
          {
            type: "subheading",
            title: "8. Documentarea",
            content: "Discuțiile și hotărârile adunării generale se consemnează într-un registru de procese-verbale, care se păstrează la președintele asociației de proprietari. Procesul verbal se va semna de toți membrii participanți.",
          },
        ],
      },
      {
        id: "comitet-executiv",
        title: "Comitetul Executiv",
        description: "Funcționarea, componența și atribuțiile comitetului executiv al asociației de proprietari",
        sections: [
          {
            type: "heading",
            title: "Comitetul Executiv",
          },
          {
            type: "subheading",
            title: "1. Rol și delegare",
            content: "Autoritatea de a stabili direcțiile privind funcționalitatea și administrarea condominiului poate fi delegată de către asociația de proprietari către comitetul executiv al acesteia. Comitetul executiv va acționa în numele proprietarilor în ceea ce privește administrarea și funcționalitatea condominiului, cu excepția atribuțiilor rezervate exclusiv acestora.",
          },
          {
            type: "subheading",
            title: "2. Componență și întrunire",
          },
          {
            type: "paragraph",
            content: "Comitetul executiv se va întruni de cel puțin 4 ori pe an. Numărul membrilor ce formează comitetul executiv va fi stabilit de adunarea generală a asociației de proprietari, dar va fi un număr impar și nu mai mic de 3.",
          },
          {
            type: "paragraph",
            content: "Comitetul executiv va fi condus de un președinte care va fi desemnat în persoana celui care întrunește cel mai mare număr de voturi la alegerea comitetului executiv. Președintele asociației de proprietari va fi și președintele comitetului executiv.",
          },
          {
            type: "paragraph",
            content: "Comitetul executiv va alege vicepreședintele și secretarul, care sunt membri ai comitetului executiv.",
          },
          {
            type: "subheading",
            title: "3. Atribuții principale",
            content: "Comitetul executiv are următoarele atribuții:",
          },
          {
            type: "list",
            items: [
              "Aduce la îndeplinire hotărârile adunării generale, execută bugetul de venituri și cheltuieli și întocmește proiectul bugetului pentru anul următor",
              "Prezintă dări de seamă asupra activității desfășurate și propuneri de îmbunătățire",
              "Convoacă adunarea generală în ședințe extraordinare ori de câte ori este nevoie",
              "Răspunde de îngrijirea, păstrarea în bune condiții și supravegherea utilităților condominiului, spațiilor comune și instalațiilor",
              "Analizează oferte și negociază contracte de administrare cu persoane juridice",
              "Răspunde de încasarea lunară a cotelor de contribuție; emite somații către restanțieri; rezolvă contestații",
              "Urmărește recuperarea pagubelor produse asociației de proprietari",
              "Negociază contracte pentru închirierea elementelor sau suprafețelor din proprietatea comună",
              "Propune adunării generale preluarea managementului de proprietate și financiar de către persoane juridice",
              "Hotărăște necesitatea operațiunilor de verificare și control asupra gestionării bunurilor",
              "Înștiințează proprietarii despre necesitatea reparațiilor; avizează ordinea de priorități a lucrărilor",
              "Dă dispoziții pentru sistemul de protejare a bunurilor, securitate a clădirii",
              "Propune crearea fondurilor speciale; urmărește completarea cărții tehnice a construcției",
              "Împuternicește administratorul pentru verificări: reparații, pierderi de apă, contoare, igienă",
              "Participă la recepția lucrărilor de reparații asupra proprietății comune",
              "Stabilește modul de calcul și încasare a fondului de rulment",
              "Hotărăște managementul financiar, sistemul de penalizări pentru neplata cotelor",
              "Hotărăște acționarea în justiție a proprietarilor restanțieri (peste 90 de zile)",
              "Asigură condițiile de securitate și igienă, prevenire și stingere a incendiilor",
              "Hotărăște societatea bancară pentru conturile asociației",
              "Propune adunării generale măsuri de dezvoltare și eficientizare",
            ],
          },
          {
            type: "subheading",
            title: "4. Suspendare și reziliere",
            content: "Asociația de proprietari, prin comitetul executiv, poate suspenda din funcție sau poate rezilia contractul individual de muncă ori convenția civilă de prestări de servicii, încheiată cu oricine din rândul personalului angajat ori, după caz, poate rezilia contractele încheiate cu alte persoane fizice sau juridice, în condițiile legii.",
          },
          {
            type: "subheading",
            title: "5. Cvorum și vot",
            content: "Comitetul executiv lucrează valabil în prezența a jumătate plus unu din numărul membrilor săi și adoptă hotărâri cu cel puțin două treimi din numărul membrilor prezenți.",
          },
          {
            type: "subheading",
            title: "6. Documentarea",
            content: "Discuțiile și hotărârile se consemnează în registrul de procese-verbale, care se păstrează la președinte, procesele-verbale semnându-se de toți membrii comitetului executiv prezenți.",
          },
          {
            type: "subheading",
            title: "7. Președintele asociației",
          },
          {
            type: "paragraph",
            content: "Conducătorul executiv al asociației de proprietari este președintele. Președintele este înlocuit de vicepreședinte în cazul absenței sau imposibilității de a-și îndeplini atribuțiile.",
          },
          {
            type: "paragraph",
            content: "Atribuțiile președintelui:",
          },
          {
            type: "list",
            items: [
              "Verifică respectarea și îndeplinirea hotărârilor adoptate de adunarea generală și de comitetul executiv",
              "Reprezintă asociația de proprietari în încheierea și derularea contractelor, inclusiv în acțiunile judecătorești",
              "Avizează ordinea de priorități și planul lucrărilor de întreținere și reparații",
              "Are drept de semnătură asupra conturilor asociației de proprietari",
              "Primește cererile și reclamațiile de la proprietari și sesizările administratorului",
              "Convoacă comitetul executiv trimestrial sau ori de câte ori este nevoie",
              "Întocmește ordinea de zi și conduce lucrările comitetului executiv",
              "Eliberează adeverințe proprietarilor care își înstrăinează apartamentele",
              "Semnează deciziile de imputare, contractele de muncă și alte acte emise de comitetul executiv",
              "Păstrează și folosește ștampila asociației de proprietari",
            ],
          },
          {
            type: "paragraph",
            content: "La asociațiile de proprietari care cuprind până la 10 proprietari, președintele poate îndeplini și funcția de administrator.",
          },
          {
            type: "subheading",
            title: "8. Secretarul comitetului executiv",
          },
          {
            type: "paragraph",
            content: "Secretarul comitetului executiv va păstra și va întocmi procesele-verbale ale ședințelor comitetului executiv și procesele-verbale ale tuturor adunărilor generale ale asociației de proprietari.",
          },
          {
            type: "paragraph",
            content: "Secretarul comitetului executiv poate păstra registrele și celelalte acte ale asociației de proprietari, potrivit hotărârii comitetului executiv.",
          },
          {
            type: "subheading",
            title: "9. Comisia de cenzori",
          },
          {
            type: "paragraph",
            content: "Adunarea generală alege dintre membrii asociației o comisie de cenzori (număr impar, minim 3 membri) care verifică situația financiară și contabilă. Membrii comisiei de cenzori nu pot face parte din comitetul executiv și trebuie să aibă cunoștințe în domeniile financiar, economic și/sau juridic.",
          },
          {
            type: "paragraph",
            content: "Atribuțiile comisiei de cenzori:",
          },
          {
            type: "list",
            items: [
              "Verifică îndeplinirea condițiilor statutare privind prezența și votul în adunările generale",
              "Verifică execuția bugetară și propunerile de buget",
              "Efectuează controlul preventiv pentru plățile cu numerar",
              "Verifică cel puțin o dată pe semestru gestiunea asociației",
              "Verifică dacă registrele îndeplinesc condițiile legale",
              "Întocmește rapoarte asupra activității și gestiunii, propunând descărcarea de gestiune",
              "Propune programe de management financiar și recuperarea pagubelor",
              "Participă la negocierea contractelor de management financiar",
            ],
          },
        ],
      },
    ],
  },
];
