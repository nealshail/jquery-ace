/**
 * jQuery ACE plugin.
 * @author Sam Mousa
 * @url https://github.com/SamMousa/jquery-ace
 */
(function($) {
    var methods = {
        'init': function(options) {
            var config = $.extend({
                'mode' : 'html',
                'tabSize' : 4,
                'softTabs' : true,
                'highlightActiveLine' : true,
                'autoScrollEditorIntoView' : false,
                //
                'idPostfix' : '__ace',
                'toolbarCallback' : null,
                'wrapperClass' : 'jquery-ace-wrapper'
            }, options);

            return this.each(function() {
                var data = $(this).data('ace');
                if (!data) {
                    var textarea = $(this);
                    // Setup here.
                    if ($(this).attr('id'))
                    {
                        var id = textarea.attr('id') + config.idPostfix;
                    }

                    var h = textarea.height();
                    var w = textarea.width();
                    textarea.hide();

                    var wrapperDiv = $('<div/>').insertAfter(textarea).addClass(config.wrapperClass);//.height(h).width(w);
                    // Check if we have a toolbar.
                    if (!config.autoScrollEditorIntoView){
                        wrapperDiv.height(h);
                        wrapperDiv.width(w);
                    }

                    var editorDiv = $('<div/>').appendTo(wrapperDiv).attr('id', id);//.height(h).width(w);
                    var editor = ace.edit(id);
                    if (typeof config.toolbarCallback == 'function')
                    {
                        var toolbarDiv = $('<div/>').prependTo(wrapperDiv).width(w);
                        config.toolbarCallback(toolbarDiv, editor);
                        // Resize editor.
                        if (toolbarDiv.height() > 0)
                        {
                            editorDiv.height(h - toolbarDiv.height());
                            editor.resize();
                        }

                    }

                    data = {
                        'wrapperDiv' : wrapperDiv,
                        'editorDiv' : editorDiv,
                        'editor' : editor
                    };
                    var session = editor.getSession();

                    var opts = $.extend({},config);
                    delete opts.softTabs;
                    delete opts.idPostfix;
                    delete opts.toolbarCallback;
                    delete opts.wrapperClass;
                    if (opts.mode.indexOf('ace/mode/') == -1){
                        opts.mode = 'ace/mode/'+opts.mode; // backwards compatible
                    }
                    if (opts.theme.indexOf('ace/theme/') == -1){
                        opts.theme = 'ace/theme/'+opts.theme; // backwards compatible
                    }

                    editor.setOptions(opts);

                    textarea.data('ace', data);
                    textarea.ace('val', textarea.val());
                    editor.clearSelection();
                    session.on('change', function(e) { 
                        textarea.val(session.getValue());
                    });

                }

            });
        },
        'get': function() {
            if (this.first().data('ace'))
            {
                return this.first().data('ace').editor;
            }
        },
        'val': function(value) {
            if (typeof value == 'undefined')
            {
                return this.first().data('ace').editor.getValue();
            }
            else
            {
                this.each(function() {
                    var data = $(this).data('ace');
                    if (data)
                    {
                        data.editor.setValue(value);
                    }
                });
            }
            return this;
        },
        'check': function() {
            return typeof this.first().data('ace') != 'undefined';
        }

    };

    $.fn.ace = function(method) {
        if ( methods[method] ) {
            return methods[method].apply(this,  Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ace');
        }
    };


})(jQuery);
