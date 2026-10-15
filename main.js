/* ===== boot: read ?q= from the URL ===== */
const initial=new URLSearchParams(location.search).get('q');
if(initial)input.value=initial.toLowerCase().replace(/[^a-z?*]/g,'');
update(false);
