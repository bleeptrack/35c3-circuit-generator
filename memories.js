//want more? make a pull request!
var text = [
    "35c3",
    "<3 THESE",
    "ALL THOSE",
    "AMAZING",
    "ANALOG",
    "ARCHIVED",
    "BEAUTIFUL",
    "BINARY",
    "BRING BACK",
    "BUGGY",
    "COLLECTIVE",
    "CORE",
    "CORRUPTED",
    "CREATE",
    "CYBER",
    "DEBUGGING",
    "DESTROYED",
    "DIGITAL",
    "ELECTRICALLY ERASABLE",
    "ELECTRIFYING",
    "ELECTRONIC",
    "ENCRYPTED",
    "ERASED",
    "EXCELLENT",
    "FALSE",
    "FAMILY",
    "FLASH",
    "FLUFFY",
    "FORGOTTEN",
    "FREQUENT",
    "FUNNY",
    "FUTURE",
    "FUZZY",
    "GENERATE",
    "GIVE ME",
    "GLITCHED",
    "GREAT",
    "HACKED",
    "HEARTWARMING",
    "IMMUNOLOGICAL",
    "LASTING",
    "LEAKING",
    "LOADING",
    "LONG-TERM",
    "LOVELY",
    "MATE",
    "MISSING",
    "NEW",
    "NON-VOLATILE",
    "NOT ENOUGH",
    "NOT MY",
    "OLD",
    "ON DISK",
    "OTHER PEOPLE'S",
    "OVERWHELMING",
    "PERMANENT",
    "PIXELATED",
    "PLEASANT",
    "PROGRAMMABLE",
    "PROTECTED",
    "RANDOM ACCESS",
    "READ ONLY",
    "READ WRITE",
    "RECENT",
    "RECURSIVE",
    "REFRESHING",
    "RELIVE",
    "REMEMBERED",
    "REMOTE",
    "REPLACED",
    "RESTORED",
    "RETRO",
    "SAVED",
    "SHOCKING",
    "SHORT-TERM",
    "SIDELOADED",
    "SYNTHETIC",
    "THE BEST",
    "TRUE",
    "UNFORGOTTEN",
    "VIRTUAL",
    "WRITE ONLY"
    ];

// get query strings for text, stroke width and font size
function QueryStringToJSON() {
  var pairs = window.location.search.slice(1).split('&');
  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  return JSON.parse(JSON.stringify(result));
}
var queries = QueryStringToJSON()

//initial settings
var fak = 2;
var sz = parseInt(queries.fontsize) || 30*fak;
var rst = 100*fak;
var strokeW = parseInt(queries.strokewidth) || 3*fak;

var tt = 0;

//start Paper.js project
paper.install(window);
window.onload = function() {
    paper.setup('myCanvas');
    generate();
}

//generation routine
function generate(){
    project.clear();
    var canvas = document.getElementById("myCanvas");

    //group for the complete circuit and text
    im = new Group();

    //helper rectangle for later calculations. Describes the whole drawing area
    rectangle = new Rectangle(new Point(0, 0), new Size(canvas.width, canvas.height));

    //groups for intersections and symbol places for later use
    intersections = [];
    places = [];

    var usertext
    if (queries.text) {
      document.getElementById('usertext').value = queries.text
    }

    //displayed text
    usertext = document.getElementById('usertext').value;
    var message = new PointText(new Point(0,0));
    message.style = {
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        fontSize: sz,
        fillColor: 'black',
        justification: 'center'
    };
    //check if user wants own text
    if(usertext==null || usertext==""){
        message.content = choose(text) + "\nMEMORIES";
        //message.content = text[tt++] + "\nMEMORIES";
        console.debug(message.content);
    }else{
        message.content = usertext;
    }
    im.addChild(message);

    //generate circuit paths
    var line1 = line(5);
    var line2 = line(7);

    //generate circuit paths around text
    var textRW = raster(rnd(message.bounds.width+rst*2, message.bounds.width*2+rst));
    var textRH = raster(rnd(message.bounds.height+rst*2, message.bounds.height*2+rst));
    var distW = raster(rnd(0, rectangle.width - textRW) );
    var distH = raster(rnd(0, rectangle.height - textRH) );
    console.debug(message.bounds);
    console.debug(message.bounds.width+rst);
    console.debug(message.bounds.width*2+rst);

    var textbox = new Path.Rectangle(new Point(distW,distH), new Size(textRW, textRH) );
    message.position = textbox.bounds.center;

    var tmp2 = line2.subtract(textbox);
    line2.remove();
    var tmp3 = tmp2.subtract(line1);
    tmp2.remove();
    var connections = tmp3;

    line1.strokeColor = 'red';
    connections.fillColor = 'orange';
    textbox.fillColor = 'yellow';

    inters(connections, line1);
    inters(textbox, line1);

    var tmp = line1.subtract(textbox);
    line1.remove();
    line1 = tmp;

    //add Symbols and decorative connectors
    placeSymbol(line1);
    placeConnector(line1);
    placeConnector(line1);
    line1.remove();

    addWire(connections, [line1]);

    //remove unused paths
    connections.remove();
    textbox.remove();

    //center circuit
    im.position = rectangle.center;

    //call so canvas is filled!
    paper.view.draw();

    //add green-blue color
    colorWire();

    //copy canvas content to image and present to user
    var imgsrc = canvas.toDataURL("image/png");
    var img = document.getElementById('circuit');
    img.src = imgsrc;
}

function changeWidth(w){
    strokeW = w*fak;
    generate();
}

function changeFontsize(w){
    sz = w*fak;
    generate();
}

function changeScale(w){
    var oldfaktor = fak;
    fak = w;
    sz = sz/oldfaktor*fak;
    rst = rst/oldfaktor*fak;
    strokeW = strokeW/oldfaktor*fak;
    generate();
}

function downloadPNG(){
    var canvas = document.getElementById("myCanvas");
    var downloadLink = document.createElement("a");
    downloadLink.href = canvas.toDataURL("image/png;base64");
    downloadLink.download = "35c3memories.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

var gradientStart = '#0084b0'
var gradientStop = '#00a356'

function downloadSVG(){
    var canvas = document.getElementById("myCanvas");
    var svgGradientAddition = '<defs><linearGradient id="myGrad" x1="0" x2="'
    svgGradientAddition += canvas.width
    svgGradientAddition += '" y1="0" y2="0" gradientUnits="userSpaceOnUse">'
    svgGradientAddition += '<stop stop-color="'
    svgGradientAddition += gradientStart
    svgGradientAddition += '" offset="0"/>'
    svgGradientAddition += '<stop stop-color="'
    svgGradientAddition += gradientStop
    svgGradientAddition += '" offset="1"/>'
    svgGradientAddition += '</linearGradient></defs>'

    var svg = project.exportSVG({ asString: true });
    var modifiedSvg = svg
      .replace(/#000000/g, 'url(#myGrad)')
      .replace('><g ', '>' + svgGradientAddition + '<g ')

    var svgBlob = new Blob([modifiedSvg], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "35c3memories.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function colorWire(){
    var papercan = document.getElementById("myCanvas");
    var ctx = papercan.getContext('2d');

    ctx.drawImage(papercan, 0, 0);
    ctx.globalCompositeOperation = "source-in";

    var grd=ctx.createLinearGradient(0,0,rectangle.width,0);
    grd.addColorStop(0,gradientStart);
    grd.addColorStop(1,gradientStop);
    ctx.fillStyle=grd;
    ctx.fillRect(0,0,rectangle.width,rectangle.height);

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,papercan.width,papercan.height);
}

function addWire(path, testpaths){
    for(var i = 0; i<path.curves.length; i++){
        var c = path.curves[i];
        var placeit = true;
        for(var j = 0; j<testpaths.length; j++){
            if(testpaths[j].contains(c.point1) && testpaths[j].contains(c.point2)){
                placeit = false;
                break;
            }
        }
        if(placeit){
            placeSymbolCurve(c);
            placeConnectorCurve(c);
        }
    }
}

function placeConnectorCurve(curve){
    var curveLocation = rnd(40*fak,curve.length-40*fak);
    var place = curve.getPointAt(curveLocation);
    var lonelyplace = true;
    var occupied = places.concat(intersections);

    for(var i = 0; i<occupied.length; i++){
        var distvec = occupied[i].subtract(place);
        if(distvec.length < 55*fak){
            lonelyplace = false;
        }
    }

    if(lonelyplace){
        places.push(place);
        var norm = curve.getNormalAt(curveLocation);
        var place2 = place.add( norm.multiply( rnd(20*fak,40*fak) ) );

        circle(place);

        var l = new Path.Line(place, place2);
        addStyle(l);

        var choose = rnd(0,1);
        if(choose == 0){
            norm = new Point(norm.y, norm.x);
            place2 = place2.add( norm.multiply( rnd(10*fak,30*fak) ) );
            l.add(place2);
        }

        var bigCircle = new Path.Circle(place2.add( norm.multiply(6*fak) ),6*fak);
        addStyle(bigCircle);
    }
}

function addStyle(path){
    path.strokeWidth = strokeW;
    path.strokeColor = 'black';
    path.strokeCap = 'round';
    im.addChild(path);
}

function placeSymbolCurve(curve){
    var curveLocation = rnd(30*fak,curve.length-30*fak);
    var place = curve.getPointAt(curveLocation);
    var lonelyplace = true;
    var occupied = places.concat(intersections);

    for(var i = 0; i<occupied.length; i++){
        var distvec = occupied[i].subtract(place);
        if(distvec.length < 50*fak){
            lonelyplace = false;
        }
    }

    if(curve.length<rst){
        lonelyplace = false;
    }

    if(lonelyplace){
        places.push(place);
        var norm = curve.getNormalAt(curveLocation);

        var symbolCreators = [
            battery,
            capacitor,
            capacitor2,
            coil,
            constantCurrentSupply,
            constantVoltageSupply,
            diode,
            fuse,
            horn,
            lamp,
            led,
            logicalNot,
            photoResistor,
            relais,
            resistor,
            schalter,
            zigzag
        ];
        var choose = rnd(0, symbolCreators.length - 1);
        symbolCreators[choose](curve, curveLocation, place, norm);
    }else{
        blank(curve);
    }
}

function placeConnector(path){
    for(var i = 0; i<path.curves.length; i++){
        placeConnectorCurve(path.curves[i]);
    }
}

function placeSymbol(path){
    for(var i = 0; i<path.curves.length; i++){
        placeSymbolCurve(path.curves[i]);
    }
}

function blank(curve){
    var wire = new Path();
    wire.add(curve.point1);
    wire.add(curve.point2);
    addStyle(wire);
}

function fuse(curve, curveLocation, place, norm){
    var w = 10*fak;
    var h = 10*fak;
    if (Math.abs(norm.x) > 0.9) {
        h = 20*fak;
    }else{
        w = 20*fak;
    }
    var resistor = new Path.Rectangle(place.subtract(new Point(w,h) ), new Size(w*2,h*2));
    addStyle(resistor);

    blank(curve);
}

function schalter(curve, curveLocation, place, norm){
    var p1 = curve.getPointAt(curveLocation-20*fak);
    var p2 = curve.getPointAt(curveLocation+20*fak);
    var line = new Path();
    line.add(p1);
    line.add(p2.add( norm.multiply(20*fak) ));
    addStyle(line);

    circle(curve.getPointAt(curveLocation-20*fak));
    circle(curve.getPointAt(curveLocation+20*fak));

    drawWire(20*fak,curve,curveLocation);
}

function capacitor(curve, curveLocation, place, norm){
    var line1 = new Path();
    var line2 = new Path();
    if (Math.abs(norm.x) > 0.9) {
        line1.add(place.subtract( new Point(-20,-7).multiply(norm.x*fak) ) );
        line1.add(place.subtract( new Point(20,-7).multiply(norm.x*fak) ) );

        line2.add(place.subtract( new Point(-20,7).multiply(norm.x*fak) ) );
        line2.add(place.subtract( new Point(20,7).multiply(norm.x*fak) ) );
    }else{
        line1.add(place.subtract( new Point(-7,-20).multiply(norm.y*fak) ) );
        line1.add(place.subtract( new Point(-7,20).multiply(norm.y*fak) ) );

        line2.add(place.subtract( new Point(7,-20).multiply(norm.y*fak) ) );
        line2.add(place.subtract( new Point(7,20).multiply(norm.y*fak) ) );
    }
    addStyle(line1);
    addStyle(line2);

    drawWire(7*fak,curve,curveLocation);
}

function capacitor2(curve, curveLocation, place, norm){
    var rect1;
    var rect2;

    if (Math.abs(norm.x) > 0.9) {
        rect1 = new Path.Rectangle(place.add(new Point(-20,-14+3.5).multiply(fak)), new Size(40, 7).multiply(fak));
        rect2 = new Path.Rectangle(place.add(new Point(-20,5).multiply(fak)), new Size(40, 7).multiply(fak));
    }else{
        rect1 = new Path.Rectangle(place.add(new Point(-14+3.5,-20).multiply(fak)), new Size(7, 40).multiply(fak));
        rect2 = new Path.Rectangle(place.add(new Point(5,-20).multiply(fak)), new Size(7, 40).multiply(fak));
    }

    rect2.fillColor = 'black';
    addStyle(rect1);
    addStyle(rect2);

    drawWire(12*fak,curve,curveLocation);
}

function zigzag(curve, curveLocation, place, norm){
    var triangle = new Path();

    if (Math.abs(norm.x) > 0.9) {
        triangle.add(place.subtract(new Point(0,-25).multiply(fak)));
        triangle.add(place.subtract(new Point(-10,-20).multiply(fak)));
        triangle.add(place.subtract(new Point(10,-10).multiply(fak)));
        triangle.add(place.subtract(new Point(-10,0).multiply(fak)));
        triangle.add(place.subtract(new Point(10,10).multiply(fak)));
        triangle.add(place.subtract(new Point(-10,20).multiply(fak)));
        triangle.add(place.subtract(new Point(0,25).multiply(fak)));
    }else{
        triangle.add(place.subtract(new Point(-25,0).multiply(fak)));
        triangle.add(place.subtract(new Point(-20,-10).multiply(fak)));
        triangle.add(place.subtract(new Point(-10,10).multiply(fak)));
        triangle.add(place.subtract(new Point(0,-10).multiply(fak)));
        triangle.add(place.subtract(new Point(10,10).multiply(fak)));
        triangle.add(place.subtract(new Point(20,-10).multiply(fak)));
        triangle.add(place.subtract(new Point(25,0).multiply(fak)));
    }

    addStyle(triangle);

   drawWire(25*fak,curve,curveLocation);
}

function diode(curve, curveLocation, place, norm){
    var triangle = new Path();
    var line = new Path();
    if (Math.abs(norm.x) > 0.9) {
        triangle.add(place.subtract(new Point(-10,0).multiply(fak)));
        triangle.add(place.subtract(new Point(10,0).multiply(fak)));
        triangle.add(place.subtract(new Point(0,20).multiply(norm.x*fak)));

        line.add(place.subtract(new Point(-10,20).multiply(norm.x*fak)));
        line.add(place.subtract(new Point(10,20).multiply(norm.x*fak)));
        drawWire(10*fak,curve,curveLocation-10*fak);
    }else{
        triangle.add(place.subtract(new Point(0,-10).multiply(fak)));
        triangle.add(place.subtract(new Point(0,10).multiply(fak)));
        triangle.add(place.subtract(new Point(20,0).multiply(norm.y*fak)));

        line.add(place.subtract(new Point(20,-10).multiply(norm.y*fak)));
        line.add(place.subtract(new Point(20,10).multiply(norm.y*fak)));
        drawWire(10*fak,curve,curveLocation+10*fak);
    }
    triangle.closed = true;
    addStyle(line);
    addStyle(triangle);
}

function resistor(curve, curveLocation, place, norm){
    var w = 10*fak;
    var h = 10*fak;
    if (Math.abs(norm.x) > 0.9) {
        h = 20*fak;
    }else{
        w = 20*fak;
    }
    var resistor = new Path.Rectangle(place.subtract(new Point(w,h)), new Size(w*2,h*2));
    addStyle(resistor);

    drawWire(20*fak,curve,curveLocation);
}

function photoResistor(curve, curveLocation, place, norm) {
  var arrow1;
  var arrow2;

  if (Math.abs(norm.x) > 0.9) {
      // Place on vertical line
      arrow1 = arrowTo(place.subtract((new Point(-15, -12).multiply(norm.x * fak))), norm);
      arrow2 = arrowTo(place.subtract((new Point(-15, 0).multiply(norm.x * fak))), norm);
  } else {
      // Place on horizontal line
      arrow1 = arrowTo(place.subtract((new Point(-12, 15).multiply(norm.y * fak))), norm);
      arrow2 = arrowTo(place.subtract((new Point(0, 15).multiply(norm.y * fak))), norm);
  }

  resistor(curve, curveLocation, place, norm)
  for (var i in arrow1) {
      addStyle(arrow1[i])
  }
  for (var i in arrow2) {
      addStyle(arrow2[i])
  }
}

function relais(curve, curveLocation, place, norm){
    var width = 20;
    var height = 12;
    var baseSize;
    if (Math.abs(norm.x) > 0.9) {
      baseSize = new Size(width, height).multiply(fak);
    } else {
      baseSize = new Size(height, width).multiply(fak);
    }
    var path = new Path.Rectangle(
      place.subtract(baseSize),
      baseSize.multiply(2)
    );
    addStyle(path);

    drawWire(height*fak,curve,curveLocation);
}

function logicalNot(curve, curveLocation, place, norm) {
  var boxWidth = 15;
  var dotSize = 5;

  var inDirection = norm.rotate(90).multiply(fak);

  var boxSize = new Size(boxWidth, boxWidth).multiply(fak);
  var boxPath = new Path.Rectangle(
    place.subtract(boxSize).subtract(inDirection.multiply(dotSize)),
    boxSize.multiply(2)
  );
  addStyle(boxPath);

  var dotPath = new Path.Circle(
    place.add(inDirection.multiply(boxWidth)),
    dotSize*fak
  );
  addStyle(dotPath);

  drawWire((boxWidth + dotSize)*fak, curve, curveLocation);
}

function lamp(curve, curveLocation, place, norm){
    var lamp = new Path.Circle(place, 20*fak);
    addStyle(lamp);

    var l1 = new Path();
    l1.add(place.add( new Point(0.707*20, 0.707*20).multiply(fak)));
    l1.add(place.add(new Point(-0.707*20, -0.707*20).multiply(fak)));
    addStyle(l1);

    var l2 = new Path();
    l2.add(place.add(new Point(0.707*20, -0.707*20).multiply(fak)));
    l2.add(place.add(new Point(-0.707*20, 0.707*20).multiply(fak)));
    addStyle(l2);

    drawWire(20*fak,curve,curveLocation);
}

function coil(curve, curveLocation, place, norm){
    var c = new Path();

    if (Math.abs(norm.x) > 0.9) {
        c.add(new Segment(place.subtract(new Point(0,-20).multiply(fak)), null, norm.multiply(10*fak)));
        c.add(new Segment(place.subtract(new Point(0,-10).multiply(fak)), norm.multiply(10*fak), norm.multiply(10*fak)));
        c.add(new Segment(place.subtract(new Point(0,0).multiply(fak)), norm.multiply(10*fak), norm.multiply(10*fak)));
        c.add(new Segment(place.subtract(new Point(0,10).multiply(fak)), norm.multiply(10*fak), norm.multiply(10*fak)));
        c.add(new Segment(place.subtract(new Point(0,20).multiply(fak)), norm.multiply(10*fak), null));
    }else{
        c.add(new Segment(place.subtract(new Point(-20,0).multiply(fak)), null, norm.multiply(10*fak)));
        c.add(new Segment(place.subtract(new Point(-10,0).multiply(fak)), norm.multiply(10*fak), norm.multiply(10*fak)));
        c.add(new Segment(place.subtract(new Point(0,0).multiply(fak)), norm.multiply(10*fak), norm.multiply(10*fak)));
        c.add(new Segment(place.subtract(new Point(10,0).multiply(fak)), norm.multiply(10*fak), norm.multiply(10*fak)));
        c.add(new Segment(place.subtract(new Point(20,0).multiply(fak)), norm.multiply(10*fak), null));
    }
    addStyle(c);
    drawWire(20*fak,curve,curveLocation);
}

function constantCurrentSupply(curve, curveLocation, place, norm){
    var lamp = new Path.Circle(place, 20*fak);
    addStyle(lamp);

    var l1 = new Path();
    var p1 = new Point(norm.x * 20, norm.y * 20);
    var p2 = new Point(norm.x * -20, norm.y * -20);
    l1.add(place.add(p1.multiply(fak)));
    l1.add(place.add(p2.multiply(fak)));
    addStyle(l1);

    drawWire(20*fak,curve,curveLocation);
}

function constantVoltageSupply(curve, curveLocation, place, norm){
    var lamp = new Path.Circle(place, 20*fak);
    addStyle(lamp);

    blank(curve);
}

/**
 * Draw a battery symbol
 */
function battery(curve, curveLocation, place, norm) {
    var longLine = new Path();
    var shortLine = new Path();
    if (Math.abs(norm.x) > 0.9) {
        // Place on vertical line
        longLine.add(place.subtract(new Point(-20, -7).multiply(norm.x * fak)));
        longLine.add(place.subtract(new Point(20, -7).multiply(norm.x * fak)));

        shortLine.add(place.subtract(new Point(-10, 7).multiply(norm.x * fak)));
        shortLine.add(place.subtract(new Point(10, 7).multiply(norm.x * fak)));
    } else {
        // Place on horizontal line
        longLine.add(place.subtract(new Point(-7, -20).multiply(norm.y * fak)));
        longLine.add(place.subtract(new Point(-7, 20).multiply(norm.y * fak)));

        shortLine.add(place.subtract(new Point(7, -10).multiply(norm.y * fak)));
        shortLine.add(place.subtract(new Point(7, 10).multiply(norm.y * fak)));
    }
    addStyle(longLine);
    addStyle(shortLine);

    drawWire(7 * fak, curve, curveLocation);
}

function horn(curve, curveLocation, place, norm) {
    var lineDistance = 4;
    var hornDistance = 10;
    var hornHeight = 18;
    var hornWidth = 25;

    var triangle = new Path();
    if (Math.abs(norm.x) > 0.9) {
        triangle.add(place.subtract(new Point(hornDistance, -hornWidth / 2).multiply(norm.x * fak)));
        triangle.add(place.subtract(new Point(hornDistance, hornWidth / 2).multiply(norm.x * fak)));
        triangle.add(place.subtract(new Point(hornDistance + hornHeight,0).multiply(norm.x * fak)));
    }else{
        triangle.add(place.subtract(new Point(-hornWidth / 2, hornDistance).multiply(norm.y * fak)));
        triangle.add(place.subtract(new Point(hornWidth / 2, hornDistance).multiply(norm.y * fak)));
        triangle.add(place.subtract(new Point(0, hornDistance + hornHeight).multiply(norm.y * fak)));
    }
    triangle.closed = true;
    addStyle(triangle);

    symbolBase(hornDistance, lineDistance, curve, curveLocation, place, norm);
}

/**
 * Draw an LED
 */
function led(curve, curveLocation, place, norm) {
    var arrow1;
    var arrow2;

    if (Math.abs(norm.x) > 0.9) {
        // Place on vertical line
        arrow1 = arrowTo(place.subtract((new Point(22, 20).multiply(norm.x * fak))), norm);
        arrow2 = arrowTo(place.subtract((new Point(25, 8).multiply(norm.x * fak))), norm);
    } else {
        // Place on horizontal line
        arrow1 = arrowTo(place.subtract((new Point(20, -22).multiply(norm.y * fak))), norm);
        arrow2 = arrowTo(place.subtract((new Point(8, -25).multiply(norm.y * fak))), norm);
    }

    diode(curve, curveLocation, place, norm);
    for (var i in arrow1) {
        addStyle(arrow1[i])
    }
    for (var i in arrow2) {
        addStyle(arrow2[i])
    }
}

/**
 * Creates a small arrow for the LED
 *
 * @param target Target of arrow
 * @returns {Path[]}
 */
function arrowTo(target, norm) {
    var line = new Path();
    var tip = new Path();

    if (Math.abs(norm.x) > 0.9) {
        line.add(target.subtract((new Point(-7, -7).multiply(norm.x * fak))));
        line.add(target);

        tip.add(target.subtract((new Point(0, -5).multiply(norm.x * fak))));
        tip.add(target);
        tip.add(target.subtract((new Point(-5, 0).multiply(norm.x * fak))));
    } else {
        line.add(target.subtract((new Point(-7, 7).multiply(norm.y * fak))));
        line.add(target);

        tip.add(target.subtract((new Point(-5, 0).multiply(norm.y * fak))));
        tip.add(target);
        tip.add(target.subtract((new Point(0, 5).multiply(norm.y * fak))));
    }

    return [line, tip];
}

function drawWire(size, curve, curveLocation){
    var p1 = new Path();
    p1.add(curve.point1);
    p1.add(curve.getPointAt(curveLocation-size));
    addStyle(p1);

    var p2 = new Path();
    p2.add(curve.getPointAt(curveLocation+size));
    p2.add(curve.point2);
    addStyle(p2);
}

function symbolBase(distanceFromLine, lineDistance, curve, curveLocation, place, norm) {
    var line1 = new Path();
    var line2 = new Path();
    if (Math.abs(norm.x) > 0.9) {
      line1.add(place.subtract(new Point(distanceFromLine,-lineDistance).multiply(norm.x * fak)));
      line1.add(place.subtract(new Point(0,-lineDistance).multiply(norm.x * fak)));
      line2.add(place.subtract(new Point(distanceFromLine,lineDistance).multiply(norm.x * fak)));
      line2.add(place.subtract(new Point(0,lineDistance).multiply(norm.x * fak)));
    }else{
      line1.add(place.subtract(new Point(-lineDistance, distanceFromLine).multiply(norm.y * fak)));
      line1.add(place.subtract(new Point(-lineDistance, 0).multiply(norm.y * fak)));
      line2.add(place.subtract(new Point(lineDistance, distanceFromLine).multiply(norm.y * fak)));
      line2.add(place.subtract(new Point(lineDistance, 0).multiply(norm.y * fak)));
    }
    addStyle(line1);
    addStyle(line2);

  drawWire(lineDistance * 1.5 * fak, curve, curveLocation);
}

function rnd(min, max) {
    var mi = min;
    var ma = max;
    if(min>max){
        mi = max;
        ma = min;
    }
    return Math.floor(Math.random() * (ma - mi + 1)) + mi;
}

function inters(p1, p2){
    var inters = p1.getIntersections(p2);
    for (var i = 0; i < inters.length; i++) {
        circle(inters[i].point);
        intersections.push(inters[i].point);
    }
}

function circle(point){
    var intersectionPath = new Path.Circle({
            center: point,
            radius: 6*fak,
            fillColor: 'black'
        });
    im.addChild(intersectionPath);
}

function line(nbr){
    var lineShape = new Path();
    for(var i = 0; i<nbr; i++){
        var textRW = raster(rnd(rectangle.width/3, rectangle.width/2));
        var textRH = raster(rnd(rectangle.height/3, rectangle.height/2));
        var distW = raster(rnd(rst, rectangle.width - textRW) )-rst/2;
        var distH = raster(rnd(rst, rectangle.height - textRH) )-rst/2;

        var textRect = new Path.Rectangle(new Point(distW,distH), new Size(textRW, textRH) );

        var tmp = lineShape.unite(textRect);
        lineShape.remove();
        textRect.remove();
        lineShape = tmp;
    }
    lineShape.strokeColor = 'black';
    return lineShape;
}

function raster(val){
    return Math.floor(val/rst)*rst;
}

function choose(arr){
    return arr[rnd(0,arr.length-1)];
}
