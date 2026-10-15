/* =====================================================================
   MODULE 6: Constellation (canvas)
   ===================================================================== */
const sky=$('#sky'),sctx=sky.getContext('2d');let SW=0,SH=0,layout=null,hover=null,bgStars=[];
function sizeSky(){
  const r=$('#skywrap').getBoundingClientRect(),d=devicePixelRatio||1;if(!r.width)return;
  SW=r.width;SH=r.height;sky.width=SW*d;sky.height=SH*d;sctx.setTransform(d,0,0,d,0,0);
  bgStars=Array.from({length:70},()=>({x:Math.random()*SW,y:Math.random()*SH,r:Math.random()*1.1+.2,p:Math.random()*6}));
}
new ResizeObserver(()=>{if(!$('#p-sky').hidden){sizeSky();buildSky()}}).observe($('#skywrap'));
function buildSky(){
  if($('#p-sky').hidden||!SW)return;
  const q=res.q,plain=/^[a-z]*$/.test(q);
  const chain=[{ch:'✦',node:trie.root,str:'',d:0}];let fail=false;
  if(plain)for(const ch of q){const n=chain[chain.length-1].node.c[ch];if(!n){fail=true;break}chain.push({ch,node:n,str:chain.at(-1).str+ch,d:chain.length})}
  const last=chain.at(-1),m=chain.length-1,nodes=[...chain],edges=chain.slice(1).map((c,i)=>[chain[i],c]);
  chain.forEach(c=>c.chain=true);
  /* breadth-first so every branch gets stars: depth <= 3 below the prefix, 40 stars max */
  const queue=[last];let count=0;last.kids=[];
  while(queue.length){
    const p=queue.shift();if(p.d>=m+3)continue;
    for(const k of Object.keys(p.node.c).sort((a,b)=>p.node.c[b].best-p.node.c[a].best)){
      if(count>=40)break;count++;
      const o={ch:k,node:p.node.c[k],str:p.str+k,d:p.d+1,kids:[]};p.kids.push(o);nodes.push(o);edges.push([p,o]);queue.push(o);
    }
  }
  let leaf=0;(function lay(p){if(!p.kids||!p.kids.length){p.u=leaf++;return}p.kids.forEach(lay);p.u=(p.kids[0].u+p.kids.at(-1).u)/2})(last);
  const colW=(SW-60)/(m+3.2),gap=Math.min(30,(SH-50)/Math.max(1,leaf-1));
  for(const o of nodes){o.x=30+o.d*colW;o.y=o.chain?SH/2:SH/2+(o.u-last.u)*gap}
  layout={nodes,edges,t0:performance.now(),fail,last};
}
const star4=(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x,y,x+r,y);c.quadraticCurveTo(x,y,x,y+r);c.quadraticCurveTo(x,y,x-r,y);c.quadraticCurveTo(x,y,x,y-r);c.fill()};
function drawSky(now){
  const c=sctx;c.clearRect(0,0,SW,SH);
  for(const s of bgStars){c.globalAlpha=RM?.4:.25+.3*Math.sin(now/700+s.p);c.fillStyle='#fff';c.fillRect(s.x,s.y,s.r,s.r)}
  if(!layout)return;const L=layout;c.globalAlpha=1;
  for(const[a,b]of L.edges){
    const chain=a.chain&&b.chain,k=chain?Math.min(1,Math.max(0,(now-L.t0-b.d*110)/260)):1;if(k<=0)continue;
    const born=b.node.born?Math.min(1,(now-b.node.born)/700):1;
    c.globalAlpha=chain?.95:.22*born;c.strokeStyle=chain?'#9fd4ff':'#b9a6ff';c.lineWidth=chain?2:1;
    if(chain){c.shadowColor='#7fc4ff';c.shadowBlur=10}
    c.beginPath();c.moveTo(a.x,a.y);c.lineTo(a.x+(b.x-a.x)*k*born,a.y+(b.y-a.y)*k*born);c.stroke();c.shadowBlur=0;
  }
  L.nodes.forEach((o,i)=>{
    const g=o.node.born?Math.min(1,(now-o.node.born)/700):1,e=1-Math.pow(1-g,3);
    const tw=RM?1:.65+.35*Math.sin(now/380+i*1.7);
    let r=(o.chain?5:o.node.end?5.5:2.4)*e;if(o.node.born&&g<1)r*=1+(1-g)*.8;
    c.globalAlpha=(o.chain?1:o.node.end?.95:.5)*tw*(e>0?1:0);
    c.fillStyle=o.chain?'#cfeaff':o.node.end?'#e6d4ff':'#b8c6ff';c.shadowColor=o.node.end?'#c9a9ff':'#7fc4ff';c.shadowBlur=o.chain||o.node.end?14:6;
    if(o.node.end&&!o.chain)star4(c,o.x,o.y,r*1.6);else{c.beginPath();c.arc(o.x,o.y,Math.max(r,0),0,6.3);c.fill()}
    c.shadowBlur=0;c.globalAlpha=(o.chain?.95:.55)*e;c.fillStyle='#ece6ff';c.font=(o.chain?'600 12px ':'11px ')+'JetBrains Mono, monospace';c.fillText(o.ch,o.x+7,o.y-8);
  });
  if(L.fail){const p=(now-L.t0)/1100;if(p<1){const x=L.last.x+p*240,y=L.last.y-30+p*170;
    const g=c.createLinearGradient(x,y,x-60,y-34);g.addColorStop(0,'#fff');g.addColorStop(1,'#fff0');c.globalAlpha=1-p;c.strokeStyle=g;c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x-60,y-34);c.stroke()}}
  if(hover){const o=hover,t=o.node.end?`${o.str}  ·  freq ${o.node.f}`:o.str||'(root)';c.globalAlpha=1;c.font='12px JetBrains Mono, monospace';
    const w=c.measureText(t).width+16,x=Math.min(SW-w-4,Math.max(4,o.x-w/2)),y=o.y>40?o.y-34:o.y+14;
    c.fillStyle='#0d0620ee';c.strokeStyle='#7fc4ff';c.lineWidth=1;c.beginPath();c.roundRect(x,y,w,22,8);c.fill();c.stroke();c.fillStyle='#ece6ff';c.fillText(t,x+8,y+15)}
  c.globalAlpha=1;
}
function pick(e){if(!layout)return null;const r=sky.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  let best=null,bd=14;for(const o of layout.nodes){const d=Math.hypot(o.x-x,o.y-y);if(d<bd){bd=d;best=o}}return best}
sky.addEventListener('pointermove',e=>{hover=pick(e);sky.style.cursor=hover?'pointer':'default'});
sky.addEventListener('pointerleave',()=>hover=null);
sky.addEventListener('click',e=>{const o=pick(e);if(o&&o.str){input.value=o.str;update(true);pulse()}});

