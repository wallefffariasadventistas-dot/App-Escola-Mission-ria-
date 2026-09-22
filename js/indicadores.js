/* ================= INDICADORES: ESCOPO IGREJA / DISTRITO / MISSÃO ================= */
var indicScope = { type:'igreja', name:'Aeroporto - Teresina' };
function getChurch(nome){ return igrejasList.find(function(g){ return g.nome===nome; }); }
function getDistrict(nome){ return distritosList.find(function(d){ return d.nome===nome; }); }
function churchesInDistrict(distrito){ return igrejasList.filter(function(g){ return g.distrito===distrito; }); }
function unitsSummary(distrito){
  var units = churchesInDistrict(distrito);
  var igrejas = units.filter(function(g){ return g.tipo!=='Grupo'; }).length;
  var grupos = units.filter(function(g){ return g.tipo==='Grupo'; }).length;
  return igrejas+' igrejas · '+grupos+' grupos';
}
function computeAchievedForChurch(g){
  var out = { missionarios:0, estudos:0, batismos:0, enviados:0 };
  (g.trimestres||[]).forEach(function(t){
    if(t.alcancado){
      out.missionarios += t.valores.missionarios;
      out.estudos += t.valores.estudos;
      out.batismos += t.valores.batismos;
      out.enviados += t.valores.enviados;
    }
  });
  return out;
}
function aggregateAchieved(churches){
  var out = { missionarios:0, estudos:0, batismos:0, enviados:0 };
  churches.forEach(function(g){
    var a = computeAchievedForChurch(g);
    out.missionarios += a.missionarios;
    out.estudos += a.estudos;
    out.batismos += a.batismos;
    out.enviados += a.enviados;
  });
  return out;
}
function aggregateColpDetail(churches){
  var out = { colp:0, plant:0, sva:0, oyim:0 };
  churches.forEach(function(g){
    out.colp += g.valores.colp;
    out.plant += g.valores.plant;
    out.sva += g.valores.sva;
    out.oyim += g.valores.oyim;
  });
  return out;
}
function aggregateMetas(list){
  var out = { missionarios:0, estudos:0, batismos:0, enviados:0 };
  list.forEach(function(item){
    out.missionarios += item.metas.missionarios;
    out.estudos += item.metas.estudos;
    out.batismos += item.metas.batismos;
    out.enviados += item.metas.enviados;
  });
  return out;
}
function computeIndicData(){
  var valores, metas, label, sublabel, colpDetail, churchRef = null;
  if(indicScope.type==='igreja'){
    var g = getChurch(indicScope.name);
    if(!g) return null;
    if(!g.trimestres) g.trimestres = makeEmptyTrimestres();
    valores = computeAchievedForChurch(g);
    metas = g.metas;
    label = g.nome;
    sublabel = g.distrito;
    colpDetail = { colp:g.valores.colp, plant:g.valores.plant, sva:g.valores.sva, oyim:g.valores.oyim };
    churchRef = g;
  } else if(indicScope.type==='distrito'){
    var d = getDistrict(indicScope.name);
    if(!d) return null;
    var churches = churchesInDistrict(d.nome);
    valores = aggregateAchieved(churches);
    metas = d.metas;
    label = d.nome;
    sublabel = unitsSummary(d.nome);
    colpDetail = aggregateColpDetail(churches);
  } else {
    valores = aggregateAchieved(igrejasList);
    metas = somaIndicadores(missaoMetaAnual)>0 ? missaoMetaAnual : aggregateMetas(distritosList);
    label = 'Missão Piauiense';
    var totalIgrejas = igrejasList.filter(function(g){ return g.tipo!=='Grupo'; }).length;
    var totalGrupos = igrejasList.filter(function(g){ return g.tipo==='Grupo'; }).length;
    sublabel = totalIgrejas+' igrejas · '+totalGrupos+' grupos · '+distritosList.length+' distritos';
    colpDetail = aggregateColpDetail(igrejasList);
  }
  return { valores:valores, metas:metas, enviados:valores.enviados, label:label, sublabel:sublabel, colpDetail:colpDetail, church:churchRef };
}
function indicScopeTitleText(){
  if(indicScope.type==='igreja'){
    return indicScope.name===userChurch ? 'Indicadores Missionários da Minha Igreja' : 'Indicadores Missionários — '+indicScope.name;
  } else if(indicScope.type==='distrito'){
    return indicScope.name===userDistrict ? 'Indicadores Missionários do Meu Distrito' : 'Indicadores Missionários — '+indicScope.name;
  }
  return 'Indicadores Missionários da Missão Piauiense';
}
function renderIndicadoresView(){
  var data = computeIndicData();
  if(!data) return;
  var titleEl = document.getElementById('indicSectionTitle');
  if(titleEl) titleEl.textContent = indicScopeTitleText();
  document.getElementById('indicScopeLabel').textContent = data.label;
  document.getElementById('indicScopeSub').textContent = data.sublabel;
  var badge = document.getElementById('indicScopeBadge');
  badge.textContent = indicScope.type==='igreja' ? 'IGREJA' : (indicScope.type==='distrito' ? 'DISTRITO' : 'MISSÃO');
  badge.className = 'scope-badge scope-'+indicScope.type;

  document.getElementById('ind-missionarios').textContent = data.valores.missionarios;
  document.getElementById('ind-estudos').textContent = data.valores.estudos;
  document.getElementById('ind-batismos').textContent = data.valores.batismos;
  document.getElementById('ind-enviados').textContent = data.enviados;
  document.getElementById('ind-colp').textContent = 'Colportagem: '+data.colpDetail.colp;
  document.getElementById('ind-plant').textContent = 'Plantio de Igrejas: '+data.colpDetail.plant;
  document.getElementById('ind-sva').textContent = 'SVA: '+data.colpDetail.sva;
  document.getElementById('ind-oyim').textContent = 'OYiM: '+data.colpDetail.oyim;

  var metaAnualCard = document.getElementById('indicMetaAnualCard');
  if(metaAnualCard){
    var m = data.metas;
    document.getElementById('indicMetaAnualValues').textContent = m.missionarios+' miss. · '+m.estudos+' est. · '+m.batismos+' bat. · '+m.enviados+' env.';
    var totalMeta = m.missionarios+m.estudos+m.batismos+m.enviados;
    var totalAtual = data.valores.missionarios+data.valores.estudos+data.valores.batismos+data.enviados;
    var falta = Math.max(0, totalMeta-totalAtual);
    var pct = totalMeta>0 ? Math.round((totalAtual/totalMeta)*100) : 0;
    document.getElementById('indicMetaAnualProgresso').textContent = pct+'% da meta anual alcançado até agora (somando os trimestres já marcados como alcançados) · faltam '+falta+' pontos no total.';
  }

  if(ownIndicEditorOpen && indicScope.type==='igreja' && indicScope.name===userChurch){
    renderIndicEditor(userChurch, 'ownIndicEditorWrap');
  }

  renderMissaoAdminDashboard();
  recalcThermometer();
}
function recalcThermometer(){
  var data = computeIndicData();
  if(!data) return;
  var totalAtual = data.valores.missionarios + data.valores.estudos + data.valores.batismos + data.enviados;
  var totalMeta = data.metas.missionarios + data.metas.estudos + data.metas.batismos + data.metas.enviados;
  var pct = totalMeta>0 ? Math.round((totalAtual/totalMeta)*100) : 0;
  pct = Math.max(0, Math.min(100, pct));
  var fill = document.getElementById('indicThermoFill');
  if(fill) fill.style.height = pct+'%';
  var legend = document.getElementById('indicThermoLegend');
  var scopeText = indicScope.type==='igreja' ? 'da igreja' : (indicScope.type==='distrito' ? 'do distrito' : 'da Missão Piauiense');
  if(legend) legend.innerHTML = '<b>Termômetro Missionário</b>'+pct+'% da meta anual '+scopeText;
}
var missaoCardEditState = { metaAnual: true, tri: [true, true, true, true] };
function renderMissaoAdminDashboard(){
  var wrap = document.getElementById('missaoAdminDashboard');
  if(!wrap) return;
  var show = currentUserRole==='adm' && indicScope.type==='missao';
  wrap.classList.toggle('hidden', !show);
  if(!show) return;

  var achievedAnual = aggregateAchieved(igrejasList);
  var totalMetaAnual = somaIndicadores(missaoMetaAnual);
  var totalAchievedAnual = somaIndicadores(achievedAnual);
  var pctAnual = totalMetaAnual>0 ? Math.round((totalAchievedAnual/totalMetaAnual)*100) : 0;
  var faltaAnual = Math.max(0, totalMetaAnual-totalAchievedAnual);

  var html = '<div class="profile-card" style="border:1.5px solid var(--primary);">';
  if(missaoCardEditState.metaAnual){
    html += '<div class="profile-card-title meta-form-anim">🏛️ Meta Geral da Missão Piauiense <span class="tag" style="background:var(--primary-light); color:var(--primary);">Só Administração</span></div>'
      + '<div class="profile-card-sub meta-form-anim">Defina o alvo anual da Missão inteira. O quanto já foi alcançado vem automaticamente da soma do que cada distrito/igreja já marcou como alcançado nos trimestres.</div>'
      + '<div class="two-col meta-form-anim"><div class="field"><label>Missionários em ação</label><input id="missaoMetaMissionarios" type="number" value="'+missaoMetaAnual.missionarios+'"></div><div class="field"><label>Estudos bíblicos</label><input id="missaoMetaEstudos" type="number" value="'+missaoMetaAnual.estudos+'"></div></div>'
      + '<div class="two-col meta-form-anim"><div class="field"><label>Batismos</label><input id="missaoMetaBatismos" type="number" value="'+missaoMetaAnual.batismos+'"></div><div class="field"><label>Enviados</label><input id="missaoMetaEnviados" type="number" value="'+missaoMetaAnual.enviados+'"></div></div>'
      + '<button class="btn btn-solid meta-form-anim" onclick="saveMissaoMetaAnual()">💾 Salvar Meta Anual da Missão</button>';
  } else {
    html += '<div class="profile-card-title">🏛️ Meta Geral da Missão <span class="tag" style="background:var(--primary-light); color:var(--primary);">Só Administração</span> <button class="edit-meta-btn" onclick="editMissaoMetaAnual()">✏️ Editar</button></div>'
      + metaReadoutHtml(missaoMetaAnual);
  }
  html += '</div>';

  html += '<div class="profile-card">'
    + '<div class="profile-card-title">📈 Progresso Anual da Missão</div>'
    + '<div class="profile-card-sub" style="margin-bottom:0;">'+pctAnual+'% do alvo anual da Missão já alcançado. Faltam <b style="color:var(--navy);">'+faltaAnual+'</b> pontos no total.</div>'
    + '</div>';

  missaoMetasTrimestrais.forEach(function(m, i){
    var achievedT = aggregateAchievedTrimester(igrejasList, i);
    var totalMetaT = somaIndicadores(m);
    var totalAchievedT = somaIndicadores(achievedT);
    var pctT = totalMetaT>0 ? Math.round((totalAchievedT/totalMetaT)*100) : 0;
    html += '<div class="profile-card">';
    if(missaoCardEditState.tri[i]){
      html += '<div class="profile-card-title meta-form-anim">'+TRIMESTRE_LABELS[i]+' <span class="tag" style="background:var(--primary-light); color:var(--primary);">Missão</span></div>'
        + '<div class="two-col meta-form-anim"><div class="field"><label>Meta · Missionários</label><input id="missaoTri'+i+'Missionarios" type="number" value="'+m.missionarios+'"></div><div class="field"><label>Meta · Estudos</label><input id="missaoTri'+i+'Estudos" type="number" value="'+m.estudos+'"></div></div>'
        + '<div class="two-col meta-form-anim"><div class="field"><label>Meta · Batismos</label><input id="missaoTri'+i+'Batismos" type="number" value="'+m.batismos+'"></div><div class="field"><label>Meta · Enviados</label><input id="missaoTri'+i+'Enviados" type="number" value="'+m.enviados+'"></div></div>'
        + '<button class="btn btn-ghost-dark meta-form-anim" style="margin-bottom:10px;" onclick="saveMissaoTrimestreMeta('+i+')">Salvar meta do trimestre</button>';
    } else {
      html += '<div class="profile-card-title">'+TRIMESTRE_LABELS[i]+' <span class="tag" style="background:var(--primary-light); color:var(--primary);">Missão</span> <button class="edit-meta-btn" onclick="editMissaoTrimestreMeta('+i+')">✏️ Editar</button></div>'
        + metaReadoutHtml(m);
    }
    html += '<div class="profile-card-sub" style="margin:10px 0 0;">'+pctT+'% alcançado neste trimestre ('+totalAchievedT+' de '+totalMetaT+') — considerando o que já foi marcado como alcançado pelos distritos/igrejas.</div>'
      + '</div>';
  });

  html += buildMissaoComparativoHtml(achievedAnual);
  wrap.innerHTML = html;
}
function buildMissaoComparativoHtml(achievedAnual){
  var indicadores = [
    { key:'missionarios', label:'Missionários em Ação' },
    { key:'estudos', label:'Amigos Estudando a Bíblia' },
    { key:'batismos', label:'Novos Discípulos' },
    { key:'enviados', label:'Missionários Enviados' }
  ];
  var rows = indicadores.map(function(ind){
    var meta = missaoMetaAnual[ind.key];
    var alcancado = achievedAnual[ind.key];
    var pct = meta>0 ? Math.round((alcancado/meta)*100) : 0;
    return '<div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; padding:7px 0; border-bottom:1px solid var(--line);">'
      + '<span style="flex:1;">'+ind.label+'</span>'
      + '<span style="width:48px; text-align:right; color:var(--muted);">'+meta+'</span>'
      + '<span style="width:48px; text-align:right; font-weight:700; color:var(--navy);">'+alcancado+'</span>'
      + '<span style="width:44px; text-align:right; font-weight:800; color:'+(pct>=100 ? 'var(--green)' : 'var(--primary)')+';">'+pct+'%</span>'
      + '</div>';
  }).join('');

  var trimestreRows = missaoMetasTrimestrais.map(function(m,i){
    var achievedT = aggregateAchievedTrimester(igrejasList, i);
    var metaT = somaIndicadores(m);
    var alcT = somaIndicadores(achievedT);
    var pctT = metaT>0 ? Math.round((alcT/metaT)*100) : 0;
    var status = metaT===0 ? '—' : (pctT>=100 ? '✅ Alcançado totalmente' : '🔶 Alcançado parcialmente · '+pctT+'%');
    return '<div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; padding:7px 0; border-bottom:1px solid var(--line);">'
      + '<span style="flex:1;">'+TRIMESTRE_LABELS[i].split(' · ')[0]+'</span>'
      + '<span style="width:48px; text-align:right; color:var(--muted);">'+metaT+'</span>'
      + '<span style="width:48px; text-align:right; font-weight:700; color:var(--navy);">'+alcT+'</span>'
      + '<span style="text-align:right; font-weight:700; color:'+(pctT>=100 ? 'var(--green)' : 'var(--red)')+'; flex:none; min-width:104px;">'+status+'</span>'
      + '</div>';
  }).join('');

  return '<div class="profile-card">'
    + '<div class="profile-card-title">📊 Dashboard — Metas x Alcançado (Anual)</div>'
    + '<div style="display:flex; font-size:10px; font-weight:800; color:var(--muted); padding-bottom:4px; border-bottom:2px solid var(--line);">'
    + '<span style="flex:1;">Indicador</span><span style="width:48px; text-align:right;">Meta</span><span style="width:48px; text-align:right;">Alcanç.</span><span style="width:44px; text-align:right;">%</span>'
    + '</div>'
    + rows
    + '</div>'
    + '<div class="profile-card">'
    + '<div class="profile-card-title">📊 Dashboard — Metas x Alcançado (por Trimestre)</div>'
    + '<div style="display:flex; font-size:10px; font-weight:800; color:var(--muted); padding-bottom:4px; border-bottom:2px solid var(--line);">'
    + '<span style="flex:1;">Trimestre</span><span style="width:48px; text-align:right;">Meta</span><span style="width:48px; text-align:right;">Alcanç.</span><span style="flex:none; min-width:104px; text-align:right;">Situação</span>'
    + '</div>'
    + trimestreRows
    + '</div>';
}
function editMissaoMetaAnual(){
  missaoCardEditState.metaAnual = true;
  renderIndicadoresView();
}
function editMissaoTrimestreMeta(i){
  missaoCardEditState.tri[i] = true;
  renderIndicadoresView();
}
function saveMissaoMetaAnual(){
  missaoMetaAnual.missionarios = Number(document.getElementById('missaoMetaMissionarios').value)||0;
  missaoMetaAnual.estudos = Number(document.getElementById('missaoMetaEstudos').value)||0;
  missaoMetaAnual.batismos = Number(document.getElementById('missaoMetaBatismos').value)||0;
  missaoMetaAnual.enviados = Number(document.getElementById('missaoMetaEnviados').value)||0;
  missaoCardEditState.metaAnual = false;
  renderIndicadoresView();
  toast('Meta anual da Missão salva.');
}
function saveMissaoTrimestreMeta(i){
  missaoMetasTrimestrais[i].missionarios = Number(document.getElementById('missaoTri'+i+'Missionarios').value)||0;
  missaoMetasTrimestrais[i].estudos = Number(document.getElementById('missaoTri'+i+'Estudos').value)||0;
  missaoMetasTrimestrais[i].batismos = Number(document.getElementById('missaoTri'+i+'Batismos').value)||0;
  missaoMetasTrimestrais[i].enviados = Number(document.getElementById('missaoTri'+i+'Enviados').value)||0;
  missaoCardEditState.tri[i] = false;
  renderIndicadoresView();
  toast((i+1)+'º trimestre da Missão: meta salva.');
}
function filterIndicSearch(){
  var term = document.getElementById('indicSearchInput').value.toLowerCase().trim();
  var resultsEl = document.getElementById('indicSearchResults');
  if(!term){ resultsEl.classList.add('hidden'); resultsEl.innerHTML = ''; return; }
  var matches = [];
  var scopeChurches = igrejasList;
  var scopeDistricts = distritosList;
  if(currentUserRole==='pastor'){
    scopeChurches = churchesInDistrict(userDistrict);
    scopeDistricts = distritosList.filter(function(d){ return d.nome===userDistrict; });
  } else if(currentUserRole==='membro' || currentUserRole==='lider'){
    scopeChurches = [];
    scopeDistricts = [];
  }
  scopeChurches.forEach(function(g){
    if(g.nome.toLowerCase().indexOf(term)!==-1) matches.push({ type:'igreja', name:g.nome, sub:g.distrito });
  });
  scopeDistricts.forEach(function(d){
    if(d.nome.toLowerCase().indexOf(term)!==-1) matches.push({ type:'distrito', name:d.nome, sub:unitsSummary(d.nome) });
  });
  if(!matches.length){
    resultsEl.innerHTML = '<div class="empty-note">Nenhum resultado encontrado.</div>';
  } else {
    resultsEl.innerHTML = matches.map(function(m){
      return '<div class="indic-search-row" onclick="selectIndicScope(\''+m.type+'\',\''+m.name.replace(/'/g,"\\'")+'\')">'
        + '<div class="ic">'+(m.type==='igreja' ? '⛪' : '🗺️')+'</div>'
        + '<div style="flex:1;"><b>'+escapeHtml(m.name)+'</b><span>'+escapeHtml(m.sub)+'</span></div>'
        + '<span class="tag">'+(m.type==='igreja' ? 'Igreja' : 'Distrito')+'</span></div>';
    }).join('');
  }
  resultsEl.classList.remove('hidden');
}
function selectIndicScope(type, name){
  if(currentUserRole==='membro' || currentUserRole==='lider') return;
  if(currentUserRole==='pastor'){
    if(type==='missao') return;
    if(type==='igreja'){ var g = getChurch(name); if(!g || g.distrito!==userDistrict) return; }
    if(type==='distrito' && name!==userDistrict) return;
  }
  indicScope = { type:type, name:name };
  var input = document.getElementById('indicSearchInput');
  if(input) input.value = '';
  document.getElementById('indicSearchResults').classList.add('hidden');
  renderIndicadoresView();
}
function applyIndicRoleRestrictions(role){
  var searchWrap = document.querySelector('.indic-search-wrap');
  var missionBtn = document.querySelector('.scope-mission-btn');
  if(role==='membro' || role==='lider'){
    indicScope = { type:'igreja', name:userChurch };
    if(searchWrap) searchWrap.classList.add('hidden');
    if(missionBtn) missionBtn.classList.add('hidden');
  } else if(role==='pastor'){
    indicScope = { type:'distrito', name:userDistrict };
    if(searchWrap) searchWrap.classList.remove('hidden');
    if(missionBtn) missionBtn.classList.add('hidden');
  } else {
    if(searchWrap) searchWrap.classList.remove('hidden');
    if(missionBtn) missionBtn.classList.remove('hidden');
  }
  if(typeof renderIndicadoresView==='function') renderIndicadoresView();
}
document.addEventListener('click', function(e){
  var wrap = document.getElementById('indicSearchResults');
  if(!wrap || wrap.classList.contains('hidden')) return;
  if(!e.target.closest || !e.target.closest('.indic-search-wrap')) wrap.classList.add('hidden');
});

function toggleLike(el){
  var match = el.textContent.match(/(\d+)/);
  var count = match ? parseInt(match[1],10) : 0;
  if(el.classList.contains('liked')){
    el.classList.remove('liked');
    count = Math.max(0, count-1);
    el.innerHTML = '🤍 '+count+' curtidas';
  } else {
    el.classList.add('liked');
    count = count+1;
    el.innerHTML = '❤ '+count+' curtidas';
  }
}
var pendingReplyTarget = null;
function toggleComments(el){
  var post = el.closest('.post');
  var list = post.querySelector('.comments-list');
  var compose = post.querySelector('.comment-compose');
  if(!list || !compose) return;
  var isCollapsed = list.classList.contains('collapsed');
  if(isCollapsed){
    list.classList.remove('collapsed');
    compose.classList.remove('hidden');
    updateCommentsVisibility(post);
    var input = compose.querySelector('input');
    if(input) input.focus();
  } else {
    list.classList.add('collapsed');
    compose.classList.add('hidden');
    cancelReply(post);
    updateCommentsVisibility(post);
  }
}
function updateCommentsVisibility(post){
  var list = post.querySelector('.comments-list');
  var link = post.querySelector('.view-all-comments');
  if(!list || !link) return;
  var count = list.querySelectorAll('.comment-item').length;
  if(list.classList.contains('collapsed') && count>3){
    link.textContent = 'Ver todos os '+count+' comentários';
    link.classList.remove('hidden');
  } else {
    link.classList.add('hidden');
  }
}
function updateCommentCount(post){
  var total = post.querySelectorAll('.comment-item').length;
  var span = post.querySelector('.comment-toggle');
  if(span) span.innerHTML = '💬 '+total+' comentário'+(total===1 ? '' : 's');
}
function buildCommentItemHtml(author, text){
  return '<div class="comment-item">'
    + '<div class="comment-body"><b class="comment-author">'+author+'</b> '+text+'</div>'
    + '<div class="comment-actions">'
    + '<span class="comment-like" onclick="toggleCommentLike(this)">🤍 <span class="clikes">0</span></span>'
    + '<span class="comment-reply-btn" onclick="startReply(this)">Responder</span>'
    + '</div>'
    + '<div class="comment-replies"></div>'
    + '</div>';
}
function toggleCommentLike(el){
  var liked = !el.classList.contains('liked');
  var countEl = el.querySelector('.clikes');
  var count = countEl ? (parseInt(countEl.textContent,10)||0) : 0;
  count = liked ? count+1 : Math.max(0,count-1);
  el.className = 'comment-like'+(liked ? ' liked' : '');
  el.innerHTML = (liked ? '❤️' : '🤍')+' <span class="clikes">'+count+'</span>';
}
function startReply(el){
  var commentItem = el.closest('.comment-item');
  var post = el.closest('.post');
  if(!commentItem || !post) return;
  pendingReplyTarget = commentItem;
  var nameEl = commentItem.querySelector('.comment-author');
  var name = nameEl ? nameEl.textContent : 'comentário';
  var banner = post.querySelector('.reply-banner');
  if(banner){
    banner.querySelector('.reply-target-name').textContent = name;
    banner.classList.remove('hidden');
  }
  var input = post.querySelector('.comment-input-row input');
  if(input){ input.placeholder = 'Respondendo a '+name+'...'; input.focus(); }
}
function cancelReply(post){
  pendingReplyTarget = null;
  var banner = post.querySelector('.reply-banner');
  if(banner) banner.classList.add('hidden');
  var input = post.querySelector('.comment-input-row input');
  if(input) input.placeholder = 'Adicionar comentário...';
}
function addComment(inputEl){
  var text = inputEl.value.trim();
  if(!text) return;
  var post = inputEl.closest('.post');
  var safeText = escapeHtml(text);
  var itemHtml = buildCommentItemHtml('Você', safeText);
  var isReply = pendingReplyTarget && post.contains(pendingReplyTarget);
  if(isReply){
    var repliesWrap = pendingReplyTarget.querySelector('.comment-replies');
    repliesWrap.insertAdjacentHTML('beforeend', itemHtml);
  } else {
    var list = post.querySelector('.comments-list');
    list.insertAdjacentHTML('beforeend', itemHtml);
  }
  inputEl.value = '';
  cancelReply(post);
  updateCommentCount(post);
  updateCommentsVisibility(post);
  myCommentCount++;
  var statCommentsEl = document.getElementById('statComments');
  if(statCommentsEl) statCommentsEl.textContent = myCommentCount;
}
var ICON_REPOST_SVG = '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
function bookmarkSvg(filled){
  return '<svg viewBox="0 0 24 24" width="21" height="21" fill="'+(filled ? 'currentColor' : 'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
}
function buildPostInteractionsHtml(likeSpanHtml, commentCount){
  var emojiRow = ['❤️','🙌','🔥','👏','😢','😍','😮','😂'].map(function(e){
    return '<span onclick="insertCommentEmoji(this,\''+e+'\')">'+e+'</span>';
  }).join('');
  return '<div class="post-actions">'
    + likeSpanHtml
    + '<span class="comment-toggle" onclick="toggleComments(this)">💬 '+commentCount+' comentário'+(commentCount===1 ? '' : 's')+'</span>'
    + '<span class="icon-action repost-btn" aria-label="Repostar" onclick="toggleRepost(this)">'+ICON_REPOST_SVG+'<b class="count">0</b></span>'
    + '<span class="icon-action save-btn" aria-label="Salvar publicação" onclick="toggleSave(this)" style="margin-left:auto;">'+bookmarkSvg(false)+'</span>'
    + '</div>'
    + '<div class="comments-list collapsed"></div>'
    + '<div class="view-all-comments hidden" onclick="toggleComments(this)"></div>'
    + '<div class="comment-compose hidden">'
    + '<div class="reply-banner hidden">Respondendo a <b class="reply-target-name"></b> <span onclick="cancelReply(this.closest(\'.post\'))">✕</span></div>'
    + '<div class="comment-emoji-row">'+emojiRow+'</div>'
    + '<div class="comment-input-row"><input type="text" placeholder="Adicionar comentário..." onkeypress="if(event.key===\'Enter\'){addComment(this); event.preventDefault();}"><button onclick="addComment(this.previousElementSibling)">Enviar</button></div>'
    + '</div>';
}
function buildPostHeadHtml(avatarHtml, name, time, tag, avatarBg){
  return '<div class="post-head"><div class="post-av"'+(avatarBg ? ' style="background:'+avatarBg+';"' : '')+'>'+avatarHtml+'</div><div style="flex:1;"><b>'+name+'</b><span>'+time+'</span></div>'
    + (tag ? '<span class="post-tag">'+tag+'</span>' : '')
    + '<div class="post-menu-wrap"><span class="post-menu-btn" onclick="togglePostMenu(this)">⋮</span>'
    + '<div class="post-menu hidden"><div class="post-menu-item" onclick="openReportModal(this)">🚩 Denunciar publicação</div><div class="post-menu-item danger" onclick="deletePost(this)">🗑️ Excluir publicação</div></div></div>'
    + '</div>';
}
function togglePostMenu(btn){
  var menu = btn.nextElementSibling;
  var wasHidden = menu.classList.contains('hidden');
  document.querySelectorAll('.post-menu').forEach(function(m){ m.classList.add('hidden'); });
  if(wasHidden) menu.classList.remove('hidden');
}
function deletePost(el){
  var post = el.closest('.post');
  if(!post) return;
  if(post.dataset.mine==='1'){
    myPostCount = Math.max(0, myPostCount-1);
    updatePostCountUI();
  }
  post.remove();
  toast('Publicação excluída.');
}
/* ---- Denúncias de publicações ---- */
var reportedPosts = [];
var nextReportId = 1;
var pendingReportPostEl = null;
function openReportModal(el){
  var post = el.closest('.post');
  if(!post) return;
  pendingReportPostEl = post;
  document.querySelectorAll('.post-menu').forEach(function(m){ m.classList.add('hidden'); });
  document.querySelectorAll('.report-reason-chip').forEach(function(c){ c.classList.remove('active'); });
  document.getElementById('reportComment').value = '';
  document.getElementById('reportPostModal').classList.add('show');
}
function closeReportModal(){
  document.getElementById('reportPostModal').classList.remove('show');
  pendingReportPostEl = null;
}
function selectReportReason(el){
  document.querySelectorAll('.report-reason-chip').forEach(function(c){ c.classList.remove('active'); });
  el.classList.add('active');
}
function submitReport(){
  var reasonEl = document.querySelector('.report-reason-chip.active');
  if(!reasonEl){ toast('Selecione um motivo para a denúncia.'); return; }
  var post = pendingReportPostEl;
  if(!post){ closeReportModal(); return; }
  var authorEl = post.querySelector('.post-head b');
  var textEl = post.querySelector('.post-text');
  var comentario = document.getElementById('reportComment').value.trim();
  reportedPosts.unshift({
    id: nextReportId++,
    autor: authorEl ? authorEl.textContent : 'Desconhecido',
    texto: textEl ? textEl.textContent : '(publicação sem legenda)',
    motivo: reasonEl.dataset.reason,
    comentario: comentario,
    reportedBy: (myProfileInfo && myProfileInfo.nome) ? myProfileInfo.nome : 'Você',
    data: new Date().toLocaleString('pt-BR'),
    status: 'pendente'
  });
  closeReportModal();
  toast('Denúncia enviada. A Administração vai revisar.');
}
document.addEventListener('click', function(e){
  if(!e.target.closest || !e.target.closest('.post-menu-wrap')){
    document.querySelectorAll('.post-menu').forEach(function(m){ m.classList.add('hidden'); });
  }
});
function toggleNewPostMenu(){
  var menu = document.getElementById('newPostMenu');
  if(!menu) return;
  menu.classList.toggle('hidden');
}
function closeNewPostMenu(){
  var menu = document.getElementById('newPostMenu');
  if(menu) menu.classList.add('hidden');
}
document.addEventListener('click', function(e){
  if(!e.target.closest || !e.target.closest('.feed-new-post-wrap')){
    closeNewPostMenu();
  }
});
function toggleRepost(el){
  var countEl = el.querySelector('.count');
  var count = countEl ? (parseInt(countEl.textContent,10)||0) : 0;
  if(el.classList.contains('reposted')){
    el.classList.remove('reposted');
    count = Math.max(0, count-1);
  } else {
    el.classList.add('reposted');
    count = count+1;
    toast('Republicado no seu perfil!');
  }
  if(countEl) countEl.textContent = count;
}
function toggleSave(el){
  el.classList.toggle('saved');
  el.innerHTML = bookmarkSvg(el.classList.contains('saved'));
  toast(el.classList.contains('saved') ? 'Publicação salva.' : 'Removida dos salvos.');
}
function insertCommentEmoji(el, emoji){
  var panel = el.closest('.comment-compose');
  var input = panel ? panel.querySelector('.comment-input-row input') : null;
  if(input){ input.value += emoji; input.focus(); }
}
function updateCarouselUI(trackEl){
  var post = trackEl.closest('.post');
  if(!post) return;
  var total = trackEl.children.length;
  var idx = Math.round(trackEl.scrollLeft / trackEl.clientWidth);
  idx = Math.max(0, Math.min(total-1, idx));
  var counterEl = post.querySelector('.carousel-counter');
  if(counterEl) counterEl.textContent = (idx+1)+'/'+total;
  var dots = post.querySelectorAll('.carousel-dots .dot');
  dots.forEach(function(d,i){ d.classList.toggle('active', i===idx); });
}
function createFeedPost(src, isVideo, legenda, tag){
  var mediaHtml = isVideo
    ? '<video src="'+src+'" controls></video>'
    : '<img src="'+src+'">';
  var avatarHtml = myProfilePic ? '<img src="'+myProfilePic+'">' : 'Eu';
  var post = document.createElement('div');
  post.className = 'post';
  post.dataset.mine = '1';
  post.innerHTML = buildPostHeadHtml(avatarHtml, 'Você', 'agora mesmo', tag)
    + '<div class="post-media">'+mediaHtml+'</div>'
    + (legenda ? '<div class="post-text">'+escapeHtml(legenda)+'</div>' : '')
    + buildPostInteractionsHtml('<span onclick="toggleLike(this)">🤍 0 curtidas</span>', 0);
  document.getElementById('feedPosts').prepend(post);
  myPostCount++;
  updatePostCountUI();
  toast('Post criado com sucesso!');
}
function createFeedPostCarousel(urls, legenda, tag){
  var avatarHtml = myProfilePic ? '<img src="'+myProfilePic+'">' : 'Eu';
  var imgsHtml = urls.map(function(u){ return '<img src="'+u+'">'; }).join('');
  var dotsHtml = urls.map(function(_,i){ return '<span class="dot'+(i===0 ? ' active' : '')+'"></span>'; }).join('');
  var post = document.createElement('div');
  post.className = 'post';
  post.dataset.mine = '1';
  post.innerHTML = buildPostHeadHtml(avatarHtml, 'Você', 'agora mesmo', tag)
    + '<div class="post-media carousel"><div class="carousel-track" onscroll="updateCarouselUI(this)">'+imgsHtml+'</div><div class="carousel-counter">1/'+urls.length+'</div></div>'
    + '<div class="carousel-dots">'+dotsHtml+'</div>'
    + (legenda ? '<div class="post-text">'+escapeHtml(legenda)+'</div>' : '')
    + buildPostInteractionsHtml('<span onclick="toggleLike(this)">🤍 0 curtidas</span>', 0);
  document.getElementById('feedPosts').prepend(post);
  myPostCount++;
  updatePostCountUI();
  toast('Post criado com sucesso!');
}
var pendingPostMedia = [];
var pendingPostTag = 'Testemunho';
function handleFeedFile(event){
  try{
    toast('① Arquivo recebido pelo app...');
    var files = event.target.files;
    if(!files || !files.length){ toast('⚠️ Nenhum arquivo veio do seletor.'); return; }
    var slotsLeft = 3 - pendingPostMedia.length;
    var fileList = Array.prototype.slice.call(files).slice(0, Math.max(0, slotsLeft));
    event.target.value = '';
    if(slotsLeft <= 0){ toast('Você já selecionou o máximo de 3 fotos.'); openNewPostScreen(); return; }
    toast('② '+fileList.length+' arquivo(s) na fila...');
    fileList.forEach(function(f){
      var type = f.type.indexOf('video')===0 ? 'video' : 'image';
      var reader = new FileReader();
      reader.onload = function(e){
        try{
          toast('③ Foto lida com sucesso, abrindo tela...');
          pendingPostMedia.push({ type:type, url:e.target.result });
          openNewPostScreen();
          toast('④ Tela de publicação deveria estar aberta agora.');
        }catch(errInner){
          toast('❌ Erro depois de ler a foto: '+errInner.message);
        }
      };
      reader.onerror = function(){
        toast('❌ Erro ao ler o arquivo (FileReader falhou).');
      };
      reader.readAsDataURL(f);
    });
  }catch(errOuter){
    toast('❌ Erro logo no início: '+errOuter.message);
  }
}
function openNewPostScreen(){
  renderNewPostThumbs();
  document.getElementById('newPostModal').classList.add('show');
}
function renderNewPostThumbs(){
  var wrap = document.getElementById('newPostThumbs');
  wrap.innerHTML = pendingPostMedia.map(function(m,i){
    var inner = m.type==='video' ? '<video src="'+m.url+'" muted></video>' : '<img src="'+m.url+'">';
    return '<div class="newpost-thumb">'+inner+'<span class="rm" onclick="removePendingMedia('+i+')">✕</span></div>';
  }).join('');
  document.getElementById('newPostPhotoCount').textContent = pendingPostMedia.length+'/3';
}
function removePendingMedia(i){
  pendingPostMedia.splice(i,1);
  renderNewPostThumbs();
}
function selectPostTag(el){
  el.parentElement.querySelectorAll('.tag-chip').forEach(function(c){ c.classList.remove('active'); });
  el.classList.add('active');
  pendingPostTag = el.textContent;
}
function updateNewPostCharCount(){
  var ta = document.getElementById('newPostText');
  document.getElementById('newPostCharCount').textContent = 500 - ta.value.length;
}
function cancelNewPost(){
  pendingPostMedia = [];
  document.getElementById('newPostText').value = '';
  updateNewPostCharCount();
  document.getElementById('newPostModal').classList.remove('show');
}
function publishNewPost(){
  if(!pendingPostMedia.length){ toast('Adicione ao menos uma foto ou vídeo.'); return; }
  var legenda = document.getElementById('newPostText').value.trim();
  var tag = pendingPostTag;
  var media = pendingPostMedia.slice();
  document.getElementById('newPostModal').classList.remove('show');
  if(media.length===1){
    createFeedPost(media[0].url, media[0].type==='video', legenda, tag);
  } else {
    createFeedPostCarousel(media.map(function(m){ return m.url; }), legenda, tag);
  }
  pendingPostMedia = [];
  document.getElementById('newPostText').value = '';
  updateNewPostCharCount();
  var tagsWrap = document.getElementById('newPostTags');
  var chips = tagsWrap.querySelectorAll('.tag-chip');
  chips.forEach(function(c,i){ c.classList.toggle('active', i===0); });
  pendingPostTag = chips[0] ? chips[0].textContent : 'Testemunho';
}
function handleProfileFile(event){
  var file = event.target.files && event.target.files[0];
  if(!file) return;
  event.target.value = '';
  openEditor(file, 'profile');
}
function handleStoryFile(event){
  var file = event.target.files && event.target.files[0];
  if(!file) return;
  event.target.value = '';
  openEditor(file, 'story');
}

