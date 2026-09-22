/* ================= MATERIAIS ================= */
function filterMateriais(){
  var term = (document.getElementById('materiaisSearch').value||'').toLowerCase().trim();
  var activeChip = document.querySelector('#materiaisFilters .chip.active');
  var cat = activeChip ? activeChip.dataset.cat : 'todos';
  var rows = document.querySelectorAll('#materiais-list .mat-row');
  var visibleCount = 0;
  rows.forEach(function(row){
    var name = row.querySelector('.mat-name').textContent.toLowerCase();
    var rowCats = (row.dataset.cat||'').toLowerCase();
    var matchesTerm = !term || name.indexOf(term)!==-1;
    var matchesCat = cat==='todos' || rowCats.indexOf(cat)!==-1;
    var show = matchesTerm && matchesCat;
    row.classList.toggle('hidden', !show);
    if(show) visibleCount++;
  });
  document.getElementById('materiaisEmpty').classList.toggle('hidden', visibleCount>0);
}
function downloadMaterial(nome, url, filename){
  var link = document.createElement('a');
  if(url){
    link.href = url;
    link.download = filename || nome;
  } else {
    var blob = new Blob(
      ['Escola Missionária — Missão Piauiense\n\nMaterial: '+nome+'\n\nEste é um arquivo de demonstração do protótipo. Quando um documento real for publicado pela Administração, o download entregará o arquivo original.'],
      { type:'text/plain;charset=utf-8' }
    );
    link.href = URL.createObjectURL(blob);
    link.download = nome.replace(/[^\w\-. ]/g,'').trim() + '.txt';
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast('Baixando "'+nome+'"...');
}

var roleLabels = { membro:'Membro', lider:'Líder', pastor:'Pastor Distrital', adm:'Administração' };
var currentUserRole = 'lider';
var userChurch = 'Aeroporto - Teresina';
var userDistrict = 'Aeroporto - PI';
function switchRole(role){
  currentUserRole = role;
  document.getElementById('role-badge').textContent = roleLabels[role];
  var selSidebar = document.getElementById('roleSelectSidebar');
  if(selSidebar) selSidebar.value = role;
  var selSheet = document.getElementById('roleSelectSheet');
  if(selSheet) selSheet.value = role;
  var showRoleSelector = actualLoginRole==='adm';
  var sidebarRoleRow = document.getElementById('sidebarRoleRow');
  if(sidebarRoleRow) sidebarRoleRow.classList.toggle('hidden', !showRoleSelector);
  var sheetRoleRow = document.getElementById('sheetRoleRow');
  if(sheetRoleRow) sheetRoleRow.classList.toggle('hidden', !showRoleSelector);
  var sheetRoleTitle = document.getElementById('sheetRoleTitle');
  if(sheetRoleTitle) sheetRoleTitle.classList.toggle('hidden', !showRoleSelector);
  var editButtons = document.querySelectorAll('.chal .mini-btn');
  var canEdit = (role==='lider' || role==='pastor' || role==='adm');
  editButtons.forEach(b=> b.style.visibility = canEdit ? 'visible' : 'hidden');

  document.getElementById('editIndicBtn').classList.toggle('hidden', role!=='adm');
  document.getElementById('indic-note').textContent = role==='adm'
    ? 'Você pode editar estes indicadores (Administração).'
    : 'Alimentado exclusivamente pela Administração da Missão.';

  var canAdmin = (role==='adm' || role==='pastor');
  var adminNav = document.getElementById('adminSheetItem');
  adminNav.style.display = canAdmin ? 'flex' : 'none';
  document.getElementById('adminSheetTitle').style.display = canAdmin ? 'block' : 'none';
  var adminSidebar = document.getElementById('adminSidebarItem');
  if(adminSidebar) adminSidebar.style.display = canAdmin ? 'flex' : 'none';

  document.getElementById('church-sub').textContent = role==='pastor'
    ? userDistrict+' (todas as igrejas) · Missão Piauiense'
    : role==='adm' ? 'Missão Piauiense (todas as igrejas)' : userDistrict+' · Missão Piauiense';

  var nameLabel = document.getElementById('church-name-label');
  var avatarEl = document.getElementById('church-avatar');
  if(nameLabel){
    if(role==='pastor'){ nameLabel.textContent = 'Meu Distrito · '+userDistrict; if(avatarEl) avatarEl.textContent = userDistrict.substring(0,2).toUpperCase(); }
    else if(role==='adm'){ nameLabel.textContent = 'Missão Piauiense'; if(avatarEl) avatarEl.textContent = 'MP'; }
    else { nameLabel.textContent = 'Minha Igreja · '+userChurch; if(avatarEl) avatarEl.textContent = userChurch.substring(0,2).toUpperCase(); }
  }

  if(!canAdmin){
    var pane = document.querySelector('.tabpane[data-pane="admin"]');
    if(!pane.classList.contains('hidden')) go('dashboard');
  }
  var ownIndicBtn = document.getElementById('editOwnIndicBtn');
  if(ownIndicBtn) ownIndicBtn.classList.toggle('hidden', role!=='lider');
  if(role!=='lider'){
    var ownWrap = document.getElementById('ownIndicEditorWrap');
    if(ownWrap) ownWrap.classList.add('hidden');
    ownIndicEditorOpen = false;
  }
  if(typeof applyIndicRoleRestrictions==='function') applyIndicRoleRestrictions(role);
  if(typeof applyDesafiosRoleRestrictions==='function') applyDesafiosRoleRestrictions();
  if(typeof applyRankingRoleRestrictions==='function') applyRankingRoleRestrictions();
  if(typeof applyAdminMenuRoleRestrictions==='function') applyAdminMenuRoleRestrictions();
  selectedQuarterView = currentQuarter;
  if(typeof calculateQuarterScore==='function') calculateQuarterScore();
  if(typeof calculateIndicSummary==='function') calculateIndicSummary();
}
var ownIndicEditorOpen = false;
function toggleOwnIndicEditor(){
  ownIndicEditorOpen = !ownIndicEditorOpen;
  var wrap = document.getElementById('ownIndicEditorWrap');
  if(!wrap) return;
  wrap.classList.toggle('hidden', !ownIndicEditorOpen);
  if(ownIndicEditorOpen) renderIndicEditor(userChurch, 'ownIndicEditorWrap');
}

var currentIndicEditChurch = null;
var currentIndicEditWrapId = null;
var indicCardEditState = {};
function getCardEditState(wrapId, nome, g){
  var st = indicCardEditState[wrapId];
  if(!st || st.church!==nome){
    st = {
      church: nome,
      metaAnual: somaIndicadores(g.metas)===0,
      tri: g.trimestres.map(function(t){ return somaIndicadores(t.meta)===0; }),
      triVal: g.trimestres.map(function(t){ return !(t.alcancado && somaIndicadores(t.valores)>0); })
    };
    indicCardEditState[wrapId] = st;
  }
  return st;
}
function metaReadoutHtml(m){
  return '<div class="meta-readout">'
    + '<div class="meta-readout-item"><span>Missionários</span><b>'+m.missionarios+'</b></div>'
    + '<div class="meta-readout-item"><span>Estudos</span><b>'+m.estudos+'</b></div>'
    + '<div class="meta-readout-item"><span>Batismos</span><b>'+m.batismos+'</b></div>'
    + '<div class="meta-readout-item"><span>Enviados</span><b>'+m.enviados+'</b></div>'
    + '</div>';
}
function renderIndicEditor(nome, wrapId){
  currentIndicEditChurch = nome;
  currentIndicEditWrapId = wrapId;
  var wrap = document.getElementById(wrapId);
  var g = getChurch(nome);
  if(!wrap) return;
  if(!g){ wrap.innerHTML = '<div class="empty-note">Igreja não encontrada.</div>'; return; }
  if(!g.trimestres) g.trimestres = makeEmptyTrimestres();
  var st = getCardEditState(wrapId, nome, g);

  var html = '<div class="profile-card">';
  if(st.metaAnual){
    html += '<div class="profile-card-title meta-form-anim">🎯 Meta Anual</div>'
      + '<div class="profile-card-sub meta-form-anim">Alvo do ano inteiro para esta igreja. Registre uma vez e ajuste sempre que precisar.</div>'
      + '<div class="two-col meta-form-anim"><div class="field"><label>Missionários em ação</label><input id="metaAnualMissionarios" type="number" value="'+g.metas.missionarios+'"></div><div class="field"><label>Estudos bíblicos</label><input id="metaAnualEstudos" type="number" value="'+g.metas.estudos+'"></div></div>'
      + '<div class="two-col meta-form-anim"><div class="field"><label>Batismos</label><input id="metaAnualBatismos" type="number" value="'+g.metas.batismos+'"></div><div class="field"><label>Enviados</label><input id="metaAnualEnviados" type="number" value="'+g.metas.enviados+'"></div></div>'
      + '<button class="btn btn-solid meta-form-anim" onclick="saveMetaAnual()">💾 Salvar Meta Anual</button>';
  } else {
    html += '<div class="profile-card-title">🎯 Meta Anual <button class="edit-meta-btn" onclick="editMetaAnual()">✏️ Editar</button></div>'
      + metaReadoutHtml(g.metas);
  }
  html += '</div>';

  var achieved = computeAchievedForChurch(g);
  var totalMetaAnual = g.metas.missionarios+g.metas.estudos+g.metas.batismos+g.metas.enviados;
  var totalAchieved = achieved.missionarios+achieved.estudos+achieved.batismos+achieved.enviados;
  var pctAnual = totalMetaAnual>0 ? Math.round((totalAchieved/totalMetaAnual)*100) : 0;
  var faltaAnual = Math.max(0, totalMetaAnual-totalAchieved);
  html += '<div class="profile-card">'
    + '<div class="profile-card-title">📈 Progresso do Ano</div>'
    + '<div class="profile-card-sub" style="margin-bottom:0;">'+pctAnual+'% da meta anual já alcançado (somando os trimestres marcados como alcançados). Faltam <b style="color:var(--navy);">'+faltaAnual+'</b> pontos no total para bater a meta anual.</div>'
    + '</div>';

  g.trimestres.forEach(function(t, i){
    var totalMetaT = somaIndicadores(t.meta);
    var totalAchievedT = somaIndicadores(t.valores);
    var pctT = totalMetaT>0 ? Math.round((totalAchievedT/totalMetaT)*100) : 0;
    var badge;
    if(!t.alcancado){
      badge = '<span class="tag">Em andamento</span>';
    } else if(pctT>=100){
      badge = '<span class="tag" style="background:var(--green-light); color:var(--green);">✅ Alcançado totalmente</span>';
    } else {
      badge = '<span class="tag" style="background:var(--amber-light); color:var(--amber);">🔶 Alcançado parcialmente · '+pctT+'%</span>';
    }
    html += '<div class="profile-card">';
    if(st.tri[i]){
      html += '<div class="profile-card-title meta-form-anim">'+TRIMESTRE_LABELS[i]+' '+badge+'</div>'
        + '<div class="profile-card-sub meta-form-anim">Registre o alvo deste trimestre. Pode editar quantas vezes precisar, mesmo depois de registrar o que foi alcançado.</div>'
        + '<div class="two-col meta-form-anim"><div class="field"><label>Meta · Missionários</label><input id="tri'+i+'MetaMissionarios" type="number" value="'+t.meta.missionarios+'"></div><div class="field"><label>Meta · Estudos</label><input id="tri'+i+'MetaEstudos" type="number" value="'+t.meta.estudos+'"></div></div>'
        + '<div class="two-col meta-form-anim"><div class="field"><label>Meta · Batismos</label><input id="tri'+i+'MetaBatismos" type="number" value="'+t.meta.batismos+'"></div><div class="field"><label>Meta · Enviados</label><input id="tri'+i+'MetaEnviados" type="number" value="'+t.meta.enviados+'"></div></div>'
        + '<button class="btn btn-ghost-dark meta-form-anim" style="margin-bottom:14px;" onclick="saveTrimestreMeta('+i+')">Salvar meta do trimestre</button>';
    } else {
      html += '<div class="profile-card-title">'+TRIMESTRE_LABELS[i]+' '+badge+' <button class="edit-meta-btn" onclick="editTrimestreMeta('+i+')">✏️ Editar meta</button></div>'
        + metaReadoutHtml(t.meta)
        + '<div style="margin-bottom:14px;"></div>';
    }
    if(st.triVal[i]){
      html += '<div class="profile-card-title meta-form-anim" style="margin:4px 0 8px; font-size:12.5px;">Números alcançados neste trimestre</div>'
        + '<div class="profile-card-sub meta-form-anim">Registre o que realmente foi alcançado. Ao salvar, isso já conta como o resultado do trimestre — não existe uma etapa separada de "marcar".</div>'
        + '<div class="two-col meta-form-anim"><div class="field"><label>Alcançado · Missionários</label><input id="tri'+i+'ValMissionarios" type="number" value="'+t.valores.missionarios+'"></div><div class="field"><label>Alcançado · Estudos</label><input id="tri'+i+'ValEstudos" type="number" value="'+t.valores.estudos+'"></div></div>'
        + '<div class="two-col meta-form-anim"><div class="field"><label>Alcançado · Batismos</label><input id="tri'+i+'ValBatismos" type="number" value="'+t.valores.batismos+'"></div><div class="field"><label>Alcançado · Enviados</label><input id="tri'+i+'ValEnviados" type="number" value="'+t.valores.enviados+'"></div></div>'
        + '<button class="btn btn-green meta-form-anim" onclick="saveTrimestreValores('+i+')">💾 Salvar como alcançado</button>';
    } else {
      html += '<div class="profile-card-title" style="margin:12px 0 10px; font-size:12.5px;">Números alcançados <button class="edit-meta-btn" onclick="editTrimestreValores('+i+')">✏️ Editar</button></div>'
        + metaReadoutHtml(t.valores)
        + '<div class="profile-card-sub" style="margin:10px 0 0;">'+(totalMetaT>0 ? pctT : 0)+'% da meta deste trimestre '+(pctT>=100 ? 'alcançada — parabéns!' : 'alcançada até agora.')+'</div>'
        + renderTrimestreResultHtml(t);
    }
    html += '</div>';
  });

  wrap.innerHTML = html;
}
function renderTrimestreResultHtml(t){
  var itens = [
    { label:'Missionários em ação', meta:t.meta.missionarios, val:t.valores.missionarios },
    { label:'Estudos bíblicos', meta:t.meta.estudos, val:t.valores.estudos },
    { label:'Batismos', meta:t.meta.batismos, val:t.valores.batismos },
    { label:'Enviados', meta:t.meta.enviados, val:t.valores.enviados }
  ];
  var rows = itens.map(function(it){
    var ok = it.val >= it.meta;
    var falta = Math.max(0, it.meta-it.val);
    return '<div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; padding:6px 0; border-bottom:1px solid var(--line);">'
      + '<span>'+it.label+'</span>'
      + '<span style="font-weight:700; color:'+(ok ? 'var(--green)' : 'var(--red)')+';">'+(ok ? '✅ Meta alcançada' : '⚠️ Faltou '+falta)+'</span></div>';
  }).join('');
  return '<div style="margin-top:8px;">'+rows+'</div>';
}
function getEditingChurch(){ return getChurch(currentIndicEditChurch); }
function refreshAfterIndicEdit(){
  renderIndicEditor(currentIndicEditChurch, currentIndicEditWrapId);
  if(typeof renderIndicadoresView==='function') renderIndicadoresView();
  if(typeof calculateIndicSummary==='function') calculateIndicSummary();
}
function editMetaAnual(){
  var st = indicCardEditState[currentIndicEditWrapId];
  if(st) st.metaAnual = true;
  renderIndicEditor(currentIndicEditChurch, currentIndicEditWrapId);
}
function editTrimestreMeta(i){
  var st = indicCardEditState[currentIndicEditWrapId];
  if(st) st.tri[i] = true;
  renderIndicEditor(currentIndicEditChurch, currentIndicEditWrapId);
}
function editTrimestreValores(i){
  var st = indicCardEditState[currentIndicEditWrapId];
  if(st) st.triVal[i] = true;
  renderIndicEditor(currentIndicEditChurch, currentIndicEditWrapId);
}
function saveMetaAnual(){
  var g = getEditingChurch();
  if(!g) return;
  g.metas.missionarios = Number(document.getElementById('metaAnualMissionarios').value)||0;
  g.metas.estudos = Number(document.getElementById('metaAnualEstudos').value)||0;
  g.metas.batismos = Number(document.getElementById('metaAnualBatismos').value)||0;
  g.metas.enviados = Number(document.getElementById('metaAnualEnviados').value)||0;
  var st = indicCardEditState[currentIndicEditWrapId];
  if(st) st.metaAnual = false;
  refreshAfterIndicEdit();
  toast('Meta anual salva.');
}
function saveTrimestreMeta(i){
  var g = getEditingChurch();
  if(!g) return;
  var t = g.trimestres[i];
  t.meta.missionarios = Number(document.getElementById('tri'+i+'MetaMissionarios').value)||0;
  t.meta.estudos = Number(document.getElementById('tri'+i+'MetaEstudos').value)||0;
  t.meta.batismos = Number(document.getElementById('tri'+i+'MetaBatismos').value)||0;
  t.meta.enviados = Number(document.getElementById('tri'+i+'MetaEnviados').value)||0;
  var st = indicCardEditState[currentIndicEditWrapId];
  if(st) st.tri[i] = false;
  refreshAfterIndicEdit();
  toast((i+1)+'º trimestre: meta registrada.');
}
function saveTrimestreValores(i){
  var g = getEditingChurch();
  if(!g) return;
  var t = g.trimestres[i];
  t.valores.missionarios = Number(document.getElementById('tri'+i+'ValMissionarios').value)||0;
  t.valores.estudos = Number(document.getElementById('tri'+i+'ValEstudos').value)||0;
  t.valores.batismos = Number(document.getElementById('tri'+i+'ValBatismos').value)||0;
  t.valores.enviados = Number(document.getElementById('tri'+i+'ValEnviados').value)||0;
  t.alcancado = somaIndicadores(t.valores) > 0;
  var st = indicCardEditState[currentIndicEditWrapId];
  if(st) st.triVal[i] = false;
  refreshAfterIndicEdit();
  var totalMeta = somaIndicadores(t.meta);
  var pct = totalMeta>0 ? Math.round((somaIndicadores(t.valores)/totalMeta)*100) : 0;
  if(!t.alcancado){
    toast((i+1)+'º trimestre: números zerados — volta a ficar "em andamento".');
  } else if(pct>=100){
    toast((i+1)+'º trimestre: alcançado totalmente ('+pct+'%)! 🎉');
  } else {
    toast((i+1)+'º trimestre: alcançado parcialmente ('+pct+'% da meta).');
  }
}

