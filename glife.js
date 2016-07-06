/*
  Usage :
   Press "down left up right down left up right escape"
   Enter width and height (or nothing, it will be default values)
   Then press "escape F1" to hide/show it (press keys at the SAME TIME)
   
  Todo :
   Configurations (local save)
   Optimisation of the CA
*/

function glifeScope(){ //Just for scope safety
  var listener;
  var started = false;
  var active = true;

  function loadScript(url, callback) {
    var head = document.getElementsByTagName('head') [0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
  }

  function glife() {
    var speed = 60;
    var width = prompt('width (default "window.innerWidth")') || window.innerWidth;
    var height = prompt('height (default 16)') || 16;
    var canvas = document.createElement('canvas');
    var aliveCells = 0.1;
    canvas.id = 'canvasGlife';
    canvas.width = width;
    canvas.height = height;
    canvas.style.right = 0;
    canvas.style.bottom = 0;
    canvas.style.zIndex = 10;
    canvas.style.position = 'fixed';
    canvas.style.border = '0px';
    document.body.appendChild(canvas);
    var can = document.getElementById('canvasGlife');
    var ctx = canvas.getContext('2d');
    var grid1 = new Array(width);
    for (var i = 0; i < width; i++) {
      grid1[i] = new Array(height);
      for (var j = 0; j < height; j++) {
        grid1[i][j] = Math.random() > aliveCells ? false : true;
      }
    }
    var grid2 = new Array(width);
    for (var i = 0; i < width; i++) {
      grid2[i] = new Array(height);
      for (var j = 0; j < height; j++) {
        grid2[i][j] = false;
      }
    }
    var resetGrid = function(){
      for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
          grid1[i][j] = Math.random() > aliveCells ? false : true;
        }
      }
    }
    var drawPoint = function (x, y) {
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 1, y);
      ctx.lineTo(x + 1, y + 1);
      ctx.lineTo(x, y + 1);
      ctx.lineTo(x, y);
      ctx.fill();
      ctx.closePath();
    }
    var stepGlife = function () {
      for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
          grid2[i][j] = grid1[i][j];
        }
      }
      for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
          var counter = 0;
          counter += grid2[i == 0 ? width - 1 : i - 1][j == 0 ? height - 1 : j - 1] ? 1 : 0;
          counter += grid2[i][j == 0 ? height - 1 : j - 1] ? 1 : 0;
          counter += grid2[i == width - 1 ? 0 : i + 1][j == 0 ? height - 1 : j - 1] ? 1 : 0;
          counter += grid2[i == 0 ? width - 1 : i - 1][j] ? 1 : 0;
          counter += grid2[i == width - 1 ? 0 : i + 1][j] ? 1 : 0;
          counter += grid2[i == 0 ? width - 1 : i - 1][j == height - 1 ? 0 : j + 1] ? 1 : 0;
          counter += grid2[i][j == height - 1 ? 0 : j + 1] ? 1 : 0;
          counter += grid2[i == width - 1 ? 0 : i + 1][j == height - 1 ? 0 : j + 1] ? 1 : 0;
          if (grid2[i][j]) {
            if (counter != 2 && counter != 3) {
              grid1[i][j] = false;
            }
          } else {
            if (counter == 3) {
              grid1[i][j] = true;
            }
          }
        }
      }
    }
    var drawGlife = function () {
      for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
          if (grid1[i][j]) {
            drawPoint(i, j);
          }
        }
      }
    }
    setInterval(function () {
      ctx.clearRect(0, 0, width, height);
      if (active){
        stepGlife();
        drawGlife();
      }
    }, 1000 / speed);

    listener.sequence_combo('left right left right', function () {
      canvas.style.display = canvas.style.display == "none" ? "" : "none";
      active = active ? false : true;
    }, true);
    
    listener.sequence_combo('up down up down', function () {
      resetGrid();
    }, true);
  }

  loadScript('https://raw.githubusercontent.com/dmauro/Keypress/development/keypress.js', function () {
    listener = new window.keypress.Listener();
    listener.sequence_combo('down left up right down left up right', function () {
      if (!started){
        started = true;
        glife();
      }
    }, true);
  });
}
glifeScope();
