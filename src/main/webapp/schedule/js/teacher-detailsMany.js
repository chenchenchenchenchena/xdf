
$(function(){
	var swiper = new Swiper('.teacherList .swiper-container', {
	    pagination: '.swiper-pagination',
	    slidesPerView: 4,
	    paginationClickable: true,
	    spaceBetween: 30
	});
	var swiper = new Swiper('.studentList .swiper-container', {
	    pagination: '.swiper-pagination',
	    slidesPerView: 5,
	    paginationClickable: true,
	    spaceBetween: 30
	});
	$(".rightArrowOne img").tap(function(){
		location.href="teacherList.html";
	})
	$(".rightArrowTwo img").tap(function(){
		location.href="te-studentList.html";
	})
})