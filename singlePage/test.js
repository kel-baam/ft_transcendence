 document.addEventListener('DOMContentLoaded', (event) => {

            var hidden = document.querySelector('.hidden');
            var icon = document.querySelector('.fa-ellipsis-vertical');
            
            console.log(icon);
            var chatContent = document.getElementsByClassName('chat-content');
            
            if (chatContent[0]){
                var msg_list = chatContent[0].getElementsByClassName('message-list');
                var msg_list_content = msg_list[0].getElementsByClassName('content');
                var msg_list_header = msg_list[0].getElementsByClassName('header');
                var sender = msg_list_content[0].getElementsByClassName('sender');
                // var sender_msg = sender[0].getElementsByClassName('msg');
                var typing_box = msg_list[0].getElementsByClassName('typing'); 
                var settings_friend = chatContent[0].getElementsByClassName('about-friend');
            }
            
            
            var func = function(){
                if (chatContent && hidden && typing_box)
                {
                    console.log("Custom logic executed");
                    if (msg_list && settings_friend) {
                        settings_friend[0].style.borderRadius = '0px 56px 56px 0px'; 
                        msg_list[0].style.borderRadius = '56px 0px 0px 56px'; 
                        msg_list_header[0].style.gap = '1em';
            
                        hidden.style.display = "initial";
                        chatContent[0].style.gap = '0em';
                        chatContent[0].style.gridTemplateColumns = '25% 1% 53% 21%';
                        settings_friend[0].style.display = "grid";
                        console.log("Custom logic executed");
                        icon.style.display = "none";
            
                        typing_box[0].style.borderRadius = '0px 0px 0px 56px';
            
                        var i = 0;
                        while (sender[i])
                        {
                            sender[i].style.gap = '1em';
                            i++;
                        }   
                    }
                }
            };
            
            
            if (icon)
                {
                    icon.addEventListener('click', func);
                    console.log("-----> ");
                }
            
            var cancel_icon = document.querySelector('.fa-xmark');
            
            if (cancel_icon) {
                var rollback = function(){
            
                    chatContent[0].style.gap = '1em';
                    chatContent[0].style.gridTemplateColumns = '25% 74%';
                    settings_friend[0].style.display = "none";
                    icon.classList.replace('fa-arrow-right', 'fa-ellipsis-vertical');   
                    icon.style.display = "initial";
                    hidden.style.display = "none";
            
                    settings_friend[0].style.borderRadius = '';
                    msg_list[0].style.borderRadius = ''; 
                    typing_box[0].style.borderRadius = '';
                    msg_list_header[0].style.gap = '';
            
                    var i = 0;
                        while (sender[i])
                        {
                            sender[i].style.gap = '';
                            i++;
                        } 
            
                };
            
                cancel_icon.addEventListener('click', rollback);
                console.log("Custom logic executed");
            }
    
});