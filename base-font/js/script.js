
// 设置按钮下拉菜单延迟隐藏
var btn = document.getElementById("setting-button");
var dropdownMenu = document.querySelector(".setting-button-menu");
var hideTimeout;

// 鼠标进入按钮时显示菜单
btn.addEventListener("mouseenter", function () {
    clearTimeout(hideTimeout);
    dropdownMenu.style.display = "block";
});

// 鼠标离开按钮时延迟隐藏
btn.addEventListener("mouseleave", function () {
    hideTimeout = setTimeout(function () {
        dropdownMenu.style.display = "none";
    }, 200); // 延迟200毫秒
});

// 鼠标进入菜单时清除隐藏定时器
dropdownMenu.addEventListener("mouseenter", function () {
    clearTimeout(hideTimeout);
    dropdownMenu.style.display = "block";
});

// 鼠标离开菜单时隐藏
dropdownMenu.addEventListener("mouseleave", function () {
    dropdownMenu.style.display = "none";
});




// 背景图片选择功能
function loadBackgroundImages() {
    var backgroundSelectContainer = document.querySelector(".background-image-select");
    backgroundSelectContainer.innerHTML = "";

    // 自动检测img目录下的图片
    var imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    var backgroundImages = [];

    // 预定义的背景图片
    var predefinedImages = [
        { name: "背景1", path: "./img/background-mac-1.jpg" },
        { name: "背景1", path: "./img/background-mac-1.jpg" },
        { name: "背景1", path: "./img/background-mac-1.jpg" },
        { name: "背景2", path: "./img/background-mac-2.jpg" }
    ];

    // 添加预定义图片
    predefinedImages.forEach(function (image, index) {
        backgroundImages.push(image);
    });

    // 生成背景图片选择器
    backgroundImages.forEach(function (image, index) {
        var imageItem = document.createElement("div");
        imageItem.className = "background-image-item";
        imageItem.innerHTML = `
            <img src="${image.path}" alt="${image.name}" data-path="${image.path}">
            <span>${image.name}</span>
        `;
        backgroundSelectContainer.appendChild(imageItem);

        // 添加点击事件
        imageItem.addEventListener("click", function () {
            var backgroundImage = document.querySelector(".background-image");
            backgroundImage.src = image.path;
        });
    });
}

// 上传背景图片功能
var uploadButton = document.getElementById("upload-button-background");
if (uploadButton) {
    uploadButton.addEventListener("click", function () {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = function (e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var backgroundImage = document.querySelector(".background-image");
                    backgroundImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
}

// 页面加载时加载背景图片 初始化数据库
window.onload = function () {
    loadBackgroundImages();

};
