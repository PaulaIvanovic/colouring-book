/* eslint-disable react-hooks/purity */
import React, { useMemo, useRef, useState } from "react";
import "./App.css";

import { CATEGORIES, SHAPES, VEHICLES, CANVAS_HEIGHT, CANVAS_WIDTH, BRUSH_SIZES } from "./data/shapes";
import { COLORS, COLOR_NAMES } from "./data/palette";
import { ShapeBoard } from "./components/ShapeBoard";
import { ColorPalette } from "./components/ColorPalette";
import { DwellPressable } from "./components/DwellPressable";
import { useFeedback } from "./hooks/useFeedback";
import { PaintBrushIcon, EraserIcon, PaintBucketIcon } from "@phosphor-icons/react";


const DWELL_MS = 1200;

export default function App() {
  // navigation
  const [screen, setScreen] = useState("pocetna"); // pocetna | kategorije | odabir | igra | uskoro
  const [categoryId, setCategoryId] = useState(null);

  // game
  const [mode, setMode] = useState("free"); // free | quiz
  const [selectedKind, setSelectedKind] = useState(null);
  const [tool, setTool] = useState(); // kist | gumica | kantica
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(20);
  const [fillById, setFillById] = useState({});

  // quiz
  const [task, setTask] = useState(null); // { shapeId, shapeName, color, colorName }
  const [headerMessage, setHeaderMessage] = useState(""); // what header shows
  const [centerMessage, setCenterMessage] = useState(null); // overlay (instruction or status)
  const [score, setScore] = useState(0);

  const wrongTimeoutRef = useRef(null);

  // drawing
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // feedback
  const { feedback, correct, wrong } = useFeedback();

  const availableKinds = useMemo(() => {
    if (!categoryId) return [];
    return [...new Set(SHAPES[categoryId].map((s) => s.kind))];
  }, [categoryId]);

  const gameShapes = useMemo(() => {
    if (mode === "quiz") return SHAPES.mix;
    if (!categoryId) return [];
    return SHAPES[categoryId].filter((s) => s.kind === selectedKind);
  }, [categoryId, mode, selectedKind]);

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  function goCategories() {
    //setScreen("kategorije");
    setCategoryId("oblici");
    setScreen("odabir");
  }

  function chooseCategory(id) {
    if (id === "oblici") {
      setCategoryId(id);
      setScreen("odabir");
    } else {
      setScreen("uskoro");
    }
  }

  function back() {
    if (screen === "igra") setScreen("odabir");
    else if (screen === "odabir") setScreen("kategorije");
    else if (screen === "kategorije") setScreen("pocetna");
    else if (screen === "uskoro") setScreen("kategorije");
    setTool(null);
  }

  function startGameFree(kind) {
    setMode("free");
    setSelectedKind(kind);
    setTool("kist");
    setFillById({});
    setTask(null);
    setHeaderMessage("");
    setCenterMessage(null);
    clearCanvas();
    setScreen("igra");
  }

  function makeInstructionNode(shapeName, c, colorName) {
    return (
      <span>
        Oboji <strong>{shapeName}</strong> u{" "}
        <span style={{ color: c, fontWeight: "bold" }}>{colorName}</span>
      </span>
    );
  }

  function makeTask() {
    const shapes = SHAPES.mix;
    const s = shapes[Math.floor(Math.random() * shapes.length)];
    const idx = Math.floor(Math.random() * COLORS.length);
    const c = COLORS[idx];

    const nextTask = { shapeId: s.id, shapeName: s.ime, color: c, colorName: COLOR_NAMES[idx] };
    setTask(nextTask);

    const instruction = makeInstructionNode(nextTask.shapeName, nextTask.color, nextTask.colorName);
    //setHeaderMessage(instruction);
    setCenterMessage(instruction);
  }

  function startQuiz() {
    setMode("quiz");
    setTool("kantica");
    setScore(0);
    setFillById({});
    setSelectedKind(null);
    clearCanvas();
    setScreen("igra");
    makeTask();
  }

  function restoreInstructionAfterWrong() {
    if (!task) return;
    const instruction = makeInstructionNode(task.shapeName, task.color, task.colorName);
    //setHeaderMessage(instruction);
    setCenterMessage(instruction);
  }

  function showStatusTemporarily(text, kind) {
    setCenterMessage(text);
    //setHeaderMessage(text);

    if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
    wrongTimeoutRef.current = setTimeout(() => {
      restoreInstructionAfterWrong();
    }, 1500);

    // keep the big status briefly even if instruction restores
    setTimeout(() => {
      // if not already replaced by a new task
      if (kind === "wrong") {
        setCenterMessage((prev) => (prev === text ? null : prev));
        restoreInstructionAfterWrong();
      }
    }, 1500);
  }

  function handleActivateShape(shapeId) {

    if (tool === "gumica") {

    setFillById((prev) => {
      const next = { ...prev };
      delete next[shapeId];
      return next;
    });
    return;
  }

    setFillById((prev) => ({ ...prev, [shapeId]: color }));

    if (mode !== "quiz" || !task) return;

    const isCorrect = shapeId === task.shapeId && color === task.color;

    if (isCorrect) {
      correct();
      setScore((s) => s + 1);

      setCenterMessage("✅ TOČNO! BRAVO!");
      //setHeaderMessage("✅ TOČNO! BRAVO! ✅");
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);

      setTimeout(() => {
        makeTask();
      }, 850);
    } else {
      wrong();

      // undo wrong fill on that shape
      setFillById((prev) => {
        const next = { ...prev };
        delete next[shapeId];
        return next;
      });

      showStatusTemporarily("❌ POKUŠAJ PONOVO ❌", "wrong");
    }
  }

  // drawing (free mode)
  function startDrawing(e) {
    if (tool === "kantica") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.nativeEvent.clientX - rect.left) * scaleX;
    const y = (e.nativeEvent.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "gumica") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }

    isDrawing.current = true;
  }

  function draw(e) {
    if (!isDrawing.current || tool === "kantica") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.nativeEvent.clientX - rect.left) * scaleX;
    const y = (e.nativeEvent.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over";
    isDrawing.current = false;
  }

  // --- screens ---
  if (screen === "pocetna") {
    return (
      <div className="screen home-screen">
        <h1 className="main-title">Bojanka</h1>
        <DwellPressable className="btn-start" dwellMs={DWELL_MS} onActivate={goCategories}>
          KRENI
        </DwellPressable>
      </div>
    );
  }

  return (
    <div className={`app-container cursor-${tool}`}>
      {screen === "kategorije" && (
        <div className="screen categories-screen">
          <DwellPressable className="btn-back-global" dwellMs={DWELL_MS} onActivate={back}>
            ⬅ Natrag
          </DwellPressable>

          <h2>Odaberi temu:</h2>

          <div className="cards-container">
            {CATEGORIES.map((cat) => (
              <DwellPressable
                key={cat.id}
                as="div"
                className="category-card-wrapper"
                role="button"
                tabIndex={0}
                dwellMs={DWELL_MS}
                onActivate={() => chooseCategory(cat.id)}
              >
                <div className="card-image-box">
                  <div className="card-img-content">{cat.img}</div>
                </div>
                <div className="card-title-btn">{cat.naslov}</div>
              </DwellPressable>
            ))}
          </div>
        </div>
      )}

      {screen === "odabir" && (
        <div className="screen selection-screen">
          <DwellPressable className="btn-back-global" dwellMs={DWELL_MS} onActivate={back}>
            ⬅ Natrag
          </DwellPressable>

          <h2>{CATEGORIES.find((c) => c.id === categoryId)?.naslov}</h2>

          <div className="grid-container">
            {availableKinds.map((k) => (
              <DwellPressable
                key={k}
                as="div"
                className="item-card"
                role="button"
                tabIndex={0}
                dwellMs={DWELL_MS}
                onActivate={() => startGameFree(k)}
              >
                <div className="mini-shape">{k.toUpperCase()}</div>
              </DwellPressable>
            ))}

            <DwellPressable
              as="div"
              className="item-card quiz-card"
              role="button"
              tabIndex={0}
              dwellMs={DWELL_MS}
              onActivate={startQuiz}
            >
              <div className="mini-shape">⭐ KVIZ</div>
            </DwellPressable>
          </div>
        </div>
      )}

      {screen === "uskoro" && (
        <div className="screen coming-soon-screen">
          <DwellPressable className="btn-back-global" dwellMs={DWELL_MS} onActivate={back}>
            ⬅ Natrag
          </DwellPressable>
          <div className="coming-soon">STIŽE USKORO ⏳</div>
        </div>
      )}

      {screen === "igra" && (
        <div className={`screen game-screen ${mode === "quiz" ? "quiz-mode" : ""}`}>
          <div className="game-header-bar">
            <DwellPressable className="btn-back-game" dwellMs={DWELL_MS} onActivate={back}>
              ⬅ Natrag
            </DwellPressable>

            {/* ✅ header message stays here, but quiz instruction is ALSO centered */}
            <div className="game-title-container" aria-live="polite">
              {mode === "quiz" ? <h2>{headerMessage}</h2> : <h2>Bojanje: Slobodan stil</h2>}
            </div>

            <div style={{ width: 160 }} />
          </div>

          <div className="game-layout">
            <div className="sidebar">
              <div className="tools">
                {mode === "quiz" ? (
                  <DwellPressable
                    className={`tool-btn ${tool === "kantica" ? "active" : ""}`}
                    dwellMs={DWELL_MS}
                    onActivate={() => setTool("kantica")}
                  >
                    <PaintBucketIcon size={34} weight="bold" /> <span>Kantica</span>
                  </DwellPressable>
                ) : (
                  <>
                    <DwellPressable
                      className={`tool-btn ${tool === "kist" ? "active" : ""}`}
                      dwellMs={DWELL_MS}
                      onActivate={() => setTool("kist")}
                    >
                      <PaintBrushIcon size={34} weight="bold" /> <span>Kist</span>
                    </DwellPressable>

                    <DwellPressable
                      className={`tool-btn ${tool === "gumica" ? "active" : ""}`}
                      dwellMs={DWELL_MS}
                      onActivate={() => setTool("gumica")}
                    >
                      <EraserIcon size={34} weight="bold" /> <span>Gumica</span>
                    </DwellPressable>

                    <DwellPressable
                      className={`tool-btn ${tool === "kantica" ? "active" : ""}`}
                      dwellMs={DWELL_MS}
                      onActivate={() => setTool("kantica")}
                    >
                      <PaintBucketIcon size={34} weight="bold" /> <span>Kantica</span>
                    </DwellPressable>
                  </>
                )}
              </div>

              {mode === "free" && (tool === "kist" || tool === "gumica") && (
                <div className="size-selector">
                  <p>Veličina:</p>
                  <div className="size-circles">
                    {BRUSH_SIZES.map((s) => (
                      <DwellPressable
                        key={s}
                        as="div"
                        className={`size-circle ${brushSize === s ? "selected" : ""}`}
                        role="button"
                        tabIndex={0}
                        dwellMs={DWELL_MS}
                        onActivate={() => setBrushSize(s)}
                        style={{ width: s / 2 + 10, height: s / 2 + 10 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <ColorPalette colors={COLORS} selected={color} onSelect={setColor} dwellMs={DWELL_MS} />

              {/* ✅ move score below palette in quiz */}
              {mode === "quiz" && (
                <div className={`score-below ${feedback ? `score-${feedback}` : ""}`}>
                  Bodovi: <span className="score-number">{score}</span>
                </div>
              )}
            </div>

            <div className={`canvas-area-wrapper ${feedback ? `flash-${feedback}` : ""}`}>
              <div className="canvas-stack">
                <ShapeBoard
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  shapes={gameShapes}
                  fillById={fillById}
                  outlineOnly={false}
                  canActivate={tool === "kantica" || tool === "gumica"}
                  onActivateShape={handleActivateShape}
                  dwellMs={DWELL_MS}
                />

                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="layer-stacked drawing-canvas"
                  style={{ pointerEvents: tool === "kantica" ? "none" : "auto" }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />

                <ShapeBoard
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  shapes={gameShapes}
                  fillById={fillById}
                  outlineOnly={true}
                  canActivate={false}
                  onActivateShape={() => {}}
                  dwellMs={DWELL_MS}
                />

                {/* ✅ quiz message centered */}
                {mode === "quiz" && (
                  <div className="quiz-center-message" aria-live="polite">
                    <div className={`quiz-center-bubble ${feedback ? `quiz-${feedback}` : ""}`}>
                      {centerMessage}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
