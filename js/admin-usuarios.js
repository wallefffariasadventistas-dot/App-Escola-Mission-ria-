/* ---- Usuários (aprovação hierárquica) ---- */
function getScopedPendingRequests(){
  if(currentUserRole==='pastor'){
    return pendingRequests.filter(function(r){ return r.perfil==='Líder' && r.destino.indexOf(userDistrict)!==-1; });
  }
  return pendingRequests;
}
function getScopedActiveUsers(){
  if(currentUserRole==='pastor'){
    return activeUsers.filter(function(u){ return u.perfil==='Líder' && u.destino.indexOf(userDistrict)!==-1; });
  }
  return activeUsers;
}
function renderUsuarios(){
  var isPastor = currentUserRole==='pastor';
  var scopedPending = getScopedPendingRequests();
  var scopedActive = getScopedActiveUsers();
  var pend = scopedPending.map(function(r){
    return '<div class="pending-card">'
      + '<div class="top"><div class="pav">'+initials(r.nome)+'</div><div><b>'+r.nome+'</b><div class="role-tag">Solicita acesso como '+r.perfil+' &middot; '+r.destino+'</div></div></div>'
      + '<div class="pending-actions">'
      + '<button class="btn-approve" onclick="approveUser('+r.id+')">Aprovar</button>'
      + '<button class="btn-reject" onclick="rejectUser('+r.id+')">Recusar</button>'
      + '</div></div>';
  }).join('') || '<div class="empty-note">Nenhuma solicitação pendente 🎉</div>';

  var blockedCount = scopedActive.filter(function(u){ return u.status==='bloqueado'; }).length;

  var active = scopedActive.map(function(u){
    if(editingUserId===u.id) return renderUserEditForm(u);
    var isBlocked = u.status==='bloqueado';
    var rowStyle = isBlocked ? ' style="opacity:.7; background:var(--red-light);"' : '';
    var badge = isBlocked ? '<span class="status-pill status-pend" style="background:var(--red-light); color:var(--red); margin-left:6px;">🚫 Bloqueado</span>' : '';
    var contactLine = [u.email, u.telefone].filter(Boolean).join(' · ');
    return '<div class="active-user-row"'+rowStyle+'>'
      + '<div class="pav">'+initials(u.nome)+'</div>'
      + '<div style="flex:1;"><b>'+u.nome+'</b>'+badge+'<span>'+u.perfil+' &middot; '+u.destino+'</span>'+(contactLine ? '<span style="display:block; font-size:10.5px; color:var(--muted); margin-top:2px;">'+contactLine+'</span>' : '')+(isBlocked && u.blockReason ? '<span style="display:block; font-size:10.5px; color:var(--red); margin-top:2px;">Motivo: '+u.blockReason+'</span>' : '')+'</div>'
      + '<div class="row-actions">'
      + '<button class="btn-approve" onclick="editUser('+u.id+')">Editar</button>'
      + (isBlocked
          ? '<button class="btn-approve" style="background:var(--green-light); color:var(--green);" onclick="unblockUser('+u.id+')">Desbloquear</button>'
          : '<button class="btn-reject" style="background:var(--red-light); color:var(--red);" onclick="openBlockUserModal('+u.id+')">Bloquear</button>')
      + '<button class="btn-reject" onclick="revokeUser('+u.id+')">Remover</button>'
      + '</div></div>';
  }).join('');

  return '<div class="detail-title">'+(isPastor ? 'Gerenciar usuários do meu distrito' : 'Gerenciar usuários')+'</div>'
    + '<div class="section-sub">'+(isPastor
        ? 'Aprove, edite ou bloqueie os Líderes solicitando acesso no seu distrito ('+userDistrict+').'
        : 'A Administração cadastra e aprova os Pastores; cada Pastor aprovado passa a poder cadastrar e aprovar os Líderes do seu distrito. Usuários que violarem as regras podem ser bloqueados aqui.')+'</div>'
    + '<div class="section-title" style="margin-top:6px;">Pendentes de aprovação ('+scopedPending.length+')</div>'
    + pend
    + '<div class="section-title">Usuários ativos ('+scopedActive.length+')'+(blockedCount ? ' · '+blockedCount+' bloqueado(s)' : '')+'</div>'
    + active;
}
function renderUserEditForm(u){
  return '<div class="mini-form">'
    + '<div class="field"><label>Nome completo</label><input id="editNome_'+u.id+'" value="'+u.nome+'"></div>'
    + '<div class="two-col"><div class="field"><label>Telefone</label><input id="editTelefone_'+u.id+'" value="'+(u.telefone||'')+'"></div><div class="field"><label>E-mail</label><input id="editEmail_'+u.id+'" value="'+(u.email||'')+'"></div></div>'
    + '<div class="two-col"><div class="field"><label>Perfil</label><select id="editPerfil_'+u.id+'"><option'+(u.perfil==='Líder'?' selected':'')+'>Líder</option><option'+(u.perfil==='Pastor'?' selected':'')+'>Pastor</option></select></div>'
    + '<div class="field"><label>Igreja / Distrito</label><input id="editDestino_'+u.id+'" value="'+u.destino+'"></div></div>'
    + '<div class="field"><label>Senha</label><div style="display:flex; gap:8px;"><input id="editSenha_'+u.id+'" type="password" value="'+(u.senha||'')+'" style="flex:1;"><button type="button" class="mini-btn" onclick="toggleSenhaVisibility('+u.id+')">👁</button></div></div>'
    + '<div class="pending-actions"><button class="btn-approve" onclick="saveUserEdit('+u.id+')">Salvar</button><button class="btn-reject" onclick="cancelEditUser()">Cancelar</button></div>'
    + '</div>';
}
function editUser(id){ editingUserId = id; renderAdmin('usuarios'); }
function cancelEditUser(){ editingUserId = null; renderAdmin('usuarios'); }
function toggleSenhaVisibility(id){
  var input = document.getElementById('editSenha_'+id);
  if(input) input.type = (input.type==='password') ? 'text' : 'password';
}
function saveUserEdit(id){
  var u = activeUsers.find(function(x){ return x.id===id; });
  if(!u) return;
  var nome = document.getElementById('editNome_'+id).value.trim();
  var destino = document.getElementById('editDestino_'+id).value.trim();
  u.nome = nome || u.nome;
  u.telefone = document.getElementById('editTelefone_'+id).value.trim();
  u.email = document.getElementById('editEmail_'+id).value.trim();
  u.perfil = document.getElementById('editPerfil_'+id).value;
  u.destino = destino || u.destino;
  u.senha = document.getElementById('editSenha_'+id).value;
  editingUserId = null;
  renderAdmin('usuarios');
  toast('Dados de '+u.nome+' atualizados.');
}
var blockingUserId = null;
function openBlockUserModal(id){
  blockingUserId = id;
  var u = activeUsers.find(function(x){ return x.id===id; });
  if(!u) return;
  document.getElementById('blockUserName').textContent = u.nome;
  document.getElementById('blockUserReason').value = '';
  document.getElementById('blockUserModal').classList.add('show');
}
function closeBlockUserModal(){
  document.getElementById('blockUserModal').classList.remove('show');
  blockingUserId = null;
}
function confirmBlockUser(){
  var u = activeUsers.find(function(x){ return x.id===blockingUserId; });
  if(!u) return;
  var motivo = document.getElementById('blockUserReason').value.trim();
  u.status = 'bloqueado';
  u.blockReason = motivo || 'Não especificado';
  u.blockedAt = new Date().toLocaleString('pt-BR');
  closeBlockUserModal();
  var body = document.getElementById('adminDetailBody');
  var currentSection = (body && body.dataset.section) || 'usuarios';
  renderAdmin(currentSection);
  toast(u.nome+' foi bloqueado(a).');
}
function unblockUser(id){
  var u = activeUsers.find(function(x){ return x.id===id; });
  if(!u) return;
  u.status = 'ativo';
  u.blockReason = '';
  renderAdmin('usuarios');
  toast(u.nome+' foi desbloqueado(a).');
}
function revokeUser(id){
  var idx = activeUsers.findIndex(function(u){ return u.id===id; });
  if(idx===-1) return;
  var u = activeUsers[idx];
  if(!confirm('Remover o acesso de '+u.nome+' definitivamente? O usuário sairá da lista de ativos.')) return;
  activeUsers.splice(idx,1);
  renderAdmin('usuarios');
  toast('Acesso de '+u.nome+' removido.');
}
function approveUser(id){
  var idx = pendingRequests.findIndex(function(r){ return r.id===id; });
  if(idx===-1) return;
  var r = pendingRequests.splice(idx,1)[0];
  activeUsers.unshift({ id:nextUserId++, nome:r.nome, perfil:r.perfil, destino:r.destino, email:r.email||'', telefone:r.telefone||'', senha:r.senha||'', status:'ativo' });
  renderAdmin('usuarios');
  toast(r.nome+' aprovado(a) como '+r.perfil+'!');
}
function rejectUser(id){
  var idx = pendingRequests.findIndex(function(r){ return r.id===id; });
  if(idx===-1) return;
  var r = pendingRequests.splice(idx,1)[0];
  renderAdmin('usuarios');
  toast('Solicitação de '+r.nome+' recusada.');
}

