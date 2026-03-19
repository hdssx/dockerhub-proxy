// DockerHub 代理核心逻辑
const DOCKER_HUB_REGISTRY = 'registry-1.docker.io';
const AUTH_DOMAIN = 'auth.docker.io';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // 替换请求域名为 DockerHub 官方域名
    if (url.pathname.startsWith('/v2/')) {
      url.hostname = DOCKER_HUB_REGISTRY;
    } else {
      url.hostname = AUTH_DOMAIN;
    }
    // 转发请求并修改响应头，允许跨域
    const modifiedRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    const response = await fetch(modifiedRequest);
    const modifiedResponse = new Response(response.body, response);
    // 允许跨域访问
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
    modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return modifiedResponse;
  }
};
