
function sample(name) {
  console.log("Hello", name);
}

function prepro(name) {
  return name.toUpperCase();
}

module.exports = {
  "type": "commandline",
  "commands":[
    {
      "callable": sample,
      "bind": true,
      "options":{
        "exit": true,
        "execute": true,
        "include": true
      },
      "value": "-s, --sample <name>",
      "help":"sample help",
      "preprocessor": prepro,
      "initial": null
    }
  ]
};

