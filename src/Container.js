
export function Container(args) {
  this.name = args.name;
  this.fields = {};

  //****************************************************************************************************************************************************************************
  this.createField = function(fieldName, type, args, store) {
    if (args === undefined) {
      args = {};
      args["fieldName"] = fieldName;
    }
    
    if (args.fieldName === undefined) {
      args["fieldName"] = fieldName;
    }

    try {
      this.fields[fieldName] = new type(args, store);
    } catch (err) {
      console.log(err);
    }
  }
}

