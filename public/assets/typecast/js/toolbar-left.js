$(function() {
    $('.typecast-toolbar-left .has-children a').on('click', function() {
        $target = $(this);
        $li = $target.closest('li');
        $li.toggleClass('open');
    });
});
