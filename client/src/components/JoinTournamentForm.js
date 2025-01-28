import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

export const JoinTournamentForm = defineComponent({render()
    {
        return  h('div', { class: 'join-player-form' }, [
            h('i', {
                class   : 'fa-regular fa-circle-xmark icon',
                on      : {
                    click : () => {
                        this.updateState({
                            isBlur: false,
                        })
                    }
                }
            }),
            h('form', {
                class   : 'form1',
                on      : {submit: this.submitForm.bind(this) }
            }, [
                h('div', { class: 'avatar' }, [
                    h('img', { 
                        class   : 'createAvatar', 
                        src     : './images/people_14024721.png', 
                        alt     : 'Avatar' 
                    }),
                    h('div', { 
                        class   : 'editIcon', 
                        on      : {
                            click: () => { document.getElementById(`file-upload1`).click(); }
                        }
                    }, [
                        h('input', {
                            type    : 'file',
                            id      : 'file-upload1',
                            name    : 'player_avatar',
                            accept  : 'image/*',
                            style   :{
                                display         : 'none',
                                pointerEvents   : 'none'
                            },
                            on      : { change: (event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    const reader    = new FileReader();
                                    reader.onload   = (e) => {
                                        document.querySelector(`.createAvatar`).src = e.target.result;
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        }),
                        h('i', { class: 'fas fa-edit icon' })
                    ])
                ]),
                h('div', { class: 'createInput' }, [
                    h('label', { htmlFor: 'playerNickname' }, ['Nickname:']),
                    h('br'),
                    h('input', { 
                        type        : 'text', 
                        name        : 'nickname', 
                        placeholder : 'Enter Nickname...' 
                    })
                ]),
                h('button', { type: 'submit' }, ['Submit'])
            ])
        ]);
    }
})

