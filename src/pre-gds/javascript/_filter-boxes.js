"use strict";

var NSA = NSA || {};
var filterBoxes = $('.filter-box');

NSA.filters = {
  init: function () {
    filterBoxes.each(function () {
      var $that = $(this),
          header = $that.find('.container-head'),
          title = header.find('.option-select-label'),
          checkboxes = $that.find('input:checkbox'),
          button = $('<button />').addClass('js-container-head'),
          checkCount = $('<div />').addClass('js-selected-counter');

      button.on('click', function (e) {
        var options = $(this).next();
        if ($(this).hasClass('closed')) {
          options.show();
          $(this)
            .removeClass('closed')
            .attr('aria-expanded', true);
        } else {
          options.hide();
          $(this)
            .addClass('closed')
            .attr('aria-expanded', false);
        }
        e.preventDefault();
      }).append(title, checkCount);

      header.replaceWith(button);

      checkboxes.on('change', function () {
        checkCount.text(function() {
          return checkboxes.filter(':checked').length > 0 ? checkboxes.filter(':checked').length + ' selected' : '';
        });
      });
    });
  }
}

if (filterBoxes.length > 0) {
  NSA.filters.init();
}
