let sketch = function (p) {
  p.setup = function () {
    p.createCanvas(windowWidth, windowHeight);
    p.angleMode(DEGREES);
  };

  // sfondo che cambia colore + decorazione di sfondo con quadrati che ruotano
  p.draw = function () {
    p.background(lerpColor(color("DimGrey"), color("Black"), frameCount / 120));
    p.rectMode(CENTER);

    p.stroke(lerpColor(color("Black"), color("DimGrey"), frameCount / 120));
    p.noFill();
    p.translate(windowWidth / 2, windowHeight / 2);
    for (i = 0; i < 500; i++) {
      const angle = frameCount / 4 + i * 5; // angolo
      const k = 15; // ampiezza
      const rotation = sin(angle) * k; // rotazione
      const side = 2; // lato quadrato iniziale
      p.push();
      p.rotate(rotation);
      p.rect(0, 0, side * i, side * i);
      p.pop();
    }
  };
};

let p1 = new p5(sketch);

var myAsciiArt;

// imposto dimensione artwork
var asciiart_width = 150;
var asciiart_height = 75;

var myCapture;
var gfx;

// var per immagazzinare array come ascii art
var ascii_arr;

// sfondo con immagine della videocamera oppure no
var showOryginalImageFlag = false;

// accedo alla videocamera
function initCaptureDevice() {
  try {
    myCapture = createCapture(VIDEO);
    myCapture.size(360, 180);
    myCapture.elt.setAttribute("playsinline", "");
    myCapture.hide();
    console.log(
      "[initCaptureDevice] capture ready. Resolution: " +
        myCapture.width +
        " " +
        myCapture.height
    );
  } catch (_err) {
    console.log("[initCaptureDevice] capture error: " + _err);
  }
}

function setup() {
  let cnv = createCanvas(320 * 2, 240 * 2);

  cnv.position((windowWidth / 16) * 5, windowHeight / 4);

  // accedo alla camera
  initCaptureDevice();

  gfx = createGraphics(asciiart_width, asciiart_height);
  gfx.pixelDensity(1);

  myAsciiArt = new AsciiArt(this);

  // converte i singoli pixel in glifi
  myAsciiArt.printWeightTable();

  // settaggi per font, anche se io tengo quello di default della library
  textAlign(CENTER, CENTER);
  textFont("monospace", 8);
  textStyle(NORMAL);
  noStroke();
  fill(255);

  frameRate(30);
}

function draw() {
  if (myCapture !== null && myCapture !== undefined) {
    //anche qui faccio lo sfondo che cambia colore in base al frameCount (mantenendo le stesse tonalità dello sfondo e della decorazione)
    background(lerpColor(color("Black"), color("DimGrey"), frameCount / 120));

    gfx.background(0);
    gfx.image(myCapture, 0, 0, gfx.width, gfx.height);

    gfx.filter(POSTERIZE, 5);

    // converto immagine in ascii
    ascii_arr = myAsciiArt.convert(gfx);

    if (showOryginalImageFlag) image(myCapture, 0, 0, width, height);

    myAsciiArt.typeArray2d(ascii_arr, this);
  } else {
    // se ci sono problemi con la videocamera cambia colore di sfondo per evidenziarli
    background(255, 0, 0);
  }
}

function mouseReleased() {
  // toglie lo sfondo nero e mette l'immagine originale
  showOryginalImageFlag = !showOryginalImageFlag;
}

typeArray2d = function (_arr2d, _dst, _x, _y, _w, _h) {
  if (_arr2d === null) {
    console.log("[typeArray2d] _arr2d === null");
    return;
  }
  if (_arr2d === undefined) {
    console.log("[typeArray2d] _arr2d === undefined");
    return;
  }
  switch (arguments.length) {
    case 2:
      _x = 0;
      _y = 0;
      _w = width;
      _h = height;
      break;
    case 4:
      _w = width;
      _h = height;
      break;
    case 6:
      break;
    default:
      console.log("[typeArray2d] bad number of arguments: " + arguments.length);
      return;
  }

  if (_dst.canvas === null) {
    console.log("[typeArray2d] _dst.canvas === null");
    return;
  }
  if (_dst.canvas === undefined) {
    console.log("[typeArray2d] _dst.canvas === undefined");
    return;
  }
  var temp_ctx2d = _dst.canvas.getContext("2d");
  if (temp_ctx2d === null) {
    console.log("[typeArray2d] _dst canvas 2d context is null");
    return;
  }
  if (temp_ctx2d === undefined) {
    console.log("[typeArray2d] _dst canvas 2d context is undefined");
    return;
  }
  var dist_hor = _w / _arr2d.length;
  var dist_ver = _h / _arr2d[0].length;
  var offset_x = _x + dist_hor * 0.5;
  var offset_y = _y + dist_ver * 0.5;
  for (var temp_y = 0; temp_y < _arr2d[0].length; temp_y++)
    for (var temp_x = 0; temp_x < _arr2d.length; temp_x++)
      /*text*/ temp_ctx2d.fillText(
        _arr2d[temp_x][temp_y],
        offset_x + temp_x * dist_hor,
        offset_y + temp_y * dist_ver
      );
};
