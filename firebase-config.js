// Shared Firebase project used by the Production People Management System.
window.LPA_FIREBASE_CONFIG = {
  apiKey: "AIzaSyB4hIpI6bLI7L-CZ9JY0XjFnGrwTmVQ3bE",
  authDomain: "wachirawit-c8582.firebaseapp.com",
  databaseURL: "https://wachirawit-c8582-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wachirawit-c8582",
  storageBucket: "wachirawit-c8582.firebasestorage.app",
  messagingSenderId: "860073002133",
  appId: "1:860073002133:web:65ecba09c0c3cd4702879c"
};

(function(){
  function installProcedureTitle(){
    const main=document.querySelector('main.page');if(!main)return;
    let title=document.getElementById('procedureMainTitle');
    if(!title){title=document.createElement('div');title.id='procedureMainTitle';title.innerHTML='<div style="font-size:20px;font-weight:800;letter-spacing:.2px">SUPPLEMENT TO PROCEDURE DESCRIPTION - CBI QM-17 s1</div><div style="font-size:16px;font-weight:600;margin-top:3px">Layered Process Audit Checklist - Manufacturing</div>';}
    title.style.cssText='background:#fff;color:#111;text-align:center;padding:14px 16px 12px;margin:0 0 16px;border:1px solid #ead6d6;border-radius:10px;line-height:1.35';
    const pageHead=main.querySelector('.page-head');
    if(pageHead)pageHead.insertAdjacentElement('afterend',title);else main.insertBefore(title,main.firstChild);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installProcedureTitle);else installProcedureTitle();
})();

(function(){
  function boot(){
    const line=document.getElementById('line'),filters=document.querySelector('.filters');
    if(!line||!filters)return;
    const date=document.getElementById('auditDate');
    if(date&&!date.dataset.visibleDateInstalled){date.dataset.visibleDateInstalled='1';date.type='date';const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());const today=d.toISOString().slice(0,10);date.value=today;date.min=today;date.max=today;date.readOnly=false;const field=document.createElement('div');field.className='field';field.id='auditDateField';field.innerHTML='<label>Date / วันที่ Audit</label>';date.parentNode.insertBefore(field,date);field.appendChild(date);filters.insertBefore(field,filters.firstChild);const enforce=()=>{if(date.value!==today)date.value=today;};date.addEventListener('input',enforce);date.addEventListener('change',enforce);}
    const auditee=document.getElementById('auditee');const level=document.getElementById('level');const auditeeByArea={1:'Pratoomchai',2:'Somkid',4:'Pratoomchai',5:'Somkid',6:'Narin',7:'Natthawat',8:'Pratoomchai',9:'Watcharee',10:'Teeraporn',11:'Ongard',12:'Wuttipat'};
    const areaNumber=v=>{const m=String(v||'').match(/^Area\s+(\d+)\b/i);return m?Number(m[1]):null;};
    function syncAuditee(){if(!auditee)return;if(level?.value==='Level 1'){if(auditee.readOnly)auditee.value='';auditee.readOnly=false;auditee.placeholder='พิมพ์ชื่อผู้รับการตรวจ';return;}const name=auditeeByArea[areaNumber(line.value)]||'';auditee.value=name;auditee.readOnly=!!name;auditee.placeholder=name?'':'ชื่อผู้รับการตรวจ';}
    document.getElementById('workstationProductionField')?.remove();document.getElementById('workstationField')?.remove();document.getElementById('productionField')?.remove();
    const wf=document.createElement('div');wf.className='field';wf.id='workstationField';wf.innerHTML='<label>Workstation</label><input id="workstation" type="text" readonly placeholder="เลือก Line ก่อน">';
    const pf=document.createElement('div');pf.className='field';pf.id='productionField';pf.innerHTML='<label>Production</label><input id="production" type="text" readonly placeholder="เลือก Line ก่อน">';
    const lf=line.closest('.field');if(lf){lf.insertAdjacentElement('afterend',pf);lf.insertAdjacentElement('afterend',wf);}else{filters.appendChild(wf);filters.appendChild(pf);}
    const workstation=document.getElementById('workstation'),production=document.getElementById('production');const fixed={5:'U375 / Thinbride / APB-Mi Op10',6:'T6 / PBR / P2-30A / APB-Mi Op20',8:'U375 / P2-30A / Thin bride / APB-Mi'};
    function syncFields(){const area=areaNumber(line.value);const clean=String(line.value||'').replace(/^Area\s+\d+\s*/i,'').trim();const value=fixed[area]||clean;workstation.value=value;production.value=value;syncAuditee();}
    line.addEventListener('change',syncFields);level?.addEventListener('change',syncAuditee);syncFields();
    if(!document.getElementById('lpaQuickStyles')){const s=document.createElement('style');s.id='lpaQuickStyles';s.textContent='#auditee[readonly],#workstation[readonly],#production[readonly]{background:#f3f4f6;color:#374151;font-weight:700;cursor:not-allowed}#auditDate{font-weight:700;cursor:pointer}.validation-error{outline:3px solid #ef4444!important;background:#fff1f2!important}';document.head.appendChild(s);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

// Detailed submit validation: identify missing header fields/questions/comments and require evidence below 75%.
(function(){
  function installValidation(){
    if(!document.getElementById('submitBtn'))return;
    const labels={line:'Line / Area',level:'Audit Level',auditor:'Auditor',unit:'Function',auditee:'Auditee',auditDate:'Date / วันที่ Audit'};
    function clearErrors(){document.querySelectorAll('.validation-error').forEach(el=>el.classList.remove('validation-error'));}
    function mark(el){if(el)el.classList.add('validation-error');}
    function questionLabel(row,index){const text=row?.querySelector('.qtext')?.textContent?.trim()||'';const m=text.match(/^\d+\.\d+/);return m?m[0]:`ข้อที่ ${index+1}`;}
    document.addEventListener('click',function(e){
      const btn=e.target.closest&&e.target.closest('#submitBtn');if(!btn)return;
      clearErrors();
      const problems=[];
      const missingHeader=[];
      Object.entries(labels).forEach(([id,label])=>{const el=document.getElementById(id);if(el&&!String(el.value||'').trim()){missingHeader.push(label);mark(el);}});
      if(missingHeader.length)problems.push('ข้อมูลส่วนหัวที่ยังไม่ได้กรอก: '+missingHeader.join(', '));
      const rows=[...document.querySelectorAll('#auditBody tr[data-qid]')];
      const unanswered=[],missingComments=[];
      rows.forEach((row,i)=>{const id=row.dataset.qid;const checked=row.querySelector(`input[name="${id}"]:checked`);const comment=row.querySelector('.comment');const label=questionLabel(row,i);if(!checked){unanswered.push(label);mark(row);}if(!String(comment?.value||'').trim()){missingComments.push(label);mark(comment);}});
      if(unanswered.length)problems.push('ยังไม่ได้เลือกผล: '+unanswered.join(', '));
      if(missingComments.length)problems.push('ยังไม่ได้ใส่ Comment: '+missingComments.join(', '));
      const scored=rows.map(row=>row.querySelector('input[type="radio"]:checked')?.value).filter(v=>v==='ok'||v==='observe'||v==='ng');
      const ok=scored.filter(v=>v==='ok').length,obs=scored.filter(v=>v==='observe').length,ng=scored.filter(v=>v==='ng').length;
      const score=scored.length?((ok*2+obs)/(scored.length*2))*100:0;
      const hasEvidence=rows.some(row=>!!row.querySelector('.evidence-preview'));
      if(scored.length&&score<75&&!hasEvidence)problems.push(`คะแนนปัจจุบัน ${score.toFixed(1)}% (< 75%) ต้องแนบรูปภาพหลักฐานอย่างน้อย 1 รูปก่อนส่งข้อมูล`);
      if(problems.length){e.preventDefault();e.stopImmediatePropagation();alert('ไม่สามารถส่งข้อมูลได้\n\n'+problems.map((x,i)=>`${i+1}. ${x}`).join('\n'));const first=document.querySelector('.validation-error');if(first)first.scrollIntoView({behavior:'smooth',block:'center'});}
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installValidation);else installValidation();
})();

// Final document signatures: Auditor and Auditee, touch-friendly and printable.
(function(){
  const signatures={auditor:'',auditee:''};window.LPA_SIGNATURES=signatures;
  function signaturePad(canvas,key){
    const ctx=canvas.getContext('2d');let drawing=false,last=null,hasInk=false;
    function resize(){const data=hasInk?canvas.toDataURL('image/png'):null;const ratio=Math.max(window.devicePixelRatio||1,1);const rect=canvas.getBoundingClientRect();canvas.width=Math.max(1,Math.round(rect.width*ratio));canvas.height=Math.max(1,Math.round(rect.height*ratio));ctx.setTransform(ratio,0,0,ratio,0,0);ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#111827';if(data){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,rect.width,rect.height);img.src=data;}}
    const point=e=>{const r=canvas.getBoundingClientRect();const p=e.touches?e.touches[0]:e;return{x:p.clientX-r.left,y:p.clientY-r.top};};const start=e=>{e.preventDefault();drawing=true;last=point(e);};const move=e=>{if(!drawing)return;e.preventDefault();const p=point(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;hasInk=true;signatures[key]=canvas.toDataURL('image/png');};const end=e=>{if(!drawing)return;e.preventDefault();drawing=false;last=null;if(hasInk)signatures[key]=canvas.toDataURL('image/png');};
    canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('pointerleave',end);canvas.addEventListener('touchstart',start,{passive:false});canvas.addEventListener('touchmove',move,{passive:false});canvas.addEventListener('touchend',end,{passive:false});resize();window.addEventListener('resize',resize);return{clear(){const r=canvas.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);hasInk=false;signatures[key]='';},hasInk(){return hasInk;}};
  }
  function install(){
    const submit=document.getElementById('submitBtn');if(!submit||document.getElementById('signatureSection'))return;
    const style=document.createElement('style');style.id='signatureStyles';style.textContent='.signature-section{margin-top:18px;border:1px solid #ead6d6;border-radius:12px;padding:14px;background:#fff}.signature-title{font-weight:800;color:#991b1b;margin-bottom:12px}.signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.signature-box{border:1px solid #d7bcbc;border-radius:10px;padding:12px;background:#fff}.signature-role{font-weight:700;text-align:center;margin-bottom:8px}.signature-canvas{display:block;width:100%;height:150px;border:1px dashed #b98a8a;border-radius:8px;background:#fff;touch-action:none}.signature-name{text-align:center;margin-top:7px;font-size:12px;min-height:18px}.signature-clear{display:block;margin:8px auto 0;border:1px solid #ead6d6;background:#fff;border-radius:7px;padding:6px 12px;font:inherit;font-size:12px;cursor:pointer}.signature-note{text-align:center;color:#785f5f;font-size:11px;margin-top:8px}@media(max-width:700px){.signature-grid{grid-template-columns:1fr}.signature-canvas{height:180px}}@media print{.signature-section{break-inside:avoid;border:1px solid #777;margin-top:8px;padding:8px}.signature-title{font-size:10px;margin-bottom:5px}.signature-grid{grid-template-columns:1fr 1fr;gap:8px}.signature-box{padding:5px;border-color:#777}.signature-role,.signature-name{font-size:9px}.signature-canvas{height:75px;border:0}.signature-clear,.signature-note{display:none!important}}';document.head.appendChild(style);
    const section=document.createElement('div');section.id='signatureSection';section.className='signature-section';section.innerHTML='<div class="signature-title">Final Confirmation / การยืนยันท้ายเอกสาร</div><div class="signature-grid"><div class="signature-box"><div class="signature-role">Auditor Signature / ลายเซ็นผู้ตรวจ</div><canvas id="auditorSignature" class="signature-canvas"></canvas><div class="signature-name" id="auditorSignatureName"></div><button type="button" class="signature-clear no-print" id="clearAuditorSignature">ล้างลายเซ็น / Clear</button></div><div class="signature-box"><div class="signature-role">Auditee Signature / ลายเซ็นผู้รับการตรวจ</div><canvas id="auditeeSignature" class="signature-canvas"></canvas><div class="signature-name" id="auditeeSignatureName"></div><button type="button" class="signature-clear no-print" id="clearAuditeeSignature">ล้างลายเซ็น / Clear</button></div></div><div class="signature-note no-print">ลงลายเซ็นด้วยนิ้วบนหน้าจอมือถือหรือใช้เมาส์บนคอมพิวเตอร์ ต้องลงลายเซ็นครบทั้ง Auditor และ Auditee ก่อนส่งข้อมูล</div>';submit.closest('.submit-footer').insertAdjacentElement('beforebegin',section);
    const auditorPad=signaturePad(document.getElementById('auditorSignature'),'auditor');const auditeePad=signaturePad(document.getElementById('auditeeSignature'),'auditee');document.getElementById('clearAuditorSignature').onclick=()=>auditorPad.clear();document.getElementById('clearAuditeeSignature').onclick=()=>auditeePad.clear();const syncNames=()=>{document.getElementById('auditorSignatureName').textContent=document.getElementById('auditor')?.value||'';document.getElementById('auditeeSignatureName').textContent=document.getElementById('auditee')?.value||'';};['auditor','auditee','line'].forEach(id=>document.getElementById(id)?.addEventListener('input',syncNames));document.getElementById('line')?.addEventListener('change',()=>setTimeout(syncNames,0));syncNames();
    document.addEventListener('click',function(e){const btn=e.target.closest&&e.target.closest('#submitBtn');if(!btn)return;if(!auditorPad.hasInk()||!auditeePad.hasInk()){e.preventDefault();e.stopImmediatePropagation();alert('กรุณาลงลายเซ็น Auditor และ Auditee ให้ครบก่อนส่งข้อมูล');section.scrollIntoView({behavior:'smooth',block:'center'});}},true);
    try{if(window.firebase){if(!firebase.apps.length)firebase.initializeApp(window.LPA_FIREBASE_CONFIG);const db=firebase.database();if(!db.__lpaSignaturePatched){const originalRef=db.ref.bind(db);db.ref=function(path){const ref=originalRef(path);if(path==='lpaAudits'&&!ref.__lpaPushPatched){const originalPush=ref.push.bind(ref);ref.push=function(){const child=originalPush();const originalSet=child.set.bind(child);child.set=function(data){if(data&&typeof data==='object')data.signatures={auditor:signatures.auditor,auditee:signatures.auditee};return originalSet(data);};return child;};ref.__lpaPushPatched=true;}return ref;};db.__lpaSignaturePatched=true;}}}catch(err){console.warn('Signature save hook could not be installed',err);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
