$(document).ready(function () {
    $('#signBtn').click(function (e) { 
        window.location.href = '/login';
    });
    
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

    $('#AddInstructorBtn').click(function (e) { 
        const instructorData = {'name': '', 'email': '', 'phone': '', 'building': '', 'officeNum': ''};

        $('.instructorName input, .dataGrid input').each(function(index) {
            switch(index) {
                case 0: instructorData.name = $(this).val(); break;
                case 1: instructorData.building = $(this).val(); break;
                case 2: instructorData.officeNum = $(this).val(); break;
                case 3: instructorData.email = $(this).val(); break;
                case 4: instructorData.phone = $(this).val(); break;
            }
        });
        
        if($('.instructorName input').val() == '') {
            $('.instructorName input').css('border-color', 'red');
        }
        else{
            $.ajax({
            url: '/addInstructor',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(instructorData),
            success: function(response) {
                window.location.href = '/';
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
        }
        
        
    });

    $('#getAddInstructorPageBtn').click(function (e) { 
        window.location.href = '/addInstructor';
    });

    $('#loginBtn').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        
        $.ajax({
            url: '/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username, password: password }),
            success: function(response) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                } else {
                    alert('Login failed: ' + response.message);
                }
            }
        });
    });

    $('#logoutBtn').click(function() {
        $.ajax({
          type: 'POST',
          url: '/logout',
          success: function(response) {
            window.location.href = response.redirectUrl;
          },
          error: function() {
            alert('An error occurred during logout.');
          }
        });
    });
      

    $('#signupBtn').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        console.log(username, password)

        $.ajax({
            url: '/signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username, password: password }),
            success: function(response) {
                if (response.success) {
                    window.location.href = response.redirectUrl;
                } else {
                    alert('Login failed: ' + response.message);
                }
            }
        });
    });
});