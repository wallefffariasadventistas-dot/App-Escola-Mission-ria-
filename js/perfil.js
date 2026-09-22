/* ================= PERFIL ================= */
var myProfilePic = null;
var myBio = 'Servindo a Missão Piauiense com alegria! 🙏';
var myPostCount = 0;
var myCommentCount = 0;
var myProfileLikes = 0;
var myProfileLiked = false;
var mySignupEmail = '';
var mySignupTelefone = '';
var myProfileInfo = {
  nome:'', apelido:'', dataNascimento:'', genero:'', cpf:'', instagram:'',
  privacidade:{ estadoCivilVisivel:true, estadoCivil:'Solteiro(a)', idadeVisivel:false, cidadeVisivel:true }
};
function updateProfileAvatarUI(){
  var big = document.getElementById('profileAvatarBig');
  if(myProfilePic){
    big.innerHTML = '<img src="'+myProfilePic+'">';
  } else {
    big.innerHTML = '<span>EU</span>';
  }
  renderStories();
  updateProfileSummary();
}
function showProfileEdit(){
  document.getElementById('profileHubSection').classList.add('hidden');
  document.getElementById('profileEditSection').classList.remove('hidden');
  populateProfileForm();
}
function hideProfileEdit(){
  document.getElementById('profileEditSection').classList.add('hidden');
  document.getElementById('profileHubSection').classList.remove('hidden');
}
function updateProfileSummary(){
  var nameEl = document.getElementById('summaryName');
  if(!nameEl) return;
  nameEl.textContent = myProfileInfo.nome || myProfileInfo.apelido || 'Você';
  document.getElementById('summaryEmail').textContent = '📧 '+(mySignupEmail || 'Definido no cadastro');
  document.getElementById('summaryPhone').textContent = '📞 '+(mySignupTelefone || 'Definido no cadastro');
  var summaryAvatar = document.getElementById('summaryAvatar');
  summaryAvatar.innerHTML = myProfilePic ? '<img src="'+myProfilePic+'">' : '<span>EU</span>';
}
function calcAge(dateStr){
  var d = new Date(dateStr);
  if(!dateStr || isNaN(d.getTime())) return null;
  var diff = Date.now() - d.getTime();
  return Math.max(0, Math.floor(diff / (365.25*24*3600*1000)));
}
function openMyProfilePreview(){
  updatePostCountUI();
  updateFollowersCountUI();
  updateFollowingCount();
  var statCommentsEl = document.getElementById('statComments');
  if(statCommentsEl) statCommentsEl.textContent = myCommentCount;
  var previewAvatar = document.getElementById('previewAvatar');
  previewAvatar.innerHTML = myProfilePic ? '<img src="'+myProfilePic+'">' : '<span>EU</span>';
  document.getElementById('previewName').textContent = myProfileInfo.nome || myProfileInfo.apelido || 'Você';
  document.getElementById('previewBio').textContent = myBio;
  var metaParts = [];
  if(myProfileInfo.privacidade.cidadeVisivel){
    var cidadeEl = document.getElementById('pInfoCidade');
    metaParts.push('📍 '+(cidadeEl ? cidadeEl.value : 'Teresina'));
  }
  if(myProfileInfo.privacidade.estadoCivilVisivel && myProfileInfo.privacidade.estadoCivil){
    metaParts.push('👤 '+myProfileInfo.privacidade.estadoCivil);
  }
  if(myProfileInfo.privacidade.idadeVisivel){
    var idade = calcAge(myProfileInfo.dataNascimento);
    if(idade!=null) metaParts.push('🎂 '+idade+' anos');
  }
  document.getElementById('previewMetaRow').innerHTML = metaParts.map(function(p){ return '<span>'+escapeHtml(p)+'</span>'; }).join('');
  document.getElementById('previewLikesCount').textContent = myProfileLikes;
  document.getElementById('previewLikesBtn').classList.toggle('liked', myProfileLiked);
  document.getElementById('myProfilePreviewModal').classList.add('show');
}
function closeMyProfilePreview(){
  document.getElementById('myProfilePreviewModal').classList.remove('show');
}
function toggleMyProfileLike(){
  myProfileLiked = !myProfileLiked;
  myProfileLikes = Math.max(0, myProfileLikes + (myProfileLiked ? 1 : -1));
  document.getElementById('previewLikesCount').textContent = myProfileLikes;
  document.getElementById('previewLikesBtn').classList.toggle('liked', myProfileLiked);
}
function openLegalModal(){ document.getElementById('legalModal').classList.add('show'); }
function closeLegalModal(){ document.getElementById('legalModal').classList.remove('show'); }
function openDeleteAccountConfirm(){ document.getElementById('deleteAccountModal').classList.add('show'); }
function closeDeleteAccountConfirm(){ document.getElementById('deleteAccountModal').classList.remove('show'); }
function confirmDeleteAccount(){
  closeDeleteAccountConfirm();
  toast('Conta excluída (simulado neste protótipo).');
  showView('welcome');
}
function populateProfileForm(){
  var nomeEl = document.getElementById('pInfoNome');
  if(!nomeEl) return;
  nomeEl.value = myProfileInfo.nome;
  document.getElementById('pInfoApelido').value = myProfileInfo.apelido;
  document.getElementById('profileBio').value = myBio;
  document.getElementById('pInfoNascimento').value = myProfileInfo.dataNascimento;
  document.getElementById('pInfoGenero').value = myProfileInfo.genero;
  document.getElementById('pInfoCpf').value = myProfileInfo.cpf;
  document.getElementById('pInfoInstagram').value = myProfileInfo.instagram;
  document.getElementById('pInfoEmail').value = mySignupEmail;
  document.getElementById('pInfoCelular').value = mySignupTelefone;
  document.getElementById('pInfoEstadoCivil').value = myProfileInfo.privacidade.estadoCivil;
  var civToggle = document.getElementById('privEstadoCivilToggle');
  civToggle.classList.toggle('on', myProfileInfo.privacidade.estadoCivilVisivel);
  document.getElementById('pInfoEstadoCivilWrap').classList.toggle('hidden', !myProfileInfo.privacidade.estadoCivilVisivel);
  document.getElementById('privIdadeToggle').classList.toggle('on', myProfileInfo.privacidade.idadeVisivel);
  document.getElementById('privCidadeToggle').classList.toggle('on', myProfileInfo.privacidade.cidadeVisivel);
}
function saveProfileInfo(){
  myProfileInfo.nome = document.getElementById('pInfoNome').value.trim();
  myProfileInfo.apelido = document.getElementById('pInfoApelido').value.trim();
  myBio = document.getElementById('profileBio').value.trim();
  myProfileInfo.dataNascimento = document.getElementById('pInfoNascimento').value;
  myProfileInfo.genero = document.getElementById('pInfoGenero').value;
  myProfileInfo.cpf = document.getElementById('pInfoCpf').value.trim();
  myProfileInfo.instagram = document.getElementById('pInfoInstagram').value.trim();
  myProfileInfo.privacidade.estadoCivilVisivel = document.getElementById('privEstadoCivilToggle').classList.contains('on');
  myProfileInfo.privacidade.estadoCivil = document.getElementById('pInfoEstadoCivil').value;
  myProfileInfo.privacidade.idadeVisivel = document.getElementById('privIdadeToggle').classList.contains('on');
  myProfileInfo.privacidade.cidadeVisivel = document.getElementById('privCidadeToggle').classList.contains('on');
  updateProfileSummary();
  hideProfileEdit();
  toast('Alterações salvas com sucesso!');
}
function updatePostCountUI(){
  var el = document.getElementById('statPosts');
  if(el) el.textContent = myPostCount;
}

/* ---- Diretório de pessoas (seguir / seguidores / perfis) ---- */
var peopleDirectory = [
  { id:1, nome:'Líder Marcos', sub:'Central Teresina', initials:'LM', color:'var(--primary)', following:false, followsYou:true, posts:14, followersBase:32, followingBase:18 },
  { id:2, nome:'Líder Fernanda', sub:'Parnaíba', initials:'LF', color:'var(--purple)', following:false, followsYou:false, posts:9, followersBase:21, followingBase:26 },
  { id:3, nome:'Pastor Eduardo Chateaubriand', sub:'Central Teresina', initials:'EC', color:'var(--green)', following:true, followsYou:true, posts:22, followersBase:58, followingBase:12 },
  { id:4, nome:'Robson Alves', sub:'Guadalupe', initials:'RA', color:'var(--red)', following:false, followsYou:false, posts:6, followersBase:15, followingBase:20 },
  { id:5, nome:'Líder Ana', sub:'Aeroporto - Teresina', initials:'LA', color:'#D9822B', following:false, followsYou:true, posts:17, followersBase:29, followingBase:14 },
  { id:6, nome:'Pastor Emerson Paulo Da Silva', sub:'Aeroporto - PI', initials:'EP', color:'var(--primary)', following:false, followsYou:true, posts:11, followersBase:47, followingBase:9 },
  { id:7, nome:'Maria Fernandes', sub:'Porto Alegre', initials:'MF', color:'var(--green)', following:false, followsYou:true, posts:8, followersBase:19, followingBase:22 },
  { id:8, nome:'Pastor Mizael Almeida Cavalcanti', sub:'Parnaíba', initials:'MC', color:'var(--purple)', following:false, followsYou:false, posts:13, followersBase:41, followingBase:11 },
  { id:9, nome:'Líder Robson', sub:'Floriano', initials:'LR', color:'var(--red)', following:false, followsYou:false, posts:5, followersBase:12, followingBase:16 },
  { id:10, nome:'Pastora Raniele Gonçalves Costa', sub:'São Raimundo Nonato', initials:'RC', color:'#1F8A70', following:false, followsYou:true, posts:19, followersBase:36, followingBase:10 }
];
var myFollowersPadding = 12;
var currentPersonModalId = null;

function renderFollowSuggestions(){
  var wrap = document.getElementById('followSuggestions');
  if(!wrap) return;
  wrap.innerHTML = peopleDirectory.map(function(u){
    return '<div class="active-user-row"><div class="pav" style="background:'+u.color+'; color:#fff; cursor:pointer;" onclick="openPersonProfile('+u.id+')">'+u.initials+'</div><div style="flex:1; cursor:pointer;" onclick="openPersonProfile('+u.id+')"><b>'+u.nome+'</b><span>'+u.sub+'</span></div>'
      + '<div class="row-actions"><button class="'+(u.following?'btn-reject':'btn-approve')+'" onclick="togglePersonFollowById('+u.id+')">'+(u.following?'Seguindo':'Seguir')+'</button></div></div>';
  }).join('');
}
function togglePersonFollowById(id){
  var u = peopleDirectory.find(function(x){ return x.id===id; });
  if(!u) return;
  u.following = !u.following;
  if(u.following) u.followsYou = true;
  renderFollowSuggestions();
  if(typeof renderFeedSuggestions==='function') renderFeedSuggestions();
  if(typeof filterFriendSearch==='function') filterFriendSearch();
  if(currentPersonModalId===id) updatePersonModalFollowBtn();
  updateFollowingCount();
  updateFollowersCountUI();
  toast(u.following ? ('Você começou a seguir '+u.nome+'.') : ('Você deixou de seguir '+u.nome+'.'));
}
function updateFollowingCount(){
  var count = peopleDirectory.filter(function(u){ return u.following; }).length;
  var el = document.getElementById('statFollowing');
  if(el) el.textContent = count;
}
function updateFollowersCountUI(){
  var count = peopleDirectory.filter(function(u){ return u.followsYou; }).length + myFollowersPadding;
  var el = document.getElementById('statFollowers');
  if(el) el.textContent = count;
}
function openFollowList(type){
  var panel = document.getElementById('followListPanel');
  var title = document.getElementById('followListTitle');
  var body = document.getElementById('followListBody');
  if(type==='followers'){
    var followers = peopleDirectory.filter(function(u){ return u.followsYou; });
    title.textContent = 'Seguidores ('+(followers.length+myFollowersPadding)+')';
    body.innerHTML = followers.map(function(u){
      return '<div class="active-user-row"><div class="pav" style="background:'+u.color+'; color:#fff; cursor:pointer;" onclick="openPersonProfile('+u.id+')">'+u.initials+'</div><div style="flex:1; cursor:pointer;" onclick="openPersonProfile('+u.id+')"><b>'+u.nome+'</b><span>'+u.sub+'</span></div>'
        + '<div class="row-actions"><button class="'+(u.following?'btn-reject':'btn-approve')+'" onclick="togglePersonFollowById('+u.id+'); openFollowList(\'followers\')">'+(u.following?'Seguindo':'Seguir de volta')+'</button></div></div>';
    }).join('') + '<div class="empty-note">+ '+myFollowersPadding+' outras pessoas seguem você</div>';
  } else {
    var following = peopleDirectory.filter(function(u){ return u.following; });
    title.textContent = 'Seguindo ('+following.length+')';
    body.innerHTML = following.length ? following.map(function(u){
      return '<div class="active-user-row"><div class="pav" style="background:'+u.color+'; color:#fff; cursor:pointer;" onclick="openPersonProfile('+u.id+')">'+u.initials+'</div><div style="flex:1; cursor:pointer;" onclick="openPersonProfile('+u.id+')"><b>'+u.nome+'</b><span>'+u.sub+'</span></div>'
        + '<div class="row-actions"><button class="btn-reject" onclick="togglePersonFollowById('+u.id+'); openFollowList(\'following\')">Deixar de seguir</button></div></div>';
    }).join('') : '<div class="empty-note">Você ainda não segue ninguém.</div>';
  }
  panel.classList.remove('hidden');
}
function closeFollowList(){
  document.getElementById('followListPanel').classList.add('hidden');
}

/* ---- Buscar amigos e sugestões (Feed) ---- */
function filterFriendSearch(){
  var input = document.getElementById('friendSearchInput');
  var el = document.getElementById('friendSearchResults');
  if(!input || !el) return;
  var term = input.value.toLowerCase().trim();
  if(!term){ el.classList.add('hidden'); el.innerHTML = ''; return; }
  var matches = peopleDirectory.filter(function(p){ return p.nome.toLowerCase().indexOf(term)!==-1; });
  el.innerHTML = matches.length ? matches.map(function(p){
    return '<div class="indic-search-row" onclick="openPersonProfile('+p.id+')">'
      + '<div class="pav" style="background:'+p.color+'; color:#fff; width:30px; height:30px; font-size:11px;">'+p.initials+'</div>'
      + '<div style="flex:1;"><b>'+p.nome+'</b><span>'+p.sub+'</span></div>'
      + '<span class="tag">'+(p.following ? 'Seguindo' : 'Seguir')+'</span></div>';
  }).join('') : '<div class="empty-note">Nenhuma pessoa encontrada.</div>';
  el.classList.remove('hidden');
}
document.addEventListener('click', function(e){
  var wrap = document.getElementById('friendSearchResults');
  if(!wrap || wrap.classList.contains('hidden')) return;
  if(!e.target.closest || !e.target.closest('.friend-search-wrap')) wrap.classList.add('hidden');
});
function renderFeedSuggestions(){
  var row = document.getElementById('feedSuggestionsRow');
  if(!row) return;
  var suggestions = peopleDirectory.filter(function(p){ return !p.following; });
  row.innerHTML = suggestions.length ? suggestions.map(function(p){
    return '<div class="suggestion-card">'
      + '<div class="av" style="background:'+p.color+';" onclick="openPersonProfile('+p.id+')">'+p.initials+'</div>'
      + '<b onclick="openPersonProfile('+p.id+')">'+p.nome+'</b><span>'+p.sub+'</span>'
      + '<button class="btn-approve" onclick="togglePersonFollowById('+p.id+')">Seguir</button>'
      + '</div>';
  }).join('') : '<div class="empty-note">Você já segue todo mundo por aqui 🎉</div>';
}
function openPersonProfile(id){
  var p = peopleDirectory.find(function(x){ return x.id===id; });
  if(!p) return;
  currentPersonModalId = id;
  var avatarEl = document.getElementById('personModalAvatar');
  avatarEl.style.background = p.color;
  avatarEl.textContent = p.initials;
  document.getElementById('personModalName').textContent = p.nome;
  document.getElementById('personModalSub').textContent = p.sub;
  document.getElementById('personModalPosts').textContent = p.posts;
  document.getElementById('personModalFollowers').textContent = p.followersBase;
  document.getElementById('personModalFollowing').textContent = p.followingBase;
  updatePersonModalFollowBtn();
  renderPersonModalGrid(p.posts);
  document.getElementById('personModal').classList.add('show');
}
function renderPersonModalGrid(count){
  var grid = document.getElementById('personModalGrid');
  if(!grid) return;
  var palette = [
    'linear-gradient(135deg,#a9c4dd,#6f93b6)', 'linear-gradient(135deg,#f5c453,#e2434d)',
    'linear-gradient(135deg,#6C4F9E,#a637a8)', 'linear-gradient(135deg,#1F8A70,#5fd6b0)',
    'linear-gradient(135deg,#137bae,#0a3d57)', 'linear-gradient(135deg,#D9822B,#f5c453)'
  ];
  var n = Math.max(3, Math.min(9, count));
  var html = '';
  for(var i=0;i<n;i++){ html += '<div style="background:'+palette[i%palette.length]+';"></div>'; }
  grid.innerHTML = html;
}
function updatePersonModalFollowBtn(){
  var p = peopleDirectory.find(function(x){ return x.id===currentPersonModalId; });
  var btn = document.getElementById('personModalFollowBtn');
  if(!p || !btn) return;
  btn.textContent = p.following ? 'Deixar de seguir' : 'Seguir';
  btn.className = 'btn '+(p.following ? 'btn-ghost' : 'btn-solid');
}
function togglePersonFollow(){
  if(currentPersonModalId==null) return;
  togglePersonFollowById(currentPersonModalId);
}
function closePersonProfile(){
  document.getElementById('personModal').classList.remove('show');
  currentPersonModalId = null;
}

