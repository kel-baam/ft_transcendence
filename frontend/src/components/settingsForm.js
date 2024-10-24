import createElement from "../framework/createElement.js";

class settingsForm
{
    constructor(props)
    {
        this.props = props
    }
    render()
    {
        return createElement(
            'div',
            { className: 'settings-container' },
            createElement(
                'div',
                { className: 'section-headings' },
                createElement(
                    'button',
                    {},
                    createElement(
                        'img',
                        { src: '../../assets/images/informations_icon.png', alt:'informations icon'}
                    ),
                    createElement('h1', {}, 'Informations')
                ),
                createElement(
                    'button',
                    {},
                    createElement(
                        'img',
                        { src: '../../assets/images/blocked_fr_icon.png', alt: 'blocked friends icon' }
                    ),
                    createElement('h2', {}, 'Blocked friends')
                ),
                createElement(
                    'button',
                    {},
                    createElement(
                        'i',
                        { className:'fas fa-lock', style:'font-size:20px; color: #0A377E;'}
                    ),
                    createElement('h2', {}, 'Security')
                )
            ),
            createElement(
                'div',
                {},
                createElement(
                    'form',
                    { action: '#' },
                    createElement(
                        'div',
                        {},
                        createElement('img', { src: '../../assets/images/kel-baam.png', alt: 'profile picture', className: 'profile-pic' })
                    ),
                    createElement(
                        'div',
                        {},
                        createElement(
                            'div',
                            {},
                            createElement('label', { for: 'fname' }, 'First name:'),
                            createElement('input', { type: 'text', id: 'fname', name: 'fname', value: 'souad' }),
                            createElement('br'),
                            createElement('label', { for: 'Username' }, 'Username:'),
                            createElement('input', { type: 'text', id: 'user-name', name: 'user-name', value: 'shicham' }),
                            createElement('br'),
                            createElement('label', { for: 'pnumber' }, 'Phone number:'),
                            createElement('input', { type: 'text', id: 'pnumber', name: 'pnumber', value: '0614578894489' }),
                            createElement('br'),
                            createElement('label', { for: 'gender' }, 'Gender:'),
                            createElement('input', { type: 'text', id: 'gender', name: 'gender', value: 'Female' }),
                            createElement('br')
                        ),
                        createElement(
                            'div',
                            {},
                            createElement('label', { for: 'lname' }, 'Last name:'),
                            createElement('input', { type: 'text', id: 'lname', name: 'lname', value: 'hicham' }),
                            createElement('br'),
                            createElement('label', { for: 'age' }, 'Age:'),
                            createElement('input', { type: 'text', id: 'age', name: 'age', value: '36' }),
                            createElement('br'),
                            createElement('label', { for: 'nationality' }, 'Nationality:'),
                            createElement('input', { type: 'text', id: 'nationality', name: 'nationality', value: 'morocco' }),
                            createElement('br'),
                            createElement('label', { for: 'email' }, 'E-mail:'),
                            createElement('input', { type: 'text', id: 'email', name: 'email', value: 'shicham@gmail.com' }),
                            createElement('br')
                        )
                    ),
                    createElement(
                        'div',
                        {},
                        createElement('input', { type: 'submit', value: 'Submit' })
                    )
                )
            )
        )
        // return  createElement(
        //     'div',
        //     {},
        //     createElement(
        //         'form',
        //         { action: '#' },
        //         createElement(
        //             'div',
        //             {},
        //             createElement('img', { src: '../../assets/images/kel-baam.png', alt: 'profile picture', className: 'profile-pic' })
        //         ),
        //         createElement(
        //             'div',
        //             {},
        //             createElement(
        //                 'div',
        //                 {},
        //                 createElement('label', { for: 'fname' }, 'First name:'),
        //                 createElement('input', { type: 'text', id: 'fname', name: 'fname', value: 'souad' }),
        //                 createElement('br'),
        //                 createElement('label', { for: 'Username' }, 'Username:'),
        //                 createElement('input', { type: 'text', id: 'user-name', name: 'user-name', value: 'shicham' }),
        //                 createElement('br'),
        //                 createElement('label', { for: 'pnumber' }, 'Phone number:'),
        //                 createElement('input', { type: 'text', id: 'pnumber', name: 'pnumber', value: '0614578894489' }),
        //                 createElement('br'),
        //                 createElement('label', { for: 'gender' }, 'Gender:'),
        //                 createElement('input', { type: 'text', id: 'gender', name: 'gender', value: 'Female' }),
        //                 createElement('br')
        //             ),
        //             createElement(
        //                 'div',
        //                 {},
        //                 createElement('label', { for: 'lname' }, 'Last name:'),
        //                 createElement('input', { type: 'text', id: 'lname', name: 'lname', value: 'hicham' }),
        //                 createElement('br'),
        //                 createElement('label', { for: 'age' }, 'Age:'),
        //                 createElement('input', { type: 'text', id: 'age', name: 'age', value: '36' }),
        //                 createElement('br'),
        //                 createElement('label', { for: 'nationality' }, 'Nationality:'),
        //                 createElement('input', { type: 'text', id: 'nationality', name: 'nationality', value: 'morocco' }),
        //                 createElement('br'),
        //                 createElement('label', { for: 'email' }, 'E-mail:'),
        //                 createElement('input', { type: 'text', id: 'email', name: 'email', value: 'shicham@gmail.com' }),
        //                 createElement('br')
        //             )
        //         ),
        //         createElement(
        //             'div',
        //             {},
        //             createElement('input', { type: 'submit', value: 'Submit' })
        //         )
        //     )
        // )
    }
}
export default settingsForm