$(function(){

    // initialize the chosen plugin
    $(".chzn-select").chosen();

    //intitialize the isotope plugin
    var $container = $('#content');

    $container.isotope({
        itemSelector : '.element',
        layoutMode : 'masonry'
    });

    // on a change of the select form, update isotope filter property
    $('select').change(function(){
        var selected = [];
        var filters_arr = [];
        selected = $('select option:selected');

        selected.each(function(){
          filters_arr.push("." + $(this).data("filter"));
        });

        var filters = filters_arr.join("");
        
        console.log(filters);

        $container.isotope({
            filter: filters
        });

        return false;
    
    });
    $(window).smartresize(function(){
        $container.isotope( 'reLayout' );
    });
});

