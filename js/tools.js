$(document).ready(function() {

    $('.gallery-item a').fancybox({
        buttons : [
            'close'
        ],
        lang : 'ru',
        i18n : {
            'ru' : {
                CLOSE       : 'Закрыть',
                NEXT        : 'Вперед',
                PREV        : 'Назад'
            }
        }
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.desktop-order', function() {
        window.location = $(this).data('link');
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('body').on('click', '.order-date-link', function(e) {
        $('.order-date-select').toggleClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.order-date-select').length == 0 && $(e.target).parents().filter('.ui-datepicker-header').length == 0) {
            $('.order-date-select').removeClass('open');
        }
    });

    var dateFormat = 'dd MM yy';
    $('#datepicker').datepicker({
        dateFormat: dateFormat,
        minDate: 0,
        onSelect: function(dateText) {
            $('.order-date-value').html(dateText).show();
            $('.order-date-select').removeClass('open');
            $('.order-date-select input').val(dateText);
            $('.order-subtitle-date .error').removeClass('visible');
            $('.order-period').addClass('loading');
            $.ajax({
                type: 'POST',
                url: 'ajax/get.schedule.html',
                dataType: 'html',
                data: {date:dateText},
                cache: false
            }).done(function(html) {
                $('#order-date-data').html(html);
                $('.order-period').removeClass('loading');
            });
        }
    });

    $('body').on('click', '.queue-date-link', function(e) {
        $('.queue-date-select').toggleClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.queue-date-select').length == 0 && $(e.target).parents().filter('.ui-datepicker-header').length == 0) {
            $('.queue-date-select').removeClass('open');
        }
    });

    $('.queue-list-item').each(function() {
        var curItem = $(this);
        if (curItem.find('.queue-list-item-times a').length == 0) {
            curItem.addClass('empty');
            curItem.find('.queue-list-item-header').append('<div class="queue-list-item-header-count">Свободных нет</div>');
        } else {
            curItem.find('.queue-list-item-header').append('<div class="queue-list-item-header-count">Свободно ' + curItem.find('.queue-list-item-times a').length + ' из ' + (curItem.find('.queue-list-item-times a, .queue-list-item-times span').length) + '</div>');
        }
    });

    $('#datepickerQueue').datepicker({
        dateFormat: dateFormat,
        minDate: 0,
        onSelect: function(dateText) {
            $('.queue-date-select').removeClass('open');
            $('.queue-inner').addClass('loading');
            $('.queue-date-current').html(dateText);
            $.ajax({
                type: 'POST',
                url: 'ajax/get.border.html',
                dataType: 'html',
                data: {date:dateText},
                cache: false
            }).done(function(html) {
                $('#queue-inner-date').html(html);

                $('.queue-list-item').each(function() {
                    var curItem = $(this);
                    if (curItem.find('.queue-list-item-times a').length == 0) {
                        curItem.addClass('empty');
                        curItem.find('.queue-list-item-header').append('<div class="queue-list-item-header-count">Свободных нет</div>');
                    } else {
                        curItem.find('.queue-list-item-header').append('<div class="queue-list-item-header-count">Свободно ' + curItem.find('.queue-list-item-times a').length + ' из ' + (curItem.find('.queue-list-item-times a, .queue-list-item-times span').length) + '</div>');
                    }
                });

                $('.queue-inner').removeClass('loading');
            });
        }
    });

    $('body').on('click', '.queue-list-item-header', function(e) {
        $(this).parent().toggleClass('open');
        $(this).parent().find('.queue-list-item-times').slideToggle();
        e.preventDefault();
    });

    $('.order-auto-info-number').find('input[type="text"]').keypress(function(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 8) || (charCode == 37) || (charCode == 39)) {
            return true;
        }
        return false;
    });

    var validator = $('.order-form form').validate({
        ignore: '',
        invalidHandler: function(form, validatorcalc) {
            validatorcalc.showErrors();
            checkErrors();
        },
        submitHandler: function(form) {
            form.submit();
        }
    });

    $('.order-period input').change(function() {
        $('.order-subtitle-period .error').removeClass('visible');
    });

    $('.order-form-submit button').click(function(e) {
        var curIndex = $('.order-step').index($('.order-step.active'));
        curIndex++;
        if (curIndex < 3) {
            $('.order-form-tab.active').find('input, select').each(function() {
                validator.element($(this));
            });
            if ($('.order-date-value').html() == '') {
                $('.order-subtitle-date .error').addClass('visible');
            } else {
                $('.order-subtitle-date .error').removeClass('visible');
            }
            if ($('.order-period input:checked').length == 0) {
                $('.order-subtitle-period .error').addClass('visible');
            } else {
                $('.order-subtitle-period .error').removeClass('visible');
            }
            if ($('.order-form-tab.active').find('input.error, select.error, .order-subtitle span.error.visible').length == 0) {
                $('.order-step').removeClass('active success');
                $('.order-step:lt(' + curIndex + ')').addClass('success');
                $('.order-step').eq(curIndex).addClass('active');
                $('.order-form-tab.active').removeClass('active');
                $('.order-form-tab').eq(curIndex).addClass('active');
            }
            e.preventDefault();
        }
    });

    $('.order-form-back').click(function(e) {
        var curIndex = $('.order-step').index($('.order-step.active'));
        curIndex--;
        if (curIndex > -1) {
            $('.order-step').removeClass('active success');
            $('.order-step:lt(' + curIndex + ')').addClass('success');
            $('.order-step').eq(curIndex).addClass('active');
            $('.order-form-tab.active').removeClass('active');
            $('.order-form-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.header-mobile-menu-link').click(function(e) {
        $('html').toggleClass('header-mobile-menu-open');
        e.preventDefault();
    });

    $('body').on('click', '.auth-phone-send a', function(e) {
        var curLink = $(this);
        var curForm = $(this).parents().filter('form');
        var validator = curForm.validate();
        validator.element($('.auth-phone-input .form-input input'));
        if (!$('.auth-phone-input .form-input input').hasClass('error')) {
            curForm.addClass('loading');
            $.ajax({
                type: 'POST',
                url: curLink.attr('href'),
                dataType: 'json',
                data: curForm.serialize(),
                cache: false
            }).done(function(data) {
                curForm.removeClass('loading');
                if (data.status == 'ok') {
                    curForm.addClass('visible-pin');
                    curForm.find('.auth-phone-message').html(data.message);
                } else {
                    curForm.find('.auth-phone-message').html('');
                    curForm.find('.auth-phone-input .form-input .form-input-label span').remove();
                    curForm.find('.auth-phone-input .form-input .form-input-label').append('<span> — ' + data.message + '</span>');
                    curForm.find('.auth-phone-input .form-input input').addClass('error');
                }
                $(window).trigger('resize');
                updateAuthTimers();
            });
        }
        e.preventDefault();
    });

    $('body').on('click', '.auth-phone-pin-link a', function(e) {
        var curLink = $(this);
        var curForm = $(this).parents().filter('form');
        var validator = curForm.validate();
        validator.form();
        if (curForm.find('input.error').length == 0) {
            curForm.addClass('loading');
            $.ajax({
                type: 'POST',
                url: curLink.attr('href'),
                dataType: 'json',
                data: curForm.serialize(),
                cache: false
            }).done(function(data) {
                curForm.removeClass('loading');
                if (data.status == 'ok') {
                    window.location = data.url;
                } else if (data.status == 'error-timer') {
                    curForm.find('.auth-phone-pin .form-input .form-input-label span').remove();
                    curForm.find('.auth-phone-pin .form-input .form-input-label').append('<span> — ' + data.message + '</span>');
                    curForm.find('.auth-phone-pin .form-input input').addClass('error');
                    curForm.find('.auth-phone-pin .form-input input').val('').trigger('focus');
                    curForm.find('.auth-timer').html('');
                } else {
                    curForm.find('.auth-phone-pin .form-input .form-input-label span').remove();
                    curForm.find('.auth-phone-pin .form-input .form-input-label').append('<span> — ' + data.message + '</span>');
                    curForm.find('.auth-phone-pin .form-input input').addClass('error');
                    curForm.find('.auth-phone-pin .form-input input').val('').trigger('focus');
                }
                updateAuthTimers();
            });
        }
        e.preventDefault();
    });

    function updateAuthTimers() {
        $('.auth-timer').each(function() {
            var curTimer = $(this);
            if (curTimer.find('span').length == 0) {
                curTimer.html('<span class="auth-timer-m">' + curTimer.data('time') + '</span> ' + getMinutesText(curTimer.data('time')) + ' <span class="auth-timer-s">0</span> ' + getSecondsText(0));
                window.clearInterval(curTimer.data('timer'));
                curTimer.data('timer', null);
                curTimer.data('timer', window.setInterval(function() {
                    var curMinutes = Number(curTimer.find('.auth-timer-m').html());
                    var curSeconds = Number(curTimer.find('.auth-timer-s').html());
                    curSeconds--;
                    if (curSeconds < 0) {
                        curSeconds = 59;
                        curMinutes--;
                        if (curMinutes < 0) {
                            curMinutes = 0;
                            curSeconds = 0;
                        }
                    }
                    curTimer.html('<span class="auth-timer-m">' + curMinutes + '</span> ' + getMinutesText(curMinutes) + ' <span class="auth-timer-s">' + curSeconds + '</span> ' + getSecondsText(curSeconds));
                }, 1000));
            }
        });
    }

    function getMinutesText(number) {
        var endings = Array('минут', 'минута', 'минуты');
        var num100 = number % 100;
        var num10 = number % 10;
        if (num100 >= 5 && num100 <= 20) {
            return endings[0];
        } else if (num10 == 0) {
            return endings[0];
        } else if (num10 == 1) {
            return endings[1];
        } else if (num10 >= 2 && num10 <= 4) {
            return endings[2];
        } else if (num10 >= 5 && num10 <= 9) {
            return endings[0];
        } else {
            return endings[2];
        }
    }

    function getSecondsText(number) {
        var endings = Array('секунд', 'секунда', 'секунды');
        var num100 = number % 100;
        var num10 = number % 10;
        if (num100 >= 5 && num100 <= 20) {
            return endings[0];
        } else if (num10 == 0) {
            return endings[0];
        } else if (num10 == 1) {
            return endings[1];
        } else if (num10 >= 2 && num10 <= 4) {
            return endings[2];
        } else if (num10 >= 5 && num10 <= 9) {
            return endings[0];
        } else {
            return endings[2];
        }
    }

});

$(window).on('resize', function() {
    $('.form-select select').chosen('destroy');
    $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
    $('.form-select select').each(function() {
        var curSelect = $(this);
        if (curSelect.data('placeholder') != '') {
            curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
        }
    });
});

function initForm(curForm) {
    curForm.find('input.maskPhone').each(function() {
        var curBlock = $(this).parent();
        curBlock.find('input').keypress(function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode
            if ((charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 8) || (charCode == 37) || (charCode == 39)) {
                return true;
            }
            return false;
        });
    });

    curForm.find('input.maskPhone').change(function() {
        var curValue = $(this).val();
        var newValue = '';
        for (var i = 0; i < curValue.length; i++) {
            var curSymbol = curValue[i];
            if (curSymbol == '0' || curSymbol == '1' || curSymbol == '2' || curSymbol == '3' || curSymbol == '4' || curSymbol == '5' || curSymbol == '6' || curSymbol == '7' || curSymbol == '8' || curSymbol == '9') {
                newValue += curSymbol;
            }
        }
        $(this).val(newValue);
    });

    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('focus');
        }
    });

    curForm.find('.form-input input, .form-input textarea').focus(function() {
        $(this).parent().addClass('focus');
    });

    curForm.find('.form-input input, .form-input textarea').blur(function() {
        if ($(this).val() == '') {
            $(this).parent().removeClass('focus');
        }
    });

    curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        if (curSelect.data('placeholder') != '') {
            curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
        }
    });

    curForm.find('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent().parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });

    curForm.find('.form-reset input').click(function(e) {
        curForm.find('.form-input input, .form-input textarea').each(function() {
            $(this).parent().removeClass('focus');
        });

        curForm.find('label.error').remove();
        curForm.find('.error').removeClass('error');
        curForm.find('.valid').removeClass('valid');

        window.setTimeout(function() {
            curForm.find('.form-input input, .form-input textarea').each(function() {
                if ($(this).val() != '') {
                    $(this).parent().addClass('focus');
                }
            });

            curForm.find('.form-select select').chosen('destroy');
            curForm.find('.form-select select').chosen({disable_search: true, hide_results_on_select: false, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
            curForm.find('.form-select select').each(function() {
                var curSelect = $(this);
                if (curSelect.data('placeholder') != '') {
                    curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
                }
            });

            curForm.find('.form-file-name').html('');
        }, 100);
    });

    if (curForm.parents().filter('.order-form').length == 0) {
        curForm.validate({
            ignore: '',
            invalidHandler: function(form, validatorcalc) {
                validatorcalc.showErrors();
                checkErrors();
            },
            submitHandler: function(form) {
                if ($(form).hasClass('ajax-form')) {
                    windowOpen($(form).attr('action'), $(form).serialize());
                } else {
                    form.submit();
                }
            }
        });
    }
}

function checkErrors() {
    $('.form-input').each(function() {
        var curField = $(this);
        curField.find('.form-input-label span').remove();
        if (curField.find('input.error').length > 0 || curField.find('textarea.error').length > 0) {
            curField.find('.form-input-label').append('<span> — ' + curField.find('label.error').html() + '</span>');
        }
    });
}

function windowOpen(linkWindow, dataWindow, callbackWindow) {
    var curPadding = $('.wrapper').width();
    $('html').addClass('window-open');
    curPadding = $('.wrapper').width() - curPadding;
    $('body').css({'margin-right': curPadding + 'px'});

    if ($('.window').length == 0) {
        windowClose();
    }
    $('body').append('<div class="window"><div class="window-loading"></div></div>')

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window').length > 0) {
            $('.window').remove();
        }
        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.97 47.97"><title>window-close</title><path d="M28.23,24,47.09,5.12A3,3,0,0,0,42.85.88L24,19.74,5.12.88A3,3,0,0,0,.88,5.12L19.74,24,.88,42.85a3,3,0,1,0,4.24,4.24L24,28.23,42.85,47.09a3,3,0,1,0,4.24-4.24Z" transform="translate(0 0)"/></svg></a></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').one('load', function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        if (typeof (callbackWindow) != 'undefined') {
            callbackWindow.call();
        }

        $('.window form').each(function() {
            initForm($(this));
        });
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});

        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window-container').height() > $('.window').height() - 60) {
            $('.window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
    }
}