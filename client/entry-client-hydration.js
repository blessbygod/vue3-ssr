import { h, createSSRApp } from "/vue/dist/vue.esm-browser.js";

// h(type, propsOrChildren, children)
console.log(h)

// 客户端不用createApp，用createSSRApp启动的话，可以激活hydration这个功能
let app = createSSRApp({
	mounted() {
		this.user = 'Li Chen Fan';
	},
	data() {
		return {
			user: +new Date
		}
	},
	template: `Current User is: {{user}}`
});

// createApp的mount会给rootElement添加 data-v-app的标签
// createSSRApp则不会
app.mount('#app');
