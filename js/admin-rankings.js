/* ---- Rankings ---- */
var rankingSelectedTrimestre = '2026-2';
function renderRankingsAdmin(){
  var isPastor = currentUserRole==='pastor';
  var trimestreOpts = [
    { value:'2026-2', label:'2º Trimestre de 2026' },
    { value:'2026-1', label:'1º Trimestre de 2026' },
    { value:'2025-4', label:'4º Trimestre de 2025' }
  ];
  var optsHtml = trimestreOpts.map(function(o){
    return '<option value="'+o.value+'"'+(o.value===rankingSelectedTrimestre ? ' selected' : '')+'>'+o.label+'</option>';
  }).join('');
  return '<div class="detail-title">'+(isPastor ? 'Gerenciar ranking do meu distrito' : 'Gerenciar rankings')+'</div>'
    + (isPastor ? '<div class="section-sub">Ajustes aplicados ao ranking exibido para o '+userDistrict+'.</div>' : '')
    + '<div class="field"><label>Trimestre ativo</label><select id="rankingTrimestreSelect" onchange="setRankingTrimestre(this.value)">'+optsHtml+'</select></div>'
    + '<div class="toggle-row"><div><b style="font-size:12.5px;">Destacar Top 3 no ranking</b><div style="font-size:10.5px; color:var(--muted);">Medalhas de ouro, prata e bronze</div></div><div class="switch on" onclick="this.classList.toggle(\'on\')"><div class="knob"></div></div></div>'
    + '<button class="btn btn-solid" onclick="recalcRanking(this)">Recalcular ranking agora</button>';
}
function setRankingTrimestre(value){
  rankingSelectedTrimestre = value;
  var label = value==='2026-2' ? '2º Trimestre de 2026' : (value==='2026-1' ? '1º Trimestre de 2026' : '4º Trimestre de 2025');
  toast('Trimestre ativo do ranking definido para '+label+'.');
}
function recalcRanking(btn){
  var original = btn.textContent;
  btn.textContent = 'Recalculando...';
  btn.disabled = true;
  setTimeout(function(){
    btn.textContent = original;
    btn.disabled = false;
    toast('Ranking recalculado com sucesso.');
  }, 900);
}

