Aby poprawnie zarządzać tym projektem zgodnie z wymaganiami technicznymi, przygotowałem dwa diagramy. Pierwszy obrazuje strukturę branchy (jak przechodzić przez kolejne części zadania), a drugi proces wdrażania zmian (deploy).

### 1. Schemat pracy na branchach (Part 1, 2, 3)

Ten schemat pokazuje, jak rozwijać projekt, tworząc osobne branche dla kolejnych etapów, zgodnie z instrukcją "Never merge into main".

```mermaid
graph TD
    M[main] --> S[shelter]
    S --> P2[shelter-part2]
    P2 -->|merge| S
    S --> P3[shelter-part3]
    P3 -->|merge| S
    S -.->|deploy| GH[gh-pages]

```

### 2. Proces automatycznego deployu (GitHub Actions)

Jeśli zdecydujesz się na automatyzację, każdy `git push` na odpowiedni branch automatycznie aktualizuje Twoją stronę na `gh-pages`.

```mermaid
graph LR
    subgraph "Repozytorium GitHub"
        A["Branch 'shelter'"]
    end
    
    A -->|"git push"| B{GitHub Actions}
    B -->|"Kompilacja i Build"| C[Deploy]
    C --> D["Branch 'gh-pages'"]
    D --> E["Strona WWW"]

```

---

### Praktyczne przypomnienia:

* 
**Struktura folderów**: Pamiętaj, że wewnątrz brancha `shelter` musisz utworzyć folder o nazwie `shelter` i tam umieścić wszystkie pliki projektu.


* 
**Deployment**: Zgodnie z wymaganiami, `gh-pages` służy do hostowania pracy. Jeśli używasz metody ręcznej, po każdej ważnej zmianie tworzysz PR z `shelter` do `gh-pages`, aby opublikować efekt końcowy.


* 
**Ważne**: Nie zapomnij o dodaniu pliku `index.js` z `console.log()` zawierającym Twoją samoocenę – jest to wymagane technicznie do zaliczenia zadania.