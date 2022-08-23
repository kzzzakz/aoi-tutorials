module.exports = {
    name: "play",
    $if: "v4",
    code: `
    $playTrack[youtube;$message]

    $onlyIf[$voiceId==$voiceId[$clientId];You're not in the same channel]
    $if[$hasPlayer==false]
        $joinVc[$voiceId]
    $endif
    $onlyIf[$voiceId!=;You're not in a channel]
    `
}