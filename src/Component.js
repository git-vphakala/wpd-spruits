import $ from 'jquery';
import {isFunction} from "./util.js"

export function Component(args) {
  let insertLabel = args.insertLabel;
  let fieldClass = args.fieldClass;
  let $field = args.$field;
  let attrs = args.attrs;
  let view = args.view;
  let isKey = args.isKey;
  let name = args.fieldName;
  
  let $label;

  name = args.fieldName;
  
  if (view !== undefined) {
    if (view.fields[name] === undefined) {
      console.log("*** Component, view.fields === undefined, name=" + name);
    }
    $field = view.fields[name].$field;
    $label = view.fields[name].$label;
    attrs = view.fields[name].attrs;
    insertLabel = false;
  } else {
    if ($field === undefined) {
      $field = $("<span class=\"spruit-field\"></span>");

      if (attrs !== undefined) {
	if (attrs.span !== undefined) {
          if (attrs.mediaquery !== undefined && attrs.mediaquery.span !== undefined) {
            if (attrs.mediaquery.span()) {
              $field.attr(attrs.span());
            }
          } else {
            $field.attr(attrs.span);
          }
	}
      }
    }

    if (fieldClass !== undefined) {
      if (fieldClass !== false) {
	$field.removeClass("spruit-field");
	$field.addClass(fieldClass);
      }
    }

    $label = $("<label>").html(insertLabel !== false ? name : "").attr((attrs !== undefined && attrs.label !== undefined) ? attrs.label : {});
    if (isFunction($field.append)) $field.append($label);
  }

  this.name = name;
  this.attrs = attrs;
  this.$label = $label;
  this.$field = $field;

  //****************************************************************************************************************************************************************************
  this.get = function(propName) {
    switch (propName) {
    case "val":
      return (isFunction(this.getVal) ? this.getVal() : {} );
      break;
    case "isKey":
      return isKey;
      break;
    case "valid":
      return (isFunction(this.validate) ? this.validate() : { valid:true } );
    default:
      return this.getVal(propName);
      break;
    } // switch
  }; // get

  //****************************************************************************************************************************************************************************
  this.set = function(propName, val) {
    let localCacheVal;

    switch(propName) {
    case "val":
      this.setVal(val);
      break;
    case "empty":
      this.empty();
      break;
    case "invalid-color":
      this.setInvalidColor ? this.setInvalidColor(propName, val) : this.$field.find("input").addClass("invalid");
      break;
    case "reset-invalid-color":
      this.resetInvalidColor ? this.resetInvalidColor(propName, val) : this.$field.find("input").removeClass("invalid");
      break;
    default:
      this.setVal(propName, val);
      break;
    } // switch
  }; // set

  //****************************************************************************************************************************************************************************
  this.handleBlur = function(e, me) {
    let valid;
  
    e.preventDefault();
    console.log("Component, " + this.name + " Blur, val=" + me.get("val"));

    valid = me.validate();
    if (valid.valid === false) me.set("invalid-color");
    else me.set("reset-invalid-color");
  }
}
