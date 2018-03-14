$(document).ready(function(){
    var demoInit = {
        init:function(){
            var t = this;
            t.zr = zrender.init(document.getElementById('Particle'));
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
        },
        zr:null,
        panelW:280,
        panelH:160
    };
    demoInit.init();
});