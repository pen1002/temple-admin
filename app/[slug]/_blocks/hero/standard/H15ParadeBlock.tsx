'use client';
import { useEffect, useRef } from 'react';

export default function H15ParadeBlock() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef   = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const cv   = cvRef.current!;
    const ctx  = cv.getContext('2d')!;
    let W: number, H: number, GY: number, groundY: number;
    let animId: number;

    function resize() {
      W = wrap.clientWidth || 1200;
      H = Math.round(W * 0.52);
      cv.width  = W;
      cv.height = H;
      wrap.style.height = H + 'px';
      GY      = H * 0.78;
      groundY = H * 0.80;
      buildFloats();
      buildWires();
      buildCrowd();
    }

    const STARS: { x:number;y:number;r:number;a:number;da:number }[] = [];
    function initStars() {
      STARS.length = 0;
      for (let i = 0; i < 160; i++)
        STARS.push({ x: Math.random()*W, y: Math.random()*GY*0.85, r: Math.random()*1.3+.3, a: Math.random(), da: (Math.random()*.006+.002)*(Math.random()<.5?1:-1) });
    }

    function drawElephant(x:number,y:number,sc:number,t:number){const s=sc;ctx.save();ctx.translate(x,y);const lgTop=ctx.createLinearGradient(-30*s,-90*s,30*s,-40*s);lgTop.addColorStop(0,'#e8b400');lgTop.addColorStop(1,'#c87000');ctx.fillStyle=lgTop;ctx.beginPath();ctx.roundRect(-28*s,-95*s,56*s,18*s,4*s);ctx.fill();const lgBody=ctx.createLinearGradient(-32*s,-75*s,32*s,-20*s);lgBody.addColorStop(0,'#c02020');lgBody.addColorStop(0.5,'#e03030');lgBody.addColorStop(1,'#800000');ctx.fillStyle=lgBody;ctx.beginPath();ctx.roundRect(-32*s,-78*s,64*s,55*s,6*s);ctx.fill();ctx.strokeStyle='#f0c020';ctx.lineWidth=2*s;ctx.strokeRect(-32*s,-78*s,64*s,55*s);ctx.strokeRect(-26*s,-72*s,52*s,43*s);ctx.fillStyle='#f0c020';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc((-16+i*8)*s,-50*s,3*s,0,Math.PI*2);ctx.fill();}const lgEl=ctx.createLinearGradient(-30*s,-20*s,30*s,30*s);lgEl.addColorStop(0,'#888');lgEl.addColorStop(1,'#444');ctx.fillStyle=lgEl;ctx.beginPath();ctx.ellipse(0,-5*s,32*s,26*s,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(-28*s,-8*s,18*s,18*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#666';ctx.beginPath();ctx.ellipse(-36*s,-10*s,10*s,13*s,-.3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#666';ctx.lineWidth=5*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-44*s,-5*s);ctx.quadraticCurveTo(-55*s,5*s,-50*s,18*s);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-36*s,-12*s,3*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(-35.5*s,-12*s,1.5*s,0,Math.PI*2);ctx.fill();const walk=Math.sin(t*3)*8;ctx.fillStyle='#555';[[-18,0],[18,0],[-8,0],[8,0]].forEach(([lx],i)=>{ctx.beginPath();ctx.roundRect((lx-4)*s,22*s,9*s,20*s+(i%2===0?walk:-walk),2);ctx.fill();});ctx.strokeStyle='#666';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(30*s,5*s);ctx.quadraticCurveTo(42*s,10*s,38*s,22*s);ctx.stroke();ctx.fillStyle='#f0c020';for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*12*s,-95*s);ctx.lineTo((i+.5)*12*s,-85*s);ctx.lineTo((i-.5)*12*s,-85*s);ctx.closePath();ctx.fill();}ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(-20*s,-68*s,40*s,28*s);ctx.fillStyle='#f5c842';ctx.font=`bold ${11*s}px serif`;ctx.textAlign='center';ctx.fillText('象',0,-48*s);ctx.restore();}
    function drawWukong(x:number,y:number,sc:number,t:number){ctx.save();ctx.translate(x,y);const s=sc;const rodX=-10*s+Math.cos(t*2)*3*s;ctx.strokeStyle='#c0922a';ctx.lineWidth=5*s;ctx.beginPath();ctx.moveTo(rodX,-85*s);ctx.lineTo(rodX+5*s,-20*s);ctx.stroke();ctx.fillStyle='#ff4400';ctx.beginPath();ctx.roundRect(rodX-4*s,-95*s,12*s,12*s,2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.85)';[[-15,55],[0,50],[15,55],[-8,60],[8,60]].forEach(([cx2,cy2])=>{ctx.beginPath();ctx.arc(cx2*s,(cy2-100)*s+Math.sin(t)*3*s,7*s,0,Math.PI*2);ctx.fill();});const lgB=ctx.createLinearGradient(-20*s,-50*s,20*s,20*s);lgB.addColorStop(0,'#e8a000');lgB.addColorStop(1,'#b06000');ctx.fillStyle=lgB;ctx.beginPath();ctx.roundRect(-18*s,-52*s,36*s,55*s,5*s);ctx.fill();ctx.strokeStyle='#fff0a0';ctx.lineWidth=1.5*s;ctx.strokeRect(-14*s,-48*s,28*s,16*s);ctx.fillStyle='#d4854a';ctx.beginPath();ctx.ellipse(0,-68*s,14*s,16*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f5c5a0';ctx.beginPath();ctx.ellipse(0,-66*s,9*s,10*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff6600';ctx.beginPath();ctx.ellipse(-5*s,-70*s,3.5*s,2.5*s,.3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(5*s,-70*s,3.5*s,2.5*s,-.3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(-5*s,-70*s,1.5*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(5*s,-70*s,1.5*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d4854a';ctx.beginPath();ctx.ellipse(-14*s,-72*s,5*s,6*s,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(14*s,-72*s,5*s,6*s,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f0d020';ctx.lineWidth=2.5*s;ctx.beginPath();ctx.arc(0,-68*s,14*s,-.5,Math.PI+.5);ctx.stroke();ctx.strokeStyle='#d4854a';ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(18*s,-10*s);ctx.quadraticCurveTo(35*s+Math.sin(t*2.5)*5*s,-5*s,30*s,-25*s);ctx.stroke();ctx.fillStyle='#b06000';ctx.beginPath();ctx.roundRect(-14*s,3*s,10*s,22*s+Math.sin(t*3)*6,3);ctx.fill();ctx.beginPath();ctx.roundRect(4*s,3*s,10*s,22*s-Math.sin(t*3)*6,3);ctx.fill();ctx.restore();}
    function drawTeletubby(x:number,y:number,sc:number,t:number){ctx.save();ctx.translate(x,y);const s=sc,col='#9b59b6',col2='#7d3c98';ctx.strokeStyle=col;ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(0,-88*s);ctx.lineTo(0,-100*s);ctx.stroke();ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(0,-103*s,5*s,0,Math.PI*2);ctx.fill();const lgH=ctx.createLinearGradient(-20*s,-88*s,20*s,-52*s);lgH.addColorStop(0,col);lgH.addColorStop(1,col2);ctx.fillStyle=lgH;ctx.beginPath();ctx.arc(0,-72*s,20*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fde8c8';ctx.beginPath();ctx.ellipse(0,-70*s,12*s,14*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.roundRect(-10*s,-40*s,20*s,20*s,3);ctx.fill();ctx.fillStyle='rgba(100,200,255,.8)';ctx.beginPath();ctx.roundRect(-9*s,-39*s,18*s,18*s,2);ctx.fill();ctx.fillStyle='#fff';ctx.font=`${8*s}px sans-serif`;ctx.textAlign='center';ctx.fillText('☸',0,-28*s);ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-5*s,-73*s,4*s,5*s,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(5*s,-73*s,4*s,5*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2c3e50';ctx.beginPath();ctx.arc(-5*s,-73*s,2.5*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(5*s,-73*s,2.5*s,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e74c3c';ctx.lineWidth=2*s;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,-66*s,5*s,.2,Math.PI-.2);ctx.stroke();const lgBd=ctx.createLinearGradient(-22*s,-52*s,22*s,20*s);lgBd.addColorStop(0,col);lgBd.addColorStop(1,col2);ctx.fillStyle=lgBd;ctx.beginPath();ctx.ellipse(0,-15*s,24*s,36*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=col2;ctx.beginPath();ctx.ellipse(-28*s,-20*s,7*s,14*s,(-Math.sin(t*3)*12*.03),0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(28*s,-20*s,7*s,14*s,(Math.sin(t*3)*12*.03),0,Math.PI*2);ctx.fill();ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(-14*s,18*s,12*s,26*s+Math.sin(t*3)*8,4);ctx.fill();ctx.beginPath();ctx.roundRect(2*s,18*s,12*s,26*s-Math.sin(t*3)*8,4);ctx.fill();ctx.restore();}
    function drawMickey(x:number,y:number,sc:number,t:number){ctx.save();ctx.translate(x,y);const s=sc;ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-12*s,-85*s,12*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(12*s,-85*s,12*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e00';ctx.beginPath();ctx.arc(-12*s,-85*s,7*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(12*s,-85*s,7*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(0,-70*s,20*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f5e0c0';ctx.beginPath();ctx.ellipse(0,-67*s,14*s,16*s,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-6*s,-72*s,5*s,6*s,-.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(6*s,-72*s,5*s,6*s,.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-6*s,-72*s,3*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(6*s,-72*s,3*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-5*s,-73*s,1.2*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(5*s,-73*s,1.2*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#333';ctx.beginPath();ctx.ellipse(0,-63*s,4*s,3*s,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#333';ctx.lineWidth=1.5*s;ctx.beginPath();ctx.arc(0,-60*s,5*s,.15,Math.PI-.15);ctx.stroke();const hw=Math.sin(t*3)*15;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-30*s+Math.cos(t*3)*4*s,-30*s-hw*.3,10*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(30*s+Math.cos(t*3)*4*s,-30*s+hw*.3,10*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e00';ctx.beginPath();ctx.roundRect(-18*s,-52*s,36*s,40*s,4*s);ctx.fill();ctx.fillStyle='#f0d020';ctx.beginPath();ctx.roundRect(-18*s,-52*s,36*s,8*s,2*s);ctx.fill();ctx.beginPath();ctx.arc(0,-44*s,4*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e8a800';ctx.beginPath();ctx.ellipse(-10*s,18*s,11*s,7*s,.15,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(10*s,18*s,11*s,7*s,-.15,0,Math.PI*2);ctx.fill();const lsh=Math.sin(t*3)*8;ctx.fillStyle='#111';ctx.beginPath();ctx.roundRect(-14*s,-12*s,10*s,28*s+lsh,3);ctx.fill();ctx.beginPath();ctx.roundRect(4*s,-12*s,10*s,28*s-lsh,3);ctx.fill();ctx.restore();}
    function drawBTS(x:number,y:number,sc:number,t:number){ctx.save();ctx.translate(x,y);const s=sc;const lgP=ctx.createLinearGradient(-50*s,-90*s,50*s,-10*s);lgP.addColorStop(0,'#4a0080');lgP.addColorStop(.5,'#9b00ff');lgP.addColorStop(1,'#4a0080');ctx.fillStyle=lgP;ctx.beginPath();ctx.roundRect(-55*s,-95*s,110*s,100*s,8*s);ctx.fill();ctx.strokeStyle='#e0a0ff';ctx.lineWidth=2*s;ctx.strokeRect(-55*s,-95*s,110*s,100*s);ctx.fillStyle='#fff';ctx.font=`bold ${20*s}px sans-serif`;ctx.textAlign='center';ctx.fillText('BTS',0,-60*s);ctx.font=`${9*s}px sans-serif`;ctx.fillStyle='#e0a0ff';ctx.fillText('방탄소년단',0,-45*s);const poses=[[-40,-20,-.3],[-28,-18,.1],[-14,-22,-.1],[0,-20,.2],[14,-22,-.2],[28,-18,.1],[40,-20,-.1]];poses.forEach(([px,py,tilt],i)=>{ctx.save();ctx.translate(px*s,py*s);ctx.rotate(tilt+Math.sin(t*2+i*.9)*.12);const colors=['#ff80ab','#80d8ff','#ccff90','#ffd54f','#ff8a80','#ea80fc','#a7ffeb'];ctx.fillStyle=colors[i];ctx.beginPath();ctx.roundRect(-4*s,0,8*s,14*s,2*s);ctx.fill();ctx.beginPath();ctx.arc(0,-5*s,5.5*s,0,Math.PI*2);ctx.fill();ctx.restore();});ctx.fillStyle='rgba(255,100,150,.8)';ctx.font=`${14*s}px sans-serif`;ctx.fillText('♥',35*s,-75*s);ctx.strokeStyle='#f0c020';ctx.lineWidth=1.5*s;for(let i=0;i<5;i++){const bx=(-40+i*20)*s;ctx.beginPath();ctx.moveTo(bx,-95*s);ctx.lineTo((bx+4*s),-105*s);ctx.lineTo((bx-4*s),-105*s);ctx.closePath();ctx.fillStyle='#f0c020';ctx.fill();}ctx.restore();}
    function drawPagoda(x:number,y:number,sc:number,t:number){ctx.save();ctx.translate(x,y);const s=sc;const layers=[{w:60,h:14,y:-95},{w:52,h:14,y:-78},{w:44,h:14,y:-61},{w:36,h:14,y:-44},{w:28,h:16,y:-25}];layers.forEach(({w,h,y:ly},i)=>{const lg=ctx.createLinearGradient(-w/2*s,ly*s,w/2*s,(ly+h)*s);lg.addColorStop(0,'#c02020');lg.addColorStop(1,'#800000');ctx.fillStyle=lg;ctx.beginPath();ctx.moveTo(-w/2*s,ly*s);ctx.lineTo(-w/2*s,(ly+h)*s);ctx.lineTo(w/2*s,(ly+h)*s);ctx.lineTo(w/2*s,ly*s);ctx.quadraticCurveTo(0,(ly-6)*s,0,ly*s);ctx.closePath();ctx.fill();ctx.strokeStyle='#c02020';ctx.lineWidth=2.5*s;ctx.beginPath();ctx.moveTo(-w/2*s,(ly+h)*s);ctx.quadraticCurveTo((-w/2-5)*s,(ly+h+4)*s,(-w/2-3)*s,(ly+h+7)*s);ctx.stroke();ctx.beginPath();ctx.moveTo(w/2*s,(ly+h)*s);ctx.quadraticCurveTo((w/2+5)*s,(ly+h+4)*s,(w/2+3)*s,(ly+h+7)*s);ctx.stroke();ctx.strokeStyle='#f0c020';ctx.lineWidth=1.2*s;ctx.strokeRect(-w/2*s,ly*s,w*s,h*s);ctx.fillStyle='#8b4513';ctx.fillRect((-w/2+3)*s,(ly+h)*s,(w-6)*s,5*s);if(i<layers.length-1){const fx=Math.sin(t*2+i)*.5;ctx.strokeStyle='#f0c020';ctx.lineWidth=1*s;ctx.beginPath();ctx.moveTo(-w/2*s,(ly+h)*s);ctx.lineTo((-w/2+fx)*s,(ly+h+8)*s);ctx.stroke();ctx.beginPath();ctx.moveTo(w/2*s,(ly+h)*s);ctx.lineTo((w/2+fx)*s,(ly+h+8)*s);ctx.stroke();ctx.fillStyle='#f0c020';ctx.beginPath();ctx.arc((-w/2+fx)*s,(ly+h+8)*s,2.5*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc((w/2+fx)*s,(ly+h+8)*s,2.5*s,0,Math.PI*2);ctx.fill();}});ctx.fillStyle='#f0c020';ctx.beginPath();ctx.arc(0,-100*s,5*s,0,Math.PI*2);ctx.fill();ctx.fillRect(-2*s,-108*s,4*s,10*s);ctx.fillStyle='#696969';ctx.beginPath();ctx.roundRect(-32*s,-10*s,64*s,10*s,2*s);ctx.fill();ctx.strokeStyle='#f0c020';ctx.lineWidth=1*s;ctx.strokeRect(-32*s,-10*s,64*s,10*s);ctx.restore();}
    function drawDragon(x:number,y:number,sc:number,t:number){ctx.save();ctx.translate(x,y);const s=sc;const bw=Math.sin(t*2)*.5;ctx.strokeStyle='#2ecc71';ctx.lineWidth=12*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(40*s,5*s);ctx.quadraticCurveTo(55*s,-5*s+bw*10*s,50*s,-20*s);ctx.quadraticCurveTo(58*s,-35*s,48*s,-40*s);ctx.stroke();ctx.lineWidth=7*s;ctx.strokeStyle='#27ae60';ctx.beginPath();ctx.moveTo(40*s,5*s);ctx.quadraticCurveTo(55*s,-5*s+bw*10*s,50*s,-20*s);ctx.quadraticCurveTo(58*s,-35*s,48*s,-40*s);ctx.stroke();const pts=[[30,10],[10,bw*8],[-10,-5+bw*-6],[-30,-10+bw*8],[-45,-5]];ctx.lineWidth=20*s;ctx.strokeStyle='#27ae60';ctx.beginPath();ctx.moveTo(30*s,10*s);pts.forEach(([px,py])=>ctx.lineTo(px*s,py*s));ctx.stroke();ctx.lineWidth=14*s;ctx.strokeStyle='#2ecc71';ctx.beginPath();ctx.moveTo(30*s,10*s);pts.forEach(([px,py])=>ctx.lineTo(px*s,py*s));ctx.stroke();for(let i=0;i<6;i++){const bx2=(-35+i*12)*s,by2=(bw*Math.sin(i*.8)*5-5)*s;ctx.fillStyle='rgba(100,220,120,.5)';ctx.beginPath();ctx.arc(bx2,by2,5*s,Math.PI,0);ctx.fill();}const wf=Math.sin(t*2.5)*.25;ctx.fillStyle='rgba(39,174,96,.7)';ctx.save();ctx.translate(-5*s,-15*s);ctx.rotate(-wf);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-20*s,-30*s,-5*s,-45*s);ctx.quadraticCurveTo(10*s,-30*s,0,0);ctx.fill();ctx.restore();ctx.save();ctx.translate(-5*s,-15*s);ctx.rotate(wf);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(20*s,-30*s,5*s,-45*s);ctx.quadraticCurveTo(-10*s,-30*s,0,0);ctx.fill();ctx.restore();ctx.fillStyle='#1a8a40';ctx.beginPath();ctx.ellipse(-52*s,-5*s,22*s,14*s,-.25,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2ecc71';ctx.beginPath();ctx.ellipse(-52*s,-5*s,18*s,10*s,-.25,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f0c020';ctx.lineWidth=2.5*s;ctx.beginPath();ctx.moveTo(-44*s,-14*s);ctx.lineTo(-40*s,-28*s);ctx.stroke();ctx.beginPath();ctx.moveTo(-52*s,-16*s);ctx.lineTo(-50*s,-30*s);ctx.stroke();ctx.fillStyle='#f0c020';ctx.beginPath();ctx.arc(-40*s,-28*s,2.5*s,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(-50*s,-30*s,2.5*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff4400';ctx.beginPath();ctx.ellipse(-59*s,-8*s,5*s,4*s,-.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffcc00';ctx.beginPath();ctx.arc(-59*s,-8*s,2.5*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(-59*s,-8*s,1.5*s,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#1a8a40';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(-70*s,-2*s);ctx.lineTo(-62*s,2*s);ctx.stroke();const ft=t*3;for(let fi=0;fi<8;fi++){const ph=fi/8,fx=-70*s-Math.cos(ft+ph)*18*s,fy=-2*s+Math.sin(ft*1.3+ph*2.1)*8*s,fs=(12+Math.sin(ft+ph)*6)*s,al=.55+Math.sin(ft*2+ph)*.35;const gf=ctx.createRadialGradient(fx,fy,0,fx,fy,fs);gf.addColorStop(0,`rgba(255,255,220,${al})`);gf.addColorStop(.35,`rgba(255,180,20,${al*.9})`);gf.addColorStop(.7,`rgba(255,80,0,${al*.7})`);gf.addColorStop(1,'rgba(255,40,0,0)');ctx.fillStyle=gf;ctx.beginPath();ctx.arc(fx,fy,fs,0,Math.PI*2);ctx.fill();}ctx.fillStyle='rgba(255,255,200,.6)';ctx.beginPath();ctx.arc(-72*s,-1*s,6*s,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1a8a40';[[-5,5],[5,3],[15,5],[25,3]].forEach(([lx,ly])=>{ctx.beginPath();ctx.roundRect((20+lx)*s,(10+ly)*s,8*s,10*s,2*s);ctx.fill();});ctx.restore();}

    const FLOAT_TYPES = [
      {draw:drawElephant,scale:.85,speed:1.1,w:110,label:'코끼리 장엄등'},
      {draw:drawWukong,scale:.90,speed:1.3,w:80,label:'손오공 장엄등'},
      {draw:drawTeletubby,scale:.90,speed:1.2,w:75,label:'텔레토비 장엄등'},
      {draw:drawMickey,scale:.88,speed:1.25,w:70,label:'미키마우스 장엄등'},
      {draw:drawBTS,scale:.85,speed:.95,w:120,label:'BTS 장엄등'},
      {draw:drawPagoda,scale:.85,speed:1.0,w:80,label:'탑 장엄등'},
      {draw:drawDragon,scale:.82,speed:1.4,w:150,label:'화룡 장엄등'},
    ];
    let floats: { type: typeof FLOAT_TYPES[0]; x:number; y:number; scale:number; speed:number; phase:number }[] = [];
    function buildFloats() {
      floats = [];
      let cx = W + 120;
      for (let rep = 0; rep < 3; rep++) {
        FLOAT_TYPES.forEach(ft => {
          floats.push({ type:ft, x:cx, y:H*0.5, scale:ft.scale*(0.88+Math.random()*.18), speed:ft.speed*(0.9+Math.random()*.22), phase:Math.random()*Math.PI*2 });
          cx += ft.w * ft.scale * 2 + 40 + Math.random() * 25;
        });
        cx += 100;
      }
    }

    let WIRE_LAMPS: { wx:number;wy:number;col:string;phase:number;lit:boolean;litAt:number }[] = [];
    function buildWires() {
      WIRE_LAMPS = [];
      const rowColors = ['#e83030','#28b848','#2255e0','#f0c800','#e0e0f0'];
      const spacing = W / (Math.floor(W/38));
      const n = Math.floor(W/38) + 1;
      for (let i = 0; i < n; i++)
        WIRE_LAMPS.push({ wx:i*spacing-spacing/2, wy:52, col:rowColors[i%rowColors.length], phase:Math.random()*Math.PI*2, lit:false, litAt:i*60+200 });
    }

    let CROWD: { x:number;y:number;h:number;col:string }[] = [];
    function buildCrowd() {
      CROWD = [];
      for (let i = 0; i < 80; i++)
        CROWD.push({ x:Math.random()*W, y:groundY+Math.random()*30, h:8+Math.random()*18, col:'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0') });
    }

    const FIREWORKS: { x:number;y:number;vx:number;vy:number;life:number;col:string }[] = [];
    function spawnFW() {
      if (Math.random() < .012) {
        const x=Math.random()*W, y=Math.random()*(H*.35)+H*.05;
        const col=`hsl(${Math.random()*360},90%,65%)`;
        for (let i=0;i<22;i++) {
          const ang=Math.random()*Math.PI*2, spd=1+Math.random()*3;
          FIREWORKS.push({x,y,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,life:1,col});
        }
      }
    }

    function drawLabel(x:number,y:number,text:string) {
      ctx.font='12px "Noto Serif KR",serif';
      const tw = ctx.measureText(text).width + 14;
      ctx.fillStyle='rgba(0,0,0,.7)';
      ctx.beginPath();ctx.roundRect(x-tw/2,y-14,tw,18,4);ctx.fill();
      ctx.fillStyle='#f5c842';ctx.textAlign='center';ctx.fillText(text,x,y);
    }

    let startTime: number|null = null;
    function loop(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime, t = elapsed / 1000;
      ctx.clearRect(0,0,W,H);
      const sky = ctx.createLinearGradient(0,0,0,H);
      sky.addColorStop(0,'#010612');sky.addColorStop(.6,'#0a0f2a');sky.addColorStop(1,'#150820');
      ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
      STARS.forEach(s=>{s.a+=s.da;if(s.a>1||s.a<0)s.da*=-1;ctx.fillStyle=`rgba(255,255,255,${s.a.toFixed(2)})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
      spawnFW();
      for(let i=FIREWORKS.length-1;i>=0;i--){const fw=FIREWORKS[i];fw.x+=fw.vx;fw.y+=fw.vy;fw.vy+=.05;fw.life-=.018;if(fw.life<=0){FIREWORKS.splice(i,1);continue;}ctx.globalAlpha=fw.life;ctx.fillStyle=fw.col;ctx.beginPath();ctx.arc(fw.x,fw.y,1.5,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
      ctx.strokeStyle='rgba(160,110,30,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,52);ctx.lineTo(W,52);ctx.stroke();
      WIRE_LAMPS.forEach(l=>{if(!l.lit&&elapsed>l.litAt)l.lit=true;if(!l.lit)return;const sway=Math.sin(t*1.8+l.phase)*.8,cx2=l.wx+sway,cy2=l.wy,R=10;ctx.strokeStyle='rgba(160,110,30,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx2,cy2);ctx.lineTo(cx2,cy2+6);ctx.stroke();for(let k=0;k<12;k++){const a0=(k/12)*Math.PI*2-Math.PI/2,a1=((k+1)/12)*Math.PI*2-Math.PI/2;const pts3:number[][]=[];for(let s2=0;s2<=6;s2++){const aa=a0+(a1-a0)*s2/6,rr2=R*(0.82+0.18*Math.pow(Math.cos(((k+s2/6)/12-.5)*Math.PI*2),2));pts3.push([cx2+rr2*Math.cos(aa),cy2+R+4+rr2*Math.sin(aa)]);}const bright=.6+.4*Math.cos(a0+.5);ctx.fillStyle=l.col;ctx.globalAlpha=.7+bright*.25;ctx.beginPath();ctx.moveTo(cx2,cy2+R+4);pts3.forEach(([px,py])=>ctx.lineTo(px,py));ctx.closePath();ctx.fill();ctx.globalAlpha=1;}ctx.fillStyle='#b8880e';ctx.fillRect(cx2-4,cy2+6,8,3);ctx.fillRect(cx2-4,cy2+R*2+4,8,3);ctx.strokeStyle='rgba(200,160,20,.7)';ctx.lineWidth=1;for(let tk=-2;tk<=2;tk++){ctx.beginPath();ctx.moveTo(cx2+tk*2,cy2+R*2+7);ctx.lineTo(cx2+tk*2+Math.sin(t+tk),cy2+R*2+13);ctx.stroke();}});
      const lg2=ctx.createLinearGradient(0,groundY,0,H);lg2.addColorStop(0,'#1a0e2e');lg2.addColorStop(1,'#0a0510');ctx.fillStyle=lg2;ctx.fillRect(0,groundY,W,H-groundY);ctx.strokeStyle='rgba(255,200,80,.06)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,groundY);ctx.lineTo(W,groundY);ctx.stroke();
      CROWD.forEach(p=>{const bob=Math.sin(t*2.5+p.x*.05)*1.5;ctx.fillStyle=p.col;ctx.globalAlpha=.55;ctx.beginPath();ctx.roundRect(p.x-2,p.y+bob-p.h,5,p.h,2);ctx.fill();ctx.beginPath();ctx.arc(p.x+.5,p.y+bob-p.h-3,3,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;});
      floats.forEach(fl=>{fl.x-=fl.speed;const ww=fl.type.w*fl.scale*2+40;if(fl.x<-ww){let maxX=0;floats.forEach(f=>{if(f.x>maxX)maxX=f.x;});fl.x=maxX+fl.type.w*fl.type.scale*1.8+50;}const fy=fl.y+Math.sin(t*1.5+fl.phase)*4;fl.type.draw(fl.x,fy,fl.scale,t+fl.phase);drawLabel(fl.x,fy+Math.round(fl.scale*45),fl.type.label);});
      animId = requestAnimationFrame(loop);
    }

    resize();
    initStars();
    animId = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div ref={wrapRef} style={{ position:'relative', width:'100%', overflow:'hidden', background:'linear-gradient(to bottom,#020818,#0a0f2a,#0d0a1a)' }}>
      <div style={{ position:'absolute', top:10, left:0, right:0, textAlign:'center', pointerEvents:'none', zIndex:10 }}>
        <h1 style={{ fontFamily:'Noto Serif KR,serif', fontSize:'clamp(13px,2.2vw,20px)', color:'#f5c842', letterSpacing:'.18em', fontWeight:300, margin:0 }}>
          불기 2570년 부처님 오신 날
        </h1>
        <p style={{ fontSize:'clamp(9px,1.2vw,12px)', color:'rgba(200,160,70,.75)', letterSpacing:'.35em', margin:'2px 0 0' }}>
          봉축 연등 장엄행렬
        </p>
      </div>
      <canvas ref={cvRef} style={{ display:'block' }} />
    </div>
  );
}
