/* ===========================================================
   지피스캔 (GPS' CAN) — 풀이 활동 + 문제 만들기
   * curriculum / sel / showToast 는 gpscan.html 의 인라인 스크립트에서
     선언된 전역 바인딩을 그대로 사용합니다 (이 파일이 뒤에 로드됨).
   * 실제 서비스에서는 PROBLEMS 를 구글 스프레드시트(문장제 DB) 데이터로
     교체하면 됩니다. 데이터 구조:
       { q, goal:[질문조각], pieces:[조건조각...], op:'+|−|×|÷', sFeedback }
   =========================================================== */

/* ---- 샘플 문장제 데이터 (구글시트 연동 시 교체) ---- */
const PROBLEMS = [
  {
    q:"한 상자에 딸기가 25개씩 들어 있습니다. 14상자에 들어 있는 딸기는 모두 몇 개입니까?",
    goal:["딸기는 모두 몇 개입니까?"],
    pieces:["한 상자에 딸기가 25개씩 들어 있습니다.","14상자에 들어 있는"],
    op:"×",
    sFeedback:"한 상자(25개)가 14묶음 있으니 곱셈으로 구해요.  25 × 14 = 350(개)"
  },
  {
    q:"색종이 96장을 8명에게 똑같이 나누어 주려고 합니다. 한 명은 몇 장을 받게 됩니까?",
    goal:["한 명은 몇 장을 받게 됩니까?"],
    pieces:["색종이 96장을","8명에게 똑같이 나누어 주려고 합니다."],
    op:"÷",
    sFeedback:"96장을 8명에게 똑같이 나누니 나눗셈이에요.  96 ÷ 8 = 12(장)"
  },
  {
    q:"운동장에 학생이 138명 있었습니다. 잠시 후 56명이 더 왔습니다. 운동장에 있는 학생은 모두 몇 명입니까?",
    goal:["운동장에 있는 학생은 모두 몇 명입니까?"],
    pieces:["운동장에 학생이 138명 있었습니다.","잠시 후 56명이 더 왔습니다."],
    op:"+",
    sFeedback:"처음 인원에 더 온 인원을 합하니 덧셈이에요.  138 + 56 = 194(명)"
  },
  {
    q:"바구니에 사과가 84개 있었습니다. 그중 37개를 먹었습니다. 남은 사과는 몇 개입니까?",
    goal:["남은 사과는 몇 개입니까?"],
    pieces:["바구니에 사과가 84개 있었습니다.","그중 37개를 먹었습니다."],
    op:"−",
    sFeedback:"전체에서 먹은 양을 빼니 뺄셈이에요.  84 − 37 = 47(개)"
  },
  {
    q:"한 봉지에 사탕이 12개씩 들어 있습니다. 7봉지에 들어 있는 사탕은 모두 몇 개입니까?",
    goal:["사탕은 모두 몇 개입니까?"],
    pieces:["한 봉지에 사탕이 12개씩 들어 있습니다.","7봉지에 들어 있는"],
    op:"×",
    sFeedback:"한 봉지(12개)가 7묶음 있으니 곱셈이에요.  12 × 7 = 84(개)"
  },
  {
    q:"리본 150cm를 한 사람에게 30cm씩 나누어 주려고 합니다. 몇 명에게 나누어 줄 수 있습니까?",
    goal:["몇 명에게 나누어 줄 수 있습니까?"],
    pieces:["리본 150cm를","한 사람에게 30cm씩 나누어 주려고 합니다."],
    op:"÷",
    sFeedback:"150cm를 30cm씩 묶으니 나눗셈이에요.  150 ÷ 30 = 5(명)"
  }
];
const OPERATORS = ['+','−','×','÷'];

/* ---- 상태 ---- */
let problems = [];
let idx = 0;

/* ---- 뷰 전환 ---- */
const VIEWS = { select:'viewSelect', solve:'viewSolve', done:'viewDone', create1:'viewCreate1', create2:'viewCreate2' };
function showView(name){
  Object.values(VIEWS).forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.toggle('active', id===VIEWS[name]);
  });
  window.scrollTo(0,0);
}

/* ---- 활동 시작 ---- */
function startSolve(){
  problems = PROBLEMS.slice();         // (시트 연동 시 학년/학기/단원 + 출판사 제외 필터 적용)
  idx = 0;
  document.getElementById('unitChip').textContent = '🧭 ' + sel.grade + ' 〉 ' + sel.unit;
  showView('solve');
  renderProblem();
}

/* ---- 문제 한 개 렌더 ---- */
function renderProblem(){
  const p = problems[idx];
  document.getElementById('missionQ').textContent = p.q;
  document.getElementById('progress').textContent = '문제 ' + (idx+1) + ' / ' + problems.length;

  ['dzG','dzP','dzS','bagFrags','bagOps'].forEach(id=> document.getElementById(id).innerHTML='');

  // 문장 조각 (질문 + 조건) 섞어서 가방에
  const frags = shuffle([...p.goal, ...p.pieces]);
  const bagFrags = document.getElementById('bagFrags');
  frags.forEach(t=>{
    const c=document.createElement('div');
    c.className='chip frag'; c.textContent=t;
    c.dataset.type='frag'; c.dataset.text=t;
    makeDraggable(c); bagFrags.appendChild(c);
  });
  // 연산 기호
  const bagOps = document.getElementById('bagOps');
  OPERATORS.forEach(o=>{
    const c=document.createElement('div');
    c.className='chip op'; c.textContent=o;
    c.dataset.type='op'; c.dataset.op=o;
    makeDraggable(c); bagOps.appendChild(c);
  });

  // 피드백 초기화
  const fb=document.getElementById('feedback'); fb.textContent=''; fb.className='feedback';
  document.getElementById('sfeed').classList.remove('show');
  document.getElementById('nextBtn').classList.remove('show');
  document.getElementById('checkBtn').style.display='';
}

/* ---- 드래그 앤 드롭 (마우스 + 터치 공용 포인터) ---- */
let overZone=null;
function makeDraggable(chip){
  chip.addEventListener('pointerdown', e=>{
    if(chip.dataset.locked) return;
    e.preventDefault();
    const rect=chip.getBoundingClientRect();
    const offX=e.clientX-rect.left, offY=e.clientY-rect.top;
    const startX=e.clientX, startY=e.clientY;
    let moved=false;
    chip.setPointerCapture(e.pointerId);

    function move(ev){
      const dx=ev.clientX-startX, dy=ev.clientY-startY;
      if(!moved && Math.hypot(dx,dy)>5){
        moved=true;
        chip.classList.add('dragging');
        chip.style.position='fixed';
        chip.style.width=rect.width+'px';
        chip.style.zIndex=1000;
        chip.style.pointerEvents='none';
      }
      if(moved){
        chip.style.left=(ev.clientX-offX)+'px';
        chip.style.top=(ev.clientY-offY)+'px';
        const z=zoneUnder(ev.clientX,ev.clientY);
        if(z!==overZone){ if(overZone) overZone.classList.remove('over'); overZone=z; if(z) z.classList.add('over'); }
      }
    }
    function up(ev){
      try{ chip.releasePointerCapture(e.pointerId); }catch(_){}
      chip.removeEventListener('pointermove',move);
      chip.removeEventListener('pointerup',up);
      if(overZone) overZone.classList.remove('over');
      if(moved){
        const z=zoneUnder(ev.clientX,ev.clientY);
        chip.classList.remove('dragging');
        chip.style.position=''; chip.style.left=''; chip.style.top='';
        chip.style.zIndex=''; chip.style.width=''; chip.style.pointerEvents='';
        if(z && z.dataset.accept===chip.dataset.type){ z.appendChild(chip); }
        else { returnToBank(chip); }
      } else {
        // 탭 = 가방으로 되돌리기 (수정용)
        returnToBank(chip);
      }
      overZone=null;
      clearFeedback();
    }
    chip.addEventListener('pointermove',move);
    chip.addEventListener('pointerup',up);
  });
}
function zoneUnder(x,y){ const el=document.elementFromPoint(x,y); return el?el.closest('.dz'):null; }
function returnToBank(chip){
  const id = chip.dataset.type==='op' ? 'bagOps' : 'bagFrags';
  document.getElementById(id).appendChild(chip);
}
function clearFeedback(){
  const fb=document.getElementById('feedback');
  if(fb.textContent){ fb.textContent=''; fb.className='feedback'; }
  document.getElementById('sfeed').classList.remove('show');
}

/* ---- 정답 확인 ---- */
function setEq(a,b){
  if(a.length!==b.length) return false;
  const s=[...a].sort(), t=[...b].sort();
  return s.every((v,i)=> v===t[i]);
}
function checkAnswer(){
  const p=problems[idx];
  const gTexts=[...document.getElementById('dzG').children].map(c=>c.dataset.text);
  const pTexts=[...document.getElementById('dzP').children].map(c=>c.dataset.text);
  const sOps =[...document.getElementById('dzS').children].map(c=>c.dataset.op);
  const gOK=setEq(gTexts,p.goal), pOK=setEq(pTexts,p.pieces);
  const sOK=sOps.length===1 && sOps[0]===p.op;

  const fb=document.getElementById('feedback');
  const boxS=document.querySelector('.box-S');
  boxS.classList.remove('nudge');
  if(gOK && pOK && sOK){
    fb.textContent='정답입니다! 길을 모두 찾았어요 🎉';
    fb.className='feedback ok';
    const sf=document.getElementById('sfeed'); sf.textContent=p.sFeedback; sf.classList.add('show');
    lockChips();
    document.getElementById('checkBtn').style.display='none';
    document.getElementById('nextBtn').classList.add('show');
    document.getElementById('nextBtn').textContent = (idx>=problems.length-1) ? '탐험 마치기 →' : '다음 문제 →';
  } else if(gOK && pOK && sOps.length===0){
    // G·P는 맞고 S가 비어 있음 → S를 마저 놓도록 안내(아직 미완료)
    fb.innerHTML='👍 G와 P를 정확히 찾았어요! 이제 <b>⚙️ S 칸</b>에 알맞은 연산 기호를 끌어다 놓고 다시 눌러 주세요.';
    fb.className='feedback half';
    boxS.classList.add('nudge');
  } else if(gOK && pOK && !sOK){
    // G·P는 맞고 S 기호가 틀림
    fb.innerHTML='G와 P는 맞았어요! <b>⚙️ S 칸</b>의 연산 기호를 다시 확인해 보세요.';
    fb.className='feedback half';
    boxS.classList.add('nudge');
  } else {
    fb.textContent='다시 도전해 보세요!';
    fb.className='feedback no';
  }
}
function lockChips(){
  document.querySelectorAll('#viewSolve .chip').forEach(c=>{ c.dataset.locked='1'; c.style.cursor='default'; });
}

/* ---- 다음 문제 / 완료 ---- */
function nextProblem(){
  idx++;
  if(idx < problems.length){ renderProblem(); }
  else { showView('done'); }
}

/* ---- 문제 만들기 1: 고르기 ---- */
const OP_SITUATION = { '+':'모으는 덧셈 상황', '−':'덜어내거나 비교하는 뺄셈 상황', '×':'몇 배로 늘어나는 곱셈 상황', '÷':'똑같이 나누는 나눗셈 상황' };

/* 상황 글에서 사칙연산 단어를 읽어 연산을 인식 */
const OP_NAMES = { '+':'덧셈', '−':'뺄셈', '×':'곱셈', '÷':'나눗셈' };
function detectOp(text){
  const t = (text||'').replace(/\s/g,'');
  if(!t) return null;
  if(/나눗셈|나눠|나누|똑같이나/.test(t)) return '÷';
  if(/곱셈|곱하|몇배|배수/.test(t)) return '×';
  if(/뺄셈|빼기|빼|차이|비교|덜어|남는|남은/.test(t)) return '−';
  if(/덧셈|더하|합치|합하|모으|모아|합은/.test(t)) return '+';
  if(/배/.test(t)) return '×';
  return null;
}
function updateOpDetect(){
  const text = document.getElementById('editS').value;
  const el = document.getElementById('opDetect');
  const op = detectOp(text);
  if(op){
    el.className = 'op-detect';
    el.innerHTML = '<span class="op-pill"><span class="sym">'+op+'</span> '+OP_NAMES[op]+'(으)로 인식했어요!</span>';
  } else if(text.trim()){
    el.className = 'op-detect none';
    el.textContent = '아직 사칙연산을 못 찾았어요. 덧셈·뺄셈·곱셈·나눗셈 같은 말을 넣어 보세요.';
  } else {
    el.className = 'op-detect'; el.innerHTML = '';
  }
}

function fillEditor(p){
  document.getElementById('editQ').value = p.q;
  document.getElementById('editG').value = (p.goal||[]).join(' ');
  document.getElementById('editS').value = p.sLabel || OP_SITUATION[p.op] || '';
  const list = document.getElementById('editPList');
  list.innerHTML = '';
  (p.pieces||[]).forEach(t => addPieceRow(t));
  if((p.pieces||[]).length===0) addPieceRow('');
  updateOpDetect();
}
function addPieceRow(value){
  const list = document.getElementById('editPList');
  const row = document.createElement('div');
  row.className = 'prow';
  const inp = document.createElement('input');
  inp.type='text'; inp.className='ein'; inp.value=value||'';
  const del = document.createElement('button');
  del.type='button'; del.className='del-p'; del.textContent='삭제';
  del.addEventListener('click', ()=>{
    if(list.querySelectorAll('.prow').length<=1){ inp.value=''; inp.focus(); return; }
    row.remove();
  });
  row.appendChild(inp); row.appendChild(del);
  list.appendChild(row);
  return inp;
}

function renderCreateList(){
  const wrap=document.getElementById('createList');
  wrap.innerHTML='';
  problems.forEach((p,i)=>{
    const b=document.createElement('button');
    b.className='pcard';
    b.innerHTML='<span class="n">'+(i+1)+'.</span>'+p.q;
    b.addEventListener('click', ()=>{
      fillEditor(p);
      document.getElementById('shareDone').classList.remove('show');
      document.getElementById('shareBtn').style.display='';
      showView('create2');
    });
    wrap.appendChild(b);
  });
}

/* ---- 유틸 ---- */
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

/* ---- 이벤트 연결 ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('checkBtn').addEventListener('click', checkAnswer);
  document.getElementById('nextBtn').addEventListener('click', nextProblem);
  document.getElementById('mapBack').addEventListener('click', ()=> showView('select'));
  document.getElementById('goCreate').addEventListener('click', ()=>{ renderCreateList(); showView('create1'); });
  document.getElementById('create1Back').addEventListener('click', ()=> showView('done'));
  document.getElementById('create2Back').addEventListener('click', ()=> showView('create1'));

  // 도움말
  const ov=document.getElementById('helpOverlay');
  document.getElementById('helpBtn').addEventListener('click', ()=> ov.classList.add('open'));
  document.getElementById('helpClose').addEventListener('click', ()=> ov.classList.remove('open'));
  ov.addEventListener('click', e=>{ if(e.target===ov) ov.classList.remove('open'); });

  // 조건 추가
  document.getElementById('addP').addEventListener('click', ()=>{ const inp=addPieceRow(''); inp.focus(); });

  // 상황 입력 → 사칙연산 실시간 인식
  document.getElementById('editS').addEventListener('input', updateOpDetect);

  // 공유하기
  document.getElementById('shareBtn').addEventListener('click', ()=>{
    const q=document.getElementById('editQ').value.trim();
    if(!q){ showToast('문제를 입력해 주세요! ✏️'); return; }
    const g=document.getElementById('editG').value.trim();
    const s=document.getElementById('editS').value.trim();
    const op=detectOp(s);
    const pieces=[...document.querySelectorAll('#editPList .ein')].map(i=>i.value.trim()).filter(Boolean);
    try{
      const arr=JSON.parse(localStorage.getItem('gps_created')||'[]');
      arr.push({ q, goal:g, pieces, situation:s, op, opName:(op?OP_NAMES[op]:null), grade:sel.grade, unit:sel.unit, at:Date.now() });
      localStorage.setItem('gps_created', JSON.stringify(arr));
    }catch(_){}
    document.getElementById('shareBtn').style.display='none';
    document.getElementById('shareDone').classList.add('show');
  });

  // 개념사전 등에서 ?grade=&sem=&unit=&auto=1 로 들어오면 해당 단원으로 자동 이동
  autoStartFromParams();
});

function autoStartFromParams(){
  const q = new URLSearchParams(location.search);
  const grade = q.get('grade'), sem = q.get('sem'), unit = q.get('unit');
  if(!grade || !curriculum[grade]) return;
  selectGrade(grade);
  if(sem){
    const semBtn = [...document.querySelectorAll('#semList .pick')].find(b=>b.dataset.sem===sem);
    if(semBtn) semBtn.click();
    if(unit){
      const uBtn = [...document.querySelectorAll('#unitWrap .pick')].find(b=>b.textContent.replace(/^\d+\./,'').trim()===unit);
      if(uBtn) uBtn.click();
    }
  }
  if(q.get('auto')==='1' && sel.unit){ startSolve(); }
}
