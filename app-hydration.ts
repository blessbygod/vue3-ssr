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

	const app = createSSRApp({
		data() {
			return {
				user: 'Li Sen'
			}
		},
		template: `Current User is: {{user}}`
	});

	const appContent = await renderToString(app);

	const html = `
		<!Doctype html>
		<html>
			<body>
				<h1> My first SSR Server </h1>
				<div id="app">${appContent}</div>
				<script type="module" src="/entry-client-hydration.js"></script>
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
