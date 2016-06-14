
function filterActionGenerator() {
  var env = this;
  function filterAction(value, arg, arg2) {
    return (value||'').toUpperCase()+'-'+arg+'::'+arg2;
  }
  return filterAction;
}


module.exports = {
    "type": "filter",
    "filters": {
        "filterAction": filterActionGenerator
    }
};

