import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import logo from './assets/logo-2.png';
import horse from './assets/horse.png';
const cavalliIniziali = [
  { nome: 'EDEN', colore: '#28a745' },         // Verde smeraldo
  { nome: 'STORM', colore: '#ffc107' },      // Giallo ambra
  { nome: 'SKY BLUE', colore: '#17a2b8' },        // Azzurro intenso
  { nome: 'ALEXANDER', colore: '#fd7e14' },       // Arancione vivace
  { nome: 'RED RUM', colore: '#007bff' },        // Blu vivo
  { nome: 'SCACCO MATTO', colore: '#dc3545' },  // Rosso acceso
  { nome: 'DRAGO', colore: '#6f42c1' },         // Viola brillante
  { nome: 'ASTRO', colore: '#f78fb3' },          // Rosa delicato
  { nome: 'SAETTA', colore: '#f8f9fa' },       // Bianco ghiaccio
  { nome: 'PEGASO', colore: '#ffd700' },        // Oro classico
  { nome: 'NERONE', colore: '#343a40' },        // Grigio antracite
  { nome: 'TUONO', colore: '#7bed9f' },         // Verde menta
  { nome: 'OMBRA', colore: '#6c757d' },         // Grigio neutro
  { nome: 'VENTO', colore: '#74b9ff' },         // Celeste tenue
  { nome: 'TITANO', colore: '#a0522d' },        // Marrone seppia
  { nome: 'GOLIATH', colore: '#ced4da' },       // Argento chiaro
  { nome: 'LUNA', colore: '#3f51b5' },         // Blu indaco
  { nome: 'COMETA', colore: '#6610f2' },        // Viola profondo
  { nome: 'FENICE', colore: '#e83e8c' },        // Rosa fuoco
  { nome: 'ZEFIRO', colore: '#20c997' }         // Verde acqua
];


function App() {
  const [nome, setNome] = useState('MARIO');
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
  const [tempSaldo, setTempSaldo] = useState(saldo);
  const [tempNumeroCavalli, setTempNumeroCavalli] = useState(cavalliGara.length);
  const [tempEsito, setTempEsito] = useState(esitoDesiderato === null ? 'casuale' : esitoDesiderato ? 'si' : 'no');

  const puntataRef = useRef(null);

  useEffect(() => {
    setGiocata(saldo.toString());
  }, [saldo]);

   const mostraEsito = (haVinto) => {
      setMostraMessaggioEsito(true);
    };

    const eseguiEsito = () => {
      let cavalli = [...cavalliGara];

      if (esitoDesiderato === true) {
        cavalli = [
          cavalli.find(c => c.nome === 'SCACCO MATTO'),
          ...cavalli.filter(c => c.nome !== 'SCACCO MATTO')
        ];
      } else if (esitoDesiderato === false) {
        const altri = cavalli.filter(c => c.nome !== 'SCACCO MATTO');
        const pos = Math.floor(Math.random() * (altri.length - 1)) + 1;
        altri.splice(pos, 0, cavalli.find(c => c.nome === 'SCACCO MATTO'));
        cavalli = altri;
      } else {
        cavalli.sort(() => Math.random() - 0.5);
      }

      const vincitore = cavalli[0].nome;
      setWinner(vincitore);
      const haVinto = vincitore === cavalloSelezionato;
     const puntata = puntataRef.current ?? 0;


      if (haVinto) {
        setSaldo(prev => prev + puntata * 2);
      }

      mostraEsito(haVinto);

    };

  const handleScommetti = () => {
    const puntata = parseInt(giocata);
    setErroreInput('');
    if (!puntata || puntata <= 0 || puntata > saldo) {
      setErroreInput('Importo non valido');
      return;
    }

     puntataRef.current = puntata;
       setSaldo(prevSaldo => prevSaldo - puntata);
       setMostraMessaggioConferma(true);
     };

 const handleChiudiMessaggio = () => {
   setMostraPaginaScommessa(false);            // mostra pagina scommessa
   setMostraMessaggioConferma(false);         // nasconde messaggio conferma
   setMostraMessaggioEsito(true);            // nasconde messaggio esito
    if (puntataRef.current) {
        eseguiEsito();
    }
  };

const handleReset = () => {
  setSaldo(1000);                            // reset saldo
  setNome('MARIO');                          // reset nome
  setGiocata(saldo.toString());              // reset giocata
  setCavalloSelezionato('SCACCO MATTO');     // cavallo di default
  setWinner('');                             // reset vincitore
  setMostraPaginaScommessa(true);            // mostra pagina scommessa
  setMostraMessaggioConferma(false);         // nasconde messaggio conferma
  setMostraMessaggioEsito(false);            // nasconde messaggio esito
  setErroreInput('');                        // reset errori input
  puntataRef.current = null;                 // reset puntata

  setEsitoDesiderato(null);                  // reset esito truccato
  setCavalliGara(cavalliIniziali.slice(0, 8)); // reset numero cavalli a 8
};


 const handleAltro = () => {
   setTempNome(nome);
   setTempSaldo(saldo);
   setTempNumeroCavalli(cavalliGara.length);
   setTempEsito(esitoDesiderato === null ? 'casuale' : esitoDesiderato ? 'si' : 'no');
   setMostraModaleAltro(true);
 };


const confermaModaleAltro = () => {
  setNome(tempNome.toUpperCase());
  setSaldo(Number(tempSaldo));
  setGiocata(tempSaldo.toString());
  setCavalliGara(cavalliIniziali.slice(0, Number(tempNumeroCavalli)));

  if (tempEsito === 'si') setEsitoDesiderato(true);
  else if (tempEsito === 'no') setEsitoDesiderato(false);
  else setEsitoDesiderato(null);

  setMostraModaleAltro(false);
};

  const handleScommettiDiNuovo = () => {
    setMostraPaginaScommessa(true);
    setMostraMessaggioEsito(false);
    setGiocata(saldo.toString());
  };

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
     <div class="logo-container">
         <img src={logo} alt="logo" className="logo" />
           </div>
     </header>
<div class="spacer"></div>

    {mostraPaginaScommessa && (
      <>
        <p className="benvenuto">
          Benvenuto <span className="highlight"><strong>{nome}</strong> Zarrella</span><br />
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
                  <span>Bet10000</span> ti invita a ricordare di giocare responsabilmente.
                </p>
                <div className="contenitore-bottone">
                  <button className="btn-chiudi" onClick={handleChiudiMessaggio}>Chiudi</button>
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
     {/* TABELLA STATISTICHE */}
     <table className="tabella-statistiche">
       <thead>
         <tr>
           <th>Cavallo</th>
           <th>Tempo percorso</th>
           <th>Punti</th>
           <th>Vittorie</th>
         </tr>
       </thead>
       <tbody>
         {cavalliGara.map((cavallo, index) => {
           const tempo = (Math.random() * 10 + 10).toFixed(2); // es. 10.00 - 20.00 sec
           const punti = Math.floor(Math.random() * 100);
           const vittorie = Math.floor(Math.random() * 10);
           return (
             <tr key={index}>
               <td>{cavallo.nome}</td>
               <td>{tempo} sec</td>
               <td>{punti}</td>
               <td>{vittorie}</td>
             </tr>
           );
         })}
       </tbody>
     </table>

       {/* SPAZIO */}
         <div style={{ marginTop: "30px" }}></div>

     {/* MESSAGGIO DI ESITO */}
     <span className="titolo-span">
       {winner === cavalloSelezionato ? `COMPLIMENTI ${nome}!` : `HAI PERSO TUTTO ${nome}`}
     </span>

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
