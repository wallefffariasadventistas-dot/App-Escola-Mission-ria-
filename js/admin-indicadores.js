/* ---- Indicadores ---- */
function renderIndicAdmin(){
  var isPastor = currentUserRole==='pastor';
  var scopeChurches = isPastor ? churchesInDistrict(userDistrict) : igrejasList;
  var opts = scopeChurches.map(function(g){ return '<option>'+g.nome+'</option>'; }).join('');
  return '<div class="detail-title">'+(isPastor ? 'Metas do meu distrito' : 'Metas anuais e trimestrais')+'</div>'
    + '<div class="section-sub">Selecione a igreja para registrar a meta anual, as metas trimestrais e marcar cada trimestre como alcançado. Isso alimenta automaticamente o termômetro dessa igreja, do seu distrito e da Missão Piauiense completa.</div>'
    + '<div class="field"><label>Igreja</label><select id="indigreja" onchange="loadIndicAdminValues()">'+opts+'</select></div>'
    + '<div id="indicEditorWrapAdmin"></div>';
}
function loadIndicAdminValues(){
  var nome = document.getElementById('indigreja').value;
  renderIndicEditor(nome, 'indicEditorWrapAdmin');
}

