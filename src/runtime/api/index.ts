import type { Resolver } from '@nuxt/kit';
import { addServerHandler } from '@nuxt/kit';

export * from './swagger';

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
    route: '/te-api/themes/full/:id',
    handler: resolver.resolve('./themes/getFullById.ts'),
    method: 'get'
  });
  addServerHandler({
    route: '/te-api/themes/check-conflict/:id',
    handler: resolver.resolve('./themes/checkConflictById.ts'),
    method: 'post'
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
