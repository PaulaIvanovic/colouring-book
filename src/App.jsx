import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// --- SVG IKONE ---
const IconKist = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM5.25 19H5v-.25l8.92-8.92.25.25L5.25 19z"/></svg>
);
const IconKantica = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13c-1.1 0-2 .9-2 2v4H7v-2c0-1.1-.9-2-2-2s-2 .9-2 2v3c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2z"/><path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10l5.5-5.5 5.5 5.5-5.5 5.5-5.5-5.5-5.5-5.5-5.5-5.5z"/></svg>
);
const IconGumica = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.14 3c-.51 0-1.02.2-1.41.59L2.59 14.73c-.78.78-.78 2.05 0 2.83L5.03 20h7.66l8.72-8.72c.78-.78.78-2.05 0-2.83l-4.85-4.85C16.16 3.2 15.65 3 15.14 3zM13 18H7l-2-2 9-9 2 2-3 9zm4-4l-2-2 4-4 2 2-4 4z"/></svg>
);

// --- PODACI ---
const KATEGORIJE = [
  { id: 'oblici', naslov: 'Geometrijski oblici', img: '🔺' },
  { id: 'tijela', naslov: 'Geometrijska tijela', img: '🧊' },
  { id: 'mix', naslov: 'Tijela i oblici', img: '⭐' },
];

const VELICINE_KISTA = [10, 20, 30, 45, 60]; 
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;

const OBLICI_DATA = {
  oblici: [
    // --- KRUGOVI ---
    { id: 'krug_mali', ime: 'Mali Krug', type: 'circle', cx: 150, cy: 150, r: 50 },
    { id: 'krug_srednji', ime: 'Srednji Krug', type: 'circle', cx: 500, cy: 150, r: 80 },
    { id: 'krug_veliki', ime: 'Veliki Krug', type: 'circle', cx: 850, cy: 150, r: 110 },
    
    // --- KVADRATI ---
    { id: 'kvadrat_mali', ime: 'Mali Kvadrat', type: 'rect', x: 100, y: 400, w: 100, h: 100 },
    { id: 'kvadrat_srednji', ime: 'Srednji Kvadrat', type: 'rect', x: 420, y: 380, w: 160, h: 160 },
    { id: 'kvadrat_veliki', ime: 'Veliki Kvadrat', type: 'rect', x: 750, y: 350, w: 220, h: 220 },

    // --- PRAVOKUTNICI ---
    { id: 'pravokutnik_mali', ime: 'Mali Pravokutnik', type: 'rect', x: 100, y: 400, w: 120, h: 80 },
    { id: 'pravokutnik_srednji', ime: 'Srednji Pravokutnik', type: 'rect', x: 420, y: 380, w: 180, h: 100 },
    { id: 'pravokutnik_veliki', ime: 'Veliki Pravokutnik', type: 'rect', x: 750, y: 350, w: 240, h: 140 },

    // --- TROKUTI ---
    { id: 'trokut_mali', ime: 'Mali Trokut', type: 'polygon', points: "150,50 100,150 200,150" }, 
    { id: 'trokut_srednji', ime: 'Srednji Trokut', type: 'polygon', points: "500,50 420,200 580,200" }, 
    { id: 'trokut_veliki', ime: 'Veliki Trokut', type: 'polygon', points: "850,50 730,250 970,250" }, 
  ],
  
  tijela: [
    // --- KOCKE ---
    { id: 'kocka_mala', ime: 'Mala Kocka', type: 'rect', x: 100, y: 100, w: 100, h: 100 }, 
    { id: 'kocka_srednja', ime: 'Srednja Kocka', type: 'rect', x: 420, y: 80, w: 160, h: 160 },
    { id: 'kocka_velika', ime: 'Velika Kocka', type: 'rect', x: 750, y: 50, w: 220, h: 220 },

    // --- PIRAMIDE ---
    { id: 'piramida_mala', ime: 'Mala Piramida', type: 'polygon', points: "150,350 100,450 200,450" },
    { id: 'piramida_srednja', ime: 'Srednja Piramida', type: 'polygon', points: "500,320 420,480 580,480" },
    { id: 'piramida_velika', ime: 'Velika Piramida', type: 'polygon', points: "850,300 730,520 970,520" },
    
    // --- VALJCI ---
    { id: 'valjak_mali', ime: 'Mali Valjak', type: 'rect', x: 115, y: 50, w: 70, h: 120 },
    { id: 'valjak_srednji', ime: 'Srednji Valjak', type: 'rect', x: 450, y: 350, w: 100, h: 180 }, 
    { id: 'valjak_veliki', ime: 'Veliki Valjak', type: 'rect', x: 780, y: 320, w: 140, h: 240 } 
  ], 
  
  mix: [
    // --- KVIZ (TOČNO ZADANI OBLICI) ---
    { id: 'mix_krug_mali', ime: 'Mali Krug', type: 'circle', cx: 150, cy: 150, r: 50 },
    { id: 'mix_trokut_srednji', ime: 'Srednji Trokut', type: 'polygon', points: "500,50 420,200 580,200" },
    { id: 'mix_krug_veliki', ime: 'Veliki Krug', type: 'circle', cx: 850, cy: 150, r: 110 },
    
    { id: 'mix_kvadrat_mali', ime: 'Mali Kvadrat', type: 'rect', x: 100, y: 400, w: 100, h: 100 },
    { id: 'mix_pravokutnik_srednji', ime: 'Srednji Pravokutnik', type: 'rect', x: 420, y: 400, w: 180, h: 100 },
    { id: 'mix_pravokutnik_veliki', ime: 'Veliki Pravokutnik', type: 'rect', x: 750, y: 380, w: 240, h: 140 }
  ]
};

const BOJE = ['#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500', '#800080', '#000000', '#FFFFFF'];

function App() {
  const [ekran, setEkran] = useState('pocetna');
  const [odabranaKategorija, setOdabranaKategorija] = useState(null);
  const [odabraniOblik, setOdabraniOblik] = useState(null);
  const [alat, setAlat] = useState('kantica');
  const [boja, setBoja] = useState('#FF0000');
  const [velicina, setVelicina] = useState(20);
  const [bojeOblika, setBojeOblika] = useState({});
  const [poruka, setPoruka] = useState("");
  const [zadatak, setZadatak] = useState(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Navigacija
  const idiNaKategorije = () => setEkran('kategorije');
  const odaberiKategoriju = (katId) => { setOdabranaKategorija(katId); setEkran('odabir'); };
  const povratak = () => {
    if (ekran === 'igra') setEkran('odabir');
    else if (ekran === 'odabir') setEkran('kategorije');
    else if (ekran === 'kategorije') setEkran('pocetna');
  };

  const pokreniIgru = (oblikId) => {
    setOdabraniOblik(oblikId);
    setBojeOblika({});
    setEkran('igra');
    setPoruka("");

    // Postavi alat ovisno o tipu igre
    if (oblikId === 'kviz') {
      setAlat('kantica');
      // PROMJENA: Eksplicitno šaljemo 'kviz' kako bi funkcija znala koristiti MIX podatke
      generirajZadatak('kviz'); 
    } else {
      setAlat('kist');
    }

    const canvas = canvasRef.current;
    if(canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // PROMJENA: Dodan parametar 'aktivniMod' kako bi znali koji set podataka koristiti
  const generirajZadatak = (aktivniMod) => {
    // Ako je argument 'kviz' ili je state već 'kviz', koristi MIX oblike
    // U suprotnom koristi oblike iz odabrane kategorije
    const jeKviz = aktivniMod === 'kviz' || odabraniOblik === 'kviz';
    
    const obliciUgrupi = jeKviz ? OBLICI_DATA['mix'] : OBLICI_DATA[odabranaKategorija];
    
    const randomOblik = obliciUgrupi[Math.floor(Math.random() * obliciUgrupi.length)];
    setZadatak({ oblikId: randomOblik.id, boja: '#0000FF', imeBoje: 'PLAVO' });
    setPoruka(`Oboji ${randomOblik.ime} u ${'PLAVO'}`);
  };

  const klikNaOblik = (idOblika) => {
    if (alat === 'kantica') {
      const novaBoja = boja;
      setBojeOblika(prev => ({ ...prev, [idOblika]: novaBoja }));

      if (odabraniOblik === 'kviz' && zadatak) {
        if (idOblika === zadatak.oblikId && novaBoja === zadatak.boja) {
          setPoruka("TOČNO! BRAVO! 🎉");
          setTimeout(() => { generirajZadatak(); }, 2000);
        } else if (idOblika === zadatak.oblikId && novaBoja !== zadatak.boja) {
           setPoruka("Skoro! Pokušaj drugu boju.");
        }
      }
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    if (alat === 'kantica') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const offsetX = (nativeEvent.clientX - rect.left) * scaleX;
    const offsetY = (nativeEvent.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    ctx.lineWidth = velicina;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (alat === 'gumica') {
      ctx.globalCompositeOperation = 'destination-out'; 
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = boja;
    }

    isDrawing.current = true;
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing.current || alat === 'kantica') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const offsetX = (nativeEvent.clientX - rect.left) * scaleX;
    const offsetY = (nativeEvent.clientY - rect.top) * scaleY;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if(isDrawing.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        isDrawing.current = false;
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  const renderOblici = (zaObrub) => {
    // PROMJENA: Određivanje koji dataset koristiti za renderiranje
    // Ako je KVIZ, uvijek koristi 'mix', inače koristi odabranu kategoriju
    const dataset = (odabraniOblik === 'kviz') 
        ? OBLICI_DATA['mix'] 
        : OBLICI_DATA[odabranaKategorija];

    return dataset.map(oblik => {
        if(odabraniOblik !== 'kviz') {
            const baseType = oblik.ime.split(' ')[1];
            const selectedType = OBLICI_DATA[odabranaKategorija].find(o => o.id === odabraniOblik)?.ime.split(' ')[1];
            if (baseType !== selectedType) return null;
        }
        
        const stil = zaObrub ? {
            fill: 'none', stroke: 'black', strokeWidth: 8, pointerEvents: 'none'
        } : {
            fill: bojeOblika[oblik.id] || 'white', 
            stroke: 'none', 
            cursor: alat === 'kantica' ? 'pointer' : 'default',
            pointerEvents: 'all' 
        };

        const props = { key: oblik.id, style: stil };
        if (!zaObrub) props.onClick = () => klikNaOblik(oblik.id);

        if (oblik.type === 'circle') return <circle {...props} cx={oblik.cx} cy={oblik.cy} r={oblik.r} />;
        if (oblik.type === 'rect') return <rect {...props} x={oblik.x} y={oblik.y} width={oblik.w} height={oblik.h} />;
        if (oblik.type === 'polygon') return <polygon {...props} points={oblik.points} />;
        return null;
    });
  };

  if (ekran === 'pocetna') {
    return (
      <div className="screen home-screen">
        <h1 className="main-title">Bojanka</h1>
        <button className="btn-start" onClick={idiNaKategorije}>KRENI</button>
      </div>
    );
  }

  return (
    <div className={`app-container cursor-${alat}`}>
      {ekran === 'kategorije' && (
        <div className="screen categories-screen">
          <button className="btn-back-global" onClick={povratak}>⬅ Natrag</button>
          <h2>Odaberi temu:</h2>
          <div className="cards-container">
            {KATEGORIJE.map(kat => (
              <div key={kat.id} className="category-card-wrapper" onClick={() => odaberiKategoriju(kat.id)}>
                <div className="card-image-box"><div className="card-img-content">{kat.img}</div></div>
                <div className="card-title-btn">{kat.naslov}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ekran === 'odabir' && (
        <div className="screen selection-screen">
          <button className="btn-back-global" onClick={povratak}>⬅ Natrag</button>
          <h2>{KATEGORIJE.find(k => k.id === odabranaKategorija)?.naslov}</h2>
          <div className="grid-container">
            {[...new Set(OBLICI_DATA[odabranaKategorija]?.map(o => o.ime.split(' ')[1]))].map(tip => {
                 const oblik = OBLICI_DATA[odabranaKategorija].find(o => o.ime.includes(tip));
                 return (
                  <div key={tip} className="item-card" onClick={() => pokreniIgru(oblik.id)}>
                    <div className="mini-shape">{tip}</div>
                  </div>
                 );
            })}
            <div className="item-card quiz-card" onClick={() => pokreniIgru('kviz')}>
              <div className="mini-shape">⭐ KVIZ</div>
            </div>
          </div>
        </div>
      )}

      {ekran === 'igra' && (
        <div className="screen game-screen">
            <div className="game-header-bar">
                <button className="btn-back-game" onClick={povratak}>⬅ Natrag</button>
                <div className="game-title-container">
                    {odabraniOblik === 'kviz' ? (
                        <h2 style={{color: poruka.includes('TOČNO') ? 'green' : 'black'}}>{poruka}</h2>
                    ) : (
                        <h2>Bojanje: Slobodan stil</h2>
                    )}
                </div>
                <div style={{width: '100px'}}></div> 
            </div>

            <div className="game-layout">
                <div className="sidebar">
                    <div className="tools">
                      {odabraniOblik === 'kviz' ? (
                        <button className={`tool-btn ${alat === 'kantica' ? 'active' : ''}`} onClick={() => setAlat('kantica')}>
                        <IconKantica /> <span>Kantica</span>
                        </button>
                      ) : (
                        <>
                        <button className={`tool-btn ${alat === 'kist' ? 'active' : ''}`} onClick={() => setAlat('kist')}>
                        <IconKist /> <span>Kist</span>
                        </button>
                        <button className={`tool-btn ${alat === 'gumica' ? 'active' : ''}`} onClick={() => setAlat('gumica')}>
                        <IconGumica /> <span>Gumica</span>
                        </button>
                        </>
                      )}
                    </div>


                   {(odabraniOblik !== 'kviz' && (alat === 'kist' || alat === 'gumica')) && (
    <div className="size-selector">
        <p>Veličina:</p>
        <div className="size-circles">
            {VELICINE_KISTA.map(vel => (
                <div 
                    key={vel}
                    className={`size-circle ${velicina === vel ? 'selected' : ''}`}
                    style={{ width: (vel/2) + 10, height: (vel/2) + 10 }} 
                    onClick={() => setVelicina(vel)}
                />
            ))}
        </div>
    </div>
)}


                    <div className="colors">
                        {BOJE.map(b => (
                            <div key={b} className="color-box" style={{backgroundColor: b, border: boja === b ? '4px solid black' : 'none'}} onClick={() => setBoja(b)} />
                        ))}
                    </div>
                </div>

                <div className="canvas-area-wrapper">
                    <div className="canvas-stack">
                        {/* SLOJ 1: BOJA OBLIKA */}
                        <svg className="layer-stacked svg-fill" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
                            {renderOblici(false)}
                        </svg>
                        
                        {/* SLOJ 2: CRTEŽI */}
                        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="layer-stacked drawing-canvas"
                            style={{ pointerEvents: (alat === 'kantica') ? 'none' : 'auto' }}
                            onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                        />
                        
                        {/* SLOJ 3: CRNI OBRUBI */}
                        <svg className="layer-stacked svg-outline" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
                             {renderOblici(true)}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;