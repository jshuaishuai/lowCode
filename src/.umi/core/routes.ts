// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/jiangshuaishuai/Documents/editor/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/component/Loading';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__index' */'@/layouts/index'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/",
        "title": "编辑器",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Editor' */'@/pages/Editor'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
