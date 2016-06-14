
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
  "commands":[{
    "options":{
      "exit": true,
      "execute": true,
      "include": true
    },
    "value": "-s, --sample <name>",
    "help":"sample help",
    "preprocessor": prepro,
    "initial": null
  }]
};

