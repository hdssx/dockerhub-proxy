// 修复版 DockerHub 代理 - 处理 ns 参数和路径转发
const DOCKER_HUB_REGISTRY = 'registry-1.docker.io';
const AUTH_DOMAIN = 'auth.docker.io';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 清理 ns 参数，避免 Bad Request
    url.searchParams.delete('ns');
    
    // 转发请求到正确的 DockerHub 域名
    if (url.pathname.startsWith('/v2/')) {
      url.hostname = DOCKER_HUB_REGISTRY;
    } else {
      url.hostname = AUTH_DOMAIN;
    }
    
    // 构建新请求，保留原请求的方法和头信息
    const modifiedRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });
    
    // 发送请求并处理响应
    try {
      const response = await fetch(modifiedRequest);
      const modifiedResponse = new Response(response.body, response);
      
      // 允许跨域，避免请求被拦截
      modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
      modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return modifiedResponse;
    } catch (e) {
      // 错误处理，返回友好提示
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
