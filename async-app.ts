import { Component, ComputedRef, createSSRApp, defineAsyncComponent, h } from 'vue';
import {
	renderToString,
	renderToWebStream,
	renderToNodeStream
} from '@vue/server-renderer';
import express, { Application } from 'express';
import http from 'http';

const app: Application = express();

// 定义静态目录
app.use(express.static(`${__dirname}/client`), (req, res, next) => {
	console.log(`static req.url ${req.url}`);
	next();
});
app.use(express.static(`${__dirname}/node_modules`), (req, res, next) => {
	console.log(`static req.url ${req.url}`);
	next();
})
// 定义路由规则
app.get('/', async (req, res) => {
	console.log(`req.url ${req.url}`);

	let Comp = () => h('button',
		{ onClick() { }, },
		'hello!'
	)
	let serverResolve: any;
	// 定义一个需要异步引入组件
	let AsyncComp = defineAsyncComponent(() =>
		new Promise(r => {
			serverResolve = r;
		})
	);

	const app = createSSRApp({
		render() {
			return ['hello', h(AsyncComp), 'world'];
		}
	});

	const htmlPromise = renderToString(app);
	serverResolve(Comp);
	const appContent = await htmlPromise;
	const html = `
		<!Doctype html>
		<html>
			<body>
				<h1> My first SSR Server </h1>
				<div id="app">${appContent}</div>
				<script type="module" src="/entry-client.js"></script>
			</body>
		</html>
	`;

	res.end(html);

	// ssr的renderToStream只支持纯静态页面，就是没有数据混合的页面
});


let server = http.createServer(app);
server.listen(8080, () => {
	console.log('Server is start on 8080')
})
