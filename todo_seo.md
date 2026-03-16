# Da Fare: Ottimizzazioni SEO (Schema.org)

Questo file contiene i promemoria delle informazioni che dovrai aggiornare nel codice per avere una Local SEO e una Product SEO perfette a livello di dati strutturati.

## LocalBusiness (`src/app/page.js`)
L'oggetto `LocalBusiness` nella homepage serve a segnalare a Google Maps chi sei, dove sei e quando sei aperto. 

- [ ] **Numero di telefono:** Quando avrai un centralino o un numero pubblico, ricordati di aggiungere la proprietà `telephone: "+39 XXXXXXXXXX",` sotto a `email: "info@dtfitalia.it"`.
- [ ] **Immagine Attività:** Attualmente lo schema usa `og-image.jpg` come placeholder per l'immagine del LocalBusiness. 
  - **Specifiche Immagine per Local Business:** Google raccomanda un'immagine che rappresenti chiaramente o la vetrina esterna, l'insegna, o l'interno del laboratorio.
  - Carica l'immagine nella cartella `public/` (es. `vetrina.jpg`).
  - Aggiorna il percorso in `src/app/page.js` sostituendo `${BASE_URL}/og-image.jpg` con il link alla tua nuova immagine `${BASE_URL}/vetrina.jpg`.
- [ ] **Orari di apertura:** Controlla che gli orari (attualmente impostati da me a Lun-Ven dalle 09:00 alle 18:00 nell'oggetto `openingHoursSpecification`) rispecchino la realtà per evitare che un cliente ti trovi "Chiuso" su Google mentre sei aperto.
