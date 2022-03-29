import { createApp } from 'vue';
// h(type, propsOrChildren, children)
// console.log(h)

// 客户端不用createApp，用createSSRApp启动的话，可以激活hydration这个功能
let app = createApp({
	mounted() {
		this.user = 'Li Chen Fan';
	},
	data() {
		return {
			user: 'Li Sen'
		}
	},
	template: `
		<div>Current User is: {{user}}</div>
		<button id="button">Click Me From Event</button>
		`
});

// createApp的mount会给rootElement添加 data-v-app的标签
// createSSRApp则不会
app.mount('#app');



