//want more? make a pull request!
var text = [
    "АЛИЕН",
    "AMAZING",
    "REFRESHING",
    "NEW",
    "GIVE ME",
    "CREATE",
    "DEBUGGING",
    "ALL THOSE",
    "FALSE",
    "GREAT",
    "OLD",
    "RECENT",
    "FUNNY",
    "CYBER",
    "GENERATE",
    "35c3",
    "VIRTUAL",
    "DIGITAL",
    "BINARY",
    "ENCRYPTED",
    "BUGGY",
    "GLITCHED",
    "PIXELATED",
    "RETRO",
    "NOT MY",
    "SAVED",
    "DESTROYED",
    "CORRUPTED",
    "LASTING",
    "BRING BACK",
    "PLEASANT",
    "FLASH",
    "RANDOM ACCESS",
    "READ ONLY",
    "RECURSIVE",
    "SIDELOADED",
    "ANALOG",
    "THE BEST",
    "<3 THESE",
    "BEAUTIFUL",
    "MISSING",
    "TRUE",
    "FUZZY",
    "RELIVE"
    ];



//initial settings
var fak = 2;
var sz = 30*fak;
var rst = 100*fak;
var strokeW = 3*fak;


//start Paper.js project
paper.install(window);
window.onload = function() {
    paper.setup('myCanvas');
    generate();
}

//generation routine
function generate(){
    project.clear();

    //group for the complete circuit and text
    im = new Group();

    //helper rectangle for later calculations. Describes the whole drawing area 
    rectangle = new Rectangle(new Point(0, 0), new Size(1754,1241));
    
    //groups for intersections and symbol places for later use
    intersections = [];
    places = [];

    //displayed text
    var usertext = document.getElementById('usertext').value;
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
    }else{
        message.content = usertext;
    }
    im.addChild(message);

    //generate circuit paths
    var line1 = line(5);
    var line2 = line(7);
    
    //generate circuit paths around text
    var textRW = raster(rnd(message.bounds.width*2+rst, rectangle.width/2));
    var textRH = raster(rnd(message.bounds.height*2+rst, rectangle.height/2));
    var distW = raster(rnd(rst, rectangle.width - textRW) );
    var distH = raster(rnd(rst, rectangle.height - textRH) );
        
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
    var canvas = document.getElementById("myCanvas"); 
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

function downloadSVG(){
    var svg = project.exportSVG({ asString: true });    
    var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
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
    grd.addColorStop(0,'#0084b0');
    grd.addColorStop(1,'#00a356');
    ctx.fillStyle=grd;
    ctx.fillRect(0,0,rectangle.width,rectangle.height);

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,papercan.width,papercan.height);

    console.log(paper.project.exportSVG());
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
    
    
        var choose = rnd(0,9);
        switch(choose){
            case 0:
                lamp(curve, curveLocation, place, norm);
                break;
            case 1:
                resistor(curve, curveLocation, place, norm);
                break;
            case 2:
                diode(curve, curveLocation, place, norm);
                break;
            case 3:
                schalter(curve, curveLocation, place, norm);
                break;
            case 4:
                fuse(curve, curveLocation, place, norm);
                break;
            case 5:
                capacitor(curve, curveLocation, place, norm);
                break;
            case 6:
                zigzag(curve, curveLocation, place, norm);
                break;
            case 7:
                powersource(curve, curveLocation, place, norm);
                break;
            case 8:
                coil(curve, curveLocation, place, norm);
                break;
            case 9:
                capacitor2(curve, curveLocation, place, norm);
                break;
        }
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
    norm.x = Math.abs(norm.x);
    norm.y = Math.abs(norm.y);
    var w = 10*fak;
    var h = 10*fak;
    if(norm.x==1){
        h = 20*fak;
    }else{
        w = 20*fak;
    }
    var resistor = new Path.Rectangle(place.subtract(new Point(w,h) ), new Size(w*2,h*2));
    addStyle(resistor);
    console.debug(im.bounds);

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
    if(norm.x==1 || norm.x==-1){

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

    if(norm.x==1 || norm.x==-1){
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
   
    if(norm.x==1 || norm.x==-1){
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
    if(norm.x==1 || norm.x==-1){
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
    norm.x = Math.abs(norm.x);
    norm.y = Math.abs(norm.y);
    var w = 10*fak;
    var h = 10*fak;
    if(norm.x==1){
        h = 20*fak;
    }else{
        w = 20*fak;
    }
    var resistor = new Path.Rectangle(place.subtract(new Point(w,h)), new Size(w*2,h*2));
    addStyle(resistor);

    drawWire(20*fak,curve,curveLocation);
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
    var n = 10;

    if(norm.x==1 || norm.x==-1){
        var h1 = new Point(0, -n);
        var h2 = new Point(0, n);
        c.add(new Point(place.add(new Point(0, -20).multiply(fak))));
        c.add(new Segment(place.add(new Point(-n*norm.x, -15).multiply(fak)), h1, h2));
        c.add(new Point(place.add(new Point(0,-10).multiply(fak))));
        c.add(new Segment(place.add(new Point(-n*norm.x, -5).multiply(fak)), h1, h2));
        c.add(new Point(place.add(new Point(0, 0).multiply(fak))));
        c.add(new Segment(place.add(new Point(-n*norm.x, 5).multiply(fak)), h1, h2));
        c.add(new Point(place.add(new Point(0, 10).multiply(fak))));
        c.add(new Segment(place.add(new Point(-n*norm.x, 15).multiply(fak)), h1, h2));
        c.add(new Point(place.add(new Point(0, 20).multiply(fak))));
    }else{
        var h1 = new Point(-n, 0);
        var h2 = new Point(n, 0);
        c.add(new Point(place.add(new Point(-20, 0).multiply(fak))));
        c.add(new Segment(place.add(new Point(-15,-n*norm.y).multiply(fak)), h1, h2));
        c.add(new Point(place.add(new Point(-10, 0).multiply(fak))));
        c.add(new Segment(place.add(new Point(-5,-n*norm.y).multiply(fak)), h1, h2));
        c.add(new Point(place.add(new Point(0, 0).multiply(fak))));
        c.add(new Segment(place.add(new Point(5,-n*norm.y).multiply(fak)), h1, h2));
        c.add(new Point(place.add(new Point(10, 0).multiply(fak))));
        c.add(new Segment(place.add(new Point(15,-n*norm.y).multiply(fak)), h1, h2));
        c.add(new Point(place.add(new Point(20, 0).multiply(fak))));
    }
    addStyle(c);
    drawWire(20*fak,curve,curveLocation);
}

function powersource(curve, curveLocation, place, norm){
    var lamp = new Path.Circle(place, 20*fak);
    addStyle(lamp);
    
    var l1 = new Path();
    l1.add(place.add( new Point(-20, 0).multiply(fak)));
    l1.add(place.add(new Point(20, 0).multiply(fak)));
    addStyle(l1);
    
    drawWire(20*fak,curve,curveLocation);
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

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
