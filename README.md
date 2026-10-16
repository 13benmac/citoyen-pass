# 🇧🇯 Citoyen Bénin — Le Hub Omnicanal de Simplification Administrative

> **Portail souverain et unifié d'accès aux services publics de la République du Bénin.**

Le projet **Citoyen Bénin** transforme l'administration béninoise d'un modèle réactif et cloisonné (où le citoyen téléverse sans cesse des copies et se déplace en mairie/préfecture) en un modèle **proactif, interconnecté et accessible à 100% de la population**.

---

## 🌟 Les 4 Piliers Intégrés

1. **Pilier 1 — Le Moteur « Dites-le-nous une fois » (Backend & Interopérabilité X-Road)**
   - Formulaire unique basé sur le NPI (Numéro Personnel d'Identification).
   - Interrogation en temps réel de l'**ANIP** (État civil), de la **DGI** (Quitus fiscal) et du **Ministère de la Justice** (Casier judiciaire).
   - Dossier validé en quelques secondes avec **zéro document papier téléversé**.

2. **Pilier 2 — Le Portefeuille Numérique Hors-ligne (Mobile & Cryptographie 2D-Doc)**
   - Stockage local sécurisé des attestations officielles (CIP, quittances).
   - Code **2D-Doc / QR cryptographique signé ED25519**.
   - Vérifiable **en mode avion / hors-ligne** par un agent de contrôle grâce au trousseau public souverain de l'État.

3. **Pilier 3 — La Passerelle d'Inclusion « Dernier Kilomètre » (USSD `*130#` & SVI Vocal)**
   - Accessible sur les téléphones 2G à touches via le code court universel `*130#`.
   - Serveur vocal interactif (SVI) en langues nationales (**Fongbé**, **Yorùbá**, et Français) pour les citoyens non connectés ou analphabètes.

4. **Pilier 4 — L'Agent Proactif du Cycle de Vie (Relances & TrésorPay)**
   - Détection automatique d'expiration d'un titre (carte, CIP, attestation).
   - Alerte automatisée via WhatsApp officiel / SMS avec dossier pré-rempli.
   - Renouvellement et paiement en 1 clic via le guichet **TrésorPay (MTN MoMo / Moov Money)**.

5. **Indicateurs d'Impact Citoyen**
   - **-85%** de papier consommé (12,4 millions de feuilles économisées/an).
   - **-99,8%** de délais d'instruction (de 14 jours ouvrés à 45 secondes).
   - **38 millions de km** de trajets évités (zémidjans et transports).
   - **4,8 milliards FCFA** de pouvoir d'achat restitué aux ménages.

---

## 🚀 Comment Lancer et Tester le Prototype

### Option 1 : Lancement avec le serveur Python (Recommandé)
Dans votre terminal :
```bash
python3 serve.py
```
Puis ouvrez votre navigateur sur : [http://localhost:8000](http://localhost:8000)

### Option 2 : Ouverture directe dans le navigateur
Double-cliquez simplement sur le fichier `index.html` ou ouvrez-le avec Chrome / Safari / Firefox.

---

## 🎯 Parcours de Démonstration (3 à 5 minutes)

1. **Accueil — Moteur « Dites-le-nous une fois »** :
   - Présentation de la démarche administrative.
   - Cliquez sur `🚀 Lancer la démarche en 1-clic`.
   - Observez la console X-Road à droite : l'ANIP, les impôts et le casier judiciaire sont interrogés en direct sous le contrôle de l'APDP.

2. **Mes documents — Portefeuille Hors-Ligne 2D-Doc** :
   - Activez le bouton `Mode Avion`.
   - À droite sur le terminal de l'agent de contrôle, cliquez sur `🔍 Scanner le document du citoyen`.
   - Expliquez : *« Même sans aucune connexion 4G au fond d'un village ou à un poste de contrôle frontière, la signature 2D-Doc est authentifiée instantanément grâce à la clé publique locale. »*

3. **L'Inclusion des 45% non connectés (1 min) — Onglet "3. Inclusion USSD & Vocal"** :
   - Sur le téléphone 2G, cliquez sur le raccourci `*130*1#` ou composez au clavier et appuyez sur `APPELER`.
   - Montrez la consultation d'un dossier sans Internet.
   - Dans le lecteur audio à droite, sélectionnez **Fongbé** puis cliquez sur `Écouter l'invite vocale`.
   - Soulignez : *« La vieille maman ou l'agriculteur peut suivre son dossier dans sa langue maternelle. »*

4. **La Proactivité de l'État (1 min) — Onglet "4. Agent Proactif"** :
   - Montrez la notification WhatsApp : *« Le citoyen ne court plus après ses papiers : l'État l'avertit 28 jours avant expiration. »*
   - Cliquez sur `⚡ Renouveler et Payer (1 Clic)`.
   - Sélectionnez `MTN MoMo` et validez sur TrésorPay.
   - Montrez la délivrance instantanée de la nouvelle validité.

5. **Conclusion (30s) — Onglet "Aide & Impact"** :
   - Présentez les chiffres d'impact et la phrase clé :
   *« Citoyen Bénin ne réinvente pas la roue : il relie ANIP, X-Road, TrésorPay et les opérateurs télécoms pour offrir un service public digne, fluide et souverain à 100% des Béninois. »*

