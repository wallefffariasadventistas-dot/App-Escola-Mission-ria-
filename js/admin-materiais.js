/* ---- Materiais ---- */
function renderMateriaisAdmin(){
  return '<div class="detail-title">Publicar materiais</div>'
    + '<div class="section-sub">O material publicado aparece imediatamente na Biblioteca de Materiais.</div>'
    + '<div class="field"><label>Título</label><input id="matTitulo" placeholder="Ex: Cartilha de Indicadores 2026"></div>'
    + '<div class="field"><label>Categoria</label><select id="matCategoria"><option>PDF</option><option>PPT</option><option>Vídeo</option><option>Treinamento</option><option>Guia</option><option>Manual</option></select></div>'
    + '<div class="field"><label>Arquivo</label><input type="file" id="matArquivo" accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,video/*,image/*"></div>'
    + '<button class="btn btn-solid" onclick="addMaterial()">+ Publicar material</button>';
}
function formatBytes(bytes){
  if(!bytes && bytes!==0) return '—';
  if(bytes < 1024) return bytes+' B';
  if(bytes < 1024*1024) return (bytes/1024).toFixed(1)+' KB';
  return (bytes/(1024*1024)).toFixed(1)+' MB';
}
function addMaterial(){
  var tituloEl = document.getElementById('matTitulo');
  var titulo = tituloEl.value.trim();
  var cat = document.getElementById('matCategoria').value;
  var fileEl = document.getElementById('matArquivo');
  var file = fileEl.files && fileEl.files[0];
  if(!titulo){ toast('Informe o título do material.'); return; }
  if(!file){ toast('Selecione o arquivo para publicar.'); return; }
  var tam = formatBytes(file.size);
  var reader = new FileReader();
  reader.onload = function(e){
    var fileUrl = e.target.result;
    var colorMap = { PDF:'var(--red)', PPT:'#D9822B', 'Vídeo':'var(--primary)', Treinamento:'var(--purple)', Guia:'var(--green)', Manual:'var(--green)' };
    var tagMap = { PDF:'PDF', PPT:'PPT', 'Vídeo':'▶', Treinamento:'TR', Guia:'GD', Manual:'DOC' };
    var row = document.createElement('div');
    row.className = 'mat-row';
    row.dataset.cat = cat.toLowerCase();
    var tituloEscapado = titulo.replace(/'/g,"\\'");
    row.innerHTML = '<div class="mat-ic" style="background:'+(colorMap[cat]||'var(--primary)')+';">'+(tagMap[cat]||cat)+'</div>'
      + '<div class="mat-name">'+escapeHtml(titulo)+'<span>'+cat+' &middot; '+tam+'</span></div><div class="dl-btn" onclick="downloadMaterial(\''+tituloEscapado+'\', \''+fileUrl+'\', \''+file.name.replace(/'/g,"\\'")+'\')">⬇</div>';
    document.getElementById('materiais-list').prepend(row);
    tituloEl.value = '';
    fileEl.value = '';
    toast('"'+titulo+'" publicado na Biblioteca de Materiais.');
  };
  reader.onerror = function(){
    toast('Não foi possível carregar o arquivo. Tente novamente.');
  };
  reader.readAsDataURL(file);
}

