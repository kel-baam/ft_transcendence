import {RouterOutlet,h,createApp,defineComponent,HashRouter} from '../../package/index.js'
export const Unauthorized = defineComponent({
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
        }, ['401 Unauthorized !']),
        h('img', {
          src: 'https://i.gifer.com/W3Bj.gif', 
          alt: 'Funny 401 GIF',
          style: {
            width:"400px",
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
            fontSize: '1.8rem', 
            fontWeight: 'bold',
            color: "#FFEEBF",
            padding: '20px',
            textShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)",
          }
        }, ['Oops! Unauthorized Access.']),
         
      ]);
    }
  });