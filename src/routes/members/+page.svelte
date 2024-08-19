<script>
	import MemberPage from "./MemberPage.svelte";

	let { data } = $props();
	let { officers, primary_track_members, foundational_track_members, year_string } = data;
</script>

<MemberPage {officers} {primary_track_members} {foundational_track_members} {year_string}></MemberPage>
