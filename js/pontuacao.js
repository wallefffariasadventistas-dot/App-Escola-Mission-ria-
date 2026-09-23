/* ================= PONTUAÇÃO DO TRIMESTRE (calculada a partir dos desafios) ================= */
var currentQuarter = 2;
var quarterlyScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
var quarterlyBonus = { 1: false, 2: false, 3: false, 4: false };
var selectedQuarterView = 'anual';
function calculateQuarterScore(){
  var scoreChurches;
  if(currentUserRole==='pastor'){
    scoreChurches = churchesInDistrict(userDistrict);
  } else if(currentUserRole==='adm'){
    scoreChurches = igrejasList.slice();
  } else {
    var own = getChurch(userChurch);
    scoreChurches = own ? [own] : [];
  }
  [1,2,3,4].forEach(function(q){
    var totalSum = 0, count = 0, bonusEarned = false;
    scoreChurches.forEach(function(g){
      if(!g.desafiosTrimestres) return;
      var progress = g.desafiosTrimestres[q-1] || {};
      var churchTotal = 0;
      desafiosDefs.forEach(function(d){
        var pct = progress[d.key] || 0;
        if(d.bonus){ if(pct>=100) bonusEarned = true; }
        else { churchTotal += d.peso * (pct/100); }
      });
      totalSum += churchTotal;
      count++;
    });
    var total = count>0 ? totalSum/count : 0;
    quarterlyScores[q] = Math.round(total*100)/100;
    quarterlyBonus[q] = bonusEarned;
  });

  updateQuarterScoreDisplay(selectedQuarterView);
}
function selectQuarterTab(q){
  selectedQuarterView = q;
  updateQuarterScoreDisplay(q);
}
function updateQuarterScoreDisplay(q){
  var labels = {1:'1º Trimestre',2:'2º Trimestre',3:'3º Trimestre',4:'4º Trimestre'};
  var total, bonusEarned;
  if(q==='anual'){
    total = (quarterlyScores[1]||0)+(quarterlyScores[2]||0)+(quarterlyScores[3]||0)+(quarterlyScores[4]||0);
    total = Math.round(total*100)/100;
    bonusEarned = quarterlyBonus[1]||quarterlyBonus[2]||quarterlyBonus[3]||quarterlyBonus[4];
  } else {
    total = quarterlyScores[q] || 0;
    bonusEarned = quarterlyBonus[q] || false;
  }

  var scoreEl = document.getElementById('quarterScoreNum');
  if(scoreEl) scoreEl.textContent = total.toLocaleString('pt-BR',{maximumFractionDigits:2})+'%';
  var thermo = document.getElementById('thermoFill');
  var maxRef = q==='anual' ? 100 : 25;
  if(thermo) thermo.style.height = Math.max(0, Math.min(100, (total/maxRef*100)))+'%';
  var legend = document.getElementById('quarterScoreLegend');
  var scopeWord = currentUserRole==='pastor' ? 'do distrito' : (currentUserRole==='adm' ? 'da Missão (média)' : 'da igreja');
  if(legend){
    if(q==='anual'){
      legend.innerHTML = '<b>Termômetro de progresso</b>'
        + total.toLocaleString('pt-BR',{maximumFractionDigits:2})+'% de 100% '+scopeWord+' · Ano completo (acumulado)'
        + (bonusEarned ? ' (bônus conquistado em algum trimestre!)' : '');
    } else {
      legend.innerHTML = '<b>Termômetro de progresso</b>'
        + total.toLocaleString('pt-BR',{maximumFractionDigits:2})+'% de 25% '+scopeWord+' · '+labels[q]
        + (bonusEarned ? ' (+5% bônus conquistado!)' : (q===currentQuarter ? ' (+5% bônus disponível)' : ''));
    }
  }
  renderQuarterTabs();
}
function renderQuarterTabs(){
  var wrap = document.getElementById('quarterScoresRow');
  if(!wrap) return;
  var anualTotal = (quarterlyScores[1]||0)+(quarterlyScores[2]||0)+(quarterlyScores[3]||0)+(quarterlyScores[4]||0);
  var periods = [
    ['anual', 'Ano completo', anualTotal],
    [1, '1º Trimestre', quarterlyScores[1]||0],
    [2, '2º Trimestre', quarterlyScores[2]||0],
    [3, '3º Trimestre', quarterlyScores[3]||0],
    [4, '4º Trimestre', quarterlyScores[4]||0]
  ];
  wrap.innerHTML = periods.map(function(p){
    var cls = p[0]===selectedQuarterView ? 'period-chip active' : 'period-chip';
    var onclickArg = typeof p[0]==='number' ? p[0] : "'"+p[0]+"'";
    return '<div class="'+cls+'" onclick="selectQuarterTab('+onclickArg+')"><b>'+p[2].toLocaleString('pt-BR',{maximumFractionDigits:1})+'%</b><span>'+p[1]+'</span></div>';
  }).join('');
}
var indicSummaryPeriod = 'anual';
function computeIndicSummaryForPeriod(period){
  var valores, metas;
  var churches, allChurches;
  if(currentUserRole==='pastor'){
    churches = churchesInDistrict(userDistrict);
    if(period==='anual'){
      valores = aggregateAchieved(churches);
      var d = getDistrict(userDistrict);
      metas = d ? d.metas : { missionarios:0, estudos:0, batismos:0, enviados:0 };
    } else {
      valores = aggregateAchievedTrimester(churches, period);
      metas = { missionarios:0, estudos:0, batismos:0, enviados:0 };
      churches.forEach(function(g){
        var t = g.trimestres && g.trimestres[period-1];
        if(t){ metas.missionarios+=t.meta.missionarios; metas.estudos+=t.meta.estudos; metas.batismos+=t.meta.batismos; metas.enviados+=t.meta.enviados; }
      });
    }
  } else if(currentUserRole==='adm'){
    allChurches = igrejasList;
    if(period==='anual'){
      valores = aggregateAchieved(allChurches);
      metas = aggregateMetas(distritosList);
    } else {
      valores = aggregateAchievedTrimester(allChurches, period);
      metas = { missionarios:0, estudos:0, batismos:0, enviados:0 };
      allChurches.forEach(function(g){
        var t = g.trimestres && g.trimestres[period-1];
        if(t){ metas.missionarios+=t.meta.missionarios; metas.estudos+=t.meta.estudos; metas.batismos+=t.meta.batismos; metas.enviados+=t.meta.enviados; }
      });
    }
  } else {
    var g = getChurch(userChurch);
    if(period==='anual'){
      valores = g ? computeAchievedForChurch(g) : { missionarios:0, estudos:0, batismos:0, enviados:0 };
      metas = g ? g.metas : { missionarios:0, estudos:0, batismos:0, enviados:0 };
    } else {
      var t = g && g.trimestres && g.trimestres[period-1];
      valores = t ? t.valores : { missionarios:0, estudos:0, batismos:0, enviados:0 };
      metas = t ? t.meta : { missionarios:0, estudos:0, batismos:0, enviados:0 };
    }
  }
  var totalAtual = valores.missionarios + valores.estudos + valores.batismos + valores.enviados;
  var totalMeta = metas.missionarios + metas.estudos + metas.batismos + metas.enviados;
  var pct = totalMeta>0 ? Math.round((totalAtual/totalMeta)*100) : 0;
  return Math.max(0, Math.min(100, pct));
}
function selectIndicSummaryPeriod(p){
  indicSummaryPeriod = p;
  calculateIndicSummary();
}
function renderIndicSummaryPeriodTabs(){
  var wrap = document.getElementById('indicSummaryPeriodRow');
  if(!wrap) return;
  var labels = [['anual','Ano completo'],[1,'1º Trimestre'],[2,'2º Trimestre'],[3,'3º Trimestre'],[4,'4º Trimestre']];
  wrap.innerHTML = labels.map(function(p){
    var pct = computeIndicSummaryForPeriod(p[0]);
    var cls = p[0]===indicSummaryPeriod ? 'period-chip active' : 'period-chip';
    var onclickArg = typeof p[0]==='number' ? p[0] : "'"+p[0]+"'";
    return '<div class="'+cls+'" onclick="selectIndicSummaryPeriod('+onclickArg+')"><b>'+pct+'%</b><span>'+p[1]+'</span></div>';
  }).join('');
}
function calculateIndicSummary(){
  var pct = computeIndicSummaryForPeriod(indicSummaryPeriod);

  var numEl = document.getElementById('indicSummaryNum');
  if(numEl) numEl.textContent = pct+'%';
  var fillEl = document.getElementById('indicSummaryThermoFill');
  if(fillEl) fillEl.style.height = pct+'%';
  var legendEl = document.getElementById('indicSummaryLegend');
  var scopeWord = currentUserRole==='pastor' ? 'do distrito' : (currentUserRole==='adm' ? 'da Missão Piauiense' : 'da igreja');
  var periodLabels = {anual:'da meta anual', 1:'da meta do 1º trimestre', 2:'da meta do 2º trimestre', 3:'da meta do 3º trimestre', 4:'da meta do 4º trimestre'};
  if(legendEl) legendEl.innerHTML = '<b>Termômetro de indicadores</b>'+pct+'% '+periodLabels[indicSummaryPeriod]+' '+scopeWord;
  renderIndicSummaryPeriodTabs();
}

