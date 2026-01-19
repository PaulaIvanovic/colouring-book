export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 600;

export const CATEGORIES = [
  { id: "oblici", naslov: "Geometrijski oblici", img: "🔺" },
  //{ id: "tijela", naslov: "Geometrijska tijela", img: "🧊" },
  //{ id: "mix", naslov: "Tijela i oblici", img: "⭐" },
  { id: "prijevozna", naslov: "Prijevozna sredstva", img: "🚌" },
];

export const BRUSH_SIZES = [10, 20, 30, 45, 60];

export const SHAPES = {
  oblici: [
    { id: "krug_mali", ime: "Mali Krug", kind: "krug", type: "circle", cx: 150, cy: 150, r: 50 },
    { id: "krug_srednji", ime: "Srednji Krug", kind: "krug", type: "circle", cx: 500, cy: 150, r: 80 },
    { id: "krug_veliki", ime: "Veliki Krug", kind: "krug", type: "circle", cx: 850, cy: 150, r: 110 },

    { id: "kvadrat_mali", ime: "Mali Kvadrat", kind: "kvadrat", type: "rect", x: 100, y: 400, w: 100, h: 100 },
    { id: "kvadrat_srednji", ime: "Srednji Kvadrat", kind: "kvadrat", type: "rect", x: 420, y: 380, w: 160, h: 160 },
    { id: "kvadrat_veliki", ime: "Veliki Kvadrat", kind: "kvadrat", type: "rect", x: 750, y: 350, w: 220, h: 220 },

    { id: "pravokutnik_mali", ime: "Mali Pravokutnik", kind: "pravokutnik", type: "rect", x: 100, y: 400, w: 120, h: 80 },
    { id: "pravokutnik_srednji", ime: "Srednji Pravokutnik", kind: "pravokutnik", type: "rect", x: 420, y: 380, w: 180, h: 100 },
    { id: "pravokutnik_veliki", ime: "Veliki Pravokutnik", kind: "pravokutnik", type: "rect", x: 750, y: 350, w: 240, h: 140 },

    { id: "trokut_mali", ime: "Mali Trokut", kind: "trokut", type: "polygon", points: "150,50 100,150 200,150" },
    { id: "trokut_srednji", ime: "Srednji Trokut", kind: "trokut", type: "polygon", points: "500,50 420,200 580,200" },
    { id: "trokut_veliki", ime: "Veliki Trokut", kind: "trokut", type: "polygon", points: "850,50 730,250 970,250" },
  ],

  // quiz uses mix only
  mix: [
    { id: "mix_krug_mali", ime: "Mali Krug", kind: "krug", type: "circle", cx: 150, cy: 150, r: 50 },
    { id: "mix_trokut_srednji", ime: "Trokut", kind: "trokut", type: "polygon", points: "500,50 420,200 580,200" },
    { id: "mix_krug_veliki", ime: "Veliki Krug", kind: "krug", type: "circle", cx: 850, cy: 150, r: 110 },

    { id: "mix_kvadrat_mali", ime: "Kvadrat", kind: "kvadrat", type: "rect", x: 100, y: 400, w: 100, h: 100 },
    { id: "mix_pravokutnik_srednji", ime: "Mali Pravokutnik", kind: "pravokutnik", type: "rect", x: 420, y: 400, w: 180, h: 100 },
    { id: "mix_pravokutnik_veliki", ime: "Veliki Pravokutnik", kind: "pravokutnik", type: "rect", x: 750, y: 380, w: 240, h: 140 },
  ],
};

export const VEHICLES = {
  car: {
    id: "car",
    title: "Auto",
    emoji: "🚗",
    shapes: [
      { id: "car_body", type: "rect", x: 260, y: 320, w: 480, h: 110 },
      { id: "car_roof", type: "polygon", points: "340,320 430,250 630,250 700,320" },
      { id: "car_window1", type: "rect", x: 450, y: 278, w: 85, h: 42 },
      { id: "car_window2", type: "rect", x: 545, y: 278, w: 95, h: 42 },
      { id: "car_wheel1", type: "circle", cx: 360, cy: 472, r: 42 },
      { id: "car_wheel2", type: "circle", cx: 660, cy: 472, r: 42 },
    ],
  },

  truck: {
    id: "truck",
    title: "Kamion",
    emoji: "🚚",
    shapes: [
      { id: "truck_trailer", type: "rect", x: 190, y: 265, w: 500, h: 165 },
      { id: "truck_cabin", type: "rect", x: 710, y: 305, w: 190, h: 125 },
      { id: "truck_windshield", type: "rect", x: 740, y: 320, w: 85, h: 52 },
      { id: "truck_sidewin", type: "rect", x: 835, y: 320, w: 45, h: 52 },
      { id: "truck_wheel1", type: "circle", cx: 300, cy: 472, r: 42 },
      { id: "truck_wheel2", type: "circle", cx: 470, cy: 472, r: 42 },
      { id: "truck_wheel3", type: "circle", cx: 740, cy: 472, r: 42 },
    ],
  },

  bus: {
    id: "bus",
    title: "Autobus",
    emoji: "🚌",
    shapes: [
      { id: "bus_body", type: "rect", x: 170, y: 265, w: 720, h: 185 },
      { id: "bus_win1", type: "rect", x: 210, y: 295, w: 95, h: 60 },
      { id: "bus_win2", type: "rect", x: 320, y: 295, w: 95, h: 60 },
      { id: "bus_win3", type: "rect", x: 430, y: 295, w: 95, h: 60 },
      { id: "bus_win4", type: "rect", x: 540, y: 295, w: 95, h: 60 },
      { id: "bus_win5", type: "rect", x: 650, y: 295, w: 95, h: 60 },
      { id: "bus_door", type: "rect", x: 780, y: 300, w: 75, h: 140 },
      { id: "bus_wheel1", type: "circle", cx: 310, cy: 492, r: 42 },
      { id: "bus_wheel2", type: "circle", cx: 730, cy: 492, r: 42 },
    ],
  },
};