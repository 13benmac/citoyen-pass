/* ==========================================================================
   Pass Citoyen Bénin — Moteur Logique & Simulateur Interactif (v1.0)
   ========================================================================== */

// --- Base de données simulée des citoyens béninois ---
const CITIZENS_DB = {
  "1029384756": {
    npi: "1029384756",
    nom: "BIO KORA",
    prenom: "Sanni",
    nomComplet: "Bio Kora Sanni",
    initiales: "BK",
    dateNaissance: "14/04/1993",
    lieuNaissance: "Parakou (Borgou)",
    commune: "Parakou",
    genre: "M",
    profession: "Ingénieur Agronome",
    photoEmoji: "👨🏾‍💼",
    anipValide: true,
    anipExpire: "10/11/2026",
    joursAvantExpiration: 28,
    fiscalite: "EN RÈGLE (Quitus n°QF-2026-8819)",
    casierJudiciaire: "VIERGE (Bulletin n°3 certifié)",
    telephone: "97010203",
    statutDossierConcours: "ADMISSIBLE - En attente d'épreuve orale",
    numDossier: "FP-BJ-2026-9921"
  },
  "9876543210": {
    npi: "9876543210",
    nom: "TOKPON",
    prenom: "Amina",
    nomComplet: "Amina Tokpon",
    initiales: "AT",
    dateNaissance: "22/08/1997",
    lieuNaissance: "Cotonou (Littoral)",
    commune: "Cotonou 5ème",
    genre: "F",
    profession: "Comptable",
    photoEmoji: "👩🏾‍💼",
    anipValide: true,
    anipExpire: "15/06/2028",
    joursAvantExpiration: 620,
    fiscalite: "EN RÈGLE (Quitus n°QF-2026-1140)",
    casierJudiciaire: "VIERGE (Bulletin n°3 certifié)",
    telephone: "96123456",
    statutDossierConcours: "DOSSIER COMPLET - Validé X-Road",
    numDossier: "FP-BJ-2026-4402"
  },
  "5544332211": {
    npi: "5544332211",
    nom: "AGOSSOU",
    prenom: "Marcos",
    nomComplet: "Marcos Agossou",
    initiales: "MA",
    dateNaissance: "05/01/1988",
    lieuNaissance: "Porto-Novo (Ouémé)",
    commune: "Porto-Novo",
    genre: "M",
    profession: "Entrepreneur",
    photoEmoji: "👨🏾",
    anipValide: true,
    anipExpire: "20/09/2027",
    joursAvantExpiration: 340,
    fiscalite: "RÉGULARISATION REQUISE (Déclaration 2025 non soldée)",
    casierJudiciaire: "MENTION (Jugement civil TPI Porto-Novo 2021)",
    telephone: "95887766",
    statutDossierConcours: "BLOQUÉ - Régularisation fiscale requise",
    numDossier: "FP-BJ-2026-1014"
  }
};

// --- État Global de l'Application ---
const AppState = {
  currentCitizenId: "1029384756",
  isOfflineMode: false,
  ussdCurrentState: "IDLE", // IDLE, MAIN_MENU, STATUS, CONSENT, VOICE_INFO
  ussdInputBuffer: "",
  audioPlaying: false,
  currentAudioLang: "fon",
  paymentMethod: "mtn",
  impactCounter: {
    paperSaved: 12400000,
    tripsSavedKm: 38200000
  }
};

// Données audio et transcriptions par langue
const AUDIO_CONTENT = {
  fon: {
    title: "Message d'accueil & Demande de NPI (Fongbé)",
    duration: "0:14",
    transcript: "« Mi kwekwe do Pass Citoyen Bénin ji. Mi sɔ NPI mitɔn bo do # ji... »",
    translation: "« Bienvenue sur le Pass Citoyen Bénin. Veuillez composer votre NPI suivi de # pour accéder à vos services. »",
    synthSpeech: "Mi kwekwe do Pass Citoyen Bénin ji. Mi sɔ NPI mitɔn bo do dièse ji."
  },
  yoruba: {
    title: "E kaabo & Beere NPI (Yorùbá)",
    duration: "0:15",
    transcript: "« E kaabo si Pass Citoyen Bénin. E te nomba NPI yin pelu ami #... »",
    translation: "« Bienvenue sur le Pass Citoyen Bénin. Tapez votre numéro NPI suivi du signe # pour continuer. »",
    synthSpeech: "E kaabo si Pass Citoyen Benin. E te nomba NPI yin pelu ami dièse."
  },
  fr: {
    title: "Accueil & Guidage vocal (Français)",
    duration: "0:12",
    transcript: "« Bienvenue sur le Pass Citoyen Bénin. Veuillez composer votre numéro NPI suivi de la touche dièse... »",
    translation: "« Service vocal universel d'accès aux droits administratifs de la République du Bénin. »",
    synthSpeech: "Bienvenue sur le Pass Citoyen Bénin. Veuillez composer votre numéro NPI suivi de la touche dièse."
  }
};

// ==========================================================================
// 1. GESTION DE LA NAVIGATION PAR ONGLETS & SIDEBAR
// ==========================================================================
function initNavigation() {
  const navButtons = document.querySelectorAll(".sidebar-item, .nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      if (!targetTab) return;

      // Active / Inactive boutons
      navButtons.forEach(b => {
        if (b.getAttribute("data-tab") === targetTab) {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });

      // Affiche l'onglet ciblé
      tabContents.forEach(content => {
        if (content.id === `tab-${targetTab}`) {
          content.classList.remove("hidden");
          content.classList.add("active");
        } else {
          content.classList.add("hidden");
          content.classList.remove("active");
        }
      });

      // Remonter au début de la vue
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Sélecteur de citoyen
  const citizenSelector = document.getElementById("citizen-selector");
  if (citizenSelector) {
    citizenSelector.addEventListener("change", (e) => {
      AppState.currentCitizenId = e.target.value;
      updateCitizenContext();
    });
  }

  // Bouton Reset
  const btnReset = document.getElementById("btn-reset-demo");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      resetDemo();
    });
  }
}

// Mise à jour de tous les affichages dépendants du citoyen choisi
function updateCitizenContext() {
  const citizen = CITIZENS_DB[AppState.currentCitizenId];
  if (!citizen) return;

  // Formulaire P1
  const inputNpi = document.getElementById("input-npi");
  if (inputNpi) inputNpi.value = citizen.npi;

  // Carte Wallet P2
  const cardHolderName = document.getElementById("card-holder-name");
  const cardNpi = document.getElementById("card-npi");
  const walletCitizenName = document.getElementById("wallet-citizen-name");
  if (cardHolderName) cardHolderName.textContent = citizen.nomComplet;
  if (cardNpi) cardNpi.textContent = citizen.npi;
  if (walletCitizenName) walletCitizenName.textContent = citizen.nomComplet;

  renderWalletQRCode(citizen);

  // Téléphone Momo P4
  const momoPhone = document.getElementById("momo-phone");
  if (momoPhone) momoPhone.value = citizen.telephone;
}

// ==========================================================================
// 2. PILIER 1 : MOTEUR « DITES-LE-NOUS UNE FOIS » & FLUX X-ROAD
// ==========================================================================
function initPillarOne() {
  const btnSubmit = document.getElementById("btn-submit-procedure");
  const btnAutofill = document.getElementById("btn-p1-autofill");
  const btnVerifyNpi = document.getElementById("btn-verify-npi");

  if (btnSubmit) {
    btnSubmit.addEventListener("click", () => runXRoadWorkflow());
  }
  if (btnAutofill) {
    btnAutofill.addEventListener("click", () => {
      document.getElementById("input-npi").value = "1029384756";
      AppState.currentCitizenId = "1029384756";
      updateCitizenContext();
      runXRoadWorkflow();
    });
  }
  if (btnVerifyNpi) {
    btnVerifyNpi.addEventListener("click", () => {
      const npi = document.getElementById("input-npi").value.trim();
      if (CITIZENS_DB[npi]) {
        AppState.currentCitizenId = npi;
        updateCitizenContext();
      }
      runXRoadWorkflow();
    });
  }
}

function appendXRoadLog(text, type = "info") {
  const logsContainer = document.getElementById("xroad-logs");
  if (!logsContainer) return;

  const now = new Date();
  const timeStr = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");

  const colors = {
    info: "text-slate-400",
    success: "text-emerald-400 font-semibold",
    warning: "text-amber-400",
    error: "text-rose-400 font-semibold",
    system: "text-blue-400"
  };

  const line = document.createElement("div");
  line.className = `text-[11px] leading-relaxed ${colors[type] || colors.info}`;
  line.innerHTML = `<span class="text-slate-600">[${timeStr}]</span> ${text}`;
  logsContainer.appendChild(line);
  logsContainer.scrollTop = logsContainer.scrollHeight;
}

function runXRoadWorkflow() {
  const npi = document.getElementById("input-npi").value.trim();
  const citizen = CITIZENS_DB[npi] || {
    npi: npi,
    nomComplet: "Citoyen Inconnu",
    anipValide: true,
    fiscalite: "EN RÈGLE",
    casierJudiciaire: "VIERGE",
    statutDossierConcours: "VALIDÉ"
  };

  const btnAutofill = document.getElementById("btn-p1-autofill");
  const resultDiv = document.getElementById("procedure-result");

  if (btnAutofill) {
    btnAutofill.disabled = true;
    btnAutofill.classList.add("opacity-75");
  }

  // Nettoyage logs
  const logsContainer = document.getElementById("xroad-logs");
  logsContainer.innerHTML = "";
  
  appendXRoadLog(`Initialisation de la connexion X-Road...`, "info");

  setTimeout(() => {
    appendXRoadLog(`✓ Authentification du client : <span class="text-emerald-400 font-bold">réussie</span>`, "success");
  }, 500);

  setTimeout(() => {
    appendXRoadLog(`✓ Vérification du consentement : <span class="text-emerald-400 font-bold">validé</span>`, "success");
  }, 1000);

  setTimeout(() => {
    appendXRoadLog(`➔ Interrogation des registres :`, "system");
    appendXRoadLog(`&nbsp;&nbsp;• INSAE / ANIP (${citizen.nomComplet}) ... <span class="text-emerald-400 font-bold">OK</span>`, "info");
    appendXRoadLog(`&nbsp;&nbsp;• DGFIP (Quittance fiscale) ... <span class="text-emerald-400 font-bold">OK</span>`, "info");
    appendXRoadLog(`&nbsp;&nbsp;• CNSS (Affiliation) ... <span class="text-emerald-400 font-bold">OK</span>`, "info");
    appendXRoadLog(`&nbsp;&nbsp;• Casier judiciaire ... <span class="text-emerald-400 font-bold">OK</span>`, "info");
  }, 1600);

  setTimeout(() => {
    appendXRoadLog(`✓ Données récupérées et validées`, "success");
  }, 2200);

  setTimeout(() => {
    appendXRoadLog(`➔ Transmission à l'application métier...`, "system");
  }, 2700);

  setTimeout(() => {
    appendXRoadLog(`✓ Opération terminée avec succès`, "success");

    if (btnAutofill) {
      btnAutofill.disabled = false;
      btnAutofill.classList.remove("opacity-75");
    }

    if (resultDiv) {
      resultDiv.classList.remove("hidden");
      resultDiv.className = "p-4 rounded-2xl border border-emerald-200 bg-[#f0fdf4] text-emerald-900 space-y-1.5";
      resultDiv.innerHTML = `
        <div class="flex items-center gap-2 font-bold text-emerald-700 text-xs">
          <span class="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
          <span>Candidature Validée Instantanément !</span>
        </div>
        <p class="text-[11px] text-slate-600">
          Toutes les pièces requises ont été certifiées en direct via l'infrastructure souveraine X-Road. 
          <strong>Zéro déplacement en mairie, zéro frais de photocopie certifiée.</strong>
        </p>
      `;
    }

    playValidationBeep();
  }, 3200);
}

// ==========================================================================
// 3. PILIER 2 : PORTEFEUILLE MOBILE & SCAN HORS-LIGNE
// ==========================================================================
function initPillarTwo() {
  const toggleOffline = document.getElementById("toggle-airplane-mode");
  const btnScan = document.getElementById("btn-scan-qr");

  if (toggleOffline) {
    toggleOffline.addEventListener("click", () => {
      AppState.isOfflineMode = !AppState.isOfflineMode;
      const dot = document.getElementById("airplane-status-dot");
      const text = document.getElementById("airplane-status-text");
      const phoneSignal = document.getElementById("phone-signal-icon");

      if (AppState.isOfflineMode) {
        dot.className = "w-2 h-2 rounded-full bg-amber-400 animate-pulse";
        text.textContent = "Mode Avion (0% Réseau)";
        text.className = "text-amber-400 font-bold";
        if (phoneSignal) phoneSignal.textContent = "✈️ Hors-ligne";
      } else {
        dot.className = "w-2 h-2 rounded-full bg-emerald-400";
        text.textContent = "Connecté (4G)";
        text.className = "text-slate-300 font-bold";
        if (phoneSignal) phoneSignal.textContent = "📶 4G";
      }
    });
  }

  if (btnScan) {
    btnScan.addEventListener("click", () => runOfflineScanSimulation());
  }

  // Rendu initial QR Code
  const citizen = CITIZENS_DB[AppState.currentCitizenId];
  if (citizen) renderWalletQRCode(citizen);
}

// Générateur SVG d'un QR code stylisé 2D-Doc
function renderWalletQRCode(citizen) {
  const container = document.getElementById("wallet-qr-code");
  if (!container) return;

  // Matrice 2D factice esthétique représentant un QR code 2D-Doc haute densité
  const size = 64;
  container.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="25" height="25" fill="white"/>
      <!-- Coins répères standard QR -->
      <rect x="2" y="2" width="7" height="7" fill="black"/>
      <rect x="3" y="3" width="5" height="5" fill="white"/>
      <rect x="4" y="4" width="3" height="3" fill="black"/>
      
      <rect x="16" y="2" width="7" height="7" fill="black"/>
      <rect x="17" y="3" width="5" height="5" fill="white"/>
      <rect x="18" y="4" width="3" height="3" fill="black"/>

      <rect x="2" y="16" width="7" height="7" fill="black"/>
      <rect x="3" y="17" width="5" height="5" fill="white"/>
      <rect x="4" y="18" width="3" height="3" fill="black"/>

      <!-- Modules de données simulant 2D-Doc béninois -->
      <rect x="10" y="3" width="2" height="2" fill="black"/>
      <rect x="13" y="3" width="1" height="2" fill="black"/>
      <rect x="10" y="7" width="4" height="1" fill="black"/>
      <rect x="11" y="11" width="3" height="3" fill="black"/>
      <rect x="16" y="11" width="2" height="1" fill="black"/>
      <rect x="20" y="11" width="3" height="2" fill="black"/>
      <rect x="10" y="16" width="2" height="3" fill="black"/>
      <rect x="14" y="17" width="3" height="2" fill="black"/>
      <rect x="19" y="16" width="4" height="2" fill="black"/>
      <rect x="11" y="21" width="3" height="2" fill="black"/>
      <rect x="16" y="21" width="2" height="2" fill="black"/>
      <rect x="21" y="20" width="2" height="3" fill="black"/>
    </svg>
  `;
}

function runOfflineScanSimulation() {
  const citizen = CITIZENS_DB[AppState.currentCitizenId];
  const scanBadge = document.getElementById("scan-badge");
  const scanDetails = document.getElementById("scan-details");
  const scanCard = document.getElementById("scan-result-card");

  scanBadge.className = "px-2 py-0.5 text-xs font-bold rounded-full bg-blue-500 text-white animate-pulse";
  scanBadge.textContent = "Décodage optique...";

  scanDetails.innerHTML = `
    <p class="text-blue-400">Capture du flux optique 2D-Doc en cours...</p>
    <p class="text-slate-500">Extraction du payload cryptographique ED25519...</p>
  `;

  setTimeout(() => {
    scanCard.className = "p-4 rounded-xl border border-emerald-500/60 bg-emerald-950/40 space-y-3";
    scanBadge.className = "px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-slate-950 font-mono";
    scanBadge.textContent = AppState.isOfflineMode ? "CERTIFIÉ (100% HORS-LIGNE)" : "CERTIFIÉ CONFORME";

    scanDetails.innerHTML = `
      <div class="space-y-1.5 text-xs">
        <div class="flex justify-between border-b border-emerald-800/60 pb-1">
          <span class="text-slate-400">Titulaire :</span>
          <span class="text-white font-bold">${citizen.nomComplet}</span>
        </div>
        <div class="flex justify-between border-b border-emerald-800/60 pb-1">
          <span class="text-slate-400">NPI officiel :</span>
          <span class="text-emerald-400 font-mono font-bold">${citizen.npi}</span>
        </div>
        <div class="flex justify-between border-b border-emerald-800/60 pb-1">
          <span class="text-slate-400">Date & Lieu de Naissance :</span>
          <span class="text-slate-200">${citizen.dateNaissance} à ${citizen.lieuNaissance}</span>
        </div>
        <div class="flex justify-between border-b border-emerald-800/60 pb-1">
          <span class="text-slate-400">Signature d'autorité :</span>
          <span class="text-emerald-300 font-mono text-[10px]">VERIFIED (ANIP Root Key 2026)</span>
        </div>
        <div class="flex justify-between pt-1">
          <span class="text-slate-400">Connexion Internet utilisée :</span>
          <span class="text-amber-400 font-mono font-bold">${AppState.isOfflineMode ? "AUCUNE (Clé publique locale)" : "Non requise"}</span>
        </div>
      </div>
    `;

    // Audio beep de validation
    playValidationBeep();
  }, 1000);
}

// ==========================================================================
// 4. PILIER 3 : INCLUSION USSD & VOCAL (DERNIER KILOMÈTRE)
// ==========================================================================
function initPillarThree() {
  const ussdScreen = document.getElementById("ussd-screen-content");
  const ussdInput = document.getElementById("ussd-input");
  const ussdSendBtn = document.getElementById("ussd-send-btn");
  const btnDial = document.getElementById("btn-ussd-dial");
  const btnHangup = document.getElementById("btn-ussd-hangup");
  const keypadButtons = document.querySelectorAll(".keypad-btn");
  const quickTestButtons = document.querySelectorAll(".ussd-quick-test");

  // Clavier touches
  keypadButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-key");
      ussdInput.value += key;
      playKeyTone();
    });
  });

  // Bouton Appel
  if (btnDial) {
    btnDial.addEventListener("click", () => {
      const code = ussdInput.value.trim();
      if (code === "*130#" || code === "") {
        showUssdMainMenu();
      } else if (code === "*130*1#") {
        showUssdStatus();
      } else if (code === "*130*2#") {
        showUssdConsent();
      } else {
        ussdScreen.textContent = `Exécution du code : ${code}...\nService non reconnu.\nComposer *130#`;
      }
      ussdInput.value = "";
    });
  }

  // Bouton Raccrocher
  if (btnHangup) {
    btnHangup.addEventListener("click", () => {
      AppState.ussdCurrentState = "IDLE";
      ussdScreen.textContent = "Composer *130# puis appuyer sur [APPEL]";
      ussdInput.value = "";
    });
  }

  // Validation USSD
  if (ussdSendBtn) {
    ussdSendBtn.addEventListener("click", () => handleUssdResponse());
  }
  if (ussdInput) {
    ussdInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleUssdResponse();
    });
  }

  // Raccourcis test rapide jury
  quickTestButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const ussd = btn.getAttribute("data-ussd");
      ussdInput.value = ussd;
      btnDial.click();
    });
  });

  // Gestion Voix
  initVoiceSystem();
}

function showUssdMainMenu() {
  AppState.ussdCurrentState = "MAIN_MENU";
  const citizen = CITIZENS_DB[AppState.currentCitizenId];
  const screen = document.getElementById("ussd-screen-content");
  screen.textContent = 
`--- PASS CITOYEN BENIN ---
Bienvenue ${citizen.prenom}
1. Suivre mon dossier
2. Valider un consentement
3. Demander une quittance
4. Changer de langue
0. Quitter`;
}

function showUssdStatus() {
  AppState.ussdCurrentState = "STATUS";
  const citizen = CITIZENS_DB[AppState.currentCitizenId];
  const screen = document.getElementById("ussd-screen-content");
  screen.textContent = 
`[DOSSIER CONCOURS]
Ref: ${citizen.numDossier}
NPI: ${citizen.npi}
Statut: ${citizen.statutDossierConcours}
Piece expirante: CIP (${citizen.joursAvantExpiration}j)
1. Recevoir SMS recap
0. Menu precedent`;
}

function showUssdConsent() {
  AppState.ussdCurrentState = "CONSENT";
  const screen = document.getElementById("ussd-screen-content");
  screen.textContent = 
`[DEMANDE DE PARTAGE]
Min. Travail sollicite
votre dossier ANIP & DGI.
Tapez votre code PIN (4 chiffres)
pour autoriser le partage :`;
}

function handleUssdResponse() {
  const input = document.getElementById("ussd-input");
  const screen = document.getElementById("ussd-screen-content");
  const val = input.value.trim();
  input.value = "";

  if (AppState.ussdCurrentState === "MAIN_MENU") {
    if (val === "1") showUssdStatus();
    else if (val === "2") showUssdConsent();
    else if (val === "3") {
      screen.textContent = "Quittance TrésorPay #TP-8842 envoyée par SMS au 97010203.\n0. Retour";
    } else if (val === "4") {
      screen.textContent = "1. Fongbe\n2. Yoruba\n3. Bariba\n4. Francais\n0. Retour";
    } else if (val === "0") {
      document.getElementById("btn-ussd-hangup").click();
    } else {
      screen.textContent = "Option invalide.\nTapez 1, 2, 3 ou 0.";
    }
  } else if (AppState.ussdCurrentState === "CONSENT") {
    if (val.length >= 4) {
      screen.textContent = `CONSENTEMENT VALIDE !\nJeton transmis via X-Road à l'administration.\nDossier débloqué.\nAppuyez sur 0 pour quitter.`;
      playValidationBeep();
    } else {
      screen.textContent = "Code PIN invalide.\nTapez votre PIN à 4 chiffres.";
    }
  } else if (AppState.ussdCurrentState === "STATUS") {
    if (val === "1") {
      screen.textContent = "SMS officiel envoyé avec succès !\nMerci d'utiliser le Pass Citoyen.";
    } else {
      showUssdMainMenu();
    }
  }
}

// Système audio multilingue
function initVoiceSystem() {
  const langBtns = document.querySelectorAll(".lang-selector-btn");
  const btnPlay = document.getElementById("btn-play-voice");
  const btnStop = document.getElementById("btn-stop-voice");

  langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      langBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.currentAudioLang = btn.getAttribute("data-lang");
      updateAudioDisplay();
    });
  });

  if (btnPlay) {
    btnPlay.addEventListener("click", () => playVoiceSimulation());
  }
  if (btnStop) {
    btnStop.addEventListener("click", () => stopVoiceSimulation());
  }

  updateAudioDisplay();
}

function updateAudioDisplay() {
  const data = AUDIO_CONTENT[AppState.currentAudioLang];
  if (!data) return;

  document.getElementById("audio-scenario-title").textContent = data.title;
  document.getElementById("audio-duration").textContent = data.duration;
  document.getElementById("audio-transcript-text").textContent = data.transcript;
  document.getElementById("audio-translation-text").textContent = "Traduction : " + data.translation;
}

function playVoiceSimulation() {
  const data = AUDIO_CONTENT[AppState.currentAudioLang];
  const btnPlay = document.getElementById("btn-play-voice");
  const playText = document.getElementById("voice-play-text");
  const playIcon = document.getElementById("voice-play-icon");
  const voiceStatus = document.getElementById("voice-status");

  AppState.audioPlaying = true;
  playIcon.textContent = "🔊";
  playText.textContent = "Lecture en cours...";
  voiceStatus.textContent = "Diffusion audio...";
  voiceStatus.className = "text-[11px] text-amber-400 font-semibold flex-1 text-right";

  // Utilisation de la synthèse vocale Web Speech API si disponible
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(data.synthSpeech);
    utterance.lang = AppState.currentAudioLang === "fr" ? "fr-FR" : "fr-FR";
    utterance.rate = 0.95;
    utterance.onend = () => stopVoiceSimulation();
    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(() => stopVoiceSimulation(), 5000);
  }
}

function stopVoiceSimulation() {
  AppState.audioPlaying = false;
  const playText = document.getElementById("voice-play-text");
  const playIcon = document.getElementById("voice-play-icon");
  const voiceStatus = document.getElementById("voice-status");

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  if (playIcon) playIcon.textContent = "▶️";
  if (playText) playText.textContent = "Écouter l'invite vocale";
  if (voiceStatus) {
    voiceStatus.textContent = "Prêt";
    voiceStatus.className = "text-[11px] text-slate-500 flex-1 text-right";
  }
}

// ==========================================================================
// 5. PILIER 4 : AGENT PROACTIF & TRÉSORPAY
// ==========================================================================
function initPillarFour() {
  const btnTrigger = document.getElementById("btn-trigger-proactive-alert");
  const btnRenew = document.getElementById("btn-quick-renew");
  const btnPay = document.getElementById("btn-pay-tresorpay");
  const paymentCards = document.querySelectorAll(".payment-method-card");

  if (btnTrigger) {
    btnTrigger.addEventListener("click", () => {
      const waReply = document.getElementById("whatsapp-reply");
      waReply.classList.add("hidden");
      alert("Alerte proactive envoyée par SMS et WhatsApp au citoyen !");
    });
  }

  if (btnRenew) {
    btnRenew.addEventListener("click", () => {
      // Défilement automatique vers le guichet TrésorPay
      const tresorpaySection = document.getElementById("btn-pay-tresorpay");
      tresorpaySection.scrollIntoView({ behavior: "smooth", block: "center" });
      tresorpaySection.classList.add("ring-4", "ring-teal-400");
      setTimeout(() => tresorpaySection.classList.remove("ring-4", "ring-teal-400"), 1500);
    });
  }

  paymentCards.forEach(card => {
    card.addEventListener("click", () => {
      paymentCards.forEach(c => {
        c.classList.remove("active");
        c.style.borderColor = "";
        c.style.backgroundColor = "";
      });
      card.classList.add("active");
      AppState.paymentMethod = card.getAttribute("data-method");
    });
  });

  if (btnPay) {
    btnPay.addEventListener("click", () => runTresorPayTransaction());
  }
}

function runTresorPayTransaction() {
  const btnPay = document.getElementById("btn-pay-tresorpay");
  const btnText = document.getElementById("pay-btn-text");
  const btnIcon = document.getElementById("pay-btn-icon");
  const receipt = document.getElementById("tresorpay-receipt");
  const waReply = document.getElementById("whatsapp-reply");
  const citizen = CITIZENS_DB[AppState.currentCitizenId];

  btnPay.disabled = true;
  btnPay.classList.add("opacity-75");
  btnIcon.textContent = "⏳";
  btnText.textContent = "Traitement sécurisé TrésorPay...";

  setTimeout(() => {
    btnPay.disabled = false;
    btnPay.classList.remove("opacity-75");
    btnIcon.textContent = "💳";
    btnText.textContent = "Confirmer le paiement de 2 800 FCFA";

    const refQuittance = "TP-BJ-2026-" + Math.floor(1000 + Math.random() * 9000);
    receipt.classList.remove("hidden");
    receipt.innerHTML = `
      <div class="flex items-center justify-between text-xs border-b border-emerald-900 pb-2">
        <span class="text-emerald-400 font-bold">✅ Paiement TrésorPay Confirmé</span>
        <span class="font-mono text-slate-400 text-[10px]">${refQuittance}</span>
      </div>
      <div class="text-xs text-slate-300 space-y-1">
        <p>Montant débité : <strong class="text-white">2 800 FCFA</strong> via ${AppState.paymentMethod.toUpperCase()}</p>
        <p>Bénéficiaire : <strong>ANIP (Fonds de sécurisation des titres)</strong></p>
        <p>Validité du CIP prolongée automatiquement jusqu'au : <strong class="text-emerald-400">10/11/2031</strong></p>
      </div>
    `;

    waReply.classList.remove("hidden");
    playValidationBeep();

    // Actualiser le portefeuille du citoyen
    citizen.anipExpire = "10/11/2031";
    citizen.joursAvantExpiration = 1825;
    const cardHolder = document.getElementById("card-holder-name");
    if (cardHolder) {
      document.querySelector("#card-npi").parentElement.nextElementSibling.innerHTML = 
        `Validité : <span class="text-emerald-400 font-bold">11/2031 (Prolongé)</span>`;
    }
  }, 1600);
}

// ==========================================================================
// 6. PILIER 5 : IMPACT & RESET
// ==========================================================================
function updateImpactDisplay() {
  const statPaper = document.getElementById("stat-paper");
  const statTrips = document.getElementById("stat-trips");
  if (statPaper) statPaper.textContent = (AppState.impactCounter.paperSaved / 1000000).toFixed(1) + "M";
  if (statTrips) statTrips.textContent = (AppState.impactCounter.tripsSavedKm / 1000000).toFixed(1) + "M km";
}

function resetDemo() {
  AppState.currentCitizenId = "1029384756";
  AppState.isOfflineMode = false;
  const citizenSelector = document.getElementById("citizen-selector");
  if (citizenSelector) citizenSelector.value = "1029384756";
  
  updateCitizenContext();
  
  const procedureResult = document.getElementById("procedure-result");
  if (procedureResult) procedureResult.classList.add("hidden");

  const scanCard = document.getElementById("scan-result-card");
  const scanBadge = document.getElementById("scan-badge");
  const scanDetails = document.getElementById("scan-details");
  if (scanCard) scanCard.className = "p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3";
  if (scanBadge) {
    scanBadge.className = "px-2 py-0.5 text-xs font-bold rounded-full bg-slate-800 text-slate-400";
    scanBadge.textContent = "En attente de scan";
  }
  if (scanDetails) {
    scanDetails.innerHTML = `<p>// Pointez la caméra sur le QR Code ou cliquez sur « Scanner ».</p>`;
  }

  const receipt = document.getElementById("tresorpay-receipt");
  if (receipt) receipt.classList.add("hidden");
  const waReply = document.getElementById("whatsapp-reply");
  if (waReply) waReply.classList.add("hidden");

  alert("Démonstration réinitialisée ! Tous les scénarios sont prêts pour le jury.");
}

// Bips et retours sonores Web Audio (synthétiseur intégré sans fichier externe)
function playKeyTone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(697, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Audio context ignoré si non supporté
  }
}

function playValidationBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    // Ignoré
  }
}

// Initialisation globale au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initPillarOne();
  initPillarTwo();
  initPillarThree();
  initPillarFour();
  updateCitizenContext();
});
