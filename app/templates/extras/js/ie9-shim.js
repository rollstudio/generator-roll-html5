/**
 * Emulate FormData for some browsers
 * MIT License
 * (c) 2010 François de Metz
 */
(function(w) {
    if (w.FormData)
        return;
    function FormData() {
        this.fake = true;
        this.boundary = "--------FormData" + Math.random();
        this._fields = [];
    }
    FormData.prototype.append = function(key, value) {
        this._fields.push([key, value]);
    }
    FormData.prototype.toString = function() {
        var boundary = this.boundary;
        var body = "";
        this._fields.forEach(function(field) {
            body += "--" + boundary + "\r\n";
            // file upload
            if (field[1].name) {
                var file = field[1];
                body += "Content-Disposition: form-data; name=\""+ field[0] +"\"; filename=\""+ file.name +"\"\r\n";
                body += "Content-Type: "+ file.type +"\r\n\r\n";
                body += file.getAsBinary() + "\r\n";
            } else {
                body += "Content-Disposition: form-data; name=\""+ field[0] +"\";\r\n\r\n";
                body += field[1] + "\r\n";
            }
        });
        body += "--" + boundary +"--";
        return body;
    }
    w.FormData = FormData;
})(window);

/**
 *	Console shim
 */

console = console || {
	debug: function(){},
	error: function(){},
	info: function(){},
	log: function(){},
	warn: function(){},
	dir: function(){},
	dirxml: function(){},
	table: function(){},
	trace: function(){},
	assert: function(){},
	count: function(){},
	markTimeline: function(){},
	profile: function(){},
	profileEnd: function(){},
	time: function(){},
	timeEnd: function(){},
	timeStamp: function(){},
	timeline: function(){},
	timelineEnd: function(){},
	group: function(){},
	groupCollapsed: function(){},
	groupEnd: function(){},
	clear: function(){}
}
