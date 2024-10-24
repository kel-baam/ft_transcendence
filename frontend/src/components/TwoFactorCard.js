import createElement from "../framework/createElement.js"
class TwoFactorContent{
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
                    createElement('h2', {}, 'Informations')
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
                    {style:'background-color: rgba(0, 0, 0, 0.2);'},
                    createElement(
                        'i',
                        { className:'fas fa-lock', style:'font-size:20px; color: #0A377E;'}
                    ),
                    createElement('h2', {}, 'Security')
                )
            ),createElement('div', {className:'two-f-content'}, 
                createElement('h1', {}, 'Two-Factor authentication (2FA)'),
                createElement('div', {}, 'Enhance your security with Two-Factor Authentication (2FA). ', 
                    createElement('br', {}, 'This robust security measure adds an extra layer of protection'),
                    createElement('br', {}, 'to your account by requiring two forms of verification'),
                    createElement('br', {}, 'before granting access.')
                )
            ),
            createElement('button', {}, 'Activate 2FA')

        )
    }
}
export default TwoFactorContent;