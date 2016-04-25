
function filterAction(value, arg, arg2) {
  return (value||'').toUpperCase()+'-'+arg+'::'+arg2;
}


module.exports = {
    "type": "filter",
    "filters": {
        "filterAction": filterAction
    }
};

