// make sure the namespace exists
var bazookas = bazookas || {};

// simpler modules can just return an object
bazookas.example = (function() {
  function test() {
    console.log('private');
  }

  return {
    init: function() {

    },
    test: test
  };
})();
