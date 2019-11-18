import { getAttr } from './util.js';
import { Component } from './Component.js';
import { Entity } from './Entity.js';

function IntInterface(args) {
  let val;
  let { initialVal } = args;

  this.inc = function() {
    val++;
  }

  this.dec = function() {
    val--;
  }

  this.get = function(propName) {
    return val;
  }

  this.set = function(propName, value) {
    val = value;
  }
}

function UniqueId() {
  let uid = 0;

  this.get = function() {
    let retval = uid;
    uid++;
    return retval;
  }
}

export function PageManager(args, store={}) {
  const { screens, customInjection, attrs } = args;
  let controller, state, States;
  
  let uniquePageId, pagesI, pages, slideInClass, slideOutClass, slideInFromRightClass, slideOutToLeftClass, injection;
  let Page, createPage, deletePage;
  let getVal, setVal, empty, validate;

  //****************************************************************************************************************************************************************************
  const defaultInjection = function(pm, store) {
    Object.keys(screens).forEach(screenName => createPage(store, screenName));
    if (pages.length) {
      pagesI.set("val", 0);
      pages[pagesI.get("val")].set("slideIn", slideInFromRightClass);
    }
  };
  
  //****************************************************************************************************************************************************************************
  Page = function(args, store) {
    const { uid, entity } = args,
	  { controller, Events, $pageboxes, $homepage, $home } = store,
	  
	  $delButton = $("<div>", { class:"del" }).html("&times;"),
	  $pagebox =   $("<li>", { class:"pagebox" }),
	  $frame =     $("<div>", { class:"frame" }),

	  handlePageDelete = (e) => {
	    e.preventDefault();
	    store.event = { type:Events.deletePage, e:e, page:this };
	    $page.remove();
	    $frame.remove();
	    $pagebox.remove();	
	    controller();
	  };

    let getVal, setVal, $page;

    handlePageDelete.bind(this);
    args.$field = $("<div>", { class:"page" });
    Component.call(this, args);
    $page = this.$field;

    $page.append(entity.$field);
    
    $frame.html($page.html());  
    $frame.prepend($delButton);
    $delButton.on("click", e => handlePageDelete(e));

    $frame.on("swipe-left", (e) => {
      e.preventDefault();
      $frame.one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', e => handlePageDelete(e));
      $frame.addClass("slideOutToLeft");
    });
  
    $page.insertBefore($pageboxes).on('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function(e) {
      e.preventDefault();
      if ($page.hasClass(slideOutClass) || $page.hasClass(slideOutToLeftClass)) $page.addClass("hide");
    });
    $homepage.append($frame);
    $pagebox.insertBefore($home.parent()); // <ul.pageboxes> <pagebox/> *** inserts here *** <li $home/> <li swipe-left-button/> <li swipe-right-button/> </ul>

    getVal = function(propName) {
      let val;
    
      switch (propName) {
      case "entity":
	val = entity;
	break;
      }
      return val;
    };

    setVal = function(propName, val) {
      switch(propName) {
      case "slideIn":
	$page.removeClass(slideOutClass + " " + slideOutToLeftClass + " hide").addClass(val);
	$pagebox.addClass("pagebox-active");
	break;
      case "slideOut":
	$page.removeClass(slideInClass + " " + slideInFromRightClass).addClass(val);
	break;
      case "pagebox-inactivate":
	$pagebox.removeClass("pagebox-active");
	break;
      case "remove":
	$page.remove();
	$frame.remove();
	$pagebox.remove();	
	break;
      }
    };
  
    this.getVal = getVal;
    this.setVal = setVal;
  };

  //****************************************************************************************************************************************************************************
  createPage = function(store, screenName) {
    const { pages, pagesI, $pageboxes, $homepage, $home } = store;
    let entity;
    
    entity = new Entity({ fieldName:screenName, fieldClass:"spruit-screen", screen:screens[screenName] });
    entity.load(store);
    
    pages.push(new Page({ uid:uniquePageId.get(), entity /*, pagesIVal:pages.length */ }, store));
    
    if (pagesI.get("val") >= 0) pages[pagesI.get("val")].set("pagebox-inactivate");
    pagesI.inc();
  }; // createPage

  //****************************************************************************************************************************************************************************
  deletePage = function(page) {
    let i = pages.indexOf(page), len;
    if (i < 0) return;

    pages.splice(i, 1);
  
    len = pages.length;
    if (pagesI.get("val") > len-1) {
      if (i === pagesI.get("val")) pagesI.set("val", 0);
      else pagesI.set("val", len - 1);
    }
  }; // deletePage

  //****************************************************************************************************************************************************************************
  getVal = function(propName) {
    switch(propName){
    case "entity":return pages[pagesI.get("val")].get("entity");
    case "ra":return ra;
    }
  }; // getValue

  //****************************************************************************************************************************************************************************
  setVal = function(propName, val) {
    let i;
  
    switch (propName) {
    case "goto-page":
      i = pages.findIndex(page => val === page.get("entity").name);

      if (i > -1) {
	pages[pagesI.get("val")].set("slideOut", slideOutClass); // "slideOut");
	pages[pagesI.get("val")].set("pagebox-inactivate");
	pagesI.set("val", i);
	pages[pagesI.get("val")].set("slideIn", slideInClass);   // "slideIn");
      } else {
	notif.set("show", "Broken page-link: " + val);
      }
      break;
    }
  }; // setVal

  //****************************************************************************************************************************************************************************
  empty = function() {
  }; // empty

  //****************************************************************************************************************************************************************************
  validate = function() {
  }; // validate

  //****************************************************************************************************************************************************************************
  States = { created:1 };
  
  args.screen = {
    create:function(entity, store) {
      const { controller, Events, injection, homepageEnabled } = store;
      const $container = entity.$field;
      const $homepage = $("<div>", { class:"homepage" });
      const $pageboxes = $("<ul>", { class:"pageboxes" });
      const $home = $("<i>", { class:"fa fa-home myhome"  + (homepageEnabled ? "" : " hide") }).on("click", e => {
	e.preventDefault();
	store.event = { type:Events.clickHome, e:e };
	controller();
      });
      const $arrowLeft = $("<i>", { class:"fa fa-arrow-circle-left arrow-swipe" }).on("click", (e) => {
	e.preventDefault();
	store.event = { type:Events.swipeLeft, e:e };
	controller();
      });
      const $arrowRight = $("<i>", { class:"fa fa-arrow-circle-right arrow-swipe" }).on("click", (e) => {
	e.preventDefault();
	store.event = { type:Events.swipeRight, e:e };
	controller();
      });

      $container.append($homepage, $pageboxes.append( $("<li>", { class:"navi-button" }).append($home), $("<li>", { class:"navi-button" }).append($arrowLeft), $("<li>", { class:"navi-button" }).append($arrowRight) ));

      $container.on("swipe-right", (e) => {
	store.event = { type:Events.swipeRight, e:e };
	controller();
      });
      $container.on("swipe-left", (e) => {
	store.event = { type:Events.swipeLeft, e:e };
	controller();
      });

      store.$home = $home;
      store.$homepage = $homepage;
      store.$pageboxes = $pageboxes;
      injection(entity, store);
      controller();
    }, // create
    update:function(entity, store) {
      const { Events, event, $home, $homepage, pages, pagesI, slideInClass, slideOutClass, slideInFromRightClass, slideOutToLeftClass } = store;
      
      const handleClickHome = function(e) {
	if ($home.hasClass("myhome-2x")) {
	  $home.removeClass("myhome-2x");
	  if (pages.length) pages[pagesI.get("val")].set("slideIn", slideInFromRightClass);
	  $homepage.removeClass("fadeIn").addClass("fadeOut");
	} else {
	  $home.addClass("myhome-2x");
	  $homepage.removeClass("fadeOut").addClass("fadeIn");
	  if (pages.length) pages[pagesI.get("val")].set("slideOut", slideOutClass);
	}
      }; // handleClickHome

      const handleSwipeRight = function(e){
	e.preventDefault();
	e.stopPropagation();
    
	if ($home.hasClass("myhome-2x") || !pages.length) return;
    
	if (pagesI.get("val") < 0) {
	  pagesI.set("val", 0);
	  pages[pagesI.get("val")].set("slideIn", slideInClass);
	} else {
	  pages[pagesI.get("val")].set("slideOut", slideOutClass);
	  pages[pagesI.get("val")].set("pagebox-inactivate");
    
	  pagesI.inc();
	  if (pagesI.get("val") > pages.length-1) pagesI.set("val", 0);
      
	  pages[pagesI.get("val")].set("slideIn", slideInClass);
	}
      }; // handleSwipeRight

      const handleSwipeLeft = function(e){
	e.preventDefault();
	e.stopPropagation();
  
	if ($home.hasClass("myhome-2x") || !pages.length) return;
  
	if (pagesI.get("val") < 0) {
	  pagesI.set("val", pages.length-1);
	  pages[pagesI.get("val")].set("slideIn", slideInFromRightClass);
	} else {
	  pages[pagesI.get("val")].set("slideOut", slideOutToLeftClass);
	  pages[pagesI.get("val")].set("pagebox-inactivate");
    
	  pagesI.dec();
	  if (pagesI.get("val") < 0) pagesI.set("val", pages.length-1);
    
	  pages[pagesI.get("val")].set("slideIn", slideInFromRightClass);
	}
      };

      if (event.type === Events.clickHome) handleClickHome(event.e);
      else if (event.type === Events.swipeRight) handleSwipeRight(event.e);
      else if (event.type === Events.swipeLeft) handleSwipeLeft(event.e);
      else if (event.type === Events.deletePage) deletePage(event.page);
      else if (event.type === Events.createPage) createPage(store, event.screenName);
      else console.log("ERR:unknown event,event.type=" + event.type + ",Events=" + JSON.stringify(Events));
    } // update
  }; // screen
  pages = [];
  pagesI =  new IntInterface(-1);
  uniquePageId = new UniqueId();
  
  slideInClass =          getAttr(attrs, "slideIn",          "page", "slideInClass");
  slideOutClass =         getAttr(attrs, "slideOut",         "page", "slideOutClass");
  slideInFromRightClass = getAttr(attrs, "slideInFromRight", "page", "slideInFromRightClass");
  slideOutToLeftClass =   getAttr(attrs, "slideOutToLeft",   "page", "slideOutToLeftClass");

  controller = function() {
    if (state === undefined) {
      state = States.created;
    } else if (state === States.created) {
      this.refresh(store);
    } else {
      console.log("ERR:invalidState,state=" + state + ", States=" + JSON.stringify(States));
    }
  }.bind(this);

  injection = ((customInjection !== undefined) ? customInjection : defaultInjection);
  store = Object.assign(store,{ controller, injection, Events:{ clickHome:1, swipeRight:2, swipeLeft:3, deletePage:4, createPage:5 }, slideInClass, slideOutClass, slideInFromRightClass, slideOutToLeftClass, pages, pagesI });
  Entity.call(this, args);
  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
  this.load(store);
}
