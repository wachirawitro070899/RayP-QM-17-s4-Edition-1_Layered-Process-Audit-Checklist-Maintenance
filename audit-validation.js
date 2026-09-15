// LPA submit guard: every question requires a text comment; every NG requires evidence.
(function(){
  function boot(){
    const btn=document.getElementById('submitBtn');
    if(!btn)return;
    const label=(row,i)=>{const t=row.querySelector('.qtext')?.textContent?.trim()||'';return t.match(/^\d+\.\d+/)?.[0]||`ข้อที่ ${i+1}`;};
    document.addEventListener('click',function(e){
      const target=e.target.closest&&e.target.closest('#submitBtn');
      if(!target)return;
      const rows=[...document.querySelectorAll('#auditBody tr[data-qid]')];
      const missingComments=[],ngWithoutImages=[];
      rows.forEach((row,i)=>{
        const id=row.dataset.qid;
        const answer=row.querySelector(`input[name="${id}"]:checked`)?.value;
        const comment=row.querySelector('.comment');
        const name=label(row,i);
        if(!/[A-Za-z0-9\u0E00-\u0E7F]/.test(String(comment?.value||''))){missingComments.push(name);comment?.classList.add('validation-error');}
        if(answer==='ng'&&!row.querySelector('.evidence-preview')){ngWithoutImages.push(name);row.classList.add('validation-error');}
      });
      const problems=[];
      if(missingComments.length)problems.push('ต้องใส่ Comment เป็นตัวอักษรทุกข้อ ข้อที่ยังขาด: '+missingComments.join(', '));
      if(ngWithoutImages.length)problems.push('ข้อที่เลือก 😒 NG / Unsatisfactory ต้องแนบรูปทุกข้อ ข้อที่ยังขาดรูป: '+ngWithoutImages.join(', '));
      if(problems.length){
        e.preventDefault();e.stopImmediatePropagation();
        alert('ไม่สามารถส่งข้อมูลได้\n\n'+problems.join('\n'));
        document.querySelector('.validation-error')?.scrollIntoView({behavior:'smooth',block:'center'});
      }
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
