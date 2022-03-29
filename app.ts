import { Component, ComputedRef, createSSRApp, defineAsyncComponent, h } from 'vue';
import {
	renderToString
} from '@vue/server-renderer';
import express, { Application } from 'express';
import http from 'http';
import pool from 'generic-pool';

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
		template: `<div>Current User is: {{user}}</div>`
	});

	const appContent = await renderToString(app);

	const html = `
		<!Doctype html>
		<html>
			<body>
				<h1> My first SSR Server </h1>
				<div id="app">${appContent}</div>
				<script src="https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.min.js"></script>
				<!--<script src="/entry-client.js"></script>-->
				<script>
					/**
					 * vue 没有提供umd的包，需要shim
					*/
					require.config({
						paths: {
							'main': '/entry-client',
							'rxjs': '/node_modules/rxjs/dist/bundles/rxjs.umd',
							'vue': '/vue/dist/vue.global.prod'
						},
						shim: {
							vue: {
								exports: 'Vue'
							}
						}
					});
					require(['main'], () => {
						// 目前强依赖DOM结构，只能这么写，当然还可以SSR，就不需要了
						require(['./rxjs/index.js'])
					});
				</script>
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
