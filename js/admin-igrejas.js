/* ---- Igrejas e distritos ---- */
function renderIgrejas(){
  var isPastor = currentUserRole==='pastor';
  var scopeChurches = isPastor ? churchesInDistrict(userDistrict) : igrejasList;
  var totalIgrejasScope = scopeChurches.filter(function(g){ return g.tipo!=='Grupo'; }).length;
  var totalGruposScope = scopeChurches.filter(function(g){ return g.tipo==='Grupo'; }).length;
  var rows = scopeChurches.map(function(g){
    var isGrupo = g.tipo==='Grupo';
    return '<div class="igreja-row"><div class="ic">'+(isGrupo ? '👥' : '⛪')+'</div><div style="flex:1"><b>'+g.nome+(isGrupo ? ' <span class="badge-role" style="background:#F1EBFB; color:var(--purple);">Grupo</span>' : '')+'</b><span>'+g.distrito+' · Alvos: '+g.metas.missionarios+' miss. / '+g.metas.estudos+' est. / '+g.metas.batismos+' bat. / '+g.metas.enviados+' env.</span></div></div>';
  }).join('');
  var distritoOpts = isPastor ? '<option>'+userDistrict+'</option>' : distritosList.map(function(d){ return '<option>'+d.nome+'</option>'; }).join('');

  var html = '<div class="detail-title">'+(isPastor ? 'Editar igrejas e grupos do meu distrito' : 'Editar igrejas, grupos e distritos')+'</div>'
    + '<div class="section-sub">Cada igreja e distrito define sua própria meta anual — eles servem de base para o Termômetro Missionário, independente da pontuação dos desafios.</div>'
    + '<div class="section-title" style="margin-top:4px;">Nova igreja ou grupo</div>'
    + '<div class="mini-form">'
    + '<div class="field"><label>Nome</label><input id="newIgrejaNome" placeholder="Ex: Igreja Bom Pastor"></div>'
    + '<div class="two-col"><div class="field"><label>Tipo</label><select id="newIgrejaTipo"><option>Igreja</option><option>Grupo</option></select></div>'
    + '<div class="field"><label>Distrito</label><select id="newIgrejaDistrito"'+(isPastor ? ' disabled' : '')+'>'+distritoOpts+'</select></div></div>'
    + '<div class="section-sub" style="margin:6px 0 4px;">Meta anual</div>'
    + '<div class="two-col"><div class="field"><label>Alvo · Missionários em ação</label><input id="newIgrejaMetaMissionarios" type="number" value="80"></div><div class="field"><label>Alvo · Estudos bíblicos</label><input id="newIgrejaMetaEstudos" type="number" value="50"></div></div>'
    + '<div class="two-col"><div class="field"><label>Alvo · Batismos</label><input id="newIgrejaMetaBatismos" type="number" value="15"></div><div class="field"><label>Alvo · Enviados</label><input id="newIgrejaMetaEnviados" type="number" value="6"></div></div>'
    + '<button class="btn btn-solid" onclick="addIgreja()">+ Adicionar</button>'
    + '</div>'
    + '<div class="section-title">'+(isPastor ? 'Do meu distrito' : 'Cadastradas')+': '+totalIgrejasScope+' igrejas · '+totalGruposScope+' grupos</div>'
    + rows;

  if(isPastor){
    var d = getDistrict(userDistrict) || { metas:{ missionarios:0, estudos:0, batismos:0, enviados:0 } };
    html += '<div class="section-title">Meu distrito · '+userDistrict+'</div>'
      + '<div class="mini-form">'
      + '<div class="section-sub" style="margin:0 0 6px;">Ajuste a meta anual do seu distrito — usada no termômetro de indicadores e no ranking.</div>'
      + '<div class="two-col"><div class="field"><label>Alvo · Missionários em ação</label><input id="distMetaMissionarios" type="number" value="'+d.metas.missionarios+'"></div><div class="field"><label>Alvo · Estudos bíblicos</label><input id="distMetaEstudos" type="number" value="'+d.metas.estudos+'"></div></div>'
      + '<div class="two-col"><div class="field"><label>Alvo · Batismos</label><input id="distMetaBatismos" type="number" value="'+d.metas.batismos+'"></div><div class="field"><label>Alvo · Enviados</label><input id="distMetaEnviados" type="number" value="'+d.metas.enviados+'"></div></div>'
      + '<button class="btn btn-green" onclick="saveDistrictMetas()">Salvar alvos do distrito</button>'
      + '</div>';
  } else {
    var distritoRows = distritosList.map(function(dd){
      if(editingDistrictName===dd.nome) return renderDistrictEditForm(dd);
      return '<div class="igreja-row"><div class="ic">🗺️</div><div style="flex:1"><b>'+dd.nome+'</b><span>Pastor: '+(dd.pastor ? dd.pastor.nome : '—')+' · Alvos: '+dd.metas.missionarios+' miss. / '+dd.metas.estudos+' est. / '+dd.metas.batismos+' bat. / '+dd.metas.enviados+' env.</span></div>'
        + '<div class="row-actions"><button class="btn-approve" onclick="editDistrict(\''+dd.nome.replace(/'/g,"\\'")+'\')">Editar</button></div></div>';
    }).join('');
    html += '<div class="section-title">Novo distrito</div>'
      + '<div class="mini-form">'
      + '<div class="field"><label>Nome do distrito</label><input id="newDistritoNome" placeholder="Ex: Distrito Oeste"></div>'
      + '<div class="section-sub" style="margin:6px 0 4px;">Meta anual do distrito</div>'
      + '<div class="two-col"><div class="field"><label>Alvo · Missionários em ação</label><input id="newDistritoMetaMissionarios" type="number" value="200"></div><div class="field"><label>Alvo · Estudos bíblicos</label><input id="newDistritoMetaEstudos" type="number" value="120"></div></div>'
      + '<div class="two-col"><div class="field"><label>Alvo · Batismos</label><input id="newDistritoMetaBatismos" type="number" value="35"></div><div class="field"><label>Alvo · Enviados</label><input id="newDistritoMetaEnviados" type="number" value="16"></div></div>'
      + '<button class="btn btn-solid" onclick="addDistrito()">+ Adicionar distrito</button>'
      + '</div>'
      + '<div class="section-title">Distritos cadastrados ('+distritosList.length+')</div>'
      + distritoRows;
  }
  return html;
}
var editingDistrictName = null;
function renderDistrictEditForm(d){
  var p = d.pastor || { nome:'', email:'', telefone:'' };
  return '<div class="mini-form">'
    + '<div class="section-sub" style="margin:0 0 6px;">Distrito: <b>'+d.nome+'</b></div>'
    + '<div class="two-col"><div class="field"><label>Nome do pastor</label><input id="editDistPastorNome" value="'+p.nome+'"></div><div class="field"><label>E-mail do pastor</label><input id="editDistPastorEmail" value="'+p.email+'"></div></div>'
    + '<div class="field"><label>Telefone do pastor</label><input id="editDistPastorTelefone" value="'+(p.telefone||'')+'" placeholder="(86) 9 0000-0000"></div>'
    + '<div class="section-sub" style="margin:8px 0 4px;">Meta anual do distrito</div>'
    + '<div class="two-col"><div class="field"><label>Alvo · Missionários</label><input id="editDistMetaMissionarios" type="number" value="'+d.metas.missionarios+'"></div><div class="field"><label>Alvo · Estudos</label><input id="editDistMetaEstudos" type="number" value="'+d.metas.estudos+'"></div></div>'
    + '<div class="two-col"><div class="field"><label>Alvo · Batismos</label><input id="editDistMetaBatismos" type="number" value="'+d.metas.batismos+'"></div><div class="field"><label>Alvo · Enviados</label><input id="editDistMetaEnviados" type="number" value="'+d.metas.enviados+'"></div></div>'
    + '<div class="pending-actions"><button class="btn-approve" onclick="saveDistrictEdit(\''+d.nome.replace(/'/g,"\\'")+'\')">Salvar</button><button class="btn-reject" onclick="cancelEditDistrict()">Cancelar</button></div>'
    + '</div>';
}
function editDistrict(nome){ editingDistrictName = nome; renderAdmin('igrejas'); }
function cancelEditDistrict(){ editingDistrictName = null; renderAdmin('igrejas'); }
function saveDistrictEdit(nome){
  var d = getDistrict(nome);
  if(!d) return;
  if(!d.pastor) d.pastor = { nome:'', email:'', telefone:'' };
  d.pastor.nome = document.getElementById('editDistPastorNome').value.trim();
  d.pastor.email = document.getElementById('editDistPastorEmail').value.trim();
  d.pastor.telefone = document.getElementById('editDistPastorTelefone').value.trim();
  d.metas.missionarios = Number(document.getElementById('editDistMetaMissionarios').value)||0;
  d.metas.estudos = Number(document.getElementById('editDistMetaEstudos').value)||0;
  d.metas.batismos = Number(document.getElementById('editDistMetaBatismos').value)||0;
  d.metas.enviados = Number(document.getElementById('editDistMetaEnviados').value)||0;
  editingDistrictName = null;
  renderAdmin('igrejas');
  if(typeof renderIndicadoresView==='function') renderIndicadoresView();
  if(typeof calculateIndicSummary==='function') calculateIndicSummary();
  toast('Distrito '+nome+' atualizado.');
}
function saveDistrictMetas(){
  var d = getDistrict(userDistrict);
  if(!d) return;
  d.metas.missionarios = Number(document.getElementById('distMetaMissionarios').value)||0;
  d.metas.estudos = Number(document.getElementById('distMetaEstudos').value)||0;
  d.metas.batismos = Number(document.getElementById('distMetaBatismos').value)||0;
  d.metas.enviados = Number(document.getElementById('distMetaEnviados').value)||0;
  renderAdmin('igrejas');
  if(typeof renderIndicadoresView==='function') renderIndicadoresView();
  if(typeof calculateIndicSummary==='function') calculateIndicSummary();
  toast('Alvos do '+userDistrict+' atualizados.');
}
function addIgreja(){
  var nomeEl = document.getElementById('newIgrejaNome');
  var nome = nomeEl.value.trim();
  var tipoEl = document.getElementById('newIgrejaTipo');
  var tipo = tipoEl ? tipoEl.value : 'Igreja';
  var distrito = currentUserRole==='pastor' ? userDistrict : document.getElementById('newIgrejaDistrito').value;
  if(!nome){ toast('Informe o nome.'); return; }
  var metas = {
    missionarios: Number(document.getElementById('newIgrejaMetaMissionarios').value)||0,
    estudos: Number(document.getElementById('newIgrejaMetaEstudos').value)||0,
    batismos: Number(document.getElementById('newIgrejaMetaBatismos').value)||0,
    enviados: Number(document.getElementById('newIgrejaMetaEnviados').value)||0
  };
  igrejasList.unshift({ nome:nome, distrito:distrito, tipo:tipo, metas:metas, valores:{ missionarios:0, estudos:0, batismos:0, colp:0, plant:0, sva:0, oyim:0 }, trimestres: makeEmptyTrimestres(), desafiosTrimestres: makeEmptyDesafiosTrimestres() });
  renderAdmin('igrejas');
  toast((tipo==='Grupo' ? 'Grupo "' : 'Igreja "')+nome+'" cadastrado(a) em '+distrito+' com alvos definidos.');
}
function addDistrito(){
  var nomeEl = document.getElementById('newDistritoNome');
  var nome = nomeEl.value.trim();
  if(!nome){ toast('Informe o nome do distrito.'); return; }
  var metas = {
    missionarios: Number(document.getElementById('newDistritoMetaMissionarios').value)||0,
    estudos: Number(document.getElementById('newDistritoMetaEstudos').value)||0,
    batismos: Number(document.getElementById('newDistritoMetaBatismos').value)||0,
    enviados: Number(document.getElementById('newDistritoMetaEnviados').value)||0
  };
  distritosList.unshift({ nome:nome, metas:metas });
  renderAdmin('igrejas');
  toast('Distrito "'+nome+'" cadastrado com alvos definidos.');
}

