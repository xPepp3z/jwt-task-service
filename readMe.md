# Task API con JWT, MongoDB e Swagger

API REST sviluppata in TypeScript con Express e MongoDB per la gestione di utenti e task.

Il progetto include:

- autenticazione con JWT
- CRUD task
- validazioni input con express-validator
- documentazione OpenAPI/Swagger
- linting, formattazione e test con coverage

## Panoramica Funzionale

- Registrazione e login utente
- Generazione token JWT in fase di login
- Operazioni task generali e task per utente autenticato
- Controlli di autorizzazione sulla proprietà delle task
- Eliminazione account utente con cancellazione task associate
- Documentazione interattiva API su Swagger UI

## Tecnologie Utilizzate

### Runtime e linguaggio

- Node.js
- TypeScript
- ESM (package.json con type: module)

### Backend

- Express 5
- Mongoose
- dotenv
- jsonwebtoken
- express-validator

### Documentazione API

- swagger-jsdoc
- swagger-ui-express

### Qualità, test e tooling

- ESLint (flat config)
- Prettier
- Jest 29
- ts-jest

## Architettura Progetto

Struttura principale:

- src/server.ts: bootstrap server, connessione DB, middleware globali, mount rotte
- src/config.ts: lettura variabile JWT_SECRET
- src/routes/authRoutes.ts: rotte autenticazione e account
- src/routes/taskRoutes.ts: rotte task
- src/auth/\*.ts: logica auth (register, login, delete account)
- src/controllers/taskController.ts: logica CRUD task
- src/middleware/authMiddleware.ts: verifica JWT + validazioni auth
- src/middleware/taskMiddleware.ts: validazioni task
- src/models/userModel.ts: schema utente
- src/models/taskModel.ts: schema task
- swagger.ts: configurazione OpenAPI/Swagger
- test/sum.test.ts: test di esempio con Jest

## Prerequisiti

- Node.js 18+ consigliato
- npm
- MongoDB in locale in ascolto su:
  - mongodb://127.0.0.1:27017/tasks_jwt

## Installazione

1. Installa dipendenze:

```bash
npm install
```

2. Crea il file .env in root progetto:

```env
JWT_SECRET=una_chiave_super_segreta
```

3. Avvia il progetto:

```bash
npm run start
```

Questo script compila TypeScript (dist/) e avvia il server su porta 3000.

## Documentazione Swagger

Una volta avviato il server:

- Swagger UI: http://localhost:3000/api-docs

La documentazione viene generata dai commenti JSDoc presenti in src/routes.

## Autenticazione e Sicurezza

Autenticazione tramite JWT.

Dettaglio importante del progetto attuale:

- il token viene passato come query parameter, non come header Authorization
- formato richiesto:
  - ?token=<jwt>

Le rotte protette verificano:

- presenza token
- validità firma JWT con JWT_SECRET
- associazione utente decodificato a req.user

## Rotte API

Base URL:

- http://localhost:3000

### Auth

1. POST /auth/register

- Descrizione: registra un nuovo utente
- Body richiesto:
  - username: string non vuota
  - email: formato email valido
  - password: almeno 6 caratteri
- Risposte principali:
  - 201 utente creato
  - 400 validazione fallita o email già registrata
  - 500 errore server

2. POST /auth/login

- Descrizione: login utente e ritorno token JWT
- Body richiesto:
  - email: formato email valido
  - password: almeno 6 caratteri
- Risposte principali:
  - 200 token restituito
  - 400 email non trovata o password errata
  - 500 errore server

3. DELETE /auth/delete?token=<jwt>

- Descrizione: elimina utente autenticato e tutte le sue task
- Risposte principali:
  - 200 utente eliminato
  - 401 token mancante/non valido
  - 404 utente non trovato
  - 500 errore server

### Tasks

1. GET /tasks

- Descrizione: restituisce tutte le task nel database
- Autenticazione: non richiesta
- Risposte principali:
  - 200 lista task
  - 500 errore server

2. GET /tasks/me?token=<jwt>

- Descrizione: restituisce solo task dell'utente autenticato
- Autenticazione: richiesta
- Risposte principali:
  - 200 lista task utente
  - 401 token mancante/non valido
  - 500 errore server

3. POST /tasks?token=<jwt>

- Descrizione: crea una nuova task per utente autenticato
- Autenticazione: richiesta
- Body richiesto:
  - title: string non vuota
  - completed: boolean
- Risposte principali:
  - 201 task creata
  - 400 validazione fallita
  - 401 token mancante/non valido
  - 500 errore server

4. PATCH /tasks/:id?token=<jwt>

- Descrizione: aggiornamento parziale task
- Autenticazione: richiesta
- Controlli:
  - task esistente
  - proprietà task (owner check)
  - validazione body con middleware task
- Risposte principali:
  - 200 task aggiornata
  - 400 validazione fallita
  - 401 token mancante/non valido
  - 403 task non di proprietà
  - 404 task non trovata
  - 500 errore server

5. PUT /tasks/:id?token=<jwt>

- Descrizione: aggiornamento completo task
- Autenticazione: richiesta
- Controlli:
  - task esistente
  - proprietà task (owner check)
  - validazione body con middleware task
- Risposte principali:
  - 200 task aggiornata
  - 400 campi non validi
  - 401 token mancante/non valido
  - 403 task non di proprietà
  - 404 task non trovata
  - 500 errore server

6. DELETE /tasks/:id?token=<jwt>

- Descrizione: elimina task per id
- Autenticazione: richiesta
- Controlli:
  - task esistente
  - proprietà task (owner check)
- Risposte principali:
  - 200 task eliminata
  - 401 token mancante/non valido
  - 403 task non di proprietà
  - 404 task non trovata
  - 500 errore server

## Controlli e Validazioni Implementate

### Validazioni input

Auth:

- validateRegister:
  - email valida
  - password minima 6 caratteri
  - username non vuoto
- validateLogin:
  - email valida
  - password minima 6 caratteri

Task:

- validateTasks:
  - title stringa non vuota
  - completed boolean

### Controlli autorizzativi

- verifyJWT su rotte protette
- confronto ownership task.user con req.user.\_id in update/delete

### Gestione errori globale

- Middleware errore globale: ritorna 500 con messaggio standard
- Middleware catch-all 404: rotta non trovata

## Modello Dati

### User

- username: String
- email: String
- password: String

### Task

- title: String
- completed: Boolean (default false)
- user: ObjectId (ref User)

## Script Disponibili

- npm run start
  - compila TypeScript e avvia server da dist
- npm run test
  - esegue test Jest
- npm run lint
  - ESLint + Prettier check
- npm run format
  - formatta il codice con Prettier
- npm run validate
  - lint + format check + test

## Test e Coverage

- Framework test: Jest con ts-jest
- Ambiente test: node
- Coverage attiva in cartella coverage/
- Test presente:
  - somma funzione di esempio in src/sum.ts con test in test/sum.test.ts

## Configurazioni Principali

- tsconfig.json
  - output in dist/
  - module nodenext
  - strict mode abilitato
- tsconfig.jest.json
  - override module commonjs per compatibilità Jest
- jest.config.cjs
  - preset ts-jest
  - transform TypeScript con ts-jest
- eslint.config.ts
  - flat config ESLint
  - regole TypeScript consigliate
  - integrazione con Prettier

## Note Tecniche Importanti

- La connessione MongoDB è attualmente hardcoded in src/server.ts.
- Le password sono salvate in chiaro (nessun hashing). In produzione è obbligatorio usare bcrypt o Argon2.
- Il token JWT è letto da query parameter (?token=...), approccio utile per esercitazione ma meno sicuro dell'header Authorization: Bearer.

## Possibili Miglioramenti

- Hash password in fase di registrazione
- Migrazione token da query a header Authorization
- Uso variabili ambiente anche per URI MongoDB e porta
- Aggiunta test di integrazione su rotte auth/task
- Aggiunta rate limiting e helmet
