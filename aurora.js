/* =====================================================================
   MODULE 7: Aurora (reacts to search)
   ===================================================================== */
const aur=$('#aurora');
function updateAurora(){
  const n=res.items.length,q=res.q;let op=.35,hue=0,dur=16;
  if(q&&res.tag==='fuzzy'||q&&!n){op=.15;hue=140;dur=30}      // no match: cold blue, slow
  else if(q){op=Math.min(.95,.45+n/40);dur=Math.max(6,16-n/3)} // more matches: brighter, faster
  aur.style.opacity=op;aur.style.filter=`hue-rotate(${hue}deg) blur(30px)`;aur.style.animationDuration=dur+'s';
}
function pulse(){aur.classList.remove('pulse');void aur.offsetWidth;aur.classList.add('pulse')}

