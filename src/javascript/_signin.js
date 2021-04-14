"use strict";

var NSA = NSA || {};

NSA.signin = {
  form: $('.form-signin'),
  init: function () {
    this.setupEvents();
  },
  setupEvents: function () {
    this.form.on('submit', this, this.handleSubmit);
  },
  handleSubmit: function (e) {

    var $form = $(this);
    var $inputs = $form.find('input').not(':checkbox'), postData = {}, $submitButtons = $(this).find('button:submit'), $submitButton = $submitButtons.eq(0);

    $submitButtons.attr('disabled', 'disabled');

    $submitButton.css('min-width', $submitButton.outerWidth() + 'px')

    $submitButton.find('.loader').removeClass('vh');

    $inputs.each(function() {
      postData[this.name] = $(this).val();
    });

    $('#password').prop('type', 'password').next().removeClass('type-password');

    $.ajax({
      type: 'POST',
      data: postData,
      url: $form.attr('action'),
      context: e.data,
      dataType: 'json',
      success: function (data) {
        if (data.redirect) {
          window.location.href = data.uri;
        } else {
          if (data.isFailedLogin) {
            this.resetValidation($form);
            this.showValidationMessage(data.validationMessages);
            this.showInlineValidation(data.validationMessages);
            $submitButtons.removeAttr('disabled');
            $submitButton.find('.loader').addClass('vh');
          } else {
            gtag('event', 'Successful login', {
              event_category: 'Login',
              event_label: getParameterByName('clientid'),
            });
            this.buildFormAndSubmit(data);
          }
        }
      },
      error: function() {
        this.resetValidation($form);
        this.showValidationMessage();
        $submitButtons.removeAttr('disabled');
        $submitButton.find('.loader').addClass('vh');
      }
    });
    e.preventDefault();
  },
  resetValidation: function ($form) {

    $('.govuk-error-summary').remove();

    var $formGroups = $form.find('.govuk-form-group');

    $formGroups.each(function () {
      var $field = $(this).find('input').eq(0);
      if ($(this).hasClass('govuk-form-group--error')) {
        $(this).removeClass('govuk-form-group--error');
        $(this).find('span.govuk-error-message').remove();
        $field.removeAttr('aria-describedby').removeAttr('aria-invalid');
      }
    });
  },

  showValidationMessage: function (messages) {

    var $div = $('<div />').attr('class', 'govuk-error-summary govuk-!-margin-top-6').attr('role', 'alert').attr('tabindex', '-1').attr('aria-labelledby', 'error-summary-title');
    var $h2 = $('<h2 />').attr('class', 'govuk-error-summary__title').attr('id', 'error-summary');
    var $ulContainer = $('<div />').attr('class', 'govuk-error-summary__body');
    var $ul = $('<ul />').attr('class', 'govuk-list govuk-error-summary__list');

    if (messages) {
      $h2.text('Information missing or incorrect');
      $.each(messages, function (index, value) {
        if (index === 'loginError') {
          index = 'username';
          gtag('event', 'Failed login', {
            event_category: 'Login',
            event_label: 'Users login credentials were wrong',
          });
        }
        var $a = $('<a />').attr('class', 'govuk-link').attr('href', '#' + index).text(value);
        var $li = $('<li />').append($a);
        $ul.append($li);
      });

    } else {
      $h2.text('There has been an error');
      var $li = $('<li />').html('Please try again later. If the problem continues, follow the link to <a href="https://help.signin.education.gov.uk/contact/form">submit a support request</a>');
      $ul.append($li);
      gtag('event', 'Error occurred', {
        event_category: 'Login',
        event_label: 'A server error occurred during login',
      });
    }

    $div.append($h2).append($ulContainer.append($ul));
    $('main').prepend($div);

    $('html, body').animate({
      scrollTop: $div.offset().top - 15
    }, 300);

  },
  showInlineValidation: function(messages) {

    $.each(messages, function( index, value ) {
      var $field = $('input[name=' + index + ']'),
        $parent = $field.parent();

      if ($parent.hasClass('show-password')) {
        $parent = $parent.parent();
      }

      var $label = $parent.find('label').first();

      if (!$parent.hasClass('govuk-form-group--error')) {

        var errorMessage = $('<span class="govuk-body">')
          .html(value)
          .prop('class', 'govuk-error-message')
          .prop('id', 'validation-' + index);
      }

      $label.after(errorMessage);
      $parent.addClass('govuk-form-group--error');
      $field.attr({
        'aria-describedby' : 'validation-' + index,
        'aria-invalid': 'true'
      });

    });

  },
  buildFormAndSubmit: function (data) {

    var $form = $('<form />').attr({
      method: 'post',
      action: data.destination,
      id: 'dfesigninform'
    });

    $.each(data.postbackData, function( index, value ) {
      var $field = $('<input />').attr({
        type: 'hidden',
        name: index,
        value: value
      });
      $form.append($field);
    });

    $('#dfesigninform').remove();
    $('body').append($form);
    $form.submit();
  },
};

if ($('.form-signin').length > 0) {
  NSA.signin.init();
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
