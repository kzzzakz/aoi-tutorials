module.exports = {
	name: "avatar",
	type: "interaction",
	prototype: "slash",
	code: `$interactionReply[;{newEmbed:
        {title:🌸 Avatar of $usertag[$get[ID]] - ♡}
		{description:> ID: **$get[ID]**\n> Status: **$toLocaleUpperCase[$status[$get[ID]]]**}
		{image:https://$get[URL]}
		{color:$replaceText[$replaceText[$replaceText[$replaceText[$status[$get[ID]];offline;202225];idle;faa81a];dnd;ed4245];online;3ba55d]}
    };{actionRow:
      {button:PNG:5:https\\://$replaceText[$get[URL];gif;png]:no}
	  {button:GIF:$if[$checkContains[$get[URL];.gif]==true;link;secondary]:https\\:$if[$checkContains[$get[URL];.gif]==true;//$get[URL];secret]:$if[$checkContains[$get[URL];.gif]==true;no;yes]}
    }]
	$let[URL;$splitText[2]]
	$textSplit[$userAvatar[$get[ID]];//]
	$let[ID;$if[$interactionData[options.data[0].value]==undefined;$interactionData[author.id];$interactionData[options.data[0].value]]]
	`
};
