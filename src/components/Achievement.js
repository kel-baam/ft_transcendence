import createElement from "../framework/createElement.js";

class Achievement  
{
    constructor(props)
    {
        this.props = props;
        this.render()
    }


    createBadgeItem() {
        return createElement('div', { className: 'badge-item' },
            createElement('img', { 
                src: './images/lock.png', 
                alt: 'lock icon' 
            })
        );
    }
    
    render()
    {
        return(createElement('div', { className: 'achievements-container' },
            createElement('div', { className: 'achievements-title-elt' },
                createElement('h1', {}, 'Achievements')
            ),
            createElement('div', { className: 'badges-container' },
                this.createBadgeItem(),
                this.createBadgeItem()
            ),
            createElement('div', { className: 'badges-container' },
                this.createBadgeItem(),
                this.createBadgeItem()
            )
        ))
    }

    addEventListeners()
    {

    }
    
}
export default Achievement