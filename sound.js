/* =====================================================================
   Sound: soft keystroke ticks via Web Audio (off by default)
   ===================================================================== */
let soundOn=false,actx=null;
function playTick(freq=880,dur=.04,vol=.035){
  if(!soundOn)return;
  try{
    actx=actx||new(window.AudioContext||window.webkitAudioContext)();
    const o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime;
    o.type='sine';o.frequency.value=freq;
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+dur);
  }catch(e){}
}
$('#sound').onclick=e=>{
  soundOn=!soundOn;const b=e.currentTarget;
  b.setAttribute('aria-pressed',soundOn);b.textContent=soundOn?'🔊 Sound on':'🔇 Sound off';playTick(900,.08);
};
