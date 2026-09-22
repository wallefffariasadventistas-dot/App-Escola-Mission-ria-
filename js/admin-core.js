/* ================= ADMIN PANEL ================= */
function toast(msg){
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function(){ t.classList.remove('show'); }, 2400);
}

function computeDefaultMetas(membros){
  return {
    missionarios: Math.max(1, Math.round(membros*0.15)),
    estudos: Math.max(1, Math.round(membros*0.10)),
    batismos: Math.max(1, Math.round(membros*0.04)),
    enviados: Math.max(1, Math.round(membros*0.015))
  };
}
var TRIMESTRE_LABELS = ['1º Trimestre · Jan a Mar','2º Trimestre · Abr a Jun','3º Trimestre · Jul a Set','4º Trimestre · Out a Dez'];
function makeEmptyTrimestres(){
  var arr = [];
  for(var i=0;i<4;i++){
    arr.push({
      meta:{ missionarios:0, estudos:0, batismos:0, enviados:0 },
      alcancado:false,
      valores:{ missionarios:0, estudos:0, batismos:0, enviados:0 }
    });
  }
  return arr;
}
