(function() {
  // على Netlify، تتم إعادة توجيه كل المسارات إلى index.html
  // هذا يضمن أن التاريخ يعمل بشكل صحيح
  const segmentCount = 0;
  const l = window.location;
  const port = l.port ? ':' + l.port : '';
  const cleanedPathname = l.pathname.split('/').slice(0, 1 + segmentCount).join('/');
  // إعادة التوجيه إذا كانت الصفحة المطلوبة ليست index.html
  if (l.pathname.split('/').length > segmentCount+1 && !l.pathname.includes('.')) {
    history.replaceState(null, null, 
      l.protocol + '//' + l.hostname + port + cleanedPathname + '/#' + l.pathname.slice(1) + l.search
    );
  }
})();