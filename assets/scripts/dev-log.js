const GITHUB_USERNAME = 'SKR0411'
const REPO_NAME = 'Knowlet'

async function fetchRepoInfo(){
	const box = document.getElementById('repo-info')

	try{
		const res = await fetch(
			`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}`
		)

		const repo = await res.json()

		const updatedAgo = getTimeAgo(
			new Date(repo.updated_at)
		)

		box.innerHTML = `
			<h2>${repo.full_name}</h2>
			<p>${repo.description || 'No description available'}</p>

			<div class="repo-stats">
				<span>⭐ ${repo.stargazers_count}</span>
				<span>🍴 ${repo.forks_count}</span>
				<span>🕒 Updated ${updatedAgo}</span>
				<a href="${repo.html_url}" target="_blank">
					View on GitHub
				</a>
			</div>
		`

	}catch(err){
		box.innerHTML = 'Failed to load repo info'
	}
}

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

		mergeCommits.slice(0, 10).forEach(item => {
		
			const commitDate = new Date(item.commit.author.date)
		
			const date = commitDate.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			})
		
			const timeAgo = getTimeAgo(commitDate)
		
			const authorName = item.commit.author.name
			const avatar = item.author?.avatar_url || ''
			const profile = item.author?.html_url || '#'
			const commitUrl = item.html_url
		
			container.innerHTML += `
				<div class="log-entry">
		
					<div class="meta">
						<span class="date">${date} • ${timeAgo}</span>
						<a href="${commitUrl}" target="_blank" class="hash">
							${item.sha.slice(0,7)}
						</a>
					</div>
		
					<div class="commit-msg">
						${item.commit.message.split('\n')[0]}
					</div>
		
					<div class="author">
						<img src="${avatar}" class="avatar">
						<a href="${profile}" target="_blank">
							${authorName}
						</a>
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

function getTimeAgo(date){
	const seconds = Math.floor((new Date() - date) / 1000)

	const intervals = [
		{ label: 'year', seconds: 31536000 },
		{ label: 'month', seconds: 2592000 },
		{ label: 'day', seconds: 86400 },
		{ label: 'hour', seconds: 3600 },
		{ label: 'minute', seconds: 60 }
	]

	for (let i of intervals){
		const count = Math.floor(seconds / i.seconds)
		if (count >= 1){
			return `${count} ${i.label}${count > 1 ? 's' : ''} ago`
		}
	}

	return 'just now'
}

fetchRepoInfo()
fetchMergeCommits()
