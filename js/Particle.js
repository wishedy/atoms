var Particle = {
    init:function(opt){
         var t = this;
         t.opt = opt;
         t.initPanel();

    },
    initPanel:function(){
        var t = this;
        t.zr = zrender.init(document.getElementById(t.opt.particlePanel));
        var circle = new zrender.Rect({
            shape: {
                width:t.panelW,
                height:t.panelH
            },
            style: {
                fill: 'none',
                stroke: 'none'
            }
        });
        t.zr.add(circle);
        t.getAtoms();
    },
    createAtoms:function(x,y,z,w,h){
        var t = this;
        var radius = t.focallength / (Math.random() * t.focallength * 3);
        return {
            x: x,
            y: y,
            z: z,
            locx: parseInt(Math.random() * t.panelW),
            locy: parseInt(Math.random() * t.panelW),
            locz: Math.random() * t.focallength * 2 - t.focallength,
            w: w*radius*.2,
            h: h*radius*.2,
            rect:new zrender.Image(
                {
                    'style': { x: x, y: y,width:0,height:0, image:"image/home.jpg"}
                }
            )
        }
    },
    getAtoms:function(){
        var t = this;
        for (var i = 0; i < t.panelW; i += t.atomW) {
            for (var j = 0; j < t.panelH; j += t.atomH) {
                var atom = t.createAtoms(i - t.atomW/2, j - t.atomH/2, 10,t.atomW, t.atomH);
                t.Particles.push(atom);
            }
        }
        t.Particles = t.Particles.sort(t.randomSort);
        t.Particles = t.Particles .slice(0,300);
        t.logoDes();
        t.opt.beginFun&&t.opt.beginFun();
        t.getCenterDis();
        t.centerAnimate();
        setTimeout(function(){
            console.log(t.Particles)
        },1000);
        t.startAnimate();
    },
    logoDes:function(){
        var t = this;
        var image = new Image(); //定义一个图片对象
        image.src = 'image/5055ea4d67a3448bb66f6fdffe2259ab.PNG';
        image.onload = function () {
            var nowCanvas = document.createElement("canvas");
            var ctx = nowCanvas.getContext("2d");
            nowCanvas.width = t.panelW;
            nowCanvas.height = t.panelH;
            ctx.clearRect(0, 0, nowCanvas.width, nowCanvas.height);
            ctx.drawImage(image, 0, 0, nowCanvas.width, nowCanvas.height);//将图片从Canvas画布的左上角(0,0)位置开始绘制，大小默认为图片实际大小
            var imgData = ctx.getImageData(0, 0, nowCanvas.width, nowCanvas.height);
            var temArr = [];
            for (var i = 0; i < imgData.width; i += 6) {
                for (var j = 0; j < imgData.height; j += 6) {
                    var num = (j * imgData.width + i) * 4;
                    if (imgData.data[num] < 128) {
                        var dataJson = {
                            disx: i - 3,
                            disy: j - 3,
                            disz: 0
                        };
                        temArr.push(dataJson);
                    }

                }
            }
            temArr = temArr.sort(t.randomSort);
            t.getCenterDis();
            if(temArr.length>t.Particles.length){
                for(var sNum = 0;sNum<temArr.length;sNum++){
                    if(t.Particles[sNum]){
                        t.Particles[sNum].disx = temArr[sNum].disx;
                        t.Particles[sNum].disy = temArr[sNum].disy;
                        t.Particles[sNum].disz = temArr[sNum].disz;
                    }
                }
            }else{
                for(var numRan = 0;numRan<t.Particles.length;numRan++){
                    if(t.Particles[numRan]){
                        t.Particles[numRan].disx = temArr[numRan].disx;
                        t.Particles[numRan].disy = temArr[numRan].disy;
                        t.Particles[numRan].disz = temArr[numRan].disz;
                    }
                }
            }
            /*t.userInfo.index = t.randomNum(0,t.Particles.length);
            t.userInfo.disx = t.Particles[t.userInfo.index].disx;
            t.userInfo.disy = t.Particles[t.userInfo.index].disy;
            t.Particles[t.userInfo.index].rect.style.image = t.userInfo.imgSrc;*/
            /*t.startAnimate();*/
        };
    },
    centerAnimate:function(){
      var t  = this;
        t.zr.add(t.centerImg.rect);
        t.centerImg.rect.animateTo(
            {
                style: {
                    width:t.centerImg.w,
                    height:t.centerImg.h,
                    x:t.centerImg.x,
                    y: t.centerImg.y
                }
            }, 3000, 10, 'linear', function () {
                // done
                console.log("运动结束")
            }
        );
    },
    getCenterDis:function(){
        var t = this;
        t.centerImg.x = t.panelW/2-t.centerImg.w/2;
        t.centerImg.y = t.panelH/2-t.centerImg.h/2;
        t.centerImg.z = 10;//z的数值越大，起点越小
        var scale = 5;
        var atom ={
            x: t.centerImg.x-scale*t.centerImg.w/2,
            y: t.centerImg.y-scale*t.centerImg.h/2 ,
            z: t.centerImg.z,
            w: t.centerImg.w*scale,
            h: t.centerImg.h*scale,
            rect:new zrender.Image(
                {
                    'style': { x: t.centerImg.x, y: t.centerImg.y,width:t.atomW,height:t.atomH, image:t.centerImg.imgSrc}
                }
            )
        } ;
        t.centerImg = atom;
    },
    centerImg:{
        imgSrc: "image/junyong02.jpg",
        w: 32,
        h: 23,
        x:0,
        y:0
    },
    focallength:250,
    Particles:[],
    atomW:8,
    atomH:8,
    panelW:550,
    panelH:300,
    opt:null,
    zr:null
}