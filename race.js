/* =====================================================================
   MODULE 5: Race (Trie vs linear scan)
   ===================================================================== */
const raceOn=()=>!$('#p-race').hidden;
function runRace(){
  const q=res.q;if(!q||/[?*]/.test(q)){$('#rnote').textContent='Type a plain prefix to start the race.';return}
  const N=Math.max(20,Math.floor(40000/dict.length));
  let t=performance.now();for(let i=0;i<N;i++)trie.collect(q);const a=(performance.now()-t)/N;
  t=performance.now();for(let i=0;i<N;i++)dict.filter(w=>w.startsWith(q));const b=(performance.now()-t)/N;
  const mx=Math.max(a,b,1e-6);
  $('#rbT').style.transform=`scaleX(${a/mx})`;$('#rbL').style.transform=`scaleX(${b/mx})`;
  $('#rmT').textContent=a.toFixed(4)+' ms';$('#rmL').textContent=b.toFixed(4)+' ms';
  $('#rnote').textContent=`${dict.length.toLocaleString()} words. ${b>a?`Trie was ${(b/a).toFixed(1)}× faster.`:'Too small to tell. Try the boost.'}`;
}
$('#boost').onclick=()=>{
  const L='abcdefghijklmnopqrstuvwxyz',base=dict.slice(0,CORE.length);
  for(const w of base)for(let k=0;k<50;k++){const v=w+L[Math.random()*26|0]+L[Math.random()*26|0]+L[Math.random()*26|0];if(!trie.search(v)){trie.insert(v,1);dict.push(v)}}
  toast(dict.length.toLocaleString()+' words now');update(false);runRace();
};

