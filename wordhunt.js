/* =====================================================================
   Word Hunt: find long words that start with a random pair of letters.
   Words are validated with the Trie (search), and the best possible
   answer is found at the end with trie.collect(prefix).
   ===================================================================== */
const hunt={prefix:'',left:0,score:0,streak:0,found:[],timer:null};
const hIn=$('#hIn'),hMsg=$('#hMsg');
function huntMsg(t,bad){hMsg.textContent=t;hMsg.className=bad?'bad':''}
function huntStats(){
  $('#hTime').textContent=hunt.left+'s';$('#hScore').textContent=hunt.score+' pts';$('#hStreak').textContent='streak '+hunt.streak;
}
function huntStart(){
  const pool=[...new Set(CORE.map(b=>b[0].slice(0,2)))].filter(p=>trie.collect(p).length>=3); // prefixes with enough words
  hunt.prefix=pool[Math.floor(Math.random()*pool.length)];
  Object.assign(hunt,{left:30,score:0,streak:0,found:[]});
  $('#hList').innerHTML='';
  $('#hPrompt').innerHTML=`Find the longest words starting with <b>“${hunt.prefix}”</b>. Longer words score more.`;
  hIn.disabled=false;hIn.value='';hIn.focus();huntMsg('');huntStats();
  clearInterval(hunt.timer);
  hunt.timer=setInterval(()=>{hunt.left--;huntStats();if(hunt.left<=0)huntEnd()},1000);
}
function huntEnd(){
  clearInterval(hunt.timer);hunt.left=0;huntStats();hIn.disabled=true;
  const best=trie.collect(hunt.prefix).sort((a,b)=>b.word.length-a.word.length)[0];
  huntMsg(`Time is up: ${hunt.score} pts. The longest possible was “${best.word}” (${best.word.length} letters).`);
}
function huntSubmit(){
  const w=hIn.value.trim().toLowerCase();hIn.value='';if(!w)return;
  if(!w.startsWith(hunt.prefix)){hunt.streak=0;huntMsg(`Must start with “${hunt.prefix}”.`,true);playTick(200,.12,.06)}
  else if(hunt.found.includes(w)){huntMsg('Already found.',true)}
  else if(!trie.search(w)){hunt.streak=0;huntMsg(`“${w}” is not in the Trie.`,true);playTick(200,.12,.06)}
  else{
    const pts=w.length+(hunt.streak>=2?hunt.streak:0);   // streak bonus from the 3rd correct word
    hunt.score+=pts;hunt.streak++;hunt.found.push(w);
    huntMsg(`+${pts} for “${w}”`);playTick(1100,.1,.05);
    const li=document.createElement('li');li.className='chip';li.textContent=`${w} +${pts}`;$('#hList').append(li);
  }
  huntStats();
}
$('#hStart').onclick=huntStart;
hIn.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();huntSubmit()}});
