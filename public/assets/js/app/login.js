"use strict";
/**
 * Login component
 *
 * @author ericw
 * @since 7/20/17
 */
MBC.app.rg_cp("SelfServe.Login", {
    'forgotPassword': 'plugin.forgot-password',
    'validation': 'plugin.account-validator'
}, function (scope) {

    function validateFormEventHandler() {
        var password = $(".login-form__input[data-check=password]"),
            email = $(".login-form__input[data-check=email]"),
            requiredError = $(".account__errors-item--required"),
            emailError = $(".account__errors-item--email");
        var emailResult = scope.validation.validateEmail(requiredError, emailError, email);
        var passwordResult = scope.validation.validateRequired(requiredError, password);

        $(".account__errors-list").show();
        password.addClass("invalid");
        email.addClass("invalid");

        if (emailResult === MBC.constant.VALID) {
            email.removeClass("invalid");
        }
        if (passwordResult === MBC.constant.VALID) {
            password.removeClass("invalid");
        }
        if (emailResult !== MBC.constant.EMPTY && passwordResult !== MBC.constant.EMPTY) {
            requiredError.hide();
        }
        if (emailResult === MBC.constant.VALID && passwordResult === MBC.constant.VALID) {
            $(".login__form .account__errors-list").hide();
            return true;
        }

        $('body').animate({scrollTop: 80}, 1000);
        return false;
    }

    this.init = function() {
        $('#cp_id').html(scope.name);
    }
});
