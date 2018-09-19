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

    $.validator.addMethod('maskPhone',
        function(value, element) {
            if (value == '') {
                return true;
            }
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Не соответствует формату'
    );

    $('form').each(function() {
        initForm($(this));
    });

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
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

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
        }, 100);
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            form.submit();
        }
    });
}