import createElement from "../framework/createElement.js";
import settingsForm from "./settingsForm.js";

class settingsHeader
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
                        {},
                        createElement(
                            'i',
                            { className:'fas fa-lock', style:'font-size:20px; color: #0A377E;'}
                        ),
                        createElement('h2', {}, 'Security')
                    )
                ),
               createElement(settingsForm, {})
            )
    }
}
export default settingsHeader