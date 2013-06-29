// jQuery No-Wysiwyg plug-in
// by pansay web development, www.pansay.com
// original source: http://github.com/pansay/nowysiwyg
// example:

    // Nowysiwyg.custom.whatever = function () {
    //     return 'whatever';
    // }

    // Nowysiwyg.buttons.z = function (el) {
    //     that.addTag('z', el);
    // }

    // Nowysiwyg.buttons.w = function (el) {
    //     alert(that.custom.whatever());
    // }

    // $('textarea').nowysiwyg({
    //     buttons: {
    //         'top': ['b', 'i'],
    //         'right': ['i', 'b'],
    //         'bottom': ['i','z','w'],
    //         'left': ['b','i','p']
    //     }
    // });

(function (window, $) {

    var Nowysiwyg = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data('nowysiwyg-options');
        that = this;
    };

    Nowysiwyg.prototype = {

        defaults: {

            // the buttons definition
            buttons: {
                'top': ['tbl', 'hr', 'ax', 'a', 'pr', 'p'],
                'right': ['h6', 'h5', 'h4', 'h3'],
                'bottom': ['rq', 'lq', 'rqf', 'lqf', 'bq', 'bqq'],
                'left': ['b', 'i', 'uc']
            },

            // buttons size in px
            size: 25,   

            // class to add to the wrapper div
            wrapperClass: 'nowysiwyg-wrapper',

            // styles for the wrapper div
            stylesWrapper: {
                'display': 'block',
                'position': 'relative'
            },

            // styles that the wrapper div inherits from the textarea
            stylesWrapperInherited: [
                'width',
                'height',
                'margin-top',
                'margin-right',
                'margin-bottom',
                'margin-left'
            ],

            // styles applied  to the textarea
            stylesTextarea: {
                'position': 'absolute',
                'margin-top': '0',
                'margin-right': '0',
                'margin-bottom': '0',
                'margin-left': '0'
            },

            // styles of the textarea that will be saved and reapplied on remove
            stylesTextareaSaved: {

            },

            // should not change too often...
            sides: [
                'top', 
                'right',
                'bottom',
                'left'
            ],

            // opposite sides
            oppositeSides: {
                'top': 'bottom',
                'right': 'left',
                'bottom': 'top',
                'left': 'right'
            },

            // next sides used for size border to be done on group and not buttons to avoid double borders
            nextSides: {
                'top': 'right',
                'right': 'bottom',
                'bottom': 'left',
                'left': 'top'
            },

            // previous sides: each side gets positioned absolutely with the previous side's name as property 0
            previousSides: {
                'top': 'left',
                'right': 'top',
                'bottom': 'right',
                'left': 'bottom'
            },

            // styles common to all the 4 buttons sets (for the 4 sides)
            stylesButtonsSetsCommon: {
                'position': 'absolute',
                'display': 'table'
            },

            // styles for buttons sets, per side
            stylesButtonsSets: {
            },

            // styles for the buttons
            stylesButtonsCommon: {
                'display': 'table',
                'float' : 'left'
            },

            // styles for the buttons inner span
            stylesButtonsCommonInner: {
                'display': 'table-cell',
                'text-align': 'center',
                'vertical-align': 'middle',
                'cursor': 'pointer'
            },

            // styles of buttons, mouse off, sets the left-hand property of the buttons to inherit the value of the right-hand property of the textarea
            stylesButtonsCommonInnerInheritedOff: {
                'background-color': 'background-color',
                'color': 'color'
            },

            // styles of buttons, mouse on, sets the left-hand property of the buttons to inherit the value of the right-hand property of the textarea
            stylesButtonsCommonInnerInheritedOn: {
                'background-color': 'color',
                'color': 'background-color'
            },

            // styles of buttons, mouse off
            stylesButtonsCommonInnerOff: {
             
            },

            // styles of buttons, mouse on
            stylesButtonsCommonInnerOn: {
                
            },

            // styles of buttons, by side
            stylesButtons: {
            },          

            // styles of the buttons sets, inherited from the textarea
            stylesInherited: [
                'font-family',
                'font-size'
            ],

            // styles of the borders, used for all sides, pattern: border-[style]-[side]
            stylesInheritedBorders: [
                'color', 
                'style',
                'width'
            ]

        },

        init: function () {

            this.config = $.extend(true, {}, this.defaults, this.options, this.metadata);

            this.removePrevious();

            this.setStyles();
            
            this.create();

            this.handleResize();

            return this;

        },

        removePrevious: function () {

            if (typeof(this.$elem.data('saved-styles')) != 'undefined') {
                this.$elem.siblings('ul').remove();
                this.$elem.unwrap(this.config.wrapperClass);
                var stylesTextareaSaved = this.$elem.data('saved-styles');
                this.$elem.css(stylesTextareaSaved);
            }

        },

        // combine all the common, defined and inherited styles for all the sides of all the elements
        setStyles: function () {

            // buttons size
            var size = this.config.size;

            // buttons width and height
            this.config.stylesButtonsCommonInner.width = size + 'px';
            this.config.stylesButtonsCommonInner.height = size + 'px';

            // var to be used in the styles definitions loops
            var styleName;

            // save previous textarea styles
            for (var styleName in this.config.stylesTextarea) {
                this.config.stylesTextareaSaved[styleName] = this.$elem.css(styleName);
            }

            // style the buttons sets common
            while (styleName = this.config.stylesInherited.pop()) {
                this.config.stylesButtonsSetsCommon[styleName] = this.$elem.css(styleName);
            }

            // style the wrapper
            while (styleName = this.config.stylesWrapperInherited.pop()) {
                this.config.stylesWrapper[styleName] = this.$elem.css(styleName);
            }

            // style the buttons inner off
            for (var styleName in this.config.stylesButtonsCommonInnerInheritedOff) {
                var styleNameGet = this.config.stylesButtonsCommonInnerInheritedOff[styleName];
                this.config.stylesButtonsCommonInnerOff[styleName] = this.$elem.css(styleNameGet);
            }

            // style the buttons inner on
            for (var styleName in this.config.stylesButtonsCommonInnerInheritedOn) {
                var styleNameGet = this.config.stylesButtonsCommonInnerInheritedOn[styleName];
                this.config.stylesButtonsCommonInnerOn[styleName] = this.$elem.css(styleNameGet);
            }

            // style the buttons sets
            for (var sidesI = 0, sidesL = this.config.sides.length; sidesI < sidesL; sidesI += 1) {
                var side = this.config.sides[sidesI];
                var nextSide = this.config.nextSides[side];
                var previousSide = this.config.previousSides[side];

                this.config.stylesButtonsSets[side] = {};

                $.extend(true, this.config.stylesButtonsSets[side], this.config.stylesButtonsSetsCommon);

                // name of the border width style for the side
                var styleName = 'border-' + side + '-width';

                // size of the textarea border
                var borderSize = parseInt(this.$elem.css(styleName));

                // fix width for left and right sides
                if(side == 'left' || side == 'right') {
                    this.config.stylesButtonsSets[side].width = size + borderSize + 'px';
                }

                // position the buttons sets
                this.config.stylesButtonsSets[side][previousSide] = 0;
                this.config.stylesButtonsSets[side][side] = '-' + (size + borderSize) + 'px';

                this.config.stylesButtons[side] = $.extend(true, {}, this.config.stylesButtonsCommon, this.config.stylesButtons[side]);

                // loop inherited styles
                for (var stylesI = 0, stylesL = this.config.stylesInheritedBorders.length; stylesI < stylesL; stylesI += 1) {

                    var borderStyleName = this.config.stylesInheritedBorders[stylesI];

                    // get the style of the textarea side we're on. we'll use it on the three remaining sides to cover, one on the buttons sets and two on the actual buttons
                    var styleName = 'border-' + side + '-' + borderStyleName;
                    var styleTextareaBorder = this.$elem.css(styleName);

                    // the next side to be set at the buttons set level
                    var styleNameNext = 'border-' + nextSide + '-' + borderStyleName;

                    this.config.stylesButtonsSets[side][styleNameNext] = styleTextareaBorder;

                    // style the buttons
                    for (var buttonSidesI = 0; buttonSidesI < sidesL; buttonSidesI += 1) {

                        var buttonSide = this.config.sides[buttonSidesI]

                        // style the two remaining sides
                        if(buttonSide != this.config.oppositeSides[side] && buttonSide != this.config.nextSides[side]) {
                            var styleName = 'border-' + buttonSide + '-' + borderStyleName;
                            this.config.stylesButtons[side][styleName] = styleTextareaBorder;
                        }
                        
                    }

                }

            }

        },

        create: function () {

            // create wrapper around the textarea
            var $wrapper = this.$elem.wrap('<div class="' + this.config.wrapperClass + '">').parent()
                .css(this.config.stylesWrapper);

            //style the textarea
            this.$elem
                .css(this.config.stylesTextarea)
                .data('saved-styles', this.config.stylesTextareaSaved);

            // the buttons sets for the 4 sides
            var $buttonsSets = {};

            // loop the 4 sides
            var side;
            while (side = this.config.sides.pop()) {

                // create each side's buttons set and style it
                $buttonsSets[side] =  $('<ul></ul>')
                    .css(this.config.stylesButtonsSets[side]);

                // add the buttons for each side
                var button;
                while (button = this.config.buttons[side].pop()) {
                    var $button = this.createButton(button, side);
                    $buttonsSets[side].append($button);
                }

                // append each side to the wrapper
                $wrapper.append($buttonsSets[side]);
                
            }
        },

        createButton: function (button, side) {

            return $('<li><span></span></li>')
                .data('no-wysiwyg-button-name', button)
                .css(this.config.stylesButtons[side])
                .find('span')
                    .css(this.config.stylesButtonsCommonInner)
                    .text(button)
                    .hover(function () {
                        $(this).css(that.config.stylesButtonsCommonInnerOn);
                    }, function () {
                        $(this).css(that.config.stylesButtonsCommonInnerOff);
                    })
                    .end()
                .on('click', function () {
                    var buttonName = $(this).data('no-wysiwyg-button-name');
                    that.buttons[buttonName]($(this).closest('div').find('textarea')[0]);
                })
            ;

        },

        // take care of the textarea resize event
        handleResize: function () {

            this.$elem
                .on('mouseup', function () {
                    if (this.oldwidth  === null) {
                        this.oldwidth = this.style.width;
                    }
                    if (this.oldheight === null) {
                        this.oldheight = this.style.height;
                    }
                    if (this.style.width != this.oldwidth || this.style.height != this.oldheight) {
                        $(this).trigger('resize');
                        this.oldwidth  = this.style.width;
                        this.oldheight = this.style.height;
                    }
                })
                .on('resize', function () {
                    $(this).nowysiwyg(that.options);
                })
            ;

        },

        // ZZ TODO rereading at here. add addHTML for, quotes etc + prep images 

            //         buttons: {
            //     'top': ['tbl', 'hr', 'ax', 'a', 'pr', 'p'],
            //     'right': ['h6', 'h5', 'h4', 'h3'],
            //     'bottom': ['rq', 'lq', 'rqf', 'lqf', 'bq', 'bqq'],
            //     'left': ['b', 'i', 'uc']
            // },


        addTag: function(tag, el, attributes) {

            var attrString = '';
            if (typeof(attributes) != 'undefined') {

                for(var attr in options) {
                    attrString += ' ' + attr + '="' + attributes[attr] + '"';
                }

            }

            var tagBefore = "<" + tag + attrString +">";
            var tagAfter = "</" + tag + ">";
            
            if (el.setSelectionRange) {
                var scrollTop = el.scrollTop;
                var textBefore = el.value.substring(0,el.selectionStart);
                var textSelected = el.value.substring(el.selectionStart,el.selectionEnd);
                var textAfter = el.value.substring(el.selectionEnd,el.value.length);
                el.value = textBefore + tagBefore + textSelected + tagAfter + textAfter;
                el.scrollTop = scrollTop;
            }   
            else {
                var selectedText = document.selection.createRange().text;
                if (selectedText != "") {
                    var newText = tagBefore + selectedText + tagAfter;
                    document.selection.createRange().text = newText;
                }
                else {
                    el.value = el.value + tagBefore + tagAfter;
                }
            }

        },

        buttons: {

            b: function (el) {
                that.addTag('strong', el);
            },

            i: function (el) {
                that.addTag('em', el);
            },

            uc: function (el) {
                var options = {
                    'class': 'uppercase'
                };
                that.addTag('strong', el, options);
            },

            p: function (el) {
                that.addTag('p', el);
            },

            bq: function (el) {
                that.addTag('blockquote', el);
            },

            h3: function (el) {
                that.addTag('h3', el);
            },

            h4: function (el) {
                that.addTag('h4', el);
            },

            h5: function (el) {
                that.addTag('h5', el);
            },

            h6: function (el) {
                that.addTag('h6', el);
            },

            a: function (el) {

                var attributes = {
                    'href': ''
                };

                that.addTag('a', el, attributes);

            },

            ax: function (el) {

                var attributes = {
                    'href': '',
                    'rel': 'external',
                    'class': 'external',
                    'target': '_blank'
                };

                that.addTag('a', el, attributes);

            }


        },

        custom: {

        }

    }

    Nowysiwyg.buttons = Nowysiwyg.prototype.buttons;
    Nowysiwyg.defaults = Nowysiwyg.prototype.defaults;
    Nowysiwyg.custom = Nowysiwyg.prototype.custom;

    $.fn.nowysiwyg = function (options) {

        return this.each(function () {
          new Nowysiwyg(this, options).init();
        });

    };

    window.Nowysiwyg = Nowysiwyg;

}) (window, jQuery);
