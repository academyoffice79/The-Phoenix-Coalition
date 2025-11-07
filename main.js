(function(){
    const btn = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav-links');
    if(!btn || !nav) return;
    btn.addEventListener('click', function(){
        const isOpen = nav.classList.toggle('show');
        btn.setAttribute('aria-expanded', String(isOpen));
    });
})();