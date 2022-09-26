module.exports = {
    name: "skip",
    code: `

    $skip
    $deleteIn[5s]
    $description[The song has been skipped!]
    $color[#e3b5d9]  

    $onlyIf[$voiceId==$voiceId[$clientId];You're not in the same channel{delete:5s}]
    $onlyIf[$voiceId[$clientId]!=;I'm not connected to a channel{delete:5s}]
    $onlyIf[$voiceId!=;You're not in a channel{delete:5s}]
    `
}