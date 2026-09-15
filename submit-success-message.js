// Show requested confirmation after a successful LPA submission.
(function(){
  const SUCCESS='ส่งข้อมูลให้ Admin เรียบร้อยแล้วครับ/ค่ะ';
  const nativeAlert=window.alert.bind(window);
  window.alert=function(message){
    const text=String(message==null?'':message);
    if(text.includes('ส่งข้อมูลเข้าสู่ระบบเรียบร้อยแล้ว')) return nativeAlert(SUCCESS);
    return nativeAlert(message);
  };
})();
