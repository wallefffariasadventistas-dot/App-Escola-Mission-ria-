/* ---- Desafios ---- */
function renderDesafiosAdminPastor(){
  var churches = churchesInDistrict(userDistrict);
  var rows = churches.map(function(g){
    var score = computeDesafiosScoreForChurch(g);
    return '<div class="igreja-row"><div class="ic">🎯</div><div style="flex:1;"><b>'+g.nome+'</b><span>Pontuação atual: '+score.toLocaleString('pt-BR',{maximumFractionDigits:2})+'% de 25%</span></div></div>';
  }).join('') || '<div class="empty-note">Nenhuma igreja cadastrada no seu distrito ainda.</div>';
  return '<div class="detail-title">Gerenciar desafios do meu distrito</div>'
    + '<div class="section-sub">Os pesos de cada desafio são padronizados pela Administração para toda a Missão. Aqui você acompanha o progresso de cada igreja do seu distrito; para marcar um desafio como realizado, use a aba Desafios.</div>'
    + rows
    + '<button class="btn btn-solid" style="margin-top:12px;" onclick="go(\'desafios\')">Ir para Desafios</button>';
}
function renderDesafiosAdmin(){
  var rows = desafiosPesos.map(function(d,i){
    return '<div class="weight-row"><div style="flex:1"><div class="wname">'+d.nome+'</div><div class="wmeta">'+d.meta+'</div></div>'
      + '<input class="weight-input" type="number" step="0.5" value="'+d.peso+'" oninput="updateWeight('+i+',this.value)"><span style="font-size:12px; color:var(--muted); font-weight:700;">%</span></div>';
  }).join('');
  return '<div class="detail-title">Gerenciar desafios</div>'
    + '<div class="section-sub">Os pesos trimestrais devem somar exatamente 25% (o bônus de 5% é somado à parte, fora deste total).</div>'
    + rows
    + '<div class="sum-banner" id="sumBanner"></div>'
    + '<button class="btn btn-solid" onclick="saveDesafios()">Salvar catálogo de desafios</button>';
}
function computeSum(){
  return desafiosPesos.reduce(function(s,d){ return s + Number(d.peso); }, 0);
}
function refreshSumBanner(){
  var sum = computeSum();
  var el = document.getElementById('sumBanner');
  if(!el) return;
  var ok = Math.abs(sum-25) < 0.001;
  el.className = 'sum-banner ' + (ok ? 'sum-ok' : 'sum-bad');
  el.textContent = 'Soma atual: ' + sum.toFixed(2).replace('.',',') + '% ' + (ok ? '— confere com os 25% exigidos ✓' : '— precisa somar exatamente 25%');
}
function updateWeight(i,val){
  desafiosPesos[i].peso = Number(val) || 0;
  refreshSumBanner();
}
function saveDesafios(){
  var sum = computeSum();
  if(Math.abs(sum-25) > 0.001){
    toast('Não é possível salvar: a soma precisa ser 25% (atual: '+sum.toFixed(2).replace('.',',')+'%).');
    return;
  }
  toast('Catálogo de desafios salvo com sucesso.');
}

function populateCadastroSelects(){
  var distSel = document.getElementById('cadDistrito');
  if(!distSel) return;
  distSel.innerHTML = distritosList.map(function(d){ return '<option>'+escapeHtml(d.nome)+'</option>'; }).join('');
  updateCadIgrejaOptions();
}
function updateCadIgrejaOptions(){
  var distSel = document.getElementById('cadDistrito');
  var igrejaSel = document.getElementById('cadIgreja');
  if(!distSel || !igrejaSel) return;
  var churches = churchesInDistrict(distSel.value);
  igrejaSel.innerHTML = churches.map(function(g){ return '<option value="'+escapeHtml(g.nome)+'">'+escapeHtml(g.nome)+(g.tipo==='Grupo' ? ' (Grupo)' : '')+'</option>'; }).join('');
}

// init
(function seedDemoQ1(){
  var demo = getChurch('Aeroporto - Teresina');
  if(demo && demo.desafiosTrimestres){
    demo.desafiosTrimestres[0] = { sabado13:100, treinamento:100, professores:100, planoMissionario:84, sabadoTarde:100, bonus:0 };
  }
})();
populateCadastroSelects();
switchRole('lider');
(function bindFeedFileInputBackup(){
  var input = document.getElementById('feedFileInput');
  if(!input) return;
  input.addEventListener('change', function(e){
    toast('⑤ Evento "change" do seletor disparou.');
    handleFeedFile(e);
  });
})();
(function initSplashScreen(){
  var splash = document.getElementById('splashScreen');
  var splashLogo = document.getElementById('splashLogoImg');
  var welcomeLogo = document.getElementById('welcomeLogoImg');
  var welcomeBottom = document.querySelector('.welcome-bottom');
  if(!splash || !splashLogo || !welcomeLogo || !welcomeBottom) return;
  splashLogo.src = welcomeLogo.src;
  welcomeLogo.style.visibility = 'hidden'; // mantém o espaço reservado no layout, mas invisível até a troca

  setTimeout(function(){
    var targetRect = welcomeLogo.getBoundingClientRect();
    var startRect = splashLogo.getBoundingClientRect();
    var scale = targetRect.width / startRect.width;
    var deltaX = (targetRect.left + targetRect.width/2) - (startRect.left + startRect.width/2);
    var deltaY = (targetRect.top + targetRect.height/2) - (startRect.top + startRect.height/2);
    if(!isFinite(scale) || scale<=0) scale = 0.55;
    if(!isFinite(deltaX)) deltaX = 0;
    if(!isFinite(deltaY)) deltaY = -Math.round(window.innerHeight*0.32);

    // Congela a logo da splash na posição atual (coordenadas fixas), pra poder deslizá-la livremente
    var rect0 = splashLogo.getBoundingClientRect();
    splashLogo.style.position = 'fixed';
    splashLogo.style.left = rect0.left+'px';
    splashLogo.style.top = rect0.top+'px';
    splashLogo.style.width = rect0.width+'px';
    splashLogo.style.height = rect0.height+'px';
    splashLogo.style.margin = '0';
    splashLogo.style.zIndex = '1000';
    splashLogo.style.animation = 'none';
    void splashLogo.offsetWidth; // força recalcular antes de aplicar a transição
    splashLogo.style.transition = 'transform .85s cubic-bezier(.4,0,.2,1)';
    splashLogo.style.transform = 'translate('+deltaX+'px,'+deltaY+'px) scale('+scale+')';

    setTimeout(function(){
      welcomeBottom.classList.add('show');
    }, 150);
    setTimeout(function(){
      splash.classList.add('splash-hide');
    }, 900);

    // Ao terminar o deslize, a MESMA imagem vira a logo definitiva — sem trocar de elemento
    function handoff(){
      splashLogo.removeEventListener('transitionend', handoff);
      splashLogo.style.position = '';
      splashLogo.style.left = '';
      splashLogo.style.top = '';
      splashLogo.style.width = '';
      splashLogo.style.height = '';
      splashLogo.style.margin = '';
      splashLogo.style.zIndex = '';
      splashLogo.style.transition = '';
      splashLogo.style.transform = '';
      splashLogo.style.animation = '';
      splashLogo.className = 'welcome-logo-img';
      welcomeBottom.insertBefore(splashLogo, welcomeBottom.firstChild);
      welcomeLogo.remove();
      splash.style.display = 'none';
    }
    splashLogo.addEventListener('transitionend', handoff);
    setTimeout(handoff, 1300); // segurança, caso o evento não dispare
  }, 3000);
})();
