/*
 * @file SlickCarousel plugin. Plugin to manage Slick Carousels in CKEditor
 *		 Version 0.7
 * Copyright (C) 2016 Uritec SL
*/

/* globals CKEDITOR */

 (function() {
	'use strict';

	CKEDITOR.plugins.add( 'slickcarousel', {
		lang : 'en,es', // 'en' always the first one to use it as default
		requires: 'widget,dialog',
		icons: 'slickcarousel',

		onLoad: function() {
			CKEDITOR.addCss(
				'.carousel-preview {' +
				'	max-width: 100%;' +
				'	max-height: 100%;' +
				'	height: auto;' +
				'	left: 0;' +
				'	top: 0;' +
				'	z-index: -1;' +
				'	bottom: 0;' +
				'	right: 0;' +
				'	margin: auto;' +
				'	opacity: 0.3;' +
				'}' +
				'.carousel-text {' +
				'	text-align: center;' +
				'	font-size: 250%;' +
				'	position: absolute;' +
				'	top: 0;' +
				'	bottom: 0;' +
				'	margin: auto;' +
				'	left: 0;' +
				'	right: 0;' +
				'	height: 1.6em;' +
				'	color: #333;' +
				'	text-shadow: 2px 1px #fff, -2px -2px #fff;' +
				'}'
			);
		},

		init: function( editor ) {
			// Translations, texts
			var lang = editor.lang.slickcarousel;

			if (!editor.config.slickcarousel)
				editor.config.slickcarousel =
				{
					stylesheets : [ 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.css', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.css' ],
					scripts : [ 'https://code.jquery.com/jquery-1.12.3.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js' ]
				};

			//  Create the widget definition
			editor.widgets.add( 'slickcarousel', {
				button: lang.toolbarButton,

				allowedContent: 'div(!slickcarousel)[data-images];img[!src,alt];ul[id,!data-slick];script[type,src];link[href,rel,type];li;h3;iframe[!src,width,height,frameborder,allowfullscreen]',
				disallowedContent: 'img[width,height]{width,height}',
        requiredContent: 'div(slickcarousel)',

				dialog: 'slickcarousel',
				pathName: 'carousel',

				init: function() {
					var widget = this;
					var sSettings = this.element.getAttribute('data-slicksettings');
					if (sSettings) {
						this.element.removeAttribute('data-slicksettings');
						var settings = parseJsonAttribute(sSettings);

						// loop through all the items
						Object.keys(settings).forEach(function(key, index) {
							widget.setData(key, settings[ key ]);
						});

						//this.setData( 'settings', JSON.parse(sSettings) );
					}

					var sImages = this.element.getAttribute('data-images');
					if (sImages) {
						this.setData( 'images', parseJsonAttribute(sImages) );
					}
				},

				data: function() {
					// Validate/generate Id
					this.getId();

					// Put gallery id as title:
					this.element.getFirst().setText( this.data.id.replace( '_', ' ' ) );

					// Put the first image as preview
					var last = this.element.getLast();
					if (last.getName() == 'img')
						last.remove();

					if (this.data.images.length) {
						var data = this.data.images[ 0 ];
						var img = new CKEDITOR.dom.element('img');
						img.setAttribute( 'src', CKEDITOR.plugins.slickcarousel.getImagePreviewSrc( data ) );
						img.setAttribute( 'class', 'carousel-preview' );
						this.element.append( img );
						//this.element.setStyle('height', data.height + 'px');
					} else {
						//this.element.setStyle('height', '100px');
					}
				},

				defaults: {
					images: [],
					autoplay: true,
					autoplaySpeed : 3000,
					cssEase : 'ease',
					slidesToShow: 1,
					slidesToScroll: 1,
					speed: 300
				},

				template:'<div class="slickcarousel">' +
							'<div class="carousel-text">Image Carousel</div>' +
						'</div>',


				// Detect in the input HTML that it's our widget
				upcast: function( element ) {
					if (element.name != 'div' || !element.hasClass( 'slickcarousel' ))
						return;

					/*
					// Move settings data up to the main div.
					var settings = element.children[ 0 ].attributes[ 'data-slicksettings' ];
					element.attributes[ 'data-slicksettings' ] = settings;
					*/
					// put the content for preview in editor
					element.children.length = 0;
					var placeholder = new CKEDITOR.htmlParser.element('div', { 'class': 'carousel-text' });
					placeholder.add( new CKEDITOR.htmlParser.text( 'Image Carousel' ) );
					element.add(placeholder);

					return element; // eslint-disable-line consistent-return
				},

				// Generates the output HTML
				downcast: function( el ) {
					var theData = this.data;
					var settings = {};
					Object.keys(theData).forEach(function(key, index) {
						if (key == 'classes')
							return;
						if (key == 'images')
							return;
						var value = theData[ key ];
						if (typeof value == 'object' || typeof value == 'function')
							return;

						settings[ key ] = value;
					});

					el.attributes[ 'data-images' ] = generateJsonAttribute( this.data.images );
					el.attributes[ 'data-slicksettings' ] = generateJsonAttribute( settings );
					el.children.length = 0;

					var ul = new CKEDITOR.htmlParser.element( 'ul' );
					ul.attributes.id = this.data.id;
					el.add(ul);

					var images = this.data.images,
						videoIds = [],
						i;
					for (i = 0; i < images.length;  i++) {
						var li = new CKEDITOR.htmlParser.element('li');
						ul.add( li );

						var data = images[ i ];
						if (data.type == 'image') {
							var img = new CKEDITOR.htmlParser.element('img', { 'src': data.url } );
							li.add(img);
						} else {
							var id = this.data.id + '_video' + i;
							videoIds.push( id );
							li.attributes[ 'data-type' ] = data.type;

							var iframe = new CKEDITOR.htmlParser.element('iframe', {
								'src': data.url,
								'width': data.width,
								'height': data.height,
								'allowfullscreen': '',
								'frameborder': '0',
								'allowscriptaccess': 'always',
								'id': id
							} );

							var div =  new CKEDITOR.htmlParser.element('div', {
								'class': 'slick-video'
							} );
							div.add(iframe);

							li.add(div);
						}
						if (data.title) {
							var title = new CKEDITOR.htmlParser.element('h3');
							title.add( new CKEDITOR.htmlParser.text( data.title ) );
							li.add(title);
						}
					}
					var config = editor.config.slickcarousel;

					// Stylesheet:
					for (i = 0; i < config.stylesheets.length; i++ ) {
						el.add( new CKEDITOR.htmlParser.element('link', { 'rel': 'stylesheet', 'type': 'text/css', 'href': config.stylesheets[ i ] } ) );
					}

					// Scripts:
					for (i = 0; i < config.scripts.length; i++ ) {
						el.add( new CKEDITOR.htmlParser.element('script', { 'type': 'text/javascript', 'src': config.scripts[ i ] } ) );
					}

					var script = ' var $gallery = $("#' + this.data.id + '");\r\n' +
						'var settings = $gallery.parent().attr("data-slicksettings");\r\n' +
						'$gallery.slick(JSON.parse(decodeURIComponent(settings)));\r\n';

					if (videoIds.length) {
						// When the slide changes, pause any video on the carrousel (using its API)
						script += ' $gallery.on("beforeChange", function(event, slick, currentSlide, nextSlide){\r\n' +
							' var slide = slick.$slides[ currentSlide ];\r\n' +
							' var type = slide.getAttribute("data-type");\r\n' +
							' if (type == "image" || !type) return;\r\n' +
							' sendVideoCommand(slide, type, "pause");\r\n' +
							'});\r\n';
						/*
						// autoplay for videos. requires improved functionality to detect duration, etc...
						script += ' $gallery.on("afterChange", function(event, slick, currentSlide){\r\n' +
							' var slide = slick.$slides[ currentSlide ];\r\n' +
							' var type = slide.getAttribute("data-type");\r\n' +
							' if (type == "image") return;\r\n' +
							' sendVideoCommand(slide, type, "play");\r\n' +
							'});\r\n';
						*/
						script += 'function sendVideoCommand(el, type, command) {\r\n' +
							'	var w = el.firstElementChild.firstElementChild.contentWindow;\r\n' +
							'	if (type == "youtube")\r\n' +
							'		w.postMessage(\'{"event":"command","func": "\' + command + \'Video","args":""}\', \'*\');\r\n' +
							'	if (type == "vimeo")\r\n' +
							'		postVimeoCommand(w, command, "");\r\n' +
							'}\r\n';

						script += 'var vimeoOrigin = "*";\r\n' +
							'function postVimeoCommand(w, action, value) {\r\n' +
							'	var data = { method: action };\r\n' +
							'	if (value) \r\n' +
							'		data.value = value;\r\n' +
							'	w.postMessage(JSON.stringify(data), vimeoOrigin);\r\n' +
							'}\r\n';
					}

					/*
					to use document ready enable this:
          */
					script = '$(document).ready(function(){ \r\n' +
						script +
					'});\r\n';

					var initScript = new CKEDITOR.htmlParser.element('script', { 'type': 'text/javascript' });
					initScript.add( new CKEDITOR.htmlParser.text( script ) );
					el.add( initScript );

					return el;
				},

				// Generates a unique Id for our usage
				getId : function() {
					var counter = 0;
					while (!isIdUnique(editor, this)) {
						counter++;
						this.data.id = 'Carousel_' + counter;
					}
					return this.data.id;
				}
			} );

			// Register our dialog
			CKEDITOR.dialog.add( 'slickcarousel', this.path + 'dialogs/slickcarousel.js' );

			// For integration with the dropdownmenumanager
			var command = editor.getCommand('slickcarousel');
			command.requiredCssSelector = '.slickcarousel';

		}, // Init

		afterInit : function(editor) {

			// Expand the editor to provide controlled dialogs.
			editor.openNestedDialog = function( dialogName, callbackOpen, callbackOK ) {
				var onOk = function() {
					releaseHandlers( this );
					if (callbackOK)
						callbackOK( this );
				};
				var onCancel = function() {
					releaseHandlers( this );
				};
				var releaseHandlers = function( dialog ) {
					dialog.removeListener( 'ok', onOk );
					dialog.removeListener( 'cancel', onCancel );
				};
				var bindToDialog = function( dialog ) {
					dialog.on( 'ok', onOk );
					dialog.on( 'cancel', onCancel );
					if (callbackOpen)
						callbackOpen( dialog );
				};

				if ( editor._.storedDialogs[ dialogName ])
					bindToDialog( editor._.storedDialogs[ dialogName ] );
				else {
					CKEDITOR.on( 'dialogDefinition', function( e ) {
						if ( e.data.name != dialogName )
							return;

						var definition = e.data.definition;

						e.removeListener();
						if (typeof definition.onLoad == 'function') {
							definition.onLoad = CKEDITOR.tools.override( definition.onLoad, function( original ) {
								return function() {
									definition.onLoad = original;
									if ( typeof original == 'function' )
										original.call( this );
									bindToDialog( this );
								};
							} );
						} else {
							definition.onLoad = function() {
								bindToDialog( this );
							};
						}

					});
				}

				editor.openDialog( dialogName );
			};
		}

	} );

	function parseJsonAttribute( text ) {
		//var decoded = text.replace(/'/g, '"');
		var decoded = decodeURIComponent(text);
		try {
			return JSON.parse(decoded);
		} catch (e) {
			alert('Invalid data: ' + text);
			return null;
		}
	}

	function generateJsonAttribute( data ) {
		var text = JSON.stringify( data );
		return encodeURIComponent( text );
	}

	// Check that the id is unique
	function isIdUnique(editor, widget) {
		if (!widget.data.id)
			return false;

		var unique = true;
		var repository = editor.widgets.instances;
		Object.keys(repository).forEach(function(key, index) {
			var otherWidget = repository[ key ];
			if (otherWidget == widget || otherWidget.name != widget.name)
				return;
			// If it's the same on a different widget (maybe it has been copied), create a new one
			if (otherWidget.data.id == widget.data.id)
				unique = false;
		});
		return unique;
	}

	CKEDITOR.plugins.slickcarousel = {
		getImagePreviewSrc : function( data ) {
			if (data.type == 'image')
				return data.url;

			var match;
			if (data.type == 'youtube') {
				match = data.url.match(/\/embed\/(.+?)\?/);
				if (match) {
					return 'https://img.youtube.com/vi/' +  match[1] + '/0.jpg';
				}
			}

			return 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><path d="M66.184 44.715l-24.837-15.06c-.338-.198-.75-.21-1.092-.02-.344.192-.552.546-.552.93v30.126c0 .386.208.745.552.935.166.092.348.133.53.133.194 0 .387-.047.562-.152l24.836-15.063c.315-.193.51-.537.51-.91 0-.375-.194-.724-.51-.918z"/><path d="M2 13.215v63.158h5.438c1.225-3.62 4.67-6.24 8.732-6.24 4.066 0 7.513 2.62 8.738 6.24H98V13.215H2zm48 57.63c-14.476 0-26.208-11.66-26.208-26.048 0-14.388 11.73-26.053 26.208-26.053 14.472 0 26.215 11.665 26.215 26.053 0 14.39-11.743 26.047-26.215 26.047zM7.03 78.152H2v3.64h5.307c-.227-.79-.352-1.628-.352-2.503 0-.386.028-.763.074-1.138zM25.39 79.29c0 .874-.13 1.712-.358 2.503H98v-3.64H25.31c.047.374.08.75.08 1.136z"/><path d="M16.17 71.79c-4.167 0-7.543 3.358-7.543 7.5 0 4.15 3.376 7.495 7.543 7.495s7.543-3.346 7.543-7.496c0-4.142-3.377-7.5-7.543-7.5zm0 10.987c-1.93 0-3.496-1.563-3.496-3.488 0-1.917 1.564-3.48 3.496-3.48 1.937 0 3.5 1.563 3.5 3.48 0 1.925-1.563 3.487-3.5 3.487z"/></g></svg>');
		}
	};

	// Enable link elements (stylesheet) in the contents
	CKEDITOR.dtd.div.link = 1;

})();
