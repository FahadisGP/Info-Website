$(document).ready(function () {
    var eventsArray = [];

    if (window.location.pathname.includes('/instructor/') || window.location.pathname.includes('/editInstructor') || window.location.pathname == '/') {
        if (typeof officeHoursData !== 'undefined') {
            if(officeHoursData.length != 0) {
                eventsArray = officeHoursData;
                addEventsInTable(officeHoursData);
            }
        }
    }

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
        const instructorData = {'name': '', 'email': '', 'phone': '', 'building': '', 'officeNum': '', 'officeHours': ''};

        $('.instructorName input, .dataGrid input').each(function(index) {
            switch(index) {
                case 0: instructorData.name = $(this).val(); break;
                case 1: instructorData.building = $(this).val(); break;
                case 2: instructorData.officeNum = $(this).val(); break;
                case 3: instructorData.email = $(this).val(); break;
                case 4: instructorData.phone = $(this).val(); break;
            }
        });
        instructorData.officeHours = eventsArray;
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

    $('#getEditInstructorPageBtn').click(function (e) { 
        window.location.href = '/editInstructor';
    });

    $('#editInstructorBtn').click(function (e) { 
        const instructorData = {'name': '', 'email': '', 'phone': '', 'building': '', 'officeNum': '', 'officeHours': ''};

        $('.instructorName input, .dataGrid input').each(function(index) {
            switch(index) {
                case 0: instructorData.name = $(this).val(); break;
                case 1: instructorData.building = $(this).val(); break;
                case 2: instructorData.officeNum = $(this).val(); break;
                case 3: instructorData.email = $(this).val(); break;
                case 4: instructorData.phone = $(this).val(); break;
            }
        });
        instructorData.officeHours = eventsArray;

        $.ajax({
            url: '/editInstructor',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(instructorData),
            success: function(response) {
                window.location.href = '/';
            },
            error: function(error) {
                console.error(error);
            }
        });
        
    });
    $('#deleteInstructorBtn').click(function (e) {
        $('.deletePage').css('display', 'block');
    });
    
    $('#noCancel').click(function (e) {
        $('.deletePage').css('display', 'none');
    });

    $('#yesDelete').click(function (e) { 
        console.log('fas')
        $.ajax({
            url: '/deleteInstructor',
            method: 'DELETE',
            success: function(response) {
                window.location.href = '/';
            },
            error: function(error) {
                console.error(error);
            }
        });
        
    });
    
    $('#AddEventBtn').click(function (e) { 
        
        const days = [];
        const event = {'text': '', 'start': '', 'end': '', 'day': '', 'color': ''};

        $('.addEventContainer input').each(function(index) {
            if ($(this).is(':checkbox')) {
                if($(this).prop("checked")) {
                    days.push($(this).val());
                }
            }
            else {
                switch(index) {
                    case 0: event.text = $(this).val(); break;
                    case 6: event.start = $(this).val(); break;
                    case 7: event.end = $(this).val(); break;
                    case 8: event.color = $(this).val(); break;
                };
            }
        });
        event.day = days;
        if(event.text == '' || event.start == '' || event.end == '' || event.day == '') {
            console.log('Must Fill All Inputs');
        } else {
            
            eventsArray.push(event);
            addEventsInTable(eventsArray);
            $('.addEventContainer input').each(function(index) {
                if ($(this).is(':checkbox')) {
                    $(this).prop("checked", false);
                }
                else {
                    switch(index) {
                        case 0: $(this).val(''); break;
                        case 6: $(this).val(''); break;
                        case 7: $(this).val(''); break;
                        case 8: $(this).val('#19a2c8'); break;
                    };
                }
                
    
            });
        }

    });

    function attachClickHandler() {
        $('.eventDiv').on('click', '.deleteEventBtn', function() {

        let [event, day] = $(this).attr('id').split('-');
        
        if(eventsArray[event]['day'].length > 1) {
            eventsArray[event]['day'].splice(day, 1);
        }
        else {
            eventsArray.splice(event, 1);
        }
        addEventsInTable(eventsArray);
      });
    };


    function addEventsInTable(officeHours) {
        var start;
        var startTime, endTime;
        officeHours.forEach((offH, index) => {

            var offHStartTime = new Date('1970-01-01T' + offH.start);
            var offHEndTime = new Date('1970-01-01T' + offH.end);
    
            if (index === 0) {
                startTime = offHStartTime;
                endTime = offHEndTime;
            }

            if (offHStartTime < startTime) {
                startTime = offHStartTime;
            } 
            if (offHEndTime > endTime) {
                endTime = offHEndTime;
            }

            start = startTime.toTimeString().split(':')[0];
            
        }); 
        
        $('.hoursRow').empty();
        let ul = $('<ul></ul>');
        ul.append('<li></li>');
        if(officeHours.length == 0) {
            ul.append([$('<li>9:00ص</li>'), $('<li>10:00ص</li>'), $('<li>11:00ص</li>'), $('<li>12:00م</li>'), $('<li>1:00م</li>'), $('<li>2:00م</li>')]);
        }
        else {
            var hoursCounter = 0;
            var currentTime = new Date(startTime);
            while(currentTime <= endTime) {
                let li = $('<li></li>');
                
                var hours = currentTime.getHours();      
                currentTime.setMinutes(0);
                var minutes = currentTime.getMinutes();
                var ampm = hours >= 12 ? 'م' : 'ص';
                hours = hours % 12;
                hours = hours ? hours : 12;
                minutes = minutes < 10 ? '0'+minutes : minutes;
                    
                hoursCounter++;
                currentTime.setHours(currentTime.getHours() + 1);

                li.append($('<span></span>').text(`${hours}:${minutes}${ampm} `));
                ul.append(li);
                
            };
        }
        
        $('.hoursRow').append(ul);

        for(let i = 1; i <= 5; i++) {
            $(`#row${i}`).empty();
        };

        officeHours.forEach((event, eventIndex) => {
            event.day.forEach((day, dayIndex) => {

                let eventDiv = $('<div class="eventDiv"></div>');
                
                var [hourStart, minStart] = event.start.split(':').map(Number);
                var [hourEnd, minEnd] = event.end.split(':').map(Number);
                
                var ampmS = hourStart >= 12 ? 'م' : 'ص';
                var ampmE = hourEnd >= 12 ? 'م' : 'ص';

                hourStart = (hourStart > 12) ? (hourStart - 12) : hourStart;
                hourEnd = (hourEnd > 12) ? (hourEnd - 12) : hourEnd;

                hourStart = (hourStart == 0) ? 12 : hourStart;
                hourEnd = (hourEnd == 0) ? 12 : hourEnd;

                hourStart = (hourStart < 10) ? (String(hourStart).substring(0,1)) : hourStart;
                hourEnd = (hourEnd < 10) ? (String(hourEnd).substring(0,1)) : hourEnd;
                
                minStart = minStart < 10 && minStart > 0 ? '0'+minStart : minStart;
                minEnd = minEnd < 10 && minEnd > 0? '0'+minEnd : minEnd;

                minStart = (minStart == 0) ? minStart+'0' : minStart;
                minEnd = (minEnd == 0) ? minEnd+'0' : minEnd;

                eventDiv.append($('<b><span></span></b>').text(event.text),
                $('<span></span>').text(`${hourStart}:${minStart}${ampmS} - ${hourEnd}:${minEnd}${ampmE}`));
                
                const [startHour, startMinute] = event.start.split(':').map(Number);
                const [endHour, endMinute] = event.end.split(':').map(Number);

                rightOffset = (startHour - start) * 60 + startMinute;
                duration = (endHour - startHour) * 60 + (endMinute - startMinute);
                
                const pixelsPerMinute = $('.classRowDiv').width() / (hoursCounter * 60);
                const divRight = rightOffset * pixelsPerMinute;
                const divWidth = duration * pixelsPerMinute;
                if (window.location.pathname.includes('/addInstructor') || window.location.pathname.includes('/editInstructor')) {
                eventDiv.append(`<button id="${eventIndex}-${dayIndex}" class="deleteEventBtn">&#x2716;</button>`)
                }
                
                eventDiv.css({
                    'right': divRight + 'px',
                    'width': divWidth + 'px',
                    'background-color': event.color
                });

                var color = (event.color.charAt(0) === '#') ? event.color.substring(1, 7) : event.color;
                var r = parseInt(color.substring(0, 2), 16);
                var g = parseInt(color.substring(2, 4), 16);
                var b = parseInt(color.substring(4, 6), 16);
                eventDiv.css('color', (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 225) ?  '#000000': '#FFFFFF');

                $(`#row${day}`).append(eventDiv);
            });
        
        });
        attachClickHandler();
    };

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