.chat-content{
    background-color: rgba(217, 217, 217, 8%);
    border-radius: 56px;
    padding: 15px;
    grid-template-columns: 25% 74%;
    display: grid;
    gap:1em; 
    height: 100%;
}

/* ----------- chat list ----------- */
.chat-content .chat-list-container{
    background-color: #FFEEBF;
    border-radius: 56px;
    padding: 3px;
    grid-template-rows: 10% 0.5% 89.5%;
    display: grid;
}

.chat-content .chat-list-container .separator{
    background-color: rgba(208, 210, 217, 0.61);
    border-radius: 56px;
}

    /* ----------- chat list header ----------- */
.chat-content .chat-list-container .chat-list-header{
    background-color: transparent;
    font-family: myFont;
    /* border: 1px solid rgb(255, 124, 1);  */
    border-radius: 56px;
    color: #0A466E;
    display: flex;
    align-items: center;
    justify-content: center;
} 

.chat-content .chat-list-container .chat-list-header .fa-rocketchat{
    margin: 2px;
    font-size: xx-large;
    color: rgba(10, 70, 110, 1);
}

    /* ----------- chat list items ----------- */

.chat-content .chat-list-container .chat-list-items{
    padding: 5px;
    border-radius: 56px;
    grid-template-rows: repeat(9, 10%);
    display: grid;
    gap: 0.2em;
}

.chat-content .chat-list-container .chat-list-items .chat-item{
    padding: 5px;
    border-radius: 20px;
    grid-template-columns: 18% 80%;
    display: grid;
    cursor: pointer;
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.185);

} 
 
.chat-content .chat-list-container .chat-list-items .chat-item:hover{
    background-color: rgba(208, 210, 217, 0.514);
}

    /* ----------- avatar ----------- */

.chat-content .chat-list-container .chat-list-items .chat-item .contact-avatar{
    /* border: 1px solid rgb(255, 255, 255); */
    border-radius: 50px;
    width: 60px;
    height: 60px;
    background-color: #2C3453;
    
}

.chat-content .chat-list-container .chat-list-items .chat-item .contact-box{
    grid-template-rows: 50% 50%;
    display:  grid;
}


.chat-content .chat-list-items .chat-item .contact-box .contact-box-header{
    grid-template-columns: 60% 40%;
    display:  grid;
}

/* ----------- name  ----------- */
.chat-content .chat-list-items .chat-item .contact-box .contact-box-header .contact-name{
    padding: 5px;
    font-size: large;
    font-weight: bold;
    border-radius: 70px;
    color: rgba(10, 70, 110, 1);
}

.chat-content .chat-list-items .chat-item .contact-box .contact-box-header .time-last-message{
    padding: 8px;
    /* border: 1px solid rgb(255, 251, 2); */
    font-size:medium;
    font-family: 'Courier New', Courier, monospace;
    color: rgba(158, 158, 158, 1);
    justify-content: end;
    display: flex;
    
}

/* ----------- last msg  ----------- */

.chat-content .chat-list-items .chat-item .contact-box .last-message{
    color: rgba(155, 155, 155, 1);
    border-radius: 70px;
    padding-left: 5px;
    /* border: 1px solid rgb(255, 251, 2); */
}

/* ----------- time of the last msg  ----------- */

.chat-content .message-list{
    background-color: #D2D4DA;
    border-radius: 56px;
    grid-template-rows: 10% 0.5% 74% 15.5%;
    display: grid;
} 

.chat-content .message-list .header{
    background-color: transparent;
    padding: 5px;
    padding-left: 20px;
    border-radius: 40px;
    grid-template-columns: 6.8% 40% 50% 5%;
    display: grid;
    
} 

.chat-content .message-list .header .contact-avatar{
    margin-top: 5px; 
    height: 60px;
    width: 60px;
    /* border: 1px solid rgb(255, 124, 1); */
}

.chat-content .message-list .header .contact-name{
    border-radius: inherit;
    padding-top: 26px;
    font-size: larger;
}

.chat-content .message-list .header .play-button{
    padding: 11px;
    border-radius: inherit;
    display: flex;
    justify-content: end;
}

.chat-content .message-list .header .play-button button{
    border: none;
    background-color: #FFEEBF;
    border-radius: inherit;
    width: 80px;
    height: 45px;
    color: #D45154;
    font-size: 20px;
    font-weight: bold;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.4);
    cursor: grabbing;

}

.chat-content .message-list .header .play-button button{
    transition-duration: 0.5s;

}


.chat-content .message-list .header .more-info{
    border-radius: inherit;
    padding-top: 21px;
}

.chat-content .message-list .header .more-info .bi-three-dots-vertical{
    /* transform: rotate(90deg); */
    color: #2C3453;
}

.chat-content .message-list .separator{
    border-radius: 56px;
    background-color: #e2dede;
}

/*----------------------content-------------------------*/
 
.chat-content .message-list .content-k{
    background-color: transparent;
    grid-template-rows: 50% 50%;
    border: 1px solid rgb(1, 43, 158);
    
    height: 27%; /*should be a variable depend of lenth of the message*/
    display: grid;
} 

/*----------------------sender-------------------------*/

.chat-content .message-list .content-k .sender{
    padding: 15px;
    width: 50%;
    grid-template-columns: 12% 88%;
    border: 1px solid rgb(1, 43, 158);
    gap : 1em;
    display: grid;
}

.chat-content .message-list .content-k .sender .sender-avatar{
    width: 55px;
    height: 55px;
    border-radius: 50px;
    background-color: #E8E9EC;
}

.chat-content .message-list .content-k .sender .msg{
    border-radius: 70px 50px 50px 0px;
    background: rgba(255, 255, 255, 0.5);
    width: 90%;
    height: 50px; /*should be a variable depend of lenth of the message*/
    backdrop-filter: blur(10px);
    grid-template-columns: 85% 13%;
    display: grid;
}

.chat-content .message-list .content-k .sender .msg .msg-content{
    color: #0A466E;
    padding: 16px;
    font-family: 'Josefin Sans Semibold';
    
}

.chat-content .message-list .content-k .sender .msg .msg-time{
    color: #9E9E9E;
    display: flex;
    justify-content: center;
    padding-top: 27px;
    font-size: 14px;
}

/*----------------------receiver-------------------------*/

.chat-content .message-list .content-k .receiver{
    padding: 15px;
    padding-left: 20px;
    height: 80px;
    width: 50%;
    display: flex;
    justify-self: end;
    /* border: 1px solid rgb(1, 43, 158); */
}

.chat-content .message-list .content-k .receiver .msg{
    border-radius: 50px 70px 0px 50px;
    background: rgba(255, 255, 255, 0.5);
    width: 90%;
    height: 50px; /*should be a variable depend of lenth of the message*/
    backdrop-filter: blur(10px);
    grid-template-columns: 85% 13%;
    display: grid;
}


.chat-content .message-list .content-k .receiver .receiver-avatar{
    margin-left: 10px;
    width: 55px;
    height: 55px;
    border-radius: 50px;
    background-color: #E8E9EC;
}
.chat-content .message-list .content-k .receiver .msg .msg-content{
    /* border: 1px solid rgb(255, 251, 2); */
    color: #0A466E;
    padding: 16px;
    font-family: 'Josefin Sans Semibold';
    
}

.chat-content .message-list .content-k .receiver .msg .msg-time{
    /* border: 1px solid rgb(255, 251, 2); */
    color: #9E9E9E;
    display: flex;
    justify-content: center;
    padding-top: 27px;
    font-size: 14px;
}

/*---------------------typing msg--------------------------*/

.chat-content .message-list .typing{
    border-radius: 0px 0px 56px 56px ;
    background-color: #E8E9EC;
    grid-template-columns: 90% 10%;
    display: grid;

}

.chat-content .message-list .typing .input-msg{
    background-color: inherit;
    border-radius: 0px 0px 0px 56px;
    font-size: 16px;
    font-family: myFont;
    padding: 15px;
    padding-left: 60px;
    border: none;
}  

.chat-content .message-list .typing .send-icon{    
    /* border: 1px solid rgb(255, 251, 2); */
    /* border-radius: 0px 0px 56px 0px ; */
    display: flex;
    justify-self: center;
    padding-top: 50px;
}


/*----------------------more Settings--------------------------*/


.chat-content .about-friend{
    background-color: #FFEEBF;
    border-radius: 56px;
    opacity: 1;
    grid-template-rows: 10% 0.5% 89.5%;
    /* display: grid; */
    padding: 0;
    display: none;
}

.chat-content .about-friend .header{
    background-color: transparent;
    grid-template-columns: 85% 10%;
    display: grid;
    /* border: 1px solid rgb(0, 255, 238); */
    font-weight: bold;
    font-size: 25px;
    font-family: myFont;

}

.chat-content .about-friend .header .title{
    color: #B8B5B4;
    margin: auto;
    padding-left: 30px;
    /* border: 1px solid rgb(34, 71, 69); */
}


.chat-content .about-friend .header .fa-xmark{
    /* border: 1px solid rgb(34, 71, 69); */
    align-items: center;
    display: flex;
    color:  #B8B5B4;
    justify-self: center;
}

.chat-content .about-friend .separator{
    background-color: rgba(208, 210, 217, 0.61);
    border-radius: 56px;
}

.chat-content .about-friend .content-friend{
    grid-template-rows: 25% 8% 25% 10%;
    gap: 1em;
    display: grid;
    /* border: 1px solid rgb(34, 71, 69); */
}

.chat-content .about-friend .content-friend .friend-info{
    /* border: 1px solid rgb(34, 71, 69); */
    grid-template-rows: 80% 10%;
    display: grid;
}

.chat-content .about-friend .content-friend .friend-info .avatar{
    /* border: 1px solid rgba(255, 255, 255, 0.562); */
    width: 100px;
    height: 100px;
    border-radius: 50px;
    margin:auto;
    background-color: #2C3453;
}

.chat-content .about-friend .content-friend .friend-info .name{
    display: flex;
    /* border: 1px solid rgb(34, 71, 69); */
    justify-content: center;
    color: #0A466E;
    font-weight: bold;
    font-size: 20px;
    align-items: center;
}

.chat-content .about-friend .content-friend .level{
    /* border: 1px solid rgb(34, 71, 69); */
    width: 80%;
    margin:auto;
    height: 12px;
    border-radius: 10px;
    background: linear-gradient(to right, rgba(17, 194, 64, 1), rgba(55, 164, 84, 1), rgba(255, 255, 255, 1));

}

.chat-content .about-friend .content-friend .options{
    /* border: 1px solid rgb(34, 71, 69); */
    grid-template-rows: 50% 25%;
    display: grid;
    padding: 15px;
    justify-content: center;
    align-items: center;


}

.chat-content .about-friend .content-friend .options .fa-address-card{
    color: #0A466E;
    justify-self: center;
    display: flex;
}

.chat-content .view-profile{
    margin-left: 25px;
}

.chat-content .about-friend .content-friend .options .fa-user-lock{
    color: #0A466E;
    display: flex;
    color: #D44444;
}

.chat-content .block-profile{
    margin-left: 25%;
    color:  #0A466E;
    font-weight: 100;

}

.chat-content .about-friend .content-friend .play{
    /* border: 1px solid rgb(34, 71, 69); */
    background-color: transparent;
    align-items: center;
    display: flex;
    justify-content: center;
}

.chat-content .about-friend .content-friend .play button{
    background-color: #D44444;
    color: #D9DBBC;
    border-radius: 100px;
    width: 132px;
    border: none;
    height: 48px;
    font-size: 20px;
    font-weight:bold;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: drop-shadow(0px 4px 4px rgba(212, 68, 68, 0.29));
}

.chat-content .about-friend .content-friend .play button:hover{
    rotate: 360deg;
    transition: 0.6s;
    /* height: 60px; */
}


.chat-content .hidden{
    display: none;
}

.chat-content .more-info img{
    width: 24px;
    height: 24px;
}
