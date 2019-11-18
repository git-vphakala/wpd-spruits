import './spruits-2018.9.css';
import './hellohello.css';

let screens = {};
let store = { log:$("<div>", { class:"log" }) };
let pm;
let tm = new spruits.TouchManager({}, store);

screens["log"] = {
  create:function(entity, store) {
    let { log } = store;
    let $buttonSR = $("<button>").html("swipe-right").on("click", event => {
      let e = $.Event("touchstart", { changedTouches: [ { screenX:0, screenY:0 } ] });
      $("body").trigger(e);

      e = $.Event("touchmove", { changedTouches: [ { screenX:10, screenY:0 } ] });
      $("body").trigger(e);
      e = $.Event("touchmove", { changedTouches: [ { screenX:20, screenY:0 } ] });
      $("body").trigger(e);

      e = $.Event("touchend", { changedTouches: [ { screenX:50, screenY:0 } ], target:entity.$field });
      $("body").trigger(e);      
    });
    let $buttonSL = $("<button>").html("swipe-left").on("click", event => {
      let e = $.Event("touchstart", { changedTouches: [ { screenX:50, screenY:0 } ] });
      $("body").trigger(e);

      e = $.Event("touchmove", { changedTouches: [ { screenX:40, screenY:0 } ] });
      $("body").trigger(e);
      e = $.Event("touchmove", { changedTouches: [ { screenX:30, screenY:0 } ] });
      $("body").trigger(e);

      e = $.Event("touchend", { changedTouches: [ { screenX:0, screenY:0 } ], target:entity.$field });
      $("body").trigger(e);
    });
    
    entity.$field.append($("<div>").append($buttonSR), $("<div>").append($buttonSL), log);
    store.$buttonSL = $buttonSL;
  }
};

screens["slide 2"] = {
  create:function(entity, store) {
    let hellohello;
    const helloWorlds = {
      "Spain":{
	create:function(entity, store) {
	  entity.$field.append("Hola Mundo");
	}
      },
      "Germany":{
	create:function(entity, store) {
	  entity.$field.append("Hallo Welt");
	}
      },
      "France":{
	create:function(entity, store) {
	  entity.$field.append("Bonjour Monde");
	}
      }
    };
    
    /* spruits.addCssRule(`
.spruit-field.pm.hellohello {
  display: block;
  width: 80%;
  margin-left: 10%;
  background: #666600;
  position: relative;
  height:20em;
  margin-top:0.5em;
}
.spruit-field.pm.hellohello .page,
.spruit-field.pm.hellohello .homepage,
.spruit-field.pm.hellohello .pageboxes {
  position: absolute;
  overflow-y: hidden;
}
.spruit-field.pm.hellohello .page {
  background:#333300;
  color:#fff;
}
`);*/
    hellohello = new spruits.PageManager({ fieldClass:"spruit-field pm hellohello", screens:helloWorlds });
    entity.$field.append(hellohello.$field);
  }
};

screens["slide 3"] = {
  create:function(entity, store) {
    entity.$field.append(
      $("<div>").append($("<label>").html("username"), $("<input>", { id:"username_field" })),
      $("<div>").append($("<label>").html("passwd"), $("<input>", { id:"password_field" }))
    );
  }
};

pm = new spruits.PageManager({ screens:screens }, store);
$("body").append(pm.$field);
store.$buttonSL.trigger("click");
let e;
/*
e = $.Event("touchstart", { changedTouches: [ { screenX:0, screenY:0 } ] });
$("body").trigger(e);

e = $.Event("touchmove", { changedTouches: [ { screenX:10, screenY:0 } ] });
$("body").trigger(e);
e = $.Event("touchmove", { changedTouches: [ { screenX:20, screenY:0 } ] });
$("body").trigger(e);

e = $.Event("touchend", { changedTouches: [ { screenX:50, screenY:0 } ] });
$("body").trigger(e);
*/
//************************************************************************************

/*e = $.Event("touchstart", { changedTouches: [ { screenX:50, screenY:0 } ] });
$("body").trigger(e);

e = $.Event("touchmove", { changedTouches: [ { screenX:40, screenY:0 } ] });
$("body").trigger(e);
e = $.Event("touchmove", { changedTouches: [ { screenX:30, screenY:0 } ] });
$("body").trigger(e);

e = $.Event("touchend", { changedTouches: [ { screenX:0, screenY:0 } ] });
$("body").trigger(e);*/

