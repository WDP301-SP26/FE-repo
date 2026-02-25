import { authHandlers } from './auth';
import { githubHandlers } from './github';
import { groupHandlers } from './groups';
import { projectHandlers } from './projects';

export const handlers = [
  ...authHandlers,
  ...githubHandlers,
  ...groupHandlers,
  ...projectHandlers,
];
