/**
 * Created by nam.tran on 11-Jan-17.
 */
$(document).ready( function () {
    $('#submit').on('click', function () {

        var chat = $('#chat').val();

        // check user's input being empty or not
        if( chat ) {

            // append user's input to chabox
            $('.chat-content').append('<p class="user-chat">' + chat + '</p>');
            $('#chat').val('');

            $.ajax({
                url: '/chat',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    chat: chat
                }),
                contentType: "application/json; charset=utf-8",
                complete: function (xhr, status) {
                    console.log(status);
                },
                success: function (data) {
                    console.log(data);
                    $('.waiting').text('Xin chao');
                    $('#chat').prop('disabled', false);
                    $('.chat-content').scrollTop($('.chat-content').height());
                    $('#chat').focus();
                },
                error: function (err) {
                    console.log(err);
                }
            });
            
            $('.chat-content').append('<p class="bot-chat waiting">' + 'bot is typing...' + '</p>');
            $('#chat').prop('disabled', true);
            $('.chat-content').scrollTop($('.chat-content').height());
        }

    });
} );