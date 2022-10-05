import App from './components/app.svelte';
import CompetitionList from './components/competition-list.svelte';
import CompetitionDetail from './components/competition-detail.svelte';
import { routes } from 'svelte-hash-router'


routes.set({
	'/': {
		$$component: CompetitionList,
		$$name: 'CompetitionList'
	},
	'/competition/': {
		$$component: CompetitionDetail,
		$$name: 'CompetitionDetail',
		':id':CompetitionDetail
	},
	'*': {
		$$redirect: '/'
	}
})


const app = new App({
	target: document.body,
});

export default app;