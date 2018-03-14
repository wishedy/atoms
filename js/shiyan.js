$(document).ready(function(){
    var t = {};
    t.zr = zrender.init(document.getElementById("container"));
    t.panelW = 400;
    t.panelH = 270;
    t.innerW = 230;
    t.innerH = 150;
    t.atomW = 4;
    t.atomH = 4;
    t.Particles = [];
    t.panel = new zrender.Rect({
        shape: {
            width: 400,
            height: 270
        },
        style: {
            fill: 'none',
            stroke: 'none'
        }
    });
    t.zr.add(t.panel);
    var maxX = 0;
    var maxY = 0;
    var minX = 0;
    var minY = 0;
    for (var i = 0; i < t.panelW; i += t.atomW) {
        for (var j = 0; j < t.panelH; j += t.atomH) {
            // var atom = t.createAtoms(, t.atomW, t.atomH);
            if((i - (t.atomW / 2))>maxX){
                maxX = i - t.atomW / 2;
            }
            if(minY>(j - (t.atomH / 2))){
                minY = j - t.atomH / 2;
            }
            if(minX>(i - (t.atomW / 2))){
                minX = i - t.atomW / 2;
            }
            if((j - (t.atomH / 2))>maxY){
                maxY = j - t.atomH / 2;
            }
            /*var atom = {
                x: i - t.atomW / 2, y: j - t.atomH / 2, z: 10, w: t.atomW, h: t.atomH, rect: new zrender.Image(
                    {
                        'style': {x: i - t.atomW / 2, y: j - t.atomH / 2, width: t.atomW, height: t.atomH, image: "../image/home.jpg"}
                    }
                )
            };
            t.zr.add(atom.rect);
            t.Particles.push(atom);*/

        }
    }
    console.log(maxX,minX,maxY,minY);
    var c = (t.panelW-t.innerW)/2;//x轴的切分运动
    var disX = Math.floor(c/t.atomW)*t.atomW;
    var a = - t.atomW / 2+disX;
    var b = maxX-disX;
    var p = .3;
    var e = (t.panelH-t.innerH)*p;
    var f = (t.panelH-t.innerH)*(1-p);
    var disYt = Math.floor(e/t.atomH)*t.atomH;
    var disYb = Math.floor(f/t.atomH)*t.atomH;
    var g = -t.atomH/2+disYt;
    var h = maxY-disYb;
    for (var si = 0; si < t.panelW; si += t.atomW) {
        for (var sj = 0; sj < t.panelH; sj += t.atomH) {
            var nowX = (si - (t.atomW/2));
            var nowY = (sj - (t.atomH / 2));
            if((nowX>=a)&&(nowY>=g)&&(nowX<=b)&&(nowY<=h)){
                var rect = new zrender.Image(
                    {
                        'style': {x: nowX, y: nowY, width: t.atomW, height: t.atomH, image: "../image/home.jpg"}
                    }
                );
                t.zr.add(rect);
                //t.Particles.push();
            }
        }
    }

    console.log(a+'x轴坐标左侧');
    console.log(b+'x轴坐标右侧');
    console.log(g+'y轴坐标上');
    console.log(h+'x轴坐标下');
    console.log('x轴距离'+c);
    console.log('y轴上距离'+disYt);
    console.log('y轴下距离'+disYb);
    console.log(g+Math.floor((t.innerH/2+disYt)/t.atomH)*t.atomH-t.atomH/2);
    console.log(g+Math.floor(t.panelH/(2*t.atomH))*t.atomH-t.atomH/2);
    console.log((t.panelW-t.atomW)/2);
    console.log((t.panelW-t.atomW)/2);
    console.log(t.Particles)
});