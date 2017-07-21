"use strict";

/**
 * This is the MBC application Javascript main entry, the application will start from here.
 *
 * Each page should be a component, use MBC.app.rg_cp to register your component.
 * the component only got init when that page loaded, be careful the component name when you register it,
 * it should follow pattern:
 *      request url: /self-serve/create-account
 *      component name: SelfServe.CreateAccount
 *  the rg_cp method accept 3 parameters
 *      1. component name
 *      2. plugins object map, this plugins will be inject to your registered component context, key will be the property name,
 *          you can use it like access your component attribute, eg: cp.validation.
 *      3. component function object, this function should return real component object self.
 *  once you can the rg_cp and pass in right parameters it will register to the MBC.app namespace, and only one component will get active at one page
 *  this register component process will also inject registerEvent function to component object scope/context,
 *  so in the component function you can call this.register(event, selector, handler, data)
 *
 *  use method MBC.app.rg_plugin plugin.
 *
 *
 * @author ericw
 * @version 1.0
 * @since 6/23/17
 */

//Register NameSpaces Function
function registerNS(args, obj) {
    var nameSpaceParts = args.split("."),
        root = obj || window;

    for (var i = 0; i < nameSpaceParts.length; i++) {
        if (typeof root[nameSpaceParts[i]] === "undefined") {
            root[nameSpaceParts[i]] = {};
        }
        root = root[nameSpaceParts[i]];

        if ((i + 1) === nameSpaceParts.length) {
            root.name = args;
        }
    }

    return root;
}

/**
 * Get component name from request path
 * @returns {string} component name
 */
function getComponentNameFromPath() {
    var pathArray = window.location.pathname.split("/"),
        pathPartArray,
        hasPathPart = false,
        pathPart,
        componentName = "",
        path,
        firstChar,
        i, j;

    for (i = 0; i < pathArray.length; i++) {
        path = pathArray[i];

        if (!path) continue;

        if (path.indexOf("-") > -1) {
            hasPathPart = true;
            pathPartArray = path.split("-");
            for (j = 0; j < pathPartArray.length; j++) {
                pathPart = pathPartArray[j];
                firstChar = pathPart[0].toUpperCase();
                pathPart = firstChar + pathPart.substr(1);
                componentName += pathPart;
            }
        }
        firstChar = path[0].toUpperCase();
        path = firstChar + path.substr(1);
        if (!hasPathPart) {
            componentName += path;
        }
        if (pathArray.length !== i + 1) {
            componentName += ".";
        }
        hasPathPart = false;
    }
    return componentName;
}

/**
 * MBC application class
 */
var MBC = (function (MBC, $) {
    MBC.app = {};
    var that = MBC.app;

    /**
     * register component
     * @param name      - component name
     * @param plugins   - plugins object map
     * @param fn        - component function,  this will become component attributes and functions
     */
    MBC.app.rg_cp = function (name, plugins, fn) {
        var component;
        if (!this.cp) {
            this.cp = {};
        }

        registerNS(name, this.cp);
        component = getComponentByName(name);
        if (fn && typeof fn === 'function') {
            fn.apply(component, [component, this]);
        }
        component.plugins = plugins;
        component.registerEvent = MBC.app.registerEvent;
    };

    /**
     * Register plugin
     * @param name  - plugin name
     * @param fn    - plugin function
     */
    MBC.app.rg_plugin = function (name, fn) {
        if (!this.plugins) {
            this.plugins = {};
        }

        if (fn && typeof fn === 'function') {
            this.plugins[name] = fn.apply(this);
        }
    };

    /**
     * Register event
     * @param event     - event type
     * @param selector  - selector like '.class-name'
     * @param handler   - event handler
     * @param data      - data
     */
    MBC.app.registerEvent = function (event, selector, handler, data) {
        $(selector).on(event, data, handler);
    };

    /**
     * get component by name
     * @param name          - component name
     * @returns component name
     */
    function getComponentByName(name) {
        var i,
            component = that.cp;

        if (name.indexOf(".") > -1) {
            name = name.split(".");
            for (i = 0; i < name.length; i++) {
                if (!component) {
                    break;
                }
                component = component[name[i]];
            }
        } else {
            component = component[name];
        }

        return component;
    }

    /**
     * add plugin to component context
     * @param component - component object
     * @param plugins   - plugins object map
     */
    function addPluginToComponentContext(component, plugins) {
        var key, pluginName;
        for (key in plugins) {
            if (plugins.hasOwnProperty(key)) {
                pluginName = plugins[key];
                if (pluginName.indexOf("plugin.") > -1) {
                    pluginName = pluginName.replace("plugin.", "");
                }
                if (that.plugins[pluginName]) {
                    component[key] = that.plugins[pluginName];
                }
            }
        }
    }

    /**
     * Get current active component
     * return current active component
     */
    MBC.app.getCurrentComponent = function () {
        return getComponentByName(getComponentNameFromPath());
    };

    /**
     * init MBC.app
     * @private private function
     */
    function _init() {
        MBC.app.cp = {}; // init component
        MBC.app.plugins = {}; // init plugins
        MBC.app.utils = {}; // init utility

        _applyAddFunction();
    }

    /**
     * apply add function to component, utils and plugins
     * @private private function
     */
    function _applyAddFunction() {
        var key;
        for (key in MBC.app) {
            if (MBC.app.hasOwnProperty(key) &&
                MBC.app[key] &&
                typeof MBC.app[key] === 'object') {
                MBC.app[key].add = _add;
            }
        }
    }

    function _add(obj) {
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                this[key] = obj[key];
            }
        }

    }

    _init();

    // Start MBC Now!!!
    MBC.app.start = function () {
        console.log("start mbc application!");

        var currentComponent = MBC.app.getCurrentComponent();
        if (!currentComponent) {
            console.log("no registered component found!");
            return;
        }

        console.log(currentComponent);


        addPluginToComponentContext(currentComponent, currentComponent.plugins);
        currentComponent.init();


    };

    return MBC;

})(MBC || {}, jQuery || {});


//start application
$(document).ready(function () {
    MBC.app.start();
});
