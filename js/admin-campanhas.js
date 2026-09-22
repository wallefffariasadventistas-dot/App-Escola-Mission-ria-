/* ---- Campanhas ---- */
function renderCampanhas(){
  var rows = campanhasList.map(function(c,i){
    var ativa = c.status==='ativa';
    return '<div class="campaign-row"><div style="flex:1"><b>'+escapeHtml(c.nome)+'</b><span>'+(ativa?'Ativa':'Encerrada')+'</span></div>'
      + '<button class="status-toggle" style="background:'+(ativa?'var(--red-light)':'var(--green-light)')+'; color:'+(ativa?'var(--red)':'var(--green)')+';" onclick="toggleCampanha('+i+')">'+(ativa?'Encerrar':'Liberar')+'</button></div>';
  }).join('');
  return '<div class="detail-title">Liberar campanhas</div>'
    + '<div class="mini-form"><div class="field"><label>Nova campanha</label><input id="novaCampanha" placeholder="Ex: Semana de Oração Missionária"></div>'
    + '<button class="btn btn-solid" onclick="addCampanha()">+ Criar e liberar</button></div>'
    + rows;
}
function toggleCampanha(i){
  campanhasList[i].status = campanhasList[i].status==='ativa' ? 'encerrada' : 'ativa';
  renderAdmin('campanhas');
  toast('Campanha "'+campanhasList[i].nome+'" '+(campanhasList[i].status==='ativa'?'liberada':'encerrada')+'.');
}
function addCampanha(){
  var nomeEl = document.getElementById('novaCampanha');
  var nome = nomeEl.value.trim();
  if(!nome){ toast('Informe o nome da campanha.'); return; }
  campanhasList.unshift({ nome:nome, status:'ativa' });
  renderAdmin('campanhas');
  toast('Campanha "'+nome+'" criada e liberada.');
}

