/* Small script to improve in-page navigation UX
    - Ensures clicking an in-page nav link always scrolls to the target (even if the hash is unchanged)
    - Closes the mobile nav (unchecks the nav-toggle checkbox) after navigation
    - Keeps the implementation tiny and focused; no external deps
*/

 (function(){
   /* helper: scroll an element into view accounting for sticky navbar */
   function scrollToElementById(id, behavior = 'smooth'){
      const target = document.getElementById(id);
      if(!target) return false;
      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar ? Math.ceil(navbar.getBoundingClientRect().height) : 0;
      const extraBuffer = 8; // pixels of extra space below the navbar
      const targetTop = window.scrollY + target.getBoundingClientRect().top;
      const scrollTo = Math.max(0, targetTop - navbarHeight - extraBuffer);
      try {
         window.scrollTo({ top: scrollTo, behavior });
      } catch (err) {
         // older browsers
         window.scrollTo(0, scrollTo);
      }
      return true;
   }

   function handleNavClick(e){
      const anchor = e.target.closest('a[href^="#"]');
      if(!anchor) return;
      const href = anchor.getAttribute('href');
      if(!href || href === '#') return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if(!target) return; // leave browser default if target missing

      // Prevent default jump; perform smooth scroll so repeated clicks always scroll
      e.preventDefault();
      scrollToElementById(id, 'smooth');

      // Update the URL hash without causing another jump
      try { history.replaceState(null, '', href); } catch (err) { /* ignore */ }

      // If mobile menu is open (checkbox used for CSS toggle), close it
      const toggle = document.querySelector('.nav-toggle-input');
      if(toggle && toggle.checked){ toggle.checked = false; }
   }

   // When the page loads with a hash (navigated from another page), the browser may jump
   // to the element before scripts run. Correct that jump by re-scrolling with our offset.
   function adjustForInitialHash(){
      const raw = (location.hash || '').replace(/^#/, '');
      if(!raw) return;
      // small timeout lets the browser finish its native jump/layout (helps with fonts/images)
      setTimeout(function(){ scrollToElementById(raw, 'smooth'); }, 50);
   }

   // If the hash changes (back/forward or programmatic), adjust as well
   window.addEventListener('hashchange', function(){
      const raw = (location.hash || '').replace(/^#/, '');
      if(!raw) return;
      setTimeout(function(){ scrollToElementById(raw, 'smooth'); }, 10);
   });

   document.addEventListener('DOMContentLoaded', function(){ adjustForInitialHash(); });

   document.addEventListener('click', handleNavClick, { passive: false });
})();