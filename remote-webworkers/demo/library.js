//
//  The library code
//
var Library = {
  double: function (data) {
    return {x: 2*data.x, y: 2*data.y};
  }
};

Commands.double = function (data,post) {
  Task("done",Library.double(data),post);
};
