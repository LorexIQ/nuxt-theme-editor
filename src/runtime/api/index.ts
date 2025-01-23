import type { Resolver } from '@nuxt/kit';
import { addServerHandler } from '@nuxt/kit';

export default function (resolver: Resolver) {
  addServerHandler({
    route: '/te-api/themes',
    handler: resolver.resolve('./themes/getAll.ts'),
    method: 'get'
  });
  addServerHandler({
    route: '/te-api/themes/:id',
    handler: resolver.resolve('./themes/getById.ts'),
    method: 'get'
  });
  addServerHandler({
    route: '/te-api/themes',
    handler: resolver.resolve('./themes/add.ts'),
    method: 'post'
  });
  addServerHandler({
    route: '/te-api/themes/:id',
    handler: resolver.resolve('./themes/update.ts'),
    method: 'put'
  });
  addServerHandler({
    route: '/te-api/themes/:id',
    handler: resolver.resolve('./themes/deleteById.ts'),
    method: 'delete'
  });
}
