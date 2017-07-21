"use strict";
/**
 * Created by merry on 2017/6/16.
 *
 * SelfServe.CreateAccount component
 */
MBC.app.rg_cp("SelfServe.CreateAccount", {
    'ajax': 'plugin.ajax',
    'forgotPassword': 'plugin.forgot-password',
    'validation': 'plugin.account-validator'
}, function (scope) {
    var timer;

    function validateEmail(requiredError, invalidError, existError, emailField) {
        var email = emailField.val();
        if (email) {
            var strRegex = /^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i;
            if (strRegex.test(email)) {
                var emailExist = scope.validation.checkEmailExist(email);
                if (emailExist) {
                    invalidError.hide();
                    existError.show();
                    return MBC.constant.EXIST;
                }
                existError.hide();
                invalidError.hide();
                return MBC.constant.VALID;
            } else {
                existError.hide();
                invalidError.show();
                return MBC.constant.INVALID;
            }
        } else {
            invalidError.show();
            requiredError.show();
            return MBC.constant.EMPTY;
        }
    }

    function validateFormEventHandler() {
        clearTimeout(timer);
        var lastName = $(".account-form__input[data-check=lastName]"),
            firstName = $(".account-form__input[data-check=firstName]"),
            email = $(".account-form__input[data-check=email]"),
            password = $(".account-form__input[data-check=password-rule]"),
            confirmPassword = $(".account-form__input[data-check=password-confirm]"),
            referredEmail = $(".account-form__input[data-check=email-referred]");

        var $requiredError = $(".account__errors-item--required"),
            passwordError = $(".account__errors-item--password"),
            confirmPwdError = $(".account__errors-item--confirm-password"),
            referredByError = $(".account__errors-item--referred-by"),
            emailExistError = $(".account__errors-email-exist"),
            emailInvalidError = $(".account__errors-email-invalid"),
            $errorList = $(".account__errors-list");

        var lastNameResult = scope.validation.validateRequired($requiredError, lastName),
            firstNameResult = scope.validation.validateRequired($requiredError, firstName),
            emailResult = validateEmail($requiredError, emailInvalidError, emailExistError, email),
            passwordResult = scope.validation.validatePassword($requiredError, passwordError, password),
            confirmPwdResult = scope.validation.validateConfirmPwd($requiredError, confirmPwdError, password, confirmPassword),
            referredEmailResult = scope.validation.validateEmail($requiredError, referredByError, referredEmail);

        var invalidClass = "invalid";
        //show all errors
        $errorList.show();
        //highlight all inputs
        $(".account-form__input").each(function () {
            $(scope).addClass(invalidClass);
        });

        //hide highlight if valid
        if (lastNameResult === MBC.constant.VALID) {
            lastName.removeClass(invalidClass);
        }
        if (firstNameResult === MBC.constant.VALID) {
            firstName.removeClass(invalidClass);
        }
        if (emailResult === MBC.constant.VALID) {
            email.removeClass(invalidClass);
        }
        if (passwordResult === MBC.constant.VALID) {
            password.removeClass(invalidClass);
        }
        if (confirmPwdResult === MBC.constant.VALID) {
            confirmPassword.removeClass(invalidClass);
        }
        if (referredEmailResult === MBC.constant.EMPTY || referredEmailResult === MBC.constant.VALID) {
            referredEmail.removeClass(invalidClass);
        }
        //hide required error if all not empty
        if (lastNameResult !== MBC.constant.EMPTY && firstNameResult !== MBC.constant.EMPTY && emailResult !== MBC.constant.EMPTY
            && passwordResult !== MBC.constant.EMPTY && confirmPwdResult !== MBC.constant.EMPTY) {
            $requiredError.hide();
        }
        //hide all errors if all valid
        if (lastNameResult === MBC.constant.VALID && firstNameResult === MBC.constant.VALID &&
            emailResult !== MBC.constant.EMPTY
            && passwordResult === MBC.constant.VALID && confirmPwdResult === MBC.constant.VALID &&
            (referredEmailResult === MBC.constant.EMPTY || referredEmailResult === MBC.constant.VALID)) {
            $errorList.hide();
            if (emailResult === MBC.constant.VALID) {
                $(".create-account__form").submit();
            } else {
                $('body').animate({scrollTop: 80}, 1000);
            }
        } else {
            $('body').animate({scrollTop: 80}, 1000);
        }

        timer = setTimeout(function () {
            $(".account__errors-list").fadeOut(3000);
            emailExistError.fadeOut(3000);
            emailInvalidError.fadeOut(3000);
            $(".account-form__input").each(function () {
                $(scope).removeClass(invalidClass);
            });
        }, 30000);
    }

    function validateEmailEventHandler() {
        var existError = $(".account__errors-email-exist"),
            invalidError = $(".account__errors-email-invalid"),
            requiredError = $(".account__errors-item--required");
        $(scope).addClass("invalid");
        var result = validateEmail(requiredError, invalidError, existError, $(this));
        if (result === MBC.constant.VALID) {
            $(scope).removeClass("invalid");
        }
    }

    function bindEvent() {
        //validate all fields for create account page when submit
        scope.registerEvent('mousedown', '.create-account__form #submit_button', validateFormEventHandler);
        scope.registerEvent('focusout', '.create-account__form #user_email', validateEmailEventHandler);
        scope.registerEvent('click', '.account__password-forgot', scope.forgotPassword.handler);
    }

    scope.init = function () {
        $('#cp_id').html(scope.name);
    };
});
