//********************************************************* */


let db;
const dbName = "liheEngineDB";
const storeName = "href";

// 初始化数据库
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                const objectStore = db.createObjectStore(storeName, { keyPath: 'name' });
                objectStore.createIndex('name', 'name', { unique: true });
                console.log("数据库和对象存储空间创建成功");
            }
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

//*********************************** */






// 读取快捷方式
async function generateHrefItems() {
    try {
        if (!db) await initDB();

        const transaction = db.transaction([storeName], 'readonly');
        const objectStore = transaction.objectStore(storeName);

        // 先检查数量
        const countRequest = objectStore.count();
        countRequest.onsuccess = function () {   // 回调容易出错
            const count = countRequest.result;
            console.log("对象存储中的记录数:", count);
            if (count === 0) {
                console.log("对象存储空间为空");
                return;
            } else {
                // 获取所有数据
                const getRequest = objectStore.getAll();
                getRequest.onsuccess = function (event) {
                    const data = event.target.result;
                    console.log("从 IndexedDB 读取的数据:", data);

                    // 在页面显示数据

                    document.getElementById("href-container").innerHTML = data.map(item =>
                        `<div class="href-item">
        <button class="href-item-button">
            <a href="${item.url}" target="_blank">
                <img src="${item.image}" height="30" width="30">
            </a>
        </button>
        <text>${item.name}</text>
    </div>`
                    ).join('');


                    // 如果 href-item-upload 是一个模板
                    const uploadHTML = `
        <div class="href-item">
            <button class="href-item-button" id="href-item-upload">
                <svg t="1773556811296" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="5847" width="200" height="200">
                    <path
                        d="M512.17594 1023.648121c-29.52585 0-58.347943-6.397801-58.347943-37.395145V564.030115H37.459123c-23.76783 0-37.459123-22.392303-37.459123-51.182406 0-26.614851 10.076536-51.790197 35.187904-51.790198h425.005904V43.888913c0-28.054356 20.888819-43.888913 51.854176-43.888913 28.790103 0 51.182406 12.795602 51.182406 37.395145v416.49683h430.156133c28.790103 0 30.261598 34.516135 30.261598 58.283965s-7.933273 51.182406-36.723376 51.182406H563.326357v422.926619c0.735747 24.40761-21.592578 37.363156-51.150417 37.363156z"
                        fill="#2C2C2C" p-id="5848"></path>
                </svg>
            </button>
            <text>添加快捷方式</text>
        </div>`;

                    // 直接插入HTML
                    document.getElementById("href-container").insertAdjacentHTML('beforeend', uploadHTML);
                };
            }
        };

    } catch (error) {
        console.error("读取失败:", error);
    }
}



// 添加快捷方式数据到IndexedDB
async function addHrefItem() {
    // 设置按钮下拉菜单延迟隐藏
    var hrefItemUpdata = document.getElementById("href-item-upload");
    var hrefItemMenu = document.getElementById("href-item-menu-upload");
    var goOutMenu = document.getElementById("go-out-menu");
    

    // 鼠标进入按钮时显示菜单
    hrefItemUpdata.addEventListener("click", function () {
        hrefItemMenu.style.display = "block";
    });

    goOutMenu.addEventListener("click", function () {
        hrefItemMenu.style.display = "none";
    });

    const formUpload = document.getElementById("upload-form");

    // 移除现有的事件监听器（避免重复添加）
    formUpload.removeEventListener("submit", handleSubmit);

    // 添加新的事件监听器
    formUpload.addEventListener("submit", handleSubmit);

    async function handleSubmit(event) {
        event.preventDefault(); // 防止表单默认提交行为

        const name = document.getElementById("upload-input-name").value.trim();
        let url = document.getElementById("upload-input-url").value.trim();

        console.log("addHrefItem()-提交表单数据", name, url);

        try {
            if (!db) await initDB();

            const transaction = db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);

            // 创建要存储的数据对象
            const item = {
                name: name,
                url: url,
                image: url + "/favicon.ico"
            };

            console.log("存入数据:", item);

            // 添加新数据
            const request = objectStore.add(item);

            request.onsuccess = function () {
                console.log("数据添加成功");
                alert("数据已成功存储到 IndexedDB！");

                // 清空表单
                document.getElementById("upload-input-name").value = '';
                document.getElementById("upload-input-url").value = '';

                // 可选：刷新显示
                generateHrefItems();
            };

            request.onerror = function (event) {
                console.error("存储失败:", event.target.error);
                if (event.target.error.name === "ConstraintError") {
                    alert("该名称已存在，请使用其他名称！");
                } else {
                    alert("存储失败: " + event.target.error.message);
                }
            };

        } catch (error) {
            console.error("操作失败:", error);
            alert("操作失败: " + error.message);
        }
    }
}



// 页面加载时生成快捷方式
window.onload = function () {
    initDB().then(() => {
        console.log("数据库初始化成功");
        
        generateHrefItems();
        // 等会再添加事件 没招了
        setTimeout(() => {
            addHrefItem(); // 初始化表单事件
        }, 5000);
    }).catch(error => {
        console.error("数据库初始化失败:", error);
    });
};
