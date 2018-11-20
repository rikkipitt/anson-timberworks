/*
 * @file SlickCarousel plugin. Plugin to manage Slick Carousels in CKEditor
 *		 Dialog
 * Copyright (C) 2016 Uritec SL
*/

/* globals CKEDITOR, jQuery */

CKEDITOR.editor.prototype.prompt = function( title, msg, value, okCallback ) {
	var editor = this;

	editor.openNestedDialog( 'prompt', function(dialog) {
		dialog.parts.title.setText( title );
		dialog.getContentElement( 'info', 'message' ).getElement().setHtml( msg );
		var input = dialog.getContentElement( 'info', 'input' );
		input.getElement().show();
		input.setValue( value );
		input.setInitValue();
	}, function(dialog) {
		var value = dialog.getContentElement( 'info', 'input' ).getValue();
		okCallback( value );
	} );
};

CKEDITOR.dialog.add( 'prompt', function( /*editor*/ ) {
	return {
		title : 'Title',
		minWidth : 270,
		minHeight : 60,
		contents : [
			{
				id : 'info',
				elements :
				[
					{
						type: 'html',
						html: '',
						id: 'message'
					},
					{
						type: 'text',
						id: 'input'
					}
				]
			}
		]
	};
} );


CKEDITOR.dialog.add( 'slickcarousel', function( editor ) {
	'use strict';
	var lang = editor.lang.slickcarousel,
		mainId = 'GalleryMain' + CKEDITOR.tools.getNextNumber(),
		main,
		$main,
		currentDiv,
		theDialog;

	// Inject stylesheet for placeholder
	var node = CKEDITOR.document.getHead().append( 'style' );
	node.setAttribute( 'type', 'text/css' );
	var content = '';
	content += '.cke_reset_all b { font-weight: bold;}';
	content += '.slickcarousel-wrapper { height: 182px; width:600px; overflow-x: auto; overflow-y:hidden; box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.16), 0px 2px 10px 0px rgba(0,0,0,0.12) inset;}';
	content += '.slickcarousel-wrapper>div { height: 100%;}';
	content += '.slickcarousel-wrapper .slickcarousel-asset, .slickcarousel-wrapper .slickcarousel-placeholder {margin:6px; width:200px; height:150px; display:inline-block; position:relative}';
	content += '.slickcarousel-wrapper .slickcarousel-placeholder {background-color: #BBFFBB; outline: 1px dashed #666666;}';
	content += '.slickcarousel-wrapper .slickcarousel-selected { box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); background-color: #c5defc;}';
	content += '.slickcarousel-wrapper img { max-width: 100%; max-height: 100%; height: auto; width: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto;}';
	content += 'a.cke_disabled { pointer-events: none; opacity: 0.6; }';

	if (CKEDITOR.env.ie && CKEDITOR.env.version < 11)
		node.$.styleSheet.cssText = content;
	else
		node.$.innerHTML = content;

	// Load jQuery
	var dialogLoaded = false;
	if (typeof jQuery == 'undefined')
		CKEDITOR.scriptLoader.load('https://code.jquery.com/jquery-1.12.3.min.js', loadjQueryUi);
	else {
		if (typeof jQuery.ui == 'undefined')
			loadjQueryUi();
	}

	function loadjQueryUi() {
		CKEDITOR.scriptLoader.load('https://code.jquery.com/ui/1.11.4/jquery-ui.min.js', function() {
			if (dialogLoaded)
				init();
		});
	}

	// dialog.onInit, waiting also to have jQuery ready
	function init() {
		dialogLoaded = true;

		// We will call back when jQuery is ready
		if (typeof jQuery == 'undefined')
			return;

		if (typeof jQuery.ui == 'undefined')
			return;

		main = document.getElementById( mainId );

		$main = jQuery( main );
		$main.sortable({
			containment: $main,
			placeholder: 'slickcarousel-placeholder',
			revert:60,
			tolerance:'pointer' ,
			/*start: function() { },*/
			stop: function() { adjustMovementButtons(); }
		});
		// $main.disableSelection();

		// Select any asset when clicking on it
		$main.on('click', 'div', function(e) {
			selectAsset(this);
		});

		// Reset selection if clicking on the container
		$main.on('click', function(e) {
			if (e.target == main)
				selectAsset(null);
		});

		$main.on('dblclick', function(e) {
			if (e.target != main)
				return;

			var browse = theDialog.getContentElement('assets', 'browse');
			browse.click();
		});
	}

	// Enable/disable the bottons to move an asset to left/right according to its siblings
	function adjustMovementButtons() {
		var btnMoveToLeft = theDialog.getContentElement('assets', 'btnMoveToLeft');
		var btnMoveToRight = theDialog.getContentElement('assets', 'btnMoveToRight');

		if (currentDiv && currentDiv.nextElementSibling)
			btnMoveToRight.enable();
		else
			btnMoveToRight.disable();

		if (currentDiv && currentDiv.previousElementSibling)
			btnMoveToLeft.enable();
		else
			btnMoveToLeft.disable();
	}

	// Adds a new item to the carrousel
	function addAsset( data ) {
		// https://www.youtube.com/yt/brand/downloads.html
		// https://vimeo.com/about/brand_guidelines
		// https://thenounproject.com/term/video-player/17327/
		var img = document.createElement('img');
		if (!data.width) {
			img.onload = function() {
				data.width = img.naturalWidth;
				data.height = img.naturalHeight;
				div.setAttribute('data-asset', JSON.stringify(data) );
			};
		} else {
			img.width = data.width;
			img.height = data.height;
		}
		img.src = CKEDITOR.plugins.slickcarousel.getImagePreviewSrc( data );

		var div = document.createElement('div');
		div.appendChild(img);
		div.className = 'slickcarousel-asset';
		div.setAttribute('data-asset', JSON.stringify(data) );
		if (!main.firstElementChild) {
			main.appendChild( div );
		} else {
			var after = currentDiv || main.lastElementChild;
			insertAfter(div, after);
		}

		selectAsset( div );
	}

	// Updates the title of the current div
	function updateTitle(iTitle) {
		if (!currentDiv)
			return;

		var value = iTitle.getValue();
		var data = JSON.parse(currentDiv.getAttribute('data-asset'));
		data.title = value;
		currentDiv.setAttribute('data-asset', JSON.stringify(data) );
		currentDiv.setAttribute('title', value);
	}

	function selectAsset(div) {
		var iTitle = theDialog.getContentElement('assets', 'txtTitle');
		var fldProperties = theDialog.getContentElement('assets', 'fldProperties');
		//var bRemove = dialog.getContentElement('assets', 'btnRemove');

		if (currentDiv) {
			updateTitle(iTitle);
			currentDiv.classList.remove('slickcarousel-selected');
		}
		currentDiv = div;
		var title = '';
		if (currentDiv) {
			currentDiv.classList.add('slickcarousel-selected');
			currentDiv.scrollIntoView();
			var data = JSON.parse(div.getAttribute('data-asset'));
			title = data.title || '';
			fldProperties.getElement().$.style.visibility = 'visible';
		} else {
			fldProperties.getElement().$.style.visibility = 'hidden';
		}
		iTitle.setValue( title );
		iTitle.focus();
		adjustMovementButtons();
	}

	// Process the code that has been pasted to insert a video
	function addVideo( text ) {
		var url,
			width = 640,
			height = 360;

		var match = text.match(/ src="(.+?)"/);
		if (match) {
			url = match[1];
			var mWidth =  text.match(/ width="(\d+?)"/);
			if (mWidth)
				width = parseInt( mWidth[1] );
			var mHeight =  text.match(/ height="(\d+?)"/);
			if (mHeight)
				height = parseInt( mHeight[1] );
		}
		if (!url) {
			// https://www.youtube.com/watch?v=JGNiafLl0iA
			// <iframe width="640" height="360" src="https://www.youtube.com/embed/JGNiafLl0iA?rel=0" frameborder="0" allowfullscreen></iframe>
			match = text.match(/youtube.*v=(.+?)($|&|#)/);
			if (match) {
				url = 'https://www.youtube.com/embed/' + match[1] + '?rel=0';
			}
		}
		if (!url) {
			// https://vimeo.com/6004944
			// <iframe src="https://player.vimeo.com/video/6004944" width="640" height="360" frameborder="0" allowfullscreen></iframe>

			match = text.match(/https:\/\/vimeo.com\/(.+?)$/);
			if (match) {
				url = 'https://player.vimeo.com/video/' + match[1];
			}
		}

		if (!url) {
			alert( lang.videoNotDetected );
			return;
		}

		var youtube,
			vimeo;
		if (/youtube/.test(url)) {
			youtube = true;
			url += '&enablejsapi=1&version=3&playerapiid=ytplayer';
		}
		if (/vimeo/.test(url)) {
			vimeo = true;
			url += '?api=1';
		}

		var data = {
			url: url,
			width: width,
			height: height
		};
		if (youtube)
			data.type = 'youtube';
		if (vimeo)
			data.type = 'vimeo';

		addAsset( data );
	}

	// DOM helper
	function insertAfter(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}

	var columnWidths = [ '190px', '260px', '130px' ];
	var column2Widths = [ '130px', '130px' ];
	var labelStyle = 'display:block; padding-top:5px';
	var checkboxStyle = 'margin-top: 6px; vertical-align: bottom;';

	return {
		title: lang.dialogTitle,
		minWidth: 600,
		minHeight: 390,
		contents: [
			{
				id: 'assets', // Main assets tab
				label: lang.assets,
				elements: [
					// Dialog window UI elements.
					{
						id: 'preview',
						type: 'html',
						html: '<div class="slickcarousel-title">' + lang.carouselContents + '</div>' +
							'<div class="slickcarousel-wrapper"><div id="' + mainId + '"></div></div>',
						setup: function( widget ) {
							if (!main)
								main = document.getElementById( mainId );

							var title = main.parentNode.previousElementSibling;
							title.textContent = widget.getId().replace('_', ' ');

							var carouselImages = widget.data.images;
							for (var i = 0; i < carouselImages.length; i++) {
								addAsset( carouselImages[ i ] );
							}
							selectAsset(main.firstElementChild);
							//console.log( "setup", this, widget.data );
						},
						commit: function( widget ) {
							var carouselImages = [];
							var div = main.firstElementChild;
							while (div) {
								carouselImages.push( JSON.parse(div.getAttribute('data-asset') ));
								div = div.nextElementSibling;
							}
							widget.setData( 'images', carouselImages );
							//console.log( "commit", this, widget.data );
						}
					},
					{
						type: 'fieldset',
						label: lang.assetProperties,
						id : 'fldProperties',
						style: 'border:1px solid #CCC',
						children :
						[
							{
								id: 'txtUrl',
								type: 'text',
								hidden: true
							},
							{
								id: 'txtTitle',
								type: 'text',
								labelLayout : 'horizontal',
								labelStyle: 'display:block; padding-top:4px',
								widths: [ '70px','530px' ],
								label: lang.labelTitle,
								onBlur: function(e) {
									updateTitle(this);
								}
							},
							{
								type: 'hbox',
								style: 'margin-top:1em;',
								widths: [ '100px','100px','380px' ],
								children:
								[
									{
										id: 'btnMoveToLeft',
										type: 'button',
										label: lang.moveToLeft,
										onClick: function(e) {
											var current = currentDiv;
											if (!current)
												return;

											var previous = current.previousElementSibling;
											if (!previous)
												return;
											current.parentNode.insertBefore(current, previous);
											current.scrollIntoView();
											adjustMovementButtons();
										}
									},
									{
										id: 'btnMoveToRight',
										type: 'button',
										label: lang.moveToRight,
										onClick: function(e) {
											var current = currentDiv;
											if (!current)
												return;

											var next = current.nextElementSibling;
											if (!next)
												return;
											current.parentNode.insertBefore(next, current);
											current.scrollIntoView();
											adjustMovementButtons();
										}
									},
									{
										id: 'btnRemove',
										type: 'button',
										style: 'float: right',
										label: lang.remove,
										onClick: function(e) {
											var current = currentDiv;
											if (!current)
												return;

											selectAsset(current.nextElementSibling || current.previousElementSibling);
											main.removeChild(current);
											adjustMovementButtons();
										}
									}
								]
							}
						]
					},
					{
						type: 'hbox',
						style: 'margin-top:1em;',
						widths: [ '140px','140px','300px' ],
						children: [
							{
								type: 'button',
								id: 'browse',
								align: 'center',
								label: lang.addImage,
								hidden: true,
								filebrowser : {
									action : 'Browse',
                  url : '/ckeditor/pictures',
									target: 'assets:txtUrl',
									onSelect : function(url/*, msg, data*/) {
										var data = {
											url: url,
											type: 'image'
										};
										addAsset( data );

										return false;
									}
								}
							},
							{
								id: 'btnVideo',
								type: 'button',
								label: lang.addVideo,
								onClick: function(e) {
									editor.prompt( lang.addVideo, lang.pasteVideoCode, '', addVideo );
								}
							},
							{
								type: 'html',
								html: '&nbsp;'
							}
						]
					}
				]
			},
			{
				id: 'settings', // Settings tab
				label: lang.settings,
				elements: [
					{
						type:'hbox',
						widths: columnWidths,
						children :  [
							{
								id: 'slidesToScroll',
								type: 'text',
								widths: [ '100px', '80px' ],
								width: '50px',
								labelLayout : 'horizontal',
								labelStyle: labelStyle,
								label: lang.slidesToScroll,
								validate: CKEDITOR.dialog.validate.number( lang.slidesToScrollInvalid ),
								setup: function( widget ) {
									this.setValue( widget.data.slidesToScroll );
								},
								commit: function( widget ) {
									widget.setData( 'slidesToScroll', parseInt(this.getValue(), 10) );
								}
							},
							{
								id: 'autoplaySpeed',
								type: 'text',
								widths: column2Widths,
								width: '100px',
								labelLayout : 'horizontal',
								labelStyle: labelStyle,
								label: lang.autoplaySpeed,
								validate: CKEDITOR.dialog.validate.number( lang.autoplaySpeedInvalid ),
								setup: function( widget ) {
									this.setValue( widget.data.autoplaySpeed );
								},
								commit: function( widget ) {
									widget.setData( 'autoplaySpeed', parseInt(this.getValue(), 10) );
								}
							},
							{
								id: 'autoplay',
								type: 'checkbox',
								inputStyle: checkboxStyle,
								label: lang.autoplay,
								setup: function( widget ) {
									this.setValue( widget.data.autoplay );
								},
								commit: function( widget ) {
									widget.setData( 'autoplay', this.getValue() );
								}
							}
						]
					},
					{
						type:'hbox',
						widths: columnWidths,
						children :  [
							{
								id: 'slidesToShow',
								type: 'text',
								widths: [ '100px', '80px' ],
								width: '50px',
								labelLayout : 'horizontal',
								labelStyle: labelStyle,
								label: lang.slidesToShow,
								validate: CKEDITOR.dialog.validate.number( lang.slidesToShowInvalid ),
								setup: function( widget ) {
									this.setValue( widget.data.slidesToShow );
								},
								commit: function( widget ) {
									widget.setData( 'slidesToShow', parseInt(this.getValue(), 10) );
								}
							},
							{
								id: 'cssEase',
								type: 'select',
								widths: column2Widths,
								width: '100px',
								inputStyle : 'width:100px;',
								labelLayout : 'horizontal',
								labelStyle: labelStyle,
								label: lang.easing,
								items: [
									[ lang.easingEase, 'ease' ],
									[ lang.easingLinear, 'linear' ],
									[ lang.easingIn, 'ease-in' ],
									[ lang.easingOut, 'ease-out' ],
									[ lang.easingInOut, 'ease-in-out' ]

								],
								setup: function( widget ) {
									this.setValue( widget.data.cssEase );
								},
								commit: function( widget ) {
									widget.setData( 'cssEase', this.getValue() );
								}
							},
							{
								id: 'centerMode',
								type: 'checkbox',
								inputStyle: checkboxStyle,
								label: lang.centerMode,
								setup: function( widget ) {
									this.setValue( widget.data.centerMode );
								},
								commit: function( widget ) {
									widget.setData( 'centerMode', this.getValue() );
								}
							}
						]
					},
					{
						type:'hbox',
						widths: columnWidths,
						children :  [
							{
								id: 'speed',
								type: 'text',
								widths: [ '100px', '80px' ],
								width: '50px',
								labelLayout : 'horizontal',
								labelStyle: labelStyle,
								label: lang.speed,
								validate: CKEDITOR.dialog.validate.number( lang.speedInvalid ),
								setup: function( widget ) {
									this.setValue( widget.data.speed );
								},
								commit: function( widget ) {
									widget.setData( 'speed', parseInt(this.getValue(), 10) );
								}
							},
							{
								id: 'asNavFor',
								type: 'select',
								widths: column2Widths,
								width: '100px',
								inputStyle : 'width:100px;',
								labelLayout : 'horizontal',
								labelStyle: labelStyle,
								label: lang.asNavFor,
								items: [
									[ lang.noNavFor, '' ]
								],
								setup: function( widget ) {
									var otherCarousels = [];
									var repository = editor.widgets.instances;
									Object.keys(repository).forEach(function(key, index) {
										var otherWidget = repository[ key ];
										if (otherWidget == widget || otherWidget.name != widget.name)
											return;
										// If it's the same on a different widget (maybe it has been copied), create a new one
										otherCarousels.push( otherWidget.data.id );
									});

									var select = this.getInputElement().$;

									while (select.options.length > 1) {
										select.remove(1);
									}

									for (var i = 0; i < otherCarousels.length; i++) {
										var opt = document.createElement('option');
										opt.text = otherCarousels[i].replace('_', ' ');
										opt.value = '#' + otherCarousels[i];

										select.add(opt, null);
									}

									this.setValue( widget.data.asNavFor || '' );
								},
								commit: function( widget ) {
									widget.setData( 'asNavFor', this.getValue() );
								}
							},
							{
								id: 'dots',
								type: 'checkbox',
								label: lang.showNavigation,
								inputStyle: checkboxStyle,
								setup: function( widget ) {
									this.setValue( widget.data.dots );
								},
								commit: function( widget ) {
									widget.setData( 'dots', this.getValue() );
								}
							}
						]
					},
					{
						type: 'html',
						html: '<fieldset style="white-space: normal; border: 1px solid #CCC"><legend>' + lang.settingsHelpTitle + '</legend>' +
							lang.settingsHelpContent +
							'</fieldset>'
					}
				]
			}
		],
		onLoad : init,
		onShow : function() {
			theDialog = this;
		},
		onHide : function() {
			main.innerHTML = '';
		}

	};
} );

