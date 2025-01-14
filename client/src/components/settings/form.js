import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../../package/index.js'

export const Form = defineComponent({
    render ()
    {
        return h('div',
                    {},
                    [h('form',{ action: '#' },
                        [h('div', {},[h('img', { src: 'images/kel-baam.png', alt: 'profile picture', class: 'profile-pic' }), 
                            h('i', { class: 'fa-solid fa-camera', style: {color: '#5293CB'}  })
                        ]),
                            h('div', {},[
                                    h('div',{},
                                        [
                                            h('label', { for: 'fname' }, ['First name:']),
                                            h('input', { type: 'text', id: 'fname', name: 'fname', value: 'souad' }),
                                            h('br'),
                                            h('label', { for: 'Username' }, ['Username:']),
                                            h('input', { type: 'text', id: 'user-name', name: 'user-name', value: 'shicham' }),
                                            h('br'),
                                            h('label', { for: 'pnumber' }, ['Phone number:']),
                                            h('input', { type: 'text', id: 'pnumber', name: 'pnumber', value: '0614578894489' }),
                                            h('br'),
                                            h('label', { for: 'email' }, ['E-mail:']),
                                            h('input', { type: 'text', id: 'email', name: 'email', value: 'shicham@gmail.com' }),                                  
                                            h('br')
                                        ]
                                    ),
                                    h('div',{},
                                        [
                                            h('label', { for: 'lname' }, ['Last name:']),
                                            h('input', { type: 'text', id: 'lname', name: 'lname', value: 'hicham' }),
                                            h('br'),
                                            h('label', { for: 'age' }, ['Age:']),
                                            h('input', { type: 'text', id: 'age', name: 'age', value: '36' }),
                                            h('br'),
                                            h('label', { for: 'nationality' }, ['Nationality:']),
                                            h('input', { type: 'text', id: 'nationality', name: 'nationality', value: 'morocco' }),
                                            h('br'),
                                            h('label', { for: 'gender' }, ['Gender:']),
                                            h('select',
                                                { name: 'gender', id: 'gender' },
                                            [
                                                h('option', { value: 'Female' }, ['Female']),
                                                h('option', { value: 'Male' }, ['Male'])
                                            ]
                                            ),
                                            h('br')
                                        ]
                                    )
                                ]
                            ),
                            h('div',{},
                                [
                                    h('button', { type : 'submit'}, ['Submit'])
                                ]
                            )
                        ])
                    ])
                
    }
})