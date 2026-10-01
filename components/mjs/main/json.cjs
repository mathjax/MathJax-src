let REQUIRE;
try { REQUIRE = eval("require") } catch (_) { REQUIRE = () => {} }
export const json = (file) => Promise.resolve().then(() => REQUIRE(file));

