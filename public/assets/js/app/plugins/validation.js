"use strict";
/**
 * account validator plugin
 *
 * @author ericw
 * @since 7/20/17
 */
MBC.app.rg_plugin("account-validator", function () {
    this.validateRequired = function (requiredError, requiredField) {
        var value = requiredField.val();
        if (value) {
            return MBC.constant.VALID;
        }

        requiredError.show();
        return MBC.constant.EMPTY;
    };

    this.validatePassword = function (requiredError, notMatchError, passwordField) {
        var password = passwordField.val();
        if (password) {
            var lengthResult = (password.length >= 10 );
            var characterResult = ( /[a-z]/.test(password) && /[A-Z]/.test(password) && /[@!_\-\+\*]/.test(password));
            if (lengthResult && characterResult) {
                notMatchError.hide();
                return MBC.constant.VALID; //not match requirement
            }
            notMatchError.show();
            return MBC.constant.INVALID; //valid
        }

        notMatchError.hide();
        requiredError.show();
        return MBC.constant.EMPTY; //is empty
    };

    this.validateConfirmPwd = function (requiredError, confirmPwdError, passwordFiled, confirmPasswordFiled) {
        var password = passwordFiled.val(),
            confirmPassword = confirmPasswordFiled.val();
        if (confirmPassword) {
            if (confirmPassword === password) {
                confirmPwdError.hide();
                return MBC.constant.VALID; //valid
            }
            confirmPwdError.show();
            return MBC.constant.INVALID; //not equals
        }

        confirmPwdError.hide();
        requiredError.show();
        return MBC.constant.EMPTY; //is empty
    };

    this.validateEmail = function (requiredError, invalidError, emailFiled) {
        var email = emailFiled.val();
        if (email) {
            var strRegex = /^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i;
            if (!strRegex.test(email)) {
                invalidError.show();
                return MBC.constant.INVALID;
            } else {
                invalidError.hide();
                return MBC.constant.VALID;
            }
        } else {
            invalidError.hide();
            if (emailFiled.attr("must-fill") === "yes") {
                requiredError.show();
            }
            return MBC.constant.EMPTY;
        }
    };

    this.checkEmailExist = function (email) {
        var jsonResponse = null;
        if (email.length) {
            var url = "/account/validateEmail?email=" + email;
            $.ajax({
                url: url,
                type: "GET",
                async: false,
                cache: false,
                dataType: "json",
                // success => email taken already [for shopperType see cc_shopper.java: SHOPPER_TYPE_...]
                success: function (data) {
                    jsonResponse = data;
                },
                // error => email not taken (available for use)
                error: function () {
                    jsonResponse = null;
                }
            });
        }
        return jsonResponse;
    };

    return this;
});