const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const compilerSfc = require('@vue/compiler-sfc');
const compilerDom = require('@vue/compiler-dom');

app.use(async ctx => {
    const {request: {url, query}} = ctx;

    console.log(url);
    if (url === '/') {
        ctx.type = "text/html";
        let content = fs.readFileSync('./index.html', 'utf-8');

        ctx.body = content
    } else if (url.endsWith('.js')) {
        const p = path.resolve(__dirname, url.slice(1));
        ctx.type = "application/javascript";
        const content = fs.readFileSync(p, 'utf-8');
        ctx.body = rewriteProcess(rewriteImport(content))
    } else if (url.startsWith('/@modules/')) {
        const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@modules/', ''));
        const module = require(prefix + '/package.json').module;
        const p = path.resolve(prefix, module);
        const ret = fs.readFileSync(p, 'utf-8');
        ctx.type = "application/javascript";
        ctx.body = rewriteProcess(rewriteImport(ret))
    } else if (url.indexOf('.vue') > -1) {
        const p = path.resolve(__dirname, url.split('?')[0].slice(1));
        const {descriptor} = compilerSfc.parse(fs.readFileSync(p, 'utf-8'));

        if (!query.type) {
            ctx.type = "application/javascript";
            ctx.body = `
            ${rewriteProcess(rewriteImport(descriptor.script.content.replace('export default ', 'const __script = ')))}
            import { render as __render } from "${url}?type=template"
            __script.render = __render
            export default __script
            `
        } else if (query.type === 'template') {
            const template = descriptor.template;
            const render = compilerDom.compile(template.content, {mode: 'module'}).code;
            ctx.type = "application/javascript";
            ctx.body = rewriteProcess(rewriteImport(render))
        }
    } else if (url.endsWith('.css')) {
        const p = path.resolve(__dirname, url.slice(1));
        const file = fs.readFileSync(p, 'utf-8');
        const content = `
            const css = "${file.replace(/\n/g, '')}"
            let link = document.createElement('style')
            link.setAttribute('type', 'text/css')
            document.head.appendChild(link)
            link.innerHTML = css
            export default css
        `;
        ctx.type = "application/javascript";
        ctx.body = content
    }
})

app.listen(3000, () => {
    console.log('监听端口3000');
})

function rewriteImport(content) {
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, function (s0, s1) {
        if (s1[0] !== '.' && s1[1] !== '/') {
            return ` from '/@modules/${s1}'`
        } else {
            return s0
        }
    })
}

function rewriteProcess(content) {
    return content.replace(/process.env.NODE_ENV/g, '"development"')
}