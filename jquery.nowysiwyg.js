// jQuery plug-in
// title: Nowysiwyg
// author: Jan Krepelka, jan.krepelka@gmail.com, www.pansay.com
// description: provides non-wysiwyg content edition buttons, to add html code to textareas.
// license: bugger-off
// date: 2013
// usage: 
//  Nowysiwyg.buttons.z = function (el) {
//   that.addTag('z', el);  // custom buttons
//  }

// $('textarea').nowysiwyg({
//     // options
//     buttons: {
//         'top': ['b', 'i'],
//         'right': ['i', 'b'],
//         'bottom': ['i','z'],
//         'left': ['b']
//     }
// }); TEST

(function (window, $) {

    var Nowysiwyg = function (elem, options){
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
                'top': ['b', 'i','p','bq'],
                'right': [],
                'bottom': [],
                'left': []
            },

            wrapperClass: 'nowysiwyg-wrapper',

            // styles for the wrapper element
            stylesWrapper: {
                'display': 'block',
                'position': 'relative'
            },

            stylesWrapperInherited: [
                'width',
                'height',
                'margin-top',
                'margin-right',
                'margin-bottom',
                'margin-left',
            ],

            stylesTextarea: {
                'position': 'absolute',
                'margin': '0'
            },

            // should not change too often...
            sides: [
                'top', 
                'right',
                'bottom',
                'left'
            ],

            oppositeSides: {
                'top': 'bottom',
                'right': 'left',
                'bottom': 'top',
                'left': 'right'
            },

            // used for size border to be done on group and not buttons to avoid double borders
            nextSides: {
                'top': 'right',
                'right': 'bottom',
                'bottom': 'left',
                'left': 'top'
            },

            // styles common to all the 4 buttons sets (for the 4 sides)
            stylesButtonsSetsCommon: {
                'position': 'absolute',
                'display': 'table'
            },

            // buttons set styles per side
            stylesButtonsSets: {
                'top': {
                    'left': '0',
                    'top': '-27px',
                    'height': '25px'
                }, 
                'right': {
                    'right': '-25px',
                    'top': '0',
                    'width': '25px'
                },
                'bottom':{
                    'bottom': '-27px',
                    'right': '0px',
                    'height': '25px'
                },
                'left': {
                    'left': '-25px',
                    'top': '0px',
                    'width': '25px'
                }
            },

            stylesButtonsCommon: {
                'display': 'table',
                'float' : 'left'
            },

            stylesButtonsCommonInner: {
                'width': '25px',
                'display': 'table-cell',
                'height': '25px',
                'text-align': 'center',
                'vertical-align': 'middle',
                'cursor': 'pointer'
            },

            // sets the left-hand property of the button to inherit the value of the right-hand property of the textarea
            stylesButtonsCommonInnerInheritedOff: {
                'background-color': 'background-color',
                'color': 'color'
            },

            // inverted colors
            stylesButtonsCommonInnerInheritedOn: {
                'background-color': 'color',
                'color': 'background-color'
            },

            stylesButtonsCommonInnerOff: {
             
            },

            stylesButtonsCommonInnerOn: {
                
            },

            stylesButtons: {
                // 'top': {
                   
                // }, 
                // 'right': {
                   
                // },
                // 'bottom':{
                    
                // },
                // 'left': {
                    
                // }
            },          

            // styles to inherit
            stylesInherited: [
                'font-family',
                'font-size'
            ],

            // to be applied for the 4 borders, border-[X]-[side]
            stylesInheritedBorders: [
                'color', 
                'style',
                'width'
            ],

        },

        init: function () {

            this.config = $.extend(true, {}, this.defaults, this.options, this.metadata);

            this.setStyles();
            
            this.create();

            return this;

        },

        // combine all the common, defined and inherited styles for all the sides
        setStyles: function () {

            // loop defined list of styles, retrieve style from input element
            var styleName;

            while (styleName = this.config.stylesInherited.pop()) {
                this.config.stylesButtonsSetsCommon[styleName] = this.$elem.css(styleName);
            }

            while (styleName = this.config.stylesWrapperInherited.pop()) {
                this.config.stylesWrapper[styleName] = this.$elem.css(styleName);
            }

            // style the buttons hover
            for (var styleName in this.config.stylesButtonsCommonInnerInheritedOff) {
                var styleNameGet = this.config.stylesButtonsCommonInnerInheritedOff[styleName];
                this.config.stylesButtonsCommonInnerOff[styleName] = this.$elem.css(styleNameGet);
            }

            for (var styleName in this.config.stylesButtonsCommonInnerInheritedOn) {
                var styleNameGet = this.config.stylesButtonsCommonInnerInheritedOn[styleName];
                this.config.stylesButtonsCommonInnerOn[styleName] = this.$elem.css(styleNameGet);
            }

            // style the buttons sets
            for (var sidesI = 0, sidesL = this.config.sides.length; sidesI < sidesL; sidesI += 1) {
                var side = this.config.sides[sidesI];
                $.extend(true, this.config.stylesButtonsSets[side], this.config.stylesButtonsSetsCommon);
                this.config.stylesButtons[side] = $.extend(true, {}, this.config.stylesButtonsCommon, this.config.stylesButtons[side]);

                // check nextSides too

                for (var stylesI = 0, stylesL = this.config.stylesInheritedBorders.length; stylesI < stylesL; stylesI += 1) {
                    var borderStyleName = this.config.stylesInheritedBorders[stylesI];
                    var styleName = 'border-' + side + '-' + borderStyleName;
                    var styleTextareaBorder = this.$elem.css(styleName);
                    for (var buttonSidesI = 0; buttonSidesI < sidesL; buttonSidesI += 1) {
                        var buttonSide = this.config.sides[buttonSidesI]
                        if(buttonSide != this.config.oppositeSides[side]) {
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

            // style the textarea
            this.$elem.css(this.config.stylesTextarea);

            // the buttons sets for the 4 sides
            var $buttonsSets = {};

            // loop the 4 sides
            var side;
            //console.log(this.defaults.sides);
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

        addTag: function(tag, el) {

            var tagBefore = "<" + tag + ">";
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

            p: function (el) {
                that.addTag('p', el);
            },

            bq: function (el) {
                that.addTag('blockquote', el);
            },
        }

    }

    Nowysiwyg.buttons = Nowysiwyg.prototype.buttons;
    Nowysiwyg.defaults = Nowysiwyg.prototype.defaults;

    $.fn.nowysiwyg = function (options) {

        return this.each(function () {
          new Nowysiwyg(this, options).init();
        });

    };

    window.Nowysiwyg = Nowysiwyg;

}) (window, jQuery);