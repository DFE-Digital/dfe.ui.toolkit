var COOKIE_NAMES = {
  USER_BANNER_LAST_SEEN: 'user_banner_last_seen'
};

var GOVUK_COOKIE_OPTIONS = {
  expires: 365, // days
  secure: true,
  domain: '.education.gov.uk'
};

var GovUKCookie = {
  getRaw: function (name) {
    if (!window.Cookies) {
      return;
    }

    return window.Cookies.get(name);
  },
  get: function (name) {
    if (!window.Cookies) {
      return;
    }

    var value = window.Cookies.get(name);
    if (value) {
      return JSON.parse(value);
    }
    return value;
  },
  set: function (name, value) {
    if (!window.Cookies) {
      return;
    }

    return window.Cookies.set(
      name,
      value,
      GOVUK_COOKIE_OPTIONS
    );
  },
  remove: function (name) {
    if (!window.Cookies) {
      return;
    }

    return window.Cookies.remove(
      name,
      GOVUK_COOKIE_OPTIONS
    );
  }
};

// function that will remove any existing tracking cookies on page load
(function () {
  var cookies = document.cookie.split("; ");
  for (var c = 0; c < cookies.length; c++) {
    // skip if it is the review users banner
    if(cookies[c].indexOf(COOKIE_NAMES.USER_BANNER_LAST_SEEN) !== 0) {
      console.log(cookies[c]);
      var d = window.location.hostname.split(".");
      while (d.length > 0) {
          var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
          var p = location.pathname.split('/');
          document.cookie = cookieBase + '/';
          while (p.length > 0) {
              document.cookie = cookieBase + p.join('/');
              p.pop();
          };
          d.shift();
      }
    }
  }
})();


/**
 * Section to handle review users banner
 * It uses a dedicated cookie 'user_banner_last_seen'
 */

function checkConditionForUsersBanner() {
  var lastSeen = GovUKCookie.getRaw(COOKIE_NAMES.USER_BANNER_LAST_SEEN);
  if (!!lastSeen) {
    var numberOfDays = (new Date().getTime() - lastSeen) / (1000 * 3600 * 24);
    if (numberOfDays > 90) {
      // if the period is longer than 90 days show/update the banner
      return true;
    }
  } else {
    // if there is no value then show/update the banner
    return true;
  }
  return false;
}

function showReviewUsersBanner() {
  $('#review-users-banner').show();
}

function setReviewUsersBannerLastSeen() {
  GovUKCookie.set(COOKIE_NAMES.USER_BANNER_LAST_SEEN, new Date().getTime());
}

function loadReviewUsersBanner() {
  if (checkConditionForUsersBanner()) {
    showReviewUsersBanner();
  }
}

function updateCookieReviewUsersBanner() {
  if (checkConditionForUsersBanner()) {
    setReviewUsersBannerLastSeen();
  }
}
