var COOKIE_NAMES = {
  USER_BANNER_LAST_SEEN: 'user_banner_last_seen'
};

// function that will remove any existing tracking cookies on page load
(function () {
  var cookies = document.cookie.split("; ");
  console.log(cookies);
  for (var c = 0; c < cookies.length; c++) {
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
