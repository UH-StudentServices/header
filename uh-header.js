var uhHeader = function(options) {
  window.addEventListener("message", receiveMessage, false);
  var IFRAME_OPEN = false;
  var FATMENU_OPEN = false;
  var sisWindow;
  var validSisOrigin = options.origin;
  var naviEl;
  var iframeHeight = 0;

  function receiveMessage(message) {
    if (message.origin !== validSisOrigin && validSisOrigin !== '*')
      return;

    sisWindow = message.source;
    naviEl = document.querySelector('#navi');


    if (message.data === 'open') {
      IFRAME_OPEN = true;
      iframeHeight = naviEl.style.height;
      sisWindow.postMessage('height-'+Number(iframeHeight), validSisOrigin);
      sendOpenAck();
    }
  }

  function sendCloseMessage() {
    sisWindow.postMessage('close', validSisOrigin);
    naviEl.style.height = '0px';
  }

  document.body.addEventListener('click', function(ev) {
    // If user clicks below the nav bar, close it
    if (ev.target.tagName === 'BODY') {
      sendCloseMessage();
    }
  });

  window.addEventListener("keyup", escHandler);
  function escHandler(event) {
    if (event.keyCode == 27) {
      sendCloseMessage();
    }
  }

  function sendOpenAck() {
    sisWindow.postMessage('opened', validSisOrigin);
  }

  function responsiveResize(){

    if (window.innerWidth < 768) {
      $(".nav-toggle").css("visibility", "visible");
      if (FATMENU_OPEN){
        $("#navi").css( "height", 810 );
        updateIframe()
      } else {
        $("#navi").css( "height", 260 );
        updateIframe()
      }
    } else {
      $(".nav-toggle").css("visibility", "hidden");
      if (FATMENU_OPEN){
        $("#navi").css( "height", 400 );
        updateIframe()
      } else {
        $("#navi").css( "height", 126 );
        updateIframe()
      }
    }
  }

  function openMenu() {
    FATMENU_OPEN = true;
    responsiveResize();
    $(".fatmenu").removeClass("is-slideout");
    $(".fatmenu").addClass("is-open is-slidein");
    $(".expandthis").css( "height", 275 );
    updateIframe()
    $(".last").addClass("is-open");
    $(".main-menu").addClass("is-open");
  }

  function closeMenu(){
    FATMENU_OPEN = false;
    responsiveResize();
    $(".fatmenu").removeClass("is-open is-slidein");
    $(".fatmenu").addClass("is-slideout");
    $(".last").removeClass("is-open");
    $(".main-menu").removeClass("is-open");
    $(".expandthis").css( "height", 0 );
    updateIframe()
  }


  function updateIframe() {
    if (sisWindow !== undefined) {
      iframeHeight = $("#navi").height();
      sisWindow.postMessage('height-'+Number(iframeHeight), validSisOrigin)
    }
  }

  $(document).ready(function(){
    responsiveResize();
    $(window).resize(responsiveResize)

    $(".main-menu__expand-toggle").click(function(event){
      event.preventDefault();
      if (FATMENU_OPEN) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    $(".fatmenu__collapse").click(function(event){
      event.preventDefault();
      closeMenu();
    });
  });
};