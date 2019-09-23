$(function() {
    $('.accordion-header').on('click', function() {
        $accordionHeader = $(this);

        $accordionElement = $accordionHeader.closest('.accordion-element');
        $accordion = $accordionHeader.closest('.accordion');
        $accordion
            .find('.accordion-element')
            .not($accordionElement)
            .removeClass('open');

        $accordionElement.toggleClass('open');
    });
});
