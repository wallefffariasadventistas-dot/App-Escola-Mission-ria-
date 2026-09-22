/* ================= EDITOR DE FOTO (mover / zoom / recortar) ================= */
var editorContext = null;
var editorState = { scale:1, x:0, y:0, baseW:0, baseH:0 };
var editorDragging = false, editorDragStartX=0, editorDragStartY=0, editorOrigX=0, editorOrigY=0;

function openEditor(file, type){
  editorContext = { type:type, file:file };
  var img = document.getElementById('editorImg');
  var viewport = document.getElementById('editorViewport');
  viewport.classList.remove('story','circle');
  if(type==='story') viewport.classList.add('story');
  if(type==='profile') viewport.classList.add('circle');
  document.getElementById('editorTitle').textContent =
    type==='profile' ? 'Ajustar foto de perfil' : (type==='story' ? 'Novo Story' : 'Nova publicação');
  var sendBtn = document.getElementById('editorSendBtn');
  sendBtn.innerHTML = type==='story' ? 'Compartilhar no Story <span class="arrow">➤</span>'
    : (type==='profile' ? 'Confirmar foto <span class="arrow">➤</span>' : 'Avançar <span class="arrow">➤</span>');
  document.getElementById('editorZoom').value = 100;
  img.onload = function(){
    var vw = viewport.clientWidth, vh = viewport.clientHeight;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var coverScale = Math.max(vw/iw, vh/ih);
    editorState.baseW = iw*coverScale;
    editorState.baseH = ih*coverScale;
    editorState.x = 0; editorState.y = 0; editorState.scale = 1;
    img.style.width = editorState.baseW+'px';
    img.style.height = editorState.baseH+'px';
    applyEditorTransform();
  };
  document.getElementById('editorModal').classList.add('show');
  var reader = new FileReader();
  reader.onload = function(e){ img.src = e.target.result; };
  reader.onerror = function(){
    toast('Não foi possível carregar a foto. Tente novamente.');
    cancelEditor();
  };
  reader.readAsDataURL(file);
}
function applyEditorTransform(){
  var img = document.getElementById('editorImg');
  var zoomVal = document.getElementById('editorZoom').value;
  editorState.scale = zoomVal/100;
  img.style.transform = 'translate(-50%,-50%) translate('+editorState.x+'px,'+editorState.y+'px) scale('+editorState.scale+')';
}
function editorPointerDown(e){
  editorDragging = true;
  var p = e.touches ? e.touches[0] : e;
  editorDragStartX = p.clientX; editorDragStartY = p.clientY;
  editorOrigX = editorState.x; editorOrigY = editorState.y;
}
function editorPointerMove(e){
  if(!editorDragging) return;
  var p = e.touches ? e.touches[0] : e;
  editorState.x = editorOrigX + (p.clientX - editorDragStartX);
  editorState.y = editorOrigY + (p.clientY - editorDragStartY);
  applyEditorTransform();
}
function editorPointerUp(){ editorDragging = false; }
function cancelEditor(){
  editorContext = null;
  document.getElementById('editorModal').classList.remove('show');
}
function confirmEditor(){
  if(!editorContext) return;
  var viewport = document.getElementById('editorViewport');
  var img = document.getElementById('editorImg');
  var vw = viewport.clientWidth, vh = viewport.clientHeight;
  var outW = 1080, outH = editorContext.type==='story' ? 1920 : 1080;
  var canvas = document.createElement('canvas');
  canvas.width = outW; canvas.height = outH;
  var ctx = canvas.getContext('2d');
  var factor = vw ? (outW / vw) : 1;
  var dispW = editorState.baseW * editorState.scale;
  var dispH = editorState.baseH * editorState.scale;
  var centerX = vw/2 + editorState.x;
  var centerY = vh/2 + editorState.y;
  var imgLeft = centerX - dispW/2;
  var imgTop = centerY - dispH/2;
  var dx = imgLeft*factor, dy = imgTop*factor, dw = dispW*factor, dh = dispH*factor;
  var validCrop = [dx,dy,dw,dh].every(function(n){ return isFinite(n); }) && dw>0 && dh>0;
  if(!validCrop && img.naturalWidth && img.naturalHeight){
    // proteção: se o cálculo de recorte falhar por algum motivo, nunca gerar imagem em branco/preta —
    // desenha a foto inteira cobrindo o quadro, sem zoom/posição personalizados.
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var coverScale = Math.max(outW/iw, outH/ih);
    var fw = iw*coverScale, fh = ih*coverScale;
    dx = (outW-fw)/2; dy = (outH-fh)/2; dw = fw; dh = fh;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
  var dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  var type = editorContext.type;
  editorContext = null;
  document.getElementById('editorModal').classList.remove('show');

  if(type==='profile'){
    myProfilePic = dataUrl;
    updateProfileAvatarUI();
    toast('Foto de perfil atualizada!');
  } else if(type==='story'){
    myStories.push({ id:Date.now(), img:dataUrl, createdAt:Date.now() });
    renderStories();
    toast('Story publicado! Expira em 24 horas.');
  }
}
(function bindEditorDrag(){
  var img = document.getElementById('editorImg');
  img.addEventListener('pointerdown', editorPointerDown);
  document.addEventListener('pointermove', editorPointerMove);
  document.addEventListener('pointerup', editorPointerUp);
  document.getElementById('editorZoom').addEventListener('input', applyEditorTransform);
})();

