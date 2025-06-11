import React, { useState, useRef, useEffect, useCallback} from 'react';
import './App.css';
import logo from './assets/logo.png'; // Assicurati che il percorso sia corretto
import horse from './assets/horse.png';     // Assicurati che il percorso sia corretto

const cavalliIniziali = [
  { nome: 'EDEN', colore: '#28a745' },         // Verde smeraldo
  { nome: 'STORM', colore: '#ffc107' },      // Giallo ambra
  { nome: 'SKY BLUE', colore: '#7bed9f' },        // Azzurro intenso
  { nome: 'ALEXANDER', colore: '#fd7e14' },       // Arancione vivace
  { nome: 'RED RUM', colore: '#3f51b5' },        // Blu vivo
  { nome: 'SCACCO MATTO', colore: '#dc3545' },  // Rosso acceso
  { nome: 'DRAGO', colore: '#6f42c1' },         // Viola brillante
  { nome: 'ASTRO', colore: '#f78fb3' },          // Rosa delicato
  { nome: 'SAETTA', colore: '#f8f9fa' },       // Bianco ghiaccio
  { nome: 'PEGASO', colore: '#ffd700' },        // Oro classico
  { nome: 'NERONE', colore: '#343a40' },        // Grigio antracite
  { nome: 'TUONO', colore: '#17a2b8' },         // Verde menta (corretto un errore di hash doppio nel colore)
  { nome: 'OMBRA', colore: '#6c757d' },         // Grigio neutro
  { nome: 'VENTO', colore: '#74b9ff' },         // Celeste tenue
  { nome: 'TITANO', colore: '#a0522d' },        // Marrone seppia
  { nome: 'GOLIATH', colore: '#ced4da' },       // Argento chiaro
  { nome: 'LUNA', colore: '#007bff' },         // Blu indaco
  { nome: 'COMETA', colore: '#6610f2' },        // Viola profondo
  { nome: 'FENICE', colore: '#e83e8c' },        // Rosa fuoco
  { nome: 'ZEFIRO', colore: '#20c997' }         // Verde acqua
];


function App() {
  // Dichiarazione degli stati
  const [nome, setNome] = useState('MARIO');
  const [cognome, setCognome] = useState('ZARRELLA'); // Nuovo stato per il cognome
  const [saldo, setSaldo] = useState(1000);
  const [giocata, setGiocata] = useState('');
  const [cavalloSelezionato, setCavalloSelezionato] = useState('SCACCO MATTO');
  const [cavalliGara, setCavalliGara] = useState(cavalliIniziali.slice(0, 8));
  const [mostraPaginaScommessa, setMostraPaginaScommessa] = useState(true);
  const [winner, setWinner] = useState('');

  const [esitoDesiderato, setEsitoDesiderato] = useState(null);
  const [erroreInput, setErroreInput] = useState('');
  const [mostraMessaggioConferma, setMostraMessaggioConferma] = useState(false);
  const [mostraMessaggioEsito, setMostraMessaggioEsito] = useState(false);
  const [mostraModaleAltro, setMostraModaleAltro] = useState(false);
  const [tempNome, setTempNome] = useState(nome);
  const [tempCognome, setTempCognome] = useState(cognome); // Nuovo stato temporaneo per il cognome
  const [tempSaldo, setTempSaldo] = useState(saldo);
  const [tempNumeroCavalli, setTempNumeroCavalli] = useState(cavalliGara.length);
  const [tempEsito, setTempEsito] = useState(esitoDesiderato === null ? 'casuale' : esitoDesiderato ? 'si' : 'no');

  const puntataRef = useRef(null); // Ref per memorizzare la puntata

  // useEffect per inizializzare o aggiornare la giocata in base al saldo
  useEffect(() => {
    setGiocata(saldo.toString());
  }, [saldo]);

  // Funzione per eseguire la logica dell'esito della gara
  // Ora avvolta in useCallback per garantire stabilità come dipendenza di altri hook.
  const eseguiEsito = useCallback(() => {
    let cavalli = [...cavalliGara]; // Crea una copia per evitare modifiche dirette allo stato

    if (esitoDesiderato === true) {
      // Se l'esito desiderato è vittoria per 'SCACCO MATTO'
      cavalli = [
        cavalli.find(c => c.nome === 'SCACCO MATTO'),
        ...cavalli.filter(c => c.nome !== 'SCACCO MATTO')
      ];
    } else if (esitoDesiderato === false) {
      // Se l'esito desiderato è sconfitta per 'SCACCO MATTO'
      const altri = cavalli.filter(c => c.nome !== 'SCACCO MATTO');
      // Inserisce 'SCACCO MATTO' in una posizione casuale (non la prima)
      const pos = Math.floor(Math.random() * altri.length) + 1; // +1 per evitare la prima posizione
      altri.splice(pos, 0, cavalli.find(c => c.nome === 'SCACCO MATTO'));
      cavalli = altri;
    } else {
      // Esito casuale: mescola i cavalli
      cavalli.sort(() => Math.random() - 0.5);
    }

    const vincitore = cavalli[0].nome; // Il primo cavallo nell'array è il vincitore
    setWinner(vincitore); // Imposta il vincitore
    const haVinto = vincitore === cavalloSelezionato; // Verifica se il cavallo selezionato ha vinto
    const puntata = puntataRef.current ?? 0; // Recupera la puntata dal ref

    if (haVinto) {
      setSaldo(prev => prev + puntata * 2); // Raddoppia la puntata in caso di vittoria
    }

    // Chiamiamo direttamente il setter invece di una funzione wrapper, semplificando.
    setMostraMessaggioEsito(true);
  }, [
    cavalliGara,           // Dipende dallo stato dei cavalli in gara
    esitoDesiderato,       // Dipende dall'opzione di esito truccato
    cavalloSelezionato,    // Dipende dal cavallo scelto dal giocatore
    puntataRef,            // Dipende dal ref della puntata
    setWinner,             // Setter di stato (stabile)
    setSaldo,              // Setter di stato (stabile)
    setMostraMessaggioEsito// Setter di stato (stabile)
  ]);


  // Funzione handleScommetti: avvolta in useCallback per ottimizzazione.
  // Gestisce la logica quando l'utente piazza una scommessa.
  const handleScommetti = useCallback(() => {
    const puntata = parseInt(giocata);
    setErroreInput('');

    if (!puntata || puntata <= 0 || puntata > saldo) {
      setErroreInput('Importo non valido');
      return;
    }

    puntataRef.current = puntata;
    setSaldo(prevSaldo => prevSaldo - puntata);
    setMostraMessaggioConferma(true);
  }, [giocata, saldo]);

  // Funzione handleChiudiMessaggio: avvolta in useCallback per ottimizzazione.
  // Gestisce la chiusura del messaggio di conferma e l'avvio della gara.
  const handleChiudiMessaggio = useCallback(() => {
    setMostraPaginaScommessa(false);
    setMostraMessaggioConferma(false);
    setMostraMessaggioEsito(true);
    if (puntataRef.current) {
      eseguiEsito(); // Avvia la logica dell'esito
    }
  }, [eseguiEsito]); // Ora 'eseguiEsito' è una dipendenza stabile grazie a useCallback

  // Funzione handleScommettiDiNuovo: avvolta in useCallback per ottimizzazione.
  // Prepara l'interfaccia per una nuova scommessa.
  const handleScommettiDiNuovo = useCallback(() => {
    setMostraPaginaScommessa(true);
    setMostraMessaggioEsito(false);
    setGiocata(saldo.toString()); // Pre-popola la giocata con il saldo attuale
  }, [saldo]); // saldo è una dipendenza

  //  // Funzione handleReset: reimposta il gioco allo stato iniziale.
       // Avvolta in useCallback per stabilità nelle dipendenze dell'useEffect.
       const handleReset = useCallback(() => {
         setSaldo(1000);
         setNome('MARIO');
         setCognome('ZARRELLA'); // Reimposta il cognome
         setGiocata('1000'); // Imposta la giocata iniziale al saldo predefinito
         setCavalloSelezionato('SCACCO MATTO');
         setWinner('');
         setMostraPaginaScommessa(true);
         setMostraMessaggioConferma(false);
         setMostraMessaggioEsito(false);
         setErroreInput('');
         puntataRef.current = null;
         setEsitoDesiderato(null);
         setCavalliGara(cavalliIniziali.slice(0, 8));
       }, []); // Nessuna dipendenza per handleReset, è una funzione stabile



  // Funzione handleAltro: prepara i valori per il modale "Altro" e lo mostra.
  const handleAltro = () => {
    setTempNome(nome);
    setTempCognome(cognome); // Imposta il cognome temporaneo
    setTempSaldo(saldo);
    setTempNumeroCavalli(cavalliGara.length);
    setTempEsito(esitoDesiderato === null ? 'casuale' : esitoDesiderato ? 'si' : 'no');
    setMostraModaleAltro(true);
  };

  // Funzione confermaModaleAltro: applica le impostazioni dal modale "Altro".
  const confermaModaleAltro = () => {
    setNome(tempNome.toUpperCase());
    setCognome(tempCognome.toUpperCase()); // Imposta il cognome dal valore temporaneo
    setSaldo(Number(tempSaldo));
    setGiocata(tempSaldo.toString());
    setCavalliGara(cavalliIniziali.slice(0, Number(tempNumeroCavalli)));

    if (tempEsito === 'si') setEsitoDesiderato(true);
    else if (tempEsito === 'no') setEsitoDesiderato(false);
    else setEsitoDesiderato(null);

    setMostraModaleAltro(false);
  };


  // useEffect per gestire gli eventi della tastiera (Enter e Spacebar)
  // useEffect per gestire gli eventi della tastiera (Enter, Spacebar, R)
   useEffect(() => {
     const handleKeyDown = (e) => {
       // Prioritizza la chiusura del modale di conferma
       if (mostraMessaggioConferma) {
         if (e.key === 'Enter' || e.key === ' ') {
           e.preventDefault(); // Previene lo scroll per la barra spaziatrice
           handleChiudiMessaggio();
         }
         return; // Interrompe l'esecuzione se il modale è attivo
       }

       // Gestisce il tasto 'R' per il reset (case-insensitive)
       // Assicurati che l'elemento attivo NON sia un input o una textarea
       if ((e.key === 'r' || e.key === 'R') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
         e.preventDefault(); // Previene il comportamento predefinito del browser
         handleReset();
         return; // Interrompe l'esecuzione dopo il reset
       }

       // Gestisce le interazioni generali di gioco (Enter/Space)
       // Solo se l'elemento attivo NON è un input o una textarea
       if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
         if (e.key === ' ') {
           e.preventDefault(); // Previene lo scroll per la barra spaziatrice
         }

         if (mostraPaginaScommessa) {
           handleScommetti();
         } else if (mostraMessaggioEsito) {
           handleScommettiDiNuovo();
         }
       }
     };

     window.addEventListener('keydown', handleKeyDown); // Aggiunge l'event listener

     // Funzione di pulizia: rimuove l'event listener quando il componente si smonta
     return () => {
       window.removeEventListener('keydown', handleKeyDown);
     };
   }, [
     handleScommetti,
     handleChiudiMessaggio,
     handleScommettiDiNuovo,
     handleReset, // Aggiunto handleReset alle dipendenze
     mostraPaginaScommessa,
     mostraMessaggioConferma,
     mostraMessaggioEsito
   ]); // Dipendenze: l'effetto si riesegue solo se una di queste cambia


  // Funzione per renderizzare i cavalli in gara (componente separato per chiarezza)
  const renderCavalli = () => {
    return (
      <div className="cavalli">
        {cavalliGara.map((cavallo, i) => (
          <div
            key={i}
            className="cavallo-card"
            onClick={() => setCavalloSelezionato(cavallo.nome)}
            style={{ border: cavalloSelezionato === cavallo.nome ? '3px solid orange' : 'none' }}
          >
            <img src={horse} alt={`Cavallo ${cavallo.nome}`} style={{ width: '40px', height: '40px' }} />
            <div className="barra" style={{ backgroundColor: cavallo.colore }}></div>
            <div className="nome-cavallo">{cavallo.nome}</div>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div>
      <header>
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo" />
        </div>
      </header>
      <div className="spacer"></div>

      {mostraPaginaScommessa && (
        <>
          <p className="benvenuto">
            Benvenuto <span className="highlight"><strong>{nome} {cognome}</strong></span><br />
            Il tuo saldo attuale è: <span className="saldo"><strong>{saldo}€</strong></span><br />
            <span className="sottotesto">
              Inizia a scommettere...
            </span>
          </p>

          {renderCavalli()}

          <div className="giocata">
            <div className="giocata-input-wrapper">
              <h2 className="giocata-titolo">Quanto vuoi puntare: €</h2>
              <input
                type="number"
                className="input-importo"
                placeholder="Inserisci Quota"
                value={giocata}
                onChange={(e) => setGiocata(e.target.value)}
                disabled={mostraMessaggioConferma}
                min="1"
                max={saldo}
              />
              {erroreInput && <div className="errore-input" style={{ color:'red', marginTop:'5px' }}>{erroreInput}</div>}
            </div>
            <div className="bottoni-colonna">
              <button className="btn-blu" onClick={handleScommetti} disabled={mostraMessaggioConferma}>Scommetti</button>
            </div>

            <div className="bottoni-riga">
              <button className="btn-reset" onClick={handleReset} disabled={mostraMessaggioConferma}>Reset</button>
              <button className="altro-btn" onClick={handleAltro} disabled={mostraMessaggioConferma}>Altro</button>
            </div>

            {mostraModaleAltro && (
              <div className="messaggio-conferma">
                <div className="contenuto-messaggio">
                  <h2>Impostazioni Giocatore</h2>

                  <div>
                    <label>Nome: </label>
                    <input type="text"  className="input-importo" value={tempNome} onChange={(e) => setTempNome(e.target.value)} />
                  </div>

                  {/* Nuovo campo per il cognome */}
                  <div>
                    <label>Cognome: </label>
                    <input type="text"  className="input-importo" value={tempCognome} onChange={(e) => setTempCognome(e.target.value)} />
                  </div>

                  <div>
                    <label>Saldo iniziale:</label>
                    <input type="number"  className="input-importo" value={tempSaldo} onChange={(e) => setTempSaldo(e.target.value)} />
                  </div>

                  <label>Numero cavalli in gara:</label>
                  <div>
                    {[8, 12, 16, 18, 20].map(n => (
                      <label key={n} style={{ marginRight: '10px' }}>
                        <input
                          type="radio"
                          name="numeroCavalli"
                          value={n}
                          checked={Number(tempNumeroCavalli) === n}
                          onChange={() => setTempNumeroCavalli(n)}
                        /> {n}
                      </label>
                    ))}
                  </div>

                  <label>SCACCO MATTO deve vincere?</label>
                  <div>
                    {['si', 'no', 'casuale'].map(val => (
                      <label key={val} style={{ marginRight: '10px' }}>
                        <input
                          type="radio"
                          name="esitoScacco"
                          value={val}
                          checked={tempEsito === val}
                          onChange={() => setTempEsito(val)}
                        /> {val}
                      </label>
                    ))}
                  </div>

                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button className="btn-verde" onClick={confermaModaleAltro}>Conferma</button>
                    <button className="btn-reset" onClick={() => setMostraModaleAltro(false)}>Annulla</button>
                  </div>
                </div>
              </div>
            )}

            {mostraMessaggioConferma && (
              <div className="messaggio-conferma">
                <div className="contenuto-messaggio">
                  <span className="titolo-messaggio">Complimenti {nome}!</span>
                  <p>
                    La tua scommessa è stata registrata correttamente.<br />
                    Hai scommesso sul cavallo <span>{cavalloSelezionato}</span> <br />
                    alla cifra di <span>{puntataRef.current}€</span>.<br /><br />
                    <span>EQUISPRINT8</span> ti invita a ricordare di giocare responsabilmente.
                  </p>
                  <div className="contenitore-bottone">
                    <button
                      className="btn-chiudi"
                      onClick={handleChiudiMessaggio}
                      >Chiudi
                    </button>
                  </div>
                </div>
              </div>
            )}
            <br />
          </div>
        </>
      )}


      {mostraMessaggioEsito && (
        <div className="esito-container">

          {/* MESSAGGIO DI ESITO */}
          <span className="titolo-span-esito"><strong>
            {winner === cavalloSelezionato ? `COMPLIMENTI ${nome}!` : `HAI PERSO TUTTO ${nome}`}
          </strong></span>

          <p className="messaggio-esito">
            {winner === cavalloSelezionato ? (
              <>Hai vinto <span className="messaggio-esito-testo">{puntataRef.current * 2}€</span> scommettendo su <span className="messaggio-esito-testo">{cavalloSelezionato}</span>.</>
            ) : (
              <>Hai perso <span className="messaggio-esito-testo">{puntataRef.current}€</span> scommettendo su <span className="messaggio-esito-testo">{cavalloSelezionato}</span>.</>
            )}
            <br />
            Il vincitore è: <span className="messaggio-esito-testo">{winner}</span>
          </p>

          {/* BOTTONE */}
          <button className="btn-blu" onClick={handleScommettiDiNuovo}>Scommetti di nuovo</button>
        </div>
      )}

    </div>
  );
}

export default App;