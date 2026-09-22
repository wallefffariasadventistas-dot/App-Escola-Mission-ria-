/* ================= STORIES (24 horas, navegação sequencial) ================= */
var storiesSeed = [
  { id:'s1', user:'Líder Marcos', createdAt: Date.now()-3*3600*1000, color:'var(--primary)', initials:'LM', personId:1 },
  { id:'s2', user:'Pastor Eduardo Chateaubriand', createdAt: Date.now()-8*3600*1000, color:'var(--green)', initials:'EC', personId:3 },
  { id:'s3', user:'Pastor Emerson Paulo Da Silva', createdAt: Date.now()-20*3600*1000, color:'#1F8A70', initials:'EP', personId:6 }
];
var myStories = [];
var storyGroups = [];
var storyGroupIndex = 0;
var storyItemIndex = 0;
var storyTimerId = null;
var STORY_DURATION = 5000;

function renderStories(){
  var row = document.getElementById('storiesRow');
  if(!row) return;
  var now = Date.now();
  myStories = myStories.filter(function(s){ return (now - s.createdAt) < 24*3600*1000; });
  var myLast = myStories.length ? myStories[myStories.length-1] : null;
  var myAvatarInner = myLast ? '<img src="'+myLast.img+'">' : (myProfilePic ? '<img src="'+myProfilePic+'">' : 'EU');
  var html = '<div class="story-item story-add" onclick="'+(myLast ? "openStoryViewer('me')" : "document.getElementById('storyFileInput').click()")+'">'
    + '<div class="story-ring'+(myLast ? '' : ' seen')+'"><div class="inner"><div class="story-avatar">'+myAvatarInner+'</div></div>'
    + '<div class="plus" onclick="event.stopPropagation(); document.getElementById(\'storyFileInput\').click();">+</div></div><span>Seu story</span></div>';

  var seedVisible = storiesSeed.filter(function(s){ return (now - s.createdAt) < 24*3600*1000; });
  seedVisible.forEach(function(s){
    html += '<div class="story-item" onclick="openStoryViewer(\''+s.id+'\')">'
      + '<div class="story-ring"><div class="inner"><div class="story-avatar" style="background:'+s.color+'; color:#fff;">'+s.initials+'</div></div></div>'
      + '<span>'+s.user+'</span></div>';
  });
  row.innerHTML = html;
}
function hoursLeft(createdAt){
  var msLeft = (createdAt + 24*3600*1000) - Date.now();
  return Math.max(0, Math.ceil(msLeft/3600000));
}
/* Cada grupo representa UMA PESSOA (nunca um distrito/igreja). "stories" guarda
   todas as postagens dela, em ordem — a tela só avança para o próximo grupo
   (próxima pessoa) depois de esgotar todas as postagens da pessoa atual. */
function getStoryGroups(){
  var now = Date.now();
  var groups = [];
  if(myStories.length){
    groups.push({ key:'me', name:'Você', stories: myStories.slice() });
  }
  storiesSeed.filter(function(s){ return (now-s.createdAt) < 24*3600*1000; }).forEach(function(s){
    groups.push({ key:s.id, name:s.user, color:s.color, initials:s.initials, stories:[s] });
  });
  return groups;
}
function renderStoryProgressBars(){
  var wrap = document.getElementById('storyProgressWrap');
  var group = storyGroups[storyGroupIndex];
  if(!wrap || !group) return;
  wrap.innerHTML = group.stories.map(function(_, i){
    var cls = i < storyItemIndex ? 'seg done' : (i === storyItemIndex ? 'seg active' : 'seg');
    return '<div class="'+cls+'"><div class="fillbar"></div></div>';
  }).join('');
}
var cubeAnimating = false;
var CUBE_MS = 500;
function computeCubeHalfWidth(){
  var wrap = document.getElementById('storyCubeWrap');
  return wrap ? wrap.getBoundingClientRect().width/2 : 0;
}
function setFaceContentForPosition(imgEl, groupIndex, itemIndex){
  var group = storyGroups[groupIndex];
  var item = group.stories[itemIndex];
  if(group.key==='me'){
    imgEl.src = item.img;
  } else {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><rect width="100%" height="100%" fill="'+group.color+'"/>'
      + '<text x="50%" y="50%" fill="#fff" font-size="64" text-anchor="middle" font-family="sans-serif" dy=".3em">'+group.name+'</text></svg>';
    imgEl.src = 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
  }
}
function setStoryMetaForPosition(groupIndex, itemIndex){
  var group = storyGroups[groupIndex];
  var item = group.stories[itemIndex];
  var nameEl = document.getElementById('storyViewerName');
  nameEl.textContent = group.name+' · expira em '+hoursLeft(item.createdAt)+'h';
  var avatarEl = document.getElementById('storyViewerAvatar');
  if(avatarEl){
    if(group.key==='me'){
      avatarEl.style.background = 'var(--primary)';
      avatarEl.innerHTML = myProfilePic ? '<img src="'+myProfilePic+'">' : 'EU';
    } else {
      avatarEl.style.background = group.color;
      avatarEl.innerHTML = group.initials;
    }
  }
  var menuBtn = document.getElementById('storyMenuBtn');
  if(menuBtn) menuBtn.classList.toggle('hidden', group.key!=='me');
  document.getElementById('storyMenu').classList.add('hidden');
}
function toggleStoryMenu(e){
  if(e) e.stopPropagation();
  document.getElementById('storyMenu').classList.toggle('hidden');
}
function deleteCurrentStory(){
  var group = storyGroups[storyGroupIndex];
  if(!group || group.key!=='me') return;
  var item = group.stories[storyItemIndex];
  var idx = myStories.findIndex(function(s){ return s.id===item.id; });
  if(idx!==-1) myStories.splice(idx,1);
  document.getElementById('storyMenu').classList.add('hidden');
  closeStoryViewer();
  renderStories();
  toast('Story excluído.');
}
function goToStoryPersonProfile(){
  var group = storyGroups[storyGroupIndex];
  if(!group) return;
  closeStoryViewer();
  if(group.key==='me'){
    go('perfil');
    return;
  }
  var item = group.stories[storyItemIndex];
  if(item && item.personId){
    openPersonProfile(item.personId);
  }
}
function computeNextStoryPosition(dir){
  var newItemIndex = storyItemIndex + dir;
  var currentGroup = storyGroups[storyGroupIndex];
  if(currentGroup && newItemIndex >= 0 && newItemIndex < currentGroup.stories.length){
    return { groupIndex:storyGroupIndex, itemIndex:newItemIndex };
  }
  var newGroupIndex = storyGroupIndex + dir;
  if(newGroupIndex < 0 || newGroupIndex >= storyGroups.length) return null;
  var itemIndex = dir>0 ? 0 : storyGroups[newGroupIndex].stories.length-1;
  return { groupIndex:newGroupIndex, itemIndex:itemIndex };
}
function openStoryViewer(groupKey){
  storyGroups = getStoryGroups();
  if(!storyGroups.length) return;
  var idx = storyGroups.findIndex(function(g){ return g.key===groupKey; });
  storyGroupIndex = idx===-1 ? 0 : idx;
  storyItemIndex = 0;
  document.getElementById('storyViewer').classList.add('show');
  var halfW = computeCubeHalfWidth();
  var cube = document.getElementById('storyCube');
  cube.classList.add('no-anim');
  cube.style.transform = 'rotateY(0deg)';
  document.getElementById('cubeFaceFront').style.transform = 'rotateY(0deg) translateZ('+halfW+'px)';
  document.getElementById('cubeFaceSide').style.transform = 'rotateY(90deg) translateZ('+halfW+'px)';
  void cube.offsetWidth;
  cube.classList.remove('no-anim');
  showCurrentStory();
}
function showCurrentStory(){
  clearTimeout(storyTimerId);
  var group = storyGroups[storyGroupIndex];
  if(!group || !group.stories[storyItemIndex]){ closeStoryViewer(); return; }
  setFaceContentForPosition(document.getElementById('cubeImgFront'), storyGroupIndex, storyItemIndex);
  setStoryMetaForPosition(storyGroupIndex, storyItemIndex);
  renderStoryProgressBars();
  storyTimerId = setTimeout(nextStory, STORY_DURATION);
}
function transitionStory(dir){
  if(cubeAnimating) return;
  var pos = computeNextStoryPosition(dir);
  if(!pos){
    if(dir>0){ closeStoryViewer(); } else { showCurrentStory(); }
    return;
  }
  clearTimeout(storyTimerId);
  cubeAnimating = true;

  var cube = document.getElementById('storyCube');
  var sideFaceEl = document.getElementById('cubeFaceSide');
  var sideImg = document.getElementById('cubeImgSide');
  var frontFaceEl = document.getElementById('cubeFaceFront');
  var halfW = computeCubeHalfWidth();
  setFaceContentForPosition(sideImg, pos.groupIndex, pos.itemIndex);

  cube.classList.add('no-anim');
  cube.style.transform = 'rotateY(0deg)';
  frontFaceEl.style.transform = 'rotateY(0deg) translateZ('+halfW+'px)';
  sideFaceEl.style.transform = 'rotateY('+(dir>0 ? '90deg' : '-90deg')+') translateZ('+halfW+'px)';
  void cube.offsetWidth;
  cube.classList.remove('no-anim');

  requestAnimationFrame(function(){
    cube.style.transform = 'rotateY('+(dir>0 ? '-90deg' : '90deg')+')';
  });

  setTimeout(function(){
    document.getElementById('cubeImgFront').src = sideImg.src;
    storyGroupIndex = pos.groupIndex;
    storyItemIndex = pos.itemIndex;
    cube.classList.add('no-anim');
    cube.style.transform = 'rotateY(0deg)';
    void cube.offsetWidth;
    cube.classList.remove('no-anim');
    cubeAnimating = false;
    setStoryMetaForPosition(storyGroupIndex, storyItemIndex);
    renderStoryProgressBars();
    storyTimerId = setTimeout(nextStory, STORY_DURATION);
  }, CUBE_MS);
}
function nextStory(){ transitionStory(1); }
function prevStory(){ transitionStory(-1); }
function closeStoryViewer(){
  clearTimeout(storyTimerId);
  cubeAnimating = false;
  document.getElementById('storyViewer').classList.remove('show');
  document.getElementById('storyMenu').classList.add('hidden');
}
(function bindStoryGestures(){
  var frame = document.getElementById('storyViewerFrame');
  if(!frame) return;
  var startX = null, startY = null, startedInTop = false;
  frame.addEventListener('pointerdown', function(e){
    startX = e.clientX; startY = e.clientY;
    startedInTop = !!(e.target.closest && e.target.closest('.story-viewer-top'));
  });
  frame.addEventListener('pointerup', function(e){
    if(startX===null || startedInTop){ startX=null; startY=null; return; }
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    var rect = frame.getBoundingClientRect();
    var relX = startX - rect.left;
    startX = null; startY = null;
    if(Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) return; // vertical drag, ignore
    if(Math.abs(dx) > 50){
      if(dx < 0) nextStory(); else prevStory();
    } else {
      if(relX < rect.width*0.35) prevStory(); else nextStory();
    }
  });
})();
setInterval(renderStories, 60000);

