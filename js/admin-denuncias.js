/* ---- Denúncias (moderação) ---- */
function renderReportsAdmin(){
  var pending = reportedPosts.filter(function(r){ return r.status==='pendente'; });
  var resolved = reportedPosts.filter(function(r){ return r.status!=='pendente'; });

  function reportCard(r){
    var statusBadge = r.status==='pendente'
      ? '<span class="status-pill status-pend">Pendente</span>'
      : (r.status==='removido' ? '<span class="status-pill status-done">Conteúdo removido</span>' : '<span class="status-pill status-prog">Arquivada</span>');
    var actions = r.status==='pendente'
      ? '<div class="pending-actions">'
        + '<button class="btn-approve" onclick="resolveReport('+r.id+',\'removido\')">Remover conteúdo</button>'
        + '<button class="btn-reject" onclick="resolveReport('+r.id+',\'arquivada\')">Arquivar (sem violação)</button>'
        + '<button class="btn-reject" style="background:var(--red-light); color:var(--red);" onclick="blockReportedAuthor(\''+r.autor.replace(/'/g,"\\'")+'\')">Bloquear autor</button>'
        + '</div>'
      : '';
    return '<div class="pending-card">'
      + '<div class="top"><div class="pav">🚩</div><div><b>Denúncia de '+escapeHtml(r.reportedBy)+'</b><div class="role-tag">'+escapeHtml(r.motivo)+' · '+escapeHtml(r.data)+'</div></div></div>'
      + '<div style="font-size:12px; color:var(--ink); margin:8px 0;"><b>Autor da publicação:</b> '+escapeHtml(r.autor)+'</div>'
      + '<div style="font-size:12px; color:var(--muted); margin-bottom:8px; font-style:italic;">"'+escapeHtml(r.texto)+'"</div>'
      + (r.comentario ? '<div style="font-size:12px; color:var(--ink); margin-bottom:8px;"><b>Comentário de quem denunciou:</b> '+escapeHtml(r.comentario)+'</div>' : '')
      + statusBadge
      + actions
      + '</div>';
  }

  var pendHtml = pending.map(reportCard).join('') || '<div class="empty-note">Nenhuma denúncia pendente 🎉</div>';
  var resolvedHtml = resolved.map(reportCard).join('') || '<div class="empty-note">Nenhuma denúncia revisada ainda.</div>';

  return '<div class="detail-title">Denúncias de publicações</div>'
    + '<div class="section-sub">Revise as publicações denunciadas pela comunidade e decida a ação: remover o conteúdo, arquivar (se não houver violação) ou bloquear o autor.</div>'
    + '<div class="section-title" style="margin-top:6px;">Pendentes ('+pending.length+')</div>'
    + pendHtml
    + '<div class="section-title">Já revisadas ('+resolved.length+')</div>'
    + resolvedHtml;
}
function resolveReport(id, status){
  var r = reportedPosts.find(function(x){ return x.id===id; });
  if(!r) return;
  r.status = status;
  renderAdmin('denuncias');
  applyAdminMenuRoleRestrictions();
  toast(status==='removido' ? 'Denúncia resolvida: conteúdo marcado como removido.' : 'Denúncia arquivada — nenhuma violação encontrada.');
}
function blockReportedAuthor(autorNome){
  var u = activeUsers.find(function(x){ return x.nome===autorNome; });
  if(!u){
    toast('"'+autorNome+'" não foi encontrado(a) no cadastro de usuários (pode ser um perfil de demonstração).');
    return;
  }
  openBlockUserModal(u.id);
}

