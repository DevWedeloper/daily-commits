import type { Octokit } from '@octokit/rest';

export type ListForUser = Awaited<
  ReturnType<Octokit['rest']['repos']['listForUser']>
>['data'][1];
