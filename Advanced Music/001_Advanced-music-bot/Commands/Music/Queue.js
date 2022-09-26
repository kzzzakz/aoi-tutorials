module.exports = {
	name: "queue",
	$if: "v4",
	code: `
    $if[$hasPlayer==true]
        $title[Now playing: $songInfo[title] | $serverName]
        $description[
                $djsEval[
                        let s = 14 * (d.data.vars.page - 1);
                        let n = s + 14
                        d.data.array = d.data.array.filter(_ => _);
                        if (d.data.vars.page == 1) d.data.array.shift();
                        const msg = d.data.array.slice(s, n).map((str, i) => "[" + Math.floor(i + s + 2) + "]. " + str.replace(/\\n/g, "")).join("\\n") 
                        d.data.array.length > n * d.data.vars.page ? msg + "\\nAnd " + Math.floor(d.data.array.length - n) + " more..." : msg || "There's no more songs after this one! Add some:)";
                    ;yes]
        ]
        $footer[Page $get[page]]
        $color[#e3b5d9]
        $textSplit[$queue[$get[page];10000;{title}$clientId];$clientId]
        $onlyIf[$queue[$get[page];15;{title}]!=;There's not that many pages!]
        $onlyIf[$get[page]>0;That's an invalid page number!{delete:5s}]
        
        $if[$message==]
            $let[page;1]
        $else    
            $let[page;$message[1]]
        $endif
    $else
        $title[Queue empty. | $serverName]
        $thumbnail[$userAvatar[$clientId]]
        $description[There's no songs in the queue, use $getServerVar[prefix]play to add a song!]
        $footer[Page 1]
        $color[#e3b5d9]
    $endif
    `
};