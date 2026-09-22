/* ================= FEED INFINITO ================= */
var feedPool = [
  { name:'Líder Marcos · Igreja Nova Vida', avatar:'M', color:'var(--green)', media:'📷 grupo de estudo bíblico', text:'Mais um encontro do pequeno grupo dessa semana, com ótimas conversas e decisões por Cristo!', likes:14, comments:3, tag:'Estudo Bíblico' },
  { name:'Líder Fernanda · Igreja Renovo', avatar:'F', color:'var(--red)', media:'📷 distribuição de literatura', text:'Equipe de colportagem entregando literatura no bairro hoje pela manhã.', likes:19, comments:5, tag:'Testemunho' },
  { name:'Pastor Elias · Distrito Norte', avatar:'E', color:'var(--purple)', media:'🎥 culto de oração', text:'Noite de oração especial pelas famílias do distrito.', likes:27, comments:8, tag:'Comunhão' },
  { name:'Líder de Aeroporto - Teresina', avatar:'A', color:'var(--purple)', media:'📷 batismo', text:'Momento especial de batismo neste sábado! Glória a Deus.', likes:35, comments:11, tag:'Batismo' },
  { name:'Robson Alves · Igreja Getsêmani', avatar:'R', color:'var(--amber)', media:'📷 evangelismo de rua', text:'Ação de evangelismo nas ruas do bairro com distribuição de folhetos.', likes:9, comments:2, tag:'Sábado Missionário' }
];
var feedPoolIndex = 0;
var feedLoading = false;
function appendFeedTemplatePost(t){
  var post = document.createElement('div');
  post.className = 'post';
  var horas = Math.floor(Math.random()*10)+1;
  post.innerHTML = buildPostHeadHtml(t.avatar, t.name, 'há '+horas+' horas', t.tag, t.color)
    + '<div class="post-media">'+t.media+'</div>'
    + '<div class="post-text">'+t.text+'</div>'
    + buildPostInteractionsHtml('<span onclick="toggleLike(this)">🤍 '+t.likes+' curtidas</span>', t.comments);
  document.getElementById('feedPosts').appendChild(post);
}
function loadMoreFeedPosts(){
  if(feedLoading) return;
  feedLoading = true;
  var loader = document.getElementById('feedLoader');
  if(loader) loader.classList.remove('hidden');
  setTimeout(function(){
    for(var i=0;i<3;i++){
      appendFeedTemplatePost(feedPool[feedPoolIndex % feedPool.length]);
      feedPoolIndex++;
    }
    if(loader) loader.classList.add('hidden');
    feedLoading = false;
  }, 700);
}
function checkFeedInfiniteScroll(el){
  var pane = document.querySelector('.tabpane[data-pane="feed"]');
  if(!pane || pane.classList.contains('hidden')) return;
  if(el.scrollTop + el.clientHeight >= el.scrollHeight - 200){
    loadMoreFeedPosts();
  }
}
(function bindFeedScroll(){
  var contentEl = document.getElementById('content');
  var viewAppEl = document.getElementById('view-app');
  if(contentEl) contentEl.addEventListener('scroll', function(){ checkFeedInfiniteScroll(contentEl); });
  if(viewAppEl) viewAppEl.addEventListener('scroll', function(){ checkFeedInfiniteScroll(viewAppEl); });
})();

function toggleFaq(el){
  var wasOpen = el.classList.contains('open');
  document.querySelectorAll('.faq').forEach(f=>f.classList.remove('open'));
  if(!wasOpen) el.classList.add('open');
}

var recoverMethod = 'email';
function recoverAccess(){
  openRecoverAccessModal();
}
function openRecoverAccessModal(){
  selectRecoverMethod('email');
  document.getElementById('recoverAccessModal').classList.add('show');
}
function closeRecoverAccessModal(){
  document.getElementById('recoverAccessModal').classList.remove('show');
}
function selectRecoverMethod(method){
  recoverMethod = method;
  document.getElementById('recoverMethodEmail').classList.toggle('active', method==='email');
  document.getElementById('recoverMethodPhone').classList.toggle('active', method==='celular');
  var input = document.getElementById('recoverInput');
  var label = document.getElementById('recoverFieldLabel');
  if(method==='email'){
    label.textContent = 'E-mail cadastrado';
    input.type = 'email';
    input.placeholder = 'seuemail@missao.org';
  } else {
    label.textContent = 'Celular cadastrado';
    input.type = 'tel';
    input.placeholder = '(86) 9 9999-0000';
  }
  input.value = '';
}
function submitRecoverAccess(){
  var value = document.getElementById('recoverInput').value.trim();
  var meioLabel = recoverMethod==='email' ? 'e-mail' : 'celular';
  if(!value){
    toast('Digite seu '+meioLabel+' cadastrado.');
    return;
  }
  closeRecoverAccessModal();
  toast('Se este '+meioLabel+' estiver cadastrado, você receberá as instruções em breve (simulado).');
}

function submitCadastro(){
  var nome = document.getElementById('cadNome').value.trim();
  var telefone = document.getElementById('cadTelefone').value.trim();
  var email = document.getElementById('cadEmail').value.trim();
  var senha = document.getElementById('cadSenha').value;
  var confirmar = document.getElementById('cadConfirmar').value;
  var perfilEl = document.querySelector('#cadPerfilRow .radio-chip.active');
  var perfil = perfilEl ? perfilEl.textContent : 'Membro';
  var distrito = document.getElementById('cadDistrito').value;
  var igreja = document.getElementById('cadIgreja').value;

  if(!nome){ toast('Informe o nome completo.'); return; }
  if(!telefone){ toast('Informe o telefone.'); return; }
  if(!email || email.indexOf('@')===-1){ toast('Informe um e-mail válido.'); return; }
  if(!senha || senha.length<8){ toast('A senha deve ter no mínimo 8 caracteres.'); return; }
  if(senha!==confirmar){ toast('As senhas não coincidem.'); return; }

  var destino = perfil==='Pastor' ? distrito : (igreja+' · '+distrito);

  if(perfil==='Membro'){
    activeUsers.unshift({ id:nextUserId++, nome:nome, perfil:'Membro', destino:destino, email:email, telefone:telefone, senha:senha, status:'ativo' });
    userChurch = igreja;
    userDistrict = distrito;
    mySignupEmail = email;
    mySignupTelefone = telefone;
    myProfileInfo.nome = nome;
    ['cadNome','cadTelefone','cadEmail','cadSenha','cadConfirmar'].forEach(function(id){ document.getElementById(id).value=''; });
    toast('Conta criada! Bem-vindo(a), '+nome+'.');
    loginAs('membro');
    return;
  }

  pendingRequests.unshift({ id:nextRequestId++, nome:nome, perfil:perfil, destino:destino, email:email, telefone:telefone, senha:senha });
  ['cadNome','cadTelefone','cadEmail','cadSenha','cadConfirmar'].forEach(function(id){ document.getElementById(id).value=''; });
  toast('Cadastro enviado! Aguarde aprovação do Pastor/Administração.');
  showView('welcome');
}

/* ================= FILTROS GENÉRICOS (chips) ================= */
function selectFilterChip(el){
  el.parentElement.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
}

