import createElement from "../framework/createElement.js";

class MatchHistory 
{
    constructor(props)
    {
        this.props = props
        this.render()
    }

    connectedCallBack()
    {
        this.render()
        // this.addEventListeners()
    }

    render()
    {
        return(createElement('div', { className: 'match-history-container' },
          createElement('div', { className: 'title-item' },
              createElement('span', {},
                  createElement('h1', {}, 'Match history')
              )
          ),
          createElement('div', { className: 'center-div' },
              createElement('div', { className: 'match-result-item' },
                  createElement('div', { className: 'picture-item' },
                      createElement('img', { src: '../../assets/images/shicham.jpeg', alt: 'profile picture' })
                  ),
                  createElement('div', { className: 'match-result' },
                      createElement('span', { className: 'user_score', style: 'color: #D44444;' }, '1'),
                      createElement('span', { style: 'color: #0B42AF;' }, '-'),
                      createElement('span', { className: 'opponent_score', style: 'color: #0AA989;' }, '3')
                  ),
                  createElement('div', { className: 'picture-item' },
                      createElement('img', { src: '../../assets/images/niboukha.png', alt: 'profile picture' })
                  )
              ),
              createElement('div', { className: 'match-result-item' },
                  createElement('div', { className: 'picture-item' },
                      createElement('img', { src: '../../assets/images/shicham.jpeg', alt: 'profile picture' })
                  ),
                  createElement('div', { className: 'match-result' },
                      createElement('span', { className: 'user-score', style: 'color: #0B42AF;' }, '4'),
                      createElement('span', { style: 'color: #0B42AF;' }, '-'),
                      createElement('span', { className: 'opponent-score', style: 'color: #0B42AF;' }, '4')
                  ),
                  createElement('div', { className: 'picture-item' },
                      createElement('img', { src: '../../assets/images/kjarmoum.png', alt: 'profile picture' })
                  )
              ),
              createElement('div', { className: 'match-result-item' },
                  createElement('div', { className: 'picture-item' },
                      createElement('img', { src: '../../assets/images/shicham.jpeg', alt: 'profile picture' })
                  ),
                  createElement('div', { className: 'match-result' },
                      createElement('span', { className: 'user-score', style: 'color: #D44444;' }, '1'),
                      createElement('span', { style: 'color: #0B42AF;' }, '-'),
                      createElement('span', { className: 'opponent-score', style: 'color: #0AA989;' }, '3')
                  ),
                  createElement('div', { className: 'picture-item' },
                      createElement('img', { src: '../../assets/images/kel-baam.png', alt: 'profile picture' })
                  )
              ),
              createElement('div', { className: 'match-result-item' },
                  createElement('div', { className: 'picture-item' },
                      createElement('img', { src: '../../assets/images/shicham.jpeg', alt: 'profile picture' })
                  ),
                  createElement('div', { className: 'match-result' },
                      createElement('span', { className: 'user-score', style: 'color: #D44444;' }, '1'),
                      createElement('span', { style: 'color: #0B42AF;' }, '-'),
                      createElement('span', { className: 'opponent-score', style: 'color: #0AA989;' }, '3')
                  ),
                  createElement('div', { className: 'picture-item' },
                      createElement('img', { src: '../../assets/images/kel-baam.png', alt: 'profile picture' })
                  )
              )
          ),
           createElement('div', { className: 'view-all-match' },
                  createElement('a', { href: '#' }, 'View all')
              )
      ))
    }

    addEventListeners()
    {

    }
}
export default MatchHistory