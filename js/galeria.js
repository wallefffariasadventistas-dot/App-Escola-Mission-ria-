/* ================= GALERIA ================= */
function renderGallery(){
  var grid = document.getElementById('galGrid');
  if(!grid || grid.dataset.rendered) return;
  var html = '';
  for(var i=0;i<9;i++){ html += '<div class="gal-item" role="button" tabindex="0" aria-label="Foto '+(i+1)+'" onclick="openPhoto('+i+')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();openPhoto('+i+');}"></div>'; }
  grid.innerHTML = html;
  grid.dataset.rendered = '1';
}
function openPhoto(i){
  toast('Abrindo foto '+(i+1)+' em tela cheia (simulado).');
}

