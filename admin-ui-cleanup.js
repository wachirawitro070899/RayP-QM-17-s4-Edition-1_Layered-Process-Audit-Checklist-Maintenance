// Hide Audit No. from the Admin UI without changing stored audit records.
(function(){
  function clean(){
    const table=document.querySelector('.table-wrap table');
    if(table){
      const head=[...table.querySelectorAll('thead th')];
      const idx=head.findIndex(th=>th.textContent.trim()==='Audit No.');
      if(idx>=0){head[idx].remove();table.querySelectorAll('tbody tr').forEach(tr=>tr.children[idx]?.remove());}
    }
    const search=document.getElementById('search');
    if(search)search.placeholder='ค้นหา หน่วยงาน, Line, Auditor';
    const title=document.getElementById('detailTitle');
    if(title&&/^LPA-/.test(title.textContent.trim())){const score=title.textContent.split('·').pop()?.trim()||'';title.textContent='Audit detail'+(score?' · '+score:'');}
  }
  document.addEventListener('DOMContentLoaded',()=>{clean();new MutationObserver(clean).observe(document.body,{childList:true,subtree:true,characterData:true});});
})();
