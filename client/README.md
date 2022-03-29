### 独立的package.json和node_modules

- 进入当前./client的文件夹单独拉取
	- cd ./client
	- npm ci --verbose (依赖package-lock.json)
- 单独配置tsconfig.json，module依赖项改为amd|es20xx都可以
	- amd模式的，需要script独立引入require.js
		- 需要独立配置require.config中的paths，别名及引入
		- 因为vue没有umd的包配置，需要单独shim一下，见ssr的app.ts
		- 强依赖dom结构的，如果渲染在客户端的main之后，需要require(['main'], () => require(['otherJS']))

	- es20xx模式的，需要设置script的属性type为"module"  `<script src="module"></script>`
		- 这块直接这么设置会有问题，需要看vite源代码怎么处理的
		- 暂时不这么干，还是先紧写代码部分，再说构建速度
- 依赖公共node_modules的部分，比如vue，需要引入@babel/types的支持在项目根目录，非.client

- 在./client文件夹下，tsc --watch 即可