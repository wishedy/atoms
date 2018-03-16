var Particle = {
    init:function(opt){
        var t = this;
        t.opt = opt;
        t.opt.beginFun && t.opt.beginFun();
        t.saveImage();
        t.logoImg.h = t.panelH = $(window).width()*t.wThPer;
        t.drawPanel = $("#"+t.opt.particlePanel);
        t.maskPanel = $("#"+t.opt.maskParticle);
        t.drawPanel.height(t.panelH);
        t.maskPanel.height(t.panelH);
        t.drawPanel.parent().height(t.panelH);
        t.drawPanel.next().height(t.panelH);
        //首先初始化画板
        //debugger;
        t.initPanel().createAtoms();
    },
    saveImage:function(){
      var t = this;

    },
    initPanel:function(){
        var t = this;
        t.zr = zrender.init(document.getElementById(t.opt.particlePanel)); //获取承载canvas的元素
        t.maskZr = zrender.init(document.getElementById(t.opt.maskParticle)); //获取承载canvas的元素
        t.panel = new zrender.Rect({
            shape: {
                width: t.panelW,
                height: t.panelH
            },
            style: {
                fill: 'none',
                stroke: 'none'
            }
        });
        t.zr.add(t.panel);
        return t;
    },
    getUserAtom:function(x,y,z,w,h){
        var t = this;
        var radius = 1300;
        return {
            x: x,
            y: y,
            z: z,
            locx: parseInt($(window).width())-w * radius*t.scaleRatio,
            locy: parseInt($("#"+t.opt.particlePanel).height())-h * radius*t.scaleRatio,
            locz: t.focallength * 2,
            w: w * radius*t.scaleRatio,
            h: h * radius*t.scaleRatio,
            rect: new zrender.Image(
                {
                    'style': {x: x, y: y, width: 0, height: 0, image:''}
                }
            )
        }
    },
    getAtom:function(x,y,z,w,h){
      var t = this;
        var radius = t.focallength / (Math.random() * t.focallength * 2);
        if(radius>300){
            radius = 300;
        }
        var imgSrcArr = ['image/01.jpeg', 'image/02.jpg', 'image/03.jpg', 'image/04.jpeg', 'image/05.jpg', 'image/06.jpg', 'image/07.jpg', 'image/08.jpg', 'image/09.jpg', 'image/10.jpg', 'image/11.jpg', 'image/12.jpg', 'image/13.jpg', 'image/14.jpeg', 'image/15.jpg', 'image/16.jpg', 'image/17.jpg', 'image/18.jpg', 'image/19.jpg', 'image/20.jpg', 'image/21.jpg', 'image/22.jpg'];
        var nowSrc = imgSrcArr[t.randomNum(0,imgSrcArr.length-1)];
        return {
            x: x,
            y: y,
            z: z,
            locx: parseInt(Math.random() * $(window).width()),
            locy: parseInt(Math.random() * $("#"+t.opt.particlePanel).height()),
            locz: Math.random() * t.focallength * 2 - t.focallength,
            w: w * radius*t.scaleRatio,
            h: h * radius*t.scaleRatio,
            rect: new zrender.Image(
                {
                    'style': {x: x, y: y, width: 0, height: 0, image:nowSrc}
                }
            )
        }
    },
    randomNum: function (minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    },
    beginCenter: function () {
        var t = this;
        //debugger;
        var atom = {
            x: t.centerImg.x - t.centerImg.scale * t.centerImg.w / 2,
            y: t.centerImg.y - t.centerImg.scale * t.centerImg.h / 2,
            z: t.centerImg.z,
            w: t.centerImg.w * t.centerImg.scale,
            h: t.centerImg.h * t.centerImg.scale,
            rect: new zrender.Image(
                {
                    'style': {
                        x: t.centerImg.x,
                        y: t.centerImg.y,
                        width: t.atomW,
                        height: t.atomH,
                        image: t.centerImg.imgSrc
                    }
                }
            )
        };
        t.centerImg = atom;
        t.zr.add(atom.rect);
        atom.rect.animateTo(
            {
                style: {
                    width: atom.w,
                    height: atom.h,
                    x: atom.x,
                    y: atom.y
                }
            }, 2000, 10, 'linear', function () {
                atom.rect.hide();
            }
        );
        setTimeout(function () {
            t.calLog();
        }, 1000);

    },
    calLog: function () {
        var t = this;
        var image = new Image(); //定义一个图片对象
        image.src = t.logoImg.imgSrc;
        image.onload = function () {
            var nowCanvas = document.createElement("canvas");
            var ctx = nowCanvas.getContext("2d");
            nowCanvas.width = t.logoImg.w;
            nowCanvas.height = t.logoImg.h;
            ctx.clearRect(0, 0, nowCanvas.width, nowCanvas.height);
            ctx.drawImage(image, 0, 0, nowCanvas.width, nowCanvas.height);//将图片从Canvas画布的左上角(0,0)位置开始绘制，大小默认为图片实际大小
            var imgData = ctx.getImageData(0, 0, nowCanvas.width, nowCanvas.height);
            var temArr = [];
            for (var i = 0; i < imgData.width; i += t.atomW) {
                for (var j = 0; j < imgData.height; j += t.atomH) {
                    var num = (j * imgData.width + i) * 4;
                    if (imgData.data[num] < 128) {
                        var dataJson = {
                            disx: i - t.atomW / 2,
                            disy: j - t.atomW / 2,
                            disz: 0
                        };
                        temArr.push(dataJson);
                    }

                }
            }
            temArr = temArr.sort(t.randomSort);
            if (temArr.length > t.Particles.length) {
                for (var sNum = 0; sNum < temArr.length; sNum++) {
                    if (t.Particles[sNum]) {
                        t.Particles[sNum].disx = temArr[sNum].disx;
                        t.Particles[sNum].disy = temArr[sNum].disy;
                        t.Particles[sNum].disz = temArr[sNum].disz;
                    }
                }
            } else {
                for (var numRan = 0; numRan < t.Particles.length; numRan++) {
                    if (temArr[numRan]) {
                        t.Particles[numRan].disx = temArr[numRan].disx;
                        t.Particles[numRan].disy = temArr[numRan].disy;
                        t.Particles[numRan].disz = temArr[numRan].disz;
                    }
                }
            }
            t.userInfo.disx = t.Particles[t.userInfo.index].disx;
            t.userInfo.disy = t.Particles[t.userInfo.index].disy;
            var scale = 140;
            t.Particles[t.userInfo.index].locx = t.Particles[t.userInfo.index].disx - scale * t.atomW / 2;
            t.Particles[t.userInfo.index].locy = t.Particles[t.userInfo.index].disy - scale * t.atomH / 2;
            t.Particles[t.userInfo.index].w = t.atomW*scale;
            t.Particles[t.userInfo.index].h = t.atomH* scale;
            t.Particles[t.userInfo.index].h = t.atomH* scale;
            t.Particles[t.userInfo.index].rect.style.image = t.userInfo.imgSrc;
            t.startAnimate();
        };
    },
    startAnimate: function () {
        var t = this;
        var sumTime = 0;
        if (t.Play) {
            if (t.section) {
                switch (t.sequence) {
                    case 0:
                        for (var num = 0; num < t.Particles.length; num++) {
                            var item = t.Particles[num];
                            t.zr.add(item.rect);
                            item.rect.animateTo({
                                style: {
                                    width: t.atomW, height: t.atomH,
                                    x: item.x, y: item.y
                                }
                            }, 3000, 10, 'linear', function (e) {
                                // done
                                sumTime++;
                                if (sumTime === t.Particles.length) {
                                    sumTime = 0;
                                    t.section = false;
                                    t.startAnimate();
                                }

                            });
                        }
                        t.maskZr.add(t.Particles[t.userInfo.index].rect);
                        break;
                    case 1:
                        t.Particles[t.userInfo.index].rect.animateTo(
                            {
                                style: {
                                    width: t.Particles[t.userInfo.index].w, height: t.Particles[t.userInfo.index].h,
                                    x: t.Particles[t.userInfo.index].locx, y: t.Particles[t.userInfo.index].locy
                                }
                            }, 2000, 10, 'linear', function () {
                                // done
                                sumTime++;
                                t.Particles[t.userInfo.index].rect.hide();
                            }
                        );
                        setTimeout(function(){
                            for (var numA = 0; numA < t.Particles.length; numA++) {
                                var itemA = t.Particles[numA];
                                if(numA!==t.userInfo.index){
                                    itemA.rect.animateTo(
                                        {
                                            style: {
                                                width: itemA.w, height: itemA.h,
                                                x: itemA.locx, y: itemA.locy
                                            }
                                        }, 3000, 10, 'linear', function () {
                                            // done
                                            sumTime++;
                                            if (sumTime === t.Particles.length) {
                                                sumTime = 0;
                                                t.section = false;
                                                t.startAnimate();
                                            }
                                        }
                                    );
                                }

                            }
                        },500);

                        break;
                    case 2:
                        t.Particles[t.userInfo.index].rect.show();
                        for (var numB = 0; numB < t.Particles.length; numB++) {
                            var itemB = t.Particles[numB];
                            if (itemB.disx && itemB.disy) {
                                itemB.rect.animateTo(
                                    {
                                        style: {
                                            width: t.atomW, height: t.atomH,
                                            x: itemB.disx, y: itemB.disy
                                        }
                                    }, 3000, 10, 'linear', function () {
                                        // done
                                        sumTime++;
                                        if (sumTime === t.Particles.length) {
                                            sumTime = 0;
                                            t.sequence++;
                                            t.section = false;
                                            t.startAnimate();
                                        }
                                    }
                                );
                            } else {
                                sumTime++;
                                itemB.rect.hide();
                            }

                        }
                        break;
                }
            } else {
                if (t.sequence >t.lastSequence) {
                    t.Play = false;
                    t.startAnimate();
                } else {
                    t.sequence++;
                    t.section = true;
                    t.startAnimate();
                }
            }
        }else{
            t.startLight();
            t.startScale();
            t.saveImg();
            t.opt.endFun&&t.opt.endFun();
            return false;
        }
    },
    userInfo: {
        imgSrc: 'image/545177285875040887.png',
        disx: 0,
        disy: 0,
        index: 0
    },
    saveImg:function(){
        var t = this;
        $(".preview").off("touchstart").on("touchstart",function(){
            wx.miniProgram.navigateTo({url: '/pages/preview/preview'})
        });
    },
    startScale: function () {
        var t = this;
        $(".caosAppDrawLarge").show();
        $(".seeMySelf").off("touchstart").on("touchstart", function () {
            $(".caosAppDrawLarge").hide();
            if (t.scaleOnOff) {
                t.scaleOnOff = false;
                $("#CaosAppDrawLight").hide(100);
                for (var numD = 0; numD < t.Particles.length; numD++) {
                    var itemD = t.Particles[numD];
                    if (itemD.disx && itemD.disy) {
                        if(numD===t.userInfo.index){
                            setTimeout(function(){
                                $('#'+t.opt.largeMask).fadeIn();
                            },1500)
                        }
                        var scaleNum = 0;
                        var shift = 0;
                        if(numD===t.userInfo.index){
                            scaleNum = t.userScaleNum*t.scaleNum;
                            shift = .5;
                        }else{
                            scaleNum = t.scaleNum;
                        }
                        itemD.rect.animateTo(
                            {
                                style: {
                                    width: t.atomW *scaleNum,
                                    height: t.atomH * scaleNum,
                                    x: scaleNum * (itemD.disx - t.Particles[t.userInfo.index].disx) + t.panelCenter.x-t.atomW * scaleNum*shift,
                                    y: scaleNum * (itemD.disy - t.Particles[t.userInfo.index].disy) + t.panelCenter.y-t.atomH * scaleNum*shift
                                }
                            }, 2000, 10, 'linear', function () {
                                // done
                                $(".caosAppDrawLarge").show();
                                $(".seeMySelf").delay(1000).html("回看全景").show();
                            }
                        );
                    } else {
                        itemD.rect.hide();
                    }
                }
                //t.Particles[t.userInfo.index].rect.hide();


            } else {
                t.scaleOnOff = true;
                var callBackNum = 0;
                for (var numE = 0; numE < t.Particles.length; numE++) {
                    var itemE = t.Particles[numE];
                    if(numE===t.userInfo.index){
                        $('#'+t.opt.largeMask).fadeOut(1500);
                    }
                    itemE.rect.animateTo(
                        {
                            style: {
                                width: t.atomW,
                                height: t.atomH,
                                x: itemE.disx, y: itemE.disy
                            }
                        }, 1000, 10, 'linear', function () {
                            // done
                            if(callBackNum===0){
                                callBackNum++;
                                $("#CaosAppDrawLight").show(500);
                                $(".caosAppDrawLarge").show();
                                $(".seeMySelf").html("查看我的头像位置").show();
                            }

                        }
                    );
                }
            }
        });
    },
    startLight: function () {
        var t = this;
        $("#"+t.opt.lightEle).append(
            " <canvas id=\"CaosAppDrawLight\" width=\"550\" height=\"300\"></canvas>");
        var canvas = document.getElementById('CaosAppDrawLight');
        var context = canvas.getContext("2d");
        canvas.width = t.logoImg.w;
        canvas.height = t.logoImg.h;
        var radius = 0;
        //画圆
        var drawCircle = function () {
            context.beginPath();
            context.arc(t.userInfo.disx + t.atomW / 2, t.userInfo.disy + t.atomH / 2, radius, 0, Math.PI * 2);
            context.closePath();
            context.lineWidth = 2; //线条宽度
            context.strokeStyle = 'rgba(250,250,50,1)'; //颜色
            context.stroke();
            radius += 0.5; //每一帧半径增加0.5

            //半径radius大于30时，重置为0
            if (radius > 10) {
                radius = 0;
            }
        };

        //创建一个临时canvas来缓存主canvas的历史图像
        var backCanvas = document.createElement('canvas'),
            backCtx = backCanvas.getContext('2d');
        backCanvas.width = canvas.width;
        backCanvas.height = canvas.height;

        //设置主canvas的绘制透明度
        context.globalAlpha = 0.95;

        //显示即将绘制的图像，忽略临时canvas中已存在的图像
        backCtx.globalCompositeOperation = 'copy';
        var render = function () {
            //默认值为source-over
            var prev = context.globalCompositeOperation;

            //只显示canvas上原图像的重叠部分
            context.globalCompositeOperation = 'destination-in';

            //设置主canvas的绘制透明度
            context.globalAlpha = 0.95;

            //这一步目的是将canvas上的图像变的透明
            context.fillRect(0, 0, canvas.width, canvas.height);

            //在原图像上重叠新图像
            context.globalCompositeOperation = prev;

            //在主canvas上画新圆
            drawCircle();
        };

        var timer = setInterval(function () {
            if (t.lightOnOff) {
                render();
            } else {
                context.clearRect(0, 0, canvas.width, canvas.height);
                backCtx.clearRect(0, 0, canvas.width, canvas.height);
                clearInterval(timer);
            }
        }, 60)

    },
    createAtoms:function(){
      var t = this;
        for (var i = 0; i < t.panelW; i += t.atomW) {
            for (var j = 0; j < t.panelH; j += t.atomH) {
                // var atom = t.createAtoms(, t.atomW, t.atomH);
                if ((i - (t.atomW / 2)) > t.maxX) {
                    t.maxX = i - t.atomW / 2;
                }
                if (t.minY > (j - (t.atomH / 2))) {
                    t.minY = j - t.atomH / 2;
                }
                if (t.minX > (i - (t.atomW / 2))) {
                    t.minX = i - t.atomW / 2;
                }
                if ((j - (t.atomH / 2)) > t.maxY) {
                    t.maxY = j - t.atomH / 2;
                }
            }
        }
        var gapDisX = (t.panelW-t.innerPanelW)/2;//整个x轴左右间隙
        var disX = Math.floor(gapDisX/t.atomW)*t.atomW;//换算成相应坐标轴上的距离
        var rightX = - t.atomW / 2+disX;//小矩形x最右边的坐标值
        var leftX = t.maxX-disX;//小矩形x最左边的坐标值
        var gapDisTY = (t.panelH-t.innerPanelH)*t.gapYpe;//纵轴上边距离
        var gapDisBY = (t.panelH-t.innerPanelH)*(1-t.gapYpe);//纵轴下边距离
        var disTopY = Math.floor(gapDisTY/t.atomH)*t.atomH;//换算成相应坐标轴上的距离
        var disBottomY = Math.floor(gapDisBY/t.atomH)*t.atomH;//换算成相应坐标轴上的距离
        var topY = -t.atomH/2+disTopY;//小矩形y最上边的坐标值
        var bottomY = t.maxY-disBottomY;//小矩形y最下边的坐标值
        //以上的过程主要是为了推算出小矩形和整个画板的中心坐标值
        var nowNum = 0;
        for (var si = 0; si < t.panelW; si += t.atomW) {
            for (var sj = 0; sj < t.panelH; sj += t.atomH) {
                var nowX = (si - (t.atomW/2));
                var nowY = (sj - (t.atomH / 2));
                if((nowX>=rightX)&&(nowY>=topY)&&(nowX<=leftX)&&(nowY<=bottomY)){
                    var atom = null;
                    if(nowNum===t.userInfo.index){
                        atom = t.getUserAtom(si - t.atomW / 2, sj - t.atomH / 2, 10, t.atomW, t.atomH);
                    }else{
                        atom = t.getAtom(si - t.atomW / 2, sj - t.atomH / 2, 10, t.atomW, t.atomH);
                    }
                    t.Particles.push(atom);
                    nowNum++;
                }
            }
        }
        t.panelCenter.y = t.maxY/2-t.atomH/2;
        t.centerImg.y = (t.panelCenter.y)-(gapDisBY-gapDisTY);

        //debugger;
        t.centerImg.x = t.panelCenter.x = (t.maxX-t.atomW)/2;
        t.Particles = t.Particles.sort(t.randomSort);
        if(t.Particles.length>t.nowSum){
            t.Particles = t.Particles.slice(0, t.nowSum);
        }
        t.beginCenter();
    },
    randomSort: function (a, b) {
        return Math.random() > 0.5 ? -1 : 1;
    },
    panelCenter:{//整个画布中心
      x:0,
      y:0
    },
    logoImg: {
        imgSrc: 'image/logo.png',
        w: $(window).width(),
        h: 0
    },
    centerImg: {//内部矩形中心点的相关信息
        x: 0,
        y: 0,
        z: 10,
        w: 32,
        h: 23,
        scale:4,
        imgSrc: 'image/Cgp3O1axmBmAMh2nAAAyeN0wTns199.png'
    },

    maskPanel:null,
    drawPanel:null,
    wThPer:1.085,
    nowSum:9000,//取决于后台目前有多少人
    Particles:[],//用于存放所有的运动粒子
    scaleRatio:.3,//粒子扩散时候的放大比例
    focallength:250,
    atomW:2,
    atomH:2,
    maxY:0,//记录画布最大的纵轴端点
    maxX:0,//记录画布最大的横轴端点
    minX:0,//记录画布最小的横轴端点
    minY:0,//记录画布最小的纵轴端点
    innerPanelW:250,//在画布内部矩形的宽度
    innerPanelH:140,//在画布内部矩形的高度，
    gapYpe:.3,//矩形默认是居中在画布，但是纵向并不一定居中
    panelW:$(window).width(),//画布的原始宽度
    panelH:295,//画布的原始高度
    opt:null,//初始化的时候传入的参数存储的地方
    zr: null,
    //largeUserImage:null,
    //temUser:true,
    scaleNum: 12,
    userScaleNum:4,
    Play: true,
    section: true,
    scaleOnOff:true,
    lastSequence: 2,
    lightOnOff: true,
    sequence: 0
};