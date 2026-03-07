class Utils {
    static getSemester(semNum) {
        const num = parseInt(semNum)
        const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

        return num - 1 < 8 ? `${semesters[num - 1]} Semester` : '';
    }

    static capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    static generateTitleFromURL(url) {

        let parts = url.replace(".html", "").split("/").slice(3);
        let sem = parts[1].split("_").join(" ");
        sem = Utils.capitalize(sem);

        let sub = parts[2].split("_").map(Utils.capitalize).join(" ");
        let paper = parts[3].split("_").join(" ").toUpperCase();
        let unit = parts[4].split("_").join(" ");
        unit = Utils.capitalize(unit);

        let semester = Utils.getSemester(parts[1].split("_")[1]);

        return `${sub} ${paper} ${unit} | ${semester} Notes`;
    }

    static timeAgo(unixMs) {
        const now = Date.now()
        const diffMs = now - unixMs

        const seconds = Math.floor(diffMs / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (seconds < 60) return `${seconds} seconds ago`
        if (minutes < 60) return `${minutes} minutes ago`
        if (hours < 24) return `${hours} hours ago`
        return `${days} days ago`
    }
};
