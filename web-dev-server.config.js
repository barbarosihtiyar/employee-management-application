/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';
import {readFileSync} from 'fs';
import {resolve} from 'path';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  appIndex: 'index.html',
  middleware: [
    function rewriteIndex(context, next) {
      if (context.url.includes('/employees/') && !context.url.includes('.')) {
        //TODO
        const indexPath = resolve('index.html');
        const indexContent = readFileSync(indexPath, 'utf-8');
        context.body = indexContent;
        context.type = 'html';
        return;
      }
      return next().catch(() => {
        const indexPath = resolve('index.html');
        const indexContent = readFileSync(indexPath, 'utf-8');
        context.body = indexContent;
        context.type = 'html';
      });
    },
  ],
  plugins: [
    legacyPlugin({
      polyfills: {
        // Manually imported in index.html file
        webcomponents: false,
      },
    }),
  ],
};
