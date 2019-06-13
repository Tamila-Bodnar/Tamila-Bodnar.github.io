// app.js
$(document).ready(function(){

$('.application').slick({
  slidesToShow: 4,
  centerPadding: '60px',                
  dots: false,
  arrows:false,
  infinite: true,  
  focusOnSelect: true,
  draggable: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
   // $('.slider').click().removeClass('slider_1')
   // 	.addClass('slider_2').insertAfter($('.slider'));

$('.goods').slick({
  slidesToShow: 4,
  centerMode: true,
  centerPadding: '20px',               
  dots: false,
  arrows:false,
  infinite: false,  
  focusOnSelect: true,
  draggable: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});

// $("#input-id").rating();

$("#input-4").rating({'size':'lg'});

});

$(document).on('click', '[data-toggle="ekkoLightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox({alwaysShowClose: true,
                onShown: function() {
                    console.log('Checking our the events)');
                },
                onNavigate: function(direction, itemIndex){
                    console.log('Navigating '+direction+'. Current item: '+itemIndex);
                }});	
});

