$(function () {
  PopulateAppsListDropdown ();

  if ($('#app-full-list').length)
    PopulateAppFullList ();

	if ($('#app-profile-icon').length) {
		console.log ("Requesting app json");
		var id = location.pathname.split("/");
		id = id[id.length - 1];
	  $.ajax ({
	    accepts: 'application/json; charset=utf-8',
	    method: 'GET',
	    url: '../app/' + id,
	    success: function (response, status, jqXHR) {
	      console.log ("Receiving app json")

				document.title += ' ' + response.title;

				$('#app-profile-icon')
					.attr ('src', response.icon)
					.attr ('alt', response.title + ' icon');

				$('#app-profile-icon-small')
					.attr ('src', response.icon)
					.attr ('alt', response.title + ' icon');

				if (response.googlePlayLink != undefined)
					$('#app-profile-platform-icons, #app-profile-platform-icons-alt')
						.append ($(document.createElement ('img'))
							.attr ('src', '../img/android-icon.png')
							.attr ('alt', 'android icon')
						);

				if (response.appStoreLink != undefined)
					$('#app-profile-platform-icons, #app-profile-platform-icons-alt')
						.append ($(document.createElement ('img'))
							.attr ('src', '../img/apple-icon.png')
							.attr ('alt', 'apple icon')
						);

				if (response.windowsStoreLink != undefined)
					$('#app-profile-platform-icons, #app-profile-platform-icons-alt')
						.append ($(document.createElement ('img'))
							.attr ('src', '../img/windows-icon.png')
							.attr ('alt', 'windows icon')
						);

				if (response.amazonLink != undefined)
					$('#app-profile-platform-icons, #app-profile-platform-icons-alt')
						.append ($(document.createElement ('img'))
							.attr ('src', '../img/amazon-icon.png')
							.attr ('alt', 'amazon icon')
						);

				if (response.steamLink != undefined)
					$('#app-profile-platform-icons, #app-profile-platform-icons-alt')
						.append ($(document.createElement ('img'))
							.attr ('src', '../img/steam-icon.png')
							.attr ('alt', 'steam icon')
						);

				$('#app-profile-exact-review').append (' ' + response.review);

				$('#app-profile-exact-review-alt').append (' ' + response.review);

				for (var i=0; i<5; i++) {
					if (response.review >= i) {
						$('#app-profile-star-container').append (
							$(document.createElement ('img'))
								.attr ('src', '../img/review-star-on.png')
								.attr ('alt', 'review star')
						);
						$('#app-profile-star-container-alt').append (
							$(document.createElement ('img'))
								.attr ('src', '../img/review-star-on.png')
								.attr ('alt', 'review star')
						);
					} else {
						$('#app-profile-star-container').append (
							$(document.createElement ('img'))
								.attr ('src', '../img/review-star-off.png')
								.attr ('alt', 'review star empty')
						);
						$('#app-profile-star-container-alt').append (
							$(document.createElement ('img'))
								.attr ('src', '../img/review-star-off.png')
								.attr ('alt', 'review star empty')
						);
					}
				}

				$('#app-profile-title').append (response.title);

				$('#app-profile-description').append (response.description);

				$('#app-profile-features').append (response.features);

				if (response.googlePlayLink != undefined)
					$('#app-profile-google-play-link')
						.removeClass ('hidden')
						.attr ('href', response.googlePlayLink)
            .attr ('target', '_blank');

				if (response.appStoreLink != undefined)
					$('#app-profile-app-store-link')
						.removeClass ('hidden')
						.attr ('href', response.appStoreLink)
            .attr ('target', '_blank');

				if (response.windowsStoreLink != undefined)
					$('#app-profile-windows-store-link')
						.removeClass ('hidden')
						.attr ('href', response.windowsStoreLink)
            .attr ('target', '_blank');

				if (response.amazonLink != undefined)
					$('#app-profile-amazon-store-link')
						.removeClass ('hidden')
						.attr ('href', response.amazonLink)
            .attr ('target', '_blank');

				if (response.steamLink != undefined)
					$('#app-profile-steam-store-link')
						.removeClass ('hidden')
						.attr ('href', response.steamLink)
            .attr ('target', '_blank');

				for (var i=0; i<response.screenshots.length; i++)
					$('#screenshot-carousel').append (
						$(document.createElement ('div'))
							.addClass ('carousel-content')
							.append (
								$(document.createElement ('div'))
									.addClass ('screenshot-container')
									.append (
										$(document.createElement ('img'))
											.attr ('src', response.screenshots[i])
											.attr ('alt', 'screenshot')
									)
							)
					);

				var screenshotsContainer = $('#screenshot-carousel-container');

				if (screenshotsContainer.length) {
					var screenshotsCarousel = $('#screenshot-carousel').owlCarousel({
						navigationText: false,
						lazyLoad: true,
						items: 1.5,
						itemsCustom : false,
						itemsDesktop : [1199,1.5],
						itemsDesktopSmall : [980,1.5],
						itemsTablet: [768,1.5],
						itemsTabletSmall: false,
						itemsMobile : [479,1],
						singleItem : false,
						addClassActive: true,
						singleItem: true,
						afterInit: setTimeout(function () {
							var owlData = screenshotsCarousel.data('owlCarousel');
							owlData.updateVars();
							screenshotsContainer.fadeIn(1500);
						}, 800)
					});
				}

	    }
	  });
	}

	// Get carousel images
	$.ajax ({
		accepts: 'application/json; charset=utf-8',
		method: 'GET',
		url: '../all-apps',
		success: function (response, status, jqXHR) {
			for (var i=0; i<response.length; i++) {
				if (response[i].carousel == undefined
          || response[i].carousel == '')
					continue;
				$('#home-carousel').append (
					$(document.createElement ('div'))
						.addClass ('carousel-content')
						.append (
							$(document.createElement ('a'))
								.attr ('href', 'apps/' + response[i].id)
								.append (
									$(document.createElement ('img'))
										.attr ('src', response[i].carousel)
								)
						)
				);
			}

			var owl = $('#home-carousel').owlCarousel({
				navigationText: false,
				lazyLoad: true,
				items: 3,
				itemsCustom : false,
				itemsDesktop : [1199,2],
				itemsDesktopSmall : [980,2],
				itemsTablet: [768,2],
				itemsTabletSmall: false,
				itemsMobile : [479,1],
				singleItem : false,
				addClassActive: true,
				autoPlay: 5000
			});
		}
	});

  if ($('#coming-soon-posts').length) {
		console.log ("Requesting coming soon json");
		var id = location.pathname.split("/");
		id = id[id.length - 1];
	  $.ajax ({
	    accepts: 'application/json; charset=utf-8',
	    method: 'GET',
	    url: '../all-coming-soon',
	    success: function (response, status, jqXHR) {
	      console.log ("Receiving coming soon json");
        for (var i=0; i<response.length; i++)
          $('#coming-soon-posts').append (
            $(document.createElement ('div'))
              .addClass ('column light-grey')
              .append (
                $(document.createElement ('div'))
                  .addClass ('col-xs-3')
                  .append (
                    $(document.createElement ('img'))
                      .addClass ('app-profile-icon')
                      .attr ('src', response[i].icon)
                      .attr ('alt', response[i].title + ' Image')
                  )
              )
              .append (
                $(document.createElement ('div'))
                  .addClass ('col-xs-9')
                  .append (
                    $(document.createElement ('h3'))
                      .append (response[i].title)
                  )
                  .append (
                    $(document.createElement ('p'))
                      .append (response[i].content)
                  )
              ).append (
                $(document.createElement ('div'))
                  .addClass ('clear')
              )
          );
      }
    });
  }

});


/**
 * Populates the app list dropdown with the top 10 new apps requested from the server
 */
function PopulateAppsListDropdown () {
  console.log ("Requesting app list json");
  $.ajax ({
    accepts: 'application/json; charset=utf-8',
    method: 'GET',
    url: '../all-apps',
    success: function (response, status, jqXHR) {
      console.log ("Receiving app list json")
      // For each app in the response, add it to the menu
      for (var i=0; i<Math.min(response.length, 10); i++) {
        // Create the list item
        var listItem = $(document.createElement ('li'));

        // Create the anchor
        var anchor = $(document.createElement ('a'));
        anchor.attr('href', '../apps/' + response[i].id);

        // Add the title
        anchor.append (response[i].title);

        var platforms = $(document.createElement ('span')).addClass ('platform-icons');

        // Add the android icon
        if (response[i].googlePlayLink != undefined) {
          // Create the icon
          var icon = $(document.createElement ('img'));
          icon.attr ('src', '../img/android-icon.png');
          platforms.append (icon);
        }

        // Add the iOS icon
        if (response[i].appStoreLink != undefined) {
          // Create the icon
          var icon = $(document.createElement ('img'));
          icon.attr ('src', '../img/apple-icon.png');
          platforms.append (icon);
        }

        // Add the windows phone icon
        if (response[i].windowsStoreLink != undefined) {
          // Create the icon
          var icon = $(document.createElement ('img'));
          icon.attr ('src', '../img/windows-icon.png');
          platforms.append (icon);
        }

        // Add the amazon apps icon
        if (response[i].amazonLink != undefined) {
          // Create the icon
          var icon = $(document.createElement ('img'));
          icon.attr ('src', '../img/amazon-icon.png');
          platforms.append (icon);
        }

        // Add the steam icon
        if (response[i].steamLink != undefined) {
          // Create the icon
          var icon = $(document.createElement ('img'));
          icon.attr ('src', '../img/steam-icon.png');
          platforms.append (icon);
        }

        anchor.append (platforms);

        // Add the anchor to the list item
        listItem.append (anchor);

        // Add the list item to the dropdown
        $('#app-list-dropdown').append(listItem);
      }

      // Show the number of apps in the list
      $('#app-count-badge').append (response.length);
    }
  });
}

/**
 * Populates the full list of apps
 */
function PopulateAppFullList () {
  console.log ("Requesting app list json");
  $.ajax ({
    accepts: 'application/json; charset=utf-8',
    method: 'GET',
    url: '../all-apps',
    success: function (response, status, jqXHR) {
      console.log ("Receiving app list json")
      // For each app in the response, add it to the menu
      for (var i=0; i<response.length; i++) {

        if (i%2 == 0)
          $('#app-full-list').append (
            $(document.createElement ('div'))
              .addClass ('clear hidden-sm hidden-md hidden-lg')
          );
        if (i%4 == 0)
          $('#app-full-list').append (
            $(document.createElement ('div'))
              .addClass ('clear hidden-xs')
          );

        // Create the container
        var container = $(document.createElement ('div'))
          .addClass ('col-sm-3 col-xs-6 spacer-lg');

        // Create the inner container
        var innerContainer = $(document.createElement ('div'))
          .addClass ('app-list-app');

        // Create the anchor
        var anchor = $(document.createElement ('a'))
          .attr ('href', response[i].id);

        // Create the icon container
        var iconContainer = $(document.createElement ('div'))
          .addClass ('app-list-icon-container');

        // Create the icon
        var icon = $(document.createElement ('img'))
          .attr ('src', response[i].icon)
          .attr ('alt', response[i].title + ' icon');

        // Create the title
        var title = $(document.createElement ('h4'))
          .append (response[i].title);

        // Fit elements together
        iconContainer.append (icon);
        anchor.append (iconContainer);
        anchor.append (title);
        innerContainer.append (anchor);
        container.append (innerContainer);

        // Add to the list
        $('#app-full-list').append (container);
      }

      $('#app-full-list').append (
        $(document.createElement ('div'))
          .addClass ('clear')
      );

      // If no apps have been added
      if (response.length == 0) {
        var alert = $(document.createElement ('div'))
          .addClass ('alert alert-info');
        alert.append (
          $(document.createElement ('p'))
            .append ('No apps have been added to the website yet, please try again later.')
        );
        $('#app-full-list').append (alert);
      }
    }
  });
}
