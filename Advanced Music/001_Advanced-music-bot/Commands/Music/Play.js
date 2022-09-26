module.exports = {
    name: "play",
    $if: "v4",
    code: `
    $deleteIn[5s]
    $if[$hasPlayer==true]
      $loop[1;{"title":"$replaceText[$songInfo[title];";\"]","thumbnail":"$songInfo[thumbnail]","channel":"$getServerVar[MUSIC_channel]","message":"$getServerVar[MUSIC_embedMessage]","guild":"$guildId"};embedUpdate]
      $thumbnail[$songInfo[thumbnail;$math[$queueLength-1]]]
    $else
      $thumbnail[$songInfo[thumbnail]]
    $endif

    $title[$get[msg]]
    $color[#e3b5d9]

    $if[$checkContains[$message;https://open.spotify.com/track/;https://open.spotify.com/playlist/]==true]
      $let[msg;$playTrack[spotify;$message]]
    $else
      $let[msg;$playTrack[youtube;$message]]
    $endif

    $onlyIf[$voiceId==$voiceId[$clientId];You're not in the same channel{delete:5s}]
    $if[$hasPlayer==false]
        $joinVc[$voiceId]
    $endif
    $onlyIf[$voiceId!=;You're not in a channel{delete:5s}]
    `
}