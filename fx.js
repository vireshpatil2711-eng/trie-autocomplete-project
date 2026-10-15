/* =====================================================================
   MODULE 8: Snow + sparkles (one canvas, paused when tab hidden)
   ===================================================================== */
const fx=$('#fx'),fctx=fx.getContext('2d');let FW,FH,flakes=[],sparks=[];
function sizeFx(){const d=devicePixelRatio||1;FW=innerWidth;FH=innerHeight;fx.width=FW*d;fx.height=FH*d;fctx.setTransform(d,0,0,d,0,0)}
sizeFx();addEventListener('resize',sizeFx);
if(!RM)flakes=Array.from({length:70},()=>({x:Math.random()*FW,y:Math.random()*FH,r:Math.random()*1.8+.5,v:Math.random()*.5+.2,p:Math.random()*6}));
function sparkAtInput(){
  if(RM)return;const r=input.getBoundingClientRect();
  const caret=Math.min(r.right-10,r.left+Math.min(r.width,input.value.length*10.2));
  for(let i=0;i<3;i++)sparks.push({x:caret,y:r.top+6,vx:(Math.random()-.5)*.9,vy:-(Math.random()*1+.5),l:1,s:Math.random()*3+2});
}
function burst(x,y){if(RM)return;for(let i=0;i<40;i++){const a=Math.random()*6.3,s=Math.random()*3+1;sparks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,s:Math.random()*3+2})}}
let raf;
function tick(now){
  fctx.clearRect(0,0,FW,FH);
  if(!RM){
    fctx.fillStyle='#fff';
    for(const f of flakes){f.y+=f.v;f.x+=Math.sin(now/1500+f.p)*.25;if(f.y>FH){f.y=-4;f.x=Math.random()*FW}
      fctx.globalAlpha=.4;fctx.beginPath();fctx.arc(f.x,f.y,f.r,0,6.3);fctx.fill()}
    sparks=sparks.filter(s=>s.l>0);
    for(const s of sparks){s.x+=s.vx;s.y+=s.vy;s.vy+=.01;s.l-=.018;fctx.globalAlpha=Math.max(0,s.l);fctx.fillStyle='#bfe3ff';fctx.shadowColor='#7fc4ff';fctx.shadowBlur=8;star4(fctx,s.x,s.y,s.s);fctx.shadowBlur=0}
    fctx.globalAlpha=1;
  }
  if(!$('#p-sky').hidden)drawSky(now);
  raf=requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);if(!document.hidden)raf=requestAnimationFrame(tick)});
raf=requestAnimationFrame(tick);

