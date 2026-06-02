/* ===========================================================
   수학일기 (수학일기 쓰기 + 갤러리 + 상세보기)
   - THEMES: 계절/기념일 기반 주간 주제 (교사 수정 가능)
   - 학생 일기는 localStorage(gps_diaries)에 저장
   - 좋아요: gps_diary_likes / 댓글: gps_diary_comments
   - 관리자(id에 admin/관리자 포함)는 모든 댓글 수정·삭제 가능
   =========================================================== */

/* 영역별 색/배경 (주제 히어로, 카드 커버) */
const AREA_BG = {
  '수와 연산':     'linear-gradient(135deg,#FFE7DF,#FFD3C6)',
  '도형과 측정':   'linear-gradient(135deg,#DDF0FD,#C4E2FB)',
  '변화와 관계':   'linear-gradient(135deg,#E1F5EA,#C7EBD6)',
  '자료와 가능성': 'linear-gradient(135deg,#FCEBCF,#FAD9A6)'
};

/* 학기 주간 주제 (3월~7월, 매월 4주) — 계절·기념일 기반 */
const THEMES = {
  3: [
    { em:'🇰🇷', area:'도형과 측정', title:'태극기 속 숨은 도형', learn:'평면도형', unit:'평면도형',
      desc:'삼일절을 맞아 태극기를 펼쳐 보면 원, 사각형, 막대 같은 도형이 숨어 있어요. 태극기 속 도형을 찾아볼까요?',
      guide:'태극기에서 찾은 도형의 이름과 개수를 적고, 왜 그렇게 생각했는지 써 보세요.',
      q1:'태극기에서 어떤 도형을 찾았나요?', q2:'그 도형은 몇 개였고, 어떤 특징이 있었나요?' },
    { em:'📐', area:'도형과 측정', title:'내 책상 둘레는 몇 cm?', learn:'길이와 둘레', unit:'길이 재기',
      desc:'새 학기, 새 책상! 내 책상의 둘레는 얼마나 될까요? 직접 재어 보고 어림한 값과 비교해 봐요.',
      guide:'책상의 가로·세로를 재고 둘레를 구한 과정을 적어 보세요.',
      q1:'책상의 가로와 세로는 각각 몇 cm였나요?', q2:'둘레를 어떻게 구했고, 어림과 얼마나 달랐나요?' },
    { em:'🍬', area:'수와 연산', title:'사탕을 똑같이 나누면', learn:'나눗셈', unit:'나눗셈',
      desc:'화이트데이! 사탕을 친구들에게 똑같이 나누어 주려면 어떻게 해야 할까요?',
      guide:'사탕의 개수와 친구 수를 정하고, 똑같이 나눈 과정을 적어 보세요.',
      q1:'사탕은 모두 몇 개이고 몇 명에게 나누었나요?', q2:'한 명이 몇 개씩 받았고, 남은 사탕은 있었나요?' },
    { em:'🌸', area:'도형과 측정', title:'꽃잎 속 대칭 찾기', learn:'대칭', unit:'평면도형',
      desc:'봄꽃이 피기 시작했어요. 꽃잎을 반으로 접으면 똑같이 겹쳐질까요? 꽃에서 대칭을 찾아봐요.',
      guide:'관찰한 꽃의 꽃잎 수와, 대칭이 되는지 적어 보세요.',
      q1:'어떤 꽃을 관찰했고 꽃잎은 몇 장이었나요?', q2:'꽃잎은 대칭이었나요? 어떻게 확인했나요?' }
  ],
  4: [
    { em:'🤥', area:'수와 연산', title:'거짓말 속 진짜 숫자', learn:'큰 수', unit:'큰 수',
      desc:'만우절이에요! 친구에게 들은 엉뚱한 숫자, 정말 그만큼 클까요? 큰 수를 어림해 봐요.',
      guide:'들었던 과장된 숫자를 적고, 진짜로는 얼마쯤일지 어림해 보세요.',
      q1:'어떤 과장된 숫자를 들었나요?', q2:'실제로는 얼마쯤일지 어떻게 어림했나요?' },
    { em:'🌳', area:'변화와 관계', title:'나무 심는 간격의 규칙', learn:'규칙 찾기', unit:'규칙과 대응',
      desc:'식목일! 나무를 일정한 간격으로 심으면 어떤 규칙이 생길까요? 나무 수와 간격의 관계를 찾아봐요.',
      guide:'나무 수와 간격 사이의 규칙을 표로 정리해 보세요.',
      q1:'나무를 몇 그루, 몇 m 간격으로 심었나요?', q2:'나무 수와 간격 사이에 어떤 규칙이 있었나요?' },
    { em:'🚀', area:'도형과 측정', title:'로켓 발사까지 남은 시간', learn:'시각과 시간', unit:'시각과 시간',
      desc:'과학의 날! 로켓 발사 시각이 정해졌어요. 지금부터 발사까지 남은 시간을 계산해 봐요.',
      guide:'현재 시각과 발사 시각을 정하고, 남은 시간을 구한 과정을 적어 보세요.',
      q1:'지금 시각과 발사 예정 시각은 언제인가요?', q2:'남은 시간을 어떻게 구했나요?' },
    { em:'🍱', area:'수와 연산', title:'도시락 칸을 분수로', learn:'분수', unit:'분수',
      desc:'봄 소풍 도시락! 칸을 나누어 반찬을 담으면 한 칸은 전체의 얼마일까요? 분수로 나타내 봐요.',
      guide:'도시락이 몇 칸인지, 한 칸이 전체의 얼마인지 분수로 적어 보세요.',
      q1:'도시락은 모두 몇 칸이었나요?', q2:'한 칸은 전체의 얼마인가요? 분수로 어떻게 나타냈나요?' }
  ],
  5: [
    { em:'🎡', area:'도형과 측정', title:'놀이공원 대기 시간 계산', learn:'시각과 시간', unit:'시각과 시간',
      desc:'어린이날, 놀이공원에 갔어요! 줄을 서서 기다린 시간은 모두 얼마나 될까요?',
      guide:'각 놀이기구를 기다린 시간을 적고, 모두 더해 보세요.',
      q1:'어떤 놀이기구를 몇 분씩 기다렸나요?', q2:'기다린 시간을 모두 더하면 몇 시간 몇 분인가요?' },
    { em:'🌹', area:'수와 연산', title:'카네이션 꽃잎 세기', learn:'곱셈', unit:'곱셈',
      desc:'어버이날, 카네이션을 만들었어요. 꽃 한 송이의 꽃잎이 같다면 모두 몇 장일까요? 곱셈으로 구해 봐요.',
      guide:'꽃 한 송이의 꽃잎 수와 송이 수를 정하고, 곱셈으로 구해 보세요.',
      q1:'꽃 한 송이에 꽃잎은 몇 장이고, 몇 송이를 만들었나요?', q2:'전체 꽃잎 수를 곱셈으로 어떻게 구했나요?' },
    { em:'💌', area:'도형과 측정', title:'감사 카드 둘레 꾸미기', learn:'둘레', unit:'길이 재기',
      desc:'스승의 날! 감사 카드의 둘레를 색 테이프로 꾸미려고 해요. 테이프는 얼마나 필요할까요?',
      guide:'카드의 가로·세로를 재고 둘레를 구해, 필요한 테이프 길이를 적어 보세요.',
      q1:'카드의 가로와 세로는 몇 cm였나요?', q2:'둘레는 얼마이고, 테이프는 얼마나 필요한가요?' },
    { em:'📊', area:'자료와 가능성', title:'키가 자란 만큼 그래프로', learn:'막대그래프', unit:'자료의 정리',
      desc:'봄 동안 키가 얼마나 자랐을까요? 우리 가족 또는 친구들의 키를 막대그래프로 나타내 봐요.',
      guide:'키를 조사한 자료를 표로 정리하고, 막대그래프로 나타내 보세요.',
      q1:'누구의 키를 조사했고 값은 얼마였나요?', q2:'막대그래프로 나타내니 무엇을 알 수 있었나요?' }
  ],
  6: [
    { em:'♻️', area:'자료와 가능성', title:'분리수거 통계 내기', learn:'표와 그래프', unit:'자료의 정리',
      desc:'환경의 날! 우리 집 일주일 분리수거를 종류별로 세어 표와 그래프로 정리해 봐요.',
      guide:'종류별 개수를 표로 정리하고, 가장 많은 것과 적은 것을 적어 보세요.',
      q1:'분리수거 종류별로 몇 개씩 나왔나요?', q2:'가장 많은 것과 적은 것은 무엇이었나요?' },
    { em:'⭕', area:'도형과 측정', title:'태극무늬 속 원', learn:'원', unit:'원',
      desc:'현충일을 맞아 태극기를 다시 봐요. 가운데 태극무늬는 원으로 이루어져 있어요. 원의 중심과 반지름을 찾아봐요.',
      guide:'태극무늬에서 원의 중심·반지름·지름을 찾아 적어 보세요.',
      q1:'태극무늬에서 원을 어떻게 찾았나요?', q2:'원의 중심과 반지름은 어디였나요?' },
    { em:'🪭', area:'도형과 측정', title:'부채를 펼친 각도', learn:'각도', unit:'각도',
      desc:'단오에는 부채를 부쳐요. 부채를 펼치면 얼마만큼의 각이 만들어질까요? 각도를 재어 봐요.',
      guide:'부채를 다르게 펼쳤을 때 각도를 재어 비교해 보세요.',
      q1:'부채를 펼친 각도는 몇 도였나요?', q2:'더 펼치거나 덜 펼치면 각도는 어떻게 달라졌나요?' },
    { em:'🍉', area:'수와 연산', title:'수박을 똑같이 자르기', learn:'분수(등분)', unit:'분수',
      desc:'여름이 다가와요! 수박을 가족이 똑같이 나누어 먹으려면 몇 조각으로 잘라야 할까요?',
      guide:'수박을 똑같이 나눈 조각 수와, 한 조각이 전체의 얼마인지 적어 보세요.',
      q1:'수박을 몇 조각으로 똑같이 잘랐나요?', q2:'한 조각은 전체의 얼마인가요? 분수로 나타내 보세요.' }
  ],
  7: [
    { em:'☔', area:'자료와 가능성', title:'비 온 날을 그래프로', learn:'막대그래프', unit:'자료의 정리',
      desc:'장마철이에요. 일주일 동안 비가 온 날과 오지 않은 날을 조사해 그래프로 나타내 봐요.',
      guide:'요일별 날씨를 조사해 표로 정리하고 막대그래프로 나타내 보세요.',
      q1:'일주일 중 비 온 날은 며칠이었나요?', q2:'그래프로 나타내니 어떤 점을 알 수 있었나요?' },
    { em:'🍦', area:'변화와 관계', title:'아이스크림 가격의 규칙', learn:'규칙과 대응', unit:'규칙과 대응',
      desc:'한여름! 아이스크림을 1개, 2개, 3개 살 때 가격은 어떻게 변할까요? 개수와 가격의 규칙을 찾아봐요.',
      guide:'개수에 따른 가격을 표로 정리하고 규칙을 찾아 보세요.',
      q1:'아이스크림 1개의 가격은 얼마였나요?', q2:'개수와 가격 사이에 어떤 규칙이 있었나요?' },
    { em:'📅', area:'도형과 측정', title:'방학까지 며칠 남았을까?', learn:'달력과 시간', unit:'시각과 시간',
      desc:'여름방학이 코앞! 오늘부터 방학식까지 며칠 남았는지 달력을 보며 세어 봐요.',
      guide:'오늘 날짜와 방학식 날짜를 정하고, 남은 날수를 구한 과정을 적어 보세요.',
      q1:'오늘과 방학식은 각각 며칠인가요?', q2:'남은 날수를 어떻게 세었나요?' },
    { em:'🏖️', area:'도형과 측정', title:'모래성의 부피 어림하기', learn:'어림', unit:'어림하기',
      desc:'바닷가에서 모래성을 쌓았어요! 모래성에는 모래가 얼마나 들어갔을까요? 크기를 어림해 봐요.',
      guide:'모래성의 크기를 어림하고, 어떻게 어림했는지 적어 보세요.',
      q1:'모래성의 크기를 어떻게 어림했나요?', q2:'어림한 값은 얼마였고, 왜 그렇게 생각했나요?' }
  ]
};

const MONTH_MIN = 3, MONTH_MAX = 7, YEAR = 2026;

/* 갤러리 시드 일기 (예시) */
const SEED_DIARIES = [
  { id:'sd1', seed:true, area:'도형과 측정', em:'✍️', title:'한글에 도형이 있다고?',
    learn:'평면도형', unit:'평면도형', book:'3-1', name:'서연',
    q1label:'오늘 발견한 수학은 무엇인가요?', q2label:'그래서 어떤 생각이 들었나요?',
    a1:'한글날에 자음과 모음을 자세히 봤더니 ㅁ은 사각형, ㅇ은 원이었다. 받침까지 보니 글자 하나에 도형이 가득했다.',
    a2:'글자가 사실은 도형으로 이루어져 있다는 게 신기했다. 다음엔 ㅂ과 ㅎ이 무슨 도형인지 더 찾아보고 싶다.',
    likes:312 },
  { id:'sd2', seed:true, area:'수와 연산', em:'🍉', title:'수박을 똑같이 8조각',
    learn:'분수(등분)', unit:'분수', book:'3-1', name:'도윤',
    q1label:'수박을 몇 조각으로 똑같이 잘랐나요?', q2label:'한 조각은 전체의 얼마인가요?',
    a1:'가족이 네 명이라 한 사람이 두 조각씩 먹으려고 수박을 똑같이 8조각으로 잘랐다.',
    a2:'한 조각은 전체의 8분의 1이었다. 똑같이 나누지 않으면 누구는 손해를 본다는 걸 알았다.',
    likes:204 },
  { id:'sd3', seed:true, area:'자료와 가능성', em:'♻️', title:'우리 집 분리수거 통계',
    learn:'표와 그래프', unit:'자료의 정리', book:'4-2', name:'하준',
    q1label:'분리수거 종류별로 몇 개씩 나왔나요?', q2label:'가장 많은 것과 적은 것은?',
    a1:'일주일 동안 플라스틱 14개, 종이 9개, 캔 5개, 유리 2개가 나왔다. 표로 정리하니 한눈에 보였다.',
    a2:'플라스틱이 가장 많고 유리가 가장 적었다. 플라스틱을 덜 쓰는 방법을 가족과 이야기했다.',
    likes:176 },
  { id:'sd4', seed:true, area:'도형과 측정', em:'📅', title:'방학까지 며칠 남았을까?',
    learn:'달력과 시간', unit:'시각과 시간', book:'2-2', name:'지우',
    q1label:'오늘과 방학식은 각각 며칠인가요?', q2label:'남은 날수를 어떻게 세었나요?',
    a1:'오늘은 7월 7일, 방학식은 7월 25일이다. 달력에서 날짜를 하나씩 짚어가며 세어 봤다.',
    a2:'방학까지 18일 남았다. 주말을 빼면 학교 가는 날은 13일뿐이라 더 신났다.',
    likes:289 }
];

/* 시드 일기 기본 댓글 */
const SEED_COMMENTS = {
  sd1: [
    { id:'c-sd1-1', name:'민서', text:'와 진짜 ㅁ이 사각형이네! 나도 내 이름으로 찾아볼래 😆', admin:false, at:1 },
    { id:'c-sd1-2', name:'이선생', text:'관찰을 정말 꼼꼼하게 했구나. ㅂ은 사각형이 두 개랍니다!', admin:true, at:2 }
  ],
  sd2: [
    { id:'c-sd2-1', name:'유나', text:'8분의 1 설명이 깔끔해요!', admin:false, at:1 }
  ],
  sd3: [
    { id:'c-sd3-1', name:'준호', text:'우리 집도 플라스틱이 제일 많을 것 같아요.', admin:false, at:1 }
  ]
};

/* ---- 상태 ---- */
let curTheme = null;     // 현재 선택한 주제
let curDiary = null;     // 현재 보는 일기
let writeMode = 'theme'; // 'theme' | 'share'
let pendingPhoto = null;
let calMonth = 6;        // 표시 중인 달
let account = null;
let isAdmin = false;

/* ---- 뷰 전환 ---- */
const DV = ['viewHome','viewCalendar','viewTheme','viewWrite','viewGallery','viewDetail'];
function showDV(id){
  DV.forEach(v=> document.getElementById(v).classList.toggle('active', v===id));
  window.scrollTo(0,0);
}

/* ---- 저장/로드 ---- */
function loadDiaries(){ try{ return JSON.parse(localStorage.getItem('gps_diaries')||'[]'); }catch(_){ return []; } }
function saveDiaries(a){ try{ localStorage.setItem('gps_diaries', JSON.stringify(a)); }catch(_){} }
function allDiaries(){ return [...loadDiaries(), ...SEED_DIARIES]; }
function findDiary(id){ return allDiaries().find(d=>d.id===id); }

function loadLikes(){ try{ return JSON.parse(localStorage.getItem('gps_diary_likes')||'{}'); }catch(_){ return {}; } }
function saveLikes(o){ try{ localStorage.setItem('gps_diary_likes', JSON.stringify(o)); }catch(_){} }
function likeCount(d){ const l=loadLikes(); return (d.likes||0) + (l[d.id]?1:0); }
function isLiked(id){ return !!loadLikes()[id]; }

function loadComments(){ try{ return JSON.parse(localStorage.getItem('gps_diary_comments')||'{}'); }catch(_){ return {}; } }
function saveComments(o){ try{ localStorage.setItem('gps_diary_comments', JSON.stringify(o)); }catch(_){} }
function commentsFor(id){
  const store=loadComments();
  if(store[id]) return store[id];
  return SEED_COMMENTS[id] ? SEED_COMMENTS[id].slice() : [];
}
function setComments(id, arr){ const store=loadComments(); store[id]=arr; saveComments(store); }
function commentCount(id){ return commentsFor(id).length; }

function escapeHtml(s){ return (s||'').replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

/* ---- 토스트 ---- */
let tHide;
function showToast(msg, emoji){
  const t=document.getElementById('toast');
  document.querySelector('#toast .em').textContent = emoji||'🎉';
  document.getElementById('toastTxt').textContent = msg;
  t.classList.add('show');
  clearTimeout(tHide); tHide=setTimeout(()=>t.classList.remove('show'), 2600);
}

/* ============ 달력 ============ */
/* 주차별 색상 (빨강→주황→노랑→초록→파랑→보라) */
const WEEK_COLORS = [
  { deep:'#CF5F55', bg:'#FAE2DF' },
  { deep:'#C9803C', bg:'#FBE6D0' },
  { deep:'#B08A1E', bg:'#F7EDC2' },
  { deep:'#4F9A53', bg:'#DCEFD0' },
  { deep:'#3787A8', bg:'#D4E9F0' },
  { deep:'#8A5FC0', bg:'#E9DCF6' }
];
function themeFor(month, weekIdx){
  const arr=THEMES[month]||[];
  return arr[weekIdx] || null;
}
function renderCalendar(){
  document.getElementById('calYM').textContent = YEAR+'년 '+calMonth+'월';
  document.getElementById('calPrev').disabled = (calMonth<=MONTH_MIN);
  document.getElementById('calNext').disabled = (calMonth>=MONTH_MAX);

  const first=new Date(YEAR, calMonth-1, 1);
  const startDow=first.getDay();                 // 0=일
  const daysInMonth=new Date(YEAR, calMonth, 0).getDate();
  const prevDays=new Date(YEAR, calMonth-1, 0).getDate();

  const today=new Date();
  const isThisMonth = (today.getFullYear()===YEAR && (today.getMonth()+1)===calMonth);
  const todayDate = today.getDate();

  // 셀 배열 (앞쪽 빈칸은 이전 달 날짜)
  const cells=[];
  for(let i=0;i<startDow;i++) cells.push({ d: prevDays-startDow+1+i, out:true });
  for(let d=1;d<=daysInMonth;d++) cells.push({ d, out:false });
  while(cells.length%7!==0) cells.push({ d: cells.length-(startDow+daysInMonth)+1, out:true });

  const rows=[];
  for(let i=0;i<cells.length;i+=7) rows.push(cells.slice(i,i+7));

  const wrap=document.getElementById('weekRows');
  wrap.innerHTML='';
  rows.forEach((row, ri)=>{
    let theme=themeFor(calMonth, ri);
    let weekLabel=calMonth+'월 '+(ri+1)+'주차';
    // 달의 끝에 걸친 주(다음 달 1일을 포함)는 사실 '다음 달 1주차'와 같은 주간이므로
    // 빈칸으로 '준비 중'을 띄우지 말고, 다음 달 1주차 주제를 그대로 보여 준다.
    if(!theme){
      const startsNextMonth = row.some(c=> c.out && c.d===1);
      if(startsNextMonth){
        const nextTheme=themeFor(calMonth+1, 0);
        if(nextTheme){ theme=nextTheme; weekLabel=(calMonth+1)+'월 1주차'; }
      }
    }

    const dayCells=row.map(c=>{
      const cls=['day'];
      const dow=row.indexOf(c);
      if(c.out) cls.push('out');
      if(dow===0) cls.push('sun'); if(dow===6) cls.push('sat');
      if(!c.out && isThisMonth && c.d===todayDate) cls.push('today');
      return '<span class="'+cls.join(' ')+'">'+c.d+'</span>';
    }).join('');

    let chip;
    if(theme){
      chip='<div class="theme-chip">'+
             '<span class="em">'+theme.em+'</span>'+
             '<span class="tt"><b>'+escapeHtml(theme.title)+'</b><span>'+escapeHtml(theme.area)+'</span></span>'+
             '<span class="arr">›</span>'+
           '</div>';
    } else {
      chip='<div class="theme-chip">이 주의 주제는 준비 중이에요 🌱</div>';
    }

    const rowEl=document.createElement('div');
    rowEl.className='week-row';
    const pal = WEEK_COLORS[ri % WEEK_COLORS.length];
    rowEl.style.setProperty('--wk', pal.deep);
    rowEl.style.setProperty('--wk-bg', pal.bg);
    rowEl.innerHTML='<div class="week-no">'+(ri+1)+'주</div>'+
      '<div class="week-box'+(theme?'':' empty')+'">'+
        '<div class="days">'+dayCells+'</div>'+ chip +
      '</div>';
    if(theme){
      const box=rowEl.querySelector('.week-box');
      box.addEventListener('click', ()=> openTheme(theme, weekLabel));
    }
    wrap.appendChild(rowEl);
  });
}

/* ============ 주제 상세 ============ */
function openTheme(theme, weekLabel){
  curTheme=theme;
  document.getElementById('themeHero').style.background = AREA_BG[theme.area]||'var(--diary-soft)';
  document.getElementById('themeEm').textContent=theme.em;
  document.getElementById('themeArea').textContent=theme.area;
  document.getElementById('themeWeek').textContent=weekLabel||'';
  document.getElementById('themeTitle').textContent=theme.title;
  document.getElementById('themeDesc').textContent=theme.desc;
  document.getElementById('themeGuide').textContent=theme.guide;
  showDV('viewTheme');
}

/* ============ 일기 쓰기 ============ */
function resetWrite(){
  pendingPhoto=null;
  document.getElementById('wDrop').innerHTML='<span class="ph">📷<br/>그림이나 사진을 넣어 보세요<br/><small>(캔바에서 만든 일기 이미지도 좋아요)</small></span>';
  ['wTitle','wA1','wA2','wBook'].forEach(id=> document.getElementById(id).value='');
  document.getElementById('wName').value = account&&account.id ? account.id : '';
  document.getElementById('writeDone').classList.remove('show');
  document.querySelector('#viewWrite .tpl').style.display='';

  if(writeMode==='theme' && curTheme){
    document.getElementById('writeHead').textContent=curTheme.title;
    document.getElementById('writeSub').textContent='주제에 맞춰 오늘의 수학 이야기를 적어 보세요.';
    document.getElementById('wLearn').value=curTheme.learn||'';
    document.getElementById('wUnit').value=curTheme.unit||'';
    document.getElementById('wTitle').value=curTheme.title;
    document.getElementById('wTitle').placeholder=curTheme.title;
    document.getElementById('q1label').textContent=curTheme.q1;
    document.getElementById('q2label').textContent=curTheme.q2;
  } else {
    document.getElementById('writeHead').textContent='나의 수학일기 공유하기';
    document.getElementById('writeSub').textContent='제목과 내용을 적고, 일기 이미지를 올려 친구들과 공유해요.';
    document.getElementById('wLearn').value='';
    document.getElementById('wUnit').value='';
    document.getElementById('wTitle').placeholder='예: 한글에 도형이 있다고?';
    document.getElementById('q1label').textContent='오늘 발견한 수학은 무엇인가요?';
    document.getElementById('q2label').textContent='그래서 어떤 생각이 들었나요?';
  }
  validateWrite();
}
function validateWrite(){
  const ok = document.getElementById('wTitle').value.trim() && document.getElementById('wA1').value.trim();
  document.getElementById('postBtn').disabled=!ok;
}
function submitDiary(){
  if(document.getElementById('postBtn').disabled) return;
  const area = curTheme ? curTheme.area : '수와 연산';
  const em   = curTheme ? curTheme.em : (pendingPhoto?'📷':'📔');
  const diary={
    id:'di'+Date.now(),
    area, em,
    title:document.getElementById('wTitle').value.trim(),
    learn:document.getElementById('wLearn').value.trim(),
    unit:document.getElementById('wUnit').value.trim(),
    book:document.getElementById('wBook').value.trim(),
    name:document.getElementById('wName').value.trim()||'학생',
    q1label:document.getElementById('q1label').textContent,
    q2label:document.getElementById('q2label').textContent,
    a1:document.getElementById('wA1').value.trim(),
    a2:document.getElementById('wA2').value.trim(),
    photo:pendingPhoto, likes:0, at:Date.now()
  };
  const arr=loadDiaries(); arr.unshift(diary); saveDiaries(arr);
  document.querySelector('#viewWrite .tpl').style.display='none';
  document.getElementById('writeDone').classList.add('show');
  showToast('일기를 친구들과 공유하였습니다!', '🎉');
}

/* ============ 갤러리 ============ */
const HEART_SVG='<svg viewBox="0 0 24 24" fill="#ee6db0" stroke="#ee6db0" stroke-width="1.6" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
const COMMENT_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="#9a8f76" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><path d="M20.7 11.5a8.4 8.4 0 0 1-11.8 7.7L3 21l1.9-5.8A8.4 8.4 0 1 1 20.7 11.5z"/></svg>';

function renderGallery(){
  const list=allDiaries();
  document.getElementById('galCount').textContent='모두 '+list.length+'편';
  const grid=document.getElementById('diaryGrid');
  grid.innerHTML='';
  if(list.length===0){
    grid.innerHTML='<div class="empty-gal">아직 일기가 없어요. 첫 번째 수학일기를 써 볼까요? ✏️</div>';
    return;
  }
  list.forEach(d=>{
    const cover = d.photo
      ? '<img src="'+d.photo+'" alt="'+escapeHtml(d.title)+'" loading="lazy" />'
      : '<span class="big-em">'+(d.em||'📔')+'</span>';
    const bg = d.photo ? '' : ' style="background:'+(AREA_BG[d.area]||'var(--diary-soft)')+'"';
    const card=document.createElement('div');
    card.className='dcard';
    card.innerHTML=
      '<div class="dcard-thumb"'+bg+'>'+
        '<span class="area-badge">'+escapeHtml(d.area)+'</span>'+ cover +
      '</div>'+
      '<div class="dcard-body">'+
        '<h3>'+escapeHtml(d.title)+'</h3>'+
        '<div class="dcard-meta">'+
          '<span class="like">'+HEART_SVG+likeCount(d)+'</span>'+
          '<span class="like">'+COMMENT_SVG+commentCount(d.id)+'</span>'+
          '<span>· '+escapeHtml(d.name||'학생')+'</span>'+
        '</div>'+
      '</div>';
    card.addEventListener('click', ()=> openDiary(d.id));
    grid.appendChild(card);
  });
}

/* ============ 일기 상세보기 ============ */
function openDiary(id){
  const d=findDiary(id); if(!d) return;
  curDiary=d;
  document.getElementById('dpArea').textContent=d.area;
  document.getElementById('dpTitle').textContent=d.title;
  document.getElementById('dpBy').textContent=(d.name||'학생')+' 학생의 수학일기';

  const slot=document.getElementById('dpImgSlot');
  if(d.photo){
    slot.innerHTML='<img class="dp-img" src="'+d.photo+'" alt="'+escapeHtml(d.title)+'" />';
  } else {
    slot.innerHTML='<div class="dp-img em" style="background:'+(AREA_BG[d.area]||'var(--diary-soft)')+'">'+(d.em||'📔')+'</div>';
  }

  const pills=[];
  if(d.learn) pills.push('학습내용 · '+escapeHtml(d.learn));
  if(d.unit)  pills.push('단원 · '+escapeHtml(d.unit));
  if(d.book)  pills.push('교과서 · '+escapeHtml(d.book));
  document.getElementById('dpMetaRow').innerHTML = pills.map(p=>'<span class="pill">'+p+'</span>').join('');

  let body='';
  body+='<div class="dp-num"><div class="n">1</div><div><p class="qlabel">'+escapeHtml(d.q1label||'')+'</p><p>'+escapeHtml(d.a1||'')+'</p></div></div>';
  if(d.a2) body+='<div class="dp-num"><div class="n">2</div><div><p class="qlabel">'+escapeHtml(d.q2label||'')+'</p><p>'+escapeHtml(d.a2)+'</p></div></div>';
  document.getElementById('dpBody').innerHTML=body;

  // 좋아요
  const likeBtn=document.getElementById('likeBtn');
  likeBtn.classList.toggle('on', isLiked(d.id));
  document.getElementById('likeTxt').textContent='좋아요 '+likeCount(d);

  renderComments(d.id);
  showDV('viewDetail');
}

function toggleLike(){
  if(!curDiary) return;
  const l=loadLikes(); l[curDiary.id]=!l[curDiary.id]; if(!l[curDiary.id]) delete l[curDiary.id];
  saveLikes(l);
  document.getElementById('likeBtn').classList.toggle('on', isLiked(curDiary.id));
  document.getElementById('likeTxt').textContent='좋아요 '+likeCount(curDiary);
}

/* ---- 댓글 ---- */
function renderComments(id){
  const list=commentsFor(id);
  document.getElementById('cCount').textContent=list.length;
  const wrap=document.getElementById('cList');
  if(list.length===0){
    wrap.innerHTML='<div class="c-empty">아직 댓글이 없어요. 첫 번째 댓글을 남겨 주세요! 💬</div>';
    return;
  }
  wrap.innerHTML='';
  list.forEach((c, i)=>{
    const canManage = isAdmin || (c.mine===true);
    const item=document.createElement('div');
    item.className='c-item';
    item.innerHTML=
      '<div class="c-ava">'+(c.admin?'🧑‍🏫':'🙂')+'</div>'+
      '<div class="c-bub">'+
        '<div class="c-name">'+escapeHtml(c.name||'학생')+(c.admin?'<span class="adm">선생님</span>':'')+'</div>'+
        '<div class="c-text">'+escapeHtml(c.text)+'</div>'+
        (canManage?'<div class="c-tools"><button class="edit">수정</button><button class="del">삭제</button></div>':'')+
      '</div>';
    if(canManage){
      const bub=item.querySelector('.c-bub');
      item.querySelector('.edit').addEventListener('click', ()=> startEditComment(id, i, bub, c));
      item.querySelector('.del').addEventListener('click', ()=>{
        if(confirm('이 댓글을 삭제할까요?')){
          const arr=commentsFor(id).slice(); arr.splice(i,1); setComments(id,arr);
          renderComments(id);
        }
      });
    }
    wrap.appendChild(item);
  });
}
function startEditComment(id, idx, bub, c){
  bub.querySelector('.c-text').outerHTML='<textarea class="c-edit">'+escapeHtml(c.text)+'</textarea>';
  bub.querySelector('.c-tools').innerHTML='<button class="save">저장</button><button class="cancel">취소</button>';
  const ta=bub.querySelector('.c-edit'); ta.focus();
  bub.querySelector('.save').addEventListener('click', ()=>{
    const v=ta.value.trim(); if(!v){ ta.focus(); return; }
    const arr=commentsFor(id).slice(); arr[idx]={...arr[idx], text:v}; setComments(id,arr);
    renderComments(id);
  });
  bub.querySelector('.cancel').addEventListener('click', ()=> renderComments(id));
}
function addComment(){
  if(!curDiary) return;
  const input=document.getElementById('cInput');
  const v=input.value.trim(); if(!v) return;
  const arr=commentsFor(curDiary.id).slice();
  arr.push({
    id:'c'+Date.now(),
    name: account&&account.id ? account.id : '학생',
    text:v, admin:isAdmin, mine:true, at:Date.now()
  });
  setComments(curDiary.id, arr);
  input.value=''; document.getElementById('cSubmit').disabled=true;
  renderComments(curDiary.id);
}

/* ============ 이벤트 바인딩 ============ */
document.addEventListener('DOMContentLoaded', ()=>{
  try{ account=JSON.parse(localStorage.getItem('gps_account')||'null'); }catch(_){}
  isAdmin = !!(account && /admin|관리자/i.test(account.id||''));
  if(account && account.id) document.getElementById('whoD').innerHTML='<b>'+escapeHtml(account.id)+'</b>님'+(isAdmin?' (관리자)':'');

  // 홈
  document.getElementById('toCalendar').addEventListener('click', ()=>{ calMonth=6; renderCalendar(); showDV('viewCalendar'); });
  document.getElementById('toGalleryHome').addEventListener('click', ()=>{ renderGallery(); showDV('viewGallery'); });

  // 달력
  document.getElementById('calBack').addEventListener('click', ()=> showDV('viewHome'));
  document.getElementById('calPrev').addEventListener('click', ()=>{ if(calMonth>MONTH_MIN){ calMonth--; renderCalendar(); } });
  document.getElementById('calNext').addEventListener('click', ()=>{ if(calMonth<MONTH_MAX){ calMonth++; renderCalendar(); } });

  // 주제 상세
  document.getElementById('themeBack').addEventListener('click', ()=> showDV('viewCalendar'));
  document.getElementById('startWrite').addEventListener('click', ()=>{ writeMode='theme'; resetWrite(); showDV('viewWrite'); });

  // 쓰기
  document.getElementById('writeBack').addEventListener('click', ()=>{
    showDV(writeMode==='theme' ? 'viewTheme' : 'viewGallery');
  });
  const wFile=document.getElementById('wFile'), wDrop=document.getElementById('wDrop');
  wDrop.addEventListener('click', ()=> wFile.click());
  wFile.addEventListener('change', e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{ pendingPhoto=ev.target.result; wDrop.innerHTML='<img src="'+pendingPhoto+'" alt="미리보기" />'; };
    r.readAsDataURL(f);
  });
  ['wTitle','wA1'].forEach(id=> document.getElementById(id).addEventListener('input', validateWrite));
  document.getElementById('postBtn').addEventListener('click', submitDiary);
  document.getElementById('doneToGallery').addEventListener('click', ()=>{ renderGallery(); showDV('viewGallery'); });

  // 갤러리
  document.getElementById('galleryBack').addEventListener('click', ()=> showDV('viewHome'));
  document.getElementById('shareCta').addEventListener('click', ()=>{ writeMode='share'; curTheme=null; resetWrite(); showDV('viewWrite'); });

  // 상세
  document.getElementById('detailBack').addEventListener('click', ()=>{ renderGallery(); showDV('viewGallery'); });
  document.getElementById('likeBtn').addEventListener('click', toggleLike);
  const cInput=document.getElementById('cInput');
  cInput.addEventListener('input', ()=>{ document.getElementById('cSubmit').disabled=!cInput.value.trim(); });
  cInput.addEventListener('keydown', e=>{ if(e.key==='Enter' && (e.metaKey||e.ctrlKey)) addComment(); });
  document.getElementById('cSubmit').addEventListener('click', addComment);

  // 시작 파라미터
  const q=new URLSearchParams(location.search);
  if(q.get('view')==='gallery'){ renderGallery(); showDV('viewGallery'); }
  else if(q.get('view')==='write'){ calMonth=6; renderCalendar(); showDV('viewCalendar'); }
});
