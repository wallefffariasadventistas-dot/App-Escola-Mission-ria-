/* ================= RANKING ================= */
var rankMode = 'desafios';
function computeDesafiosScoreForChurch(g, q){
  q = q || currentQuarter;
  if(!g.desafiosTrimestres) return 0;
  var progress = g.desafiosTrimestres[q-1] || {};
  var total = 0;
  desafiosDefs.forEach(function(d){
    if(d.bonus) return;
    total += d.peso * ((progress[d.key]||0)/100);
  });
  return Math.round(total*100)/100;
}
function computeDesafiosScoreForDistrict(distrito, q){
  var churches = churchesInDistrict(distrito);
  if(!churches.length) return 0;
  var sum = 0;
  churches.forEach(function(g){ sum += computeDesafiosScoreForChurch(g, q); });
  return Math.round((sum/churches.length)*100)/100;
}
function computeIndicPercentForChurch(g){
  var achieved = computeAchievedForChurch(g);
  var totalAtual = achieved.missionarios+achieved.estudos+achieved.batismos+achieved.enviados;
  var totalMeta = g.metas.missionarios+g.metas.estudos+g.metas.batismos+g.metas.enviados;
  return totalMeta>0 ? Math.round((totalAtual/totalMeta)*100) : 0;
}
function computeIndicPercentForChurchQuarter(g, q){
  var t = g.trimestres && g.trimestres[q-1];
  if(!t) return 0;
  var totalMeta = somaIndicadores(t.meta);
  var totalAchieved = somaIndicadores(t.valores);
  return totalMeta>0 ? Math.round((totalAchieved/totalMeta)*100) : 0;
}
function computeIndicPercentForDistrict(distrito){
  var d = getDistrict(distrito);
  var achieved = aggregateAchieved(churchesInDistrict(distrito));
  var totalAtual = achieved.missionarios+achieved.estudos+achieved.batismos+achieved.enviados;
  var totalMeta = d ? (d.metas.missionarios+d.metas.estudos+d.metas.batismos+d.metas.enviados) : 0;
  return totalMeta>0 ? Math.round((totalAtual/totalMeta)*100) : 0;
}
function computeIndicPercentForDistrictQuarter(distrito, q){
  var churches = churchesInDistrict(distrito);
  var totalMeta = 0, totalAchieved = 0;
  churches.forEach(function(g){
    var t = g.trimestres && g.trimestres[q-1];
    if(!t) return;
    totalMeta += somaIndicadores(t.meta);
    totalAchieved += somaIndicadores(t.valores);
  });
  return totalMeta>0 ? Math.round((totalAchieved/totalMeta)*100) : 0;
}
var rankPeriod = 'anual';
function computeScoreForChurch(mode, g){
  if(mode==='indicadores'){
    return rankPeriod==='anual' ? computeIndicPercentForChurch(g) : computeIndicPercentForChurchQuarter(g, rankPeriod);
  }
  if(rankPeriod==='anual'){
    var sum = 0;
    for(var q=1;q<=4;q++) sum += computeDesafiosScoreForChurch(g, q);
    return Math.round(sum*100)/100;
  }
  return computeDesafiosScoreForChurch(g, rankPeriod);
}
function computeScoreForDistrict(mode, distrito){
  if(mode==='indicadores'){
    return rankPeriod==='anual' ? computeIndicPercentForDistrict(distrito) : computeIndicPercentForDistrictQuarter(distrito, rankPeriod);
  }
  if(rankPeriod==='anual'){
    var sum = 0;
    for(var q=1;q<=4;q++) sum += computeDesafiosScoreForDistrict(distrito, q);
    return Math.round(sum*100)/100;
  }
  return computeDesafiosScoreForDistrict(distrito, rankPeriod);
}
function renderRankPeriodCards(){
  var wrap = document.getElementById('rankPeriodRow');
  if(!wrap) return;
  var periods = [
    ['anual','Ano completo','Acumulado'],
    [1,'1º Trimestre','Jan-Mar'],
    [2,'2º Trimestre','Abr-Jun'],
    [3,'3º Trimestre','Jul-Set'],
    [4,'4º Trimestre','Out-Dez']
  ];
  wrap.innerHTML = periods.map(function(p){
    var cls = p[0]===rankPeriod ? 'period-chip active' : 'period-chip';
    return '<div class="'+cls+'" onclick="selectRankPeriod('+(typeof p[0]==='number' ? p[0] : "'"+p[0]+"'")+')"><b>'+p[1]+'</b><span>'+p[2]+'</span></div>';
  }).join('');
}
function selectRankPeriod(p){
  rankPeriod = p;
  renderRankPeriodCards();
  refreshRankingRows();
}
function refreshRankingRows(){
  var activeTab = document.querySelector('#rankingTabs .tab.active');
  var key = 'igrejas';
  if(activeTab){
    var m = activeTab.getAttribute('onclick').match(/'([a-z]+)'/);
    if(m) key = m[1];
  }
  var rowsEl = document.getElementById('rankingRows');
  if(rowsEl) rowsEl.innerHTML = renderRankRows(getScopedRankingList(rankMode, key), key);
}
function buildRankingList(mode, key){
  if(key==='estrutura'){
    return distritosList.map(function(d){
      var units = churchesInDistrict(d.nome);
      var igrejas = units.filter(function(g){ return g.tipo!=='Grupo'; }).length;
      var grupos = units.filter(function(g){ return g.tipo==='Grupo'; }).length;
      return {
        nome: d.nome,
        sub: (d.pastor && d.pastor.nome) ? 'Pastor: '+d.pastor.nome : 'Sem pastor definido',
        distrito: d.nome,
        pts: igrejas,
        igrejas: igrejas,
        grupos: grupos
      };
    }).sort(function(a,b){ return b.pts-a.pts; });
  }
  if(mode==='indicadores'){
    if(key==='igrejas'){
      return igrejasList.map(function(g){
        return { nome:g.nome, sub:g.distrito+(g.tipo==='Grupo' ? ' · Grupo' : ''), distrito:g.distrito, pts:computeScoreForChurch('indicadores', g) };
      }).sort(function(a,b){ return b.pts-a.pts; });
    }
    if(key==='distritos'){
      return distritosList.map(function(d){
        return { nome:d.nome, sub:unitsSummary(d.nome), distrito:d.nome, pts:computeScoreForDistrict('indicadores', d.nome) };
      }).sort(function(a,b){ return b.pts-a.pts; });
    }
    return [];
  }
  if(key==='igrejas'){
    return igrejasList.map(function(g){
      return { nome:g.nome, sub:g.distrito+(g.tipo==='Grupo' ? ' · Grupo' : ''), distrito:g.distrito, pts:computeScoreForChurch('desafios', g) };
    }).sort(function(a,b){ return b.pts-a.pts; });
  }
  if(key==='distritos'){
    return distritosList.map(function(d){
      return { nome:d.nome, sub:unitsSummary(d.nome), distrito:d.nome, pts:computeScoreForDistrict('desafios', d.nome) };
    }).sort(function(a,b){ return b.pts-a.pts; });
  }
  if(key==='lideres') return [];
  if(key==='pastores'){
    return distritosList.map(function(d){
      return { nome:(d.pastor && d.pastor.nome) ? d.pastor.nome : '(sem pastor)', sub:d.nome, distrito:d.nome, pts:computeScoreForDistrict('desafios', d.nome) };
    }).sort(function(a,b){ return b.pts-a.pts; });
  }
  return [];
}
function getScopedRankingList(mode, key){
  var list = buildRankingList(mode, key);
  if(currentUserRole==='adm') return list;
  return list.filter(function(r){ return r.distrito===userDistrict; });
}
function setRankMode(mode){
  rankMode = mode;
  var btnD = document.getElementById('rankModeDesafios');
  var btnI = document.getElementById('rankModeIndicadores');
  if(btnD) btnD.classList.toggle('active', mode==='desafios');
  if(btnI) btnI.classList.toggle('active', mode==='indicadores');
  applyRankingRoleRestrictions();
}
function renderRankingTabs(){
  var tabsWrap = document.getElementById('rankingTabs');
  if(!tabsWrap) return;
  var isAdmin = currentUserRole==='adm';
  var tabs;
  if(rankMode==='indicadores'){
    tabs = isAdmin ? [['igrejas','Igrejas'],['distritos','Distritos'],['estrutura','Nº de Igrejas']] : [['igrejas','Igrejas']];
  } else {
    tabs = isAdmin
      ? [['igrejas','Igrejas'],['distritos','Distritos'],['lideres','Líderes'],['pastores','Pastores'],['estrutura','Nº de Igrejas']]
      : [['igrejas','Igrejas'],['lideres','Líderes']];
  }
  tabsWrap.innerHTML = tabs.map(function(t,i){
    return '<div class="tab'+(i===0 ? ' active' : '')+'" onclick="selectRankTab(this,\''+t[0]+'\')">'+t[1]+'</div>';
  }).join('');
}
function applyRankingRoleRestrictions(){
  renderRankingTabs();
  renderRankPeriodCards();
  var filterRow = document.getElementById('rankingFilters');
  var scopeNote = document.getElementById('rankingScopeNote');
  var isAdmin = currentUserRole==='adm';
  if(filterRow) filterRow.classList.toggle('hidden', !isAdmin);
  if(scopeNote){
    scopeNote.classList.toggle('hidden', isAdmin);
    if(!isAdmin){
      scopeNote.textContent = currentUserRole==='pastor'
        ? 'Mostrando: '+userDistrict
        : 'Mostrando: '+userDistrict+' · '+userChurch;
    }
  }
  var rowsEl = document.getElementById('rankingRows');
  if(rowsEl) rowsEl.innerHTML = renderRankRows(getScopedRankingList(rankMode, 'igrejas'), 'igrejas');
}
function formatPts(pts){
  if(typeof pts === 'number') return pts.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
  return pts;
}
function isDistrictLevelKey(key){
  return key==='distritos' || key==='pastores' || key==='estrutura';
}
function renderRankRows(list, key){
  if(!list.length) return '<div class="empty-note">Nenhum dado disponível ainda.</div>';
  var medalClasses = ['gold','silver','bronze'];
  var clickable = isDistrictLevelKey(key);
  var isEstrutura = key==='estrutura';
  return list.map(function(r,i){
    var cls = medalClasses[i] ? ' '+medalClasses[i] : '';
    var ptsText = isEstrutura ? (r.pts+' igreja'+(r.pts===1 ? '' : 's')) : formatPts(r.pts);
    var rowAttrs = clickable
      ? ' onclick="openDistrictDetail(\''+r.distrito.replace(/'/g,"\\'")+'\')" style="cursor:pointer;"'
      : '';
    return '<div class="rank-row'+cls+'"'+rowAttrs+'><div class="rank-pos">'+(i+1)+'º</div><div class="rank-name">'+escapeHtml(r.nome)+'<span>'+escapeHtml(r.sub)+'</span></div><div class="rank-pts">'+ptsText+'</div></div>';
  }).join('');
}
function openDistrictDetail(nome){
  var d = getDistrict(nome);
  if(!d) return;
  var units = churchesInDistrict(nome);
  var igrejas = units.filter(function(g){ return g.tipo!=='Grupo'; }).length;
  var grupos = units.filter(function(g){ return g.tipo==='Grupo'; }).length;
  document.getElementById('districtDetailName').textContent = nome;
  document.getElementById('districtDetailIgrejas').textContent = igrejas;
  document.getElementById('districtDetailGrupos').textContent = grupos;
  var pastorEl = document.getElementById('districtDetailPastor');
  if(d.pastor && d.pastor.nome){
    pastorEl.innerHTML = '<b>'+escapeHtml(d.pastor.nome)+'</b>'
      + (d.pastor.email ? '<br>📧 '+escapeHtml(d.pastor.email) : '')
      + (d.pastor.telefone ? '<br>📞 '+escapeHtml(d.pastor.telefone) : '');
  } else {
    pastorEl.textContent = 'Nenhum pastor designado ainda.';
  }
  document.getElementById('districtDetailModal').classList.add('show');
}
function closeDistrictDetail(){
  document.getElementById('districtDetailModal').classList.remove('show');
}
function selectRankTab(el,key){
  el.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('rankingRows').innerHTML = renderRankRows(getScopedRankingList(rankMode, key), key);
}

