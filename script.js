const NAME = "Jordan";
const WELCOME_MESSAGE_TEMPLATE = ["Night", "Morning", "Afternoon", "Evening"];

// All shortcuts are in a `SHORTCUT_STARTER+shortcutKey` format. 
// So, for example, pressing `tab+q` would redirect you to https://google.com/?q=q
const SHORTCUT_STARTER = 'tab' 

// How much time (in milliseconds) you have to press shortcutKey after pressing SHORTCUT_STARTER.
// Also change --SHORTCUT_TIMEOUT in styles.css if you change this option.
const SHORTCUT_TIMEOUT = 1500;

// The groups of links are generated from this object. Edit it to edit the page's contents.
// shortcutKey must hold an all-lowercase single button. Theoretically should work with values like `esc` and `f1`,
// but intended to be used with just regular latin letters.
const MASTER_MAP = [
    {
        "groupName": "Life",
        "items":[
            {"name": "Gmail", "shortcutKey": "q", "url": "https://gmail.com"},
            {"name": "Maps", "shortcutKey": "w", "url": "https://google.com/maps"},
            {"name": "NPR", "shortcutKey": "e", "url": "https://npr.org"},
            {"name": "Messages", "shortcutKey": "m", "url": "https://messages.google.com/web/conversations?redirected=true"},
            {"name": "ToDo", "shortcutKey": "r", "url": "https://www.rememberthemilk.com/app"},
            {"name": "Topline", "shortcutKey": "b", "url": "https://my.toplinecu.com/DashboardV2"},
            {"name": "Torrents", "url": "https://torrents-csv.ml/#/"},
            {"name": "Mail", "url": "https://informeddelivery.usps.com/box/pages/secure/DashboardAction_input.action?restart=1"}
        ]
    },
    {
        "groupName": "Tech",
        "items":[
            {"name": "Amazon", "shortcutKey": "a", "url": "https://smile.amazon.com/ref=nav_logo"},
            {"name": "GitHub", "shortcutKey": "s", "url": "https://github.com/Penguin511/penguin511.github.com"},
            {"name": "Drive", "shortcutKey": "p", "url": "https://drive.google.com/drive/u/0/my-drive"},
            {"name": "Nextcloud", "url": "https://jordanlutter.net/index.php/apps/files/?dir=/&fileid=6"}
        ]
    },
    {
        "groupName": "Fun",
        "items":[
            {"name": "Reddit", "shortcutKey": "z", "url": "https://reddit.com"},
            {"name": "Youtube", "shortcutKey": "x", "url": "https://www.youtube.com/feed/subscriptions"},
            {"name": "Crossword", "shortcutKey": "c", "url": "https://www.nytimes.com/crosswords"},
            {"name": "PiHole", "url": "http://192.168.86.138/admin/index.php"},
            {"name": "Simplenote", "url": "https://app.simplenote.com/"},
            {"name": "Plex", "url": "https://192.168.86.132:32400/web/index.html#"}
        ]
    }
]

let $container = document.getElementById("content");
let getUrl = {};

let $shortcutDisplayList = document.getElementsByClassName("shortcut");
let listeningForShortcut = false;
let listenerTimeout;

function setupWelcomeMessage(){
    let curHours = new Date().getHours();
    curHours = Math.floor(curHours/6); // Simply dividing current hours by 6 proves to be a good enough aproximation.
    if (curHours == 4) curHours = 3;
    let welcome = "Good " + WELCOME_MESSAGE_TEMPLATE[curHours] + ", " + NAME;
    document.getElementById("welcome-string").innerHTML = welcome;
}

function setupGroups(){
    for (let i = 0; i < MASTER_MAP.length; i++){
        let curGroupData = MASTER_MAP[i];

        let group = document.createElement("div");
        group.className = "group";
        $container.appendChild(group);

        let header = document.createElement("h1");
        header.innerHTML = curGroupData.groupName;
        group.appendChild(header);

        for (let j = 0; j < curGroupData.items.length; j++){
            let curItemData = curGroupData.items[j];

            let pContainer = document.createElement("p");
            group.appendChild(pContainer);

            let link = document.createElement("a");
            link.innerHTML = curItemData.name;
            link.setAttribute("href", curItemData.url);
            pContainer.appendChild(link);

            let shortcutDisplay = document.createElement("span");
            shortcutDisplay.innerHTML = curItemData.shortcutKey;
            shortcutDisplay.className = "shortcut";
            shortcutDisplay.style.animation = "none";
            pContainer.appendChild(shortcutDisplay);

            getUrl[curItemData.shortcutKey] = curItemData.url
        }
    }
}

function shortcutListener(e) {
    let key = e.key.toLowerCase();

    if (listeningForShortcut && getUrl.hasOwnProperty(key)){
        window.location = getUrl[key];
    }

    if (key === SHORTCUT_STARTER) {
        clearTimeout(listenerTimeout);
        listeningForShortcut = true;

        // Animation reset
        for (let i = 0; i < $shortcutDisplayList.length; i++){
            $shortcutDisplayList[i].style.animation = "none";
            setTimeout(function() { $shortcutDisplayList[i].style.animation = ''; }, 10);
        }

        listenerTimeout = setTimeout(function(){ listeningForShortcut = false; }, SHORTCUT_TIMEOUT);
    }
}

function main(){
    setupWelcomeMessage();
    setupGroups();
    document.addEventListener('keyup', shortcutListener, false);
}

main();
