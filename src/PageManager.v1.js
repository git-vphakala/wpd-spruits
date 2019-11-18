import { getAttr } from './util.js';
import { Component } from './Component.js';
import { Entity } from './Entity.js';

export function PageManager(args, store={}) {
  const { screens, menubar, dropdown, attrs } = args;
  let $container, $homepage, $pageboxes, $home, $arrowLeft, $arrowRight, pagesI, pages, slideInClass, slideOutClass, slideInFromRightClass, slideOutToLeftClass; // "menu", "cal", "tp", "ra", "notif", "crud",
  let handleClickHome, handleSwipeRight, handleSwipeLeft;
  let handleClickMenuItem, createPage, Page, handleClickDelButton, handleFrameSwipeLeft, deletePage;
  let getVal, setVal, empty, validate;
  
  //****************************************************************************************************************************************************************************
  handleClickHome = function(e) {
    e.preventDefault();
    
    if ($home.hasClass("myhome-2x")) {
      $home.removeClass("myhome-2x");
      if (pages.length) pages[pagesI].set("slideIn", slideInFromRightClass);
      $homepage.removeClass("fadeIn").addClass("fadeOut");

      // crud.set("show"); fixme
    } else {
      $home.addClass("myhome-2x");
      $homepage.removeClass("fadeOut").addClass("fadeIn");
      if (pages.length) pages[pagesI].set("slideOut", slideOutClass);

      // crud.set("hide"); fixme
    }
  };
  
  //****************************************************************************************************************************************************************************
  handleSwipeRight = function(e){
    e.preventDefault();
    e.stopPropagation();
    
    if ($home.hasClass("myhome-2x") || !pages.length) return;
    
    if (pagesI < 0) {
      pagesI = 0;
      pages[0].set("slideIn", slideInClass);
    } else {
      pages[pagesI].set("slideOut", slideOutClass);
      pages[pagesI].set("pagebox-inactivate");
    
      pagesI++;
      if (pagesI > pages.length-1) pagesI = 0;
      
      pages[pagesI].set("slideIn", slideInClass);
    }
  };

  //****************************************************************************************************************************************************************************
  handleSwipeLeft = function(e){
    e.preventDefault();
    e.stopPropagation();
  
    if ($home.hasClass("myhome-2x") || !pages.length) return;
  
    if (pagesI < 0) {
      pagesI = pages.length-1;
      pages[pagesI].set("slideIn", slideInFromRightClass);
    } else {
      pages[pagesI].set("slideOut", slideOutToLeftClass);
      pages[pagesI].set("pagebox-inactivate");
    
      pagesI--;
      if (pagesI < 0) pagesI = pages.length-1;
    
      pages[pagesI].set("slideIn", slideInFromRightClass);
    }
  };

  //****************************************************************************************************************************************************************************
  deletePage = function($delButton) {
    let i = $delButton.data("pagesi"), len;
  
    pages[i].set("remove");
    pages.splice(i, 1);
  
    len = pages.length;
    if (pagesI > len-1) {
      if (i === pagesI) pagesI = 0;
      else pagesI = len - 1;
    }
    if (i >= len) i = len - 1;
  
    for (; len > 0 && i<len; i++) {
      pages[i].set("pagesI", i);
    }
  }; // deletePage

  //****************************************************************************************************************************************************************************
  handleClickDelButton = function (e){
    e.preventDefault();
    deletePage($(this));
  };

  //****************************************************************************************************************************************************************************
  handleFrameSwipeLeft = function(e, ui) {
    e.preventDefault();

    $(this).one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function(e) {
      e.preventDefault();
      deletePage($(this).children(".del"));
    });
    $(this).addClass("slideOutToLeft");
  };

  //****************************************************************************************************************************************************************************
  Page = function(args) {
    const { entity, onClickDelButton, onSwipeLeftFrame, pagesI, $pageboxes, $homepage, $home } = args,
	  
	  $delButton = $("<div>", { class:"del" }).html("&times;"),
	  $page =      $("<div>", { class:"page" }),
	  $pagebox =   $("<li>", { class:"pagebox" }),
	  $frame =     $("<div>", { class:"frame" });

    let getVal, setVal;
  
    Component.call(this, args);

    $page.append(entity.$field);
    $frame.html($page.html());  
    $frame.prepend($delButton);
    $delButton.attr("data-pagesi", "" + pagesI).on("click", onClickDelButton);
    $frame.on("swipe-left", onSwipeLeftFrame);
  
    $page.insertBefore($pageboxes).on('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function(e) {
      e.preventDefault();
      if ($(this).hasClass(slideOutClass) || $(this).hasClass(slideOutToLeftClass)) $(this).addClass("hide");
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
      case "pagesI":
	$frame.children(".del").data("pagesi", "" + val);
	break;
      }
    };
  
    this.getVal = getVal;
    this.setVal = setVal;
  };

  //****************************************************************************************************************************************************************************
  createPage = function(args) {
    let entity = args.entity;
    
    pages.push(new Page({ entity:entity, pagesI:pages.length, $pageboxes:$pageboxes, $homepage:$homepage, $home:$home, onClickDelButton:handleClickDelButton, onSwipeLeftFrame:handleFrameSwipeLeft }));
    
    if (pagesI >= 0) pages[pagesI].set("pagebox-inactivate");
    pagesI++;
  };

  //****************************************************************************************************************************************************************************
  handleClickMenuItem = function(e, item) {
    let entity;
    
    entity = screens[item] ? new Entity({ fieldName:item, fieldClass:"spruit-screen", screen:screens[item] /*, cal:cal, timepicker:tp, responsive:true, resizeAgent:ra*/ }) : new Entity({ fieldName:item });
    entity.load(store);
    createPage({ entity:entity });
  }; // handleClickMenuItem

  //****************************************************************************************************************************************************************************
  getVal = function(propName) {
    switch(propName){
    case "entity":return pages[pagesI].get("entity");
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
	pages[pagesI].set("slideOut", slideOutClass); // "slideOut");
	pages[pagesI].set("pagebox-inactivate");
	pagesI = i;
	pages[pagesI].set("slideIn", slideInClass);   // "slideIn");
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
  Component.call(this, args);
  pages = [];
  pagesI = -1;
  $container = this.$field;
  $homepage = $("<div>", { class:"homepage" });
  $pageboxes = $("<ul>", { class:"pageboxes" });
  $container.append($homepage, $pageboxes);
  $home = $("<i>", { class:"fa fa-home myhome" }).on("click", e => handleClickHome(e));

  $pageboxes.append( $("<li>", { class:"navi-button" }).append($home) );

  $arrowLeft = $("<i>", { class:"fa fa-arrow-circle-left arrow-swipe" }).on("click", () => { $container.trigger("swipe-left"); return false; });
  $arrowRight = $("<i>", { class:"fa fa-arrow-circle-right arrow-swipe" }).on("click", () => { $container.trigger("swipe-right"); return false; });
  $pageboxes.append( $("<li>", { class:"navi-button" }).append($arrowLeft), $("<li>", { class:"navi-button" }).append($arrowRight) );

  slideInClass =          getAttr(attrs, "slideIn",          "page", "slideInClass");
  slideOutClass =         getAttr(attrs, "slideOut",         "page", "slideOutClass");
  slideInFromRightClass = getAttr(attrs, "slideInFromRight", "page", "slideInFromRightClass");
  slideOutToLeftClass =   getAttr(attrs, "slideOutToLeft",   "page", "slideOutToLeftClass");
  
  $container.on("swipe-right", (e) => handleSwipeRight(e));
  $container.on("swipe-left", (e) => handleSwipeLeft(e));

  if (menubar === undefined) {
    Object.keys(screens).forEach(screen => handleClickMenuItem({}, screen));
    if (pages.length) {
      pagesI = 0;
      pages[pagesI].set("slideIn", slideInFromRightClass);
    }
  }
  
  /* fixme
  menu = new Menu({ fieldName:"PageManager menu", insertLabel:false, menubar:menubar, dropdown:dropdown, onClickDropdown:(e, item) => handleClickMenuItem(e, item) });
  $homepage.append(menu.$field);

  notif = new Notification({ insertLabel:false });
  crud = new Crud({ insertLabel:false, $pageboxes:$pageboxes, $modalcontainer:$container, attrs:{ modal:{ span:{ style:"z-index:3"} }}, pm:this, notification:notif });
  $container.append(crud.$field, notif.$field);

  cal = new Calendar({ fieldName:"Calendar", $modalcontainer:$container });
  tp = new TimePicker({ fieldName:"TimePicker", $modalcontainer:$container });
  ra = new ResizeAgent({ fieldName:"resizeAgent" });*/

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
}


/* fixme
//****************************************************************************************************************************************************************************
exports.className = "PageManager";
exports.args =      [ "screens", "menubar", "dropdown", "attrs" ];
exports.props =     [ "$container", "$homepage", "$pageboxes", "$home", "$arrowLeft", "$arrowRight", "pagesI", "pages", "menu", "cal", "tp", "ra", "notif", "crud",
		      "slideInClass", "slideOutClass", "slideInFromRightClass", "slideOutToLeftClass"
		    ];
exports.methods =   {
  "handleClickHome":handleClickHome, "handleSwipeRight":handleSwipeRight, "handleSwipeLeft":handleSwipeLeft, "deletePage":deletePage, "handleClickDelButton":handleClickDelButton, "handleFrameSwipeLeft":handleFrameSwipeLeft,
  "Page":Page, "createPage":createPage, "handleClickMenuItem":handleClickMenuItem,
};
exports.init =      init;
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate
};

*/
