import { RestEndpointMethodTypes } from "@octokit/rest";

export type PullRequest = RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"][0];
