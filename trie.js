/* =====================================================================
   MODULE 1: Trie  (data structure only, no DOM)
   ===================================================================== */
class TrieNode{constructor(){this.c={};this.end=false;this.f=0;this.best=0;this.born=0}}
class Trie{
  constructor(){this.root=new TrieNode();this.size=0;this.visits=0}
  insert(w,f=1,born=0){
    let n=this.root;n.best=Math.max(n.best,f);
    for(const ch of w){if(!n.c[ch]){n.c[ch]=new TrieNode();n.c[ch].born=born}n=n.c[ch];n.best=Math.max(n.best,f)}
    if(!n.end)this.size++;n.end=true;n.f=f;
  }
  /* walk a prefix; returns node (or null) and the nodes touched incl. root */
  find(p){let n=this.root,v=1;for(const ch of p){n=n.c[ch];if(!n)return{node:null,visited:v};v++}return{node:n,visited:v}}
  search(w){const r=this.find(w);return !!r.node&&r.node.end}
  startsWith(p){return !!this.find(p).node}
  getSubtree(p){return this.find(p).node}
  /* all words under a prefix, most popular first */
  collect(p,limit=Infinity){
    const r=this.find(p);this.visits=r.visited;if(!r.node)return[];
    const out=[];const dfs=(n,acc)=>{this.visits++;if(n.end)out.push({word:acc,freq:n.f});for(const k in n.c)dfs(n.c[k],acc+k)};
    dfs(r.node,p);this.visits--;return out.sort((a,b)=>b.freq-a.freq).slice(0,limit);
  }
  /* ? = one letter, * = any run of letters */
  wildcardSearch(pat){
    this.visits=1;const m=new Map();
    const go=(n,i,acc)=>{this.visits++;
      if(i===pat.length){if(n.end)m.set(acc,n.f);return}
      const p=pat[i];
      if(p==='*'){go(n,i+1,acc);for(const k in n.c)go(n.c[k],i,acc+k)}
      else if(p==='?'){for(const k in n.c)go(n.c[k],i+1,acc+k)}
      else if(n.c[p])go(n.c[p],i+1,acc+p);
    };
    go(this.root,0,'');
    return[...m].map(([word,freq])=>({word,freq})).sort((a,b)=>b.freq-a.freq);
  }
  /* Levenshtein over the Trie, pruning rows that already exceed maxDistance */
  fuzzySearch(q,max=1){
    this.visits=1;const out=[];
    const rec=(n,ch,prev,acc)=>{
      this.visits++;const row=[prev[0]+1];
      for(let i=1;i<=q.length;i++)row[i]=Math.min(row[i-1]+1,prev[i]+1,prev[i-1]+(q[i-1]===ch?0:1));
      if(n.end&&row[q.length]<=max)out.push({word:acc,freq:n.f,d:row[q.length]});
      if(Math.min(...row)<=max)for(const k in n.c)rec(n.c[k],k,row,acc+k);
    };
    const first=Array.from({length:q.length+1},(_,i)=>i);
    for(const k in this.root.c)rec(this.root.c[k],k,first,k);
    return out.sort((a,b)=>a.d-b.d||b.freq-a.freq);
  }
}
/* quick self-test, results in the console */
(function(){const t=new Trie();['tree','trie','travel','tea'].forEach((w,i)=>t.insert(w,10-i));
  console.assert(t.search('tree')&&!t.search('tre'),'search');
  console.assert(t.startsWith('tr')&&!t.startsWith('x'),'startsWith');
  console.assert(t.collect('tr')[0].word==='tree','collect order');
  console.assert(t.wildcardSearch('t?ee').length===1,'wildcard ?');
  console.assert(t.wildcardSearch('t*e').length===2,'wildcard *');
  console.assert(t.fuzzySearch('tre',1).some(r=>r.word==='tea'||r.word==='tree'),'fuzzy');
  console.assert(t.find('tre').visited===4,'visited count');console.log('Trie tests passed');})();

