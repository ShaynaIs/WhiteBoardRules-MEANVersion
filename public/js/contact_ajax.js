$(function () {
    var apiUrl = "http://localhost:3000";

    // Form input function to send CONTACT FORM
    $('#contact_formButton').click(function () {
        const name = $('#contact_nameInput').val();
        const email = $('#contact_emailInput').val();
        const message = $('#contact_messageInput').val();

        $.ajax({
            type: "POST",
            url: apiUrl + "/contact",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ name: name, email: email, message: message }),
            success: function (result) {
                alert(result.message);
                console.log("email sent");
            },
            error: function (xhr, status, error) {
                alert("File location: ajax.js\nEvent: contact_formButton click\nError Message: " + error);
                console.log("email not sent");
            },
        });
    });
});