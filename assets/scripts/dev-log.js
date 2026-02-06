const GITHUB_USERNAME = 'SKR0411'
const REPO_NAME = 'Knowlet'

async function fetchMergeCommits(){
	const container = document.getElementById('log-container')

	try{
		const res = await fetch(
			`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/commits?per_page=100`
		)

		const allCommits = await res.json()

		const mergeCommits = allCommits.filter(
			c => c.parents.length >= 2
		)

		container.innerHTML = ''

		if(!mergeCommits.length){
			container.innerHTML = `
				<div class="loading">
					No merge commits found yet
				</div>`
			return
		}

		mergeCommits.slice(0,10).forEach(item => {

			const date = new Date(
				item.commit.author.date
			).toLocaleDateString('en-US',{
				month:'short',
				day:'numeric',
				year:'numeric'
			})

			container.innerHTML += `
				<div class="log-entry">
					<div class="meta">
						<span class="date">${date}</span>
						<span class="hash">${item.sha.slice(0,7)}</span>
					</div>

					<div class="commit-msg">
						${item.commit.message}
					</div>

					<div class="author">
						Merged by ${item.commit.author.name}
					</div>
				</div>
			`
		})

	}catch(err){
		container.innerHTML = `
			<div class="loading" style="color:red;">
				Failed to load commits
			</div>`
		console.error(err)
	}
}

fetchMergeCommits()
