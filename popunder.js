if( typeof popunderUrl !== 'undefined' && typeof popunderUrl === 'string') {
    var starUrl = popunderUrl;

    if( typeof popunderPeriod === 'undefined' || typeof popunderPeriod !== 'number') {
        var popunderPeriod = 24;
    }

    if ( typeof popunderTrigger === 'undefined' || typeof popunderTrigger !== 'string') {
        var popunderTrigger = 'document';
    } else {
        popunderTrigger = popunderTrigger.replace(/\s/g, "");
        if (popunderTrigger === '') {
            popunderTrigger = 'document';
        }
    }

    var popunderTargets = [];

    var cookieName = 'star1';
    var starPop = 0;
    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this
    };

    function setCookie(c_name, value, exdays) {
        var exdate = new Date();
        exdate.addHours( popunderPeriod );
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value
    }

    function getCookie(c_name) {
        var i, x, y, STARcookies = document.cookie.split(";");
        for (i = 0; i < STARcookies.length; i++) {
            x = STARcookies[i].substr(0, STARcookies[i].indexOf("="));
            y = STARcookies[i].substr(STARcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y)
            }
        }
    }

    function preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault()
        }
        e.returnValue = false;
        return false
    }

    function openWindow(url) {
        window.open(url).focus();
        return false
    }

    function mobilePop(e) {
        var targ;
        if (typeof e === "undefined") {
            e = window.event || arguments.callee.caller.arguments[0];
        }

        if (typeof e != "undefined") {
            if (e.target) {
                targ = e.target
            } else if (e.srcElement) {
                targ = e.srcElement
            }
            var stop = false;
            var element = targ;
            if (targ.nodeType == 3 || targ.tagName != 'A') {
                do {
                    element = element.parentNode;
                    if (element === null || typeof element.tagName === 'undefined' || element.tagName === "HTML") {
                        stop = true
                    }
                } while (element.tagName != 'A' && stop == false)
            }
            if (getCookie(cookieName)) {
                starPop = 1
            }

            if (!stop) {
                if (starPop == 0) {
                    if (typeof element.href != "undefined" && element.href != "" && element.href != "#" && !/\s?javascript\s?:/i.test(element.href)) {
                        history.go(-history.length);
                        openWindow(element.href);
                        location.href = starUrl;

                        starPop = 1;
                        setCookie(cookieName, 1, 1);
                        return preventDefault(e);
                    }
                }
            }
        }
    }

    function callback(e) {
        mobilePop(e);
    }

    function addClickEvent(element) {
        if (element.addEventListener) {
            element.addEventListener('click', callback, false);
        } else if (element.attachEvent) {
            element.attachEvent('onclick', callback);
        } else {
            element["onclick"] = callback;
        }
    }

    if (popunderTrigger === 'document') {
        addClickEvent(document);
    } else if (popunderTrigger === 'a') {
        var elms = document.querySelectorAll("a");
        for (var it = 0; it < elms.length; it++) {
            addClickEvent(elms[it]);
        }
    } else {
        var selectors = popunderTrigger.replace(/\s/g, "").split(",");
        for (var i=0;i<selectors.length;i++) {
            selectors[i] = "." + selectors[i];
        }
        var elms = document.querySelectorAll(selectors.join(", "));
        for (var it = 0; it < elms.length; it++) {
            addClickEvent(elms[it]);
        }
    }
}