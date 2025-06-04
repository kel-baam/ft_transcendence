import {h,defineComponent} from '../../package/index.js'
// import { Profile } from './components/profile.js'
export const NotFound = defineComponent({
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
            filter: "blur(px)",
            margin: '0', 
          }
        }, ['404 Not Found !']),
        h('img', {
          src: 'https://i.gifer.com/jVo.gif', 
          alt: 'Funny 404 GIF',
          style: {
            maxWidth: "80%", 
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
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)", // Shadow for text
          }
        }, ['Oops! Looks like you are lost.']),
         
      ]);
    }
  });