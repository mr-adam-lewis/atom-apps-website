$(function () {

	if ($('#app-profile-icon').length) {
		
	}

	var owl = $('#home-carousel').owlCarousel({
		navigationText: false,
		lazyLoad: true,
		items: 3,
		itemsCustom : false,
		itemsDesktop : [1199,3],
		itemsDesktopSmall : [980,3],
		itemsTablet: [768,2],
		itemsTabletSmall: false,
		itemsMobile : [479,1],
		singleItem : false,
		addClassActive: true,
		autoPlay: 5000
	});

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

});
