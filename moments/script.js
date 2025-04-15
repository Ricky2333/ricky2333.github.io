document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const addMomentBtn = document.getElementById('add-moment-btn');
    const momentModal = document.getElementById('moment-modal');
    const closeBtn = document.querySelector('.close-btn');
    const momentForm = document.getElementById('moment-form');
    const momentsContainer = document.getElementById('moments-container');
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const uploadBtn = document.querySelector('.upload-btn');

    // 初始数据
    let moments = JSON.parse(localStorage.getItem('moments')) || [
        // {
        //     id: 1,
        //     username: 'Ricky',
        //     // avatar: 'assets/placeholder.jpg',
        //     avatar: "https://ricky-typora-notes.oss-cn-hangzhou.aliyuncs.com/Avatar2.jpg",
        //     content: '这是我的第一条朋友圈动态！\n点击图片可以查看原始比例~',
        //     images: [
        //         'https://picsum.photos/id/10/800/600',
        //         'https://picsum.photos/id/11/800/600',
        //         'https://picsum.photos/id/12/800/600',
        //         'https://picsum.photos/id/13/800/600'
        //     ],
        //     location: '📍 北京',
        //     timestamp: new Date('2023-05-15T10:30:00').getTime()
        // },
        {
            id: 1,
            username: 'Ricky',
            avatar: "https://ricky-typora-notes.oss-cn-hangzhou.aliyuncs.com/Avatar2.jpg",
            // avatar: 'assets/placeholder.jpg',
            content: '你好，上海!',
            images: ['https://ricky-typora-notes.oss-cn-hangzhou.aliyuncs.com/9a271e742eeef880253b67b28d5d3f48.PNG'],
            location: '上海 · 北外滩',
            timestamp: new Date('2025-03-28T20:20:00').getTime()
        },
        {
            id: 2,
            username: 'Ricky',
            avatar: "https://ricky-typora-notes.oss-cn-hangzhou.aliyuncs.com/Avatar2.jpg",
            // avatar: 'assets/placeholder.jpg',
            content: '2020.10 ～ 2024.6\n从ZJNU毕业啦🎓',
            images: [
                'https://ricky-typora-notes.oss-cn-hangzhou.aliyuncs.com/47ae4a7aa5b79efe363a586b7ffbf661.PNG',
                'https://ricky-typora-notes.oss-cn-hangzhou.aliyuncs.com/5812e1c949a89cb952ddea015013055b.PNG',
                'https://ricky-typora-notes.oss-cn-hangzhou.aliyuncs.com/c5c47e10f8ea9ad0528c01d87ab8680a.PNG',
            ],
            location: '浙江 · 金华 · 浙江师范大学',
            timestamp: new Date('2024-06-18T15:00:00').getTime()
        }
    ];

    // 初始化
    function init() {
        renderMoments();
        setupEventListeners();
    }

    // 设置事件监听
    function setupEventListeners() {
        addMomentBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        
        momentModal.addEventListener('click', (e) => {
            if (e.target === momentModal) closeModal();
        });

        imageInput.addEventListener('change', handleImageUpload);
        momentForm.addEventListener('submit', handleFormSubmit);
    }

    // 渲染所有动态
    function renderMoments() {
        momentsContainer.innerHTML = '';
        
        if (moments.length === 0) {
            momentsContainer.innerHTML = `
                <div class="empty-state">
                    <p>还没有动态，点击右上角"+"发布第一条</p>
                </div>
            `;
            return;
        }

        const sortedMoments = [...moments].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedMoments.forEach(moment => {
            const momentElement = createMomentElement(moment);
            momentsContainer.appendChild(momentElement);
        });

        initViewers();
    }

    // 创建单个动态元素
    function createMomentElement(moment) {
        const momentCard = document.createElement('div');
        momentCard.className = 'moment-card';
        momentCard.dataset.id = moment.id;
        
        // 头部信息
        momentCard.innerHTML = `
            <div class="moment-header">
                <img src="${moment.avatar}" alt="头像" class="avatar">
                <div class="user-info">
                    <div class="username">${moment.username}</div>
                    <div class="timestamp">${formatTime(moment.timestamp)}</div>
                </div>
            </div>
            <div class="moment-content">${moment.content}</div>
        `;
        
        // 图片部分
        if (moment.images && moment.images.length > 0) {
            const imagesContainer = document.createElement('div');
            imagesContainer.className = 'moment-images';
            
            // 创建隐藏的原始比例图片容器
            const viewerImages = document.createElement('div');
            viewerImages.className = 'viewer-images';
            
            // 根据图片数量设置不同布局
            if (moment.images.length === 1) {
                imagesContainer.classList.add('grid-1');
                imagesContainer.innerHTML = `
                    <div class="image-square-container">
                        <img src="${moment.images[0]}" alt="动态图片" class="square-image">
                    </div>
                `;
                viewerImages.innerHTML = `
                    <img src="${moment.images[0]}" alt="原始比例图片">
                `;
            } else if (moment.images.length <= 4) {
                imagesContainer.classList.add('grid-2');
                moment.images.forEach(img => {
                    imagesContainer.innerHTML += `
                        <div class="image-square-container">
                            <img src="${img}" alt="动态图片" class="square-image">
                        </div>
                    `;
                    viewerImages.innerHTML += `
                        <img src="${img}" alt="原始比例图片">
                    `;
                });
            } else {
                imagesContainer.classList.add('grid-3');
                moment.images.forEach(img => {
                    imagesContainer.innerHTML += `
                        <div class="image-square-container">
                            <img src="${img}" alt="动态图片" class="square-image">
                        </div>
                    `;
                    viewerImages.innerHTML += `
                        <img src="${img}" alt="原始比例图片">
                    `;
                });
            }
            
            imagesContainer.appendChild(viewerImages);
            momentCard.appendChild(imagesContainer);
        }
        
        // 地点
        if (moment.location) {
            const locationElement = document.createElement('div');
            locationElement.className = 'location';
            locationElement.innerHTML = `
                <i class="fas fa-map-marker-alt"></i>
                <span>${moment.location}</span>
            `;
            momentCard.appendChild(locationElement);
        }
        
        // 操作按钮
        const actionsElement = document.createElement('div');
        actionsElement.className = 'moment-actions';
        actionsElement.innerHTML = `
            <button class="action-btn edit-btn">
                <i class="fas fa-edit"></i> 编辑
            </button>
            <button class="action-btn delete-btn">
                <i class="fas fa-trash-alt"></i> 删除
            </button>
        `;
        momentCard.appendChild(actionsElement);
        
        // 添加事件监听
        const editBtn = momentCard.querySelector('.edit-btn');
        const deleteBtn = momentCard.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => editMoment(moment.id));
        deleteBtn.addEventListener('click', () => deleteMoment(moment.id));
        
        return momentCard;
    }

    // 初始化图片查看器
    function initViewers() {
        document.querySelectorAll('.viewer-images').forEach(container => {
            new Viewer(container, {
                navbar: false,
                title: false,
                toolbar: {
                    zoomIn: 1,
                    zoomOut: 1,
                    oneToOne: 1,
                    reset: 1,
                    prev: 1,
                    play: 0,
                    next: 1,
                    rotateLeft: 1,
                    rotateRight: 1,
                    flipHorizontal: 1,
                    flipVertical: 1,
                },
                viewed(ev) {
                    // 点击列表图片时触发查看器
                    const imgElement = ev.detail.image;
                    const index = Array.from(imgElement.parentNode.children).indexOf(imgElement);
                    this.view(index);
                }
            });
            
            // 将列表中的图片点击事件绑定到查看器
            const parent = container.parentNode;
            parent.querySelectorAll('.square-image').forEach((img, index) => {
                img.addEventListener('click', () => {
                    const viewer = container.viewer;
                    if (viewer) {
                        viewer.view(index);
                    }
                });
            });
        });
    }

    // 格式化时间
    function formatTime(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return '刚刚';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
        
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 打开模态框
    function openModal() {
        momentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // 关闭模态框
    function closeModal() {
        momentModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
    }

    // 重置表单
    function resetForm() {
        momentForm.reset();
        imagePreview.innerHTML = '';
        momentForm.dataset.editing = '';
        momentForm.dataset.id = '';
        updateUploadButtonText(0);
    }

    // 处理图片上传
    function handleImageUpload() {
        const files = imageInput.files;
        const currentCount = imagePreview.querySelectorAll('.preview-image').length;
        const remainingSlots = 9 - currentCount;
        
        if (files.length > remainingSlots) {
            alert(`最多只能上传9张图片，还可以上传${remainingSlots}张`);
            return;
        }
        
        for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
            const file = files[i];
            if (!file.type.match('image.*')) continue;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                addImagePreview(e.target.result, false);
                updateUploadButtonText(currentCount + i + 1);
            };
            reader.readAsDataURL(file);
        }
        
        imageInput.value = '';
    }

    // 添加图片预览
    function addImagePreview(src, isExisting) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'preview-image';
        previewDiv.innerHTML = `
            <img src="${src}" alt="预览图片">
            ${isExisting ? '' : '<button class="remove-image">&times;</button>'}
        `;
        
        if (!isExisting) {
            previewDiv.querySelector('.remove-image').addEventListener('click', (e) => {
                e.stopPropagation();
                previewDiv.remove();
                updateUploadButtonText(imagePreview.querySelectorAll('.preview-image').length);
            });
        }
        
        imagePreview.appendChild(previewDiv);
    }

    // 更新上传按钮文本
    function updateUploadButtonText(count) {
        uploadBtn.innerHTML = `<i class="fas fa-image"></i> 添加图片 (${count}/9)`;
    }

    // 获取表单中的图片数据
    function getFormImages() {
        const images = [];
        const previews = imagePreview.querySelectorAll('.preview-image img');
        
        previews.forEach(preview => {
            images.push(preview.src);
        });
        
        return images;
    }

    // 添加动态
    function addMoment(content, images, location) {
        const newMoment = {
            id: Date.now(),
            username: 'Ricky',
            avatar: 'assets/placeholder.jpg',
            content,
            images,
            location,
            timestamp: Date.now()
        };
        
        moments.push(newMoment);
        saveMoments();
        renderMoments();
    }

    // 编辑动态
    function editMoment(id) {
        const moment = moments.find(m => m.id === id);
        if (!moment) return;
        
        document.getElementById('moment-text').value = moment.content;
        document.getElementById('location-input').value = moment.location ? moment.location.replace('📍 ', '') : '';
        
        imagePreview.innerHTML = '';
        if (moment.images && moment.images.length > 0) {
            moment.images.forEach(img => {
                addImagePreview(img, true);
            });
        }
        
        updateUploadButtonText(moment.images ? moment.images.length : 0);
        momentForm.dataset.editing = 'true';
        momentForm.dataset.id = id;
        openModal();
    }

    // 更新动态
    function updateMoment(id, content, images, location) {
        const momentIndex = moments.findIndex(m => m.id === id);
        if (momentIndex === -1) return;
        
        moments[momentIndex] = {
            ...moments[momentIndex],
            content,
            images,
            location: location ? `📍 ${location}` : '',
            timestamp: Date.now()
        };
        
        saveMoments();
        renderMoments();
    }

    // 删除动态
    function deleteMoment(id) {
        if (!confirm('确定要删除这条动态吗？')) return;
        
        moments = moments.filter(m => m.id !== id);
        saveMoments();
        renderMoments();
    }

    // 保存到本地存储
    function saveMoments() {
        localStorage.setItem('moments', JSON.stringify(moments));
    }

    // 处理表单提交
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const content = document.getElementById('moment-text').value.trim();
        const location = document.getElementById('location-input').value.trim();
        const images = getFormImages();
        
        if (!content && images.length === 0) {
            alert('请填写内容或上传图片');
            return;
        }
        
        const isEditing = momentForm.dataset.editing === 'true';
        const momentId = parseInt(momentForm.dataset.id);
        
        if (isEditing) {
            updateMoment(momentId, content, images, location);
        } else {
            addMoment(content, images, location);
        }
        
        closeModal();
    }

    // 初始化应用
    init();
});