export function Entity(args) {
  let screen = args.screen,
      view = args.view,
      cal = args.cal,
      timepicker = args.timepicker,
      responsive = args.responsive,
      resizeAgent = args.resizeAgent,
      State;

  spruits.Component.call(this, args);
  spruits.Container.call(this, this);
  State = {};

  this.cal = cal;
  this.timepicker = timepicker;
  this.responsive = responsive;
  this.resizeAgent = resizeAgent;

  //****************************************************************************************************************************************************************************
  this.addScreenLabel = function() {
    this.$label.html(this.name);
  }

  //****************************************************************************************************************************************************************************
  this.insertFields = function(rowClass, lastRowClass) {
    this.$field.append(Object.values(this.fields).map(comp => { return $("<div>", {class:rowClass ? rowClass : "screen-row"}).append(comp.$field); }));
    this.$field.children(":last-child").addClass(lastRowClass ? lastRowClass : "last");
  }

  //****************************************************************************************************************************************************************************
  this.load = function(store) {
    if (screen === undefined) {
      this.$field.append("<p>TBA</p>");
      this.addScreenLabel();
    } else {
      screen.create(this, store);
    }
  }

  //****************************************************************************************************************************************************************************
  this.refresh = function(store) {
    if (screen === undefined) {
      this.$field.append("<p>update TBA</p>");
      this.addScreenLabel();
    } else {
      screen.update(this, store);
    }
  }

  //****************************************************************************************************************************************************************************
  this.getVal = function(propName) {
    let val;

    if (propName === undefined) propName = "val";
  
    switch(propName){
    case "valid":
      val = this.validate();
      break;
    case "val":
      val = {};
      Object.values(this.fields).forEach(comp => { val[comp.name] = comp.get("val"); });
      break;
    case "key":
      val = {};
      Object.values(this.fields).forEach(comp => { if (comp.get("isKey")) val[comp.name] = comp.get("val"); });
      break;
    case "State":
      return State;
      break;
    default:
      console.log("Entity.getVal, " + this.name + ", unknown propName=" + propName);
      break;
    }
    return val;
  }

  //****************************************************************************************************************************************************************************
  this.setVal = function(propName, val) {
    if (val === undefined) {
      val = propName;
      propName = "val";
    }
    switch (propName) {
    case "val":
      Object.values(this.fields).forEach(comp => { comp.set("val", val[comp.name]); });
      break;
    case "State":
      State[val.key] = val.value;
      break;
    default:
      console.log("Entity.setVal, " + this.name + ", unknown propName=" + propName);
      break;
    }
  }

  //****************************************************************************************************************************************************************************
  this.empty = function() {
  }

  //****************************************************************************************************************************************************************************
  this.validate = function() {
    let valid = { valid:true, invalid:{} };

    Object.values(this.fields).forEach(comp => {
      let fieldValid = comp.get("valid");
      if (fieldValid.valid !== true) {
	valid.valid = false;
	valid.invalid[comp.name] = fieldValid.invalid;
      }
    });
    return valid;
  }
}
