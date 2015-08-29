function initNode(rootElement, contents, initialToggle) {

    var populated;
    var list;

    function populateNode() {
        if (contents.children) {
            list = document.createElement("ul");
            list.style.display = "none";
            rootElement.appendChild(list);
            for (var name in contents.children) {
                var item = document.createElement("li");
                item.innerText = name;
                initNode(item, contents.children[name]);
                list.appendChild(item);
            }
        } else if (contents.members) {
            list = document.createElement("ul");
            list.style.display = "none";
            rootElement.appendChild(list);
            for (var name in contents.members) {
                var item = document.createElement("li");
                item.innerText = name + " (" + contents.members[name].memberKind + ")";
                initMember(item, contents.members[name]);
                list.appendChild(item);
            }
        }
    }

    function toggleNode(e) {
        if (e.srcElement != rootElement) return;

        if (!populated) {
            populated = true;
            populateNode();
        }
        if (list) {
            if (list.style.display == "none") {
                list.style.display = "block";
            } else {
                list.style.display = "none";
            }
        }
        e.cancelBubble = true;
    }

    rootElement.addEventListener("click", toggleNode);
    if (initialToggle) {
        toggleNode({ srcElement: rootElement });
    }
}

function initMember(rootElement, contents) {
    var populated;
    var list;

    function populateNode() {
        list = document.createElement("ul");
        list.style.display = "none";
        rootElement.appendChild(list);
        contents.files.forEach(function (fileIndex) {
            var entry = fileTable[fileIndex];
            var file = dirTable[entry[0]] + "/" + entry[1];
            var item = document.createElement("li");
            var anchor = document.createElement("a");
            anchor.innerText =file;
            anchor.href = "https://github.com/Microsoft/Windows-universal-samples/blob/v1.0.4/Samples/" + file;
            anchor.target = "_blank";
            item.appendChild(anchor);
            list.appendChild(item);
        });
    }

    function toggleNode(e) {
        if (e.srcElement != rootElement) return;

        if (!populated) {
            populated = true;
            populateNode();
        }
        if (list) {
            if (list.style.display == "none") {
                list.style.display = "block";
            } else {
                list.style.display = "none";
            }
        }
        e.cancelBubble = true;
    }
    rootElement.addEventListener("click", toggleNode);
}