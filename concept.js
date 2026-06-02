/* ===========================================================
   개념사전 (수학 개념사전 + GPS스타그램 포토카드 갤러리)
   - CONCEPTS: 교사가 제작한 개념사전 카드(이미지) 데이터
   - 학생 포토카드는 localStorage(gps_photocards)에 저장
   - 관리자(id: admin 또는 관리자 모드)면 학생 게시물 삭제 가능
   =========================================================== */

const CONCEPTS = [
  { id:'eorim',  name:'어림셈',   img:'assets/concepts/c02.jpg', area:'수와 연산',    g:'5학년', s:'2학기', unit:'수의 범위와 어림하기' },
  { id:'add',    name:'덧셈',     img:'assets/concepts/c03.jpg', area:'수와 연산',    g:'3학년', s:'1학기', unit:'덧셈과 뺄셈' },
  { id:'eqtri',  name:'정삼각형', img:'assets/concepts/c04.jpg', area:'도형과 측정',  g:'4학년', s:'2학기', unit:'삼각형' },
  { id:'length', name:'길이',     img:'assets/concepts/c05.jpg', area:'도형과 측정',  g:'2학년', s:'1학기', unit:'길이 재기' },
  { id:'plane',  name:'평면도형', img:'assets/concepts/c06.jpg', area:'도형과 측정',  g:'3학년', s:'1학기', unit:'평면도형' },
  { id:'parallel',name:'평행',    img:'assets/concepts/c07.jpg', area:'도형과 측정',  g:'4학년', s:'2학기', unit:'사각형' },
  { id:'diam',   name:'지름',     img:'assets/concepts/c08.jpg', area:'도형과 측정',  g:'3학년', s:'2학기', unit:'원' },
  { id:'radius', name:'반지름',   img:'assets/concepts/c09.jpg', area:'도형과 측정',  g:'3학년', s:'2학기', unit:'원' },
  { id:'line',   name:'선',       img:'assets/concepts/c10.jpg', area:'도형과 측정',  g:'3학년', s:'1학기', unit:'평면도형' },
  { id:'point',  name:'점',       img:'assets/concepts/c01.jpg', area:'도형과 측정',  g:'3학년', s:'1학기', unit:'평면도형' },
  { id:'time',   name:'시간',     img:'assets/concepts/c12.png', area:'도형과 측정',  g:'2학년', s:'2학기', unit:'시각과 시간' },
  { id:'equal',  name:'등호',     img:'assets/concepts/c11.png', area:'변화와 관계',  g:'5학년', s:'1학기', unit:'대응 관계' },
];

const AREAS = ['전체','수와 연산','도형과 측정','변화와 관계','자료와 가능성'];

/* 갤러리 시드: 실제 학생 포토카드 예시(전체 화면 스크린샷) */
const SEED_CARDS = [
  { id:'ex1',  concept:'반올림',   area:'수와 연산',   title:'모래알, 진실',           shot:'assets/gallery/ex-sand.jpg',     likes:312, seed:true,
    desc:'이 사진에서 모래알의 개수는 반올림하여 약 30억개입니다. 정말입니다. 못믿겠으면 직접 세어 보시면 됩니다.' },
  { id:'ex2',  concept:'덧셈',     area:'수와 연산',   title:'오케이! 이기는 중',       shot:'assets/gallery/ex-chicken.jpg',  likes:188, seed:true,
    desc:'초록색 닭은 방금 꼬리 하나를 얻었습니다. + 이기는 중!' },
  { id:'ex3',  concept:'정삼각형', area:'도형과 측정', title:'서하의 운명',            shot:'assets/gallery/ex-triangle.jpg', likes:274, seed:true,
    desc:'서하가 길바닥에서 자고 있습니다. 정삼각형으로 서하를 살릴 수 있을까요?' },
  { id:'ex4',  concept:'길이',     area:'도형과 측정', title:'동병상련',               shot:'assets/gallery/ex-trees.jpg',    likes:142, seed:true,
    desc:'이 나무들은 약 6미터 입니다. 작은 나무들에게 함께 힘내자고 응원해주고 싶네요…' },
  { id:'ex5',  concept:'평면도형', area:'도형과 측정', title:'현생을 살자 재혁아',      shot:'assets/gallery/ex-anime.jpg',    likes:401, seed:true,
    desc:'이 캐릭터는 2D인 평면에 있는 캐릭터이다. 즉 재혁이가 좋아하는 그녀는 평면도형이다.' },
  { id:'ex6',  concept:'평행',     area:'도형과 측정', title:'기찻길과 평행',           shot:'assets/gallery/ex-train.jpg',    likes:233, seed:true,
    desc:'서로 만나지는 않지만 나란히 달리는 가로선은, 내 꿈을 싣고 끝없이 달려가는 기찻길 같다.' },
  { id:'ex7',  concept:'지름',     area:'도형과 측정', title:'운동장에 떠있는 보름달',   shot:'assets/gallery/ex-moon.jpg',     likes:159, seed:true,
    desc:'운동장에 박혀있는 흰색 포인트 마커를 보다가 보름달의 지름은 몇일까 생각해보았다.' },
  { id:'ex8',  concept:'반지름',   area:'도형과 측정', title:'훌라후프와 칼로리 소모',   shot:'assets/gallery/ex-hoop.jpg',     likes:176, seed:true,
    desc:'공원에서 운동을 하다가 훌라후프의 반지름의 길이가 궁금해졌다.' },
  { id:'ex9',  concept:'선',       area:'도형과 측정', title:'완벽한 선은 그릴 수 없다', shot:'assets/gallery/ex-line.jpg',     likes:121, seed:true,
    desc:'선은 두께가 없습니다. 선은 길이만 존재합니다. 그래서 측정 가능하죠. 하지만 사실 그릴순 없죠.' },
  { id:'ex10', concept:'점',       area:'도형과 측정', title:'준영이의 매력 위치',       shot:'assets/gallery/ex-mole.jpg',     likes:205, seed:true,
    desc:'준영이 얼굴에 있는 점은 매력있다. 준영이의 매력점은 눈 아래쪽에 위치 돼있다.' },
  { id:'ex11', concept:'시간',     area:'도형과 측정', title:'절망의 시간',            shot:'assets/gallery/ex-clock.png',    likes:347, seed:true,
    desc:'지금 시각 10시 21분, 학교가 마칠 때까지 7시간 1분. 이 사실에 절망감을 느낀다.' },
];

const PADLET_URL = 'https://padlet.com';  // TODO: 실제 패들렛 링크로 교체

/* ---- 상태 ---- */
let curConcept = null;
let curFilter = '전체';
let pendingPhoto = null;     // 업로드 화면 미리보기 dataURL
let account = null;
let isAdmin = false;

/* ---- 뷰 전환 ---- */
const CV = ['viewHome','viewDict','viewDetail','viewGallery','viewUpload'];
function showCV(id){
  CV.forEach(v=> document.getElementById(v).classList.toggle('active', v===id));
  window.scrollTo(0,0);
}

/* ---- 포토카드 저장/로드 ---- */
function loadCards(){
  let stored=[];
  try{ stored=JSON.parse(localStorage.getItem('gps_photocards')||'[]'); }catch(_){}
  return stored;
}
function saveCards(arr){ try{ localStorage.setItem('gps_photocards', JSON.stringify(arr)); }catch(_){} }
function allCards(){ return [...loadCards(), ...SEED_CARDS]; }

/* ============ 개념사전 목록 (인스타그램 게시글) ============ */
const CONCEPT_EMOJI = { eorim:'🔢', add:'➕', eqtri:'🔺', length:'📏', plane:'⬛', parallel:'🛤️',
  diam:'⭕', radius:'🌱', line:'📲', point:'📍', time:'🕐', equal:'🟰' };

/* 인스타그램 스타일 아이콘(SVG) */
const IG_ICON = {
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  heartFilled:'<svg viewBox="0 0 24 24" fill="#ed4956" stroke="#ed4956" stroke-width="1.9" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  comment:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.7 11.5a8.4 8.4 0 0 1-11.8 7.7L3 21l1.9-5.8A8.4 8.4 0 1 1 20.7 11.5z"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>',
  bookmark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.7L5 21V4a1 1 0 0 1 1-1z"/></svg>'
};

function renderDict(){
  const grid=document.getElementById('dictGrid');
  grid.innerHTML='';
  CONCEPTS.forEach((c,i)=>{
    const likes = 124 - i*7 + (i%3)*5;   // 보기용 좋아요 수
    const card=document.createElement('div');
    card.className='dict-card';
    card.setAttribute('role','button'); card.tabIndex=0;
    card.innerHTML =
      '<div class="ig-head">'+
        '<span class="ig-ava">'+(CONCEPT_EMOJI[c.id]||'📐')+'</span>'+
        '<span class="ig-meta"><b>GPS_수학사전</b><span class="ig-sub">'+c.area+'</span></span>'+
        '<span class="ig-more">⋯</span>'+
      '</div>'+
      '<div class="ig-media"><img src="'+c.img+'" alt="'+c.name+'" loading="lazy" /></div>'+
      '<div class="ig-actions">'+
        '<span class="heart" aria-label="좋아요">'+IG_ICON.heart+'</span>'+
        '<span aria-label="댓글">'+IG_ICON.comment+'</span>'+
        '<span aria-label="공유">'+IG_ICON.share+'</span>'+
        '<span class="bm" aria-label="저장">'+IG_ICON.bookmark+'</span>'+
      '</div>'+
      '<div class="ig-likes">좋아요 '+likes+'개</div>'+
      '<div class="ig-cap"><b class="hash">#'+c.name+'</b></div>'+
      '<div class="ig-view">개념사전 자세히 보기</div>';
    // 좋아요 토글(데모)
    const heart=card.querySelector('.heart');
    const likesEl=card.querySelector('.ig-likes');
    let liked=false, n=likes;
    heart.addEventListener('click', e=>{
      e.stopPropagation();
      liked=!liked; heart.innerHTML = liked ? IG_ICON.heartFilled : IG_ICON.heart;
      n = likes + (liked?1:0); likesEl.textContent='좋아요 '+n+'개';
    });
    card.addEventListener('click', ()=> openDetail(c));
    card.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openDetail(c); } });
    grid.appendChild(card);
  });
}

/* ============ 개념 상세 ============ */
function openDetail(c){
  curConcept=c;
  document.getElementById('detailImg').src=c.img;
  document.getElementById('detailImg').alt=c.name;
  document.getElementById('detailName').textContent=c.name;
  document.getElementById('detailArea').textContent=c.area;
  document.getElementById('detailUnit').textContent=c.g+' '+c.s+' · '+c.unit;
  document.getElementById('detailBannerName').textContent="GPS’ CAN '"+c.unit+"'";
  document.getElementById('detailBannerGo').onclick=()=>{ location.href=gpscanLink(c); };
  showCV('viewDetail');
}

function gpscanLink(c){
  return 'gpscan.html?grade='+encodeURIComponent(c.g)+'&sem='+encodeURIComponent(c.s)+'&unit='+encodeURIComponent(c.unit)+'&auto=1';
}

/* ============ 포토카드 갤러리 (GPS스타그램 스타일) ============ */
const GPS_LOGO = '<span class="gc-logo"><b class="l1">G</b><b class="l2">P</b><b class="l3">S</b><span class="l4">tagram</span></span>';
const GC_ACTIONS =
  '<div class="gc-act">'+
    '<span style="color:#ed4956">'+IG_ICON.heartFilled+'</span>'+
    '<span>'+IG_ICON.comment+'</span>'+
    '<span>'+IG_ICON.share+'</span>'+
    '<span class="bm">'+IG_ICON.bookmark+'</span>'+
  '</div>';

/* 생성 카드(또는 미리보기)의 GPS스타그램 크롬 HTML */
function gpsCardChrome(card){
  const hasPhoto = !!card.photo;
  const photo = hasPhoto
    ? '<div class="gc-photo"><img src="'+card.photo+'" alt="'+escapeHtml(card.title||'')+'" /></div>'
    : '<div class="gc-photo empty">사진을 넣어 주세요</div>';
  const title = escapeHtml(card.title||'제목');
  const desc  = escapeHtml(card.desc||'설명을 적어 주세요.');
  return ''+
    '<div class="gc-pad">'+
      '<div class="gc-top">'+GPS_LOGO+'<span class="gc-menu"><i></i><i></i><i></i></span></div>'+
      photo+
      GC_ACTIONS+
      '<div class="gc-cap"><b class="gc-title">'+title+'</b><span class="gc-us">_</span>'+desc+'</div>'+
    '</div>';
}

function renderGallery(){
  // 이달의 포토카드 (좋아요순 top4)
  const monthly=[...allCards()].sort((a,b)=>b.likes-a.likes).slice(0,4);
  const mWrap=document.getElementById('monthlyRow');
  mWrap.classList.add('gfeed');
  mWrap.innerHTML='';
  monthly.forEach(card=> mWrap.appendChild(photoCardEl(card,true)));

  // 영역 필터 적용된 피드
  const feed=document.getElementById('feed');
  feed.classList.add('gfeed');
  feed.innerHTML='';
  const list=allCards().filter(c=> curFilter==='전체' || c.area===curFilter);
  if(list.length===0){
    feed.classList.remove('gfeed');
    feed.innerHTML='<div class="empty">아직 이 영역의 포토카드가 없어요. 첫 번째 카드를 올려 보세요! 📸</div>';
    return;
  }
  list.forEach(card=> feed.appendChild(photoCardEl(card,false)));
}

function photoCardEl(card, monthly){
  const el=document.createElement('div');
  const del = (isAdmin && !card.seed)
    ? '<button class="pc-del" data-id="'+card.id+'">삭제</button>' : '';
  const badge = '';

  if(card.shot){
    // 예시 카드: 완성된 GPS스타그램 스크린샷을 그대로 표시
    el.className='gcard shot';
    el.innerHTML = badge + del + '<img class="gc-shot" src="'+card.shot+'" alt="'+escapeHtml(card.title)+'" loading="lazy" />';
  }else{
    // 학생이 만든 카드: GPS스타그램 크롬으로 렌더
    el.className='gcard';
    el.innerHTML = badge + del + gpsCardChrome(card);
  }

  const delBtn=el.querySelector('.pc-del');
  if(delBtn) delBtn.addEventListener('click', e=>{
    e.stopPropagation();
    if(confirm('이 포토카드를 삭제할까요?')){
      saveCards(loadCards().filter(x=>x.id!==card.id));
      renderGallery();
    }
  });
  return el;
}

function escapeHtml(s){ return (s||'').replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

/* ============ 포토카드 올리기 ============ */
function resetUpload(){
  pendingPhoto=null;
  document.getElementById('upPreview').innerHTML='<span class="ph">📷<br/>사진을 선택하세요</span>';
  document.getElementById('upConcept').value = curConcept ? curConcept.name : '';
  document.getElementById('upTitle').value='';
  document.getElementById('upDesc').value='';
  document.getElementById('upDone').classList.remove('show');
  document.getElementById('postBtn').style.display='';
  updateGcardPreview();
  validateUpload();
}
function updateGcardPreview(){
  const box=document.getElementById('gcardPreview');
  if(!box) return;
  box.innerHTML = '<div class="gcard">'+ gpsCardChrome({
    photo:pendingPhoto,
    title:document.getElementById('upTitle').value.trim(),
    desc:document.getElementById('upDesc').value.trim()
  }) +'</div>';
}
function validateUpload(){
  const ok = pendingPhoto && document.getElementById('upTitle').value.trim() && document.getElementById('upDesc').value.trim();
  document.getElementById('postBtn').disabled=!ok;
}

/* ---- 이벤트 ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  try{ account=JSON.parse(localStorage.getItem('gps_account')||'null'); }catch(_){}
  isAdmin = !!(account && /admin|관리자/i.test(account.id||''));
  if(account && account.id) document.getElementById('whoC').innerHTML='<b>'+escapeHtml(account.id)+'</b>님'+(isAdmin?' (관리자)':'');

  // 홈 버튼
  document.getElementById('toDict').addEventListener('click', ()=>{ renderDict(); showCV('viewDict'); });
  document.getElementById('toGallery').addEventListener('click', ()=>{ curFilter='전체'; syncFilterUI(); renderGallery(); showCV('viewGallery'); });

  // 뒤로 가기
  document.getElementById('dictBack').addEventListener('click', ()=> showCV('viewHome'));
  document.getElementById('detailBack').addEventListener('click', ()=> showCV('viewDict'));
  document.getElementById('galleryBack').addEventListener('click', ()=> showCV('viewHome'));
  document.getElementById('uploadBack').addEventListener('click', ()=> showCV('viewGallery'));

  // 상세: 포토카드 만들기 → 홈페이지 내 올리기 화면으로 바로 이동
  document.getElementById('makePhoto').addEventListener('click', ()=>{ resetUpload(); showCV('viewUpload'); });

  // 갤러리: 영역 필터
  document.querySelectorAll('#areaFilter .chip').forEach(ch=>{
    ch.addEventListener('click', ()=>{ curFilter=ch.dataset.area; syncFilterUI(); renderGallery(); });
  });
  // 갤러리: 올리기
  document.getElementById('toUpload').addEventListener('click', ()=>{ curConcept=null; resetUpload(); showCV('viewUpload'); });

  // 업로드: 파일 선택
  const fileInput=document.getElementById('upFile');
  document.getElementById('upPreview').addEventListener('click', ()=> fileInput.click());
  fileInput.addEventListener('change', e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{ pendingPhoto=ev.target.result;
      document.getElementById('upPreview').innerHTML='<img src="'+pendingPhoto+'" alt="미리보기" />';
      updateGcardPreview();
      validateUpload();
    };
    r.readAsDataURL(f);
  });
  ['upTitle','upDesc'].forEach(id=> document.getElementById(id).addEventListener('input', ()=>{ updateGcardPreview(); validateUpload(); }));

  // 업로드: 게시하기
  document.getElementById('postBtn').addEventListener('click', ()=>{
    if(document.getElementById('postBtn').disabled) return;
    const conceptName=document.getElementById('upConcept').value.trim()||'수학';
    const matched=CONCEPTS.find(c=>c.name===conceptName);
    const card={
      id:'pc'+Date.now(),
      concept:conceptName,
      area: matched ? matched.area : '수와 연산',
      title:document.getElementById('upTitle').value.trim(),
      desc:document.getElementById('upDesc').value.trim(),
      photo:pendingPhoto, likes:0,
      author: account&&account.id ? account.id : '학생',
      at:Date.now()
    };
    const arr=loadCards(); arr.unshift(card); saveCards(arr);
    document.getElementById('postBtn').style.display='none';
    document.getElementById('upDone').classList.add('show');
    // 안내 문구 클릭 시 이동할 GPS'CAN 링크
    document.getElementById('upToGpscan').onclick=()=>{
      location.href = matched ? gpscanLink(matched) : 'gpscan.html';
    };
  });

  // 시작 파라미터: ?view=gallery 또는 ?concept=id
  const q=new URLSearchParams(location.search);
  if(q.get('view')==='gallery'){ renderGallery(); showCV('viewGallery'); }
  else if(q.get('concept')){ const c=CONCEPTS.find(x=>x.id===q.get('concept')); if(c){ renderDict(); openDetail(c); } }
});

function syncFilterUI(){
  document.querySelectorAll('#areaFilter .chip').forEach(ch=> ch.classList.toggle('on', ch.dataset.area===curFilter));
}
