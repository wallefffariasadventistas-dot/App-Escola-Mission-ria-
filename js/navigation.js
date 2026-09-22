/* Escapa texto vindo de usuários antes de inseri-lo via innerHTML,
   prevenindo XSS (ex: nome de cadastro, legenda de post, motivo de denúncia). */
function escapeHtml(str){
  return String(str==null ? '' : str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
  document.getElementById('view-'+id).classList.remove('hidden');
  if(id==='cadastro' && typeof populateCadastroSelects==='function') populateCadastroSelects();
}
function selectChip(el){
  el.parentElement.querySelectorAll('.radio-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  if(el.parentElement.id==='cadPerfilRow'){
    var sub = document.getElementById('cadSubtext');
    if(sub){
      sub.textContent = el.textContent==='Membro'
        ? 'Membros têm acesso imediato após o cadastro.'
        : 'Pastores e Líderes passam por aprovação da Administração antes de acessar.';
    }
  }
}
var actualLoginRole = null;
function loginAs(role){
  actualLoginRole = role;
  showView('app');
  switchRole(role);
  go('dashboard');
  setTimeout(function(){
    if(typeof calculateQuarterScore==='function') calculateQuarterScore();
    if(typeof calculateIndicSummary==='function') calculateIndicSummary();
    if(typeof renderIndicadoresView==='function') renderIndicadoresView();
  }, 150);
}
function go(pane){
  document.querySelectorAll('.tabpane').forEach(p=>p.classList.add('hidden'));
  document.querySelector('.tabpane[data-pane="'+pane+'"]').classList.remove('hidden');
  document.querySelectorAll('.navitem').forEach(n=>n.classList.remove('active'));
  var navMatch = document.querySelector('.navitem[data-nav="'+pane+'"]');
  if(navMatch) navMatch.classList.add('active');
  document.querySelectorAll('.sidebar-item').forEach(n=>n.classList.remove('active'));
  var sideMatch = document.querySelector('.sidebar-item[data-nav-d="'+pane+'"]');
  if(sideMatch) sideMatch.classList.add('active');
  document.getElementById('content').scrollTop = 0;
  if(pane==='admin' && typeof backAdmin==='function') backAdmin();
  if(pane==='ranking' && typeof applyRankingRoleRestrictions==='function') applyRankingRoleRestrictions();
  if(pane==='desafios' && typeof applyDesafiosRoleRestrictions==='function') applyDesafiosRoleRestrictions();
  if(pane==='galeria' && typeof renderGallery==='function') renderGallery();
  if(pane==='feed'){
    if(typeof renderStories==='function') renderStories();
    if(typeof renderFeedSuggestions==='function') renderFeedSuggestions();
  }
  if(pane==='indicadores' && typeof renderIndicadoresView==='function') renderIndicadoresView();
  if(pane==='perfil'){
    if(typeof updatePostCountUI==='function') updatePostCountUI();
    if(typeof updateFollowersCountUI==='function') updateFollowersCountUI();
    if(typeof updateFollowingCount==='function') updateFollowingCount();
    if(typeof renderFollowSuggestions==='function') renderFollowSuggestions();
    if(typeof populateProfileForm==='function') populateProfileForm();
    if(typeof updateProfileSummary==='function') updateProfileSummary();
    var editSection = document.getElementById('profileEditSection');
    var hubSection = document.getElementById('profileHubSection');
    if(editSection && hubSection){ editSection.classList.add('hidden'); hubSection.classList.remove('hidden'); }
  }
}
function openMore(){ document.getElementById('moreSheet').classList.add('show'); }
function closeMore(){ document.getElementById('moreSheet').classList.remove('show'); }

function toggleDone(btn){
  var card = btn.closest('.chal');
  var pill = card.querySelector('.status-pill');
  var barFill = card.querySelector('.bar > div');
  var isDone = btn.classList.contains('done');
  if(!isDone){
    if(btn.dataset.captured===undefined){
      btn.dataset.origPillText = pill.textContent;
      btn.dataset.origPillClass = pill.className;
      btn.dataset.origBarWidth = barFill ? (barFill.style.width || '0%') : '';
      btn.dataset.origBtnText = btn.textContent;
      btn.dataset.captured = '1';
    }
    btn.textContent = '✓ Registrado';
    btn.classList.add('done');
    pill.textContent = 'Concluído';
    pill.className = 'status-pill status-done';
    if(barFill) barFill.style.width = '100%';
    toast('Desafio marcado como realizado.');
  } else {
    btn.classList.remove('done');
    btn.textContent = btn.dataset.origBtnText || 'Marcar realizado';
    pill.textContent = btn.dataset.origPillText || 'Pendente';
    pill.className = btn.dataset.origPillClass || 'status-pill status-pend';
    if(barFill) barFill.style.width = btn.dataset.origBarWidth || '0%';
    toast('Registro desfeito — desafio voltou a pendente.');
  }
  if(typeof calculateQuarterScore==='function') calculateQuarterScore();
}
function markDone(btn){ toggleDone(btn); }

