/* =====================================================================
   MODULE 4: Search UI
   ===================================================================== */
const input=$('#q'),list=$('#list');
let res={items:[],tag:'',visited:0,ms:0,depth:0,q:''},act=-1,ghostWord='';
function runSearch(q){
  const t=performance.now();let items=[],tag='prefix';
  if(!q)return{items,tag:'',visited:0,ms:0,depth:0,q};
  if(/[?*]/.test(q)){items=trie.wildcardSearch(q);tag='wildcard'}
  else{items=trie.collect(q);if(!items.length){items=trie.fuzzySearch(q,q.length>5?2:1);tag='fuzzy'}}
  let n=trie.root,depth=0;if(tag!=='wildcard'){for(const ch of q){if(n.c[ch]){n=n.c[ch];depth++}else break}}else depth=q.length;
  return{items,tag,visited:trie.visits,ms:performance.now()-t,depth,q};
}
function update(fromTyping){
  const raw=input.value,q=raw.trim().toLowerCase();
  res=runSearch(q);act=-1;
  /* path strip */
  const path=$('#path');path.innerHTML='';
  [...q].forEach((ch,i)=>{const li=document.createElement('li');li.textContent=ch;
    li.className=res.tag==='wildcard'?(/[?*]/.test(ch)?'':'on'):i<res.depth?'on':'bad';path.append(li)});
  const fail=q&&res.tag==='fuzzy';
  if(fail&&fromTyping){path.classList.remove('shake');void path.offsetWidth;path.classList.add('shake')}
  $('#stat').textContent=q?`Found in ${res.ms.toFixed(2)} ms · ${res.visited} nodes visited`:'Type to traverse the Trie';
  /* ghost text */
  ghostWord=(res.tag==='prefix'&&res.items[0]&&raw.toLowerCase()===q&&res.items[0].word!==q)?res.items[0].word:'';
  $('#ghost').innerHTML=ghostWord?`<span>${esc(raw)}</span><b>${ghostWord.slice(q.length)}</b>`:'';
  renderList();renderCount();renderEmpty();updateAurora();buildSky();if(raceOn())runRace();
  try{history.replaceState(null,'',q?'?q='+encodeURIComponent(q):location.pathname)}catch(e){}
}
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderList(){
  const top=res.items.slice(0,60),max=top.length?Math.max(...top.map(i=>i.freq)):1;
  list.innerHTML=top.map((it,i)=>{
    const p=res.tag==='prefix'?res.q.length:0;
    return`<li role="option" id="o${i}" style="--i:${i}" data-w="${it.word}" aria-selected="false"><span><span class="m">${it.word.slice(0,p)}</span><span class="r">${it.word.slice(p)}</span></span><span class="tag">${res.tag}</span><span class="bar" title="frequency ${it.freq}"><i style="transform:scaleX(${Math.max(.05,it.freq/max)})"></i></span></li>`}).join('');
  input.setAttribute('aria-expanded',top.length?'true':'false');input.removeAttribute('aria-activedescendant');
}
function setAct(i){
  const n=list.children.length;if(!n)return;act=(i+n)%n;list.children[act].scrollIntoView({block:'nearest'});
  [...list.children].forEach((li,k)=>li.setAttribute('aria-selected',k===act));
  input.setAttribute('aria-activedescendant','o'+act);
}
let cu=0;
function renderCount(){
  const q=res.q,v=$('#countVis'),sr=$('#countSr');
  if(!q){v.textContent=sr.textContent='';return}
  const n=res.items.length;let txt;
  if(res.tag==='fuzzy'){txt=n?`No word starts with “${esc(q)}”. Did you mean…`:`No words near “${esc(q)}”.`;v.innerHTML=txt;sr.textContent=txt.replace(/&[a-z]+;/g,'');return}
  const label=res.tag==='wildcard'?'match the pattern':'match';
  sr.textContent=`${n} words ${label} ${q}`;
  const id=++cu,t0=performance.now();
  (function f(now){if(id!==cu)return;const k=Math.min(1,(now-t0)/350);
    v.innerHTML=`<b>${Math.round(n*k)}</b> words ${label} “${esc(q)}”${n>60?' · showing the top 60':''}`;if(k<1)requestAnimationFrame(f)})(t0);
}
function renderEmpty(){
  const e=$('#empty'),pl=$('#plant'),q=res.q;pl.innerHTML='';e.innerHTML='';
  if(q&&/^[a-z]+$/.test(q)&&!trie.search(q)){
    pl.innerHTML=`<button class="chip" id="plantBtn">🌱 “${q}” is not in the Trie. Plant it? (Ctrl+Enter)</button>`;
    $('#plantBtn').onclick=()=>plant(q);
  }
  if(q)return;
  const rec=store.get('trie.recent',[]);
  e.innerHTML=`<div class="row">Try: ${['tree','trie','travel'].map(w=>`<button class="chip" data-try="${w}">${w}</button>`).join('')}<button class="chip" data-try="t?ee">t?ee</button><button class="chip" data-try="pre*ion">pre*ion</button></div>`+
    (rec.length?`<div class="row">Recent: ${rec.map(w=>`<button class="chip" data-try="${w}">${w}</button>`).join('')}<button class="chip" id="clr">Clear</button></div>`:'');
  const c=$('#clr');if(c)c.onclick=()=>{store.set('trie.recent',[]);renderEmpty()};
}
$('#empty').addEventListener('click',e=>{const w=e.target.dataset.try;if(w){input.value=w;input.focus();update(true)}});
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),1500)}
function select(w){
  input.value=w;
  store.set('trie.recent',[w,...store.get('trie.recent',[]).filter(x=>x!==w)].slice(0,6));
  try{navigator.clipboard.writeText(w).then(()=>toast('Copied “'+w+'”'),()=>toast('Selected “'+w+'”'))}catch(e){toast('Selected “'+w+'”')}
  pulse();update(false);
}
list.addEventListener('click',e=>{const li=e.target.closest('li');if(li)select(li.dataset.w)});
function plant(w){
  if(!w||trie.search(w))return;
  trie.insert(w,40,performance.now());dict.push(w);
  store.set('trie.custom',[...store.get('trie.custom',[]),w]);
  burst(innerWidth/2,innerHeight/2.2);toast('Planted “'+w+'” 🌱');pulse();
  update(false);showTab('sky');
}
input.addEventListener('input',()=>{update(true);sparkAtInput();playTick(700+Math.random()*300)});
input.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();setAct(act+1)}
  else if(e.key==='ArrowUp'){e.preventDefault();setAct(act-1)}
  else if(e.key==='Enter'){e.preventDefault();if(e.ctrlKey||e.metaKey)plant(res.q);else if(res.items.length)select(res.items[Math.max(act,0)].word)}
  else if((e.key==='Tab'||e.key==='ArrowRight')&&ghostWord&&input.selectionStart===input.value.length){e.preventDefault();input.value=ghostWord;update(true)}
  else if(e.key==='Escape'){list.innerHTML='';input.setAttribute('aria-expanded','false');if(!input.value)input.blur()}
});
document.addEventListener('keydown',e=>{
  if(/INPUT|TEXTAREA/.test(document.activeElement.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='/'){e.preventDefault();input.focus()}
  else if(e.key.toLowerCase()==='c'&&document.activeElement.tagName!=='BUTTON'||e.key.toLowerCase()==='c'){showTab($('#t-sky').getAttribute('aria-selected')==='true'?'res':'sky')}
});
$('#surprise').onclick=()=>{
  const w=dict[Math.floor(Math.random()*Math.min(dict.length,CORE.length))];input.value='';let i=0;input.focus();
  (function step(){input.value=w.slice(0,++i);update(true);sparkAtInput();if(i<w.length)setTimeout(step,130);else pulse()})();
};
$('#reset').onclick=()=>{store.set('trie.custom',[]);buildDict();update(false);toast('Dictionary reset')};

/* tabs */
function showTab(k){
  for(const t of['res','sky','race','hunt']){$('#t-'+t).setAttribute('aria-selected',t===k);$('#p-'+t).hidden=t!==k}
  if(k==='sky'){sizeSky();buildSky()}if(k==='race')runRace();
}
for(const t of['res','sky','race','hunt'])$('#t-'+t).onclick=()=>showTab(t);

