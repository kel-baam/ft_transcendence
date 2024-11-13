// import render from "../framework/render.js";
import createElement from "../framework/createElement.js";
// import createDOMElement from "../framework/createDOMElement.js";

class WinningRate {
    constructor(props)
    {
        // super()
        this.props = props
        // this.attachShadow({ mode: 'open' });
        // this.root =  document.getElementsByClassName('infos')[0]
        // this.connectedCallBack()
        this.render()
    }
    
    connectedCallBack()
    {
        this.render()
        // const container = document.getElementsByClassName('infos')[0]
        // container.appendChild(this.root)
        // this.addEventListeners()
    }


    drawWinningCircle() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const percentage = 50; 
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const endAngle = (Math.PI * 2) * (percentage / 100);
        this.drawCircle('#ddd',endAngle , (Math.PI * 2), canvas);

        this.drawCircle('#0AA989', 0, endAngle, canvas);

        this.drawPercentageText(canvas);

        }
        drawCircle(color, startAngle, endAngle, canvas) {
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 82;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = 8;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        drawPercentageText(canvas) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const percentage = 50;
        ctx.font = '26px "myFont"';
        ctx.fillStyle = '#0AA989'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, centerX, centerY);
    }
    
    render()
    {
        return(createElement('div', { className: 'wining-rate-container' },
            createElement('div', { className: 'title' },
                createElement('span', {},
                    createElement('h1', {}, 'Wining rate')
                )
            ),
            createElement('div', { className: 'circle-and-buttons' },
                createElement('div', { className: 'circle-progress' },
                    createElement('canvas', {id:'canvas',height: '190'}
                    )
                ),
                createElement('div', { className: 'buttons' },
                    createElement('button', { className: 'win-button' },
                        'Win',
                        createElement('br'),
                        '51/150'
                    ),
                    createElement('button', { className: 'lose-button' },
                        'Lose',
                        createElement('br'),
                        '0/150'
                    ),
                    createElement('button', { className: 'draw-button' },
                        'Draw',
                        createElement('br'),
                        '0/150'
                    )
                )
            )
        ))
        
        // this.drawWinningCircle()
        
    }

    addEventListeners()
    {

    }
}
window.customElements.define('winning-rate', WinningRate)
export default WinningRate