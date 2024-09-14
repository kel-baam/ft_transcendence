import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/Renderer.js";
import VirtualDOM from "../framework/VirtualDOM.js";

class MatchHistory extends HTMLElement
{
    constructor()
    {
        super()
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.root = document.getElementsByClassName('other-cards')[0]
        this.connectedCallBack()
    }

    connectedCallBack()
    {
        this.render()
        // this.addEventListeners()
    }

    render()
    {
        render(VirtualDOM.createElement('div', { className: 'match-history-container' },
          VirtualDOM.createElement('div', { className: 'title-item' },
              VirtualDOM.createElement('span', {},
                  VirtualDOM.createElement('h1', {}, 'Match history')
              )
          ),
          VirtualDOM.createElement('div', { className: 'center-div' },
              VirtualDOM.createElement('div', { className: 'match-result-item' },
                  VirtualDOM.createElement('div', { className: 'picture-item' },
                      VirtualDOM.createElement('img', { src: '../../assets/images/shicham.jpeg', alt: 'profile picture' })
                  ),
                  VirtualDOM.createElement('div', { className: 'match-result' },
                      VirtualDOM.createElement('span', { className: 'user_score', style: 'color: #D44444;' }, '1'),
                      VirtualDOM.createElement('span', { style: 'color: #0B42AF;' }, '-'),
                      VirtualDOM.createElement('span', { className: 'opponent_score', style: 'color: #0AA989;' }, '3')
                  ),
                  VirtualDOM.createElement('div', { className: 'picture-item' },
                      VirtualDOM.createElement('img', { src: '../../assets/images/niboukha.png', alt: 'profile picture' })
                  )
              ),
              VirtualDOM.createElement('div', { className: 'match-result-item' },
                  VirtualDOM.createElement('div', { className: 'picture-item' },
                      VirtualDOM.createElement('img', { src: '../../assets/images/shicham.jpeg', alt: 'profile picture' })
                  ),
                  VirtualDOM.createElement('div', { className: 'match-result' },
                      VirtualDOM.createElement('span', { className: 'user-score', style: 'color: #0B42AF;' }, '4'),
                      VirtualDOM.createElement('span', { style: 'color: #0B42AF;' }, '-'),
                      VirtualDOM.createElement('span', { className: 'opponent-score', style: 'color: #0B42AF;' }, '4')
                  ),
                  VirtualDOM.createElement('div', { className: 'picture-item' },
                      VirtualDOM.createElement('img', { src: '../../assets/images/kjarmoum.png', alt: 'profile picture' })
                  )
              ),
              VirtualDOM.createElement('div', { className: 'match-result-item' },
                  VirtualDOM.createElement('div', { className: 'picture-item' },
                      VirtualDOM.createElement('img', { src: '../../assets/images/shicham.jpeg', alt: 'profile picture' })
                  ),
                  VirtualDOM.createElement('div', { className: 'match-result' },
                      VirtualDOM.createElement('span', { className: 'user-score', style: 'color: #D44444;' }, '1'),
                      VirtualDOM.createElement('span', { style: 'color: #0B42AF;' }, '-'),
                      VirtualDOM.createElement('span', { className: 'opponent-score', style: 'color: #0AA989;' }, '3')
                  ),
                  VirtualDOM.createElement('div', { className: 'picture-item' },
                      VirtualDOM.createElement('img', { src: '../../assets/images/kel-baam.png', alt: 'profile picture' })
                  )
              ),
              VirtualDOM.createElement('div', { className: 'match-result-item' },
                  VirtualDOM.createElement('div', { className: 'picture-item' },
                      VirtualDOM.createElement('img', { src: '../../assets/images/shicham.jpeg', alt: 'profile picture' })
                  ),
                  VirtualDOM.createElement('div', { className: 'match-result' },
                      VirtualDOM.createElement('span', { className: 'user-score', style: 'color: #D44444;' }, '1'),
                      VirtualDOM.createElement('span', { style: 'color: #0B42AF;' }, '-'),
                      VirtualDOM.createElement('span', { className: 'opponent-score', style: 'color: #0AA989;' }, '3')
                  ),
                  VirtualDOM.createElement('div', { className: 'picture-item' },
                      VirtualDOM.createElement('img', { src: '../../assets/images/kel-baam.png', alt: 'profile picture' })
                  )
              )
          ),
           VirtualDOM.createElement('div', { className: 'view-all-match' },
                  VirtualDOM.createElement('a', { href: '#' }, 'View all')
              )
      ), this.root)
      // render()

    }

    addEventListeners()
    {

    }
}
window.customElements.define('match-history', MatchHistory)
export default MatchHistory