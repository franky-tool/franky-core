
function sample(name) {
  console.log("Hello", name);
}

function prepro(name) {
  return name.toUpperCase();
}

module.exports = {
  "callable": sample,
  "type": "commandline",
  "bind": true,
  "options":{
    "exit": true,
    "execute": true,
    "include": true
  },
  "command":{
    "value": "-s, --sample <name>",
    "help":"sample help",
    "preprocessor": prepro,
    "initial": null
  }
};

