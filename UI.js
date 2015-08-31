function ApiNode(rootElement, contents) {
    this.contents = contents;
    this.element = rootElement;
    this.populated = false;
    this.list = null;

    if (contents) {
        contents.node = this;
        rootElement.addEventListener("click", ApiNode.prototype.toggleNodeHandler.bind(this));
    }
}

ApiNode.prototype.ensurePopulated = function ensurePopulated() {
    if (!this.populated) {
        this.populated = true;
        this.populateNode();
    }
};

ApiNode.prototype.openNode = function openNode() {
    this.ensurePopulated();
    this.list.style.display = "block";
};

ApiNode.prototype.toggleNode = function toggleNode() {
    this.ensurePopulated();
    if (this.list) {
        if (this.list.style.display == "none") {
            this.list.style.display = "block";
        } else {
            this.list.style.display = "none";
        }
    }
};

ApiNode.prototype.toggleNodeHandler = function toggleNodeHandler(e) {
    if (e.srcElement != this.element) return;
    this.toggleNode();
    e.cancelBubble = true;
};

function ContainerNode(rootElement, contents) {
    ApiNode.call(this, rootElement, contents);
}

ContainerNode.prototype = new ApiNode;

ContainerNode.prototype.populateNode = function populateNode() {
    if (this.contents.children) {
        this.list = document.createElement("ul");
        this.list.style.display = "none";
        this.element.appendChild(this.list);
        for (var name in this.contents.children) {
            var item = document.createElement("li");
            item.innerText = name;
            new ContainerNode(item, this.contents.children[name]);
            this.list.appendChild(item);
        }
    } else if (this.contents.members) {
        this.list = document.createElement("ul");
        this.list.style.display = "none";
        this.element.appendChild(this.list);
        for (var name in this.contents.members) {
            var item = document.createElement("li");
            item.innerText = name + " (" + this.contents.members[name].memberKind + ")";
            new MemberNode(item, this.contents.members[name]);
            this.list.appendChild(item);
        }
    }
};

function MemberNode(rootElement, contents) {
    ApiNode.call(this, rootElement, contents);
};

MemberNode.prototype = new ApiNode;

MemberNode.prototype.populateNode = function populateNode() {
    this.list = document.createElement("ul");
    this.list.style.display = "none";
    this.element.appendChild(this.list);
    this.contents.files.forEach(function (fileIndex) {
        var entry = fileTable[fileIndex];
        var file = dirTable[entry[0]] + "/" + entry[1];
        var item = document.createElement("li");
        var anchor = document.createElement("a");
        anchor.innerText =file;
        anchor.href = "https://github.com/Microsoft/Windows-universal-samples/blob/v1.0.4/Samples/" + file;
        anchor.target = "_blank";
        item.appendChild(anchor);
        this.list.appendChild(item);
    }, this);
};

function autoNavigate(target) {
    var pieces = target.split(".");
    var current = contents;
    contents.node.openNode();
    pieces.forEach(function (name) {
        if (current) {
            if (current.children) {
                current = current.children[name];
            } else if (current.members) {
                current = current.members[name];
            }
        }
        if (current) {
            current.node.openNode();
        }
    }, this);
}
