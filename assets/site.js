(function(){
  var lb=document.getElementById('lightbox'),lbImg=lb.querySelector('img'),lbTitle=lb.querySelector('.lb-title'),
      lbLabel=lb.querySelector('.lb-label'),lbCount=lb.querySelector('.lb-count'),lbPrev=lb.querySelector('.lb-arrow.prev'),
      lbNext=lb.querySelector('.lb-arrow.next'),lbClose=lb.querySelector('.lb-close');
  var current=null,lastFocus=null;
  function setup(box){
    var slides=JSON.parse(box.getAttribute('data-slides')),state={i:0,slides:slides,box:box,title:box.getAttribute('data-title')};
    var img=box.querySelector('.zoom img'),label=box.querySelector('.slide-label'),count=box.querySelector('.count');
    state.render=function(){var s=slides[state.i];if(img){img.src=s.src;img.alt=s.alt;img.width=s.w;img.height=s.h;}
      if(label)label.textContent=s.alt;if(count)count.textContent=(state.i+1)+' / '+slides.length;};
    state.go=function(d){state.i=(state.i+d+slides.length)%slides.length;state.render();if(current===state)renderLb();};
    var p=box.querySelector('.arrow.prev'),n=box.querySelector('.arrow.next');
    if(p)p.addEventListener('click',function(){state.go(-1);});
    if(n)n.addEventListener('click',function(){state.go(1);});
    box.querySelector('[data-zoom]').addEventListener('click',function(e){lastFocus=e.currentTarget;open(state);});
  }
  function renderLb(){var s=current.slides[current.i];lbImg.src=s.src;lbImg.alt=s.alt;lbLabel.textContent=s.alt;
    lbCount.textContent=(current.i+1)+' / '+current.slides.length;lbTitle.textContent=current.title;
    var multi=current.slides.length>1;lbPrev.hidden=!multi;lbNext.hidden=!multi;}
  function open(state){current=state;renderLb();lb.hidden=false;document.body.classList.add('noscroll');lbClose.focus();}
  function close(){if(lb.hidden)return;lb.hidden=true;document.body.classList.remove('noscroll');current=null;if(lastFocus)lastFocus.focus({preventScroll:true});}
  document.querySelectorAll('[data-slides]').forEach(setup);
  lbPrev.addEventListener('click',function(){current&&current.go(-1);});
  lbNext.addEventListener('click',function(){current&&current.go(1);});
  lbClose.addEventListener('click',close);
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-stage'))close();});
  document.addEventListener('keydown',function(e){if(!current)return;
    if(e.key==='Escape')close();else if(e.key==='ArrowLeft')current.go(-1);else if(e.key==='ArrowRight')current.go(1);});
  // mobile menu
  var btn=document.querySelector('.menubtn'),mnav=document.getElementById('mobile-nav');
  btn.addEventListener('click',function(){var o=mnav.hidden;mnav.hidden=!o;btn.setAttribute('aria-expanded',String(o));});
  // nav links close menu + lightbox
  document.querySelectorAll('.site-header a').forEach(function(a){a.addEventListener('click',function(){
    if(!a.closest('.lang')){mnav.hidden=true;btn.setAttribute('aria-expanded','false');}close();});});
  // logo: back to top without leaving #top in the address
  var logo=document.querySelector('.logo');
  if(logo)logo.addEventListener('click',function(e){e.preventDefault();close();mnav.hidden=true;btn.setAttribute('aria-expanded','false');
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
    history.replaceState(null,'',location.pathname+location.search);});
  // show more / fewer
  document.querySelectorAll('.showmore').forEach(function(b){b.addEventListener('click',function(){
    var box=b.parentElement,open=!box.classList.contains('expanded');box.classList.toggle('expanded',open);
    b.setAttribute('aria-expanded',String(open));b.textContent=open?b.getAttribute('data-less'):b.getAttribute('data-more');
    if(!open)box.scrollIntoView({behavior:'smooth',block:'start'});});});
  // contact form (Web3Forms)
  var FORM_KEY='70bbb39d-9a35-43c0-b669-da03f31ead3b';
  var form=document.querySelector('.lead-form');
  if(form)form.addEventListener('submit',function(e){e.preventDefault();
    var st=form.querySelector('.fstatus'),bt=form.querySelector('.send');st.classList.remove('err');
    if(!form.checkValidity()){form.reportValidity();return;}
    if(form.botcheck.checked)return;
    var fd=new FormData(form);fd.append('access_key',FORM_KEY);fd.delete('botcheck');
    var label=bt.textContent;bt.disabled=true;bt.textContent=form.getAttribute('data-sending');
    fetch('https://api.web3forms.com/submit',{method:'POST',body:fd}).then(function(r){return r.json();})
      .then(function(d){if(d&&d.success){form.reset();st.textContent=form.getAttribute('data-ok');}else{throw 0;}})
      .catch(function(){st.classList.add('err');st.textContent=form.getAttribute('data-err');})
      .finally(function(){bt.disabled=false;bt.textContent=label;});});
  // language switch keeps current section
  document.querySelectorAll('.lang a').forEach(function(a){a.addEventListener('click',function(){
    if(location.hash&&location.hash!=='#top'){a.href=a.getAttribute('href').split('#')[0]+location.hash;}});});
})();
