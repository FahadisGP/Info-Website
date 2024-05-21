$(document).ready(function () {
    $('#searchBtn').click(function() {
        getInstructor($('#searchInput').val());
    });
    
    $('#searchInput').keypress(function(e) {
        if (e.keyCode == 13) {
            getInstructor($('#searchInput').val());
        }
    });

    $('#content').on('click', '.instructorResult', function() {
        getInstructor($(this).find('.resultName').text());
    });
    
    function getInstructor(instructor) {
        window.location.href = '/instructor/' + encodeURIComponent(instructor);
    };
    
    var page = $('#content').html();
    $('#searchInput').on('input', function() {
        var searchTerm = $(this).val();
       
        if (searchTerm.length > 2) {
            $.ajax({
                url: `/search?name=${encodeURIComponent(searchTerm)}`,
                type: 'GET',
                dataType: 'html',
                success: function(html) {
                    $('#content').html(html);
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        } else if(searchTerm.length == 0) {
            $('#content').html(page);
        }
    });

    
});