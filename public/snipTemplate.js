(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['snip'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "      \r\n            "
    + ((stack1 = container.invokePartial(partials.comment,depth0,{"name":"comment","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  \r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<article class=\"snip\">\r\n    <div class=\"snip-title\">\r\n        <a href=\"#\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\r\n    </div>\r\n    <div class=\"snip-author\">\r\n        <a href=\"#\">"
    + alias4(((helper = (helper = helpers.author || (depth0 != null ? depth0.author : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"author","hash":{},"data":data}) : helper)))
    + "</a>\r\n    </div>\r\n    <div class=\"snip-code\">\r\n"
    + ((stack1 = container.invokePartial(partials.codeblock,(depth0 != null ? depth0.code : depth0),{"name":"codeblock","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "    </div>\r\n    <div class=\"snip-details\">\r\n        "
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "\r\n    </div>\r\n    <button class=\"comment-button\">comment</button>\r\n    <button class=\"react-buttons\">☻/♥/♫/‼</button>\r\n    <div class=\"comments\">      \r\n        "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.comments : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n</article>";
},"usePartial":true,"useData":true});
})();