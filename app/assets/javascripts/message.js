$(function(){
  function buildHTML(message){
  if (message.content && message.image) {
    var html =`
    <div class="message list" data-message-id=${message.id}>
      <div class="upper-message">
        <div class="upper-message__user-name">
          ${message.user_name}
        </div>
        <div class="upper-message__date">
          ${message.created_at}
        </div>
      </div>
      <div class="lower-message">
        <p class="lower-message__content">
          ${message.content}
        </p>
      </div>
      <img src=${message.image} >
    </div>`
  } else if ( message.image ) {
    var html =`
    <div class="message list" data-message-id=${message.id}>
      <div class="upper-message">
        <div class="upper-message__user-name">
          ${message.user_name}
        </div>
        <div class="upper-message__date">
          ${message.created_at}
        </div>
      </div>
      <div class="lower-message">
      <img src=${message.image} >
    </div>`
    } else if (message.content) {
      var html =`
        <div class="message list" data-message-id=${message.id}>
          <div class="upper-message">
            <div class="upper-message__user-name">
              ${message.user_name}
            </div>
            <div class="upper-message__date">
              ${message.created_at}
            </div>
          </div>
          <div class="lower-message">
            <p class="lower-message__content">
              ${message.content}
            </p>
          </div>
        </div>`
    };
    return html;
  }
$('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
     .done(function(data){
       var html = buildHTML(data);
       $('.chat_main__message.lists').append(html);
       $('.chat_main__message.lists').animate({ scrollTop: $('.chat_main__message.lists')[0].scrollHeight});
       $('form')[0].reset();
     })
     .always(function(data){
      $('.submit-btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
  })
});

  var reloadMessages = function() {
    last_message_id = $('.message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
      $('.chat_main__message.lists').append(insertHTML);
      $('.chat_main__message.lists').animate({ scrollTop: $('.chat_main__message.lists')[0].scrollHeight});
      }
    })
    .fail(function() {
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
  setInterval(reloadMessages, 4000);
  }
});