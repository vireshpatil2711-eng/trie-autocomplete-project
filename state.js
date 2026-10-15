/* =====================================================================
   MODULE 3: App state (dictionary, persistence)
   ===================================================================== */
let trie,dict;            // dict = flat array used by the linear-scan race
const $=s=>document.querySelector(s);
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function buildDict(){
  trie=new Trie();dict=[];
  for(const[w,f]of BASE){trie.insert(w,f);dict.push(w)}
  for(const w of store.get('trie.custom',[])){trie.insert(w,40);dict.push(w)}
}
buildDict();
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

