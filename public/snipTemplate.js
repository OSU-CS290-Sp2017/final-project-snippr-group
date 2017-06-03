(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "                        <option>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</option>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<header>\r\n    <img src=\"logo.png\" alt=\"Put out logo here\">\r\n    <h1 class=\"site-title\">Snippr</h1>\r\n\r\n    <nav class=\"navbar\">\r\n        <ul class=\"navlist\">\r\n            <li class=\"navitem\" id=\"nav-home\"><a href=\"#\">Home</a></li>\r\n            <li class=\"navitem\" id=\"nav-search\"><a href=\"#\">Search</a></li>\r\n            <li class=\"navitem\" id=\"nav-create\"><a href=\"#\">Create</a></li>\r\n            <li class=\"navitem\" id=\"nav-styleSelect\">\r\n                <select id=\"styleSelect-menu\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </select>\r\n            </li>\r\n        </ul>\r\n    </nav>\r\n</header>";
},"useData":true});
})();