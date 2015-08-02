$(function () {
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
		afterMove : updateCarousel
	});

	updateCarousel();
});

function updateCarousel() {
	var centreX = $(window).width() / 2.0;
	var maxHeight = $('#home-carousel').height();
	var centreY = maxHeight / 2.0;
	var maxDist = centreX;
	var items = $('#home-carousel .active');
	$.each(items, function (i, obj) {
		return; // TODO
		obj = $(obj);
		var x = obj.offset().left + obj.width() / 2.0;
		var y = obj.position().top + obj.height() / 2.0;
		var dist = Math.abs(x - centreX);
		var scale = 1.0 - dist / maxDist;
		var ratio = maxHeight / obj.height();
		var originalWidth = obj.width() * ratio;
		var width = scale * originalWidth;
		var height = scale * maxHeight;
		x += (obj.width() - width) / 2.0;
		y += (obj.height() - height) / 2.0;
		obj.css({top: y, left: x, width: width, height: height});
	});
}