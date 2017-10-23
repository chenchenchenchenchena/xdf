$(function () {
    //管理下拉
    var LayoutHeader_tt1;
    $(".js-userName").hover(function () {
        $(this).addClass('on');
        $(".js-userName-menu").show();
        clearTimeout(LayoutHeader_tt1);
    }, function () {
        LayoutHeader_tt1 = setTimeout(function () {
            $(".js-userName-menu").hide();
            $(".js-userName").removeClass('on');
        }, 200);
    });
    $(".js-userName-menu").hover(function () {
        clearTimeout(LayoutHeader_tt1);
    }, function () {
        $(this).hide();
        $(".js-userName").removeClass('on');
    });

})


$(function () {
    function lftht() {
        var lefth = ($(window).height() - 52) > 540 ? ($(window).height() - 52) : 540;
        $(".p176-left").css("height", lefth);
    }

    lftht();
    $(window).resize(lftht);
})