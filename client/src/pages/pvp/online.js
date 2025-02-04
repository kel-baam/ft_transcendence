import { createApp, defineComponent, h } from '../../package/index.js'
import { header } from '../../components/header.js'
import { sidebarLeft } from '../../components/sidebar-left.js'
import { showErrorNotification } from '../utils/errorNotification.js'

export const OnlinePvp = defineComponent({
    state() {
        return {
            socket: null,
            player_data: {},
            user_data: {}
        }
    },

    async initWebSocket() {
        if (this.state.socket && this.state.socket.readyState === WebSocket.OPEN) {
            console.log("WebSocket already open.");
            return;
        }

        this.updateState({ socket: new WebSocket('ws://localhost:8003/ws/matchmaking/') });

        this.state.socket.onopen = () => {
            console.log('WebSocket connection established');
            this.state.socket.send(JSON.stringify({ action: 'find_opponent' }));
        };

        this.state.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket Data:', data);

            if (data.action === "match_not_found") {
                showErrorNotification(data.message);
                this.appContext.router.navigateTo('/playerVSplayer');
            } else if (data.action === "user_data") {
                this.updateState({ user_data: data.user });
            } else if (data.action === "match_found") {
                console.log("in match found :", data);
                this.updateState({ player_data: data.opponent });
            } else if (data.action === "opponent_disconnected") {
                showErrorNotification(data.message);
                this.appContext.router.navigateTo('/playerVSplayer');
            }
        };

        this.state.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    },

    onMounted() {
        this.initWebSocket();
    },

    onUnmounted() {
        if (this.state.socket) {
            this.state.socket.close();
            this.updateState({ socket: null });
        }
    },

    render() {
        return h('div', { id: 'global' }, [
            h(header, {}),
            h('div', { class: 'content' }, [
                h(sidebarLeft, {}),
                h('div', { class: 'game-content' }, [
                    h('div', { class: 'user-profile' }, [
                        h('img', { src: './images/niboukha 1 (1).png' }),
                        h('h3', {}, [this.state.user_data.username || "Unknown"])
                    ]),
                    h('div', { class: 'vs' }, [h('img', { src: './images/vs.png' })]),
                    h('div', { class: 'invited' }, [
                        h('img', { src: './images/player.png' }),
                        h('h3', {}, [this.state.player_data.username || "Searching..."])
                    ])
                ])
            ])
        ]);
    }
});
