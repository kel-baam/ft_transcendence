import {RouterOutlet,h,createApp,defineComponent,HashRouter} from '../../package/index.js'

export const ComingSoon = defineComponent({
    render() {
      return h('div', {
        class: 'container',
        style: {
         
          textAlign: "center",
          color: "#FFEEBF",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }
      }, [
        
        h('h1', {
          class: 'NotFound', 
          style: {
            'padding-bottom': '30px',
            fontSize: "6rem",
            color: "#FFEEBF",
            textShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)", 
            filter: "blur(0.1px)",
            margin: '0', 
          }
        }, ['Coming Soon !']),
        h('img', {
          src: 'https://i.gifer.com/lf.gif', 
          alt: 'Funny coming soon GIF',
          style: {
            width:"500px",
            height:'auto',
            borderRadius: "15px",
            boxShadow: "0 0px 5px rgba(0, 0, 0, 1)", 
            marginBottom: '30px',
            transition: 'transform 0.3s ease-in-out', 
          }
        }),
        h('p', {
          class:'oops',
          style: {
            fontSize: '1.3rem', 
            fontWeight: 'bold',
            color: "#FFEEBF",
            padding: '20px',
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)",
          }
        }, ['Something awesome is on the way. Stay tuned!']),
         
      ]);
    }
  });