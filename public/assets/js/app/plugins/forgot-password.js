"use strict";
/**
 * forgot password plugin
 *
 * @author ericw
 * @since 7/20/17
 */
MBC.app.rg_plugin("forgot-password", function () {

    this.handler = function forgotPasswordEventHandler(e) {
        e.preventDefault();
        var windowHeight = $(window).height() * 0.6;
        var windowWidth = $(window).width() * 0.4;

        var screenY = window.screenY;
        var screenX = window.screenX;
        var windowTop = ($(window).height() - windowHeight) / 2 + screenY;
        var windowLeft = ($(window).width() - windowWidth) / 2 + screenX;

        var url = $(this).attr("href");
        MBC.app.utils.popupOpenScroll(url, windowWidth, windowHeight, windowTop, windowLeft);
    };
    return this;
});