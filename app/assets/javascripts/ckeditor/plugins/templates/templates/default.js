/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

// Register a templates definition set named "default".
CKEDITOR.addTemplates( 'default', {
    // The name of sub folder which hold the shortcut preview images of the
    // templates.
    imagesPath: CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'templates' ) + 'templates/images/' ),

    // The templates definitions.
    templates: [
        {
            title: 'Full column',
            image: 'full-column.png',
            description: 'Full width, 12 columns.',
            html: '<div class="content-row"><div class="content-row__full-column"><p>Full column</p></div></div>'
        },
        {
            title: 'Two columns',
            image: 'two-columns.png',
            description: 'Two side by side columns, 6 columns.',
            html: '<div class="content-row"><div class="content-row__half-column"><p>Left column</p></div><div class="content-row__half-column"><p>Right column</p></div></div>'
        },
        {
            title: 'Two columns narrow',
            image: 'two-columns.png',
            description: 'Two narrow side by side columns, 3 columns.',
            html: '<div class="content-row"><div class="content-row__quarter-column"><p>Left column</p></div><div class="content-row__quarter-column"><p>Right column</p></div></div>'
        },
        {
            title: 'Left column',
            image: 'left-column.png',
            description: 'Left aligned column, 6 columns.',
            html: '<div class="content-row"><div class="content-row__half-column"><p>Left column</p></div></div>'
        },
        {
            title: 'Right column',
            image: 'right-column.png',
            description: 'Right aligned column, 6 columns.',
            html: '<div class="content-row"><div class="content-row__half-column content-row__half-column--pull-right"><p>Right column</p></div></div>'
        }]
} );
