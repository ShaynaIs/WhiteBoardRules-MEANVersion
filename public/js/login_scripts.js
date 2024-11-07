$(function () {
    var apiUrl = "http://localhost:3000";

    $(".rslides").responsiveSlides();

    $('#showSignUp').click(function () {
        $('#loginCard').hide();
        $('#registerCard').show();
    });

    $('#showLogin').click(function () {
        $('#registerCard').hide();
        $('#loginCard').show();
    });

    function checkAuth() {
        if (localStorage.getItem('jwtToken')) {
            // check if expired
            console.log("jwtToken exist");
            //check if expired
            const token = localStorage.getItem('jwtToken');
            const arrayToken = token.split('.');
            const tokenPayload = JSON.parse(atob(arrayToken[1]));
            if( Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub){
                console.log("token not expired");
                //reroute to students
                window.location.replace('/');
            }else{
                console.log("token expired");
            }
        }
            $('#logoutNavigation').hide();
            $('#loginCard').show();
    }

    checkAuth();

    // Login Form Submission
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        console.log("Prevented submit and now attempting to login");
        const userData = {
            username: $('#loginUsername').val(),
            password: $('#loginPassword').val()
        };

        $.ajax({
            type: "POST",
            url: apiUrl + '/users/login',
            contentType: "application/json",
            data: JSON.stringify(userData),
            success: function (response) {
                localStorage.setItem('jwtToken', response.token);
                localStorage.setItem('username', response.username);
                localStorage.setItem('icon_url', response.icon_url);
                alert('Login successful. Token received.');
                window.location.replace('/');
            },
            error: function () {
                alert('Login failed. Please check your credentials.');
            }
        });
    });

    // Register Form Submission
    $('#registerForm').submit(function (event) {
        event.preventDefault();
        const userData = {
            firstname: $('#signupFirstname').val(),
            lastname: $('#signupLastname').val(),

            username: $('#signupUsername').val(),
            email: $('#signupEmail').val(),
            password: $('#signupPassword').val(),

            icon_url: $('#profilePic').val()
        };

        console.log(userData);

        $.ajax({
            type: "POST",
            url: apiUrl + '/users/register',
            contentType: "application/json",
            data: JSON.stringify(userData),
            success: function () {
                alert('Registration successful. Please log in.');
                $('#registerCard').hide();
                $('#loginCard').show();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Registration failed: ${textStatus}`);
            }
        });
    });


    $('#registerCard').bootstrapValidator({
        message: 'This value is not valid',
        excluded: [':disabled', ':hidden', ':not(:visible)'],
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: 'The username is required and cannot be empty'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The username must be more than 6 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/,
                        message: 'The username can only consist of alphabetical and number'
                    },
                    different: {
                        field: 'password',
                        message: 'The username and password cannot be the same as each other'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required and cannot be empty'
                    },
                    emailAddress: {
                        message: 'The email address is not a valid'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required and cannot be empty'
                    },
                    different: {
                        field: 'username',
                        message: 'The password cannot be the same as username'
                    },
                    stringLength: {
                        min: 8,
                        message: 'The password must have at least 8 characters'
                    }
                }
            },
            ConfirmPassword: {
                validators: {
                    notEmpty: {
                        message: 'The password is required and cannot be empty'
                    },
                    identical: {
                        field: 'password',
                        message: 'The passwords must match'
                    }
                }
            },
            profileIcon: {
                validators: {
                    notEmpty: {
                        message: 'Please select an icon'
                    }
                }
            },
            age: {
                validators: {
                    notEmpty: {
                        message: 'The age is required'
                    }
                }
            }
        }
    });

    $('.profile-pic-div').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        focusOnSelect: true,
        arrows:true,
        dots:true,
        centerMode: true
    });

    $(".slickImg").click(function(){
        $(".slickImg").css("border","1px solid grey");
        $(this).css("border","2px dashed gray");
        $("#profilePic").val($(this).attr('src'));
    });
});