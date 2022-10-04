import App from './components/app.svelte';
import CompetitionList from './components/competition-list.svelte';
import { routes } from 'svelte-hash-router'


routes.set({
	'/': {
	  $$component: CompetitionList,
	   $$name: 'CompetitionList'
	 },
	'*': {
	  $$redirect: '/'
	}
  })


const app = new App({
	target: document.body,
});

export default app;