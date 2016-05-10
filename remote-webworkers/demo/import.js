//
//  Add commands to the worker
//

if (Commands.combine) {
  Log("combine already defined");
}

Commands.combine = function (data,post) {
  Task("echo",data[0]+" => "+data[1],post);
};
