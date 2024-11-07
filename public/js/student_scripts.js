$(function () {
    var apiUrl = "http://localhost:3000";

    // Form input function to send ADD STUDENT FORM
    $('#addStudent_formButton').click(function () {
        const idData = $('#addStudent_idInput').val();
        const first = $('#addStudent_firstNameInput').val();
        const last = $('#addStudent_lastNameInput').val();
        const birthday = $('#addStudent_birthdayInput').val();

        $.ajax({
            type: "POST",
            url: apiUrl + "/students/addStudent",
            dataType: "json",
            contentType: "application/json",
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') },
            data: JSON.stringify({ student_id: idData, first_name: first, last_name: last, birthday: birthday }),
            success: function (result) {
                loadData(); //reload data into datadiv
                console.log("student added");
            },
            error: function (xhr, status, error) {
                alert("File location: ajax.js\nFunction: addStudent_formButton click\nError Message: " + error);
            },
        });

        //edit table
        var table = $("#student_table")[0];
        table.deleteRow(-1);

        // show other button
        $("#addStudent_formButton").attr('style', 'display:none');
        $("#addStudentRow").attr('style', 'display:block');
    });

    $('#addStudentRow').click(function () {
        // Show form
        var table = $("#student_table")[0];
        table.insertRow(-1).innerHTML = '<td><label for="addStudent_idInput"></label><input type="number" id="addStudent_idInput" class="addStudentInput" placeholder="Enter id#" required=""></td><td><label for="addStudent_firstNameInput"></label><input type="text" id="addStudent_firstNameInput" class="addStudentInput" placeholder="First Name" required=""></td><td><label for="addStudent_lastNameInput"></label><input type="text" id="addStudent_lastNameInput" class="addStudentInput" placeholder="Last Name" required=""></td><td><label for="addStudent_birthdayInput"></label><input type="date" id="addStudent_birthdayInput" class="addStudentInput" placeholder="" required=""></td>';

        // show other button
        $("#addStudentRow").attr('style', 'display:none');
        $("#addStudent_formButton").attr('style', 'display:block');
    });

    function checkAuth() {
        if (localStorage.getItem('jwtToken')) {
            //check if expired
            //rename logout with name
        } else {
            window.location.replace('/login');
        }
    }

    checkAuth();

    // Function to get data - student list
    function loadData() {
        if (localStorage.getItem('username')) {
            try{
            $('#username')[0].innerHTML = localStorage.getItem('username');
            $('#user_icon')[0].src = localStorage.getItem('icon_url');
            }catch(error){                
                alert("Please logout and try again!");
            }
        }
        if (localStorage.getItem('jwtToken')) {
            console.log("About to load data for user " + localStorage.getItem('jwtToken'));
            $.ajax({
                type: "GET",
                dataType: 'json',
                url: apiUrl + "/students",
                contentType: "application/json",
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') },
                success: function (result) {
                    //clear old data
                    $("#student_table").html("");
                    //put results into dataDiv
                    if (result.length == 0) {
                        $("#student_table").html("List is empty. Add new student below!");
                    }
                    else {
                        var table = $("#student_table")[0];
                        var header = table.createTHead();
                        var header_row = header.insertRow(0);
                        header_row.innerHTML = '<th>ID</th><th>First Name</th><th>Last Name</th><th>Birthday</th>';
                        var tbody = table.createTBody()
                        for (i = 0; i < result.length; i++) {
                            var row = tbody.insertRow(-1);
                            row.className = 'student-table-row';
                            row.innerHTML = "<td class='id'>" + result[i].student_id + "</td><td class='first'>" + result[i].first_name + "</td><td class='last'>" + result[i].last_name + "</td><td class='birthday'>" + result[i].birthday + "</td>";
                        }
                    }
                },
                error: function (xhr, status, error) {
                    alert("Please logout and try again!");
                },
            });
        }
    }

    loadData();

    
    $('#logoutButton').click(function () {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        window.location.replace('/login');
    });    

    $('#downloadBtn').click(function () {
        // 'deactivate' button
        $('#downloadBtn').html("downloading...");
        $('#downloadBtn').css("background-color", "lightgray");
    
        var students = "["
        $(".student-table-row").each(function (i) {
            if (i != 0) students += ",";
            students += "{"
            students += '"id" : "' + $(this).find('.id').text() + '",';
            students += '"name" : "' + $(this).find('.first').text() +' ' + $(this).find('.last').text() + '",';
            students += '"birthday" : "' + $(this).find('.birthday').text() + '"}';
        });
        students += "]";
    
        var dataString = '{"students":' + students +'}';
        console.log(dataString);
        
        const settings = {
            async: true,
            crossDomain: true,
            url: 'https://apitemplate1.p.rapidapi.com/v2/create-pdf?template_id=44d77b23b861f69c&async=0&output_html=0&output_format=pdf&export_type=json&webhook_url=https%3A%2F%2Fyourwebserver.com',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-API-KEY': '89f6MTg3OTc6MTU4OTY6QW90MFFHQVBnbkduYmpNMw=',
                'X-RapidAPI-Key': '70e0c7656cmsh6e2aa52f1e144b4p1941d6jsn3f007f567435',
                'X-RapidAPI-Host': 'apitemplate1.p.rapidapi.com'
            },
            processData: false,
            data: dataString,
            error: function (xhr, status, error) {
                console.log(error);
            }
        };
    
        $.ajax(settings).done(function (response) {
            //console.log(response.download_url);
            window.open(response.download_url);
            // un'deactivate' button
            $('#downloadBtn').html("Generate Again");
            $('#downloadBtn').css("background-color", "var(--accent)");
        });
        
    });

});