$(document).ready(function ($) {
	function morphDropdown(element) {
		this.element = element;
		this.mainNavigation = this.element.find('.main-nav');
		this.mainNavigationItems = this.mainNavigation.find('.has-dropdown');
		this.dropdownList = this.element.find('.dropdown-list');
		this.dropdownWrappers = this.dropdownList.find('.dropdown');
		this.dropdownItems = this.dropdownList.find('.content');
		this.dropdownBg = this.dropdownList.find('.bg-layer');
		this.mq = this.checkMq();
		this.bindEvents();
	}

	morphDropdown.prototype.checkMq = function () {
		//check screen size
		let self = this;
		return window.getComputedStyle(self.element.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
	};

	morphDropdown.prototype.bindEvents = function () {
		let self = this;
		//hover over an item in the main navigation
		this.mainNavigationItems.mouseenter(function (event) {
			//hover over one of the nav items -> show dropdown
			self.showDropdown($(this));
		}).mouseleave(function () {
			setTimeout(function () {
				//if not hovering over a nav item or a dropdown -> hide dropdown
				if (self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0) self.hideDropdown();
			}, 50);
		});

		//hover over the dropdown
		this.dropdownList.mouseleave(function () {
			setTimeout(function () {
				//if not hovering over a dropdown or a nav item -> hide dropdown
				(self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0) && self.hideDropdown();
			}, 50);
		});

		//click on an item in the main navigation -> open a dropdown on a touch device
		this.mainNavigationItems.on('click', function (event) {
			let selectedDropdown = self.dropdownList.find('#' + $(this).data('content'));
			if (!self.element.hasClass('is-dropdown-visible') || !selectedDropdown.hasClass('active')) {
				event.preventDefault();
				self.showDropdown($(this));
			}
		});

		//on small screens, open navigation clicking on the menu icon
		this.element.on('click', '.nav-trigger', function (event) {
			event.preventDefault();
			self.element.toggleClass('nav-open');
		});
	};

	morphDropdown.prototype.showDropdown = function (item) {
		this.mq = this.checkMq();
		if (this.mq == 'desktop') {
			let self = this;
			let selectedDropdown = this.dropdownList.find('#' + item.data('content')),
				selectedDropdownHeight = selectedDropdown.innerHeight(),
				selectedDropdownWidth = selectedDropdown.children('.content').innerWidth(),
				selectedDropdownLeft = item.offset().left - item.parent().offset().left + item.innerWidth() / 2 - selectedDropdownWidth / 2;

			//update dropdown position and size
			this.updateDropdown(selectedDropdown, parseInt(selectedDropdownHeight), selectedDropdownWidth, parseInt(selectedDropdownLeft));
			//add active class to the proper dropdown item
			this.element.find('.active').removeClass('active');
			selectedDropdown.addClass('active').removeClass('move-left move-right').prevAll().addClass('move-left').end().nextAll().addClass('move-right');
			item.addClass('active');
			//show the dropdown wrapper if not visible yet
			if (!this.element.hasClass('is-dropdown-visible')) {
				setTimeout(function () {
					self.element.addClass('is-dropdown-visible');
				}, 10);
			}
		}
	};

	morphDropdown.prototype.updateDropdown = function (dropdownItem, height, width, left) {
		this.dropdownList.css({
			'-moz-transform': 'translateX(' + left + 'px)',
			'-webkit-transform': 'translateX(' + left + 'px)',
			'-ms-transform': 'translateX(' + left + 'px)',
			'-o-transform': 'translateX(' + left + 'px)',
			'transform': 'translateX(' + left + 'px)',
			'width': width + 'px',
			'height': height + 'px'
		});

		this.dropdownBg.css({
			'-moz-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-webkit-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-ms-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'-o-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
			'transform': 'scaleX(' + width + ') scaleY(' + height + ')'
		});
	};

	morphDropdown.prototype.hideDropdown = function () {
		this.mq = this.checkMq();
		if (this.mq == 'desktop') {
			this.element.removeClass('is-dropdown-visible').find('.active').removeClass('active').end().find('.move-left').removeClass('move-left').end().find('.move-right').removeClass('move-right');
		}
	};

	morphDropdown.prototype.resetDropdown = function () {
		this.mq = this.checkMq();
		if (this.mq == 'mobile') {
			this.dropdownList.removeAttr('style');
		}
	};

	let morphDropdowns = [];
	if ($('.cd-morph-dropdown').length > 0) {
		$('.cd-morph-dropdown').each(function () {
			//create a morphDropdown object for each .cd-morph-dropdown
			morphDropdowns.push(new morphDropdown($(this)));
		});

		let resizing = false;

		//on resize, reset dropdown style property
		updateDropdownPosition();
		$(window).on('resize', function () {
			if (!resizing) {
				resizing = true;
				(!window.requestAnimationFrame) ? setTimeout(updateDropdownPosition, 300) : window.requestAnimationFrame(updateDropdownPosition);
			}
		});

		function updateDropdownPosition() {
			morphDropdowns.forEach(function (element) {
				element.resetDropdown();
			});

			resizing = false;
		};
	}

	$('.label').click(function () {
		$(this).next('.content').slideToggle();
		$(this).parent().siblings().find('.label').next('.content').slideUp();
	});

	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			$('header').css('background-color', 'white');
		} else {
			$('header').css('background-color', 'transparent');
		}
	});

	$('.blog_slider').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: false,
		dots: true,
		speed: 300,
		infinite: true,
		autoplaySpeed: 5000,
		autoplay: true,
		responsive: [
			{
				breakpoint: 1200,
				settings: "unslick"
			},
			{
				breakpoint: 1199,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	});



	$('.integration_api_stack_imgstop').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		infinite: true,
		speed: 1500,
		autoplaySpeed: 0,
		autoplay: true,
		cssEase: "linear",
		responsive: [
			{
				breakpoint: 992,
				settings: "unslick"
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 375,
				settings: {
					slidesToShow: 2,
				}
			},
		]
	});

	$('.integration_api_stack_imgbottom').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		speed: 2200,
		infinite: true,
		autoplaySpeed: 0,
		autoplay: true,
		cssEase: "linear",
		responsive: [
			{
				breakpoint: 992,
				settings: "unslick"
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 375,
				settings: {
					slidesToShow: 2,
				}
			},
		]
	});

	equalheight = function (container) {

		var currentTallest = 0,
			currentRowStart = 0,
			rowDivs = new Array(),
			$el,
			topPosition = 0;
		$(container).each(function () {

			$el = $(this);
			$($el).height('auto')
			topPostion = $el.position().top;

			if (currentRowStart != topPostion) {
				for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
					rowDivs[currentDiv].height(currentTallest);
				}
				rowDivs.length = 0; // empty the array
				currentRowStart = topPostion;
				currentTallest = $el.height();
				rowDivs.push($el);
			} else {
				rowDivs.push($el);
				currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
			}
			for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
				rowDivs[currentDiv].height(currentTallest);
			}
		});
	}

	$(window).on('load', function () {
		equalheight('.blog_card_img');
	});


	$(window).resize(function () {
		equalheight('.blog_card_img');
	});

	var equalHeight = function () {
		//  the height of each column is reset to default calculated by browser
		$('.learn_feature_card_title').css('height', 'auto');
		var maxHeight = 0;
		// get the maximum height
		$('.learn_feature_card_title').each(function () {
			if ($(this).height() > maxHeight) {
				maxHeight = $(this).height();
			}
		});
		// the maximum height is set to each height of column
		$('.learn_feature_card_title').css('height', maxHeight);
	};
	//  equal height set on page load
	equalHeight();
	// equal height set when the container of these columns is resized
	$(window).resize(function () {
		equalHeight();
	});


	let counted = 0;
	$(window).scroll(function () {

		const oTop = $('.empower').offset().top - window.innerHeight;
		if (counted == 0 && $(window).scrollTop() > oTop) {
			$('.count').each(function () {
				const $this = $(this),
					countTo = $this.attr('data-count');
				let decimal = 0;
				if ($this.text().indexOf(".") > 0) {
					decimal = $this.text().toString().split(".")[1].length;
				}

				$({
					countNum: $this.text().indexOf(".") > 0 ? $this.text().toString().split(".")[1].length : $this.text()
				}).animate({
					countNum: countTo
				},

					{

						duration: 2000,
						easing: 'swing',
						step: function () {
							let num = this.countNum;
							console.log(num);
							$this.text(Number(num).toFixed(decimal));
						},
						complete: function () {
							let num = this.countNum;
							$this.text(Number(num).toFixed(decimal));
						}

					});
			});
			counted = 1;
		}

	});


});
